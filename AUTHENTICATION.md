# Authentication & Authorization System

This document describes the authentication and authorization system implemented for GetReceipts.org to track users and control access to data modification operations.

## Overview

The system provides:
1. **User Logging** - Track who adds/modifies which data
2. **Access Control** - Restrict who can perform which operations
3. **API Key Management** - Secure authentication for external services like knowledge_chipper
4. **Audit Trail** - Comprehensive logging of all data changes

## Database Schema Changes

### New Tables

#### `user_roles`
Defines permission-based roles:
- `admin`: Full system access
- `contributor`: Can add and edit content
- `knowledge_bot`: Automated knowledge addition only
- `viewer`: Read-only access

#### `user_role_assignments`
Maps users to their assigned roles.

#### `api_keys`
Secure API keys for external services:
- Hashed storage for security
- Granular permissions
- Expiration support
- Usage tracking

#### `audit_log`
Comprehensive audit trail:
- Tracks all CREATE/UPDATE/DELETE operations
- Records old and new values
- Links to user or API key
- Includes IP address and user agent

### Modified Tables

All knowledge tables now include `created_by` field:
- `claims.created_by` → references `users.id`
- `knowledge_people.created_by` → references `users.id`
- `knowledge_jargon.created_by` → references `users.id`
- `knowledge_models.created_by` → references `users.id`
- `claim_relationships.created_by` → references `users.id`

## Access Control Management

The access control system can be managed through multiple interfaces:

### **1. Command Line Interface (Recommended for Development)**

Use the admin CLI tool for quick user and role management:

```bash
# List all users and their roles
npx tsx scripts/admin-cli.ts users

# Show detailed user information
npx tsx scripts/admin-cli.ts user admin@getreceipts.org

# Assign role to user
npx tsx scripts/admin-cli.ts assign user@domain.com contributor

# Remove role from user
npx tsx scripts/admin-cli.ts remove user@domain.com viewer

# List all available roles
npx tsx scripts/admin-cli.ts roles

# View API keys
npx tsx scripts/admin-cli.ts api-keys

# View audit log
npx tsx scripts/admin-cli.ts audit
npx tsx scripts/admin-cli.ts audit claims  # filter by table
```

### **2. REST API Endpoints**

Programmatic management through HTTP APIs (admin authentication required):

#### User Management
- `GET /api/admin/users` - List all users with roles
- `POST /api/admin/users` - Create new user
- `POST /api/admin/users/{userId}/roles` - Assign role to user
- `DELETE /api/admin/users/{userId}/roles?role=roleName` - Remove role from user

#### Role Management
- `GET /api/admin/roles` - List all roles
- `POST /api/admin/roles` - Create new role
- `PUT /api/admin/roles` - Update existing role

#### API Key Management
- `GET /api/admin/api-keys` - List all API keys
- `POST /api/admin/api-keys` - Create new API key
- `DELETE /api/admin/api-keys?id=keyId` - Deactivate API key

#### Audit Log
- `GET /api/admin/audit` - View audit log with filtering and pagination

### **3. Direct Database Access (Production)**

For production environments, use SQL commands in Supabase dashboard:

```sql
-- View all users and their roles
SELECT u.email, ur.name as role_name, ura.assigned_at
FROM users u
JOIN user_role_assignments ura ON u.id = ura.user_id
JOIN user_roles ur ON ura.role_id = ur.id
ORDER BY u.email;

-- Assign role to user
INSERT INTO user_role_assignments (user_id, role_id, assigned_by)
SELECT u.id, ur.id, u.id
FROM users u, user_roles ur
WHERE u.email = 'user@domain.com' AND ur.name = 'contributor';

-- Remove role from user
DELETE FROM user_role_assignments
WHERE user_id = (SELECT id FROM users WHERE email = 'user@domain.com')
  AND role_id = (SELECT id FROM user_roles WHERE name = 'contributor');
```

### **4. Future: Web Admin Dashboard**

A web-based admin interface is planned for future releases.

## Setup Instructions

### 1. Database Migration

Run the authentication migration:

```sql
-- In Supabase SQL Editor, run:
\i auth_migration.sql
```

Or apply manually using the provided migration file.

### 2. Initial Setup

Create admin user and API keys:

```bash
# Set admin email (optional)
export ADMIN_EMAIL=your-email@domain.com

# Run setup script
npx tsx scripts/setup-auth.ts
```

This will:
- Create default roles
- Create admin user
- Generate API key for knowledge_chipper
- Display the API key (save it securely!)

### 3. Environment Variables

Add to your knowledge_chipper configuration:

```bash
GETRECEIPTS_API_KEY=gr_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GETRECEIPTS_API_URL=http://localhost:3000/api
```

## API Authentication

### For External Services (knowledge_chipper)

Include the API key in the Authorization header:

```bash
curl -X POST \
  -H "Authorization: Bearer gr_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"claim_text": "...", "knowledge_artifacts": {...}}' \
  http://localhost:3000/api/receipts
```

### For Web Sessions (Future)

Session-based authentication will be implemented when user registration is added.

## API Endpoints

### Data Submission

#### `POST /api/receipts`
- **Authentication**: Required (API key or session)
- **Permission**: `create_claims`
- **Additional Permission**: `add_knowledge` (for knowledge_artifacts)
- **Response**: Includes user info and authentication method

