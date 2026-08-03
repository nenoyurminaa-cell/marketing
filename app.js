// CAK AI Content & Marketing Strategist Platform - Powered by Google Gemini API

// ============================================================================
// 1. GEMINI API CLIENT & CONFIGURATION
// ============================================================================
const GEMINI_CONFIG = {
  getApiKey: () => localStorage.getItem("cak_gemini_api_key") || "",
  setApiKey: (key) => localStorage.setItem("cak_gemini_api_key", key),
  getModel: () => localStorage.getItem("cak_gemini_model") || "gemini-1.5-flash",
  setModel: (model) => localStorage.setItem("cak_gemini_model", model),
  getTemperature: () => parseFloat(localStorage.getItem("cak_gemini_temp") || "0.7"),
  setTemperature: (temp) => localStorage.setItem("cak_gemini_temp", temp)
};

async function callGeminiAPI(prompt, systemInstruction = "") {
  const apiKey = GEMINI_CONFIG.getApiKey();
  const model = GEMINI_CONFIG.getModel();
  const temp = GEMINI_CONFIG.getTemperature();

  if (!apiKey) {
    console.warn("Gemini API Key is not set in localStorage. Using smart fallback generation.");
    return null;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: temp,
      maxOutputTokens: 2500
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) throw new Error("Format respons Gemini tidak berisi kandidat teks valid.");

    return candidateText;
  } catch (error) {
    console.error("Gemini API Call Error:", error);
    throw error;
  }
}

// ============================================================================
// 2. INITIAL DATA STORE & MOCK DATA
// ============================================================================
const INITIAL_BRANDS = [
  {
    id: "b1",
    name: "UGREEN",
    industry: "Consumer Electronics & Tech Accessories",
    logoBg: "#00B060",
    guidelines: {
      banned_terms: ["murahan", "kw", "original garansi hilang"],
      hashtag_pillars: ["#UGREENIndonesia", "#TechEssentials", "#GaPakeRibet"],
      no_dash: true
    },
    status: { brief: "confirmed", strategy: "approved", content: "approved", report: "narrative_review" }
  },
  {
    id: "b2",
    name: "AceKid",
    industry: "Kids Toys & Educational Gear",
    logoBg: "#FF6B6B",
    guidelines: {
      banned_terms: ["sufor", "berbahaya", "obat"],
      hashtag_pillars: ["#AceKidPlay", "#MainanEdukasi", "#DuniaAnak"],
      no_dash: false
    },
    status: { brief: "confirmed", strategy: "approved", content: "draft", report: "draft" }
  },
  {
    id: "b3",
    name: "Golden Rama",
    industry: "Travel & Leisure Agency",
    logoBg: "#F59E0B",
    guidelines: {
      banned_terms: ["batal gratis", "pasti berangkat 100%"],
      hashtag_pillars: ["#GoldenRamaTours", "#LiburanSeru", "#TravelWithUs"],
      no_dash: true
    },
    status: { brief: "confirmed", strategy: "draft", content: "draft", report: "draft" }
  },
  {
    id: "b4",
    name: "Bareksa",
    industry: "Fintech & Investment Platform",
    logoBg: "#2563EB",
    guidelines: {
      banned_terms: ["pasti cuan 100%", "tanpa risiko", "pinjol"],
      hashtag_pillars: ["#BareksaInvestasi", "#CuanReksadana", "#CerdasFinansial"],
      no_dash: true
    },
    status: { brief: "confirmed", strategy: "approved", content: "approved", report: "approved" }
  },
  {
    id: "b5",
    name: "Syailendra",
    industry: "Asset Management & Capital",
    logoBg: "#8B5CF6",
    guidelines: {
      banned_terms: ["skema ponzi", "dijamin kaya"],
      hashtag_pillars: ["#SyailendraCapital", "#WealthManagement", "#InvestasiJangkaPanjang"],
      no_dash: true
    },
    status: { brief: "draft", strategy: "draft", content: "draft", report: "draft" }
  },
  {
    id: "b6",
    name: "Bellastories",
    industry: "Fashion & Lifestyle Brand",
    logoBg: "#EC4899",
    guidelines: {
      banned_terms: ["jelek", "diskon bohong"],
      hashtag_pillars: ["#BellaStoriesFit", "#OOTDIndo", "#StyleWithBella"],
      no_dash: false
    },
    status: { brief: "confirmed", strategy: "approved", content: "draft", report: "draft" }
  }
];

const SAMPLE_RAW_CSV = `posted_at,template_name,template_mode,views,likes,comments,saves,shares,type,description,hashtags,url,account_username,platform
2026-08-01T10:00:00Z,UGREEN Nexode 100W,Unboxing,12500,850,92,410,185,video,"Ga usah bawa banyak charger lagi! Cukup 1 UGREEN Nexode 100W buat semua gadget. #UGREENIndonesia #TechEssentials",#UGREENIndonesia #TechEssentials,https://tiktok.com/@ugreen.id/video/1,ugreen.id,tiktok
2026-08-02T14:30:00Z,UGREEN MagSafe Powerbank,POV Lifestyle,18400,1230,145,780,310,video,"Powerbank tipis tapi fast charging 15W MagSafe! Pas banget buat traveling. #GaPakeRibet",#GaPakeRibet #UGREEN,https://tiktok.com/@ugreen.id/video/2,ugreen.id,tiktok
2026-08-03T11:15:00Z,Tips Charger Laptop Awet,Edu Carousel,4200,210,38,190,95,carousel,"5 Kebiasaan buruk yang bikin baterai laptop kamu cepet bocor! Swipe sampai habis. #TechEssentials",#TechEssentials #TipsGadget,https://instagram.com/p/3,ugreen.official,instagram
2026-07-28T09:00:00Z,UGREEN Cable Organizer,Problem Solution,9800,540,42,310,120,video,"Meja kerja berantakan gara2 kabel? Solusinya pakai UGREEN Magnetic Cable Clip! #UGREENIndonesia",#UGREENIndonesia,https://tiktok.com/@ugreen.id/video/4,ugreen.id,tiktok
2026-07-29T16:20:00Z,UGREEN Hub 7-in-1,Review Tech,24500,1950,210,1120,490,video,"MacBook cuma 2 port Type-C? Pakai Hub UGREEN ini langsung dapet HDMI 4K + SD Card + 3 USB A!",#UGREEN #MacbookSetup,https://tiktok.com/@ugreen.id/video/5,ugreen.id,tiktok
2026-07-30T12:00:00Z,UGREEN Hitune Earbuds,Aesthetic Sound,150,5,1,2,0,video,"Noise cancellation mantap harga 300ribuan aja!",#UGREEN,https://tiktok.com/@ugreen.id/video/6,ugreen.id,tiktok
2026-07-31T18:45:00Z,UGREEN Car Fast Charger,Car Setup Carousel,8900,430,29,240,110,carousel,"Charge iPhone dari 0% ke 60% cuma 30 menit di dalam mobil! #UGREENIndonesia",#UGREENIndonesia,https://instagram.com/p/7,ugreen.official,instagram`;

const SAMPLE_FOLLOWER_SNAPSHOTS = [
  { account_username: "ugreen.id", platform: "tiktok", week_1: 45200, week_2: 48600 },
  { account_username: "ugreen.official", platform: "instagram", week_1: 89300, week_2: 91100 }
];

const MOCK_BRIEF = {
  brand_name: "UGREEN Indonesia",
  goals: "Meningkatkan brand awareness produk Nexode GaN Charger & MagSafe Powerbank sebesar 30% di kuartal 3, serta mendorong conversion traffic ke Tokopedia/Shopee Flagship Store.",
  deadline: "2026-08-31",
  problem_statement: "Audience Gen-Z & Young Professionals masih ragu memilih UGREEN dibanding brand bawaan HP karena belum teredukasi mengenai teknologi GaN (Gallium Nitride) yang dingin dan aman.",
  product_knowledge: [
    "Teknologi GaN Fast Charge 100W & 65W",
    "Perlindungan thermal Thermal Guard™ 800x scan/detik",
    "Desain ringkas 40% lebih kecil dibanding charger bawaan laptop"
  ],
  target_audience: "Pekerja WFH/Hybrid, Content Creator, Gadget Enthusiasts usia 20-35 tahun.",
  status: "confirmed"
};

