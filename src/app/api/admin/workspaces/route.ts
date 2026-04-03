import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return new NextResponse('Unauthorized', { status: 401 })

    const workspaces = await prisma.workspaceAccount.findMany({
      include: {
        users: {
          select: { id: true, email: true, name: true, subscriptionEnd: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(workspaces)
  } catch (error) {
    console.error('Fetch workspaces error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return new NextResponse('Unauthorized', { status: 401 })

    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email ve şifre zorunludur' }, { status: 400 })
    }

    const newWorkspace = await prisma.workspaceAccount.create({
      data: {
        email,
        password,
        name
      }
    })

    await prisma.adminLog.create({
      data: {
        adminId: session.userId,
        action: 'WORKSPACE_CREATED',
        details: `Yeni ana hesap eklendi: ${email}`
      }
    })

    return NextResponse.json(newWorkspace, { status: 201 })
  } catch (error) {
    console.error('Create workspace error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
