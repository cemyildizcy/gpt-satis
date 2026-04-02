'use client'

import { useEffect, useState } from 'react'

interface Stats {
  totalUsers: number
  activeUsers: number
  expiredUsers: number
  pendingUsers: number
  pendingPayments: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => setStats(data.stats))
  }, [])

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const cards = [
    { label: 'Toplam Kullanıcı', value: stats.totalUsers, icon: '👥', color: 'from-blue-500 to-blue-700' },
    { label: 'Aktif Kullanıcı', value: stats.activeUsers, icon: '✅', color: 'from-emerald-500 to-emerald-700' },
    { label: 'Süresi Dolmuş', value: stats.expiredUsers, icon: '⏰', color: 'from-red-500 to-red-700' },
    { label: 'Beklemede', value: stats.pendingUsers, icon: '⏳', color: 'from-amber-500 to-amber-700' },
    { label: 'Bekleyen Dekont', value: stats.pendingPayments, icon: '💳', color: 'from-purple-500 to-purple-700' },
  ]

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-surface-400 mt-1">Sistem genel bakışı</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 animate-slide-up">
        {cards.map((card, i) => (
          <div
            key={i}
            className="glass rounded-2xl p-5 glow-sm hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.color}`} />
            </div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-surface-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