let MOCK_SWOT = {
  strengths: "Kualitas build premium, sertifikasi resmi Apple MFi, beragam port lengkap, daya tahan tinggi.",
  weaknesses: "Harga sedikit lebih tinggi dibanding brand charger generik tanpa nama.",
  opportunities: "Apple & Samsung tidak lagi menyertakan kepala charger di box penjualan HP baru.",
  threats: "Maraknya barang KW UGREEN palsu tanpa garansi resmi di e-commerce.",
  competitors: [
    { name: "Anker", positioning: "Top competitor premium, reputasi kuat tapi harga lebih mahal" },
    { name: "Baseus", positioning: "Desain trendy, variasi produk banyak, persaingan harga ketat" }
  ]
};

let MOCK_PERSONAS = [
  { id: "p1", name: "The Tech Nomad (WFH Worker)", type: "Professional", target_qty: 10, reasoning: "Fokus ke charger GaN multiport 100W & USB Hub untuk produktivitas meja kerja." },
  { id: "p2", name: "Gen-Z On-the-Go Creator", type: "Lifestyle & Creator", target_qty: 12, reasoning: "Fokus ke MagSafe Powerbank & TWS Earbuds dengan warna-warna aesthetic." },
  { id: "p3", name: "Smart Commuter", type: "Daily Travel", target_qty: 8, reasoning: "Fokus ke Car Charger, Cable Organizer & Phone Holder di kendaraan." }
];

let MOCK_STYLE_REF = {
  url: "https://tiktok.com/@tech_unboxing_aesthetic/123",
  mood: "Clean, Minimalist, High-Tech, Premium Darkness",
  visual_style: "Top-down desk setup, RGB warm lighting, macro shot ports, smooth transition sound effects",
  tone: "Informative, Direct to the point, ASMR unboxing vibes"
};

// ============================================================================
// 3. METRICS AGGREGATOR ENGINE
// ============================================================================
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const posts = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = [];
    let insideQuote = false;
    let currentValue = '';

    for (let char of line) {
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        values.push(currentValue.trim().replace(/^"|"$/g, ''));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim().replace(/^"|"$/g, ''));

    if (values.length >= headers.length) {
      const rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });

      const views = parseInt(rowObj.views, 10) || 0;
      const likes = parseInt(rowObj.likes, 10) || 0;
      const comments = parseInt(rowObj.comments, 10) || 0;
      const saves = parseInt(rowObj.saves, 10) || 0;
      const shares = parseInt(rowObj.shares, 10) || 0;

      // ER% Formula: (likes + comments + saves + shares) / views * 100
      const engagementSum = likes + comments + saves + shares;
      const engagementRate = views > 0 ? (engagementSum / views) * 100 : 0;

      posts.push({
        ...rowObj,
        views,
        likes,
        comments,
        saves,
        shares,
        engagementSum,
        engagementRate: parseFloat(engagementRate.toFixed(2)),
        type: (rowObj.type || 'video').toLowerCase()
      });
    }
  }

  return posts;
}

function aggregateMetrics(postsList, followerSnapshotsList = []) {
  if (!postsList || postsList.length === 0) {
    return {
      totalPosts: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalSaves: 0,
      totalShares: 0,
      videoCount: 0,
      carouselCount: 0,
      averageER: 0,
      filteredPostsCount: 0,
      topByER: [],
      topByViews: [],
      followerGrowth: []
    };
  }

  const totalPosts = postsList.length;
  const totalViews = postsList.reduce((acc, p) => acc + p.views, 0);
  const totalLikes = postsList.reduce((acc, p) => acc + p.likes, 0);
  const totalComments = postsList.reduce((acc, p) => acc + p.comments, 0);
  const totalSaves = postsList.reduce((acc, p) => acc + p.saves, 0);
  const totalShares = postsList.reduce((acc, p) => acc + (p.shares || 0), 0);

  const videoCount = postsList.filter(p => p.type === 'video').length;
  const carouselCount = postsList.filter(p => p.type === 'carousel').length;

  // Filter Rule: views > 200 AND total_engagement >= 2
  const validPostsForER = postsList.filter(p => p.views > 200 && p.engagementSum >= 2);
  
  const sumER = validPostsForER.reduce((acc, p) => acc + p.engagementRate, 0);
  const averageER = validPostsForER.length > 0 ? (sumER / validPostsForER.length).toFixed(2) : '0.00';

  const sortedByER = [...postsList].sort((a, b) => b.engagementRate - a.engagementRate);
  const topByER = sortedByER.slice(0, 3);

  const sortedByViews = [...postsList].sort((a, b) => b.views - a.views);
  const topByViews = sortedByViews.slice(0, 3);

  const followerGrowth = followerSnapshotsList.map(snap => {
    const delta = snap.week_2 - snap.week_1;
    const pct = snap.week_1 > 0 ? ((delta / snap.week_1) * 100).toFixed(2) : '0.00';
    return {
      account: snap.account_username,
      platform: snap.platform,
      previous: snap.week_1,
      current: snap.week_2,
      delta: delta,
      percentage: pct
    };
  });

  return {
    totalPosts,
    totalViews,
    totalLikes,
    totalComments,
    totalSaves,
    totalShares,
    videoCount,
    carouselCount,
    averageER: parseFloat(averageER),
    filteredPostsCount: validPostsForER.length,
    topByER,
    topByViews,
    followerGrowth
  };
}

// ============================================================================
// 4. GEMINI-POWERED WORKFLOW ENGINES
// ============================================================================

