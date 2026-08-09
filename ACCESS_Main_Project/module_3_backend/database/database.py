import os
# pyrefly: ignore [missing-import]
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

# In case it's not set in env, fallback or throw error
if not url or not key:
    print("Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.")

supabase: Client = create_client(url, key)

def get_supabase() -> Client:
    return supabase
