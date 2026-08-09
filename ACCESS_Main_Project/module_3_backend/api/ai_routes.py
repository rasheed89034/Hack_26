import os
import sys
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Any

router = APIRouter(prefix="/api/v1", tags=["ai"])


# ─── Inline Pydantic models (mirrors module_2 models) ────────────────────────
class UserProfileIn(BaseModel):
    major: Optional[str] = None
    skills: Optional[List[str]] = []
    interests: Optional[List[str]] = []
    experience_level: Optional[str] = "beginner"

class OpportunityDetailsIn(BaseModel):
    title: str
    description: str
    requirements: Optional[List[str]] = []
    duration_weeks: Optional[int] = 12

class MatchRequestIn(BaseModel):
    user_profile: UserProfileIn
    opportunity_details: OpportunityDetailsIn

class PathwayRequestIn(BaseModel):
    missing_skills: List[Any]
    available_time_weeks: Optional[int] = 12

class VoiceIntentRequestIn(BaseModel):
    transcribed_text: str


# ─── Lazy-load module_2 so the server still starts if langchain isn't ready ──
def _load_agents():
    _module2_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "module_2_ai_intelligence")
    )
    if _module2_path not in sys.path:
        sys.path.insert(0, _module2_path)
    # pyrefly: ignore [missing-import]
    from agents.ai_agents import evaluate_match, analyze_gap, generate_pathway, parse_voice_intent
    # pyrefly: ignore [missing-import]
    from core_logic.models import UserProfile, OpportunityDetails, MissingSkill
    return evaluate_match, analyze_gap, generate_pathway, parse_voice_intent, UserProfile, OpportunityDetails, MissingSkill


# ─── Endpoints ────────────────────────────────────────────────────────────────
@router.post("/match")
def run_match(request: MatchRequestIn):
    try:
        evaluate_match, _, _, _, UserProfile, OpportunityDetails, _ = _load_agents()
        user_profile = UserProfile(**request.user_profile.model_dump())
        opp_details = OpportunityDetails(**request.opportunity_details.model_dump())
        result = evaluate_match(user_profile=user_profile, opportunity_details=opp_details)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Match failed: {str(e)}")


@router.post("/gap-analysis")
def run_gap_analysis(request: MatchRequestIn):
    try:
        _, analyze_gap, _, _, UserProfile, OpportunityDetails, _ = _load_agents()
        user_profile = UserProfile(**request.user_profile.model_dump())
        opp_details = OpportunityDetails(**request.opportunity_details.model_dump())
        result = analyze_gap(user_profile=user_profile, opportunity_details=opp_details)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gap analysis failed: {str(e)}")


@router.post("/generate-pathway")
def run_generate_pathway(request: PathwayRequestIn):
    try:
        _, _, generate_pathway, _, _, _, MissingSkill = _load_agents()
        missing_skills = [MissingSkill(**s) if isinstance(s, dict) else s for s in request.missing_skills]
        result = generate_pathway(
            missing_skills=missing_skills,
            available_time_weeks=request.available_time_weeks,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pathway generation failed: {str(e)}")


@router.post("/voice-intent")
def run_voice_intent(request: VoiceIntentRequestIn):
    try:
        _, _, _, parse_voice_intent, _, _, _ = _load_agents()
        result = parse_voice_intent(transcribed_text=request.transcribed_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice intent failed: {str(e)}")
