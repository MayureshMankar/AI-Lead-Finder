"""
Unified Search System
Searches across multiple job platforms and combines results
"""

import asyncio
import aiohttp
import json
import time
from typing import List, Dict, Optional, Any
from datetime import datetime
import logging
from concurrent.futures import ThreadPoolExecutor
import threading

# Import individual scrapers
from .linkedin_scraper import login_and_scrape_jobs
from .reddit_scraper import get_recent_posts
from .glassdoor_scraper import GlassdoorScraper
from .indeed_scraper import IndeedScraper

# Import API scrapers
from apis.remoteok import fetch_remoteok_jobs
from apis.arbeitnow import fetch_arbeitnow_jobs
from apis.remotive import fetch_remotive_jobs

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UnifiedSearch:
    """
    Unified search across multiple job platforms
    """
    
    def __init__(self):
        # Only initialize working scrapers for production
        self.scrapers = {
            # 'glassdoor': GlassdoorScraper(),  # Commented out - blocked by website
            # 'indeed': IndeedScraper()         # Commented out - blocked by website
        }
        self.function_scrapers = {
            # 'linkedin': login_and_scrape_jobs,  # Disabled for initial launch
            # 'reddit': get_recent_posts        # Disabled for initial launch
        }
        self.executor = ThreadPoolExecutor(max_workers=4)
        self.session = None
    
    async def search_jobs(self, 
                         query: str,
                         location: str = "",
                         platforms: List[str] = None,
                         max_results: int = 50,
                         filters: Dict = None) -> Dict[str, Any]:
        """
        Search for jobs across multiple platforms
        
        Args:
            query: Job search query (e.g., "Python Developer")
            location: Location for job search
            platforms: List of platforms to search (default: all)
            max_results: Maximum results per platform
            filters: Additional filters (experience_level, job_type, etc.)
            
        Returns:
            Dict containing search results and metadata
        """
        
        if platforms is None:
            # Include only API scrapers for initial launch
            platforms = ['api']  # api includes remoteok, arbeitnow, remotive
        
        if filters is None:
            filters = {}
        
        logger.info(f"Starting unified search for: {query} in {location}")
        logger.info(f"Platforms: {platforms}")
        logger.info(f"Available scrapers: {list(self.scrapers.keys())}")
        logger.info(f"Available function scrapers: {list(self.function_scrapers.keys())}")
        
        # Initialize results
        results = {
            'query': query,
            'location': location,
            'platforms_searched': platforms,
            'total_results': 0,
            'results_by_platform': {},
            'combined_results': [],
            'search_metadata': {
                'start_time': datetime.now().isoformat(),
                'filters_applied': filters,
                'max_results_per_platform': max_results
            }
        }
        
        # Create tasks for each platform
        tasks = []
        for platform in platforms:
            if platform in self.scrapers or platform in self.function_scrapers or platform == 'api':
                task = self._search_platform(
                    platform, query, location, max_results, filters
                )
                tasks.append(task)
        
        # Execute all searches concurrently
        if tasks:
            platform_results = await asyncio.gather(*tasks, return_exceptions=True)
            
                    # Process results
        for i, platform in enumerate(platforms):
            if platform in self.scrapers or platform in self.function_scrapers or platform == 'api':
                result = platform_results[i]
                
                if isinstance(result, Exception):
                    logger.error(f"Error searching {platform}: {result}")
                    results['results_by_platform'][platform] = {
                        'status': 'error',
                        'error': str(result),
                        'results': []
                    }
                else:
                    # Check if the platform returned mock data (indicates scraping was blocked)
                    jobs = result.get('jobs', [])
                    has_mock_data = any('Mock' in job.get('title', '') for job in jobs)
                    
                    results['results_by_platform'][platform] = {
                        'status': 'success' if not has_mock_data else 'limited',
                        'results': jobs,
                        'total_found': result.get('total_found', 0),
                        'search_time': result.get('search_time', 0),
                        'note': 'Mock data returned - scraping was blocked' if has_mock_data else None
                    }
                    results['total_results'] += len(jobs)
        
        # Combine and deduplicate results
        results['combined_results'] = self._combine_and_deduplicate_results(
            results['results_by_platform']
        )
        
        # Add search completion metadata
        results['search_metadata']['end_time'] = datetime.now().isoformat()
        results['search_metadata']['total_platforms_successful'] = sum(
            1 for platform_data in results['results_by_platform'].values()
            if platform_data.get('status') == 'success'
        )
        
        logger.info(f"Unified search completed. Total results: {results['total_results']}")
        return results
    
    def _fetch_api_jobs(self, query: str, max_results: int) -> Dict:
        """
        Fetch jobs from API-based sources (RemoteOK, Arbeitnow, Remotive)
        """
        try:
            all_jobs = []
            
            # Fetch from RemoteOK
            try:
                remoteok_jobs = fetch_remoteok_jobs(query)
                for job in remoteok_jobs:
                    job['source'] = 'remoteok'
                    all_jobs.append(job)
                logger.info(f"RemoteOK: Found {len(remoteok_jobs)} jobs")
            except Exception as e:
                logger.error(f"RemoteOK error: {e}")
            
            # Fetch from Arbeitnow
            try:
                arbeitnow_jobs = fetch_arbeitnow_jobs(query)
                for job in arbeitnow_jobs:
                    job['source'] = 'arbeitnow'
                    all_jobs.append(job)
                logger.info(f"Arbeitnow: Found {len(arbeitnow_jobs)} jobs")
            except Exception as e:
                logger.error(f"Arbeitnow error: {e}")
            
            # Fetch from Remotive
            try:
                remotive_jobs = fetch_remotive_jobs(query, max_results)
                for job in remotive_jobs:
                    job['source'] = 'remotive'
                    all_jobs.append(job)
                logger.info(f"Remotive: Found {len(remotive_jobs)} jobs")
            except Exception as e:
                logger.error(f"Remotive error: {e}")
            
            # Limit results
            all_jobs = all_jobs[:max_results]
            
            return {
                'jobs': all_jobs,
                'total_found': len(all_jobs),
                'platform': 'api',
                'sources': ['remoteok', 'arbeitnow', 'remotive']
            }
            
        except Exception as e:
            logger.error(f"API jobs fetch error: {e}")
            return {
                'jobs': [],
                'total_found': 0,
                'platform': 'api',
                'error': str(e)
            }
    
    async def _search_platform(self, 
                              platform: str, 
                              query: str, 
                              location: str, 
                              max_results: int, 
                              filters: Dict) -> Dict:
        """
        Search a specific platform
        """
        try:
            start_time = time.time()
            
            # Use threading for synchronous scrapers
            loop = asyncio.get_event_loop()
            
            if platform in self.scrapers:
                # Class-based scrapers
                scraper = self.scrapers[platform]
                result = await loop.run_in_executor(
                    self.executor,
                    scraper.search_jobs,
                    query,
                    location,
                    max_results,
                    filters
                )
            elif platform in self.function_scrapers:
                # Function-based scrapers
                scraper_func = self.function_scrapers[platform]
                
                if platform == 'linkedin':
                    result = await loop.run_in_executor(
                        self.executor,
                        scraper_func,
                        query,
                        location,
                        max_results
                    )
                    # Convert LinkedIn format to standard format
                    result = {
                        'jobs': result,
                        'total_found': len(result),
                        'platform': 'linkedin'
                    }
                elif platform == 'reddit':
                    result = await loop.run_in_executor(
                        self.executor,
                        scraper_func,
                        max_results,
                        query
                    )
                    # Convert Reddit format to standard format
                    result = {
                        'jobs': result,
                        'total_found': len(result),
                        'platform': 'reddit'
                    }
            elif platform == 'api':
                # API-based scrapers (RemoteOK, Arbeitnow, Remotive)
                result = await loop.run_in_executor(
                    self.executor,
                    self._fetch_api_jobs,
                    query,
                    max_results
                )
            else:
                raise ValueError(f"Unknown platform: {platform}")
            
            search_time = time.time() - start_time
            
            return {
                'jobs': result.get('jobs', []),
                'total_found': result.get('total_found', 0),
                'search_time': search_time,
                'platform': platform
            }
            
        except Exception as e:
            logger.error(f"Error searching {platform}: {e}")
            raise e
    
    def _combine_and_deduplicate_results(self, platform_results: Dict) -> List[Dict]:
        """
        Combine results from all platforms and remove duplicates
        """
        all_jobs = []
        seen_urls = set()
        seen_titles = set()
        
        for platform, data in platform_results.items():
            if data.get('status') == 'success':
                jobs = data.get('results', [])
                
                for job in jobs:
                    # Create unique identifier for deduplication
                    job_url = job.get('url', '').lower()
                    job_title = job.get('title', '').lower()
                    company = job.get('company', '').lower()
                    
                    # Create composite key for better deduplication
                    composite_key = f"{job_title}|{company}|{job_url}"
                    
                    if composite_key not in seen_titles and job_url not in seen_urls:
                        # Add platform information to job
                        job['source_platform'] = platform
                        job['search_metadata'] = {
                            'found_at': datetime.now().isoformat(),
                            'platform': platform
                        }
                        
                        all_jobs.append(job)
                        seen_urls.add(job_url)
                        seen_titles.add(composite_key)
        
        # Sort by relevance (you can implement custom ranking here)
        all_jobs.sort(key=lambda x: x.get('posted_date', ''), reverse=True)
        
        return all_jobs
    
    def filter_results(self, 
                      results: List[Dict], 
                      filters: Dict) -> List[Dict]:
        """
        Apply filters to search results
        
        Args:
            results: List of job results
            filters: Dictionary of filters to apply
            
        Returns:
            Filtered list of jobs
        """
        filtered_results = results.copy()
        
        # Filter by experience level
        if 'experience_level' in filters:
            experience = filters['experience_level'].lower()
            filtered_results = [
                job for job in filtered_results
                if experience in job.get('experience_level', '').lower()
                or experience in job.get('title', '').lower()
            ]
        
        # Filter by job type
        if 'job_type' in filters:
            job_type = filters['job_type'].lower()
            filtered_results = [
                job for job in filtered_results
                if job_type in job.get('job_type', '').lower()
                or job_type in job.get('title', '').lower()
            ]
        
        # Filter by salary range
        if 'salary_min' in filters or 'salary_max' in filters:
            salary_min = filters.get('salary_min', 0)
            salary_max = filters.get('salary_max', float('inf'))
            
            filtered_results = [
                job for job in filtered_results
                if self._is_salary_in_range(job, salary_min, salary_max)
            ]
        
        # Filter by remote work
        if 'remote_only' in filters and filters['remote_only']:
            filtered_results = [
                job for job in filtered_results
                if 'remote' in job.get('location', '').lower()
                or 'remote' in job.get('title', '').lower()
                or 'work from home' in job.get('description', '').lower()
            ]
        
        # Filter by date posted
        if 'posted_within_days' in filters:
            days = filters['posted_within_days']
            cutoff_date = datetime.now().timestamp() - (days * 24 * 60 * 60)
            
            filtered_results = [
                job for job in filtered_results
                if self._is_job_recent(job, cutoff_date)
            ]
        
        return filtered_results
    
    def _is_salary_in_range(self, job: Dict, min_salary: float, max_salary: float) -> bool:
        """Check if job salary is within specified range"""
        salary = job.get('salary', '')
        if not salary:
            return True  # Include jobs without salary info
        
        # Extract numeric salary value (simplified)
        try:
            # Remove currency symbols and extract numbers
            import re
            numbers = re.findall(r'\d+', str(salary))
            if numbers:
                salary_value = float(numbers[0])
                return min_salary <= salary_value <= max_salary
        except:
            pass
        
        return True
    
    def _is_job_recent(self, job: Dict, cutoff_timestamp: float) -> bool:
        """Check if job was posted recently"""
        posted_date = job.get('posted_date', '')
        if not posted_date:
            return True  # Include jobs without date info
        
        try:
            # Convert posted_date to timestamp (simplified)
            # You might need to implement proper date parsing based on your data format
            return True  # For now, include all jobs
        except:
            return True
    
    def get_search_suggestions(self, query: str) -> List[str]:
        """
        Get search suggestions based on query
        """
        suggestions = []
        
        # Common job titles
        job_titles = [
            'Software Engineer', 'Developer', 'Data Scientist', 'Product Manager',
            'Designer', 'Marketing Manager', 'Sales Representative', 'Analyst',
            'Manager', 'Director', 'VP', 'CEO', 'CTO', 'CFO'
        ]
        
        # Common technologies
        technologies = [
            'Python', 'JavaScript', 'React', 'Node.js', 'Java', 'C++',
            'Machine Learning', 'AI', 'Data Science', 'DevOps', 'AWS',
            'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'Redis'
        ]
        
        # Generate suggestions
        for title in job_titles:
            if query.lower() in title.lower():
                suggestions.append(title)
        
        for tech in technologies:
            if query.lower() in tech.lower():
                suggestions.append(f"{query} {tech}")
                suggestions.append(f"{tech} {query}")
        
        return suggestions[:10]  # Return top 10 suggestions
    
    def get_trending_searches(self) -> List[str]:
        """
        Get trending job searches
        """
        return [
            'Remote Software Engineer',
            'Data Scientist',
            'Product Manager',
            'DevOps Engineer',
            'Frontend Developer',
            'Backend Developer',
            'Full Stack Developer',
            'Machine Learning Engineer',
            'UX Designer',
            'Sales Representative'
        ]
    
    async def save_search_results(self, 
                                 user_id: int, 
                                 search_results: Dict, 
                                 search_name: str = None) -> Dict:
        """
        Save search results for later reference
        
        Args:
            user_id: User ID
            search_results: Results from search_jobs
            search_name: Optional name for the search
            
        Returns:
            Dict with save status
        """
        try:
            # This would typically save to database
            # For now, we'll return a mock response
            
            saved_search = {
                'id': int(time.time()),  # Mock ID
                'user_id': user_id,
                'search_name': search_name or f"Search {datetime.now().strftime('%Y-%m-%d %H:%M')}",
                'query': search_results['query'],
                'location': search_results['location'],
                'total_results': search_results['total_results'],
                'saved_at': datetime.now().isoformat(),
                'results': search_results['combined_results'][:50]  # Save first 50 results
            }
            
            return {
                'success': True,
                'saved_search': saved_search,
                'message': 'Search results saved successfully'
            }
            
        except Exception as e:
            logger.error(f"Error saving search results: {e}")
            return {
                'success': False,
                'error': str(e)
            }

# Global instance
unified_search = UnifiedSearch()

# Convenience functions
async def search_jobs(query: str, location: str = "", platforms: List[str] = None, 
                     max_results: int = 50, filters: Dict = None) -> Dict[str, Any]:
    """Convenience function for job search"""
    return await unified_search.search_jobs(query, location, platforms, max_results, filters)

def get_search_suggestions(query: str) -> List[str]:
    """Convenience function for search suggestions"""
    return unified_search.get_search_suggestions(query)

def get_trending_searches() -> List[str]:
    """Convenience function for trending searches"""
    return unified_search.get_trending_searches()

if __name__ == "__main__":
    # Example usage
    async def test_search():
        results = await search_jobs("Python Developer", "Remote", max_results=10)
        print(f"Found {results['total_results']} jobs")
        for job in results['combined_results'][:3]:
            print(f"- {job['title']} at {job['company']}")
    
    asyncio.run(test_search())
