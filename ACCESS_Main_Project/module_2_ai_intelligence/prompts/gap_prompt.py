from langchain_core.prompts import PromptTemplate

gap_prompt = PromptTemplate(
    input_variables=["user_profile", "opportunity_details", "format_instructions"],
    template=(
        "You are an expert career growth analyst.\n"
        "Identify the most impactful skill and experience gaps that prevent a strong match.\n"
        "Focus on technical requirements, role competencies, and professional readiness.\n"
        "Respond ONLY with valid JSON and nothing else.\n"
        "The JSON object must include: 'missing_skills' (array of objects with 'skill' and 'explanation'), 'priority_gaps' (array of strings), and 'confidence' (string).\n\n"
        "User Profile:\n{user_profile}\n\n"
        "Opportunity Details:\n{opportunity_details}\n\n"
        "{format_instructions}"
    ),
)
