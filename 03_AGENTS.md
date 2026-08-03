# Agent Architecture — CAK Content & Marketing Strategist Platform

Filosofi: setiap agent scope-nya spesifik dan single-purpose. Yang membutuhkan reasoning & LLM judgment menggunakan **Google Gemini API** (`gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-2.0-flash`), sedangkan yang murni perhitungan metrik menggunakan kode deterministik (bukan LLM) — agar super cepat, reliable, dan hasilnya konsisten.

---

## 🤖 Orchestrator
Router utama yang mengatur alur antar agent berdasarkan layer aktif (Brief Intake / Strategy / Content Breakdown / Reporting). Orchestrator melakukan context passing & model selection ke Google Gemini API.

---

## 📄 Layer 1 — Brief Intake

**Agent: Brief Extraction Agent (Powered by Gemini API)**
- **Input**: Teks / Dokumen brief client.
- **Proses**: Google Gemini API mengekstrak field terstruktur (Brand name, Product knowledge, Campaign goals, Timeline, Problem statement, Target audience).
- **Output**: JSON terstruktur → disimpan ke state & database.
- **Human Gate**: Strategist me-review & edit sebelum konfirmasi ke layer strategy.

---

## 🎯 Layer 2 — Strategy Workspace

**Agent: Competitor Research Agent (Powered by Gemini API)**
- **Input**: Nama brand + kategori industri.
- **Proses**: Gemini AI menganalisis diferensiasi & positioning kompetitor langsung.
- **Output**: Draft SWOT & Competitor insight card.
- **Human Gate**: Strategist memfinalisasi insight.

**Agent: Style Reference Analyzer Agent (Powered by Gemini Multimodal)**
- **Input**: URL referensi konten (TikTok / Instagram).
- **Proses**: Gemini menganalisis visual style, mood, lighting, pacing, dan tone of voice.
- **Output**: Record preferensi style visual brand.

---

## 📅 Layer 3 — Content Breakdown & Calendar

**Agent: Trend Hook & Calendar Agent (Powered by Gemini API)**
- **Input**: Brief confirmed + Persona Plan + Target kuota bulanan.
- **Proses**: Gemini AI merancang kalender 30 hari konten lengkap dengan Hook viral, format (Video/Carousel), konsep visual/audio, dan draft script angle.
- **Output**: Records kalender konten interaktif.
- **Human Gate**: Strategist me-review sebelum di-export ke tim copywriter/editor.

---

## ⚡ Layer 4 — Reporting Generator (Phase 1 Highest Priority)

**Agent: Metrics Aggregator (Deterministic Code / Bukan LLM)**
- **Input**: Raw Scrape CSV (`posts`) + `follower_snapshots`.
- **Proses**: Menghitung total views, likes, comments, saves, shares, ER% dengan formula:
  $$\text{ER\%} = \frac{\text{likes} + \text{comments} + \text{saves} + \text{shares}}{\text{views}} \times 100$$
  dengan filter `views > 200` AND `engagement >= 2`. Mengidentifikasi Top 3 by ER & Top 3 by Views.
- **Output**: Structured metrics object.

**Agent: Report Narrative Agent (Powered by Gemini API)**
- **Input**: Metrics Aggregator data + Follower growth delta.
- **Proses**: Google Gemini API menyusun narasi profesional *Campaign Overview* dan *Strategic Next Steps Recommendations* dalam Bahasa Indonesia untuk presentasi client.
- **Output**: Draft narasi di editor approval.
- **Human Gate**: **Wajib** — Strategist meninjau dan mengedit narasi sebelum di-export.

**Agent: Document Generator Engine (Deterministic Code / Export Excel & PPT)**
- **Input**: Metrics terverifikasi + Approved narrative.
- **Proses**: Auto-generate file Excel (.csv) dan presentasi PPT Presentation Slide Deck (.pptx / printable web slide deck).
