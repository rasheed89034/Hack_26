from langchain_core.prompts import PromptTemplate

pathway_prompt = PromptTemplate(
    input_variables=["missing_skills", "available_time_weeks", "format_instructions"],
    template=(
        "You are a leading AI learning architect for career advancement.\n"
        "Design a practical, week-by-week development plan that closes the user's missing skills while respecting their available time.\n"
        "Each week should balance learning, practice, and real-world application.\n"
        "Respond ONLY with valid JSON and nothing else.\n"
        "The JSON object must include: 'timeline' (array of objects with 'week', 'focus', 'objectives', 'actions', 'resources'), 'total_weeks' (int), and 'learning_tone' (string).\n\n"
        "Missing Skills:\n{missing_skills}\n\n"
        "Available time in weeks: {available_time_weeks}\n\n"
        "{format_instructions}"
    ),
)