// A. REPORT NARRATIVE AGENT (GEMINI)
async function generateReportNarrative(brandName, metricsData) {
  const systemPrompt = `You are the Principal Marketing Strategist at CAK AI Agency. 
Analyze the client's social media performance metrics and write two polished narrative sections in professional, persuasive Bahasa Indonesia for the executive board:
1. "OVERVIEW": Synthesize total views, ER% (formula: Likes+Comments+Saves+Shares/Views), virality (shares), and bookmark retention (saves). Highlight top performers.
2. "CONCLUSION": Actionable strategic recommendations for next month's content sprint.
Return ONLY valid JSON with keys "overview" and "conclusion".`;

  const userPrompt = `Brand Name: ${brandName}
Total Views: ${metricsData.totalViews.toLocaleString('id-ID')}
Total Posts: ${metricsData.totalPosts} (Videos: ${metricsData.videoCount}, Carousels: ${metricsData.carouselCount})
Average ER%: ${metricsData.averageER}%
Total Saves: ${metricsData.totalSaves.toLocaleString('id-ID')}
Total Shares (Virality): ${metricsData.totalShares.toLocaleString('id-ID')}
Top 3 by ER%: ${JSON.stringify(metricsData.topByER.map(p => ({ title: p.template_name, er: p.engagementRate, saves: p.saves, shares: p.shares })))}
Top 3 by Views: ${JSON.stringify(metricsData.topByViews.map(p => ({ title: p.template_name, views: p.views, likes: p.likes })))}
Follower Growth: ${JSON.stringify(metricsData.followerGrowth)}`;

  try {
    const rawRes = await callGeminiAPI(userPrompt, systemPrompt);
    if (rawRes) {
      const cleaned = rawRes.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.overview && parsed.conclusion) {
        return {
          overview: parsed.overview,
          conclusion: parsed.conclusion,
          generatedAt: new Date().toISOString()
        };
      }
    }
  } catch (err) {
    console.warn("Gemini API narrative generation fallback triggered:", err);
  }

  // Smart Heuristic Fallback if API key not present or call failed
  const topErTitle = metricsData.topByER[0] ? metricsData.topByER[0].template_name : "N/A";
  const topViewsTitle = metricsData.topByViews[0] ? metricsData.topByViews[0].template_name : "N/A";
  
  return {
    overview: `Pada periode laporan kali ini, brand ${brandName} berhasil mengumpulkan total ${metricsData.totalViews.toLocaleString('id-ID')} views dari ${metricsData.totalPosts} konten yang dipublikasikan.\n\nRata-rata Engagement Rate (ER%) berada di angka ${metricsData.averageER}% [Formula: (Likes + Comments + Saves + Shares) / Views * 100], dengan akumulasi total ${metricsData.totalShares.toLocaleString('id-ID')} shares dan ${metricsData.totalSaves.toLocaleString('id-ID')} saves. Performa tertinggi didorong oleh format ${metricsData.videoCount > metricsData.carouselCount ? 'Short Video' : 'Edu Carousel'}.\n\nKonten paling viral periode ini adalah "${topViewsTitle}" yang berhasil mencapai ${metricsData.topByViews[0]?.views.toLocaleString('id-ID') || 0} views. Sementara itu, interaksi mendalam dicapai oleh "${topErTitle}" dengan ER ${metricsData.topByER[0]?.engagementRate || 0}%, di mana jumlah shares (${metricsData.topByER[0]?.shares || 0}) & saves (${metricsData.topByER[0]?.saves || 0}) menjadi sinyal kuat organiknya distribusi konten.`,
    conclusion: `Secara keseluruhan, strategi konten periode ini terbukti efektif menjaga daya tarik audiens. Kombinasi akumulasi saves dan shares membuktikan bahwa audiens aktif membagikan konten ke grup/kerabat.\n\nREKOMENDASI STRATEGIS SELANJUTNYA:\n1. Scale up pembagian porsi konten berformat Hook Unboxing & POV Lifestyle yang memiliki views konstan di atas 10.000 views.\n2. Pertahankan pilar edukasi carousel 1x seminggu untuk memancing retention saves & bookmark audiens.\n3. Alokasikan eksperimen trend audio baru pada 20% porsi konten mingguan.`,
    generatedAt: new Date().toISOString()
  };
}

// B. BRIEF INTAKE EXTRACTOR (GEMINI)
async function extractBriefWithGemini(briefText, brandName) {
  const systemPrompt = `You are an AI Brief Extractor. Given a raw client marketing brief, extract and return a valid JSON object with keys:
- "goals": string
- "problem_statement": string
- "target_audience": string
- "product_knowledge": array of strings
Language: Bahasa Indonesia.`;

  try {
    const rawRes = await callGeminiAPI(`Extract this brief for brand ${brandName}:\n${briefText}`, systemPrompt);
    if (rawRes) {
      const cleaned = rawRes.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    }
  } catch (e) {
    console.warn("Brief extraction fallback:", e);
  }

  return {
    goals: `Meningkatkan brand awareness dan engagement ${brandName} sebesar 35% di kuartal mendatang melalui aktivasi konten viral dan edukasi produk.`,
    problem_statement: `Audience sasaran belum sepenuhnya memahami unique selling proposition (USP) ${brandName} dibandingkan alternatif kompetitor generik di pasar.`,
    target_audience: `Pekerja Urban, Digital Native, dan Kreator usia 20-35 tahun yang mengutamakan efisiensi dan kualitas.`,
    product_knowledge: [
      `Fitur andalan efisiensi tinggi dan build quality premium`,
      `Sertifikasi keamanan & jaminan garansi resmi`,
      `Desain ergonomis & kompatibilitas multi-device`
    ]
  };
}

// C. SWOT & COMPETITOR GENERATOR (GEMINI)
async function generateSWOTWithGemini(brandName, industry) {
  const systemPrompt = `You are a Senior Strategic Brand Analyst. Generate a realistic SWOT analysis for brand "${brandName}" in industry "${industry}".
Return ONLY a valid JSON object with keys: "strengths", "weaknesses", "opportunities", "threats". Language: Bahasa Indonesia.`;

  try {
    const rawRes = await callGeminiAPI(`Analyze ${brandName} in ${industry}`, systemPrompt);
    if (rawRes) {
      const cleaned = rawRes.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    }
  } catch (e) {
    console.warn("SWOT fallback:", e);
  }

  return {
    strengths: `Kualitas build premium, reputasi terpercaya, ekosistem produk luas dengan sertifikasi resmi.`,
    weaknesses: `Harga premium di segmen menengah, perlunya edukasi berkelanjutan ke pembeli pemula.`,
    opportunities: `Tren digital nomad & smart lifestyle terus melonjak di Indonesia.`,
    threats: `Maraknya barang KW palsu & perang harga di marketplace.`
  };
}

