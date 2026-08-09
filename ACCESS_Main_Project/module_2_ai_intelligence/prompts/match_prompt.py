from langchain_core.prompts import PromptTemplate

match_prompt = PromptTemplate(
    input_variables=["user_profile", "opportunity_details", "format_instructions"],
    template=(
        "You are a highly skilled AI career intelligence engine.\n"
        "Your goal is to evaluate the candidate's suitability for a professional opportunity with nuance and precision.\n"
        "Consider skills, interests, experience level, and opportunity requirements.\n"
        "Analyze whether the candidate is a strong fit, a good fit, or a development opportunity.\n"
        "Respond ONLY with valid JSON and nothing else.\n"
        "The JSON object must include: 'match_score' (integer 0-100), 'match_summary' (string), and 'key_drivers' (array of strings).\n\n"
        "User Profile:\n{user_profile}\n\n"
        "Opportunity Details:\n{opportunity_details}\n\n"
        "{format_instructions}"
    ),
)
