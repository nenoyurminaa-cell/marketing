// CAK AI Content & Marketing Strategist Platform - Powered by Google Gemini API

// ============================================================================
// 1. GEMINI API CLIENT & CONFIGURATION
// ============================================================================
const GEMINI_CONFIG = {
  getApiKey: () => localStorage.getItem("cak_gemini_api_key") || "",
  setApiKey: (key) => localStorage.setItem("cak_gemini_api_key", key),
  getModel: () => localStorage.getItem("cak_gemini_model") || "gemini-2.5-flash",
  setModel: (model) => localStorage.setItem("cak_gemini_model", model),
  getTemperature: () => parseFloat(localStorage.getItem("cak_gemini_temp") || "0.7"),
  setTemperature: (temp) => localStorage.setItem("cak_gemini_temp", temp)
};

// ============================================================================
// 1.1 THEME MANAGER & DISPLAY SETTINGS
// ============================================================================
const THEME_CONFIG = {
  getTheme: () => localStorage.getItem("cak_theme") || "modern",
  setTheme: (themeName, showNotification = true) => {
    document.documentElement.setAttribute("data-theme", themeName);
    localStorage.setItem("cak_theme", themeName);

    // Update Quick Select Dropdown in Topbar
    const quickSelect = document.getElementById("quick-theme-select");
    if (quickSelect) quickSelect.value = themeName;

    // Update Theme Grid active state in Settings
    document.querySelectorAll(".theme-card").forEach(card => {
      if (card.getAttribute("data-theme-id") === themeName) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });

    // Update Active Theme Pill
    const pill = document.getElementById("active-theme-pill");
    if (pill) {
      const themeLabels = {
        modern: "Tema: Modern 🚀",
        minimalist: "Tema: Minimalist 🖤",
        stylish: "Tema: Stylish 🔮",
        basic: "Tema: Basic 💼",
        cyberpunk: "Tema: Cyberpunk ⚡",
        sunset: "Tema: Sunset 🌅",
        light: "Tema: Light Mode ☀️"
      };
      pill.textContent = themeLabels[themeName] || `Tema: ${themeName}`;
    }

    if (showNotification) {
      showToast(`Tema visual diubah ke ${themeName.toUpperCase()}!`, "🎨");
    }
  },
  init: () => {
    const savedTheme = THEME_CONFIG.getTheme();
    THEME_CONFIG.setTheme(savedTheme, false);

    // Listener for Quick Select in Topbar
    const quickSelect = document.getElementById("quick-theme-select");
    if (quickSelect) {
      quickSelect.addEventListener("change", (e) => {
        THEME_CONFIG.setTheme(e.target.value);
      });
    }

    // Listener for Theme Cards in Settings
    document.querySelectorAll(".theme-card").forEach(card => {
      card.addEventListener("click", () => {
        const themeId = card.getAttribute("data-theme-id");
        if (themeId) THEME_CONFIG.setTheme(themeId);
      });
    });
  }
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
// 2. INITIAL DATA STORE & MOCK DATA (WITH SOCIAL MEDIA FOLLOWERS)
// ============================================================================
const INITIAL_BRANDS = [
  {
    id: "b1",
    name: "UGREEN",
    industry: "Consumer Electronics & Tech Accessories",
    logoBg: "#00B060",
    handle: "@ugreen_indonesia",
    followers: {
      total: 284500,
      formatted: "284.5K",
      growth: "+14.2K",
      growthPct: "+5.2%",
      accounts: [
        { platform: "TikTok", icon: "📱", handle: "@ugreen.id", start: 167800, current: 182000, growth: "+14.2K", growthPct: "+8.4%" },
        { platform: "Instagram", icon: "📸", handle: "@ugreen.official", start: 97500, current: 102500, growth: "+5.0K", growthPct: "+5.1%" }
      ]
    },
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
    handle: "@acekid.official",
    followers: {
      total: 95800,
      formatted: "95.8K",
      growth: "+8.9K",
      growthPct: "+10.2%",
      accounts: [
        { platform: "TikTok", icon: "📱", handle: "@acekid.toys", start: 54700, current: 61300, growth: "+6.6K", growthPct: "+12.1%" },
        { platform: "Instagram", icon: "📸", handle: "@acekid.official", start: 32200, current: 34500, growth: "+2.3K", growthPct: "+6.8%" }
      ]
    },
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
    handle: "@goldenramatours",
    followers: {
      total: 148200,
      formatted: "148.2K",
      growth: "+7.5K",
      growthPct: "+5.3%",
      accounts: [
        { platform: "Instagram", icon: "📸", handle: "@goldenramatours", start: 107500, current: 112000, growth: "+4.5K", growthPct: "+4.2%" },
        { platform: "TikTok", icon: "📱", handle: "@goldenrama.travel", start: 31400, current: 36200, growth: "+4.8K", growthPct: "+15.4%" }
      ]
    },
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
    handle: "@bareksa_id",
    followers: {
      total: 520400,
      formatted: "520.4K",
      growth: "+19.1K",
      growthPct: "+3.8%",
      accounts: [
        { platform: "Instagram", icon: "📸", handle: "@bareksa_id", start: 332400, current: 345000, growth: "+12.6K", growthPct: "+3.8%" },
        { platform: "TikTok", icon: "📱", handle: "@bareksa.official", start: 159900, current: 175400, growth: "+15.5K", growthPct: "+9.7%" }
      ]
    },
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
    handle: "@syailendra.capital",
    followers: {
      total: 78600,
      formatted: "78.6K",
      growth: "+3.8K",
      growthPct: "+5.1%",
      accounts: [
        { platform: "Instagram", icon: "📸", handle: "@syailendracapital", start: 54600, current: 56200, growth: "+1.6K", growthPct: "+2.9%" },
        { platform: "TikTok", icon: "📱", handle: "@syailendra.invest", start: 20100, current: 22400, growth: "+2.3K", growthPct: "+11.3%" }
      ]
    },
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
    handle: "@bellastories_id",
    followers: {
      total: 196300,
      formatted: "196.3K",
      growth: "+15.6K",
      growthPct: "+8.6%",
      accounts: [
        { platform: "TikTok", icon: "📱", handle: "@bellastories.fit", start: 118400, current: 138000, growth: "+19.6K", growthPct: "+16.5%" },
        { platform: "Instagram", icon: "📸", handle: "@bellastories", start: 54300, current: 58300, growth: "+4.0K", growthPct: "+7.2%" }
      ]
    },
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
// 5. DOCUMENT EXPORTER ENGINE (EXCEL & NATIVE PPTX)
// ============================================================================
function exportToExcel(brandName, period, metricsData, postsList) {
  let csvContent = "\uFEFF"; // UTF-8 BOM for Microsoft Excel compatibility
  
  csvContent += `CAK AI PERFORMANCE REPORT - ${brandName.toUpperCase()}\n`;
  csvContent += `Periode,${period}\n`;
  csvContent += `Generated At,${new Date().toLocaleDateString('id-ID')}\n\n`;

  csvContent += `RINGKASAN METRIK UTAMA\n`;
  csvContent += `Total Konten Dipantau,${metricsData.totalPosts}\n`;
  csvContent += `Total Views,${metricsData.totalViews}\n`;
  csvContent += `Total Likes,${metricsData.totalLikes}\n`;
  csvContent += `Total Comments,${metricsData.totalComments}\n`;
  csvContent += `Total Saves / Bookmarks,${metricsData.totalSaves}\n`;
  csvContent += `Total Shares,${metricsData.totalShares || 0}\n`;
  csvContent += `Rata-rata Engagement Rate (ER%),${metricsData.averageER}%\n`;
  csvContent += `Rincian Format,${metricsData.videoCount} Videos / ${metricsData.carouselCount} Carousels\n\n`;

  csvContent += `DETAIL KONTEN & HASIL MONITORING (RAW DATA)\n`;
  csvContent += `No,Judul / Hook Konten,Link Konten (URL),Platform,Akun Handle,Views,Engagement Rate (%),Likes,Comments,Saves,Shares,Format Konten,Tanggal Post\n`;

  postsList.forEach((p, idx) => {
    const title = (p.template_name || p.title || `Konten #${idx + 1}`).replace(/"/g, '""');
    const url = (p.url || '').replace(/"/g, '""');
    const platform = (p.platform || 'TikTok').replace(/"/g, '""');
    const account = (p.account_username || p.account || '').replace(/"/g, '""');
    const views = p.views || 0;
    const er = p.engagementRate || 0;
    const likes = p.likes || 0;
    const comments = p.comments || 0;
    const saves = p.saves || 0;
    const shares = p.shares || 0;
    const format = (p.type || p.format || 'Video').replace(/"/g, '""');
    const date = (p.posted_at || '').replace(/"/g, '""');

    csvContent += `${idx + 1},"${title}","${url}","${platform}","${account}",${views},${er}%,${likes},${comments},${saves},${shares},"${format}","${date}"\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Laporan_Excel_${brandName.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportToPPTX(brandName, period, metricsData, narrative, brand) {
  if (typeof PptxGenJS === "undefined") {
    const htmlContent = generatePPTSlidesHTML(brandName, period, metricsData, narrative);
    const win = window.open("", "_blank");
    win.document.write(htmlContent);
    win.document.close();
    return;
  }

  try {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';

    // SLIDE 1: Title Slide (Dark Premium Theme)
    const slide1 = pptx.addSlide();
    slide1.background = { color: '0B0F19' };
    slide1.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: 10, h: 0.1, fill: { color: '10B981' }
    });
    slide1.addText("CAK AI PERFORMANCE REPORT", {
      x: 0.8, y: 1.8, w: 8.4, h: 0.5,
      fontSize: 16, color: '10B981', bold: true, fontFace: 'Arial'
    });
    slide1.addText(brandName.toUpperCase(), {
      x: 0.8, y: 2.3, w: 8.4, h: 1.2,
      fontSize: 38, color: 'FFFFFF', bold: true, fontFace: 'Arial'
    });
    slide1.addText(`Periode Evaluasi: ${period} | Akun: ${brand?.handle || '@brand'}`, {
      x: 0.8, y: 3.6, w: 8.4, h: 0.5,
      fontSize: 14, color: '9CA3AF', fontFace: 'Arial'
    });

    // SLIDE 2: KPI Scorecard
    const slide2 = pptx.addSlide();
    slide2.background = { color: '0B0F19' };
    slide2.addText("EXECUTIVE KPI SUMMARY", {
      x: 0.8, y: 0.5, w: 8.4, h: 0.4,
      fontSize: 22, color: '10B981', bold: true
    });
    slide2.addText(`Agregasi metrik performa konten untuk ${brandName}`, {
      x: 0.8, y: 0.9, w: 8.4, h: 0.3,
      fontSize: 12, color: '9CA3AF'
    });

    const kpis = [
      { label: "TOTAL FOLLOWERS", val: brand?.followers?.formatted || '0', color: '10B981', x: 0.8 },
      { label: "TOTAL VIEWS", val: metricsData.totalViews.toLocaleString('id-ID'), color: '38BDF8', x: 3.1 },
      { label: "AVERAGE ER %", val: `${metricsData.averageER}%`, color: 'C084FC', x: 5.4 },
      { label: "TOTAL SAVES", val: metricsData.totalSaves.toLocaleString('id-ID'), color: 'F59E0B', x: 7.7 }
    ];

    kpis.forEach(k => {
      slide2.addShape(pptx.ShapeType.rect, {
        x: k.x, y: 1.5, w: 2.1, h: 2.0,
        fill: { color: '131D31' }, line: { color: '23334D', width: 1 }
      });
      slide2.addText(k.label, {
        x: k.x, y: 1.7, w: 2.1, h: 0.3,
        fontSize: 10, color: '9CA3AF', align: 'center', bold: true
      });
      slide2.addText(k.val, {
        x: k.x, y: 2.1, w: 2.1, h: 0.8,
        fontSize: 22, color: k.color, align: 'center', bold: true
      });
    });

    // SLIDE 3: Top Performer Content (Rank 1 to 5)
    const slide3 = pptx.addSlide();
    slide3.background = { color: '0B0F19' };
    slide3.addText("TOP PERFORMING CONTENT (WINNER CONTENT)", {
      x: 0.8, y: 0.5, w: 8.4, h: 0.4,
      fontSize: 22, color: '10B981', bold: true
    });

    const tableRows = [
      [
        { text: "No", options: { bold: true, fill: { color: '131D31' }, color: '10B981' } },
        { text: "Judul / Hook Konten", options: { bold: true, fill: { color: '131D31' }, color: 'FFFFFF' } },
        { text: "Platform", options: { bold: true, fill: { color: '131D31' }, color: 'FFFFFF' } },
        { text: "Views", options: { bold: true, fill: { color: '131D31' }, color: '38BDF8' } },
        { text: "ER (%)", options: { bold: true, fill: { color: '131D31' }, color: '10B981' } },
        { text: "Saves", options: { bold: true, fill: { color: '131D31' }, color: 'F59E0B' } },
        { text: "Link", options: { bold: true, fill: { color: '131D31' }, color: '38BDF8' } }
      ]
    ];

    (metricsData.topByER || []).slice(0, 5).forEach((item, idx) => {
      tableRows.push([
        { text: `#${idx + 1}`, options: { color: '10B981', bold: true } },
        { text: (item.template_name || '-').substring(0, 38), options: { color: 'FFFFFF' } },
        { text: item.platform || 'TikTok', options: { color: '9CA3AF' } },
        { text: (item.views || 0).toLocaleString('id-ID'), options: { color: 'FFFFFF' } },
        { text: `${item.engagementRate}%`, options: { color: '10B981', bold: true } },
        { text: (item.saves || 0).toLocaleString('id-ID'), options: { color: 'F59E0B' } },
        { text: item.url ? '🔗 Link' : '-', options: { color: '38BDF8', hyperlink: item.url ? { url: item.url } : undefined } }
      ]);
    });

    slide3.addTable(tableRows, {
      x: 0.8, y: 1.2, w: 8.4,
      fontSize: 10,
      border: { pt: 1, color: '23334D' },
      fill: { color: '111827' }
    });

    // SLIDE 4: Strategic Takeaways (Gemini AI)
    const slide4 = pptx.addSlide();
    slide4.background = { color: '0B0F19' };
    slide4.addText("EXECUTIVE TAKEAWAYS & REKOMENDASI", {
      x: 0.8, y: 0.5, w: 8.4, h: 0.4,
      fontSize: 22, color: '10B981', bold: true
    });
    slide4.addText(narrative.overview || "Evaluasi performa konten menunjukkan pertumbuhan positif pada audience awareness dan conversion.", {
      x: 0.8, y: 1.2, w: 8.4, h: 1.5,
      fontSize: 12, color: 'D1D5DB'
    });
    slide4.addText("REKOMENDASI STRATEGI KONTEN BERIKUTNYA:", {
      x: 0.8, y: 2.9, w: 8.4, h: 0.3,
      fontSize: 14, color: '10B981', bold: true
    });
    slide4.addText(narrative.conclusion || "1. Perbanyak format hook edukatif dan problem-solution.\n2. Tingkatkan CTA untuk shares & bookmarks.", {
      x: 0.8, y: 3.3, w: 8.4, h: 1.6,
      fontSize: 12, color: '9CA3AF'
    });

    const fileName = `Laporan_Kinerja_${brandName.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.pptx`;
    pptx.writeFile({ fileName });
  } catch (e) {
    console.error("PPTX export error:", e);
    const htmlContent = generatePPTSlidesHTML(brandName, period, metricsData, narrative);
    const win = window.open("", "_blank");
    win.document.write(htmlContent);
    win.document.close();
  }
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

function getGeminiModelLabel(model) {
  if (model === "gemini-2.5-flash") return "Gemini 2.5 Flash";
  if (model === "gemini-2.5-pro") return "Gemini 2.5 Pro";
  if (model === "gemini-2.0-flash") return "Gemini 2.0 Flash";
  if (model === "gemini-1.5-pro") return "Gemini 1.5 Pro";
  if (model === "gemini-1.5-flash") return "Gemini 1.5 Flash";
  return model || "Gemini 2.5 Flash";
}

function updateGeminiStatusUI() {
  const key = GEMINI_CONFIG.getApiKey();
  const model = GEMINI_CONFIG.getModel();
  const dot = document.getElementById("gemini-status-dot");
  const text = document.getElementById("gemini-status-text");
  const kpiModel = document.getElementById("kpi-gemini-model");
  const sidebarBadge = document.getElementById("sidebar-gemini-status-badge");
  const settingsStatus = document.getElementById("settings-conn-status");

  const modelLabel = getGeminiModelLabel(model);

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
    <div class="brand-item ${b.id === activeBrandId ? 'active' : ''}" data-brand-id="${b.id}" style="padding: 7px 10px;">
      <div class="brand-info" style="gap: 8px;">
        <div class="brand-badge" style="background:${b.logoBg}; width: 26px; height: 26px; font-size: 11px; font-weight: 800;">
          ${b.name.substring(0, 2).toUpperCase()}
        </div>
        <div style="min-width: 0;">
          <div class="brand-name" style="font-size: 13px; line-height: 1.2; font-weight: 600;">${b.name}</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px; display: flex; align-items: center; gap: 4px;">
            <span style="color: var(--accent-emerald); font-weight: 700;">👥 ${b.followers?.formatted || '0'}</span>
            <span>•</span>
            <span style="max-width: 85px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${b.handle || '@brand'}</span>
          </div>
        </div>
      </div>
      <span class="nav-status status-${b.status.report}" style="font-size: 10px; padding: 2px 6px;">${b.status.report === 'narrative_review' ? 'Review' : b.status.report}</span>
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
  const bannerHandle = document.getElementById("active-brand-handle");
  const bannerFollowers = document.getElementById("active-brand-followers-badge");

  if (bannerName) bannerName.textContent = brand.name;
  if (bannerBadge) {
    bannerBadge.style.backgroundColor = brand.logoBg;
    bannerBadge.textContent = brand.name.substring(0, 2).toUpperCase();
  }
  if (bannerHandle) bannerHandle.textContent = brand.handle || `@${brand.name.toLowerCase().replace(/\s+/g, '')}`;
  if (bannerFollowers) bannerFollowers.textContent = `👥 ${brand.followers?.formatted || '0'} Followers`;

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

  // Dynamic Top Bar Titles
  const titleEl = document.getElementById("top-bar-title");
  const subEl = document.getElementById("top-bar-subtitle");
  if (titleEl && subEl) {
    if (screenName === "dashboard") {
      titleEl.textContent = "Dashboard Overview";
      subEl.textContent = "Multi-Brand Marketing & Content Strategist Platform";
    } else if (screenName === "brief") {
      titleEl.textContent = "Brief Intake";
      subEl.textContent = "Input, tempel, atau ekstrak brief client dengan Gemini 2.5";
    } else if (screenName === "strategy") {
      titleEl.textContent = "Strategi Brand";
      subEl.textContent = "Analisis SWOT, Riset Kompetitor, dan Segmentasi Persona";
    } else if (screenName === "content") {
      titleEl.textContent = "Kalender Konten 30 Hari";
      subEl.textContent = "Breakdown jadwal, angle copywriting, dan visual konsep";
    } else if (screenName === "report") {
      titleEl.textContent = "Laporan Kinerja";
      subEl.textContent = "Agregasi metrik performa & Export Excel / PPT";
    } else if (screenName === "settings") {
      titleEl.textContent = "Pengaturan Gemini API";
      subEl.textContent = "Konfigurasi API Key & Pilihan Model AI";
    }
  }

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

  brandGrid.innerHTML = brandsStore.map(b => {
    const accountsHtml = (b.followers?.accounts || []).map(acc => `
      <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 11px; background: var(--bg-input); padding: 3px 8px; border-radius: 4px; border: 1px solid var(--border-subtle);">
        <span>${acc.icon || '📱'}</span>
        <span style="color: var(--text-secondary);">${acc.platform}:</span>
        <strong style="color: var(--text-main);">${acc.followers || (acc.current ? acc.current.toLocaleString('id-ID') : '0')}</strong>
        <span style="color: var(--accent-emerald); font-size: 10px; font-weight: 600;">(${acc.growthPct || '+0%'})</span>
      </span>
    `).join('');

    return `
    <div class="glass-card" style="margin-bottom: 0;">
      <div class="card-header-title" style="margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="brand-badge" style="background:${b.logoBg}; width: 34px; height: 34px; font-size: 13px; font-weight: 800;">
            ${b.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <h4 style="font-size: 15px; font-weight: 700;">${b.name}</h4>
              <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">${b.handle || ''}</span>
            </div>
            <p style="font-size: 12px; color: var(--text-secondary);">${b.industry}</p>
          </div>
        </div>
        <button class="btn btn-secondary btn-select-brand" data-id="${b.id}" style="padding: 5px 10px; font-size: 12px;">
          📝 Input / Buka Brief →
        </button>
      </div>

      <!-- Followers Summary Strip -->
      <div style="background: var(--bg-app); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">👥 TOTAL FOLLOWERS HANDLED</span>
          <span style="font-size: 13px; font-weight: 800; color: var(--accent-emerald);">
            ${b.followers?.formatted || '0'} 
            <span style="font-size: 11px; color: var(--text-muted); font-weight: 500;">(${b.followers?.growth || '+0'} bln ini)</span>
          </span>
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${accountsHtml || '<span style="font-size: 11px; color: var(--text-muted);">Belum ada akun terhubung</span>'}
        </div>
      </div>

      <!-- Status Pills -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
        <div style="background: var(--bg-app); padding: 6px; border-radius: 6px; text-align: center; border: 1px solid var(--border-subtle);">
          <div style="font-size: 9px; color: var(--text-muted); font-weight: 600;">BRIEF</div>
          <div class="badge-pill status-${b.status.brief}" style="margin-top: 2px; font-size: 10px;">${b.status.brief}</div>
        </div>
        <div style="background: var(--bg-app); padding: 6px; border-radius: 6px; text-align: center; border: 1px solid var(--border-subtle);">
          <div style="font-size: 9px; color: var(--text-muted); font-weight: 600;">STRATEGY</div>
          <div class="badge-pill status-${b.status.strategy}" style="margin-top: 2px; font-size: 10px;">${b.status.strategy}</div>
        </div>
        <div style="background: var(--bg-app); padding: 6px; border-radius: 6px; text-align: center; border: 1px solid var(--border-subtle);">
          <div style="font-size: 9px; color: var(--text-muted); font-weight: 600;">CONTENT</div>
          <div class="badge-pill status-${b.status.content}" style="margin-top: 2px; font-size: 10px;">${b.status.content}</div>
        </div>
        <div style="background: var(--bg-app); padding: 6px; border-radius: 6px; text-align: center; border: 1px solid var(--border-subtle);">
          <div style="font-size: 9px; color: var(--text-muted); font-weight: 600;">REPORT</div>
          <div class="badge-pill status-${b.status.report}" style="margin-top: 2px; font-size: 10px;">${b.status.report}</div>
        </div>
      </div>
    </div>
  `;}).join('');

  document.querySelectorAll(".btn-select-brand").forEach(btn => {
    btn.addEventListener("click", () => {
      activeBrandId = btn.getAttribute("data-id");
      renderSidebarBrands();
      updateBrandContext();
      switchScreen("brief");
    });
  });
}

// SCREEN 2: BRIEF INTAKE
function renderBriefScreen(brand) {
  const brandNameInput = document.getElementById("brief-brand-name");
  const goalsInput = document.getElementById("brief-goals");
  const problemInput = document.getElementById("brief-problem");
  const audienceInput = document.getElementById("brief-audience");
  const pkContainer = document.getElementById("brief-product-knowledge");

  if (brandNameInput && brand) brandNameInput.value = brand.name;
  if (goalsInput) goalsInput.value = MOCK_BRIEF.goals;
  if (problemInput) problemInput.value = MOCK_BRIEF.problem_statement;
  if (audienceInput) audienceInput.value = MOCK_BRIEF.target_audience;

  if (pkContainer && MOCK_BRIEF.product_knowledge) {
    pkContainer.innerHTML = MOCK_BRIEF.product_knowledge.map(pk => `
      <div style="background: var(--bg-input); padding: 8px 12px; border-radius: 6px; margin-bottom: 6px; font-size: 13px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--border-subtle);">
        <span>✨ ${pk}</span>
        <span style="color: var(--accent-emerald); font-size: 11px; font-weight: 600;">✓ Verified</span>
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

  const brandFollowers = brand.followers || { total: 0, formatted: "0", growth: "+0", growthPct: "0%", accounts: [] };
  const repFollowersEl = document.getElementById("rep-total-followers");
  const repGrowthSubEl = document.getElementById("rep-follower-growth-sub");
  const repAccBadge = document.getElementById("rep-account-count-badge");

  if (repFollowersEl) repFollowersEl.textContent = brandFollowers.formatted;
  if (repGrowthSubEl) repGrowthSubEl.textContent = `${brandFollowers.growth} (${brandFollowers.growthPct}) bln ini`;
  if (repAccBadge) repAccBadge.textContent = `${brandFollowers.accounts?.length || 0} Akun Aktif`;

  if (totalViewsEl) totalViewsEl.textContent = currentMetrics.totalViews.toLocaleString('id-ID');
  if (avgErEl) avgErEl.textContent = `${currentMetrics.averageER}%`;
  if (totalSavesEl) totalSavesEl.textContent = currentMetrics.totalSaves.toLocaleString('id-ID');
  if (totalSharesEl) totalSharesEl.textContent = (currentMetrics.totalShares || 0).toLocaleString('id-ID');
  if (totalPostsEl) totalPostsEl.textContent = currentMetrics.totalPosts;

  // 1. TOP ER TABLE
  const topErBody = document.getElementById("table-top-er");
  if (topErBody) {
    topErBody.innerHTML = currentMetrics.topByER.map((item, idx) => `
      <tr>
        <td><strong style="color: var(--accent-emerald);">#${idx + 1}</strong></td>
        <td>
          <strong>${item.template_name}</strong><br/>
          <span style="font-size:11px; color:var(--text-muted);">${item.platform} | ${item.type}</span>
          ${item.url ? `<a href="${item.url}" target="_blank" style="margin-left: 6px; font-size: 10px; color: var(--accent-blue);">🔗 Buka</a>` : ''}
        </td>
        <td><span class="badge-pill badge-green">${item.engagementRate}%</span></td>
        <td>${(item.saves || 0).toLocaleString('id-ID')}</td>
        <td><span class="badge-pill badge-purple">${(item.shares || 0).toLocaleString('id-ID')}</span></td>
      </tr>
    `).join('');
  }

  // 2. TOP VIEWS TABLE
  const topViewsBody = document.getElementById("table-top-views");
  if (topViewsBody) {
    topViewsBody.innerHTML = currentMetrics.topByViews.map((item, idx) => `
      <tr>
        <td><strong style="color: var(--accent-blue);">#${idx + 1}</strong></td>
        <td>
          <strong>${item.template_name}</strong><br/>
          <span style="font-size:11px; color:var(--text-muted);">${item.platform} | ${item.type}</span>
          ${item.url ? `<a href="${item.url}" target="_blank" style="margin-left: 6px; font-size: 10px; color: var(--accent-blue);">🔗 Buka</a>` : ''}
        </td>
        <td><strong>${(item.views || 0).toLocaleString('id-ID')}</strong></td>
        <td>${(item.likes || 0).toLocaleString('id-ID')}</td>
        <td><span class="badge-pill badge-blue">${item.engagementRate}%</span></td>
      </tr>
    `).join('');
  }

  // 3. HANDLED ACCOUNTS TABLE
  const followerBody = document.getElementById("table-follower-growth");
  if (followerBody) {
    if (brandFollowers.accounts && brandFollowers.accounts.length > 0) {
      followerBody.innerHTML = brandFollowers.accounts.map((acc, accIdx) => `
        <tr>
          <td><span style="font-size: 14px; margin-right: 6px;">${acc.icon || '📱'}</span><strong>${acc.platform}</strong></td>
          <td><span style="font-family: var(--font-mono); font-weight: 600; color: var(--accent-blue);">${acc.handle}</span></td>
          <td>${(acc.start || 0).toLocaleString('id-ID')}</td>
          <td><strong style="color: var(--text-main);">${(acc.current || 0).toLocaleString('id-ID')}</strong></td>
          <td><span style="color: var(--accent-emerald); font-weight: 700;">${acc.growth}</span></td>
          <td><span class="badge-pill badge-green">${acc.growthPct}</span></td>
          <td>
            <button class="btn btn-ghost btn-delete-account" data-idx="${accIdx}" style="padding: 2px 6px; font-size: 11px; color: var(--accent-red);" title="Hapus Akun">
              🗑️
            </button>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll(".btn-delete-account").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-idx"), 10);
          if (confirm(`Hapus akun ${brandFollowers.accounts[idx]?.handle} dari monitoring brand ini?`)) {
            brandFollowers.accounts.splice(idx, 1);
            let total = 0;
            brandFollowers.accounts.forEach(a => total += (a.current || 0));
            brandFollowers.total = total;
            brandFollowers.formatted = total >= 1000000 ? (total/1000000).toFixed(1) + 'M' : total >= 1000 ? (total/1000).toFixed(1) + 'K' : total.toString();
            renderReportScreen(brand);
            renderSidebarBrands();
            updateBrandContext();
            showToast("Akun berhasil dihapus dari tracking.", "🗑️");
          }
        });
      });
    } else {
      followerBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">
            Belum ada akun media sosial yang ditautkan untuk brand ini. Klik "➕ Tambah Akun Target" di atas untuk menambahkan.
          </td>
        </tr>
      `;
    }
  }

  // 4. MASTER CONTENT MONITORING TABLE (FOR EXCEL & PPT EXPORT)
  const masterContentBody = document.getElementById("table-all-scraped-posts");
  if (masterContentBody) {
    if (currentPosts && currentPosts.length > 0) {
      masterContentBody.innerHTML = currentPosts.map((p, idx) => `
        <tr>
          <td><strong style="color: var(--text-muted); font-size: 11px;">#${idx + 1}</strong></td>
          <td>
            <span style="font-size: 11px; background: var(--bg-input); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-subtle);">
              ${p.platform || 'TikTok'} • <strong>${p.account_username || p.account || brand.handle || ''}</strong>
            </span>
          </td>
          <td>
            <strong style="font-size: 12px; color: var(--text-main);">${p.template_name || p.title || 'Konten #' + (idx+1)}</strong>
          </td>
          <td>
            ${p.url ? `<a href="${p.url}" target="_blank" style="font-size: 11px; color: var(--accent-blue); text-decoration: underline; font-family: var(--font-mono); max-width: 140px; display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">🔗 ${p.url}</a>` : '<span style="color: var(--text-muted); font-size: 11px;">-</span>'}
          </td>
          <td><strong>${(p.views || 0).toLocaleString('id-ID')}</strong></td>
          <td><span class="badge-pill badge-green">${p.engagementRate}%</span></td>
          <td>${(p.likes || 0).toLocaleString('id-ID')}</td>
          <td>${(p.comments || 0).toLocaleString('id-ID')}</td>
          <td><span style="color: var(--accent-amber); font-weight: 600;">${(p.saves || 0).toLocaleString('id-ID')}</span></td>
          <td><span style="color: var(--accent-purple); font-weight: 600;">${(p.shares || 0).toLocaleString('id-ID')}</span></td>
          <td>
            <button class="btn btn-ghost btn-delete-post" data-idx="${idx}" style="padding: 2px 6px; font-size: 11px; color: var(--accent-red);" title="Hapus Konten">
              🗑️
            </button>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll(".btn-delete-post").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-idx"), 10);
          currentPosts.splice(idx, 1);
          currentMetrics = aggregateMetrics(currentPosts, currentFollowerSnapshots);
          renderReportScreen(brand);
          showToast("Konten dihapus dari database.", "🗑️");
        });
      });
    } else {
      masterContentBody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align: center; color: var(--text-muted); padding: 24px;">
            Belum ada data konten. Gunakan "➕ Tambah Link Konten Baru" atau "📥 Import File CSV" di atas.
          </td>
        </tr>
      `;
    }
  }

  const overviewInput = document.getElementById("narrative-overview-text");
  const conclusionInput = document.getElementById("narrative-conclusion-text");

  if (overviewInput) overviewInput.value = currentNarrative.overview;
  if (conclusionInput) conclusionInput.value = currentNarrative.conclusion;
}

// SETUP EVENT LISTENERS
function setupEventListeners() {
  // Test Gemini API Button
  const settingsBtnTest = document.getElementById("settings-btn-test");
  if (settingsBtnTest) {
    settingsBtnTest.addEventListener("click", async () => {
      const key = document.getElementById("settings-input-key").value.trim();
      const selectModelEl = document.getElementById("settings-select-model");
      let model = selectModelEl ? selectModelEl.value : "gemini-2.5-flash";
      if (model === "custom") {
        model = document.getElementById("settings-input-custom-model")?.value.trim() || "gemini-2.5-flash";
      }

      if (!key) {
        alert("Masukkan Gemini API Key terlebih dahulu.");
        return;
      }

      showToast(`Menguji koneksi ke Gemini API (${model})...`, "⏳");
      const startTime = Date.now();

      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: "Respond in 1 word: OK" }] }]
          })
        });

        const latency = Date.now() - startTime;

        if (res.ok) {
          showToast(`Koneksi ${model} Sukses 100%! (${latency}ms) 🚀`, "✅");
          const settingsStatus = document.getElementById("settings-conn-status");
          if (settingsStatus) {
            settingsStatus.textContent = `🟢 Terkoneksi (${model} - ${latency}ms)`;
            settingsStatus.className = "badge-pill badge-green";
          }
        } else {
          const err = await res.json().catch(() => ({}));
          alert(`Gagal koneksi API (${model}): ${err.error?.message || res.statusText}`);
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
      const selectModelEl = document.getElementById("settings-select-model");
      let model = selectModelEl ? selectModelEl.value : "gemini-2.5-flash";
      if (model === "custom") {
        model = document.getElementById("settings-input-custom-model")?.value.trim() || "gemini-2.5-flash";
      }
      const temp = document.getElementById("settings-select-temp").value;

      GEMINI_CONFIG.setApiKey(key);
      GEMINI_CONFIG.setModel(model);
      GEMINI_CONFIG.setTemperature(temp);

      updateGeminiStatusUI();
      showToast(`Pengaturan Gemini (${model}) berhasil disimpan!`, "✅");
    });
  }

  // ADD TARGET ACCOUNT (CHANNEL MONITORING)
  const addTargetAccountBtn = document.getElementById("btn-add-target-account");
  if (addTargetAccountBtn) {
    addTargetAccountBtn.addEventListener("click", () => {
      const brand = getActiveBrand();
      const platform = prompt("Pilih Platform Akun (TikTok / Instagram / YouTube):", "TikTok") || "TikTok";
      const handle = prompt(`Masukkan handle akun ${platform} (misal: @${brand.name.toLowerCase().replace(/\s+/g, '')}):`, `@${brand.name.toLowerCase().replace(/\s+/g, '')}`);
      if (!handle) return;

      const startFollowersStr = prompt(`Followers Awal Bulan untuk ${handle}:`, "50000") || "50000";
      const currentFollowersStr = prompt(`Followers Terkini untuk ${handle}:`, "58200") || "58200";

      const start = parseInt(startFollowersStr.replace(/[^0-9]/g, ''), 10) || 0;
      const current = parseInt(currentFollowersStr.replace(/[^0-9]/g, ''), 10) || start;
      const delta = current - start;
      const pct = start > 0 ? ((delta / start) * 100).toFixed(1) : "0.0";
      const icon = platform.toLowerCase().includes("tiktok") ? "📱" : platform.toLowerCase().includes("insta") ? "📸" : "▶️";

      if (!brand.followers) {
        brand.followers = { total: 0, formatted: "0", growth: "+0", growthPct: "+0%", accounts: [] };
      }

      brand.followers.accounts.push({
        platform: platform,
        icon: icon,
        handle: handle.startsWith("@") ? handle : `@${handle}`,
        start: start,
        current: current,
        growth: delta >= 0 ? `+${(delta/1000).toFixed(1)}K` : `${(delta/1000).toFixed(1)}K`,
        growthPct: delta >= 0 ? `+${pct}%` : `${pct}%`
      });

      let total = 0;
      brand.followers.accounts.forEach(a => total += (a.current || 0));
      brand.followers.total = total;
      brand.followers.formatted = total >= 1000000 ? (total/1000000).toFixed(1) + 'M' : total >= 1000 ? (total/1000).toFixed(1) + 'K' : total.toString();

      renderReportScreen(brand);
      renderSidebarBrands();
      updateBrandContext();
      showToast(`Akun ${handle} (${platform}) berhasil ditambahkan ke tracking!`, "👥");
    });
  }

  // ADD CONTENT METRIC (INDIVIDUAL POST INGESTION)
  const addContentMetricBtn = document.getElementById("btn-add-content-metric");
  if (addContentMetricBtn) {
    addContentMetricBtn.addEventListener("click", () => {
      const brand = getActiveBrand();
      const title = prompt("Judul / Hook Konten (misal: '3 Alasan Charger GaN Lebih Dingin'):");
      if (!title) return;

      const url = prompt("Link URL Konten (misal: https://tiktok.com/@ugreen.id/video/123):", "https://tiktok.com/@brand/video/1") || "";
      const platform = prompt("Platform (TikTok / Instagram):", "TikTok") || "TikTok";
      const viewsStr = prompt("Jumlah Views / Penayangan:", "45000") || "10000";
      const likesStr = prompt("Jumlah Likes:", "3200") || "500";
      const commentsStr = prompt("Jumlah Comments:", "180") || "50";
      const savesStr = prompt("Jumlah Saves / Bookmarks:", "420") || "100";
      const sharesStr = prompt("Jumlah Shares:", "150") || "50";

      const views = parseInt(viewsStr.replace(/[^0-9]/g, ''), 10) || 1;
      const likes = parseInt(likesStr.replace(/[^0-9]/g, ''), 10) || 0;
      const comments = parseInt(commentsStr.replace(/[^0-9]/g, ''), 10) || 0;
      const saves = parseInt(savesStr.replace(/[^0-9]/g, ''), 10) || 0;
      const shares = parseInt(sharesStr.replace(/[^0-9]/g, ''), 10) || 0;

      const er = (((likes + comments + saves + shares) / views) * 100).toFixed(2);

      const newPost = {
        template_name: title,
        template_mode: "Manual Input",
        platform: platform,
        type: "Video",
        account_username: brand.handle || "@brand",
        views: views,
        likes: likes,
        comments: comments,
        saves: saves,
        shares: shares,
        engagementRate: parseFloat(er),
        url: url,
        posted_at: new Date().toISOString().split('T')[0]
      };

      currentPosts.unshift(newPost);
      currentMetrics = aggregateMetrics(currentPosts, currentFollowerSnapshots);
      renderReportScreen(brand);
      showToast(`Konten "${title}" berhasil ditambahkan ke database & kalkulasi!`, "📊");
    });
  }

  // REGEN NARRATIVE INLINE
  const regenNarrativeInlineBtn = document.getElementById("btn-regen-narrative-inline");
  if (regenNarrativeInlineBtn) {
    regenNarrativeInlineBtn.addEventListener("click", async () => {
      const brand = getActiveBrand();
      showToast("Gemini sedang memperbarui narasi eksekutif...", "✨");
      currentNarrative = await generateReportNarrative(brand.name, currentMetrics);
      renderReportScreen(brand);
      showToast("Narasi Eksekutif berhasil diperbarui oleh Gemini AI!", "🚀");
    });
  }

  // 1. EXPORT TO EXCEL (.csv)
  const exportExcelBtn = document.getElementById("btn-export-excel");
  if (exportExcelBtn) {
    exportExcelBtn.addEventListener("click", () => {
      const brand = getActiveBrand();
      exportToExcel(brand.name, "Agustus 2026", currentMetrics, currentPosts);
      showToast("Laporan Excel (.csv) dengan kolom No, Link, ER%, Views berhasil diunduh!", "📗");
    });
  }

  // 2. EXPORT TO PPTX / PRESENTATION DECK
  const exportPptBtn = document.getElementById("btn-export-ppt");
  if (exportPptBtn) {
    exportPptBtn.addEventListener("click", () => {
      const brand = getActiveBrand();
      const overviewText = document.getElementById("narrative-overview-text")?.value || currentNarrative.overview;
      const conclusionText = document.getElementById("narrative-conclusion-text")?.value || currentNarrative.conclusion;

      exportToPPTX(brand.name, "Agustus 2026", currentMetrics, {
        overview: overviewText,
        conclusion: conclusionText
      }, brand);

      showToast("File Presentasi PPT (.pptx) berhasil digenerate!", "📙");
    });
  }

  // CSV IMPORT
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
          showToast(`Berhasil mengimpor Raw Data CSV! (${currentPosts.length} konten diproses)`, "✅");
        };
        reader.readAsText(file);
      }
    });
  }
}

// INITIALIZE ON DOM LOAD
document.addEventListener("DOMContentLoaded", () => {
  THEME_CONFIG.init();
  renderSidebarBrands();
  setupNavigation();
  setupEventListeners();
  updateGeminiStatusUI();
  switchScreen("dashboard");
  updateBrandContext();
});
