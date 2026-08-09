import json


def _json_block(data: dict | list) -> str:
    return json.dumps(data, indent=2, ensure_ascii=False)


def build_match_prompt(user_profile: dict, opportunity_details: dict) -> str:
    return (
        "You are an expert career matching assistant.\n"
        "Evaluate the alignment between a candidate profile and an opportunity.\n"
        "Respond ONLY with valid JSON and do not include any explanatory text or markdown.\n"
        "The JSON object must have two keys: 'match_score' (integer 0-100) and 'match_summary' (string).\n\n"
        "User Profile:\n" + _json_block(user_profile) + "\n\n"
        "Opportunity Details:\n" + _json_block(opportunity_details) + "\n\n"
    )


def build_gap_prompt(user_profile: dict, opportunity_details: dict) -> str:
    return (
        "You are an expert career advisor.\n"
        "Identify the specific technical and soft skills the user is missing for this opportunity.\n"
        "Respond ONLY with valid JSON and do not include any explanatory text or markdown.\n"
        "The JSON object must contain a single key 'missing_skills' which is an array of objects with 'skill' and 'explanation'.\n\n"
        "User Profile:\n" + _json_block(user_profile) + "\n\n"
        "Opportunity Details:\n" + _json_block(opportunity_details) + "\n\n"
    )


def build_pathway_prompt(missing_skills: list[dict], available_time_weeks: int) -> str:
    return (
        "You are an expert learning path designer for career acceleration.\n"
        "Create a structured week-by-week learning plan to close the user's missing skills.\n"
        "Respond ONLY with valid JSON and do not include any explanatory text or markdown.\n"
        "The JSON object must have a 'timeline' array of weeks. Each week object must include: 'week' (int), 'focus' (string), 'objectives' (array of strings), 'actions' (array of strings), and 'resources' (array of strings).\n\n"
        "Missing Skills:\n" + _json_block(missing_skills) + "\n\n"
        "Available time in weeks: " + str(available_time_weeks) + "\n\n"
    )


def build_voice_prompt(transcribed_text: str) -> str:
    return (
        "You are a voice-command interpreter for an AI career navigator.\n"
        "Extract the user's intent, the skills they already have, and the goals they want to achieve.\n"
        "Respond ONLY with valid JSON and do not include any explanatory text or markdown.\n"
        "The JSON object must include: 'intent' (string), 'current_skills' (array of strings), 'target_goals' (array of strings), and 'recommended_action' (string).\n\n"
        "Voice input:\n" + transcribed_text + "\n\n"
    )


def extract_json_from_text(text: str):
    # Try to extract the first JSON object or array from text
    import re

    # Find first {..} or [..]
    obj_match = re.search(r"(\{.*\})", text, flags=re.DOTALL)
    arr_match = re.search(r"(\[.*\])", text, flags=re.DOTALL)

    candidate = None
    if obj_match:
        candidate = obj_match.group(1)
    elif arr_match:
        candidate = arr_match.group(1)

    if not candidate:
        # As a fallback, try to parse entire text
        candidate = text

    try:
        return json.loads(candidate)
    except Exception:
        # Last resort: try to fix common issues by trimming trailing text
        try:
            # find last closing bracket
            last = max(candidate.rfind('}'), candidate.rfind(']'))
            if last != -1:
                return json.loads(candidate[: last + 1])
        except Exception:
            pass
    raise ValueError('Could not parse JSON from model output')
