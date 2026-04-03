'use client'

import { useEffect, useState, useCallback } from 'react'

interface Ticket {
  id: string
  subject: string
  message: string
  reply: string | null
  status: 'OPEN' | 'ANSWERED' | 'CLOSED'
  createdAt: string
  user: {
    name: string | null
    email: string
  }
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/tickets')
      const data = await res.json()
      if (Array.isArray(data)) setTickets(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const handleReply = async (ticketId: string, customStatus?: string) => {
    if (!customStatus && !replyText) return

    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reply: customStatus ? undefined : replyText,
          status: customStatus || 'ANSWERED'
        })
      })

      if (res.ok) {
        setReplyText('')
        setReplyingTo(null)
        fetchTickets()
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="text-white p-8">Yükleniyor...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Destek Talepleri</h1>
          <p className="text-surface-400 mt-1">Kullanıcı mesajlarını görüntüleyin ve yanıtlayın</p>
        </div>
      </div>

      <div className="grid gap-4">
        {tickets.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-surface-400">
            Bekleyen destek talebi bulunmuyor.
          </div>
        ) : (
          tickets.map(ticket => (
            <div key={ticket.id} className="glass rounded-2xl p-6 glow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{ticket.subject}</h3>
                    {ticket.status === 'OPEN' && <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">Açık</span>}
                    {ticket.status === 'ANSWERED' && <span className="text-xs px-2 py-1 rounded-full bg-brand-500/20 text-brand-400">Cevaplandı</span>}
                    {ticket.status === 'CLOSED' && <span className="text-xs px-2 py-1 rounded-full bg-surface-500/20 text-surface-400">Kapalı</span>}
                  </div>
                  <p className="text-sm text-surface-400 mt-1">
                    Gönderen: {ticket.user.name || ticket.user.email} • {new Date(ticket.createdAt).toLocaleString('tr-TR')}
                  </p>
                </div>
                {ticket.status !== 'CLOSED' && (
                  <button
                    onClick={() => handleReply(ticket.id, 'CLOSED')}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Talebi Kapat
                  </button>
                )}
              </div>

              <div className="mb-4">
                <p className="text-surface-200 bg-surface-800/50 rounded-xl p-4 text-sm border border-white/5">
                  {ticket.message}
                </p>
              </div>

              {ticket.reply ? (
                <div className="ml-8 mb-4 border-l-2 border-brand-500 pl-4">
                  <p className="text-xs text-brand-400 font-bold mb-1">AIPass Yönetimi</p>
                  <p className="text-surface-300 text-sm">{ticket.reply}</p>
                </div>
              ) : null}

              {ticket.status !== 'CLOSED' && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  {replyingTo === ticket.id ? (
                    <div className="space-y-3">
                      <textarea
                        autoFocus
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Kullanıcıya yanıtınız..."
                        rows={3}
                        className="w-full bg-surface-900 border border-brand-500/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500 resize-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => { setReplyingTo(null); setReplyText(''); }}
                          className="px-4 py-2 rounded-lg text-sm font-medium text-surface-400 hover:text-white"
                        >
                          İptal
                        </button>
                        <button
                          onClick={() => handleReply(ticket.id)}
                          disabled={!replyText}
                          className="px-4 py-2 rounded-lg text-sm font-bold bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
                        >
                          Yanıtı Gönder
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setReplyingTo(ticket.id); setReplyText(ticket.reply || ''); }}
                      className="text-brand-400 text-sm font-medium hover:text-brand-300"
                    >
                      {ticket.reply ? 'Yanıtı Düzenle' : 'Yanıt Yaz'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
