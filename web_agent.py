import requests,os
from dotenv import load_dotenv

load_dotenv()


def creat_web_agent(pathway_id: str ):
    """
    Creates a web agent of balndAI conversational pathway.
    
    Returns:
        Agent ID of the created web agent.
    """
 
    url = "https://api.bland.ai/v1/agents"

    payload = {"pathway_id": pathway_id,"voice": "Paige"}
    headers = {
        "authorization": os.getenv("BLAND_API_KEY"),
        "Content-Type": "application/json"
    }
    try:
        response = requests.request("POST", url, json=payload, headers=headers)
    
        agent_id = response.json().get("agent").get("agent_id")

        return agent_id

    except Exception as e:
        print(f"Error creating web agent: {e}")
        return None
    
def get_session_token(agent_id: str):
    """
    Retrieves the session token for a given agent ID.
    
    Args:
        agent_id (str): The ID of the agent.
    
    Returns:
        The session token for the agent.
    """
    url = f"https://api.bland.ai/v1/agents/{agent_id}/authorize"
    headers = {
        "authorization": os.getenv("BLAND_API_KEY"),
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.request("POST", url, headers=headers)
        return response.json().get("token")
    
    except Exception as e:
        print(f"Error retrieving session token: {e}")
        return None
    

