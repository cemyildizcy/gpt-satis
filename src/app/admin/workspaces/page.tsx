'use client'

import { useEffect, useState, useCallback, FormEvent } from 'react'

interface UserBasic {
  id: string
  email: string
  name: string | null
  subscriptionEnd: string | null
}

interface Workspace {
  id: string
  email: string
  password: string
  name: string | null
  status: string
  users: UserBasic[]
}

export default function AdminWorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newName, setNewName] = useState('')
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})

  // Assignment states
  const [assigningTo, setAssigningTo] = useState<string | null>(null)
  const [unassignedUsers, setUnassignedUsers] = useState<UserBasic[]>([])
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchWorkspaces = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/workspaces')
      const data = await res.json()
      if (Array.isArray(data)) setWorkspaces(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWorkspaces()
  }, [fetchWorkspaces])

  const handleAddWorkspace = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, password: newPassword, name: newName })
      })
      if (res.ok) {
        setIsAdding(false)
        setNewEmail('')
        setNewPassword('')
        setNewName('')
        fetchWorkspaces()
      } else {
        alert('Hesap eklenemedi.')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchUnassignedUsers = async () => {
    setIsUsersLoading(true)
    try {
      const res = await fetch('/api/admin/users?unassigned=true')
      const data = await res.json()
      if (Array.isArray(data.users)) setUnassignedUsers(data.users)
    } catch (err) {
      console.error(err)
    } finally {
      setIsUsersLoading(false)
    }
  }

  const handleAssignUser = async (userId: string) => {
    if (!assigningTo) return
    try {
      const res = await fetch(`/api/admin/users/${userId}/workspace`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: assigningTo })
      })
      if (res.ok) {
        setAssigningTo(null)
        fetchWorkspaces()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredUsers = unassignedUsers.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`${email} hesabını silmek istediğinize emin misiniz? İçindeki kullanıcıların ataması kaldırılacaktır.`)) return
    try {
      const res = await fetch(`/api/admin/workspaces/${id}`, { method: 'DELETE' })
      if (res.ok) fetchWorkspaces()
    } catch (err) {
      console.error(err)
    }
  }

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  if (loading) return <div className="text-white p-8">Yükleniyor...</div>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Ana Hesaplar (Workspaces)</h1>
          <p className="text-surface-400 mt-1">ChatGPT Business (Proton) hesaplarını ve kontenjanlarını yönetin</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors"
        >
          {isAdding ? 'İptal' : '+ Yeni Hesap Ekle'}
        </button>
      </div>

      {isAdding && (
        <div className="glass p-6 rounded-2xl animate-fade-in border border-brand-500/30">
          <h2 className="text-lg font-semibold text-white mb-4">Yeni Ana Hesap (Proton) Ekle</h2>
          <form onSubmit={handleAddWorkspace} className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-surface-400 mb-1">Email (Proton vb.)</label>
              <input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-2 text-white text-sm" placeholder="gpt@proton.me" />
            </div>
            <div>
              <label className="block text-xs text-surface-400 mb-1">Şifre</label>
              <input required type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-2 text-white text-sm" placeholder="Şifreniz" />
            </div>
            <div>
              <label className="block text-xs text-surface-400 mb-1">Takma Ad (Opsiyonel)</label>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-2 text-white text-sm" placeholder="Hesap 1" />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button type="submit" className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-surface-200">
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {workspaces.length === 0 ? (
          <div className="col-span-full py-12 text-center text-surface-400 glass rounded-2xl">
            Henüz eklenmiş bir ana hesap (Workspace) bulunmuyor.
          </div>
        ) : (
          workspaces.map(ws => {
            const isFull = ws.users.length >= 5
            const colorClass = isFull 
              ? 'border-red-500/50 bg-red-500/5' 
              : 'border-brand-500/30 bg-surface-800/40'
              
            const headerColor = isFull ? 'text-red-400' : 'text-brand-400'

            return (
              <div key={ws.id} className={`glass rounded-2xl border ${colorClass} overflow-hidden shadow-lg shadow-black/20 transition-all hover:border-opacity-100`}>
                <div className="p-5 border-b border-white/5 space-y-2 relative">
                   <div className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded bg-black/50">
                     <span className={headerColor}>{ws.users.length}</span> / 5
                   </div>
                   <h3 className="text-lg font-bold text-white pr-12 truncate" title={ws.name || ws.email}>
                     {ws.name || 'İsimsiz Hesap'}
                   </h3>
                   <div className="text-sm font-mono text-surface-300 truncate">{ws.email}</div>
                   <div className="flex items-center gap-2 cursor-pointer" onClick={() => togglePassword(ws.id)}>
                     <span className="text-xs text-surface-400">Şifre:</span>
                     <span className="text-sm font-mono text-white bg-black/40 px-2 py-0.5 rounded select-all">
                       {showPasswords[ws.id] ? ws.password : '••••••••'}
                     </span>
                     <span className="text-xs opacity-50">{showPasswords[ws.id] ? '🙈' : '👁️'}</span>
                   </div>
                </div>

                <div className="p-4">
                  <h4 className="text-xs font-semibold text-surface-400 mb-3 uppercase tracking-wider">Bağlı Kullanıcılar</h4>
                  <div className="space-y-2 min-h-[140px]">
                    {ws.users.length === 0 ? (
                      <p className="text-sm text-surface-500 text-center py-4">Boş Koltuk (0 Kullanıcı)</p>
                    ) : (
                      ws.users.map((u, i) => (
                        <div key={u.id} className="flex justify-between items-center text-sm p-2 rounded-lg bg-white/5 border border-white/5">
                          <div>
                            <div className="text-white truncate max-w-[150px]" title={u.email}>{u.email}</div>
                            <div className="text-[10px] text-surface-400">Bitiş: {u.subscriptionEnd ? new Date(u.subscriptionEnd).toLocaleDateString() : 'Belirsiz'}</div>
                          </div>
                          <span className="text-xs font-mono text-surface-500">#{i+1}</span>
                        </div>
                      ))
                    )}
                    {Array.from({ length: Math.max(0, 5 - ws.users.length) }).map((_, i) => (
                      <button
                        key={`empty-${i}`}
                        onClick={() => {
                          setAssigningTo(ws.id)
                          fetchUnassignedUsers()
                        }}
                        className="w-full flex items-center justify-center h-[52px] border border-dashed border-white/10 rounded-lg text-surface-500 text-xs hover:border-brand-500/50 hover:text-brand-400 transition-all"
                      >
                        + Boş Kapasite (Ekle)
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-black/20 p-2 text-right">
                  <button onClick={() => handleDelete(ws.id, ws.email)} className="text-xs text-red-500/70 hover:text-red-400 px-2.5 py-1">Sil</button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* User Selection Modal */}
      {assigningTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass w-full max-w-md rounded-2xl shadow-2xl border border-white/10 max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Kullanıcı Ata</h2>
                <button onClick={() => setAssigningTo(null)} className="text-surface-400 hover:text-white">✕</button>
              </div>
              <input
                type="text"
                autoFocus
                placeholder="İsim veya email ile ara..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              {isUsersLoading ? (
                <div className="p-12 text-center text-surface-400">Yükleniyor...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-12 text-center text-surface-500">Uygun (atama bekleyen) kullanıcı bulunamadı.</div>
              ) : (
                <div className="space-y-1">
                  {filteredUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleAssignUser(user.id)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-left transition-colors group border border-transparent hover:border-white/5"
                    >
                      <div>
                        <div className="text-sm font-medium text-white group-hover:text-brand-400 transition-colors">{user.name || 'İsimsiz'}</div>
                        <div className="text-xs text-surface-500">{user.email}</div>
                      </div>
                      <div className="text-[10px] bg-brand-500/10 text-brand-400 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all">
                        Seç ve Ata
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-surface-900/50 text-center">
               <button onClick={() => setAssigningTo(null)} className="text-sm text-surface-400 hover:text-white">Vazgeç</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
