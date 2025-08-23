# Knowledge_Chipper Integration Guide

## ✅ **Status: WORKING!** 

Your GetReceipts API is now ready for Knowledge_Chipper integration! 

### 🚀 **Quick Test Results**

```bash
✅ API Authentication: WORKING
✅ Claim Creation: WORKING  
✅ Knowledge Artifacts: WORKING
✅ User Tracking: WORKING (matt@rainfall.llc)
✅ API Key Logging: WORKING (knowledge_chipper)
```

**Last Test:** Successfully created claim `2a4fdfef-50b8-48e9-bbcb-bd560e7c41d4`

---

## 📋 **Integration Steps**

### 1. **Install Requirements**
```bash
pip install requests
```

### 2. **Use the Integration Script**
Copy `knowledge_chipper_integration.py` and adapt it to your Knowledge_Chipper pipeline.

### 3. **API Configuration**
```python
# Configuration
GETRECEIPTS_API_URL = "http://localhost:3000/api"  # Update for production
API_KEY = "gr_test_key_for_knowledge_chipper_123"   # Your actual API key
```

### 4. **Basic Usage**
```python
from knowledge_chipper_integration import GetReceiptsClient, create_claim_from_knowledge_chipper_output

# Initialize client
client = GetReceiptsClient(GETRECEIPTS_API_URL, API_KEY)

# Convert your Knowledge_Chipper output to RF-1 format
rf1_data = create_claim_from_knowledge_chipper_output(
    transcript_text=your_transcript,
    extracted_claims=your_claims,
    people=your_people_data,
    jargon=your_jargon_data,
    mental_models=your_models_data,
    topics=["ai", "research"],
    sources=[{"type": "video", "url": video_url}]
)

# Submit to GetReceipts
result = client.submit_claim(rf1_data)
```

---

## 📊 **Expected Response Format**

### ✅ **Success (201)**
```json
{
  "success": true,
  "claim_id": "2a4fdfef-50b8-48e9-bbcb-bd560e7c41d4",
  "url": "/claim/85eFK4xh0v",
  "badge_url": "/api/badge/85eFK4xh0v.svg",
  "created_by": "matt@rainfall.llc",
  "authentication_method": "api_key",
  "api_key_name": "knowledge_chipper",
  "knowledge_artifacts_count": {
    "people": 1,
    "jargon": 1,
    "mental_models": 1
  },
  "data": {
    "id": "2a4fdfef-50b8-48e9-bbcb-bd560e7c41d4",
    "slug": "85eFK4xh0v",
    "text_short": "Machine learning models require vast amounts of training data...",
    "topics": ["machine learning", "AI", "Stanford"],
    "created_by": "16ff011d-7d7e-4656-ac3d-2873726595eb",
    "created_at": "2025-08-22T05:45:12.123456"
  }
}
```

### ❌ **Error (400)**
```json
{
  "error": "Validation error",
  "details": "claim_text is required"
}
```

---

## 🔧 **RF-1 Schema Reference**

### **Required Fields**
```json
{
  "claim_text": "Your main claim here (minimum 8 characters)",
  "topics": ["topic1", "topic2"]
}
```

### **Optional Knowledge Artifacts**
```json
{
  "knowledge_artifacts": {
    "people": [
      {
        "name": "Dr. Sarah Chen",
        "bio": "ML researcher at Stanford",
        "expertise": ["machine learning", "AI"],
        "credibility_score": 0.85
      }
    ],
    "jargon": [
      {
        "term": "overfitting",
        "definition": "When a model memorizes training data",
        "domain": "machine learning",
        "related_terms": ["generalization", "validation"]
      }
    ],
    "mental_models": [
      {
        "name": "Bias-Variance Tradeoff",
        "description": "Fundamental ML tradeoff",
        "key_concepts": ["bias", "variance", "complexity"],
        "relationships": [
          {"from": "complexity", "to": "overfitting", "type": "causes"}
        ]
      }
    ]
  }
}
```

---

## 🔐 **Authentication**

### **API Key Header**
```
Authorization: Bearer gr_test_key_for_knowledge_chipper_123
```

### **User Tracking**
- Each claim automatically tracks `created_by` (matt@rainfall.llc)
- API key usage is logged (`knowledge_chipper`)
- Full audit trail in the database

---

## 🚀 **Production Deployment**

When ready for production:

1. **Update API URL**
   ```python
   GETRECEIPTS_API_URL = "https://getreceipts.org/api"
   ```

2. **Generate Production API Key**
   - Use the admin CLI or Supabase dashboard
   - Store securely in environment variables

3. **Error Handling**
   ```python
   result = client.submit_claim(rf1_data)
   if "error" in result:
       logger.error(f"Failed to submit claim: {result['error']}")
   else:
       logger.info(f"Created claim: {result['claim_id']}")
   ```

---

## 🎯 **Next Steps**

1. **Adapt Integration Script**: Modify `knowledge_chipper_integration.py` to fit your pipeline
2. **Test with Real Data**: Try with actual Knowledge_Chipper output
3. **Set Up Production**: Deploy with proper API keys and error handling
4. **Monitor Usage**: Track successful submissions and handle failures

**The API is production-ready for Knowledge_Chipper integration!** 🚀