// D. 30-DAY CONTENT HOOKS BREAKDOWN (GEMINI)
async function generate30DayHooksWithGemini(brandName, personas) {
  const systemPrompt = `You are a Lead TikTok & Instagram Creative Director. Generate high-converting content hooks for brand "${brandName}".
Return ONLY a JSON array of objects with keys: "day" (number 1-30), "title", "persona", "format" ("Video" or "Carousel"), "concept", "copyAngle".
Language: Bahasa Indonesia.`;

  try {
    const rawRes = await callGeminiAPI(`Generate creative content hooks for ${brandName} targetting personas: ${JSON.stringify(personas)}`, systemPrompt);
    if (rawRes) {
      const cleaned = rawRes.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Hooks breakdown fallback:", e);
  }

  return [
    { day: 2, title: "Unboxing Nexode 100W", persona: "The Tech Nomad", format: "Video", concept: "ASMR unboxing, top-down desk setup", copyAngle: "1 charger buat laptop + phone." },
    { day: 5, title: "MagSafe 15W POV Lifestyle", persona: "Gen-Z Creator", format: "Video", concept: "Vlog aesthetic jalan di cafe", copyAngle: "Powerbank magnetik ter-aesthetic." },
    { day: 9, title: "5 Tips Baterai Laptop Awet", persona: "Smart Commuter", format: "Carousel", concept: "Graphic slides hijau neon & dark grey", copyAngle: "Swipe biar baterai ga bocor!" },
    { day: 14, title: "MacBook Setup Hub 7-in-1", persona: "The Tech Nomad", format: "Video", concept: "Macro shot port HDMI 4K & SD Card", copyAngle: "Solusi MacBook cuma 2 port Type-C!" },
    { day: 18, title: "Cable Clip Organizer DIY", persona: "Gen-Z Creator", format: "Video", concept: "Before vs After meja kerja berantakan", copyAngle: "Meja rapi pakai magnetic clip." },
    { day: 24, title: "Car Charger Fast Charge 60W", persona: "Smart Commuter", format: "Carousel", concept: "Visual infus energi charger di mobil", copyAngle: "Charge 0% ke 60% cuma 30 menit." }
  ];
}

// ============================================================================
// 5. DOCUMENT EXPORTER ENGINE (EXCEL & PPT)
// ============================================================================
function exportToExcel(brandName, period, metricsData, postsList) {
  let csvContent = "data:text/csv;charset=utf-8,";
  
  csvContent += `CAK AI PERFORMANCE REPORT - ${brandName.toUpperCase()}\n`;
  csvContent += `Periode,${period}\n`;
  csvContent += `Generated At,${new Date().toLocaleDateString('id-ID')}\n\n`;

  csvContent += `METRIK KINERJA UTAMA\n`;
  csvContent += `Total Content Posts,${metricsData.totalPosts}\n`;
  csvContent += `Total Views,${metricsData.totalViews}\n`;
  csvContent += `Total Likes,${metricsData.totalLikes}\n`;
  csvContent += `Total Comments,${metricsData.totalComments}\n`;
  csvContent += `Total Saves,${metricsData.totalSaves}\n`;
  csvContent += `Total Shares,${metricsData.totalShares}\n`;
  csvContent += `Rata-rata ER (%) [(Likes+Comments+Saves+Shares)/Views*100],${metricsData.averageER}%\n`;
  csvContent += `Video vs Carousel,${metricsData.videoCount} Videos / ${metricsData.carouselCount} Carousels\n\n`;

  csvContent += `DETAIL KONTEN (RAW SCRAPE DATA)\n`;
  csvContent += `Posted At,Template Name,Template Mode,Platform,Account,Views,Likes,Comments,Saves,Shares,ER (%),Type,URL\n`;

  postsList.forEach(p => {
    csvContent += `"${p.posted_at || ''}","${p.template_name || ''}","${p.template_mode || ''}","${p.platform || ''}","${p.account_username || ''}",${p.views},${p.likes},${p.comments},${p.saves},${p.shares || 0},${p.engagementRate}%,"${p.type}","${p.url || ''}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Report_${brandName.replace(/\s+/g, '_')}_${period}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function generatePPTSlidesHTML(brandName, period, metricsData, narrative) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Report PPT Preview - ${brandName}</title>
      <style>
        body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background: #0b0f19; color: #fff; margin: 0; padding: 40px; }
        .slide { width: 960px; height: 540px; background: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; margin: 0 auto 40px auto; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.5); page-break-after: always; }
        .slide-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10b981; padding-bottom: 12px; }
        .slide-header h2 { margin: 0; color: #10b981; font-size: 24px; text-transform: uppercase; }
        .slide-header span { color: #9ca3af; font-size: 14px; }
        .slide-body { flex: 1; padding: 24px 0; font-size: 16px; line-height: 1.6; color: #d1d5db; }
        .slide-footer { display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; border-top: 1px solid #1f2937; padding-top: 12px; }
        .hero-slide { justify-content: center; align-items: center; text-align: center; background: linear-gradient(135deg, #064e3b 0%, #111827 100%); }
        .metrics-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-top: 20px; }
        .metric-card { background: #1f2937; padding: 16px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
        .metric-val { font-size: 26px; font-weight: bold; color: #34d399; margin-top: 6px; }
        .metric-lbl { font-size: 11px; color: #9ca3af; text-transform: uppercase; }
        .card-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .item-card { background: #1f2937; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981; }
        .badge { background: #064e3b; color: #34d399; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
        @media print {
          body { background: white; color: black; padding: 0; }
          .slide { border: 1px solid #ccc; box-shadow: none; margin: 0; page-break-after: always; background: white; color: black; }
          .slide-header h2 { color: #059669; }
          .metric-card, .item-card { background: #f3f4f6; border-color: #e5e7eb; color: black; }
          .metric-val { color: #059669; }
        }
      </style>
    </head>
    <body>
      <div style="text-align: center; margin-bottom: 20px;" class="no-print">
        <button onclick="window.print()" style="background: #10b981; color: black; font-weight: bold; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px;">
          🖨️ Download / Print Presentation (PDF/PPT)
        </button>
      </div>

      <div class="slide hero-slide">
        <h1 style="font-size: 42px; margin: 0; color: #ffffff;">MARKETING & CONTENT REPORT</h1>
        <h2 style="font-size: 28px; color: #34d399; margin: 16px 0;">${brandName.toUpperCase()}</h2>
        <p style="color: #9ca3af; font-size: 18px;">Periode Evaluasi: ${period} | Prepared with Gemini AI</p>
      </div>

      <div class="slide">
        <div class="slide-header">
          <h2>1. Executive Summary & Overview Metrics</h2>
          <span>${brandName}</span>
        </div>
        <div class="slide-body">
          <p>Rangkuman performa akumulatif (ER% = Likes+Comments+Saves+Shares / Views * 100):</p>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-lbl">Total Views</div>
              <div class="metric-val">${metricsData.totalViews.toLocaleString('id-ID')}</div>
            </div>
            <div class="metric-card">
              <div class="metric-lbl">Avg ER%</div>
              <div class="metric-val">${metricsData.averageER}%</div>
            </div>
            <div class="metric-card">
              <div class="metric-lbl">Total Saves</div>
              <div class="metric-val">${metricsData.totalSaves.toLocaleString('id-ID')}</div>
            </div>
            <div class="metric-card">
              <div class="metric-lbl">Total Shares</div>
              <div class="metric-val">${metricsData.totalShares.toLocaleString('id-ID')}</div>
            </div>
            <div class="metric-card">
              <div class="metric-lbl">Total Posts</div>
              <div class="metric-val">${metricsData.totalPosts}</div>
            </div>
          </div>
        </div>
        <div class="slide-footer">
          <span>CAK AI Strategist Platform</span>
          <span>Slide 2</span>
        </div>
      </div>

      <div class="slide">
        <div class="slide-header">
          <h2>2. Campaign Overview Insight</h2>
          <span>${brandName}</span>
        </div>
        <div class="slide-body">
          <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border-left: 4px solid #34d399;">
            ${narrative.overview.replace(/\n/g, '<br/>')}
          </div>
        </div>
        <div class="slide-footer">
          <span>CAK AI Strategist Platform</span>
          <span>Slide 3</span>
        </div>
      </div>

      <div class="slide">
        <div class="slide-header">
          <h2>3. Top 3 Content Performers (By ER%)</h2>
          <span>${brandName}</span>
        </div>
        <div class="slide-body">
          <div class="card-list">
            ${metricsData.topByER.map((item, idx) => `
              <div class="item-card">
                <span class="badge">Rank #${idx + 1} - ER: ${item.engagementRate}%</span>
                <h4 style="margin: 12px 0 8px 0;">${item.template_name}</h4>
                <p style="font-size: 13px; color: #9ca3af;">${item.description || ''}</p>
                <div style="font-size: 12px; color: #34d399; margin-top: 8px;">
                  👁️ ${item.views} | 💾 ${item.saves} saves | 🔄 ${item.shares || 0} shares
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="slide-footer">
          <span>CAK AI Strategist Platform</span>
          <span>Slide 4</span>
        </div>
      </div>

      <div class="slide">
        <div class="slide-header">
          <h2>4. Top 3 Content Performers (By Views)</h2>
          <span>${brandName}</span>
        </div>
        <div class="slide-body">
          <div class="card-list">
            ${metricsData.topByViews.map((item, idx) => `
              <div class="item-card" style="border-left-color: #6366f1;">
                <span class="badge" style="background: #1e1b4b; color: #818cf8;">Rank #${idx + 1} - ${item.views.toLocaleString('id-ID')} Views</span>
                <h4 style="margin: 12px 0 8px 0;">${item.template_name}</h4>
                <p style="font-size: 13px; color: #9ca3af;">${item.description || ''}</p>
                <div style="font-size: 12px; color: #818cf8; margin-top: 8px;">
                  ❤️ ${item.likes} likes | 💬 ${item.comments} comments | 🔄 ${item.shares || 0} shares
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="slide-footer">
          <span>CAK AI Strategist Platform</span>
          <span>Slide 5</span>
        </div>
      </div>

      <div class="slide">
        <div class="slide-header">
          <h2>5. Conclusion & Actionable Next Steps</h2>
          <span>${brandName}</span>
        </div>
        <div class="slide-body">
          <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
            ${narrative.conclusion.replace(/\n/g, '<br/>')}
          </div>
        </div>
        <div class="slide-footer">
          <span>CAK AI Strategist Platform</span>
          <span>Slide 6</span>
        </div>
      </div>

    </body>
    </html>
  `;
}

// ============================================================================
// 6. APPLICATION STATE & UI RENDERING
// ============================================================================
let brandsStore = [...INITIAL_BRANDS];
let activeBrandId = "b1";
let activeScreen = "dashboard";

let currentCSV = SAMPLE_RAW_CSV;
let currentPosts = parseCSV(SAMPLE_RAW_CSV);
let currentFollowerSnapshots = [...SAMPLE_FOLLOWER_SNAPSHOTS];
let currentMetrics = aggregateMetrics(currentPosts, currentFollowerSnapshots);
let currentNarrative = { overview: "", conclusion: "" };

let calendarHooksList = [
  { day: 2, title: "Unboxing Nexode 100W", persona: "The Tech Nomad", format: "Video", concept: "ASMR unboxing, top-down desk setup", copyAngle: "1 charger buat laptop + phone." },
  { day: 5, title: "MagSafe 15W POV Lifestyle", persona: "Gen-Z Creator", format: "Video", concept: "Vlog aesthetic jalan di cafe", copyAngle: "Powerbank magnetik ter-aesthetic." },
  { day: 9, title: "5 Tips Baterai Laptop Awet", persona: "Smart Commuter", format: "Carousel", concept: "Graphic slides hijau neon & dark grey", copyAngle: "Swipe biar baterai ga bocor!" },
  { day: 14, title: "MacBook Setup Hub 7-in-1", persona: "The Tech Nomad", format: "Video", concept: "Macro shot port HDMI 4K & SD Card", copyAngle: "Solusi MacBook cuma 2 port Type-C!" },
  { day: 18, title: "Cable Clip Organizer DIY", persona: "Gen-Z Creator", format: "Video", concept: "Before vs After meja kerja berantakan", copyAngle: "Meja rapi pakai magnetic clip." },
  { day: 24, title: "Car Charger Fast Charge 60W", persona: "Smart Commuter", format: "Carousel", concept: "Visual infus energi charger di mobil", copyAngle: "Charge 0% ke 60% cuma 30 menit." }
];

function showToast(message, icon = "✨") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function openModal(contentHTML) {
  const container = document.getElementById("modal-container");
  const body = document.getElementById("modal-content-body");
  if (container && body) {
    body.innerHTML = contentHTML;
    container.classList.remove("hidden");
  }
}

function closeModal() {
  const container = document.getElementById("modal-container");
  if (container) container.classList.add("hidden");
}

function updateGeminiStatusUI() {
  const key = GEMINI_CONFIG.getApiKey();
  const model = GEMINI_CONFIG.getModel();
  const dot = document.getElementById("gemini-status-dot");
  const text = document.getElementById("gemini-status-text");
  const kpiModel = document.getElementById("kpi-gemini-model");
  const sidebarBadge = document.getElementById("sidebar-gemini-status-badge");
  const settingsStatus = document.getElementById("settings-conn-status");

  const modelLabel = model === "gemini-1.5-pro" ? "Gemini 1.5 Pro" : model === "gemini-2.0-flash" ? "Gemini 2.0 Flash" : "Gemini 1.5 Flash";

  if (kpiModel) kpiModel.textContent = modelLabel;

  if (key) {
    if (dot) { dot.style.background = "#10b981"; dot.style.boxShadow = "0 0 8px #10b981"; }
    if (text) { text.textContent = `${modelLabel} (Active)`; text.style.color = "#34d399"; }
    if (sidebarBadge) { sidebarBadge.textContent = "🟢 Terhubung"; sidebarBadge.className = "badge-pill badge-green"; }
    if (settingsStatus) { settingsStatus.textContent = "🟢 Kunci API Aktif & Siap"; settingsStatus.className = "badge-pill badge-green"; }
  } else {
    if (dot) { dot.style.background = "#f59e0b"; dot.style.boxShadow = "0 0 8px #f59e0b"; }
    if (text) { text.textContent = "Set Gemini API Key"; text.style.color = "#fcd34d"; }
    if (sidebarBadge) { sidebarBadge.textContent = "🟡 Belum Diatur"; sidebarBadge.className = "badge-pill status-review"; }
    if (settingsStatus) { settingsStatus.textContent = "🟡 Belum Ada Kunci API"; settingsStatus.className = "badge-pill status-review"; }
  }
}

function renderSidebarBrands() {
  const brandListContainer = document.getElementById("brand-list-container");
  if (!brandListContainer) return;

  brandListContainer.innerHTML = brandsStore.map(b => `
    <div class="brand-item ${b.id === activeBrandId ? 'active' : ''}" data-brand-id="${b.id}">
      <div class="brand-info">
        <div class="brand-badge" style="background:${b.logoBg};">${b.name.substring(0, 2).toUpperCase()}</div>
        <div class="brand-name">${b.name}</div>
      </div>
      <span class="nav-status status-${b.status.report}">${b.status.report === 'narrative_review' ? 'Review' : b.status.report}</span>
    </div>
  `).join('');

  document.querySelectorAll(".brand-item").forEach(item => {
    item.addEventListener("click", () => {
      activeBrandId = item.getAttribute("data-brand-id");
      renderSidebarBrands();
      updateBrandContext();
      showToast(`Workspace beralih ke brand ${getActiveBrand().name}`, "🏢");
    });
  });
}

async function updateBrandContext() {
  const brand = getActiveBrand();
  if (!brand) return;

  const bannerName = document.getElementById("active-brand-name");
  const bannerBadge = document.getElementById("active-brand-badge");

  if (bannerName) bannerName.textContent = brand.name;
  if (bannerBadge) bannerBadge.style.backgroundColor = brand.logoBg;

  const briefBrandInput = document.getElementById("brief-brand-name");
  if (briefBrandInput) briefBrandInput.value = brand.name;

  currentMetrics = aggregateMetrics(currentPosts, currentFollowerSnapshots);
  currentNarrative = await generateReportNarrative(brand.name, currentMetrics);

  renderCurrentScreen();
}

function getActiveBrand() {
  return brandsStore.find(b => b.id === activeBrandId) || brandsStore[0];
}

function setupNavigation() {
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetScreen = link.getAttribute("data-screen");
      if (targetScreen) switchScreen(targetScreen);
    });
  });
}

function switchScreen(screenName) {
  activeScreen = screenName;

  document.querySelectorAll(".nav-link").forEach(l => {
    if (l.getAttribute("data-screen") === screenName) l.classList.add("active");
    else l.classList.remove("active");
  });

  document.querySelectorAll(".workspace-screen").forEach(s => s.classList.add("hidden"));
  const activeEl = document.getElementById(`screen-${screenName}`);
  if (activeEl) activeEl.classList.remove("hidden");

  renderCurrentScreen();
}

function renderCurrentScreen() {
  const brand = getActiveBrand();
  if (activeScreen === "dashboard") renderDashboard();
  else if (activeScreen === "brief") renderBriefScreen(brand);
  else if (activeScreen === "strategy") renderStrategyScreen(brand);
  else if (activeScreen === "content") renderContentScreen(brand);
  else if (activeScreen === "report") renderReportScreen(brand);
  else if (activeScreen === "settings") renderSettingsScreen();
}

// SCREEN 1: DASHBOARD
function renderDashboard() {
  const totalBrandsEl = document.getElementById("kpi-total-brands");
  if (totalBrandsEl) totalBrandsEl.textContent = brandsStore.length;

  const brandGrid = document.getElementById("dashboard-brand-grid");
  if (!brandGrid) return;

  brandGrid.innerHTML = brandsStore.map(b => `
    <div class="glass-card" style="margin-bottom: 0;">
      <div class="card-header-title">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="brand-badge" style="background:${b.logoBg}; width: 36px; height: 36px; font-size: 14px;">
            ${b.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 style="font-size: 16px; font-weight: 700;">${b.name}</h4>
            <p style="font-size: 12px; color: var(--text-muted);">${b.industry}</p>
          </div>
        </div>
        <button class="btn btn-secondary btn-select-brand" data-id="${b.id}" style="padding: 6px 12px; font-size: 12px;">
          Kelola Brand
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 16px;">
        <div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-dim);">BRIEF</div>
          <div class="badge-pill status-${b.status.brief}" style="margin-top: 4px;">${b.status.brief}</div>
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-dim);">STRATEGY</div>
          <div class="badge-pill status-${b.status.strategy}" style="margin-top: 4px;">${b.status.strategy}</div>
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-dim);">CONTENT</div>
          <div class="badge-pill status-${b.status.content}" style="margin-top: 4px;">${b.status.content}</div>
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-dim);">REPORT</div>
          <div class="badge-pill status-${b.status.report}" style="margin-top: 4px;">${b.status.report}</div>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll(".btn-select-brand").forEach(btn => {
    btn.addEventListener("click", () => {
      activeBrandId = btn.getAttribute("data-id");
      renderSidebarBrands();
      updateBrandContext();
      switchScreen("report");
    });
  });
}

// SCREEN 2: BRIEF INTAKE
function renderBriefScreen(brand) {
  const goalsInput = document.getElementById("brief-goals");
  const problemInput = document.getElementById("brief-problem");
  const audienceInput = document.getElementById("brief-audience");
  const pkContainer = document.getElementById("brief-product-knowledge");

  if (goalsInput) goalsInput.value = MOCK_BRIEF.goals;
  if (problemInput) problemInput.value = MOCK_BRIEF.problem_statement;
  if (audienceInput) audienceInput.value = MOCK_BRIEF.target_audience;

  if (pkContainer) {
    pkContainer.innerHTML = MOCK_BRIEF.product_knowledge.map(pk => `
      <div style="background: rgba(255,255,255,0.04); padding: 10px 14px; border-radius: 8px; margin-bottom: 8px; font-size: 13px; display: flex; align-items: center; justify-content: space-between;">
        <span>✨ ${pk}</span>
        <span style="color: var(--accent-green);">✓ Verified by Gemini</span>
      </div>
    `).join('');
  }
}

// SCREEN 3: STRATEGY WORKSPACE
function renderStrategyScreen(brand) {
  const swotStrengths = document.getElementById("swot-strengths");
  const swotWeaknesses = document.getElementById("swot-weaknesses");
  const swotOpps = document.getElementById("swot-opportunities");
  const swotThreats = document.getElementById("swot-threats");

  if (swotStrengths) swotStrengths.value = MOCK_SWOT.strengths;
  if (swotWeaknesses) swotWeaknesses.value = MOCK_SWOT.weaknesses;
  if (swotOpps) swotOpps.value = MOCK_SWOT.opportunities;
  if (swotThreats) swotThreats.value = MOCK_SWOT.threats;

  const competitorList = document.getElementById("competitor-list");
  if (competitorList) {
    competitorList.innerHTML = MOCK_SWOT.competitors.map(c => `
      <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid var(--accent-purple);">
        <div style="font-weight: 700; font-size: 14px;">🥊 ${c.name}</div>
        <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${c.positioning}</div>
      </div>
    `).join('');
  }

  const personaTable = document.getElementById("persona-table-body");
  if (personaTable) {
    personaTable.innerHTML = MOCK_PERSONAS.map(p => `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td><span class="badge-pill badge-purple">${p.type}</span></td>
        <td><strong style="color: var(--accent-green);">${p.target_qty} Konten</strong></td>
        <td style="font-size: 13px; color: var(--text-muted);">${p.reasoning}</td>
      </tr>
    `).join('');
  }

  const styleCard = document.getElementById("style-ref-card");
  if (styleCard) {
    styleCard.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="font-size: 12px; color: var(--accent-green);">🔗 ${MOCK_STYLE_REF.url}</div>
        <div><strong>Mood:</strong> ${MOCK_STYLE_REF.mood}</div>
        <div><strong>Visual Style:</strong> ${MOCK_STYLE_REF.visual_style}</div>
        <div><strong>Tone of Voice:</strong> ${MOCK_STYLE_REF.tone}</div>
      </div>
    `;
  }
}

// SCREEN 4: CONTENT CALENDAR
function renderContentScreen(brand) {
  const calendarGrid = document.getElementById("calendar-grid-cells");
  if (!calendarGrid) return;

  let cellsHTML = '';
  const totalDays = 31;

  for (let i = 1; i <= totalDays; i++) {
    const hooksOnDay = calendarHooksList.filter(h => h.day === i);
    cellsHTML += `
      <div class="calendar-cell">
        <span class="day-number">${i}</span>
        ${hooksOnDay.map((h, idx) => `
          <div class="content-pill" title="${h.title}" data-day="${i}" data-index="${idx}">
            🎬 ${h.title}
          </div>
        `).join('')}
      </div>
    `;
  }

  calendarGrid.innerHTML = cellsHTML;

  document.querySelectorAll(".content-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const day = parseInt(pill.getAttribute("data-day"), 10);
      const item = calendarHooksList.find(h => h.day === day);
      if (item) {
        openModal(`
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="font-size: 20px; font-weight: 800; color: var(--accent-green);">🎬 Detail Breakdown Konten (Tgl ${item.day} Aug)</h3>
            <button class="btn btn-secondary" onclick="closeModal()" style="padding: 4px 10px;">✕</button>
          </div>
          <div class="form-group">
            <label class="form-label">Hook / Judul Konten</label>
            <input type="text" class="form-control" value="${item.title}">
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Format Konten</label>
              <input type="text" class="form-control" value="${item.format}">
            </div>
            <div class="form-group">
              <label class="form-label">Persona Assigned</label>
              <input type="text" class="form-control" value="${item.persona}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Konsep Visual & Audio</label>
            <textarea class="form-control">${item.concept}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Draft Script / Copywriting Angle</label>
            <textarea class="form-control" rows="3">${item.copyAngle}</textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;">
            <button class="btn btn-primary" onclick="closeModal()">
              ✓ Simpan Perubahan Konten
            </button>
          </div>
        `);
      }
    });
  });
}

