import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const userId = request.headers.get('x-user-id')!

  const payments = await prisma.payment.findMany({
    where: { userId },
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
  })

  return NextResponse.json({ payments })
}
