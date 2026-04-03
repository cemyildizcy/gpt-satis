import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return new NextResponse('Unauthorized', { status: 401 })

    const { id } = await params

    const workspace = await prisma.workspaceAccount.delete({
      where: { id }
    })

    await prisma.adminLog.create({
      data: {
        adminId: session.userId,
        action: 'WORKSPACE_DELETED',
        details: `Ana hesap silindi: ${workspace.email}`
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete workspace error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
