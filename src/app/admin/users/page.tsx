'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name: string | null
  status: string
  subscriptionStart: string | null
  subscriptionEnd: string | null
  addedToWorkspace: boolean
  notes: string | null
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '' })
  const [addError, setAddError] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter !== 'ALL') params.set('status', filter)
    if (search) params.set('search', search)

    const res = await fetch(`/api/admin/users?${params}`)
    const data = await res.json()
    setUsers(data.users || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [filter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers()
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError('')

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })

    const data = await res.json()
    if (!res.ok) {
      setAddError(data.error)
      return
    }

    setShowAddModal(false)
    setNewUser({ email: '', password: '', name: '' })
    fetchUsers()
  }

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`${email} kullanıcısını silmek istediğinizden emin misiniz?`)) return

    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    fetchUsers()
  }

  const handleWorkspaceToggle = async (id: string, current: boolean) => {
    await fetch(`/api/admin/users/${id}/workspace`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addedToWorkspace: !current }),
    })
    fetchUsers()
  }

  const handleAssignSubscription = async (id: string) => {
    const months = prompt('Kaç aylık abonelik atanacak? (1-12)')
    if (!months) return

    const m = parseInt(months)
    if (isNaN(m) || m < 1 || m > 12) {
      alert('Geçerli bir sayı giriniz (1-12)')
      return
    }

    await fetch(`/api/admin/users/${id}/subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ months: m }),
    })
    fetchUsers()
  }

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    ACTIVE: { label: 'Aktif', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    EXPIRED: { label: 'Süresi Dolmuş', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    PENDING: { label: 'Beklemede', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  }

  const filters = [
    { value: 'ALL', label: 'Tümü' },
    { value: 'ACTIVE', label: 'Aktif' },
    { value: 'EXPIRED', label: 'Süresi Dolmuş' },
    { value: 'PENDING', label: 'Beklemede' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">Kullanıcılar</h1>
          <p className="text-surface-400 mt-1">Tüm kullanıcıları yönetin</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-medium text-sm hover:from-brand-400 hover:to-brand-600 transition-all shadow-lg shadow-brand-500/25"
        >
          + Yeni Kullanıcı
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 animate-slide-up">
        <div className="flex gap-2">
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
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 md:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Email ara..."
            className="flex-1 px-4 py-2 rounded-xl bg-surface-800/50 border border-surface-700 text-white text-sm placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
          <button type="submit" className="px-4 py-2 rounded-xl glass text-white text-sm hover:bg-white/10 transition-all">
            🔍
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-surface-400">
            Kullanıcı bulunamadı
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-surface-400 p-4">Kullanıcı</th>
                  <th className="text-left text-xs font-medium text-surface-400 p-4">Durum</th>
                  <th className="text-left text-xs font-medium text-surface-400 p-4">Abonelik Bitiş</th>
                  <th className="text-left text-xs font-medium text-surface-400 p-4">Workspace</th>
                  <th className="text-left text-xs font-medium text-surface-400 p-4">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => {
                  const st = statusConfig[u.status] || statusConfig.PENDING
                  return (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-medium text-white">{u.name || 'İsimsiz'}</p>
                          <p className="text-xs text-surface-400">{u.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${st.bg} ${st.color}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-surface-300">
                        {u.subscriptionEnd
                          ? new Date(u.subscriptionEnd).toLocaleDateString('tr-TR')
                          : '-'}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleWorkspaceToggle(u.id, u.addedToWorkspace)}
                          className={`w-10 h-5 rounded-full relative transition-colors ${
                            u.addedToWorkspace ? 'bg-emerald-500' : 'bg-surface-700'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                              u.addedToWorkspace ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAssignSubscription(u.id)}
                            className="px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-400 text-xs hover:bg-brand-500/20 transition-colors"
                            title="Abonelik Ata"
                          >
                            📅
                          </button>
                          <Link
                            href={`/admin/users/${u.id}`}
                            className="px-3 py-1.5 rounded-lg bg-surface-800 text-surface-300 text-xs hover:bg-surface-700 transition-colors"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDelete(u.id, u.email)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass rounded-3xl p-8 w-full max-w-md glow animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">Yeni Kullanıcı</h2>
            {addError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {addError}
              </div>
            )}
            <form onSubmit={handleAddUser} className="space-y-4">
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Ad Soyad"
                className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Email"
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Şifre"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl glass text-surface-300 hover:text-white transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-medium"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
