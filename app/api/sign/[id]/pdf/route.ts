import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const res = await fetch(`${MANEMUS_URL}/sign/${id}/pdf`, {
      cache: 'no-store',
      headers: { 'ngrok-skip-browser-warning': '1' },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'PDF generation failed' }));
      return NextResponse.json(data, { status: res.status });
    }

    const pdfBuffer = await res.arrayBuffer();
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contract_${id}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}
