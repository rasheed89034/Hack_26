from typing import List
from pydantic import BaseModel, Field


class UserProfile(BaseModel):
    major: str = Field(..., description="User's major or academic focus.")
    skills: List[str] = Field(default_factory=list, description="List of current skills the user possesses.")
    interests: List[str] = Field(default_factory=list, description="Areas of interest relevant to the user's career path.")
    experience_level: str | None = Field(None, description="Optional experience description such as beginner, intermediate, or advanced.")


class OpportunityDetails(BaseModel):
    title: str = Field(..., description="Opportunity title or position.")
    description: str = Field(..., description="Short description of the opportunity.")
    requirements: List[str] = Field(default_factory=list, description="List of technical or soft skill requirements.")
    category: str | None = Field(None, description="Optional category, such as internship, hackathon, scholarship, or fellowship.")
    duration_weeks: int | None = Field(None, description="Optional duration of the opportunity in weeks.")


class MatchRequest(BaseModel):
    user_profile: UserProfile
    opportunity_details: OpportunityDetails


class MatchResponse(BaseModel):
    match_score: int = Field(..., ge=0, le=100, description="Match score from 0 to 100.")
    match_summary: str = Field(..., description="Short summary of the match evaluation.")


class MissingSkill(BaseModel):
    skill: str = Field(..., description="A missing skill or capability.")
    explanation: str = Field(..., description="A short explanation of why the skill is relevant.")


class GapAnalysisResponse(BaseModel):
    missing_skills: List[MissingSkill] = Field(..., description="List of missing skills and their explanations.")


class PathwayStep(BaseModel):
    week: int = Field(..., description="Week number in the learning pathway.")
    focus: str = Field(..., description="Primary focus area for this week.")
    objectives: List[str] = Field(default_factory=list, description="Learning objectives for the week.")
    actions: List[str] = Field(default_factory=list, description="Concrete actions the learner should take.")
    resources: List[str] = Field(default_factory=list, description="Optional resources, courses, or tools to use.")


class PathwayRequest(BaseModel):
    missing_skills: List[MissingSkill]
    available_time_weeks: int = Field(..., gt=0, description="Number of weeks available to close the skill gaps.")


class PathwayResponse(BaseModel):
    timeline: List[PathwayStep] = Field(..., description="Week-by-week learning roadmap.")


class VoiceIntentRequest(BaseModel):
    transcribed_text: str = Field(..., description="Natural language text from the voice interface.")


class VoiceIntentResponse(BaseModel):
    intent: str = Field(..., description="Parsed user intent from the voice command.")
    name: str | None = Field(None, description="Detected user name, if mentioned.")
    major: str | None = Field(None, description="Detected user major or field of study, if mentioned.")
    experience_level: str | None = Field(None, description="Detected experience level (e.g., beginner, intermediate, advanced).")
    current_skills: List[str] = Field(default_factory=list, description="Detected user skills mentioned in the voice command.")
    target_goals: List[str] = Field(default_factory=list, description="Detected goals or target outcomes mentioned by the user.")
    recommended_action: str = Field(..., description="Immediate next action or interpretation that can be fed into the matching engine.")
