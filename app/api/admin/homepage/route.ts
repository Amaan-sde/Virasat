import { NextRequest, NextResponse } from 'next/server';
import { getHomepageSections, updateHomepageSection, reorderHomepageSections, createAuditLog } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'DEVELOPER' && user.role !== 'CLIENT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const sections = await getHomepageSections(false);
    return NextResponse.json({ sections });
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
    const { id, title, subtitle, content, isVisible, displayOrder } = body;

    if (!id) {
      return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });
    }

    const updated = await updateHomepageSection(id, {
      title,
      subtitle,
      content,
      isVisible,
      displayOrder
    });

    if (!updated) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    await createAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_HOMEPAGE_SECTION',
      entity: 'HOMEPAGE_SECTION',
      entityId: id,
      details: { title: updated.title, isVisible: updated.isVisible }
    });

    return NextResponse.json({ success: true, section: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'DEVELOPER' && user.role !== 'CLIENT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await req.json();
    const { sectionIds } = body;

    if (!Array.isArray(sectionIds)) {
      return NextResponse.json({ error: 'sectionIds must be an array' }, { status: 400 });
    }

    await reorderHomepageSections(sectionIds);

    await createAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'REORDER_HOMEPAGE_SECTIONS',
      entity: 'HOMEPAGE_SECTION',
      details: { order: sectionIds }
    });

    return NextResponse.json({ success: true, message: 'Sections reordered' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

