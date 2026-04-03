import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { ticketSchema } from '@/lib/validators'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    const tickets = await prisma.ticket.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Fetch tickets error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    const body = await request.json()
    const validation = ticketSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const ticket = await prisma.ticket.create({
      data: {
        userId: session.userId,
        subject: validation.data.subject,
        message: validation.data.message,
      },
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error('Create ticket error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
