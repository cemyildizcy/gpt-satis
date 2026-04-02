import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/password'
import { loginSchema } from '@/lib/validators'
import { signToken, setSessionCookie } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = rateLimit(`login:${ip}`, 5, 60 * 1000)
    if (!success) {
      return NextResponse.json(
        { error: 'Çok fazla deneme. Lütfen bir dakika bekleyin.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validation = loginSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email veya şifre hatalı' },
        { status: 401 }
      )
    }

    const isValid = await comparePassword(password, user.passwordHash)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Email veya şifre hatalı' },
        { status: 401 }
      )
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    await setSessionCookie(token)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Giriş sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
}
