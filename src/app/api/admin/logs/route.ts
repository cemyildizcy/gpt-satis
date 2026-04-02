import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')

  const logs = await prisma.adminLog.findMany({
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      admin: {
        select: { name: true, email: true },
      },
      target: {
        select: { name: true, email: true },
      },
    },
  })

  const total = await prisma.adminLog.count()

  return NextResponse.json({ logs, total, page, limit })
}
