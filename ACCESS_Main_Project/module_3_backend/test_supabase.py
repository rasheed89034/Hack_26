import requests
import json

record = {
    "title": "Test",
    "company": "Test",
    "description": "Test",
    "required_skills": "Test"
}

res = requests.post("http://localhost:8000/api/v1/opportunities/", json=record)
print(res.status_code)
print(res.text)
