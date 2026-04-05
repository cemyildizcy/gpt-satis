import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAnnouncementEmail } from '@/lib/mail'

export async function POST(request: Request) {
  try {
    const { target, title, message, sendEmail } = await request.json()

    if (!title || !message) {
      return new NextResponse('Başlık ve mesaj zorunludur.', { status: 400 })
    }

    // Determine target users
    let whereClause = {}
    if (target === 'ACTIVE') {
      whereClause = { status: 'ACTIVE' }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: { id: true, email: true, name: true }
    })

    if (users.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: 'Bu kritere uygun kullanıcı bulunamadı.' })
    }

    // Create notifications in bulk
    const notificationData = users.map(u => ({
      userId: u.id,
      title,
      message
    }))

    await prisma.notification.createMany({
      data: notificationData
    })

    // Send emails if requested
    let emailCount = 0
    if (sendEmail) {
      for (const user of users) {
        if (user.email) {
          // Fire and forget so we don't hold the request too long
          // But ideally in a large system it should be queued.
          // Since it's a small app, this is fine.
          sendAnnouncementEmail(user.email, user.name || '', title, message).catch(() => {})
          emailCount++
        }
      }
    }

    // Log the action
    const sysAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    if (sysAdmin) {
      await prisma.adminLog.create({
        data: {
          adminId: sysAdmin.id,
          action: 'SEND_ANNOUNCEMENT',
          details: `Sent "${title}" to ${users.length} users. target=${target}, sendEmail=${sendEmail}`
        }
      })
    }

    return NextResponse.json({ success: true, notifCount: users.length, emailCount })
  } catch (error) {
    console.error('Announcement API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
