import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { getUserFromRequest } from '@/lib/auth';
import { getDatabaseStatus, getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'DEVELOPER') {
      return NextResponse.json({ error: 'Unauthorized: Developer role required' }, { status: 403 });
    }

    await getDb();
    const dbStatus = getDatabaseStatus();

    const dbPath = path.join(process.cwd(), 'data', 'virasat.db');
    let dbSize = 0;
    if (fs.existsSync(dbPath)) {
      dbSize = fs.statSync(dbPath).size;
    }

    const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
    let uploadFilesCount = 0;
    if (fs.existsSync(uploadsPath)) {
      uploadFilesCount = fs.readdirSync(uploadsPath).length;
    }

    const memory = process.memoryUsage();

    return NextResponse.json({
      success: true,
      diagnostics: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptimeSeconds: Math.floor(process.uptime()),
        memory: {
          rssMb: Math.round(memory.rss / (1024 * 1024)),
          heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
          heapTotalMb: Math.round(memory.heapTotal / (1024 * 1024))
        },
        database: {
          type: dbStatus.activeDriver === 'postgres' ? 'PostgreSQL (Supabase)' : 'SQLite3 (node:sqlite)',
          host: dbStatus.postgresHost,
          database: dbStatus.postgresDatabase,
          fileLocation: dbStatus.activeDriver === 'sqlite' ? dbPath : undefined,
          sizeKb: dbStatus.activeDriver === 'sqlite' ? Math.round(dbSize / 1024) : undefined,
          status: 'HEALTHY'
        },
        storage: {
          uploadsCount: uploadFilesCount,
          directory: uploadsPath
        },
        systemLoad: os.loadavg()
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

