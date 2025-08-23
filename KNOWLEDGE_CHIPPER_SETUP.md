# 🚀 Knowledge_Chipper → GetReceipts Integration Guide

## ✅ **Status: WORKING & TESTED!**

The integration is **production-ready** and successfully tested! Claims are being created with full knowledge artifacts.

---

## 📋 **Step-by-Step Setup**

### **1. Copy Integration File**
```bash
# Copy knowledge_chipper_integration.py to your knowledge_chipper project
cp knowledge_chipper_integration.py /path/to/your/knowledge_chipper/
```

### **2. Install Dependencies**
```bash
cd /path/to/your/knowledge_chipper/
pip install requests
```

### **3. Set Environment Variables**
```bash
# For local development
export GETRECEIPTS_API_KEY="gr_test_key_for_knowledge_chipper_123"
export GETRECEIPTS_API_URL="http://localhost:3000/api"

# For production 
export GETRECEIPTS_API_KEY="your_production_api_key"
export GETRECEIPTS_API_URL="https://getreceipts.org/api"
```

### **4. Update Your Knowledge_Chipper Code**

Add this to your main knowledge_chipper processing script:

```python
from knowledge_chipper_integration import process_knowledge_chipper_output, batch_submit_claims

def process_video_with_getreceipts_integration(video_file_path):
    """Your enhanced knowledge_chipper function"""
    
    # Your existing knowledge_chipper processing
    transcript = extract_transcript(video_file_path)
    video_url = get_video_url(video_file_path)
    
    # Your existing knowledge extraction
    claims = extract_claims_from_transcript(transcript)
    people = extract_people_from_transcript(transcript)
    jargon = extract_jargon_from_transcript(transcript)
    mental_models = extract_mental_models_from_transcript(transcript)
    topics = extract_topics_from_transcript(transcript)  # or manually set
    
    # NEW: Convert to GetReceipts format
    rf1_claims = process_knowledge_chipper_output(
        transcript=transcript,
        video_url=video_url,
        claims=claims,
        people=people,
        jargon=jargon,
        mental_models=mental_models,
        topics=topics
    )
    
    # NEW: Submit to GetReceipts
    results = batch_submit_claims(rf1_claims)
    
    # Handle results
    successful = [r for r in results if 'error' not in r]
    failed = [r for r in results if 'error' in r]
    
    print(f"📊 Knowledge_Chipper + GetReceipts Results:")
    print(f"   ✅ {len(successful)} claims published successfully")
    print(f"   ❌ {len(failed)} claims failed")
    
    # Return URLs for sharing
    claim_urls = [f"http://localhost:3000{r['url']}" for r in successful]
    return successful, failed, claim_urls
```

---

## 🔧 **Data Format Requirements**

### **People Format:**
```python
people = [
    {
        "name": "Dr. Jane Smith",
        "bio": "AI researcher at MIT",
        "expertise": ["machine learning", "neural networks"],
        "credibility_score": 0.85,  # 0.0 to 1.0
        "sources": ["100+ papers", "Google Scholar profile"]  # Array of strings
    }
]
```

### **Jargon Format:**
```python
jargon = [
    {
        "term": "transformer",
        "definition": "Neural network architecture using attention mechanisms",
        "domain": "machine learning",
        "related_terms": ["attention", "BERT", "GPT"],
        "examples": ["GPT-4", "BERT", "T5"]
    }
]
```

### **Mental Models Format:**
```python
mental_models = [
    {
        "name": "Attention Mechanism",
        "description": "How neural networks focus on relevant parts of input",
        "domain": "deep learning",
        "key_concepts": ["queries", "keys", "values", "weights"],
        "relationships": [
            {"from": "input", "to": "attention_weights", "type": "causes"},
            {"from": "attention_weights", "to": "focused_output", "type": "enables"}
        ]
    }
]
```

---

## 📊 **Expected Results**

### **Success Response:**
```python
{
    "success": True,
    "claim_id": "uuid-here",
    "url": "/claim/abc123",
    "badge_url": "/api/badge/abc123.svg",
    "created_by": "matt@rainfall.llc",
    "authentication_method": "api_key",
    "api_key_name": "knowledge_chipper",
    "knowledge_artifacts_count": {
        "people": 2,
        "jargon": 5,
        "mental_models": 1
    }
}
```

### **Each Claim Gets:**
- ✅ **Unique URL** (`/claim/abc123`) for sharing
- ✅ **Consensus Badge** (`/api/badge/abc123.svg`) 
- ✅ **All Knowledge Artifacts** (people, jargon, mental models)
- ✅ **Full Attribution** (created by knowledge_chipper API key)
- ✅ **Source Tracking** (video URL, timestamp)

---

## 🚀 **Production Deployment**

### **1. Generate Production API Key**
- Use admin CLI or Supabase dashboard
- Store securely in your environment

### **2. Update URLs**
```python
# Production settings
GETRECEIPTS_API_URL = "https://getreceipts.org/api"
```

### **3. Error Handling**
```python
try:
    results = batch_submit_claims(rf1_claims)
    for result in results:
        if 'error' in result:
            logger.error(f"Failed claim: {result['error']}")
        else:
            logger.info(f"Published: {result['url']}")
except Exception as e:
    logger.error(f"GetReceipts integration failed: {e}")
```

---

## 🎯 **Integration Examples**

### **Minimal Integration:**
```python
# After processing video with knowledge_chipper
from knowledge_chipper_integration import send_to_getreceipts

claim_data = {
    "claim_text": "Main claim from video",
    "topics": ["AI", "research"],
    "sources": [{"type": "video", "url": video_url}],
    "knowledge_artifacts": {
        "people": extracted_people,
        "jargon": extracted_jargon,
        "mental_models": extracted_models
    }
}

result = send_to_getreceipts(claim_data)
print(f"Published at: {result['url']}")
```

### **Batch Processing:**
```python
# Process multiple claims from one video
rf1_claims = process_knowledge_chipper_output(
    transcript, video_url, claims, people, jargon, mental_models
)
results = batch_submit_claims(rf1_claims)
```

---

## ✅ **Verification Checklist**

- [ ] `knowledge_chipper_integration.py` copied to project
- [ ] `requests` installed
- [ ] Environment variables set (`GETRECEIPTS_API_KEY`, `GETRECEIPTS_API_URL`)
- [ ] Test integration runs successfully
- [ ] Claims appear at generated URLs
- [ ] Knowledge artifacts visible in claim details
- [ ] Error handling implemented
- [ ] Production API key generated (when ready)

---

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **"API key not found"**
   - Check `GETRECEIPTS_API_KEY` environment variable
   - Verify API key is correct

2. **"Validation error"** 
   - Check data formats match schema requirements
   - Ensure `sources` fields are arrays, not objects

3. **"Network error"**
   - Verify GetReceipts server is running
   - Check `GETRECEIPTS_API_URL` is correct

4. **"Authentication failed"**
   - Regenerate API key if needed
   - Check service role permissions

### **Test Commands:**
```bash
# Test basic integration
GETRECEIPTS_API_KEY=your_key python knowledge_chipper_integration.py

# Test with your data
python your_knowledge_chipper_script.py --test-getreceipts
```

---

**🎉 The integration is ready! Your knowledge_chipper output will now automatically flow into GetReceipts for sharing and collaboration!**
