'use client'

import { useEffect, useState } from 'react'

interface Payment {
  id: string
  amount: number
  receiptUrl: string
  status: string
  adminNote: string | null
  createdAt: string
  reviewedAt: string | null
  user: {
    id: string
    email: string
    name: string | null
    status: string
  }
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filter, setFilter] = useState('PENDING')
  const [loading, setLoading] = useState(true)
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [adminNote, setAdminNote] = useState('')

  const fetchPayments = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter !== 'ALL') params.set('status', filter)

    const res = await fetch(`/api/admin/payments?${params}`)
    const data = await res.json()
    setPayments(data.payments || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPayments()
  }, [filter])

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await fetch(`/api/admin/payments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNote }),
    })
    setReviewingId(null)
    setAdminNote('')
    fetchPayments()
  }

  const filters = [
    { value: 'PENDING', label: 'Bekleyen' },
    { value: 'APPROVED', label: 'Onaylanan' },
    { value: 'REJECTED', label: 'Reddedilen' },
    { value: 'ALL', label: 'Tümü' },
  ]

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white">Dekont Yönetimi</h1>
        <p className="text-surface-400 mt-1">Kullanıcı ödemelerini kontrol edin</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 animate-slide-up">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              filter === f.value
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                : 'glass text-surface-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Payments List */}
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-surface-400">
            {filter === 'PENDING' ? 'Bekleyen dekont bulunmuyor' : 'Dekont bulunamadı'}
          </div>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="glass rounded-2xl p-6 glow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-semibold text-white">₺{payment.amount}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      payment.status === 'APPROVED'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : payment.status === 'REJECTED'
                        ? 'bg-red-500/10 border-red-500/20 text-red-400'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      {payment.status === 'APPROVED' ? 'Onaylandı' :
                       payment.status === 'REJECTED' ? 'Reddedildi' : 'Beklemede'}
                    </span>
                  </div>
                  <p className="text-sm text-surface-300">
                    {payment.user.name || 'İsimsiz'} — <span className="text-surface-400">{payment.user.email}</span>
                  </p>
                  <p className="text-xs text-surface-500 mt-1">
                    {new Date(payment.createdAt).toLocaleString('tr-TR')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={payment.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl glass text-brand-400 text-sm hover:bg-white/10 transition-colors"
                  >
                    📄 Dekont Görüntüle
                  </a>

                  {payment.status === 'PENDING' && (
                    <>
                      {reviewingId === payment.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Not (opsiyonel)"
                            className="px-3 py-2 rounded-lg bg-surface-800/50 border border-surface-700 text-white text-sm placeholder-surface-500 focus:outline-none w-40"
                          />
                          <button
                            onClick={() => handleReview(payment.id, 'APPROVED')}
                            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-500/30 transition-colors"
                          >
                            ✅ Onayla
                          </button>
                          <button
                            onClick={() => handleReview(payment.id, 'REJECTED')}
                            className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
                          >
                            ❌ Reddet
                          </button>
                          <button
                            onClick={() => { setReviewingId(null); setAdminNote('') }}
                            className="px-3 py-2 rounded-xl glass text-surface-400 text-sm"
                          >
                            İptal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReviewingId(payment.id)}
                          className="px-4 py-2 rounded-xl bg-brand-500/20 text-brand-400 text-sm hover:bg-brand-500/30 transition-colors"
                        >
                          İncele
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {payment.adminNote && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-surface-400">Admin Notu: <span className="text-surface-300">{payment.adminNote}</span></p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
