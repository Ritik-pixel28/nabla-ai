from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

app = FastAPI(title="Nabla Decision API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client (API key checked during request)
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY") or "dummy"
)

class DecisionRequest(BaseModel):
    situation: str

class DecisionResponse(BaseModel):
    pros: list[str]
    cons: list[str]
    recommendation: str
    action_plan: list[str]

SYSTEM_PROMPT = """
You are Nabla, a high-performance decision-making mentor.
Users come to you with complex dilemmas. You provide clarity through structured reasoning.

For every situation, you must output a JSON object with exactly these keys:
- pros: a list of 3-4 strategic advantages
- cons: a list of 3-4 potential risks
- recommendation: a single, strong, confident verdict (1-2 sentences)
- action_plan: a list of 4 actionable steps to be taken in the next 24 hours

Be sharp, human, and professional. Avoid generic AI fluff.
"""

@app.post("/decision", response_model=DecisionResponse)
async def get_decision(request: DecisionRequest):
    situation = request.situation
    print(f"Analyzing dilemma: {situation}")

    try:
        # Check both potential key names
        api_key = os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY")
        if not api_key or api_key == "your_key_here":
            raise ValueError("API Key is missing. Please set OPENROUTER_API_KEY or OPENAI_API_KEY in the environment.")

        response = client.chat.completions.create(
            model="openrouter/free",
            messages=[
                {"role": "user", "content": f"{SYSTEM_PROMPT}\n\nUSER DILEMMA: {situation}"}
            ],
            response_format={"type": "json_object"}
        )

        # Parse the JSON response
        raw_content = response.choices[0].message.content
        if not raw_content:
            raise HTTPException(status_code=500, detail="AI returned an empty response.")
            
        data = json.loads(raw_content)
        
        # Ensure all fields exist, fallback if needed
        return DecisionResponse(
            pros=data.get("pros", []),
            cons=data.get("cons", []),
            recommendation=data.get("recommendation", "Decision unclear based on current data."),
            action_plan=data.get("action_plan", [])
        )

    except Exception as e:
        error_msg = str(e)
        print(f"Error during AI analysis: {error_msg}")
        raise HTTPException(status_code=500, detail=f"AI Engine Error: {error_msg}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