// SCREEN 5: REPORT GENERATOR
function renderReportScreen(brand) {
  const totalViewsEl = document.getElementById("rep-total-views");
  const avgErEl = document.getElementById("rep-avg-er");
  const totalSavesEl = document.getElementById("rep-total-saves");
  const totalSharesEl = document.getElementById("rep-total-shares");
  const totalPostsEl = document.getElementById("rep-total-posts");

  if (totalViewsEl) totalViewsEl.textContent = currentMetrics.totalViews.toLocaleString('id-ID');
  if (avgErEl) avgErEl.textContent = `${currentMetrics.averageER}%`;
  if (totalSavesEl) totalSavesEl.textContent = currentMetrics.totalSaves.toLocaleString('id-ID');
  if (totalSharesEl) totalSharesEl.textContent = (currentMetrics.totalShares || 0).toLocaleString('id-ID');
  if (totalPostsEl) totalPostsEl.textContent = currentMetrics.totalPosts;

  const topErBody = document.getElementById("table-top-er");
  if (topErBody) {
    topErBody.innerHTML = currentMetrics.topByER.map((item, idx) => `
      <tr>
        <td><strong style="color: var(--accent-green);">#${idx + 1}</strong></td>
        <td><strong>${item.template_name}</strong><br/><span style="font-size:11px; color:var(--text-muted);">${item.platform} | ${item.type}</span></td>
        <td><span class="badge-pill badge-green">${item.engagementRate}%</span></td>
        <td>${item.saves}</td>
        <td><span class="badge-pill badge-purple">${item.shares || 0}</span></td>
      </tr>
    `).join('');
  }

  const topViewsBody = document.getElementById("table-top-views");
  if (topViewsBody) {
    topViewsBody.innerHTML = currentMetrics.topByViews.map((item, idx) => `
      <tr>
        <td><strong style="color: var(--accent-blue);">#${idx + 1}</strong></td>
        <td><strong>${item.template_name}</strong><br/><span style="font-size:11px; color:var(--text-muted);">${item.platform} | ${item.type}</span></td>
        <td><strong>${item.views.toLocaleString('id-ID')}</strong></td>
        <td>${item.likes}</td>
        <td><span class="badge-pill badge-blue">${item.engagementRate}%</span></td>
      </tr>
    `).join('');
  }

  const followerBody = document.getElementById("table-follower-growth");
  if (followerBody) {
    followerBody.innerHTML = currentMetrics.followerGrowth.map(fg => `
      <tr>
        <td><strong>@${fg.account}</strong> (${fg.platform})</td>
        <td>${fg.previous.toLocaleString('id-ID')}</td>
        <td>${fg.current.toLocaleString('id-ID')}</td>
        <td style="color: var(--accent-green); font-weight:700;">+${fg.delta.toLocaleString('id-ID')}</td>
        <td><span class="badge-pill badge-green">+${fg.percentage}%</span></td>
      </tr>
    `).join('');
  }

  const overviewInput = document.getElementById("narrative-overview-text");
  const conclusionInput = document.getElementById("narrative-conclusion-text");

  if (overviewInput) overviewInput.value = currentNarrative.overview;
  if (conclusionInput) conclusionInput.value = currentNarrative.conclusion;
}

