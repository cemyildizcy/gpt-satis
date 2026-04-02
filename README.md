# 🚀 Paylaşımlı AI (SaaS) Platformu

Modern, güvenli ve ölçeklenebilir; yapay zeka aboneliklerini paylaşımlı olarak (örneğin ChatGPT Business) yönetmek için geliştirilmiş tam yığın (Full-Stack) SaaS platformu.

## 🌟 Proje Hakkında
Bu proje, kullanıcıların sisteme kayıt olduğu, IBAN tabanlı veya dış entegre (dekont yükleme) ödeme bildirimlerini geçerek sistem üzerinde paylaşımlı dijital üyelik hakları (Abonelik Kalan Süre Canlı Takibi) elde ettiği bulut yerel (cloud-native) bir SaaS altyapısıdır. 

Mimarisi tamamen **Serverless (Sunucusuz)** prensiplere göre tasarlanmış olup; veritabanı yönetiminden, bulut ortamında dosya/isim eşleştirme (Storage) sistemlerine kadar endüstri standartlarında teknolojiler barındırmaktadır.

![Tech Stack](https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,prisma,postgres,supabase,vercel,docker&theme=dark)

## 🛠 Kullanılan Teknolojiler

*   **Frontend End-to-End:** Next.js 14 (App Router), React, Tailwind CSS (Glassmorphism UI)
*   **Backend & API:** Next.js Server Actions & API Routes, TypeScript
*   **Database & ORM:** PostgreSQL (Supabase Connection Pooling), Prisma ORM
*   **Cloud Storage:** Supabase Buckets (Dosya yükleme & barındırma)
*   **Authentication:** Custom JWT-based Auth (Jose, HTTP-Only Secure Cookies, bcryptjs)
*   **DevOps & Deployment:** Vercel (CI/CD), Dockerization (Platform-agnostic readiness)

## ✨ Temel Özellikler

*   **Rol Tabanlı Erişim Yönetimi (RBAC):** Admin ve standart User ayırımlı; middleware katmanında korunan sayfa yönlendirmeleri.
*   **Real-time Dashboard:** Kullanıcıların saniyesine kadar aktif abonelik bitim sürelerini takip ettiği canlı sayaç ve durum yönetimi.
*   **File Upload & CDN:** Kullanıcıların ödeme dekontlarını sürükle-bırak yoluyla yüklediği yapı ve bunu cloud storage (Supabase S3) üzerinde public olarak okunabilir formda saklama.
*   **Gelişmiş Yönetici (Admin) Paneli:**
    - Üyelerin abonelik sürelerini manuel/otomatik (dekont onaylama senaryolu) uzatma veya durdurma.
    - Dekontları Red/Onay şeklinde inceleyerek kullanıcılara geri dönüş yapma.
    - Sistemdeki tüm işlemleri denetlemek için anlık **Audit Log** (Denetim Kayıtları) sistemi.
*   **Güvenlik (Security):** `next.config` XSS/Clickjacking korumaları, rate-limiting mekanizması ve şifrelenmiş form validasyonları (Zod).

## 💻 Kurulum (Local Development)

Projeyi kendi bilgisayarınızda çalıştırmak için:

```bash
# 1. Repoyu klonlayın
git clone <sizin-github-linkiniz>

# 2. Gerekli kütüphaneleri indirin
npm install

# 3. Ortam değişkenlerini ayarlayın
# .env dosyası oluşturup sırasıyla Postgres (DATABASE_URL), Supabase Anon Key gibi ayarları set edin.

# 4. Veritabanını eşzamanlayın
npx prisma db push

# 5. Geliştirme sunucusunu başlatın
npm run dev
```

(Daha sonra `localhost:3000` adresinden projenizi görebilirsiniz.)

---
**Geliştiren:** Cem YILDIZ
