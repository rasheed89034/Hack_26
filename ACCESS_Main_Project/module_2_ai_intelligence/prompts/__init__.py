import json
from langchain_core.output_parsers import JsonOutputParser

from .match_prompt import match_prompt
from .gap_prompt import gap_prompt
from .pathway_prompt import pathway_prompt
from .voice_prompt import voice_prompt
from .utils import format_missing_skills, format_opportunity, format_user_profile

__all__ = [
    "match_prompt",
    "gap_prompt",
    "pathway_prompt",
    "voice_prompt",
    "match_parser",
    "gap_parser",
    "pathway_parser",
    "voice_parser",
    "format_user_profile",
    "format_opportunity",
    "format_missing_skills",
]

match_parser = JsonOutputParser()

gap_parser = JsonOutputParser()

pathway_parser = JsonOutputParser()

voice_parser = JsonOutputParser()
