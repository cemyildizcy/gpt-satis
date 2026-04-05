import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendExpiringSoonEmail, sendSubscriptionExpiredEmail } from '@/lib/mail'

export async function GET(request: Request) {
  // Option to secure the cron job (e.g. VERCEL_CRON_SECRET)
  // Vercel cron passes a Bearer token
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const now = new Date()

    // 1. Process EXPIRED users
    const expiredUsersList = await prisma.user.findMany({
      where: {
        status: 'ACTIVE',
        subscriptionEnd: { lt: now },
      }
    })

    let expiredCount = 0;
    for (const user of expiredUsersList) {
      // Update status and remove workspace
      await prisma.user.update({
        where: { id: user.id },
        data: { status: 'EXPIRED', workspaceId: null }
      })

      // Create Notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: '⌛ Aboneliğiniz Sona Erdi',
          message: 'AIPass aboneliğinizin süresi doldu ve erişiminiz kesildi. Tüm özelliklere yeniden erişmek için paneli ziyaret edin.'
        }
      })

      // Send Email
      if (user.email) {
        sendSubscriptionExpiredEmail(user.email, user.name || '').catch(()=> {})
      }
      
      // Log for admin
      const sysAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
      if (sysAdmin) {
        await prisma.adminLog.create({
          data: {
            adminId: sysAdmin.id,
            action: 'CRON_EXPIRE_USER',
            details: `User ${user.email} (ID: ${user.id}) expired automatically. Workspace unassigned.`
          }
        })
      }
      expiredCount++
    }

    console.log(`[CRON] ${expiredCount} kullanıcının aboneliği sona erdi`)

    // 2. Process EXPIRING SOON users
    // If this cron runs every 24 hours, users expiring between 48h and 72h from now should be notified (approx 3 days).
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
    
    const expiringUsers = await prisma.user.findMany({
      where: {
        status: 'ACTIVE',
        subscriptionEnd: {
          gt: twoDaysFromNow,
          lte: threeDaysFromNow,
        },
      }
    })

    let expiringCount = 0;
    for (const user of expiringUsers) {
      // Create Notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: '⏳ Aboneliğiniz Yakında Bitecek',
          message: `Aboneliğinin bitmesine yaklaşık 3 gün kaldı. Erişimin kesintiye uğramaması için süreniz dolmadan yenileme yapabilirsiniz.`
        }
      })

      // Send Email
      if (user.email) {
        sendExpiringSoonEmail(user.email, user.name || '', 3).catch(()=> {})
      }
      expiringCount++
    }

    if (expiringCount > 0) {
      console.log(`[CRON] ${expiringCount} kullanıcının aboneliği 3 gün içinde sona erecek.`)
    }

    return NextResponse.json({
      expired: expiredCount,
      expiring: expiringCount,
    })
  } catch (error) {
    console.error('[CRON] Error:', error)
    return NextResponse.json(
      { error: 'Cron job hatası' },
      { status: 500 }
    )
  }
}
