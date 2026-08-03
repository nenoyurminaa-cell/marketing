// CAK AI Platform - Layer 4: Metrics Aggregator Engine (Deterministic Code)

export function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const posts = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle CSV quoted strings with commas
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

      // Parse numerical metrics
      const views = parseInt(rowObj.views, 10) || 0;
      const likes = parseInt(rowObj.likes, 10) || 0;
      const comments = parseInt(rowObj.comments, 10) || 0;
      const saves = parseInt(rowObj.saves, 10) || 0;
      const shares = parseInt(rowObj.shares, 10) || 0;

      // Updated ER% formula: (likes + comments + saves + shares) / views * 100
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

export function aggregateMetrics(postsList, followerSnapshotsList = []) {
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

  // Filter Rule from PRD: views > 200 AND total_engagement >= 2
  const validPostsForER = postsList.filter(p => p.views > 200 && p.engagementSum >= 2);
  
  const sumER = validPostsForER.reduce((acc, p) => acc + p.engagementRate, 0);
  const averageER = validPostsForER.length > 0 ? (sumER / validPostsForER.length).toFixed(2) : '0.00';

  // Top 3 by ER%
  const sortedByER = [...postsList].sort((a, b) => b.engagementRate - a.engagementRate);
  const topByER = sortedByER.slice(0, 3);

  // Top 3 by Views
  const sortedByViews = [...postsList].sort((a, b) => b.views - a.views);
  const topByViews = sortedByViews.slice(0, 3);

  // Follower Growth Calculation
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
