import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'AIPass <iletisim@aipass.com.tr>'

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: '🎉 AIPass\'e Hoş Geldiniz!',
      html: getWelcomeTemplate(name),
    })
    console.log(`✅ Welcome email sent to ${to}`)
  } catch (error) {
    console.error('❌ Email send error:', error)
  }
}

export async function sendPaymentApprovedEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: '✅ Ödemeniz Onaylandı — AIPass',
      html: getPaymentApprovedTemplate(name),
    })
    console.log(`✅ Payment approved email sent to ${to}`)
  } catch (error) {
    console.error('❌ Email send error:', error)
  }
}

export async function sendSubscriptionActiveEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: '🚀 Hesabınız Aktif — AIPass',
      html: getSubscriptionActiveTemplate(name),
    })
    console.log(`✅ Subscription active email sent to ${to}`)
  } catch (error) {
    console.error('❌ Email send error:', error)
  }
}

export async function sendSetupGuideEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "AIPass'e Hoş Geldin \u2013 Kurulum Bilgileri",
      html: getSetupGuideTemplate(name),
    })
    console.log(`✅ Setup guide email sent to ${to}`)
  } catch (error) {
    console.error('❌ Email send error:', error)
  }
}

// ─── Email Templates ─────────────────────────────────────

function baseTemplate(content: string) {
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width:600px; margin:0 auto; padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center; margin-bottom:40px;">
      <div style="display:inline-block; background: linear-gradient(135deg, #7c5cfc, #5e30d6); padding:12px 16px; border-radius:16px; margin-bottom:12px;">
        <span style="color:#fff; font-size:24px; font-weight:800;">A</span>
      </div>
      <h1 style="color:#ffffff; font-size:28px; font-weight:800; margin:8px 0 0 0; letter-spacing:-0.5px;">AIPass</h1>
    </div>

    <!-- Card -->
    <div style="background: linear-gradient(145deg, #111111, #0a0a0a); border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:40px 32px;">
      ${content}
    </div>

    <!-- Footer -->
    <div style="text-align:center; margin-top:32px;">
      <p style="color:#555; font-size:12px; margin:0;">© 2025 AIPass — Yapay Zeka Erişim Platformu</p>
      <p style="color:#444; font-size:12px; margin:4px 0 0 0;">
        <a href="https://aipass.com.tr" style="color:#7c5cfc; text-decoration:none;">aipass.com.tr</a>
      </p>
    </div>
  </div>
</body>
</html>`
}

function getWelcomeTemplate(name: string) {
  return baseTemplate(`
    <h2 style="color:#ffffff; font-size:22px; font-weight:700; margin:0 0 8px 0;">Hoş Geldiniz, ${name || 'Değerli Üyemiz'}! 🎉</h2>
    <p style="color:#999; font-size:15px; line-height:1.6; margin:0 0 24px 0;">
      AIPass ailesine katıldığınız için çok mutluyuz. ChatGPT Business'ın tüm premium özelliklerine 
      (GPT-4o, Sora, DALL-E 3, Codex ve daha fazlası) erişmenize sadece birkaç adım kaldı.
    </p>

    <div style="background:rgba(124,92,252,0.1); border:1px solid rgba(124,92,252,0.2); border-radius:16px; padding:20px; margin-bottom:24px;">
      <p style="color:#ffffff; font-size:14px; font-weight:600; margin:0 0 12px 0;">📋 Sonraki Adımlar:</p>
      <table style="width:100%;">
        <tr>
          <td style="color:#7c5cfc; font-size:14px; font-weight:700; padding:4px 12px 4px 0; vertical-align:top;">1.</td>
          <td style="color:#ccc; font-size:14px; line-height:1.5; padding:4px 0;">Panelinizdeki <strong style="color:#fff;">Ödeme</strong> bölümünden dekontunuzu yükleyin.</td>
        </tr>
        <tr>
          <td style="color:#7c5cfc; font-size:14px; font-weight:700; padding:4px 12px 4px 0; vertical-align:top;">2.</td>
          <td style="color:#ccc; font-size:14px; line-height:1.5; padding:4px 0;">Ödemeniz admin tarafından onaylanacaktır.</td>
        </tr>
        <tr>
          <td style="color:#7c5cfc; font-size:14px; font-weight:700; padding:4px 12px 4px 0; vertical-align:top;">3.</td>
          <td style="color:#ccc; font-size:14px; line-height:1.5; padding:4px 0;">Hesabınız aktifleştirilecek ve erişim bilgileriniz gönderilecek!</td>
        </tr>
      </table>
    </div>

    <div style="text-align:center; margin-bottom:24px;">
      <a href="https://aipass.com.tr/dashboard" 
         style="display:inline-block; background:linear-gradient(135deg, #7c5cfc, #5e30d6); color:#ffffff; font-size:15px; font-weight:700; text-decoration:none; padding:14px 36px; border-radius:12px;">
        Panelime Git →
      </a>
    </div>

    <div style="border-top:1px solid rgba(255,255,255,0.06); padding-top:20px;">
      <p style="color:#666; font-size:13px; line-height:1.5; margin:0;">
        Herhangi bir sorunuz varsa panelinizdeki <strong style="color:#999;">Destek</strong> bölümünden 
        bize ulaşabilir veya <a href="mailto:iletisim@aipass.com.tr" style="color:#7c5cfc; text-decoration:none;">iletisim@aipass.com.tr</a> 
        adresine yazabilirsiniz.
      </p>
    </div>
  `)
}

function getPaymentApprovedTemplate(name: string) {
  return baseTemplate(`
    <h2 style="color:#ffffff; font-size:22px; font-weight:700; margin:0 0 8px 0;">Ödemeniz Onaylandı ✅</h2>
    <p style="color:#999; font-size:15px; line-height:1.6; margin:0 0 24px 0;">
      Merhaba ${name || 'Değerli Üyemiz'}, dekontunuz başarıyla incelendi ve ödemeniz onaylandı. 
      Hesabınız kısa süre içinde aktifleştirilecektir.
    </p>

    <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.2); border-radius:16px; padding:20px; margin-bottom:24px;">
      <p style="color:#10b981; font-size:14px; font-weight:600; margin:0;">
        💰 Ödeme durumunuz: <strong>ONAYLANDI</strong>
      </p>
    </div>

    <div style="text-align:center;">
      <a href="https://aipass.com.tr/dashboard" 
         style="display:inline-block; background:linear-gradient(135deg, #10b981, #059669); color:#ffffff; font-size:15px; font-weight:700; text-decoration:none; padding:14px 36px; border-radius:12px;">
        Panelimi Kontrol Et →
      </a>
    </div>
  `)
}

function getSubscriptionActiveTemplate(name: string) {
  return baseTemplate(`
    <h2 style="color:#ffffff; font-size:22px; font-weight:700; margin:0 0 8px 0;">Hesabınız Aktif! 🚀</h2>
    <p style="color:#999; font-size:15px; line-height:1.6; margin:0 0 24px 0;">
      Merhaba ${name || 'Değerli Üyemiz'}, ChatGPT Business hesabınız başarıyla aktifleştirildi! 
      Artık GPT-4o, Sora, DALL-E 3 ve tüm diğer premium özelliklerden yararlanabilirsiniz.
    </p>

    <div style="background:rgba(124,92,252,0.1); border:1px solid rgba(124,92,252,0.2); border-radius:16px; padding:20px; margin-bottom:24px;">
      <p style="color:#ffffff; font-size:14px; font-weight:600; margin:0 0 8px 0;">🔑 Erişim Bilgileriniz:</p>
      <p style="color:#ccc; font-size:14px; line-height:1.6; margin:0;">
        Giriş bilgileriniz panelinizdeki <strong style="color:#fff;">Dashboard</strong> sayfasında görüntülenebilir. 
        Detaylı talimatlar için panelinizi kontrol edin.
      </p>
    </div>

    <div style="text-align:center;">
      <a href="https://aipass.com.tr/dashboard" 
         style="display:inline-block; background:linear-gradient(135deg, #7c5cfc, #5e30d6); color:#ffffff; font-size:15px; font-weight:700; text-decoration:none; padding:14px 36px; border-radius:12px;">
        ChatGPT'yi Kullanmaya Başla →
      </a>
    </div>
  `)
}

function getSetupGuideTemplate(name: string) {
  return baseTemplate(`
    <p style="color:#999; font-size:16px; margin:0 0 16px 0;">Merhaba 👋</p>
    <h2 style="color:#ffffff; font-size:22px; font-weight:700; margin:0 0 8px 0;">AIPass'e hoş geldin!</h2>
    <p style="color:#999; font-size:15px; line-height:1.6; margin:0 0 24px 0;">
      Hesabın başarıyla oluşturuldu. Şimdi sana kısaca kurulum sürecini anlatıyoruz:
    </p>

    <!-- Kurulum Adımları -->
    <div style="background:rgba(124,92,252,0.1); border:1px solid rgba(124,92,252,0.2); border-radius:16px; padding:24px; margin-bottom:24px;">
      <p style="color:#ffffff; font-size:15px; font-weight:700; margin:0 0 16px 0;">🔷 Kurulum Adımları</p>
      <table style="width:100%; border-collapse:collapse;">
        <tr>
          <td style="color:#7c5cfc; font-size:15px; font-weight:700; padding:8px 14px 8px 0; vertical-align:top;">1.</td>
          <td style="color:#ccc; font-size:14px; line-height:1.6; padding:8px 0;">Kısa süre içinde OpenAI tarafından sana bir <strong style="color:#fff;">davet maili</strong> gönderilecek.</td>
        </tr>
        <tr>
          <td style="color:#7c5cfc; font-size:15px; font-weight:700; padding:8px 14px 8px 0; vertical-align:top;">2.</td>
          <td style="color:#ccc; font-size:14px; line-height:1.6; padding:8px 0;">Mailin içindeki <strong style="color:#fff;">bağlantıya tıkla.</strong></td>
        </tr>
        <tr>
          <td style="color:#7c5cfc; font-size:15px; font-weight:700; padding:8px 14px 8px 0; vertical-align:top;">3.</td>
          <td style="color:#ccc; font-size:14px; line-height:1.6; padding:8px 0;">Açılan sayfada <strong style="color:#fff;">hesabınla giriş yap.</strong></td>
        </tr>
        <tr>
          <td style="color:#7c5cfc; font-size:15px; font-weight:700; padding:8px 14px 8px 0; vertical-align:top;">4.</td>
          <td style="color:#ccc; font-size:14px; line-height:1.6; padding:8px 0;">Çalışma alanı (workspace) olarak <strong style="color:#fff;">&quot;AIPass&quot;</strong> seç.</td>
        </tr>
      </table>
      <p style="color:#999; font-size:14px; line-height:1.6; margin:16px 0 0 0;">
        Bu işlemleri tamamladıktan sonra hesabın aktif şekilde kullanıma hazır olacaktır 🚀
      </p>
    </div>

    <!-- Önemli Not -->
    <div style="background:rgba(251,191,36,0.08); border:1px solid rgba(251,191,36,0.2); border-radius:16px; padding:16px 20px; margin-bottom:24px;">
      <p style="color:#fbbf24; font-size:14px; font-weight:600; margin:0 0 4px 0;">⚠️ Önemli Not:</p>
      <p style="color:#ccc; font-size:14px; line-height:1.5; margin:0;">
        Eğer davet maili gelmezse <strong style="color:#fff;">spam klasörünü</strong> kontrol etmeyi unutma.
      </p>
    </div>

    <!-- Yardım -->
    <div style="background:rgba(124,92,252,0.05); border:1px solid rgba(255,255,255,0.06); border-radius:16px; padding:20px; margin-bottom:24px;">
      <p style="color:#ffffff; font-size:14px; font-weight:600; margin:0 0 12px 0;">🛠 Yardım Gerekirse</p>
      <p style="color:#999; font-size:14px; line-height:1.6; margin:0 0 12px 0;">
        Kurulumda sorun yaşarsan bize kolayca ulaşabilirsin:
      </p>
      <p style="color:#ccc; font-size:14px; line-height:1.6; margin:0 0 4px 0;">
        👉 <strong style="color:#fff;">WhatsApp destek:</strong>
      </p>
      <p style="margin:0 0 12px 0;">
        <a href="https://wa.me/905344630465" style="color:#7c5cfc; text-decoration:none; font-size:14px;">https://wa.me/905344630465</a>
      </p>
      <p style="color:#999; font-size:14px; line-height:1.5; margin:0;">
        ya da bu maile direkt yanıt vererek bizimle iletişime geçebilirsin.
      </p>
    </div>

    <!-- İmza -->
    <div style="border-top:1px solid rgba(255,255,255,0.06); padding-top:20px;">
      <p style="color:#999; font-size:14px; line-height:1.6; margin:0 0 4px 0;">Herhangi bir sorunda yanındayız 🤝</p>
      <p style="color:#999; font-size:14px; margin:0 0 12px 0;">İyi kullanımlar dileriz!</p>
      <p style="color:#ffffff; font-size:15px; font-weight:700; margin:0;">Cem YILDIZ</p>
    </div>
  `)
}
