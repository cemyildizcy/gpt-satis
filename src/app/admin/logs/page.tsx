'use client'

import { useEffect, useState } from 'react'

interface Log {
  id: string
  action: string
  details: string | null
  createdAt: string
  admin: { name: string | null; email: string }
  target: { name: string | null; email: string } | null
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/logs')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || [])
        setLoading(false)
      })
  }, [])

  const actionLabels: Record<string, { label: string; color: string }> = {
    USER_CREATED: { label: 'Kullanıcı Oluşturuldu', color: 'text-emerald-400' },
    USER_UPDATED: { label: 'Kullanıcı Güncellendi', color: 'text-blue-400' },
    USER_DELETED: { label: 'Kullanıcı Silindi', color: 'text-red-400' },
    SUBSCRIPTION_ASSIGNED: { label: 'Abonelik Atandı', color: 'text-purple-400' },
    WORKSPACE_UPDATED: { label: 'Workspace Güncellendi', color: 'text-amber-400' },
    PAYMENT_APPROVED: { label: 'Ödeme Onaylandı', color: 'text-emerald-400' },
    PAYMENT_REJECTED: { label: 'Ödeme Reddedildi', color: 'text-red-400' },
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white">İşlem Logları</h1>
        <p className="text-surface-400 mt-1">Admin işlem geçmişi</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden animate-slide-up">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-surface-400">
            Henüz işlem kaydı yok
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {logs.map((log) => {
              const action = actionLabels[log.action] || { label: log.action, color: 'text-surface-300' }
              return (
                <div key={log.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${action.color}`}>
                        {action.label}
                      </span>
                      {log.target && (
                        <span className="text-sm text-surface-400 ml-2">
                          → {log.target.name || log.target.email}
                        </span>
                      )}
                      {log.details && (
                        <p className="text-xs text-surface-500 mt-1 max-w-lg truncate">
                          {log.details}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-surface-400">
                        {new Date(log.createdAt).toLocaleString('tr-TR')}
                      </p>
                      <p className="text-xs text-surface-500">
                        {log.admin.name || log.admin.email}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
