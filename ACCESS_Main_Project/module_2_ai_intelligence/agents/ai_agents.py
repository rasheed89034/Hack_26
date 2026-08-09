import os
from typing import Any
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
from langchain.chat_models.base import init_chat_model
try:
    from ..prompts import (
        format_missing_skills,
        format_opportunity,
        format_user_profile,
        gap_parser,
        gap_prompt,
        match_parser,
        match_prompt,
        pathway_parser,
        pathway_prompt,
        voice_parser,
        voice_prompt,
    )
    from ..core_logic.models import MissingSkill, OpportunityDetails, UserProfile
except ImportError:
    import sys
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
    from prompts import (
        format_missing_skills,
        format_opportunity,
        format_user_profile,
        gap_parser,
        gap_prompt,
        match_parser,
        match_prompt,
        pathway_parser,
        pathway_prompt,
        voice_parser,
        voice_prompt,
    )
    from core_logic.models import MissingSkill, OpportunityDetails, UserProfile

load_dotenv()


def _get_api_key() -> str | None:
    return (
        os.getenv("ACCESS_AI_API_KEY")
        or os.getenv("OPENAI_API_KEY")
        or os.getenv("GROQ_API_KEY")
        or os.getenv("GROK_API_KEY")
    )


def _get_llm():
    # If Groq key is available and no custom provider is configured, use Groq
    groq_key = os.getenv("GROQ_API_KEY") or os.getenv("GROK_API_KEY")
    model_provider = os.getenv("ACCESS_AI_PROVIDER")

    if groq_key and not model_provider:
        from langchain_groq import ChatGroq
        return ChatGroq(
            api_key=groq_key,
            model="llama-3.3-70b-versatile",
            temperature=0.0,
        )

    model_name = os.getenv("ACCESS_AI_MODEL", "ollama:openassistant")
    kwargs: dict[str, Any] = {"temperature": 0.0}
    api_key = _get_api_key()
    if api_key:
        if model_provider in {"openai", "azure_openai", "azure_ai"} or model_name.startswith("openai:"):
            kwargs["openai_api_key"] = api_key
        else:
            kwargs["api_key"] = api_key

    if model_provider:
        return init_chat_model(model=model_name, model_provider=model_provider, **kwargs)
    return init_chat_model(model=model_name, **kwargs)


def _run_chain(prompt: Any, parser: Any, **kwargs: Any) -> dict:
    llm = _get_llm()
    chain = prompt | llm | parser
    return chain.invoke(kwargs)


def evaluate_match(user_profile: UserProfile, opportunity_details: OpportunityDetails) -> dict:
    return _run_chain(
        prompt=match_prompt,
        parser=match_parser,
        user_profile=format_user_profile(user_profile.model_dump()),
        opportunity_details=format_opportunity(opportunity_details.model_dump()),
        format_instructions=match_parser.get_format_instructions(),
    )


def analyze_gap(user_profile: UserProfile, opportunity_details: OpportunityDetails) -> dict:
    return _run_chain(
        prompt=gap_prompt,
        parser=gap_parser,
        user_profile=format_user_profile(user_profile.model_dump()),
        opportunity_details=format_opportunity(opportunity_details.model_dump()),
        format_instructions=gap_parser.get_format_instructions(),
    )


def generate_pathway(missing_skills: list[MissingSkill], available_time_weeks: int) -> dict:
    missing_skills_payload = [skill.model_dump() for skill in missing_skills]
    return _run_chain(
        prompt=pathway_prompt,
        parser=pathway_parser,
        missing_skills=format_missing_skills(missing_skills_payload),
        available_time_weeks=available_time_weeks,
        format_instructions=pathway_parser.get_format_instructions(),
    )


def parse_voice_intent(transcribed_text: str) -> dict:
    return _run_chain(
        prompt=voice_prompt,
        parser=voice_parser,
        transcribed_text=transcribed_text.strip(),
        format_instructions=voice_parser.get_format_instructions(),
    )
