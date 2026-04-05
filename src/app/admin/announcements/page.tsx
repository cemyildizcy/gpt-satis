'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AnnouncementsPage() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [target, setTarget] = useState('ACTIVE')
  const [sendEmail, setSendEmail] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !message) return

    setLoading(true)
    setStatusMsg(null)

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, target, sendEmail })
      })

      if (!res.ok) throw new Error('API Hatası')
      
      const data = await res.json()
      setStatusMsg({ type: 'success', text: `Başarılı! ${data.notifCount} kişiye bildirim${data.emailCount > 0 ? ` ve ${data.emailCount} maile` : ''} gönderildi.` })
      
      setTitle('')
      setMessage('')
      setSendEmail(false)
    } catch (error) {
      console.error(error)
      setStatusMsg({ type: 'error', text: 'Gönderim sırasında hata oluştu.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Duyuru Paneli</h1>
        <p className="text-surface-400">Tüm kullanıcılara veya kurumsal aktif müşterilerinize bildirim gönderin.</p>
      </div>

      <div className="glass rounded-2xl p-6 glow-sm max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {statusMsg && (
            <div className={`p-4 rounded-xl text-sm ${statusMsg.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {statusMsg.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">
              Hedef Kitle
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`p-4 rounded-xl border cursor-pointer border-white/5 bg-surface-900/50 hover:bg-white/5 transition-colors flex items-center justify-between ${target === 'ACTIVE' ? 'ring-2 ring-brand-500' : ''}`}>
                <div>
                  <div className="font-semibold text-white">Sadece Aktif Aboneler</div>
                  <div className="text-xs text-surface-400 mt-1">Ödemesi onaylanmış kullanıcılar</div>
                </div>
                <input type="radio" name="target" value="ACTIVE" checked={target === 'ACTIVE'} onChange={(e) => setTarget(e.target.value)} className="hidden" />
                <div className={`w-5 h-5 rounded-full border border-white/20 flex items-center justify-center ${target === 'ACTIVE' ? 'bg-brand-500 border-brand-500' : ''}`}>
                  {target === 'ACTIVE' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </label>
              
              <label className={`p-4 rounded-xl border cursor-pointer border-white/5 bg-surface-900/50 hover:bg-white/5 transition-colors flex items-center justify-between ${target === 'ALL' ? 'ring-2 ring-brand-500' : ''}`}>
                <div>
                  <div className="font-semibold text-white">Tüm Kullanıcılar</div>
                  <div className="text-xs text-surface-400 mt-1">Süresi dolmuş veya bekleyenler dahil</div>
                </div>
                <input type="radio" name="target" value="ALL" checked={target === 'ALL'} onChange={(e) => setTarget(e.target.value)} className="hidden" />
                <div className={`w-5 h-5 rounded-full border border-white/20 flex items-center justify-center ${target === 'ALL' ? 'bg-brand-500 border-brand-500' : ''}`}>
                  {target === 'ALL' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">
              Bildirim Başlığı
            </label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-surface-900/50 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
              placeholder="Örn: Yeni Model Eklendi: Claude 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">
              Mesaj (İçerik)
            </label>
            <textarea 
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              className="w-full bg-surface-900/50 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              placeholder="Kullanıcılara iletmek istediğiniz detaylı bilgi..."
            />
          </div>

          <div>
            <label className="flex items-center gap-3 p-4 rounded-xl border border-brand-500/20 bg-brand-500/5 cursor-pointer hover:bg-brand-500/10 transition-colors">
              <input 
                type="checkbox" 
                checked={sendEmail}
                onChange={e => setSendEmail(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 text-brand-500 focus:ring-brand-500"
              />
              <div>
                <div className="font-semibold text-brand-400">Ayrıca E-posta ile gönder</div>
                <div className="text-xs text-surface-400 mt-1">Seçili kitlenin e-posta adreslerine de bilgi maili düşer. Zorunlu olmadıkça bülten kullanmayınız.</div>
              </div>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading || !title || !message}
            className="w-full py-4 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-brand-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#7c5cfc] hover:from-[#5e30d6] to-[#5e30d6] hover:to-[#7c5cfc]"
          >
            {loading ? 'Gönderiliyor...' : 'Duyuruyu Yayınla! 🚀'}
          </button>
        </form>
      </div>
    </div>
  )
}
