# ACCESS Main Project

A multi-module AI-powered opportunity discovery and matching platform.

## 📁 Project Architecture

```text
ACCESS_Main_Project/
│
├── module_1_frontend/       # UI/UX & Views
│   ├── assets/
│   ├── components/
│   ├── pages/
│   └── index.html
│
├── module_2_ai_intelligence/# AI Matching & Logic
│   ├── prompts/
│   ├── agents/
│   └── core_logic/
│
├── module_3_backend/        # Server, APIs & Supabase
│   ├── api/
│   ├── database/
│   ├── models/
│   └── main.py
│
├── module_4_opportunity/    # Data Discovery & Pipeline
│   ├── scrapers/
│   ├── data_cleaning/
│   └── raw_data/
│
├── .gitignore               # Git ignore rules
├── .env                     # Environment variables (do not commit)
└── README.md                # Project documentation
```

## 🛠️ Modules Overview

- **Module 1 - Frontend (`module_1_frontend`)**: User interface, pages, components, and frontend visual assets.
- **Module 2 - AI Intelligence (`module_2_ai_intelligence`)**: AI agent configurations, matching logic, and prompt engineering templates.
- **Module 3 - Backend (`module_3_backend`)**: Server API endpoints, data models, Supabase integration, and application entry point (`main.py`).
- **Module 4 - Opportunity (`module_4_opportunity`)**: Web scrapers, data cleaning scripts, and raw data pipeline management.

## 🚀 Getting Started

1. **Configure Environment Variables**: Copy `.env` and configure your Supabase & AI API keys.
2. **Setup Backend**: Launch python backend server via `module_3_backend/main.py`.
3. **Frontend Views**: Serve and view static pages from `module_1_frontend/`.
