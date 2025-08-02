import argparse
from main import process_email_jobs, process_linkedin_jobs, process_reddit_posts

def main():
    parser = argparse.ArgumentParser(
        description="🎯 AI Lead Finder CLI - Scrape and auto-contact job opportunities from multiple sources."
    )

    parser.add_argument(
        "--api",
        choices=["remoteok", "remotive", "arbeitnow", "all"],
        help="Fetch jobs via API (RemoteOK, Remotive, Arbeitnow, or all)"
    )

    parser.add_argument(
        "--limit",
        type=int,
        default=10,
        help="Limit number of jobs/posts to process (default: 10)"
    )

    parser.add_argument(
        "--keyword",
        type=str,
        default="developer",
        help="Keyword to search for jobs/posts (default: developer)"
    )

    parser.add_argument(
        "--linkedin",
        action="store_true",
        help="Run LinkedIn job scraping"
    )

    parser.add_argument(
        "--reddit",
        action="store_true",
        help="Run Reddit internship post scraping and DMs"
    )

    parser.add_argument(
        "--mode",
        choices=["cli", "api"],
        default="cli",
        help="Choose mode: 'cli' for terminal interaction or 'api' for backend integration"
    )

    args = parser.parse_args()
    ran_any = False

    if args.api:
        print(f"\n✅ Running API source: {args.api}")
        print(f"🔍 Keyword: {args.keyword} | 🔢 Limit: {args.limit}")
        if args.mode == "api":
            jobs = process_email_jobs(source=args.api, keyword=args.keyword, limit=args.limit, return_data=True)
            print(f"\n📦 Output JSON:\n{jobs}")
        else:
            process_email_jobs(source=args.api, keyword=args.keyword, limit=args.limit)
        ran_any = True

    if args.linkedin:
        print("\n✅ Running LinkedIn job scraper...")
        print(f"🔍 Keyword: {args.keyword} | 🔢 Limit: {args.limit}")
        process_linkedin_jobs(keyword=args.keyword, limit=args.limit)
        ran_any = True

    if args.reddit:
        print("\n✅ Running Reddit internship lead scraper...")
        print(f"🔍 Keyword: {args.keyword} | 🔢 Limit: {args.limit}")
        process_reddit_posts(keyword=args.keyword, limit=args.limit)
        ran_any = True

    if not ran_any:
        parser.print_help()

if __name__ == "__main__":
    main()
