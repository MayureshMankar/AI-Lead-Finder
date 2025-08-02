#!/usr/bin/env python3
"""
Test unified search functionality
"""

import asyncio
import sys
import os

# Add the project root to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

async def test_unified_search():
    print("🧪 Testing Unified Search...")
    print("=" * 50)
    
    try:
        from scraper.unified_search import UnifiedSearch
        
        search = UnifiedSearch()
        print(f"Available scrapers: {list(search.scrapers.keys())}")
        print(f"Available function scrapers: {list(search.function_scrapers.keys())}")
        
        result = await search.search_jobs('python', 'remote', ['api'], 10)
        
        print(f"\n📊 RESULTS:")
        print(f"Total results: {result['total_results']}")
        print(f"Platforms searched: {result['platforms_searched']}")
        print(f"Platform results: {list(result['results_by_platform'].keys())}")
        
        for platform, data in result['results_by_platform'].items():
            status = data.get('status', 'unknown')
            count = len(data.get('results', []))
            print(f"  - {platform}: {status} ({count} jobs)")
        
        if result['total_results'] > 0:
            print(f"\n✅ Unified search is working! Found {result['total_results']} jobs")
            return True
        else:
            print(f"\n❌ Unified search returned 0 results")
            return False
            
    except Exception as e:
        print(f"\n❌ Error testing unified search: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_unified_search())
    if success:
        print("\n🎉 Unified search test passed!")
    else:
        print("\n⚠️ Unified search test failed!") 