import { NextRequest, NextResponse } from 'next/server';
import { getStoreSettings, updateStoreSettings, createAuditLog } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'DEVELOPER' && user.role !== 'CLIENT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const settings = await getStoreSettings();

    // If client, do not expose private infrastructure secrets
    if (user.role === 'CLIENT') {
      const sanitized = {
        ...settings,
        razorpayKeyId: settings.razorpayKeyId ? '••••••••' : ''
      };
      return NextResponse.json({ settings: sanitized, role: user.role });
    }

    return NextResponse.json({ settings, role: user.role });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'DEVELOPER' && user.role !== 'CLIENT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await req.json();

    // Protect sensitive fields if user is CLIENT
    let safeUpdates = { ...body };
    if (user.role === 'CLIENT') {
      delete safeUpdates.razorpayKeyId;
      delete safeUpdates.paymentGatewayConfigured;
    }

    const updated = await updateStoreSettings(safeUpdates);

    await createAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_SETTINGS',
      entity: 'STORE_SETTINGS',
      details: safeUpdates
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

