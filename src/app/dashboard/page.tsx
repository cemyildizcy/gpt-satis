'use client'

import { useEffect, useState, useCallback } from 'react'

interface User {
  id: string
  email: string
  name: string | null
  status: string
  subscriptionStart: string | null
  subscriptionEnd: string | null
}

interface Payment {
  id: string
  amount: number
  receiptUrl: string
  status: string
  adminNote: string | null
  createdAt: string
}

interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const fetchData = useCallback(async () => {
    const [userRes, paymentsRes] = await Promise.all([
      fetch('/api/user/profile'),
      fetch('/api/user/payments'),
    ])
    const userData = await userRes.json()
    const paymentsData = await paymentsRes.json()
    if (userData.user) setUser(userData.user)
    if (paymentsData.payments) setPayments(paymentsData.payments)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Countdown timer
  useEffect(() => {
    if (!user?.subscriptionEnd || user.status !== 'ACTIVE') return

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(user.subscriptionEnd!).getTime()
      const diff = end - now

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        fetchData() // Refresh to get updated status
        clearInterval(interval)
        return
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [user, fetchData])

  const handleUpload = async (file: File) => {
    setUploading(true)
    setUploadSuccess(false)
    try {
      const formData = new FormData()
      formData.append('receipt', file)

      const res = await fetch('/api/user/payment', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setUploadSuccess(true)
        fetchData()
        setTimeout(() => setUploadSuccess(false), 5000)
      }
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const isExpiringSoon = countdown.days <= 3 && user?.status === 'ACTIVE'
  const bankName = process.env.NEXT_PUBLIC_BANK_NAME || 'Ziraat Bankası'
  const iban = process.env.NEXT_PUBLIC_IBAN || 'TR760001009010737415105005'
  const price = process.env.NEXT_PUBLIC_MONTHLY_PRICE || '250'

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    ACTIVE: { label: 'Aktif', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    EXPIRED: { label: 'Süresi Dolmuş', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    PENDING: { label: 'Beklemede', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  }

  const paymentStatusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Beklemede', color: 'text-amber-400' },
    APPROVED: { label: 'Onaylandı', color: 'text-emerald-400' },
    REJECTED: { label: 'Reddedildi', color: 'text-red-400' },
  }

  if (!user) return null

  const currentStatus = statusConfig[user.status] || statusConfig.PENDING

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-surface-400 mt-1">Abonelik durumunuzu takip edin</p>
      </div>

      {/* Expiring Soon Warning */}
      {isExpiringSoon && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 animate-slide-up">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-amber-400 font-semibold">Aboneliğiniz yakında sona erecek!</p>
              <p className="text-amber-400/70 text-sm">Kesintisiz erişim için lütfen ödeme yapın.</p>
            </div>
          </div>
        </div>
      )}

      {/* Status & Countdown */}
      <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
        {/* Status Card */}
        <div className="glass rounded-2xl p-6 glow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Hesap Durumu</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${currentStatus.bg} ${currentStatus.color}`}>
              {currentStatus.label}
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Email</span>
              <span className="text-white">{user.email}</span>
            </div>
            {user.subscriptionEnd && (
              <div className="flex justify-between text-sm">
                <span className="text-surface-400">Bitiş Tarihi</span>
                <span className="text-white">
                  {new Date(user.subscriptionEnd).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Countdown Card */}
        <div className="glass rounded-2xl p-6 glow-sm">
          <h2 className="text-lg font-semibold text-white mb-4">Kalan Süre</h2>
          {user.status === 'ACTIVE' ? (
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: countdown.days, label: 'Gün' },
                { value: countdown.hours, label: 'Saat' },
                { value: countdown.minutes, label: 'Dakika' },
                { value: countdown.seconds, label: 'Saniye' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className={`text-3xl font-bold ${isExpiringSoon ? 'text-amber-400 animate-countdown' : 'gradient-text'}`}>
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-surface-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          ) : user.status === 'EXPIRED' ? (
            <div className="text-center py-4">
              <p className="text-red-400 font-medium">Aboneliğiniz sona erdi</p>
              <p className="text-surface-400 text-sm mt-1">Yenilemek için ödeme yapın</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-amber-400 font-medium">Henüz abonelik yok</p>
              <p className="text-surface-400 text-sm mt-1">Aşağıdan ödeme yaparak başlayın</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Section */}
      <div className="glass rounded-2xl p-6 glow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-lg font-semibold text-white mb-6">Ödeme Yap</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Bank Info */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-800/50 border border-surface-700">
              <p className="text-xs text-surface-400 mb-1">Banka</p>
              <p className="text-white font-medium">{bankName}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-800/50 border border-surface-700">
              <p className="text-xs text-surface-400 mb-1">IBAN</p>
              <p className="text-white font-mono text-sm tracking-wide">{iban}</p>
              <button
                onClick={() => navigator.clipboard.writeText(iban)}
                className="mt-2 text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                📋 Kopyala
              </button>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-brand-500/10 to-brand-700/10 border border-brand-500/20">
              <p className="text-xs text-brand-400 mb-1">Aylık Ücret</p>
              <p className="text-2xl font-bold text-white">₺{price}</p>
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                dragOver
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-surface-700 hover:border-surface-600'
              }`}
            >
              {uploading ? (
                <div className="space-y-3">
                  <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-surface-400 text-sm">Yükleniyor...</p>
                </div>
              ) : uploadSuccess ? (
                <div className="space-y-3">
                  <div className="text-4xl">✅</div>
                  <p className="text-emerald-400 font-medium">Dekont yüklendi!</p>
                  <p className="text-surface-400 text-sm">Admin onayını bekliyor</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-4xl">📄</div>
                  <p className="text-white font-medium">Dekontu buraya sürükleyin</p>
                  <p className="text-surface-500 text-sm">veya</p>
                  <label className="inline-block px-5 py-2.5 rounded-xl bg-brand-500/20 text-brand-400 text-sm cursor-pointer hover:bg-brand-500/30 transition-colors">
                    Dosya Seç
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                  </label>
                  <p className="text-surface-500 text-xs">Tüm formatlar kabul edilir (Maks 10MB)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      {payments.length > 0 && (
        <div className="glass rounded-2xl p-6 glow-sm animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-lg font-semibold text-white mb-4">Ödeme Geçmişi</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-surface-400 pb-3">Tarih</th>
                  <th className="text-left text-xs font-medium text-surface-400 pb-3">Tutar</th>
                  <th className="text-left text-xs font-medium text-surface-400 pb-3">Durum</th>
                  <th className="text-left text-xs font-medium text-surface-400 pb-3">Not</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((payment) => {
                  const pStatus = paymentStatusConfig[payment.status] || paymentStatusConfig.PENDING
                  return (
                    <tr key={payment.id}>
                      <td className="py-3 text-sm text-white">
                        {new Date(payment.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="py-3 text-sm text-white">₺{payment.amount}</td>
                      <td className="py-3">
                        <span className={`text-sm font-medium ${pStatus.color}`}>
                          {pStatus.label}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-surface-400">
                        {payment.adminNote || '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
