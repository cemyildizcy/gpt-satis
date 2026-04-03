import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return new NextResponse('Unauthorized', { status: 401 })

    const { id: userId } = await params
    const body = await request.json()
    const { workspaceId } = body // If null, it means unassign

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { workspaceId: workspaceId || null }
    })

    await prisma.adminLog.create({
      data: {
        adminId: session.userId,
        action: workspaceId ? 'WORKSPACE_ASSIGNED' : 'WORKSPACE_UNASSIGNED',
        details: workspaceId ? `Hesap atandı: ${workspaceId}` : 'Hesap ataması kaldırıldı',
        targetUserId: userId
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Assign workspace error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
