import os
import sys
import json
import requests
import time

# Ensure we can import our modules
sys.path.append(os.path.dirname(__file__))

from scrapers.grok_scraper import scrape_jobs
from data_cleaning.clean_opportunities import clean_data

API_URL = "http://localhost:8000/api/v1/opportunities/"

def run_pipeline():
    print("Starting Module 4 Data Pipeline...")
    
    # 1. Scrape data
    print("\n--- Step 1: Scraping ---")
    raw_file = scrape_jobs()
    if not raw_file or not os.path.exists(raw_file):
        print("Scraping failed.")
        return
        
    # 2. Clean data
    print("\n--- Step 2: Cleaning ---")
    cleaned_file = clean_data(raw_file)
    if not cleaned_file or not os.path.exists(cleaned_file):
        print("Cleaning failed.")
        return
        
    # 3. Ingest data to Backend
    print("\n--- Step 3: Ingestion ---")
    with open(cleaned_file, 'r', encoding='utf-8') as f:
        opportunities = json.load(f)
        
    print(f"Loaded {len(opportunities)} cleaned opportunities for insertion.")
    
    success_count = 0
    fail_count = 0
    
    # Optional: Wait a bit in case backend needs to start or we don't want to hammer it
    # We will assume the backend is already running on localhost:8000
    try:
        # Test connection first
        requests.get("http://localhost:8000/api/v1/health")
    except requests.exceptions.ConnectionError:
        print("ERROR: Backend server is not running on http://localhost:8000.")
        print("Please start Module 3 Backend before running the pipeline.")
        return

    for opp in opportunities:
        try:
            # Send POST request to backend API
            response = requests.post(API_URL, json=opp)
            if response.status_code == 201:
                success_count += 1
                print(f"Successfully inserted: {opp.get('title', 'Unknown')}")
            else:
                fail_count += 1
                print(f"Failed to insert: {opp.get('title', 'Unknown')} - Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            fail_count += 1
            print(f"Error inserting {opp.get('title', 'Unknown')}: {e}")
            
    print("\n--- Pipeline Summary ---")
    print(f"Total processed: {len(opportunities)}")
    print(f"Successfully ingested: {success_count}")
    print(f"Failed to ingest: {fail_count}")
    print("Pipeline finished successfully.")

if __name__ == "__main__":
    run_pipeline()
