from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from supabase import Client
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.database import get_supabase
from .user import UserCreate, UserRead, UserUpdate
router = APIRouter(
    prefix="/api/v1/users",
    tags=["users"],
)

@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, supabase: Client = Depends(get_supabase)):
    # Check if email exists
    existing = supabase.table('users').select('*').eq('email', user.email).execute()
    if existing.data and len(existing.data) > 0:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Insert new user
    result = supabase.table('users').insert(user.model_dump()).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create user")
    
    return result.data[0]

@router.get("/", response_model=List[UserRead])
def read_users(skip: int = 0, limit: int = 100, supabase: Client = Depends(get_supabase)):
    # Supabase pagination (range)
    # Range is inclusive, so limit 100 means 0 to 99
    result = supabase.table('users').select('*').range(skip, skip + limit - 1).execute()
    return result.data

@router.get("/{user_id}", response_model=UserRead)
def read_user(user_id: int, supabase: Client = Depends(get_supabase)):
    result = supabase.table('users').select('*').eq('id', user_id).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return result.data[0]

@router.put("/{user_id}", response_model=UserRead)
def update_user(user_id: int, user_update: UserUpdate, supabase: Client = Depends(get_supabase)):
    update_data = user_update.model_dump(exclude_unset=True)
    if not update_data:
        # Nothing to update
        return read_user(user_id, supabase)
        
    result = supabase.table('users').update(update_data).eq('id', user_id).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="User not found or update failed")
    
    return result.data[0]

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, supabase: Client = Depends(get_supabase)):
    result = supabase.table('users').delete().eq('id', user_id).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return None
