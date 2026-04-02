import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-950 bg-hero-glow">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-lg font-bold text-white">GPT Satış</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-surface-300 hover:text-white transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white hover:from-brand-400 hover:to-brand-600 transition-all duration-300 shadow-lg shadow-brand-500/25"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6 pt-16">
        <div className="max-w-3xl text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-brand-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Premium AI Erişimi
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-white">ChatGPT Business</span>
            <br />
            <span className="gradient-text">Ekip Üyeliği</span>
          </h1>

          <p className="text-lg md:text-xl text-surface-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Uygun fiyatla ChatGPT Business ekip üyeliğine katılın.
            Premium AI özelliklerine anında erişim sağlayın.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="group px-8 py-4 text-base font-semibold rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 text-white hover:from-brand-400 hover:to-brand-600 transition-all duration-300 shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-105"
            >
              Hemen Başla
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <div className="flex items-center gap-2 text-surface-400">
              <span className="text-3xl font-bold text-white">₺250</span>
              <span className="text-sm">/ ay</span>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: '⚡', title: 'Anında Erişim', desc: 'Ödeme onayı sonrası hemen aktif' },
              { icon: '🛡️', title: 'Güvenli', desc: 'Şifreli altyapı, güvenli ödeme' },
              { icon: '💬', title: 'GPT-4 & Daha Fazlası', desc: 'Tüm premium özelliklere erişim' },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-5 glass-hover animate-slide-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <div className="text-sm font-semibold text-white mb-1">{feature.title}</div>
                <div className="text-xs text-surface-400">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
