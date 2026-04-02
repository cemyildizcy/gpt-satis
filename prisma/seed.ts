import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gptsatis.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12)
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'Admin',
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    })
    console.log(`✅ Admin kullanıcı oluşturuldu: ${adminEmail}`)
  } else {
    console.log(`ℹ️ Admin kullanıcı zaten mevcut: ${adminEmail}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
