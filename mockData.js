// CAK AI Content & Marketing Strategist Platform - Mock Initial Data Store

export const INITIAL_BRANDS = [
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

export const SAMPLE_RAW_CSV = `posted_at,template_name,template_mode,views,likes,comments,saves,shares,type,description,hashtags,url,account_username,platform
2026-08-01T10:00:00Z,UGREEN Nexode 100W,Unboxing,12500,850,92,410,185,video,"Ga usah bawa banyak charger lagi! Cukup 1 UGREEN Nexode 100W buatsemua gadget. #UGREENIndonesia #TechEssentials",#UGREENIndonesia #TechEssentials,https://tiktok.com/@ugreen.id/video/1,ugreen.id,tiktok
2026-08-02T14:30:00Z,UGREEN MagSafe Powerbank,POV Lifestyle,18400,1230,145,780,310,video,"Powerbank tipis tapi fast charging 15W MagSafe! Pas banget buat traveling. #GaPakeRibet",#GaPakeRibet #UGREEN,https://tiktok.com/@ugreen.id/video/2,ugreen.id,tiktok
2026-08-03T11:15:00Z,Tips Charger LapTop Awet,Edu Carousel,4200,210,38,190,95,carousel,"5 Kebiasaan buruk yang bikin baterai laptop kamu cepet bocor! Swipe sampai habis. #TechEssentials",#TechEssentials #TipsGadget,https://instagram.com/p/3,ugreen.official,instagram
2026-07-28T09:00:00Z,UGREEN Cable Organizer,Problem Solution,9800,540,42,310,120,video,"Meja kerja berantakan gara2 kabel? Solusinya pakai UGREEN Magnetic Cable Clip! #UGREENIndonesia",#UGREENIndonesia,https://tiktok.com/@ugreen.id/video/4,ugreen.id,tiktok
2026-07-29T16:20:00Z,UGREEN Hub 7-in-1,Review Tech,24500,1950,210,1120,490,video,"MacBook cuma 2 port Type-C? Pakai Hub UGREEN ini langsung dapet HDMI 4K + SD Card + 3 USB A!",#UGREEN #MacbookSetup,https://tiktok.com/@ugreen.id/video/5,ugreen.id,tiktok
2026-07-30T12:00:00Z,UGREEN Hitune Earbuds,Aesthetic Sound,150,5,1,2,0,video,"Noise cancellation mantap harga 300ribuan aja!",#UGREEN,https://tiktok.com/@ugreen.id/video/6,ugreen.id,tiktok
2026-07-31T18:45:00Z,UGREEN Car Fast Charger,Car Setup Carousel,8900,430,29,240,110,carousel,"Charge iPhone dari 0% ke 60% cuma 30 menit di dalam mobil! #UGREENIndonesia",#UGREENIndonesia,https://instagram.com/p/7,ugreen.official,instagram`;

export const SAMPLE_FOLLOWER_SNAPSHOTS = [
  { account_username: "ugreen.id", platform: "tiktok", week_1: 45200, week_2: 48600 },
  { account_username: "ugreen.official", platform: "instagram", week_1: 89300, week_2: 91100 }
];

export const MOCK_BRIEF = {
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

export const MOCK_SWOT = {
  strengths: "Kualitas build premium, sertifikasi resmi Apple MFi, beragam port lengkap, daya tahan tinggi.",
  weaknesses: "Harga sedikit lebih tinggi dibanding brand charger generik tanpa nama.",
  opportunities: "Apple & Samsung tidak lagi menyertakan kepala charger di box penjualan HP baru.",
  threats: "Maraknya barang KW UGREEN palsu tanpa garansi resmi di e-commerce.",
  competitors: [
    { name: "Anker", positioning: "Top competitor premium, reputasi kuat tapi harga lebih mahal" },
    { name: "Baseus", positioning: "Desain trendy, variasi produk banyak, persaingan harga ketat" }
  ]
};

export const MOCK_PERSONAS = [
  { id: "p1", name: "The Tech Nomad (WFH Worker)", type: "Professional", target_qty: 10, reasoning: "Fokus ke charger GaN multiport 100W & USB Hub untuk produktivitas meja kerja." },
  { id: "p2", name: "Gen-Z On-the-Go Creator", type: "Lifestyle & Creator", target_qty: 12, reasoning: "Fokus ke MagSafe Powerbank & TWS Earbuds dengan warna-warna aesthetic." },
  { id: "p3", name: "Smart Commuter", type: "Daily Travel", target_qty: 8, reasoning: "Fokus ke Car Charger, Cable Organizer & Phone Holder di kendaraan." }
];

export const MOCK_STYLE_REF = {
  url: "https://tiktok.com/@tech_unboxing_aesthetic/123",
  mood: "Clean, Minimalist, High-Tech, Premium Darkness",
  visual_style: "Top-down desk setup, RGB warm lighting, macro shot ports, smooth transition sound effects",
  tone: "Informative, Direct to the point, ASMR unboxing vibes"
};
