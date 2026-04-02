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
      addedToWorkspace: true,
      createdAt: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  }

  return NextResponse.json({ user })
}
