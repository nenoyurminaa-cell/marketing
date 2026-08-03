# CAK AI Content & Marketing Strategist Platform - FastAPI Core Server
import os
import io
import json
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel

app = FastAPI(
    title="CAK AI Strategist Platform API",
    description="Backend API Core for CAK AI Agency (Brief Extraction, Metrics Aggregator, Narrative Agent, PPT/Excel Exporters)",
    version="1.0.0"
)

# Enable CORS for local Next.js / Vite / HTML client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class PostMetric(BaseModel):
    posted_at: Optional[str] = ""
    template_name: str
    template_mode: Optional[str] = ""
    views: int = 0
    likes: int = 0
    comments: int = 0
    saves: int = 0
    shares: int = 0
    type: str = "video"
    description: Optional[str] = ""
    hashtags: Optional[str] = ""
    url: Optional[str] = ""
    account_username: Optional[str] = ""
    platform: Optional[str] = "tiktok"

class FollowerSnapshot(BaseModel):
    account_username: str
    platform: str
    week_1: int
    week_2: int

class AggregateRequest(BaseModel):
    brand_name: str
    posts: List[PostMetric]
    follower_snapshots: Optional[List[FollowerSnapshot]] = []

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "CAK AI Content & Marketing Strategist Platform Backend",
        "version": "1.0.0",
        "phases_enabled": ["Phase 1 (Reporting)", "Phase 2 (Follower Snapshots)", "Phase 3 (Brief Intake)", "Phase 4 (Strategy)", "Phase 5 (Content Breakdown)"]
    }

@app.post("/api/reports/aggregate")
def aggregate_report_metrics(req: AggregateRequest):
    """
    Layer 4: Metrics Aggregator Engine
    ER% = (likes + comments + saves + shares) / views * 100
    Filter Rule: views > 200 AND (likes + comments + saves + shares) >= 2
    """
    posts = req.posts
    if not posts:
        return {"error": "No post data provided"}

    processed_posts = []
    total_views = 0
    total_likes = 0
    total_comments = 0
    total_saves = 0
    total_shares = 0
    video_count = 0
    carousel_count = 0

    for p in posts:
        v = p.views
        l = p.likes
        c = p.comments
        s = p.saves
        sh = p.shares
        eng_sum = l + c + s + sh
        er = (eng_sum / v * 100) if v > 0 else 0.0

        total_views += v
        total_likes += l
        total_comments += c
        total_saves += s
        total_shares += sh

        if p.type.lower() == "carousel":
            carousel_count += 1
        else:
            video_count += 1

        post_dict = p.dict()
        post_dict["engagement_sum"] = eng_sum
        post_dict["engagement_rate"] = round(er, 2)
        processed_posts.append(post_dict)

    # Filtering rule: views > 200 AND engagement_sum >= 2
    valid_posts = [p for p in processed_posts if p["views"] > 200 and p["engagement_sum"] >= 2]
    avg_er = round(sum(p["engagement_rate"] for p in valid_posts) / len(valid_posts), 2) if valid_posts else 0.0

    # Top Performers
    top_by_er = sorted(processed_posts, key=lambda x: x["engagement_rate"], reverse=True)[:3]
    top_by_views = sorted(processed_posts, key=lambda x: x["views"], reverse=True)[:3]

    # Follower Growth
    follower_deltas = []
    for f in req.follower_snapshots:
        delta = f.week_2 - f.week_1
        pct = round((delta / f.week_1 * 100), 2) if f.week_1 > 0 else 0.0
        follower_deltas.append({
            "account": f.account_username,
            "platform": f.platform,
            "week_1": f.week_1,
            "week_2": f.week_2,
            "delta": delta,
            "pct_growth": pct
        })

    return {
        "brand_name": req.brand_name,
        "total_posts": len(posts),
        "total_views": total_views,
        "total_likes": total_likes,
        "total_comments": total_comments,
        "total_saves": total_saves,
        "total_shares": total_shares,
        "video_count": video_count,
        "carousel_count": carousel_count,
        "average_er": avg_er,
        "filtered_posts_count": len(valid_posts),
        "top_by_er": top_by_er,
        "top_by_views": top_by_views,
        "follower_growth": follower_deltas
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
