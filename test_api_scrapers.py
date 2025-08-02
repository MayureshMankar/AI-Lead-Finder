#!/usr/bin/env python3
"""
Quick test script to check if API scrapers are working
"""

import sys
import os

# Add the project root to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_remoteok():
    print("Testing RemoteOK...")
    try:
        from apis.remoteok import fetch_remoteok_jobs
        jobs = fetch_remoteok_jobs("python")
        print(f"✅ RemoteOK: Found {len(jobs)} jobs")
        if jobs:
            print(f"   Sample: {jobs[0]['position']} at {jobs[0]['company']}")
        return True
    except Exception as e:
        print(f"❌ RemoteOK failed: {e}")
        return False

def test_arbeitnow():
    print("\nTesting Arbeitnow...")
    try:
        from apis.arbeitnow import fetch_arbeitnow_jobs
        jobs = fetch_arbeitnow_jobs("python")
        print(f"✅ Arbeitnow: Found {len(jobs)} jobs")
        if jobs:
            print(f"   Sample: {jobs[0]['position']} at {jobs[0]['company']}")
        return True
    except Exception as e:
        print(f"❌ Arbeitnow failed: {e}")
        return False

def test_remotive():
    print("\nTesting Remotive...")
    try:
        from apis.remotive import fetch_remotive_jobs
        jobs = fetch_remotive_jobs("python", 5)
        print(f"✅ Remotive: Found {len(jobs)} jobs")
        if jobs:
            print(f"   Sample: {jobs[0]['position']} at {jobs[0]['company']}")
        return True
    except Exception as e:
        print(f"❌ Remotive failed: {e}")
        return False

def test_process_email_jobs():
    print("\nTesting process_email_jobs...")
    try:
        from main import process_email_jobs
        jobs = process_email_jobs(source="all", keyword="python", limit=5, return_jobs=True)
        print(f"✅ process_email_jobs: Found {len(jobs)} jobs")
        if jobs:
            print(f"   Sample: {jobs[0]['position']} at {jobs[0]['company']}")
        return True
    except Exception as e:
        print(f"❌ process_email_jobs failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing API Scrapers...")
    print("=" * 50)
    
    remoteok_ok = test_remoteok()
    arbeitnow_ok = test_arbeitnow()
    remotive_ok = test_remotive()
    process_ok = test_process_email_jobs()
    
    print("\n" + "=" * 50)
    print("📊 RESULTS:")
    print(f"RemoteOK: {'✅ Working' if remoteok_ok else '❌ Failed'}")
    print(f"Arbeitnow: {'✅ Working' if arbeitnow_ok else '❌ Failed'}")
    print(f"Remotive: {'✅ Working' if remotive_ok else '❌ Failed'}")
    print(f"process_email_jobs: {'✅ Working' if process_ok else '❌ Failed'}")
    
    if all([remoteok_ok, arbeitnow_ok, remotive_ok, process_ok]):
        print("\n🎉 All scrapers are working!")
    else:
        print("\n⚠️ Some scrapers are not working. Check the errors above.") 