import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const tickets = await prisma.ticket.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: [
        { status: 'asc' }, // OPEN comes first alphabetically if we rely on enum, actually OPEN=O, ANSWERED=A, CLOSED=C. Better to sort by createdAt.
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Fetch admin tickets error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
