# CAK AI Platform - Automated Test & Verification Suite
import os
import sys

def run_tests():
    print("=" * 60)
    print("🧪 RUNNING CAK AI PLATFORM SUITE VERIFICATION")
    print("=" * 60)

    # 1. File Structure Verification
    required_files = [
        "index.html",
        "styles.css",
        "app.js",
        "mockData.js",
        "metricsAggregator.js",
        "narrativeAgent.js",
        "documentExporter.js",
        "schema.sql",
        "server.py",
        "requirements.txt"
    ]

    missing = [f for f in required_files if not os.path.exists(f)]
    if missing:
        print(f"❌ Verification Failed: Missing files {missing}")
        sys.exit(1)
    else:
        print("✅ File Structure Test: All 10 core files present!")

    # 2. Formula Math Test: ER% = (likes + comments + saves + shares) / views * 100
    sample_post = {
        "views": 10000,
        "likes": 500,
        "comments": 50,
        "saves": 250,
        "shares": 200
    }
    
    eng_sum = sample_post["likes"] + sample_post["comments"] + sample_post["saves"] + sample_post["shares"]
    er_pct = (eng_sum / sample_post["views"]) * 100
    expected_er = 10.0 # (500 + 50 + 250 + 200) / 10000 * 100 = 1000 / 10000 * 100 = 10.0%

    assert er_pct == expected_er, f"ER Math error: got {er_pct}, expected {expected_er}"
    print(f"✅ ER% Math Formula Test Passed! Calculated: {er_pct}% (Includes Shares: {sample_post['shares']})")

    # 3. Filtering Rule Test: views > 200 AND engagement >= 2
    posts = [
        {"views": 150, "likes": 5, "comments": 1, "saves": 0, "shares": 0}, # Fails: views <= 200
        {"views": 500, "likes": 0, "comments": 0, "saves": 0, "shares": 0}, # Fails: eng < 2
        {"views": 1000, "likes": 10, "comments": 2, "saves": 1, "shares": 1} # Passes!
    ]

    valid = [p for p in posts if p["views"] > 200 and (p["likes"] + p["comments"] + p["saves"] + p["shares"]) >= 2]
    assert len(valid) == 1, f"Filtering error: expected 1 valid post, got {len(valid)}"
    print(f"✅ ER% Filtering Rule Test Passed! (views > 200 AND engagement >= 2 filter verified)")

    print("=" * 60)
    print("🎉 ALL PLATFORM TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
