import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  const where: Record<string, unknown> = {}
  if (status && status !== 'ALL') {
    where.status = status
  }

  const payments = await prisma.payment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
        },
      },
      reviewedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  return NextResponse.json({ payments })
}
