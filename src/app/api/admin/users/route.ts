import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  const where: Record<string, unknown> = { role: 'USER' }

  if (status && status !== 'ALL') {
    where.status = status
  }

  if (search) {
    where.OR = [
      { email: { contains: search } },
      { name: { contains: search } },
    ]
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      role: true,
      subscriptionStart: true,
      subscriptionEnd: true,
      addedToWorkspace: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return NextResponse.json({ users })
}

export async function POST(request: Request) {
  try {
    const adminId = request.headers.get('x-user-id')!
    const body = await request.json()

    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre zorunludur' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kayıtlı' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'USER',
        status: 'PENDING',
      },
    })

    // Log
    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'USER_CREATED',
        targetUserId: user.id,
        details: `Kullanıcı oluşturuldu: ${email}`,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Kullanıcı oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}
