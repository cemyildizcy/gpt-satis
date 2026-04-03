import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const replySchema = z.object({
  reply: z.string().min(2, 'Yanıt en az 2 karakter olmalıdır'),
  status: z.enum(['OPEN', 'ANSWERED', 'CLOSED']).optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const validation = replySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { id } = await params

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        reply: validation.data.reply,
        status: validation.data.status || 'ANSWERED',
      },
    })

    // Log the action
    await prisma.adminLog.create({
      data: {
        adminId: session.userId,
        action: 'TICKET_REPLIED',
        details: `Ticket yanıtlandı: ${id}`,
        targetUserId: ticket.userId,
      },
    })

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Reply ticket error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
