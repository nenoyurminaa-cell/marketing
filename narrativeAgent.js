// CAK AI Platform - Layer 4: Report Narrative Agent (LLM Simulation & Prompt Builder)

export function generateReportNarrative(brandName, metricsData, extraContext = "") {
  const topErTitle = metricsData.topByER[0] ? metricsData.topByER[0].template_name : "N/A";
  const topViewsTitle = metricsData.topByViews[0] ? metricsData.topByViews[0].template_name : "N/A";
  
  const overviewDraft = `Pada periode laporan kali ini, brand ${brandName} berhasil mengumpulkan total ${metricsData.totalViews.toLocaleString('id-ID')} views dari ${metricsData.totalPosts} konten yang dipublikasikan. 

Rata-rata Engagement Rate (ER%) berada di angka ${metricsData.averageER}% [Formula: (Likes + Comments + Saves + Shares) / Views * 100], dengan akumulasi total ${metricsData.totalShares.toLocaleString('id-ID')} shares dan ${metricsData.totalSaves.toLocaleString('id-ID')} saves. Performa tertinggi didorong oleh konten format ${metricsData.videoCount > metricsData.carouselCount ? 'Short Video' : 'Edu Carousel'}. 

Konten paling viral periode ini adalah "${topViewsTitle}" yang berhasil mencapai ${metricsData.topByViews[0]?.views.toLocaleString('id-ID') || 0} views. Sementara itu, tingkat interaksi paling mendalam dihasilkan oleh konten "${topErTitle}" dengan ER ${metricsData.topByER[0]?.engagementRate || 0}%, di mana akumulasi jumlah shares (${metricsData.topByER[0]?.shares || 0}) & saves (${metricsData.topByER[0]?.saves || 0}) menjadi sinyal kuat organiknya jangkauan distribusi konten di media sosial.`;

  const conclusionDraft = `Secara keseluruhan, strategi konten periode ini terbukti efektif menjaga daya tarik audiens. Kombinasi akumulasi saves dan shares (virality advocacy) membuktikan bahwa audiens aktif membagikan konten ke grup / kerabat mereka.

REKOMENDASI & Aksi Strategis Selanjutnya:
1. Scale up pembagian porsi konten berformat Hook Unboxing & POV Lifestyle yang memiliki tingkat views konstan di atas 10.000 views.
2. Pertahankan pilar edukasi carousel 1x seminggu untuk memancing retention saves, bookmark, dan shares audiens.
3. Alokasikan eksperimen audio/trend baru pada 20% porsi konten mingguan untuk menjaga fleksibilitas terhadap algoritma terbaru.`;

  return {
    overview: overviewDraft,
    conclusion: conclusionDraft,
    generatedAt: new Date().toISOString()
  };
}
