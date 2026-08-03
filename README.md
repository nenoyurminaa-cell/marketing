# CAK AI — Content & Marketing Strategist Platform

Platform manajemen strategi konten dan otomatisasi laporan multi-brand untuk agency **CAK AI** (mengelola brand UGREEN, AceKid, Golden Rama, Bareksa, Syailendra, Bellastories, dan brand client mendatang).

---

## 🌟 Fitur Utama Berdasarkan Release Phase (Phase 1 — 5)

### 📊 Phase 1: Automated Reporting Pipeline (Highest Priority)
- **Metrics Aggregator Engine**: Parsel CSV data *raw scrape*, kalkulasi otomatis total views, likes, comments, saves, dan shares.
- **Formula Engagement Rate (ER%)**:
  $$\text{ER\%} = \frac{\text{likes} + \text{comments} + \text{saves} + \text{shares}}{\text{views}} \times 100$$
- **Rule Filtering Noise**: Hanya menghitung konten dengan `views > 200 AND (likes + comments + saves + shares) >= 2`.
- **Top Performers Ranking**: Pemilahan otomatis Top 3 by ER% dan Top 3 by Views.
- **Report Narrative Agent (LLM)**: Penyusunan draft narasi *Campaign Overview & Conclusion* berbasis AI dengan editor *Human Approval Gate*.
- **Document Generator Exporter**: Unduh laporan **Excel (.csv)** dan buat slide presentasi **PowerPoint (PPT Deck)** baku agency CAK AI.

### 📈 Phase 2: Follower Snapshot Automation
- Time-series tracking follower mingguan untuk akun TikTok & Instagram.
- Penghitungan otomatis *delta growth* dan *percentage growth* mingguan.

### 📄 Phase 3: Brief Intake Engine
- Parser PDF Brief client dengan ekstraksi otomatis *Goals, Problem Statement, Target Audience*, dan *Product Knowledge*.
- Konfirmasi status brief untuk mengaktifkan layer berikutnya.

### 🎯 Phase 4: Strategy Workspace
- Editor SWOT 4-kolom + **🤖 Research Competitor with AI**.
- Tabel kuota Persona Planning per bulan per segmentasi.
- **Style Reference Analyzer**: Analisis *Mood, Visual Style*, dan *Tone of Voice* dari URL rujukan.

### 📅 Phase 5: Content Breakdown & Calendar
- Kalender interaktif 31 hari per persona.
- Modal detail item konten (*Hook, Format Video/Carousel, Concept Visual/Audio, Copy Angle*).
- **🤖 Trigger AI Breakdown Agent**: Penjadwalan ulang konten adaptif.
- **📤 Export ke Tim Produksi**: Menghasilkan file brief khusus copywriter & video editor (`Copywriting_Brief_[Brand].txt`).

---

## 📁 Struktur Berkas Proyek

```
cak-ai-platform/
├── index.html            # Core SPA HTML layout
├── styles.css            # Master Glassmorphism CSS design system
├── app.js                # State management & interactive event handlers (Phase 1-5)
├── mockData.js           # Dataset awal brand, raw CSV, snapshots, & brief mock
├── metricsAggregator.js  # Engine kalkulasi ER% & filter deterministik
├── narrativeAgent.js     # AI Report Narrative Agent prompt engine
├── documentExporter.js   # Generator export Excel (.csv) & PPT Slide Presentation
├── schema.sql            # DDL SQL Supabase PostgreSQL (12 tabel + index)
├── server.py            # Backend API FastAPI (Python core)
├── test_engine.py        # Verification test suite
└── requirements.txt      # Python dependencies list
```

---

## 🗄️ Setup Database (Supabase PostgreSQL)

1. Buka SQL Editor di Supabase Dashboard kamu.
2. Jalankan seluruh perintah SQL DDL yang terdapat pada berkas [schema.sql](file:///C:/Users/Neno/.gemini/antigravity-ide/scratch/cak-ai-platform/schema.sql).
3. 12 tabel dan 3 index rekomendasi akan otomatis terbuat.

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Membuka Frontend Web Application:
Cukup buka file [index.html](file:///C:/Users/Neno/.gemini/antigravity-ide/scratch/cak-ai-platform/index.html) menggunakan browser (Chrome, Edge, Firefox, Safari).

### 2. (Opsional) Menjalankan FastAPI Backend Core:
```bash
pip install -r requirements.txt
python server.py
```
Backend API akan berjalan di `http://localhost:8000`.

### 3. Menjalankan Verifikasi Test Suite:
```bash
python test_engine.py
```
