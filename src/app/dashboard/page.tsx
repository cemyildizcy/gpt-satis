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

interface Ticket {
  id: string
  subject: string
  message: string
  reply: string | null
  status: string
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
  const [ibanCopied, setIbanCopied] = useState(false)

  // Ticket states
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketMessage, setTicketMessage] = useState('')
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false)

  // Profile edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editName, setEditName] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  // FAQ states
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const fetchUser = useCallback(async () => {
    const res = await fetch('/api/user/profile')
    const data = await res.json()
    if (data.user) setUser(data.user)
  }, [])

  const fetchPayments = useCallback(async () => {
    const res = await fetch('/api/user/payments')
    const data = await res.json()
    if (data.payments) setPayments(data.payments)
  }, [])

  const fetchTickets = useCallback(async () => {
    const res = await fetch('/api/user/tickets')
    const data = await res.json()
    if (Array.isArray(data)) setTickets(data)
  }, [])

  useEffect(() => {
    fetchUser()
    fetchPayments()
    fetchTickets()
  }, [fetchUser, fetchPayments, fetchTickets])

  // Countdown timer
  useEffect(() => {
    if (!user?.subscriptionEnd || user.status !== 'ACTIVE') return

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(user.subscriptionEnd!).getTime()
      const diff = end - now

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        fetchUser()
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
  }, [user, fetchUser])

  const [uploadError, setUploadError] = useState('')

  const handleUpload = async (file: File) => {
    setUploading(true)
    setUploadSuccess(false)
    setUploadError('')
    try {
      const formData = new FormData()
      formData.append('receipt', file)
      const res = await fetch('/api/user/payment', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        setUploadSuccess(true)
        fetchPayments()
        setTimeout(() => setUploadSuccess(false), 5000)
      } else {
        setUploadError(data.error || 'Dekont yüklenirken hata oluştu')
        setTimeout(() => setUploadError(''), 5000)
      }
    } catch (err) {
      console.error('Upload error:', err)
      setUploadError('Bağlantı hatası. Lütfen tekrar deneyin.')
      setTimeout(() => setUploadError(''), 5000)
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
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const handleCopyIban = () => {
    navigator.clipboard.writeText(iban)
    setIbanCopied(true)
    setTimeout(() => setIbanCopied(false), 2500)
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketSubject || !ticketMessage) return
    setIsSubmittingTicket(true)
    try {
      const res = await fetch('/api/user/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: ticketSubject, message: ticketMessage })
      })
      if (res.ok) {
        setTicketSubject('')
        setTicketMessage('')
        fetchTickets()
      } else {
        const error = await res.json()
        alert(error.error || 'Bilet oluşturulurken hata oluştu')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmittingTicket(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!editName || editName.length < 2) return
    setSavingProfile(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName })
      })
      if (res.ok) {
        fetchUser()
        setIsEditingProfile(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSavingProfile(false)
    }
  }

  const isExpiringSoon = countdown.days <= 3 && user?.status === 'ACTIVE'
  const bankName = process.env.NEXT_PUBLIC_BANK_NAME || 'Ziraat Bankası'
  const iban = process.env.NEXT_PUBLIC_IBAN || 'TR760001009010737415105005'
  const price = process.env.NEXT_PUBLIC_MONTHLY_PRICE || '250'
  const accountHolder = 'Cem Yıldız'

  // Progress calculation
  const getProgress = () => {
    if (!user?.subscriptionStart || !user?.subscriptionEnd) return 0
    const start = new Date(user.subscriptionStart).getTime()
    const end = new Date(user.subscriptionEnd).getTime()
    const now = new Date().getTime()
    const total = end - start
    const elapsed = now - start
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))
  }

  const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    ACTIVE: { label: 'Aktif', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: '✅' },
    EXPIRED: { label: 'Süresi Dolmuş', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: '⏰' },
    PENDING: { label: 'Onay Bekliyor', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: '⏳' },
  }

  const paymentStatusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Beklemede', color: 'text-amber-400' },
    APPROVED: { label: 'Onaylandı', color: 'text-emerald-400' },
    REJECTED: { label: 'Reddedildi', color: 'text-red-400' },
  }

  const faqItems = [
    { q: 'Nasıl kullanmaya başlarım?', a: 'Ödeme yaptıktan ve admin onayı aldıktan sonra, size verilen ChatGPT giriş bilgileriyle chatgpt.com adresinden giriş yapabilirsiniz.' },
    { q: 'Şifremi değiştirebilir miyim?', a: 'Hayır. Paylaşımlı hesap güvenliği için şifre değişikliği yapmanız engellenmektedir. Şifre değiştirmeye çalışırsanız sistem otomatik kilitlenir.' },
    { q: 'Hangi özelliklere erişebilirim?', a: 'GPT-5, Sora (video üretimi), DALL-E 3 (görsel üretimi), Codex, Vision ve tüm premium ChatGPT özelliklerine limitsiz erişiminiz var.' },
    { q: 'Aboneliğim bitince ne olur?', a: 'Abonelik süresi dolduğunda erişiminiz otomatik olarak kapanır. Yeni ödeme yaparak tekrar aktif edebilirsiniz.' },
    { q: 'Ödeme yaptım ama onaylanmadı?', a: 'Dekontunuz admin tarafından manuel olarak kontrol edilir. Genellikle 1-2 saat içinde onaylanır. Gecikme durumunda destek talebi açabilirsiniz.' },
  ]

  // Loading skeleton
  if (!user) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="skeleton h-10 w-64 rounded-xl" />
        <div className="skeleton h-5 w-48 rounded-lg" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="skeleton h-44 rounded-2xl" />
          <div className="skeleton h-44 rounded-2xl" />
        </div>
        <div className="skeleton h-64 rounded-2xl" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    )
  }

  const currentStatus = statusConfig[user.status] || statusConfig.PENDING
  const progress = getProgress()

  // Greeting based on time of day
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome Card */}
      <div className="glass rounded-2xl p-6 glow-sm animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              {greeting}, {user.name || 'Kullanıcı'}! 👋
            </h1>
            <p className="text-surface-400 mt-1 text-sm">Abonelik durumunuzu takip edin ve AIPass'in tüm gücünden yararlanın.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${currentStatus.bg} ${currentStatus.color} flex items-center gap-2`}>
              {currentStatus.icon} {currentStatus.label}
            </span>
            <button
              onClick={() => { setEditName(user.name || ''); setIsEditingProfile(true) }}
              className="p-2 rounded-xl glass-hover text-surface-400 hover:text-white text-sm"
              title="Profili Düzenle"
            >
              ✏️
            </button>
          </div>
        </div>
      </div>

      {/* Expiring Soon Warning */}
      {isExpiringSoon && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 animate-slide-up">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-amber-400 font-semibold">Aboneliğiniz yakında sona erecek!</p>
              <p className="text-amber-400/70 text-sm">Kesintisiz erişim için lütfen yeni ödeme yapın.</p>
            </div>
          </div>
        </div>
      )}

      {/* Status, Countdown & Progress */}
      <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
        {/* Status Card */}
        <div className="glass rounded-2xl p-6 glow-sm">
          <h2 className="text-lg font-semibold text-white mb-4">Hesap Bilgileri</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Email</span>
              <span className="text-white font-mono text-xs">{user.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Üyelik Tarihi</span>
              <span className="text-white">{user.subscriptionStart ? new Date(user.subscriptionStart).toLocaleDateString('tr-TR') : '-'}</span>
            </div>
            {user.subscriptionEnd && (
              <div className="flex justify-between text-sm">
                <span className="text-surface-400">Bitiş Tarihi</span>
                <span className="text-white">
                  {new Date(user.subscriptionEnd).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            )}
            {/* Progress Bar */}
            {user.status === 'ACTIVE' && user.subscriptionStart && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs text-surface-400 mb-2">
                  <span>Abonelik İlerlemesi</span>
                  <span className="text-white font-semibold">{progress}%</span>
                </div>
                <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 animate-progress"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-surface-500 mt-1">{countdown.days} gün kaldı</p>
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
                <div key={i} className="text-center p-3 rounded-xl bg-surface-800/50 border border-white/5">
                  <div className={`text-3xl font-bold ${isExpiringSoon ? 'text-amber-400 animate-countdown' : 'gradient-text'}`}>
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-surface-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          ) : user.status === 'EXPIRED' ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">😔</div>
              <p className="text-red-400 font-medium">Aboneliğiniz sona erdi</p>
              <p className="text-surface-400 text-sm mt-1">Yenilemek için aşağıdan ödeme yapın</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🚀</div>
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
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-surface-800/50 border border-surface-700">
              <p className="text-xs text-surface-400 mb-1">Hesap Sahibi</p>
              <p className="text-white font-semibold">{accountHolder}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-800/50 border border-surface-700">
              <p className="text-xs text-surface-400 mb-1">Banka</p>
              <p className="text-white font-medium">{bankName}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-800/50 border border-surface-700">
              <p className="text-xs text-surface-400 mb-1">IBAN</p>
              <p className="text-white font-mono text-sm tracking-wide">{iban}</p>
              <button
                onClick={handleCopyIban}
                className={`mt-2 text-xs transition-colors font-medium ${ibanCopied ? 'text-emerald-400' : 'text-brand-400 hover:text-brand-300'}`}
              >
                {ibanCopied ? '✅ Kopyalandı!' : '📋 Kopyala'}
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
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 h-full flex items-center justify-center ${
                dragOver ? 'border-brand-500 bg-brand-500/10' : 'border-surface-700 hover:border-surface-600'
              }`}
            >
              {uploading ? (
                <div className="space-y-3">
                  <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-surface-400 text-sm">Yükleniyor...</p>
                </div>
              ) : uploadSuccess ? (
                <div className="space-y-3">
                  <div className="text-5xl">✅</div>
                  <p className="text-emerald-400 font-medium">Dekont yüklendi!</p>
                  <p className="text-surface-400 text-sm">Admin onayı bekleniyor</p>
                </div>
              ) : uploadError ? (
                <div className="space-y-3">
                  <div className="text-5xl">❌</div>
                  <p className="text-red-400 font-medium">{uploadError}</p>
                  <label className="inline-block px-5 py-2.5 rounded-xl bg-red-500/20 text-red-400 text-sm cursor-pointer hover:bg-red-500/30 transition-colors">
                    Tekrar Dene
                    <input type="file" className="hidden" onChange={handleFileSelect} accept="image/*,.pdf,.doc,.docx" />
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-5xl">📄</div>
                  <p className="text-white font-medium">Dekontu buraya sürükleyin</p>
                  <p className="text-surface-500 text-sm">veya</p>
                  <label className="inline-block px-5 py-2.5 rounded-xl bg-brand-500/20 text-brand-400 text-sm cursor-pointer hover:bg-brand-500/30 transition-colors">
                    Dosya Seç
                    <input type="file" className="hidden" onChange={handleFileSelect} accept="image/*,.pdf,.doc,.docx" />
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
                      <td className="py-3 text-sm text-white">{new Date(payment.createdAt).toLocaleDateString('tr-TR')}</td>
                      <td className="py-3 text-sm text-white">₺{payment.amount}</td>
                      <td className="py-3">
                        <span className={`text-sm font-medium ${pStatus.color}`}>{pStatus.label}</span>
                      </td>
                      <td className="py-3 text-sm text-surface-400">{payment.adminNote || '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AIPass Usage Guide (Active Users Only) */}
      {user.status === 'ACTIVE' && (
        <div className="glass rounded-2xl p-6 glow-sm animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-lg font-semibold text-brand-400 mb-4">📖 AIPass Kullanım Kılavuzu</h2>
          <div className="space-y-4 text-surface-300 text-sm">
            <p>Aboneliğiniz aktif! Premium özelliklere ulaşmak için aşağıdaki adımları izleyin:</p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>OpenAI (ChatGPT) giriş sayfasına (<a href="https://chatgpt.com" target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">chatgpt.com</a>) gidin.</li>
              <li>Size atanan paylaşımlı <strong className="text-white">AIPass Ekip Hesabı</strong> bilgileri ile giriş yapın.</li>
              <li>Sol üst menüden çalışma alanını &quot;AIPass Team&quot; olarak değiştirin.</li>
              <li>Sora, DALL-E ve GPT-5&apos;in tadını çıkarın! Limitlere takılmadan kullanın.</li>
            </ol>
            <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl mt-4">
              <p className="text-brand-400 font-medium">💡 İpucu: Şifreyi değiştirmeye çalışmayın, sistem otomatik kilitler.</p>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="glass rounded-2xl p-6 glow-sm animate-slide-up" style={{ animationDelay: '450ms' }}>
        <h2 className="text-lg font-semibold text-white mb-4">❓ Sıkça Sorulan Sorular</h2>
        <div className="space-y-2">
          {faqItems.map((item, i) => (
            <div key={i} className="border border-white/5 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-medium text-white">{item.q}</span>
                <span className={`text-surface-400 text-xs transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-surface-300 animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Support Center (Tickets) */}
      <div className="grid md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
        {/* New Ticket */}
        <div className="glass rounded-2xl p-6 glow-sm">
          <h2 className="text-lg font-semibold text-white mb-2">Destek Merkezi</h2>
          <p className="text-xs text-surface-400 mb-6">Sorularınız, giriş problemleriniz veya teknik destek için bize yazın.</p>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Konu</label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={e => setTicketSubject(e.target.value)}
                className="w-full bg-surface-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors"
                placeholder="Örn: Hesabıma giriş yapamıyorum"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Mesajınız</label>
              <textarea
                required
                rows={3}
                value={ticketMessage}
                onChange={e => setTicketMessage(e.target.value)}
                className="w-full bg-surface-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500 resize-none transition-colors"
                placeholder="Detaylı bir şekilde açıklayın..."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingTicket}
              className="w-full py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-surface-200 transition-colors disabled:opacity-50"
            >
              {isSubmittingTicket ? 'Gönderiliyor...' : 'Talebi Gönder'}
            </button>
          </form>
        </div>

        {/* Ticket History */}
        <div className="glass rounded-2xl p-6 glow-sm flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
            Taleplerim
            <span className="bg-brand-500/20 text-brand-400 text-xs px-2 py-1 rounded-full">{tickets.length} Bilet</span>
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[320px] pr-2 custom-scrollbar">
            {tickets.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-sm text-surface-500">Henüz destek talebiniz yok.</p>
              </div>
            ) : (
              tickets.map(ticket => (
                <div key={ticket.id} className="p-4 rounded-xl border border-white/5 bg-surface-800/30 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-white">{ticket.subject}</h3>
                    {ticket.status === 'OPEN' && <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 flex-shrink-0">Bekliyor</span>}
                    {ticket.status === 'ANSWERED' && <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 flex-shrink-0">Yanıtlandı</span>}
                    {ticket.status === 'CLOSED' && <span className="text-[10px] px-2 py-0.5 rounded bg-surface-500/20 text-surface-400 flex-shrink-0">Kapalı</span>}
                  </div>
                  <p className="text-xs text-surface-300">{ticket.message}</p>
                  <p className="text-[10px] text-surface-500">{new Date(ticket.createdAt).toLocaleString('tr-TR')}</p>
                  {ticket.reply && (
                    <div className="mt-3 p-3 rounded-lg bg-brand-500/5 border border-brand-500/10">
                      <p className="text-[10px] text-brand-400 font-bold mb-1">AIPass Destek:</p>
                      <p className="text-xs text-surface-200">{ticket.reply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass w-full max-w-sm rounded-2xl p-8 shadow-2xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Profili Düzenle</h2>
              <button onClick={() => setIsEditingProfile(false)} className="text-surface-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  autoFocus
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500"
                  placeholder="Adınız Soyadınız"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1">Email</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-surface-900/50 border border-white/5 rounded-xl px-4 py-3 text-surface-500 text-sm cursor-not-allowed"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm text-surface-400 hover:text-white glass-hover"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile || !editName || editName.length < 2}
                  className="flex-1 py-2.5 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 text-sm disabled:opacity-50 transition-colors"
                >
                  {savingProfile ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
