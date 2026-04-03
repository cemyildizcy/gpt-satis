import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-brand-500/30 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500/20 rounded-full blur-[128px] opacity-50 mix-blend-screen pointer-events-none" />
      <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] opacity-50 mix-blend-screen pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#050505]/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">AIPass</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:block px-4 py-2 text-sm font-medium text-surface-400 hover:text-white transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 text-sm font-bold rounded-full bg-white text-black hover:bg-surface-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center pt-32 pb-20 px-6">
        {/* Hero Section */}
        <section className="w-full max-w-5xl mx-auto text-center mt-12 md:mt-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-surface-300 mb-8 border-brand-500/30">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse shadow-[0_0_10px_rgba(0,255,0,0.8)]"></span>
            GPT-5 ve Sora Erişimleri Aktif
          </div>

          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1]">
            <span className="text-white">Yapay Zekanın</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-purple-400 to-brand-300">
              Sınırlarını Kaldırın.
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-surface-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Bireysel abonelik için <span className="line-through opacity-70">$30 (1000+ ₺)</span> ödemekten kurtulun. Paylaşımlı gücümüzle en güncel OpenAI modellerine sadece <strong className="text-white font-bold">250 ₺</strong>'ye limitsiz erişin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
            <Link
              href="/register"
              className="group relative px-8 py-4 text-lg font-bold rounded-full bg-white text-black overflow-hidden hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center gap-2">
                Hemen Üye Ol — 250 ₺
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
            <div className="flex flex-col items-start gap-1 text-surface-400 text-sm">
              <span className="flex items-center gap-1">✓ <strong className="text-white">Anında Teslimat</strong></span>
              <span className="flex items-center gap-1">✓ <strong className="text-white">GPT-5 Tam Erişim</strong></span>
            </div>
          </div>
        </section>

        {/* Features Banners */}
        <section className="w-full max-w-6xl mx-auto mt-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Tek Üyelik. Tüm Güç.</h2>
            <p className="text-surface-400 text-lg">AIPass ile sahip olacağınız premium özellikler</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="relative group p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative h-full bg-[#0a0a0a] rounded-[23px] p-8">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center text-3xl mb-6">🤖</div>
                <h3 className="text-2xl font-bold text-white mb-3">GPT-5 Limitsiz</h3>
                <p className="text-surface-400 leading-relaxed">
                  OpenAI'ın en güncel, en akıllı ve en hızlı modeli olan GPT-5'e limit takılmadan tam erişim sağlayın.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative group p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative h-full bg-[#0a0a0a] rounded-[23px] p-8">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-3xl mb-6">🎥</div>
                <h3 className="text-2xl font-bold text-white mb-3">Sora Video</h3>
                <p className="text-surface-400 leading-relaxed">
                  Sadece metin yazarak dakikalar içinde 4K kalitesinde, baş döndürücü sinematik videolar (Sora) oluşturun.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative group p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative h-full bg-[#0a0a0a] rounded-[23px] p-8">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-3xl mb-6">🎨</div>
                <h3 className="text-2xl font-bold text-white mb-3">DALL-E 3</h3>
                <p className="text-surface-400 leading-relaxed">
                  Fikirlerinizi ultra yüksek çözünürlüklü logolara, çizimlere ve konsept sanat fotoğraflarına dönüştürün.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="relative group p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative h-full bg-[#0a0a0a] rounded-[23px] p-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-3xl mb-6">💻</div>
                <h3 className="text-2xl font-bold text-white mb-3">Codex & Data</h3>
                <p className="text-surface-400 leading-relaxed">
                  İhtiyacınız olan uygulamaları kodlatın, hataları düzelttirin (Codex) veya devasa Excel/Veri doyalarınızı analiz ettirin.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="relative group p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent overflow-hidden md:col-span-2 lg:col-span-2">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative h-full bg-[#0a0a0a] rounded-[23px] p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-3xl mb-6">👁️</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Vision, Voice & Ajanlar</h3>
                  <p className="text-surface-400 leading-relaxed">
                    Uygulamaya resimler göstererek soru sorun, canlı sesli sohbetler edin ve spesifik işleriniz (<strong className="text-white">Custom GPTs</strong>) için özel yapay zeka ajanları kullanın. Hepsi dahil!
                  </p>
                </div>
                <div className="flex-none p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-center w-full md:w-auto">
                    <p className="text-sm text-surface-400 mb-2">Başlangıç Sadece</p>
                    <p className="text-4xl font-black tracking-tight text-white mb-4">₺250<span className="text-surface-400 text-lg font-medium">/ay</span></p>
                    <Link href="/register" className="block w-full px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">Yerinizi Ayırtın</Link>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded bg-brand-500 text-center text-xs font-bold flex items-center justify-center">A</div>
             <span className="text-surface-300 font-medium">AIPass © 2025</span>
          </div>
          <div className="text-surface-500 text-sm">
            Paylaşımlı AI Erişimi Yönetim Platformu
          </div>
        </div>
      </footer>
    </div>
  )
}
