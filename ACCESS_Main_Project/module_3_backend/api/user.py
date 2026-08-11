# api/user.py ke andar yeh code aayega
from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

class UserRead(BaseModel):
    id: int
    email: str
    name: Optional[str] = None

class UserUpdate(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None
