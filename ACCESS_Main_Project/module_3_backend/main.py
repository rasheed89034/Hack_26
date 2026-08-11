# import os
# import sys
# import uvicorn
# from dotenv import load_dotenv
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# load_dotenv()

# # Ensure the project root is on sys.path so sibling module imports work
# _project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
# if _project_root not in sys.path:
#     sys.path.insert(0, _project_root)

# # Import Database connection
# from database.database import get_supabase

# # Import Routers
# from api import users, opportunities, ai_routes

# app = FastAPI(
#     title="ACCESS API",
#     description="Core backend and AI Intelligence API.",
#     version="1.0.0",
# )

# allowed_origins = [
#     "http://localhost:5173",
#     "https://localhost:5173",
#     "http://127.0.0.1:5173",
#     "https://127.0.0.1:5173",
#     "http://localhost:5174",
#     "https://localhost:5174",
#     "http://127.0.0.1:5174",
#     "https://127.0.0.1:5174",
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=allowed_origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Register API Routers
# app.include_router(users.router)
# app.include_router(opportunities.router)
# app.include_router(ai_routes.router)

# @app.get("/api/v1/health")
# async def health_check() -> dict:
#     return {"status": "ok", "service": "ACCESS API Core"}

# if __name__ == "__main__":
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)



import os
import sys
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# Ensure the project root is on sys.path so sibling module imports work
_project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

# Import Database connection
from database.database import get_supabase

# Import Routers
from api import users, opportunities, ai_routes

app.include_router(opportunities.router)

app = FastAPI(
    title="ACCESS API",
    description="Core backend and AI Intelligence API.",
    version="1.0.0",
)

allowed_origins = [
    "http://localhost:5173",
    "https://localhost:5173",
    "http://127.0.0.1:5173",
    "https://127.0.0.1:5173",
    "http://localhost:5174",
    "https://localhost:5174",
    "http://127.0.0.1:5174",
    "https://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://access-frontend-6f0m.onrender.com" # 👈 Yeh exact link daalna hai
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(users.router)
app.include_router(opportunities.router)
app.include_router(ai_routes.router)

@app.get("/api/v1/health")
async def health_check() -> dict:
    return {"status": "ok", "service": "ACCESS API Core"}


# =========================================================
# ---- REAL-TIME SCRAPING ENDPOINT ----
# =========================================================
from module_4_opportunity.scrapers.grok_scraper import scrape_jobs
from module_4_opportunity.data_cleaning.clean_opportunities import clean_data

@app.post("/api/v1/opportunities/scrape-realtime")
def trigger_realtime_scraping(profile_keywords: str):
    """
    Scrape real-time opportunities from LinkedIn, LabLab.ai, Devpost etc.
    Clears ALL old opportunities first, then inserts fresh results.
    """
    try:
        # 1. Scrape based on user profile keywords
        raw_file = scrape_jobs(profile_keywords=profile_keywords)

        if not raw_file or not os.path.exists(raw_file):
            return {"status": "error", "message": "Scraping failed or no results found."}

        # 2. Clean + clear old DB records + insert fresh records
        cleaned_file = clean_data(raw_file)

        return {
            "status": "success",
            "message": f"Fresh opportunities for '{profile_keywords}' scraped and loaded!",
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
# =========================================================


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
