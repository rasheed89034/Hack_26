from typing import List
import os
import subprocess
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from supabase import Client
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.database import get_supabase
from models.opportunity import OpportunityCreate, OpportunityRead, OpportunityUpdate

router = APIRouter(
    prefix="/api/v1/opportunities",
    tags=["opportunities"],
)

@router.post("/", response_model=OpportunityRead, status_code=status.HTTP_201_CREATED)
def create_opportunity(opportunity: OpportunityCreate, supabase: Client = Depends(get_supabase)):
    try:
        result = supabase.table('opportunities').insert(opportunity.model_dump()).execute()
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create opportunity")
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase error: {str(e)}")

@router.get("/", response_model=List[OpportunityRead])
def read_opportunities(skip: int = 0, limit: int = 500, supabase: Client = Depends(get_supabase)):
    result = supabase.table('opportunities').select('*').order('id', desc=True).range(skip, skip + limit - 1).execute()
    return result.data

@router.delete("/clear-all", status_code=status.HTTP_200_OK)
def clear_all_opportunities(supabase: Client = Depends(get_supabase)):
    """Delete ALL opportunities — called before inserting a fresh batch of scraped data."""
    try:
        # Supabase requires a filter for delete; gt id=0 matches every row
        result = supabase.table('opportunities').delete().gt('id', 0).execute()
        deleted = len(result.data) if result.data else 0
        return {"status": "ok", "deleted": deleted}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Clear failed: {str(e)}")

@router.get("/{opportunity_id}", response_model=OpportunityRead)
def read_opportunity(opportunity_id: int, supabase: Client = Depends(get_supabase)):
    result = supabase.table('opportunities').select('*').eq('id', opportunity_id).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return result.data[0]

@router.put("/{opportunity_id}", response_model=OpportunityRead)
def update_opportunity(opportunity_id: int, opp_update: OpportunityUpdate, supabase: Client = Depends(get_supabase)):
    update_data = opp_update.model_dump(exclude_unset=True)
    if not update_data:
        return read_opportunity(opportunity_id, supabase)
        
    result = supabase.table('opportunities').update(update_data).eq('id', opportunity_id).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Opportunity not found or update failed")
    
    return result.data[0]

@router.delete("/{opportunity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_opportunity(opportunity_id: int, supabase: Client = Depends(get_supabase)):
    result = supabase.table('opportunities').delete().eq('id', opportunity_id).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return None

class RagQuery(BaseModel):
    query: str

@router.post("/rag_search", status_code=status.HTTP_200_OK)
def rag_search_opportunities(rag_query: RagQuery):
    try:
        # Run grok_scraper.py
        scraper_path = os.path.join(os.path.dirname(__file__), "..", "..", "module_4_opportunity", "scrapers", "grok_scraper.py")
        subprocess.run(["python", scraper_path, rag_query.query], check=True)
        
        # Run clean_opportunities.py
        cleaner_path = os.path.join(os.path.dirname(__file__), "..", "..", "module_4_opportunity", "data_cleaning", "clean_opportunities.py")
        subprocess.run(["python", cleaner_path], check=True)
        
        return {"message": "Successfully scraped and saved tailored opportunities"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG Search Pipeline Failed: {str(e)}")
