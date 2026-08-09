import json


def _json_block(data: dict | list) -> str:
    return json.dumps(data, indent=2, ensure_ascii=False)


def format_user_profile(user_profile: dict) -> str:
    return _json_block(user_profile)


def format_opportunity(opportunity_details: dict) -> str:
    return _json_block(opportunity_details)


def format_missing_skills(missing_skills: list[dict]) -> str:
    return _json_block(missing_skills)
