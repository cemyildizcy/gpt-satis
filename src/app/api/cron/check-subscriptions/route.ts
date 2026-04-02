import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()

    // Find active users whose subscription has expired
    const expiredUsers = await prisma.user.updateMany({
      where: {
        status: 'ACTIVE',
        subscriptionEnd: {
          lt: now,
        },
      },
      data: {
        status: 'EXPIRED',
      },
    })

    console.log(`[CRON] ${expiredUsers.count} kullanıcının aboneliği sona erdi`)

    // Check users about to expire (within 3 days)
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    const expiringUsers = await prisma.user.findMany({
      where: {
        status: 'ACTIVE',
        subscriptionEnd: {
          gt: now,
          lt: threeDaysFromNow,
        },
      },
      select: { email: true, subscriptionEnd: true },
    })

    if (expiringUsers.length > 0) {
      console.log(
        `[CRON] ${expiringUsers.length} kullanıcının aboneliği 3 gün içinde sona erecek:`,
        expiringUsers.map((u) => u.email)
      )
      // TODO: Send email notifications
    }

    return NextResponse.json({
      expired: expiredUsers.count,
      expiring: expiringUsers.length,
    })
  } catch (error) {
    console.error('[CRON] Error:', error)
    return NextResponse.json(
      { error: 'Cron job hatası' },
      { status: 500 }
    )
  }
}
