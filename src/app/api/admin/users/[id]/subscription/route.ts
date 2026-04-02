import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addMonths } from '@/lib/subscription'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const adminId = request.headers.get('x-user-id')!
    const body = await request.json()
    const { months } = body

    if (!months || months < 1 || months > 12) {
      return NextResponse.json(
        { error: 'Geçerli bir süre giriniz (1-12 ay)' },
        { status: 400 }
      )
    }

    const now = new Date()
    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    // If user already has active subscription, extend from current end date
    let startDate = now
    if (user.subscriptionEnd && user.subscriptionEnd > now && user.status === 'ACTIVE') {
      startDate = user.subscriptionEnd
    }

    const endDate = addMonths(startDate, months)

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        subscriptionStart: user.subscriptionStart || now,
        subscriptionEnd: endDate,
        status: 'ACTIVE',
      },
    })

    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'SUBSCRIPTION_ASSIGNED',
        targetUserId: id,
        details: `${months} aylık abonelik atandı. Bitiş: ${endDate.toISOString()}`,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Subscription assign error:', error)
    return NextResponse.json(
      { error: 'Abonelik atanırken bir hata oluştu' },
      { status: 500 }
    )
  }
}
