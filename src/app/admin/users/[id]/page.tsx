'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'

interface UserDetail {
  id: string
  email: string
  name: string | null
  status: string
  role: string
  subscriptionStart: string | null
  subscriptionEnd: string | null
  addedToWorkspace: boolean
  notes: string | null
  createdAt: string
  payments: {
    id: string
    amount: number
    receiptUrl: string
    status: string
    adminNote: string | null
    createdAt: string
  }[]
}

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [user, setUser] = useState<UserDetail | null>(null)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')
  const [subscriptionEnd, setSubscriptionEnd] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
          setNotes(data.user.notes || '')
          setStatus(data.user.status)
          if (data.user.subscriptionEnd) {
            // Format to YYYY-MM-DD for date input
            const dateStr = new Date(data.user.subscriptionEnd).toISOString().split('T')[0]
            setSubscriptionEnd(dateStr)
          }
        }
      })
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    
    let parsedDate = null
    if (subscriptionEnd) {
      parsedDate = new Date(subscriptionEnd).toISOString()
    }

    await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, status, subscriptionEnd: parsedDate }),
    })
    setSaving(false)
    router.push('/admin/users')
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl glass hover:bg-white/10 transition-colors"
        >
          ← Geri
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{user.name || 'İsimsiz'}</h1>
          <p className="text-surface-400 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Info */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Kullanıcı Bilgileri</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-surface-400 block mb-2">Durum</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="ACTIVE">Aktif</option>
              <option value="EXPIRED">Süresi Dolmuş</option>
              <option value="PENDING">Beklemede</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-surface-400 block mb-2">Kayıt Tarihi</label>
            <p className="px-4 py-3 rounded-xl bg-surface-800/50 text-white text-sm">
              {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
          <div>
            <label className="text-xs text-surface-400 block mb-2">Abonelik Başlangıç</label>
            <p className="px-4 py-3 rounded-xl bg-surface-800/50 text-white text-sm">
              {user.subscriptionStart
                ? new Date(user.subscriptionStart).toLocaleDateString('tr-TR')
                : '-'}
            </p>
          </div>
          <div>
            <label className="text-xs text-surface-400 block mb-2">Abonelik Bitiş (Manuel Değiştir)</label>
            <input
              type="date"
              value={subscriptionEnd}
              onChange={(e) => setSubscriptionEnd(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-surface-400 block mb-2">Not</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
            placeholder="Kullanıcı hakkında not..."
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-medium hover:from-brand-400 hover:to-brand-600 transition-all disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      {/* Payments */}
      {user.payments.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Ödeme Geçmişi</h2>
          <div className="space-y-3">
            {user.payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-800/30">
                <div>
                  <p className="text-sm text-white">₺{p.amount}</p>
                  <p className="text-xs text-surface-400">
                    {new Date(p.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={p.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-400 hover:text-brand-300"
                  >
                    Dekont Görüntüle
                  </a>
                  <span className={`text-xs font-medium ${
                    p.status === 'APPROVED' ? 'text-emerald-400' :
                    p.status === 'REJECTED' ? 'text-red-400' :
                    'text-amber-400'
                  }`}>
                    {p.status === 'APPROVED' ? 'Onaylandı' :
                     p.status === 'REJECTED' ? 'Reddedildi' :
                     'Beklemede'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
