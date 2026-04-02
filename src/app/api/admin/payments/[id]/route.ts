import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { paymentReviewSchema } from '@/lib/validators'
import { addMonths } from '@/lib/subscription'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const adminId = request.headers.get('x-user-id')!

    const body = await request.json()
    const validation = paymentReviewSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { status, adminNote } = validation.data

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Ödeme bulunamadı' }, { status: 404 })
    }

    if (payment.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Bu ödeme zaten işlenmiş' },
        { status: 400 }
      )
    }

    // Update payment
    await prisma.payment.update({
      where: { id },
      data: {
        status,
        adminNote,
        reviewedById: adminId,
        reviewedAt: new Date(),
      },
    })

    // If approved, activate subscription
    if (status === 'APPROVED') {
      const now = new Date()
      const user = payment.user

      let startDate = now
      if (
        user.subscriptionEnd &&
        user.subscriptionEnd > now &&
        user.status === 'ACTIVE'
      ) {
        startDate = user.subscriptionEnd
      }

      const endDate = addMonths(startDate, 1)

      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          subscriptionStart: user.subscriptionStart || now,
          subscriptionEnd: endDate,
          status: 'ACTIVE',
        },
      })
    }

    await prisma.adminLog.create({
      data: {
        adminId,
        action: status === 'APPROVED' ? 'PAYMENT_APPROVED' : 'PAYMENT_REJECTED',
        targetUserId: payment.userId,
        details: `Ödeme ${status === 'APPROVED' ? 'onaylandı' : 'reddedildi'}: ${payment.amount}₺${adminNote ? ` (Not: ${adminNote})` : ''}`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Payment review error:', error)
    return NextResponse.json(
      { error: 'Ödeme işlenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
