import pandas as pd
import json
import os
from bs4 import BeautifulSoup
import re
import requests

def clean_html(raw_html):
    if not raw_html:
        return ""
    # Use BeautifulSoup to strip HTML tags
    soup = BeautifulSoup(raw_html, "html.parser")
    text = soup.get_text(separator=" ", strip=True)
    # Basic cleanup of multiple spaces
    text = re.sub(r'\s+', ' ', text)
    return text

def extract_skills(description):
    # A simple regex based skill extractor for demonstration
    common_skills = ['python', 'java', 'react', 'node', 'aws', 'sql', 'docker', 'kubernetes', 'typescript', 'javascript', 'django', 'fastapi']
    found_skills = []
    desc_lower = description.lower()
    for skill in common_skills:
        # Match whole words only
        if re.search(rf'\b{skill}\b', desc_lower):
            found_skills.append(skill.capitalize())
    return ", ".join(found_skills)

def clean_data(input_file):
    print(f"Cleaning data from {input_file}...")
    if not os.path.exists(input_file):
        print(f"Error: {input_file} does not exist.")
        return None
        
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    if not data:
        print("No data to clean.")
        return None

    df = pd.DataFrame(data)
    
    # Drop completely empty rows
    df.dropna(how='all', inplace=True)
    
    # Clean the description field (remove HTML) and append the link
    if 'description' in df.columns:
        df['description'] = df['description'].apply(clean_html)
        # Extract skills from the clean description
        df['required_skills'] = df['description'].apply(extract_skills)
        # Embed the apply link as a parseable tag at the end of description
        if 'link' in df.columns:
            df['description'] = df.apply(
                lambda row: row['description'] + (f" 🔗 Apply: {row['link']}" if row.get('link') else ""),
                axis=1
            )
    else:
        df['required_skills'] = ""

    # Drop duplicates based on title and company
    if 'title' in df.columns and 'company' in df.columns:
        df.drop_duplicates(subset=['title', 'company'], inplace=True)
        
    # Keep only the columns that exist in the Supabase 'opportunities' table
    required_cols = ['title', 'company', 'description', 'required_skills']
    
    # Add missing columns if any
    for col in required_cols:
        if col not in df.columns:
            df[col] = ""
            
    df = df[required_cols]
    
    # Fill NA with empty strings
    df.fillna("", inplace=True)
    
    # Save cleaned data
    output_dir = os.path.join(os.path.dirname(__file__), "..", "data_cleaning")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "cleaned_jobs.json")
    
    # Convert to list of dicts for JSON serialization
    cleaned_records = df.to_dict(orient='records')
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(cleaned_records, f, indent=4, ensure_ascii=False)
        
    print(f"Cleaned {len(cleaned_records)} records and saved to {output_file}")

    # Post to backend
    post_to_backend(cleaned_records)
    
    return output_file

def post_to_backend(records):
    print("Posting data to backend...")
    base_url = "http://localhost:8000/api/v1/opportunities"
    headers = {"Content-Type": "application/json"}

    # ── Step 1: Clear ALL old opportunities so stale data is removed ──
    try:
        clear_res = requests.delete(f"{base_url}/clear-all", headers=headers, timeout=10)
        if clear_res.status_code == 200:
            deleted = clear_res.json().get("deleted", "?")
            print(f"Cleared {deleted} old records from database.")
        else:
            print(f"Warning: clear-all returned {clear_res.status_code}: {clear_res.text}")
    except Exception as e:
        print(f"Warning: Could not clear old records: {e}")

    # ── Step 2: Insert fresh records ──
    success_count = 0
    for record in records:
        # Remove empty apply_url to avoid storing blank strings
        if not record.get("apply_url"):
            record.pop("apply_url", None)
        try:
            res = requests.post(f"{base_url}/", json=record, headers=headers, timeout=10)
            if res.status_code == 201:
                success_count += 1
            else:
                print(f"Failed to post '{record.get('title')}': {res.text}")
        except Exception as e:
            print(f"Error posting data: {e}")
            break
    print(f"Successfully posted {success_count}/{len(records)} fresh records to database.")

if __name__ == "__main__":
    raw_file = os.path.join(os.path.dirname(__file__), "..", "raw_data", "raw_jobs.json")
    clean_data(raw_file)
