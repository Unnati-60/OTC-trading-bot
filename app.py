# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests, os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# CORS so frontend can call backend from localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_web_agent(pathway_id: str):
    url = "https://api.bland.ai/v1/agents"
    payload = {"pathway_id": pathway_id, "voice": "Paige"}
    headers = {
        "authorization": os.getenv("BLAND_API_KEY"),
        "Content-Type": "application/json"
    }
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    print(f"Response from creating web agent: {response.json()}")
    agent_id = response.json()["agent"]["agent_id"]
    
    return agent_id


def get_session_token(agent_id: str):
    url = f"https://api.bland.ai/v1/agents/{agent_id}/authorize"
    headers = {
        "authorization": os.getenv("BLAND_API_KEY"),
        "Content-Type": "application/json"
    }
    response = requests.post(url, headers=headers)
    response.raise_for_status()
    print(f"Response from getting session token: {response.json()}")
    return response.json()["token"]

@app.get("/start-session")
def start_session(pathway_id: str):
    try:
        agent_id = create_web_agent(pathway_id)
        session_token = get_session_token(agent_id)
        print(f"{agent_id=}, {session_token=}")
        return {"agent_id": agent_id, "session_token": session_token}
    except Exception as e:
        return {"error": str(e)}
