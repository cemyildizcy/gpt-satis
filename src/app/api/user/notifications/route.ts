import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return new NextResponse('Unauthorized', { status: 401 })

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Fetch notifications error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return new NextResponse('Unauthorized', { status: 401 })

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    })

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('Mark read error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
