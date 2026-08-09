from langchain_core.prompts import PromptTemplate

voice_prompt = PromptTemplate(
    input_variables=["transcribed_text", "format_instructions"],
    template=(
        "You are an advanced voice understanding engine for a career guidance platform.\n"
        "Interpret the user's spoken request, extract intent, name, major, experience level, skills, goals, and the recommended next action.\n"
        "Respond ONLY with valid JSON and nothing else.\n"
        "The JSON object must include: 'intent' (string), 'name' (string or null), 'major' (string or null), 'experience_level' (string or null), 'current_skills' (array of strings), 'target_goals' (array of strings), and 'recommended_action' (string).\n\n"
        "Voice input:\n{transcribed_text}\n\n"
        "{format_instructions}"
    ),
)
