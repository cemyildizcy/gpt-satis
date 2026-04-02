import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { userUpdateSchema } from '@/lib/validators'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      role: true,
      subscriptionStart: true,
      subscriptionEnd: true,
      addedToWorkspace: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      payments: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amount: true,
          receiptUrl: true,
          status: true,
          adminNote: true,
          createdAt: true,
          reviewedAt: true,
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  }

  return NextResponse.json({ user })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const adminId = request.headers.get('x-user-id')!

    const body = await request.json()
    const validation = userUpdateSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id },
      data: validation.data,
    })

    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'USER_UPDATED',
        targetUserId: id,
        details: `Kullanıcı güncellendi: ${JSON.stringify(validation.data)}`,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Kullanıcı güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const adminId = request.headers.get('x-user-id')!

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    await prisma.user.delete({ where: { id } })

    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'USER_DELETED',
        targetUserId: id,
        details: `Kullanıcı silindi: ${user.email}`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Kullanıcı silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
