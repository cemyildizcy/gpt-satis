import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const adminId = request.headers.get('x-user-id')!
    const body = await request.json()
    const { addedToWorkspace } = body

    const user = await prisma.user.update({
      where: { id },
      data: { addedToWorkspace },
    })

    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'WORKSPACE_UPDATED',
        targetUserId: id,
        details: `Workspace durumu: ${addedToWorkspace ? 'Eklendi' : 'Kaldırıldı'}`,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Workspace update error:', error)
    return NextResponse.json(
      { error: 'Workspace durumu güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
