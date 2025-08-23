#!/usr/bin/env python3
"""
Example integration code for knowledge_chipper with GetReceipts.org
Add this to your knowledge_chipper project
"""

import os
import requests
import json

# Configuration
GETRECEIPTS_API_KEY = os.getenv('GETRECEIPTS_API_KEY')
GETRECEIPTS_API_URL = os.getenv('GETRECEIPTS_API_URL', 'http://localhost:3000/api')

def send_to_getreceipts(claim_data):
    """
    Send claim with knowledge artifacts to GetReceipts.org
    
    Args:
        claim_data (dict): RF-1 format data with knowledge_artifacts
    
    Returns:
        dict: Response from GetReceipts API
    """
    
    if not GETRECEIPTS_API_KEY:
        raise ValueError("GETRECEIPTS_API_KEY environment variable required")
    
    headers = {
        'Authorization': f'Bearer {GETRECEIPTS_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(
            f'{GETRECEIPTS_API_URL}/receipts',
            headers=headers,
            json=claim_data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Claim created successfully!")
            print(f"📧 Created by: {result['created_by']}")
            print(f"🔑 Auth method: {result['authentication_method']}")
            print(f"🤖 API key name: {result.get('api_key_name', 'N/A')}")
            print(f"🔗 URL: {result['url']}")
            print(f"📊 Knowledge artifacts: {result['knowledge_artifacts_count']}")
            return result
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            response.raise_for_status()
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        raise

def add_knowledge_to_existing_claim(claim_id, knowledge_artifacts):
    """
    Add knowledge artifacts to an existing claim
    
    Args:
        claim_id (str): UUID of the existing claim
        knowledge_artifacts (dict): Knowledge artifacts to add
    """
    
    if not GETRECEIPTS_API_KEY:
        raise ValueError("GETRECEIPTS_API_KEY environment variable required")
    
    headers = {
        'Authorization': f'Bearer {GETRECEIPTS_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(
            f'{GETRECEIPTS_API_URL}/knowledge/{claim_id}',
            headers=headers,
            json=knowledge_artifacts,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Knowledge artifacts added to claim {claim_id}")
            print(f"📧 Added by: {result['created_by']}")
            print(f"📊 Added: {result['inserted_count']}")
            return result
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            response.raise_for_status()
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        raise

# Example usage
if __name__ == "__main__":
    # Example claim data (RF-1 format with knowledge artifacts)
    example_claim = {
        "claim_text": "Climate change is accelerating due to human activities",
        "claim_long": "Detailed analysis of climate data shows accelerating warming trends",
        "topics": ["climate", "environment", "science"],
        "sources": [
            {
                "type": "report",
                "title": "IPCC AR6 Report",
                "url": "https://www.ipcc.ch/report/ar6/"
            }
        ],
        "supporters": ["97% of climate scientists"],
        "opponents": [],
        "knowledge_artifacts": {
            "people": [
                {
                    "name": "Dr. Michael Mann",
                    "bio": "Climate scientist and author",
                    "expertise": ["climatology", "paleoclimatology"],
                    "credibility_score": 0.95,
                    "sources": {"papers": 200, "citations": 15000}
                }
            ],
            "jargon": [
                {
                    "term": "greenhouse effect",
                    "definition": "Process by which radiation from atmosphere warms planet's surface",
                    "domain": "climate science",
                    "related_terms": ["carbon dioxide", "methane", "warming"],
                    "examples": ["CO2 trapping heat", "Venus greenhouse effect"]
                }
            ],
            "mental_models": [
                {
                    "name": "Carbon Cycle",
                    "description": "The movement of carbon through Earth's systems",
                    "domain": "earth science",
                    "key_concepts": ["carbon sources", "carbon sinks", "atmospheric CO2"],
                    "relationships": {
                        "inputs": ["fossil fuel burning", "deforestation"],
                        "outputs": ["ocean absorption", "plant photosynthesis"]
                    }
                }
            ]
        }
    }
    
    # Test the integration
    print("🧪 Testing GetReceipts.org integration...")
    print(f"API URL: {GETRECEIPTS_API_URL}")
    print(f"API Key set: {'Yes' if GETRECEIPTS_API_KEY else 'No'}")
    
    if GETRECEIPTS_API_KEY:
        try:
            result = send_to_getreceipts(example_claim)
            print("\n🎉 Integration test successful!")
        except Exception as e:
            print(f"\n❌ Integration test failed: {e}")
    else:
        print("\n⚠️  Set GETRECEIPTS_API_KEY environment variable to test")
