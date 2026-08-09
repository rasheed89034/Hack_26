import requests
from bs4 import BeautifulSoup
import json
import os

def scrape_jobs():
    url = "https://weworkremotely.com/categories/remote-programming-jobs.rss"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    print(f"Scraping jobs from {url}...")
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, features="xml")
    items = soup.find_all("item")
    
    jobs = []
    for item in items:
        title = item.find("title").text if item.find("title") else ""
        link = item.find("link").text if item.find("link") else ""
        description = item.find("description").text if item.find("description") else ""
        pubDate = item.find("pubDate").text if item.find("pubDate") else ""
        
        # WeWorkRemotely title format is usually "Company Name: Job Title"
        company = ""
        job_title = title
        if ":" in title:
            parts = title.split(":", 1)
            company = parts[0].strip()
            job_title = parts[1].strip()
            
        jobs.append({
            "title": job_title,
            "company": company,
            "description": description,
            "link": link,
            "published_at": pubDate
        })
    
    # Save to raw_data directory
    output_dir = os.path.join(os.path.dirname(__file__), "..", "raw_data")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "raw_jobs.json")
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(jobs, f, indent=4, ensure_ascii=False)
        
    print(f"Scraped {len(jobs)} jobs and saved to {output_file}")
    return output_file

if __name__ == "__main__":
    scrape_jobs()
