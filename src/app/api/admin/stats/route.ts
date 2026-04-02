import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const [totalUsers, activeUsers, expiredUsers, pendingUsers, pendingPayments] =
    await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({ where: { role: 'USER', status: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'USER', status: 'EXPIRED' } }),
      prisma.user.count({ where: { role: 'USER', status: 'PENDING' } }),
      prisma.payment.count({ where: { status: 'PENDING' } }),
    ])

  return NextResponse.json({
    stats: {
      totalUsers,
      activeUsers,
      expiredUsers,
      pendingUsers,
      pendingPayments,
    },
  })
}
