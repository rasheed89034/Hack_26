import os
import sys
import json
import requests
from dotenv import load_dotenv
from duckduckgo_search import DDGS

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

def search_web(query):
    """Tool to search the web using DuckDuckGo."""
    print(f"Executing tool: search_web with query: '{query}'")
    try:
        # Fetch up to 10 search results
        results = DDGS().text(query, max_results=10)
        # Format the results into a readable string for the LLM
        formatted_results = "\n".join([f"Title: {r['title']}\nSnippet: {r['body']}\nURL: {r['href']}\n---" for r in results])
        return formatted_results if formatted_results else "No results found."
    except Exception as e:
        return f"Error executing search: {e}"

def scrape_jobs(profile_keywords="software engineering or technology"):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your-groq-api-key":
        print("WARNING: GROQ_API_KEY is not set in .env or is using the default placeholder.")
        print("Please set a valid GROQ_API_KEY to fetch real-time opportunities.")
        return None

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    tools = [
        {
            "type": "function",
            "function": {
                "name": "search_web",
                "description": "Searches the live web for recent job opportunities based on a query. Returns snippets and URLs of job postings.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "The search query. For better results, include terms like 'software engineer jobs remote site:greenhouse.io' or similar."
                        }
                    },
                    "required": ["query"]
                }
            }
        }
    ]

    prompt = f"""
    You are a smart opportunity finder. Based on the user's profile/skills: "{profile_keywords}", find 10 real, live opportunities from the web.

    Search for opportunities across THESE SPECIFIC platforms:
    1. LinkedIn jobs - search "site:linkedin.com/jobs {profile_keywords} internship"
    2. Lablab.ai hackathons - search "site:lablab.ai hackathon {profile_keywords}"
    3. Internship portals - search "{profile_keywords} internship site:internshala.com OR site:indeed.com"
    4. AI/ML hackathons - search "{profile_keywords} hackathon 2026 site:devpost.com OR site:mlh.io"

    Use the `search_web` tool to search each of these specifically.
    Once you have gathered enough information, return the final output strictly as a valid JSON array where each object has the exact keys:
    'title', 'company', 'description', 'link', 'published_at'.
    For 'description', summarize the role in a few sentences based on the search snippet.
    For 'published_at', estimate based on the search data or put 'Recent'.

    IMPORTANT CRITICAL RULES:
    1. You MUST extract the EXACT real URL for the 'link' field from the search snippets.
    2. Do NOT hallucinate or invent URLs (e.g., do not use linkedin.com/jobs/123456). Only include jobs where you found the actual URL in search results.
    3. Mix results from all platforms — include a good variety of internships AND hackathons.

    Do not include markdown formatting like ```json or other text in your final response, just the raw JSON array.
    """

    messages = [
        {
            "role": "system",
            "content": "You are a ReAct agent that searches the web for job opportunities and returns them in strictly formatted JSON. Think step-by-step, use tools to gather data, and finally output only the requested JSON array."
        },
        {
            "role": "user",
            "content": prompt
        }
    ]

    max_iterations = 5
    iteration = 0
    
    while iteration < max_iterations:
        iteration += 1
        print(f"--- Iteration {iteration} ---")
        
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": messages,
            "tools": tools,
            "temperature": 0.2
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            result = response.json()
            
            message = result['choices'][0]['message']
            messages.append(message) # Append assistant's response to history
            
            # Check if Groq wants to call a tool
            if message.get("tool_calls"):
                for tool_call in message["tool_calls"]:
                    if tool_call["type"] == "function" and tool_call["function"]["name"] == "search_web":
                        args = json.loads(tool_call["function"]["arguments"])
                        query = args.get("query", "")
                        
                        # Execute the tool
                        tool_result = search_web(query)
                        
                        # Feed the result back to Groq
                        messages.append({
                            "role": "tool",
                            "tool_call_id": tool_call["id"],
                            "content": tool_result
                        })
                # Loop continues to send tool results to Groq
                continue
                
            else:
                # No tool calls, Groq should have generated the final JSON
                content = message.get("content", "")
                
                # Clean up potential markdown formatting just in case
                if content.startswith("```json"):
                    content = content[7:]
                if content.startswith("```"):
                    content = content[3:]
                if content.endswith("```"):
                    content = content[:-3]
                    
                try:
                    jobs = json.loads(content.strip())
                except json.JSONDecodeError as e:
                    print("Failed to parse JSON from Groq final response:", e)
                    print("Raw response:", content)
                    return None

                # Save to raw_data directory
                output_dir = os.path.join(os.path.dirname(__file__), "..", "raw_data")
                os.makedirs(output_dir, exist_ok=True)
                output_file = os.path.join(output_dir, "raw_jobs.json")
                
                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(jobs, f, indent=4, ensure_ascii=False)
                    
                print(f"Successfully fetched {len(jobs)} real-time jobs and saved to {output_file}")
                return output_file
                
        except requests.exceptions.RequestException as e:
            print(f"Error calling Groq API: {e}")
            if 'response' in locals() and response is not None:
                print(f"Response: {response.text}")
            return None

    print("Reached maximum iterations without completing the task.")
    return None

if __name__ == "__main__":
    profile_input = sys.argv[1] if len(sys.argv) > 1 else "software engineering or technology"
    scrape_jobs(profile_keywords=profile_input)