#### `POST /api/knowledge/{claimId}`
- **Authentication**: Required (API key or session)
- **Permission**: `add_knowledge`
- **Purpose**: Add knowledge artifacts to existing claims

### Administration

#### `GET /api/admin/api-keys`
- **Authentication**: Required (admin only)
- **Purpose**: List all API keys

#### `POST /api/admin/api-keys`
- **Authentication**: Required (admin only)
- **Purpose**: Create new API key
- **Body**:
  ```json
  {
    "userId": "uuid",
    "name": "service_name",
    "permissions": ["add_knowledge", "create_claims"],
    "expiresAt": "2024-12-31T23:59:59Z" // optional
  }
  ```

#### `DELETE /api/admin/api-keys?id={keyId}`
- **Authentication**: Required (admin only)
- **Purpose**: Deactivate API key

## Permissions System

### Available Permissions

- `create_claims`: Create new claims
- `edit_claims`: Modify existing claims
- `delete_claims`: Delete claims
- `add_knowledge`: Add knowledge artifacts
- `edit_knowledge`: Modify knowledge artifacts
- `delete_knowledge`: Delete knowledge artifacts
- `moderate_comments`: Moderate user comments

### Default Roles

| Role | Create Claims | Edit Claims | Delete Claims | Add Knowledge | Edit Knowledge | Delete Knowledge | Moderate |
|------|:-------------:|:-----------:|:-------------:|:-------------:|:--------------:|:----------------:|:--------:|
| **admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **contributor** | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| **knowledge_bot** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **viewer** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Usage Examples

### knowledge_chipper Integration

Update your knowledge_chipper to include the API key:

```python
import requests

api_key = "gr_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

data = {
    "claim_text": "Climate change is accelerating",
    "knowledge_artifacts": {
        "people": [...],
        "jargon": [...],
        "mental_models": [...]
    }
}

response = requests.post(
    "http://localhost:3000/api/receipts",
    headers=headers,
    json=data
)

print(f"Created by: {response.json()['created_by']}")
print(f"Auth method: {response.json()['authentication_method']}")
```

### Adding Knowledge to Existing Claims

```bash
curl -X POST \
  -H "Authorization: Bearer gr_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "people": [{"name": "Dr. Smith", "bio": "Climate scientist"}],
    "jargon": [{"term": "albedo", "definition": "Surface reflectivity"}]
  }' \
  http://localhost:3000/api/knowledge/{claimId}
```

## Security Features

### API Key Security
- Keys are hashed using SHA-256 before storage
- Original keys are never stored in the database
- Keys include `gr_` prefix for identification
- Deactivated keys remain in database for audit purposes

### Row Level Security (RLS)
- Enabled on all authentication tables
- Users can only view/edit their own data
- Admins have elevated access
- API operations bypass RLS through service role

### Audit Trail
- All data modifications are logged
- Includes before/after values for updates
- Tracks IP addresses and user agents
- Links actions to specific users or API keys

## Monitoring and Maintenance

### View Recent Activity

```sql
-- Recent data changes
SELECT 
  al.action,
  al.table_name,
  u.email as user_email,
  ak.name as api_key_name,
  al.created_at
FROM audit_log al
LEFT JOIN users u ON al.user_id = u.id
LEFT JOIN api_keys ak ON al.api_key_id = ak.id
ORDER BY al.created_at DESC
LIMIT 20;
```

### Monitor API Key Usage

```sql
-- API key usage statistics
SELECT 
  ak.name,
  u.email as owner_email,
  ak.last_used,
  ak.is_active,
  COUNT(al.id) as operations_count
FROM api_keys ak
LEFT JOIN users u ON ak.user_id = u.id
LEFT JOIN audit_log al ON ak.id = al.api_key_id
GROUP BY ak.id, ak.name, u.email, ak.last_used, ak.is_active
ORDER BY ak.last_used DESC;
```

## Troubleshooting

### Common Issues

1. **"Authentication required" error**
   - Ensure API key is included in Authorization header
   - Check that the key starts with `Bearer `
   - Verify the API key is active and not expired

2. **"Insufficient permissions" error**
   - Check user's role assignments
   - Verify the required permission is granted to the user's role
   - For API keys, check the permissions array

3. **Database constraint errors**
   - Run the auth migration if tables are missing
   - Ensure users table exists before creating API keys
   - Check foreign key relationships

### Regenerating API Keys

If an API key is compromised:

1. Deactivate the old key:
   ```bash
   curl -X DELETE \
     -H "Authorization: Bearer admin_api_key" \
     "http://localhost:3000/api/admin/api-keys?id={keyId}"
   ```

2. Create a new key:
   ```bash
   curl -X POST \
     -H "Authorization: Bearer admin_api_key" \
     -H "Content-Type: application/json" \
     -d '{"userId": "uuid", "name": "knowledge_chipper", "permissions": ["add_knowledge", "create_claims"]}' \
     http://localhost:3000/api/admin/api-keys
   ```

## Future Enhancements

- Session-based authentication for web users
- OAuth integration (Google, GitHub)
- Rate limiting per user/API key
- Permission inheritance and hierarchies
- Automatic key rotation
- Advanced audit query interface
- Real-time activity monitoring
