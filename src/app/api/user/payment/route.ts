import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

// Use service role key for storage uploads (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Oturum bulunamadı. Lütfen tekrar giriş yapın.' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('receipt') as File

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: 'Dekont dosyası zorunludur' },
        { status: 400 }
      )
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Dosya boyutu en fazla 10MB olabilir' },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const ext = file.name.split('.').pop() || 'bin'
    const fileName = `${userId}-${Date.now()}.${ext}`

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const receiptsBucket = buckets?.find(b => b.name === 'receipts')
    
    if (!receiptsBucket) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket('receipts', {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024,
        allowedMimeTypes: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      })
      if (createError) {
        console.error('Bucket creation error:', createError)
      }
    }

    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: true,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json(
        { error: 'Dekont yüklenemedi: ' + uploadError.message },
        { status: 500 }
      )
    }

    const { data: publicUrlData } = supabase.storage
      .from('receipts')
      .getPublicUrl(fileName)

    const receiptUrl = publicUrlData.publicUrl

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: 250,
        receiptUrl,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ payment }, { status: 201 })
  } catch (error) {
    console.error('Payment upload error:', error)
    return NextResponse.json(
      { error: 'Dekont yükleme sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
}
