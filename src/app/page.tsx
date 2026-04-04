import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const features = [
    {
      icon: '🤖',
      title: 'GPT-5 Limitsiz',
      desc: 'OpenAI\'ın en son, en güçlü yapay zeka modeline sınırsız erişim. Günlük limit yok, kısıtlama yok.',
      gradient: 'from-brand-500/20 to-purple-500/20',
      iconBg: 'bg-brand-500/20 text-brand-400',
    },
    {
      icon: '🎥',
      title: 'Sora Video Üretimi',
      desc: 'Metin yazarak saniyeler içinde sinematik kalitede videolar üretin. Sosyal medya içeriklerinizi devrimleştirin.',
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconBg: 'bg-purple-500/20 text-purple-400',
    },
    {
      icon: '🎨',
      title: 'DALL-E 3 Görsel',
      desc: 'Fikirlerinizi ultra yüksek çözünürlüklü görsellere, logolara ve konsept sanata dönüştürün.',
      gradient: 'from-orange-500/20 to-red-500/20',
      iconBg: 'bg-orange-500/20 text-orange-400',
    },
    {
      icon: '💻',
      title: 'Codex & Veri Analizi',
      desc: 'Kod yazdırın, hataları buldurun veya devasa veri dosyalarınızı saniyeler içinde analiz ettirin.',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconBg: 'bg-blue-500/20 text-blue-400',
    },
    {
      icon: '👁️',
      title: 'Vision & Sesli Sohbet',
      desc: 'Görselleri analiz ettirin, canlı sesli konuşmalar yapın. İnsan gibi etkileşimli bir yapay zeka deneyimi.',
      gradient: 'from-teal-500/20 to-emerald-500/20',
      iconBg: 'bg-teal-500/20 text-teal-400',
    },
    {
      icon: '🧩',
      title: 'Custom GPTs & Ajanlar',
      desc: 'Kendi iş akışlarınıza özel yapay zeka ajanları oluşturun ve kullanın. Tam otomasyon gücü elinizde.',
      gradient: 'from-rose-500/20 to-orange-500/20',
      iconBg: 'bg-rose-500/20 text-rose-400',
    },
  ]

  const steps = [
    { num: '01', title: 'Kayıt Olun', desc: 'Ücretsiz hesap oluşturun, 30 saniyeden kısa sürer.' },
    { num: '02', title: 'Ödeme Yapın', desc: 'Banka havalesiyle aylık 250 ₺ ödeme yapın ve dekontunuzu yükleyin.' },
    { num: '03', title: 'Erişim Kazanın', desc: 'Admin onayı sonrası ChatGPT Business hesap bilgileriniz anında aktif olur.' },
  ]

  const comparisons = [
    { feature: 'GPT-5 Erişimi', us: true, them: true },
    { feature: 'Sora Video Üretimi', us: true, them: true },
    { feature: 'DALL-E 3', us: true, them: true },
    { feature: 'Codex & Veri Analizi', us: true, them: true },
    { feature: 'Custom GPTs', us: true, them: true },
    { feature: 'Aylık Fiyat', us: '250 ₺', them: '1.000+ ₺' },
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-brand-500/30 overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-500/8 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[160px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo.png" alt="AIPass Logo" width={40} height={40} className="rounded-xl shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow" />
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">AIPass</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block px-5 py-2.5 text-sm font-medium text-surface-400 hover:text-white transition-colors">
              Giriş Yap
            </Link>
            <Link href="/register" className="px-6 py-2.5 text-sm font-bold rounded-full bg-white text-black hover:bg-surface-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105">
              Hemen Başla
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* ═══════════════════════════════════════ */}
        {/* HERO SECTION */}
        {/* ═══════════════════════════════════════ */}
        <section className="pt-40 pb-24 px-6">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-brand-500/30 bg-brand-500/5 backdrop-blur-md text-sm font-medium text-surface-300 mb-10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              GPT-5, Sora ve tüm Premium Özellikler Aktif
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.05]">
              <span className="text-white">Yapay Zekanın</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400">
                Tam Gücünü Kullanın.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-surface-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Bireysel abonelik için <span className="line-through opacity-60">aylık $30 (1.000+ ₺)</span> ödemek yerine, 
              AIPass ile ChatGPT Business&apos;ın tüm gücüne sadece <strong className="text-white font-bold">250 ₺</strong>&apos;ye erişin.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-8">
              <Link
                href="/register"
                className="group relative px-10 py-4 text-lg font-bold rounded-full bg-white text-black overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                  Ücretsiz Kayıt Ol
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
              <div className="flex items-center gap-6 text-sm text-surface-400">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  <strong className="text-white">Anında Teslimat</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  <strong className="text-white">İptal Garantisi</strong>
                </span>
              </div>
            </div>

            {/* Trust bar */}
            <p className="text-xs text-surface-500 mt-6">Kredi kartı gerekmez • Türk lirası ile ödeme • 7/24 destek</p>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* SOCIAL PROOF BAR */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-10 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
            <div className="text-center">
              <p className="text-3xl font-black text-white">500+</p>
              <p className="text-xs text-surface-500 mt-1">Aktif Kullanıcı</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-black text-white">%75</p>
              <p className="text-xs text-surface-500 mt-1">Tasarruf Oranı</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-black text-white">4.9/5</p>
              <p className="text-xs text-surface-500 mt-1">Kullanıcı Memnuniyeti</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-black text-white">7/24</p>
              <p className="text-xs text-surface-500 mt-1">Teknik Destek</p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* FEATURES GRID */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-28 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-brand-400 font-semibold text-sm tracking-wider uppercase mb-3">Özellikler</p>
              <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">Tek Üyelik. Sınırsız Güç.</h2>
              <p className="text-surface-400 text-lg max-w-2xl mx-auto">AIPass ile ChatGPT Business planının sunduğu tüm premium özelliklere erişin.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <div key={i} className="group relative p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative h-full bg-[#0a0a0a] rounded-[23px] p-7 hover:bg-[#0d0d0d] transition-colors">
                    <div className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center text-2xl mb-5`}>{f.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-surface-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* HOW IT WORKS */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-28 px-6 bg-white/[0.01]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-brand-400 font-semibold text-sm tracking-wider uppercase mb-3">Nasıl çalışır?</p>
              <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">3 Adımda Başlayın</h2>
              <p className="text-surface-400 text-lg">Karmaşık süreçler yok. Kayıt olun, ödeme yapın, erişmeye başlayın.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((s, i) => (
                <div key={i} className="relative text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-500/20 group-hover:border-brand-500/40 transition-all">
                    <span className="text-brand-400 font-black text-lg">{s.num}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-surface-400 text-sm leading-relaxed">{s.desc}</p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 -right-4 text-surface-700 text-2xl">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* COMPARISON TABLE */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-28 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-brand-400 font-semibold text-sm tracking-wider uppercase mb-3">Karşılaştırma</p>
              <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">Neden AIPass?</h2>
              <p className="text-surface-400 text-lg">Aynı özellikler, çok daha düşük fiyat.</p>
            </div>

            <div className="glass rounded-3xl overflow-hidden">
              <div className="grid grid-cols-3 bg-white/5 border-b border-white/5">
                <div className="p-5 text-sm font-semibold text-surface-400">Özellik</div>
                <div className="p-5 text-sm font-bold text-brand-400 text-center">AIPass</div>
                <div className="p-5 text-sm font-semibold text-surface-500 text-center">Bireysel Plan</div>
              </div>
              {comparisons.map((c, i) => (
                <div key={i} className="grid grid-cols-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <div className="p-5 text-sm text-surface-300">{c.feature}</div>
                  <div className="p-5 text-center">
                    {typeof c.us === 'boolean' ? (
                      <span className="text-emerald-400 text-lg">✓</span>
                    ) : (
                      <span className="text-white font-bold text-lg">{c.us}</span>
                    )}
                  </div>
                  <div className="p-5 text-center">
                    {typeof c.them === 'boolean' ? (
                      <span className="text-surface-500 text-lg">✓</span>
                    ) : (
                      <span className="text-red-400/70 font-bold text-lg line-through">{c.them}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* PRICING CTA */}
        {/* ═══════════════════════════════════════ */}
        <section className="py-28 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative glass rounded-[32px] p-12 md:p-16 text-center overflow-hidden glow">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-purple-500/10 pointer-events-none" />
              <div className="relative z-10">
                <p className="text-brand-400 font-semibold text-sm tracking-wider uppercase mb-4">Fiyatlandırma</p>
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                  Aylık sadece <span className="gradient-text">250 ₺</span>
                </h2>
                <p className="text-surface-400 text-lg mb-3 max-w-xl mx-auto">
                  Bireysel ChatGPT Plus aboneliğinin <strong className="text-white">%75 daha ucuzuna</strong> tüm premium özelliklere sahip olun.
                </p>
                <p className="text-surface-500 text-sm mb-10">Taahhüt yok • İstediğiniz zaman iptal edin • Türk lirası ile ödeme</p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="group px-10 py-4 text-lg font-bold rounded-full bg-gradient-to-r from-brand-500 to-brand-700 text-white hover:from-brand-400 hover:to-brand-600 transition-all duration-300 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      Hemen Üye Ol
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </Link>
                  <Link href="/login" className="text-surface-400 hover:text-white text-sm font-medium transition-colors">
                    Zaten üye misiniz? Giriş yapın →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="AIPass" width={24} height={24} className="rounded" />
              <span className="text-surface-300 font-medium">AIPass © 2025</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-surface-500">
              <span>Paylaşımlı AI Erişim Platformu</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">aipass.com.tr</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
