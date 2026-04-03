import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const userId = request.headers.get('x-user-id')!
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      subscriptionStart: true,
      subscriptionEnd: true,
      createdAt: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  }

  return NextResponse.json({ user })
}

export async function PUT(request: Request) {
  try {
    const userId = request.headers.get('x-user-id')!
    const body = await request.json()
    const { name } = body

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'İsim en az 2 karakter olmalıdır' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        subscriptionStart: true,
        subscriptionEnd: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Profile update error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
