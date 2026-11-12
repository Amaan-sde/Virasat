import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function resolveSupabaseStorageConfig() {
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const explicitUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const pgHost = (process.env.PGHOST || '').trim();
  const derivedUrl =
    !explicitUrl && pgHost.startsWith('db.') && pgHost.endsWith('.supabase.co')
      ? `https://${pgHost.slice(3)}`
      : '';
  const supabaseUrl = (explicitUrl || derivedUrl).replace(/\/+$/, '');
  const bucket = (process.env.SUPABASE_STORAGE_BUCKET || 'virasat-media').trim();
  return {
    configured: Boolean(supabaseUrl && serviceRoleKey),
    supabaseUrl,
    serviceRoleKey,
    bucket
  };
}

async function uploadToSupabaseStorage(
  supabaseUrl: string,
  serviceRoleKey: string,
  bucket: string,
  filename: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const objectUrl = `${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${encodeURIComponent(filename)}`;
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': contentType,
    'x-upsert': 'true'
  };

  let res = await fetch(objectUrl, { method: 'POST', headers, body: new Uint8Array(buffer) });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    if (res.status === 404 || errText.toLowerCase().includes('bucket not found')) {
      await fetch(`${supabaseUrl}/storage/v1/bucket`, {
        method: 'POST',
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: bucket, name: bucket, public: true })
      });
      res = await fetch(objectUrl, { method: 'POST', headers, body: new Uint8Array(buffer) });
    } else {
      throw new Error(`Supabase Storage error (${res.status}): ${errText || res.statusText}`);
    }
  }

  if (!res.ok) {
    const retryErr = await res.text().catch(() => '');
    throw new Error(`Supabase Storage upload failed (${res.status}): ${retryErr || res.statusText}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodeURIComponent(filename)}`;
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'DEVELOPER' && user.role !== 'CLIENT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required to upload' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || '.jpg';
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '') || 'image';
    const filename = `${cleanBase}-${Date.now()}${ext}`;

    const storage = resolveSupabaseStorageConfig();
    if (storage.configured) {
      const publicUrl = await uploadToSupabaseStorage(
        storage.supabaseUrl,
        storage.serviceRoleKey,
        storage.bucket,
        filename,
        buffer,
        file.type
      );
      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename,
        size: file.size,
        mimeType: file.type,
        storage: 'supabase'
      });
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            'Local disk uploads are not persistent on Vercel. Please paste an image URL directly, or set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel Environment Variables.'
        },
        { status: 503 }
      );
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      mimeType: file.type,
      storage: 'local'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'File upload failed' }, { status: 500 });
  }
}

