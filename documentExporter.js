// CAK AI Platform - Layer 4: Document Generator (Excel & PPT Export Engine)

export function exportToExcel(brandName, period, metricsData, postsList) {
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Header Info
  csvContent += `CAK AI PERFORMANCE REPORT - ${brandName.toUpperCase()}\n`;
  csvContent += `Periode,${period}\n`;
  csvContent += `Generated At,${new Date().toLocaleDateString('id-ID')}\n\n`;

  // Summary Metrics Section
  csvContent += `METRIK KINERJA UTAMA\n`;
  csvContent += `Total Content Posts,${metricsData.totalPosts}\n`;
  csvContent += `Total Views,${metricsData.totalViews}\n`;
  csvContent += `Total Likes,${metricsData.totalLikes}\n`;
  csvContent += `Total Comments,${metricsData.totalComments}\n`;
  csvContent += `Total Saves,${metricsData.totalSaves}\n`;
  csvContent += `Total Shares,${metricsData.totalShares}\n`;
  csvContent += `Rata-rata ER (%) [Formula: (Likes+Comments+Saves+Shares)/Views*100],${metricsData.averageER}%\n`;
  csvContent += `Video vs Carousel,${metricsData.videoCount} Videos / ${metricsData.carouselCount} Carousels\n\n`;

  // Post Detail Table
  csvContent += `DETAIL KONTEN (RAW SCRAPE DATA)\n`;
  csvContent += `Posted At,Template Name,Template Mode,Platform,Account,Views,Likes,Comments,Saves,Shares,ER (%),Type,URL\n`;

  postsList.forEach(p => {
    const cleanDesc = (p.description || '').replace(/"/g, '""');
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

export function generatePPTSlidesHTML(brandName, period, metricsData, narrative) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Report PPT Preview - ${brandName}</title>
      <style>
        body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background: #0b0f19; color: #fff; margin: 0; padding: 40px; }
        .slide { width: 960px; height: 540px; background: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; margin: 0 auto 40px auto; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.5); page-break-after: always; }
        .slide-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10b981; padding-bottom: 12px; }
        .slide-header h2 { margin: 0; color: #10b981; font-size: 24px; text-transform: uppercase; tracking: 1px; }
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

      <!-- SLIDE 1: Cover -->
      <div class="slide hero-slide">
        <h1 style="font-size: 42px; margin: 0; color: #ffffff;">MARKETING & CONTENT REPORT</h1>
        <h2 style="font-size: 28px; color: #34d399; margin: 16px 0;">${brandName.toUpperCase()}</h2>
        <p style="color: #9ca3af; font-size: 18px;">Periode Evaluasi: ${period} | Prepared by CAK AI Agency</p>
      </div>

      <!-- SLIDE 2: Metrics Overview -->
      <div class="slide">
        <div class="slide-header">
          <h2>1. Executive Summary & Overview Metrics</h2>
          <span>${brandName}</span>
        </div>
        <div class="slide-body">
          <p>Rangkuman performa akumulatif dari konten yang dipublikasikan selama periode laporan (ER% = Likes+Comments+Saves+Shares / Views * 100):</p>
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

      <!-- SLIDE 3: Campaign Overview Narrative -->
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

      <!-- SLIDE 4: Top 3 by ER -->
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

      <!-- SLIDE 5: Top 3 by Views -->
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

      <!-- SLIDE 6: Strategic Conclusion & Next Steps -->
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
