# api/opportunity.py
from pydantic import BaseModel
from typing import Optional

class OpportunityCreate(BaseModel):
    title: str
    description: str

class OpportunityRead(BaseModel):
    id: int
    title: str
    description: str

class OpportunityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