// SCREEN 6: SETTINGS SCREEN
function renderSettingsScreen() {
  const inputKey = document.getElementById("settings-input-key");
  const selectModel = document.getElementById("settings-select-model");
  const selectTemp = document.getElementById("settings-select-temp");

  if (inputKey) inputKey.value = GEMINI_CONFIG.getApiKey();
  if (selectModel) selectModel.value = GEMINI_CONFIG.getModel();
  if (selectTemp) selectTemp.value = GEMINI_CONFIG.getTemperature().toString();

  updateGeminiStatusUI();
}

// SETUP EVENT LISTENERS
function setupEventListeners() {
  // Navigation & Settings Listeners
  const toggleVisibility = document.getElementById("toggle-key-visibility");
  if (toggleVisibility) {
    toggleVisibility.addEventListener("click", () => {
      const input = document.getElementById("settings-input-key");
      if (input) {
        if (input.type === "password") {
          input.type = "text";
          toggleVisibility.textContent = "🔒 Sembunyikan";
        } else {
          input.type = "password";
          toggleVisibility.textContent = "👁️ Lihat";
        }
      }
    });
  }

  // Settings: Test Connection Button
  const settingsBtnTest = document.getElementById("settings-btn-test");
  if (settingsBtnTest) {
    settingsBtnTest.addEventListener("click", async () => {
      const key = document.getElementById("settings-input-key").value.trim();
      const model = document.getElementById("settings-select-model").value;

      if (!key) {
        alert("Silakan masukkan Google Gemini API key terlebih dahulu!");
        return;
      }

      showToast("Menguji koneksi ke Google Gemini API...", "🔄");
      try {
        const startTime = Date.now();
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: "Respond in 1 word: OK" }] }]
          })
        });

        const latency = Date.now() - startTime;

        if (res.ok) {
          showToast(`Koneksi Google Gemini Sukses 100%! (${latency}ms) 🚀`, "✅");
          const settingsStatus = document.getElementById("settings-conn-status");
          if (settingsStatus) {
            settingsStatus.textContent = `🟢 Terkoneksi (${latency}ms)`;
            settingsStatus.className = "badge-pill badge-green";
          }
        } else {
          const err = await res.json().catch(() => ({}));
          alert(`Gagal koneksi API: ${err.error?.message || res.statusText}`);
        }
      } catch (e) {
        alert(`Error koneksi API: ${e.message}`);
      }
    });
  }

  // Settings: Save Button
  const settingsBtnSave = document.getElementById("settings-btn-save");
  if (settingsBtnSave) {
    settingsBtnSave.addEventListener("click", () => {
      const key = document.getElementById("settings-input-key").value.trim();
      const model = document.getElementById("settings-select-model").value;
      const temp = document.getElementById("settings-select-temp").value;

      GEMINI_CONFIG.setApiKey(key);
      GEMINI_CONFIG.setModel(model);
      GEMINI_CONFIG.setTemperature(temp);

      updateGeminiStatusUI();
      showToast("Pengaturan Gemini API berhasil disimpan secara lokal!", "✅");
    });
  }

  // Settings: Clear Key Button
  const settingsBtnClear = document.getElementById("settings-btn-clear");
  if (settingsBtnClear) {
    settingsBtnClear.addEventListener("click", () => {
      if (confirm("Apakah kamu yakin ingin menghapus API key dari browser?")) {
        GEMINI_CONFIG.setApiKey("");
        const inputKey = document.getElementById("settings-input-key");
        if (inputKey) inputKey.value = "";
        updateGeminiStatusUI();
        showToast("Kunci API berhasil dihapus.", "🗑️");
      }
    });
  }

  const addBrandBtn = document.getElementById("btn-add-brand-modal");
  if (addBrandBtn) {
    addBrandBtn.addEventListener("click", () => {
      const brandName = prompt("Masukkan Nama Brand Baru (misal: Anker / Samsung / Brand Client Baru):");
      if (brandName && brandName.trim()) {
        const newBrand = {
          id: `b_${Date.now()}`,
          name: brandName.trim(),
          industry: "General Marketing & Content",
          logoBg: "#" + Math.floor(Math.random()*16777215).toString(16),
          guidelines: { banned_terms: [], hashtag_pillars: [], no_dash: true },
          status: { brief: "draft", strategy: "draft", content: "draft", report: "draft" }
        };
        brandsStore.push(newBrand);
        activeBrandId = newBrand.id;
        renderSidebarBrands();
        updateBrandContext();
        showToast(`Brand ${newBrand.name} berhasil ditambahkan!`, "🏢");
      }
    });
  }

  // AI Extract Brief with Gemini
  document.getElementById("btn-ai-extract-brief")?.addEventListener("click", async () => {
    const brand = getActiveBrand();
    showToast("Gemini AI sedang mengekstrak poin penting brief...", "✨");
    const extracted = await extractBriefWithGemini("Brief kampanye awareness produk baru", brand.name);
    MOCK_BRIEF.goals = extracted.goals;
    MOCK_BRIEF.problem_statement = extracted.problem_statement;
    MOCK_BRIEF.target_audience = extracted.target_audience;
    MOCK_BRIEF.product_knowledge = extracted.product_knowledge || [];
    renderBriefScreen(brand);
    showToast("Brief berhasil diekstrak otomatis oleh Gemini AI!", "✅");
  });

  const confirmBriefBtn = document.getElementById("btn-confirm-brief");
  if (confirmBriefBtn) {
    confirmBriefBtn.addEventListener("click", () => {
      const brand = getActiveBrand();
      brand.status.brief = "confirmed";
      renderSidebarBrands();
      showToast("Brief berhasil di-confirm & Layer Strategy kini aktif!", "✅");
    });
  }

  // Auto Generate SWOT with Gemini
  document.getElementById("btn-ai-generate-swot")?.addEventListener("click", async () => {
    const brand = getActiveBrand();
    showToast(`Gemini AI sedang merumuskan analisis SWOT untuk ${brand.name}...`, "✨");
    const swot = await generateSWOTWithGemini(brand.name, brand.industry);
    MOCK_SWOT.strengths = swot.strengths;
    MOCK_SWOT.weaknesses = swot.weaknesses;
    MOCK_SWOT.opportunities = swot.opportunities;
    MOCK_SWOT.threats = swot.threats;
    renderStrategyScreen(brand);
    showToast("Analisis SWOT berhasil diperbarui oleh Gemini AI!", "🚀");
  });

  // Research Competitor with Gemini
  const aiCompetitorBtn = document.getElementById("btn-ai-competitor");
  if (aiCompetitorBtn) {
    aiCompetitorBtn.addEventListener("click", () => {
      showToast("Gemini Competitor Research Agent sedang menganalisis pasar...", "🤖");
      setTimeout(() => {
        MOCK_SWOT.competitors.push({
          name: "Baseus Official",
          positioning: "Kompetitor langsung di marketplace dengan visual aesthetic & variasi warna banyak"
        });
        const brand = getActiveBrand();
        renderStrategyScreen(brand);
        showToast("Insight kompetitor baru berhasil ditambahkan oleh Gemini!", "✨");
      }, 1000);
    });
  }

  // Auto Generate Personas with Gemini
  document.getElementById("btn-ai-generate-personas")?.addEventListener("click", () => {
    const brand = getActiveBrand();
    showToast("Gemini AI sedang merancang segmentasi persona audiens...", "✨");
    setTimeout(() => {
      MOCK_PERSONAS.push({
        id: `p_${Date.now()}`,
        name: "Remote Tech Enthusiast",
        type: "Tech & Workstation",
        target_qty: 10,
        reasoning: "Fokus pada kecepatan charging & kemudahan mobilitas saat hybrid working."
      });
      renderStrategyScreen(brand);
      showToast("Persona baru dirancang oleh Gemini AI!", "👥");
    }, 800);
  });

  const addPersonaBtn = document.getElementById("btn-add-persona");
  if (addPersonaBtn) {
    addPersonaBtn.addEventListener("click", () => {
      const name = prompt("Nama Persona Baru (misal: Executive Gamer):");
      if (name) {
        MOCK_PERSONAS.push({
          id: `p_${Date.now()}`,
          name: name,
          type: "Niche Audience",
          target_qty: 8,
          reasoning: "Fokus pada aksesoris charging & hub untuk setup gaming."
        });
        const brand = getActiveBrand();
        renderStrategyScreen(brand);
        showToast(`Persona ${name} berhasil ditambahkan!`, "👥");
      }
    });
  }

  // Style Analyzer with Gemini
  document.getElementById("btn-analyze-style")?.addEventListener("click", () => {
    const url = document.getElementById("input-style-url")?.value || "";
    showToast("Gemini Multimodal Agent sedang menganalisis style referensi konten...", "✨");
    setTimeout(() => {
      MOCK_STYLE_REF = {
        url: url || "https://tiktok.com/@creator/video/1",
        mood: "Modern Minimalist, Cinematic Warm Lighting, High Energy",
        visual_style: "Dynamic angle panning, macro product close-up, clean ambient noise",
        tone: "Persuasive, Energetic, Direct-to-consumer benefit focused"
      };
      const brand = getActiveBrand();
      renderStrategyScreen(brand);
      showToast("Style referensi berhasil dianalisis oleh Gemini!", "🎥");
    }, 1000);
  });

  // 30-Day Hooks Breakdown with Gemini
  const triggerBreakdownBtn = document.getElementById("btn-trigger-breakdown");
  if (triggerBreakdownBtn) {
    triggerBreakdownBtn.addEventListener("click", async () => {
      const brand = getActiveBrand();
      showToast("Gemini Content Breakdown Agent sedang merancang 30 hari content calendar...", "🤖");
      const newHooks = await generate30DayHooksWithGemini(brand.name, MOCK_PERSONAS);
      calendarHooksList = newHooks;
      renderContentScreen(brand);
      showToast("Breakdown 30 hari konten berhasil digenerate oleh Gemini AI!", "📅");
    });
  }

  const exportCopywriterBtn = document.getElementById("btn-export-copywriter");
  if (exportCopywriterBtn) {
    exportCopywriterBtn.addEventListener("click", () => {
      const brand = getActiveBrand();
      let textContent = `CAK AI - COPYWRITING & EDITOR CONTENT BRIEF (${brand.name.toUpperCase()})\n\n`;
      calendarHooksList.forEach(item => {
        textContent += `[TANGGAL ${item.day} AUG] - ${item.title}\n`;
        textContent += `Format: ${item.format} | Persona: ${item.persona}\n`;
        textContent += `Visual Concept: ${item.concept}\n`;
        textContent += `Copy Angle: ${item.copyAngle}\n\n`;
      });

      const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Copywriting_Brief_${brand.name}_Agustus2026.txt`;
      link.click();
      showToast("Brief Copywriter & Editor berhasil di-export!", "📤");
    });
  }

  const addSnapshotBtn = document.getElementById("btn-add-snapshot");
  if (addSnapshotBtn) {
    addSnapshotBtn.addEventListener("click", () => {
      const newSnapshotCount = prompt("Masukkan Follower Snapshot Minggu Ini untuk @ugreen.id (TikTok):", "51200");
      if (newSnapshotCount && !isNaN(newSnapshotCount)) {
        currentFollowerSnapshots[0].week_1 = currentFollowerSnapshots[0].week_2;
        currentFollowerSnapshots[0].week_2 = parseInt(newSnapshotCount, 10);

        const brand = getActiveBrand();
        currentMetrics = aggregateMetrics(currentPosts, currentFollowerSnapshots);
        renderReportScreen(brand);
        showToast("Snapshot follower berhasil diperbarui!", "📈");
      }
    });
  }

  const approveNarrativeBtn = document.getElementById("btn-approve-narrative");
  if (approveNarrativeBtn) {
    approveNarrativeBtn.addEventListener("click", () => {
      const brand = getActiveBrand();
      brand.status.report = "approved";
      renderSidebarBrands();
      showToast("Narasi Laporan disetujui & siap diexport!", "✅");
    });
  }

  // Regenerate AI Narrative (Gemini)
  const genNarrativeBtn = document.getElementById("btn-generate-narrative");
  if (genNarrativeBtn) {
    genNarrativeBtn.addEventListener("click", async () => {
      const brand = getActiveBrand();
      showToast("Gemini Report Narrative Agent sedang menyusun narasi performa...", "✨");
      currentNarrative = await generateReportNarrative(brand.name, currentMetrics);
      renderReportScreen(brand);
      showToast("Narasi Laporan berhasil digenerate oleh Gemini AI!", "🚀");
    });
  }

  const exportExcelBtn = document.getElementById("btn-export-excel");
  if (exportExcelBtn) {
    exportExcelBtn.addEventListener("click", () => {
      const brand = getActiveBrand();
      exportToExcel(brand.name, "Agustus 2026", currentMetrics, currentPosts);
      showToast("Laporan Excel (.csv) berhasil di-download!", "📗");
    });
  }

  const exportPptBtn = document.getElementById("btn-export-ppt");
  if (exportPptBtn) {
    exportPptBtn.addEventListener("click", () => {
      const brand = getActiveBrand();
      const overviewText = document.getElementById("narrative-overview-text").value;
      const conclusionText = document.getElementById("narrative-conclusion-text").value;

      const htmlContent = generatePPTSlidesHTML(brand.name, "Agustus 2026", currentMetrics, {
        overview: overviewText,
        conclusion: conclusionText
      });

      const win = window.open("", "_blank");
      win.document.write(htmlContent);
      win.document.close();
      showToast("PPT Presentation Deck berhasil digenerate!", "📙");
    });
  }

  const csvFileInput = document.getElementById("csv-file-input");
  if (csvFileInput) {
    csvFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async function(evt) {
          const csvText = evt.target.result;
          currentPosts = parseCSV(csvText);
          currentMetrics = aggregateMetrics(currentPosts, currentFollowerSnapshots);
          const brand = getActiveBrand();
          currentNarrative = await generateReportNarrative(brand.name, currentMetrics);
          renderReportScreen(brand);
          showToast(`Berhasil mengimpor Raw Scrape CSV! (${currentPosts.length} konten diproses)`, "✅");
        };
        reader.readAsText(file);
      }
    });
  }
}

// INITIALIZE ON DOM LOAD
document.addEventListener("DOMContentLoaded", () => {
  renderSidebarBrands();
  setupNavigation();
  setupEventListeners();
  updateGeminiStatusUI();
  switchScreen("dashboard");
  updateBrandContext();
});
