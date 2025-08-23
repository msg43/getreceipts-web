# Multi-Domain Setup Guide

This guide explains how to deploy your GetReceipts application with multiple domains, each serving different themed homepages while sharing the same backend and publishing workflow.

## Architecture Overview

Your application now supports:
- **Single Codebase**: One repository serves multiple domains
- **Shared Backend**: All domains use the same Supabase database and APIs
- **Domain-Specific Branding**: Different themes, colors, and messaging per domain
- **Same Publishing Workflow**: All domains use identical submission and claim processes

## Current Domain Configurations

### Default (getreceipts.org)
- **Theme**: Default blue theme
- **Brand**: GetReceipts
- **Focus**: General claim publishing platform

### FactCheck Portal (factcheck.example.com)
- **Theme**: Blue/indigo theme
- **Brand**: FactCheck Portal
- **Focus**: Evidence-based fact-checking

### ClaimsTracker (claims.example.com)
- **Theme**: Green/emerald theme
- **Brand**: ClaimsTracker
- **Focus**: Argument mapping and position tracking

## Deployment Steps

### 1. Configure Domains in Vercel

1. **Deploy to Vercel** (if not already done):
   ```bash
   npx vercel --prod
   ```

2. **Add Multiple Domains**:
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add each domain you want to use:
     - `factcheck.yourdomain.com`
     - `claims.yourdomain.com`
     - etc.

3. **Configure DNS**:
   - For each domain, configure DNS records as shown in Vercel
   - Typically CNAME records pointing to `cname.vercel-dns.com`

### 2. Update Domain Configuration

Edit `/src/lib/domain-config.ts` to include your actual domains:

```typescript
export const domainConfigs: Record<string, DomainConfig> = {
  'getreceipts.org': {
    theme: 'default',
    brand: 'GetReceipts',
    // ... existing config
  },
  'factcheck.yourdomain.com': {
    theme: 'factcheck',
    brand: 'FactCheck Portal',
    // ... factcheck config
  },
  'claims.yourdomain.com': {
    theme: 'claims',
    brand: 'ClaimsTracker',
    // ... claims config
  },
};
```

Also update `/src/middleware.ts` with your actual domains.

### 3. Environment Variables

No changes needed! All domains share the same environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE=your_service_role_key
DATABASE_URL=your_database_url
```

### 4. Testing

1. **Local Testing**:
   ```bash
   # Add to your /etc/hosts for testing
   127.0.0.1 factcheck.local
   127.0.0.1 claims.local
   
   # Start dev server
   npm run dev
   ```

2. **Production Testing**:
   - Visit each domain after DNS propagation
   - Verify different homepages load
   - Test submit workflow works on all domains
   - Verify all claim pages work across domains

## How It Works

### Middleware Routing
- `src/middleware.ts` detects the incoming domain
- Sets custom headers with theme and brand information
- Routes root path (`/`) to domain-specific homepage components

### Domain-Specific Pages
- `/` → Domain-specific homepage (in `/src/app/homepage/[theme]/page.tsx`)
- `/submit` → Shared across all domains
- `/claim/[slug]` → Shared across all domains
- `/api/*` → Shared across all domains

### Shared Components
- All domains use the same:
  - API endpoints
  - Database
  - Submit workflow
  - Claim display logic
  - Voting and commenting systems

## Customization

### Adding New Domains

1. **Add to `domain-config.ts`**:
   ```typescript
   'newdomain.com': {
     theme: 'custom',
     brand: 'Custom Brand',
     primaryColor: 'purple',
     title: 'Custom Title',
     description: 'Custom description',
   }
   ```

2. **Create Homepage Component**:
   ```bash
   mkdir src/app/homepage/custom
   # Copy and customize from existing themes
   ```

3. **Update Middleware**:
   Add the new domain to the `domainConfigs` object in `middleware.ts`

4. **Add to Vercel**:
   Add the domain in Vercel dashboard and configure DNS

### Customizing Themes

Each theme can be customized by:
- **Colors**: Update Tailwind classes in homepage components
- **Branding**: Modify text, logos, and messaging
- **Layout**: Adjust component structure
- **Features**: Show/hide different features per domain

### Advanced Customization

For deeper customization, you can:
- Create domain-specific layouts
- Add domain-specific components
- Implement domain-specific API behavior
- Add domain-specific analytics tracking

## Benefits

### Single Codebase
- Easier maintenance and updates
- Shared bug fixes and features
- Consistent API and data model

### Shared Backend
- Single database for all claims
- Cross-domain claim discovery
- Unified user accounts (if implemented)
- Consistent data quality

### Marketing Flexibility
- Target different audiences with appropriate branding
- A/B test different messaging approaches
- Serve specialized communities while maintaining data unity

## Considerations

### SEO
- Each domain builds its own search presence
- Ensure unique, valuable content per domain
- Consider canonical URLs for shared content

### Analytics
- Track domains separately in your analytics
- Consider adding domain parameter to events
- Monitor user behavior across different brands

### Legal/Branding
- Ensure you own or have rights to all domains
- Consider trademark implications of different brands
- Update privacy policy and terms to reflect multiple domains

## Troubleshooting

### Domain Not Routing Correctly
1. Check DNS propagation: `dig yourdomain.com`
2. Verify Vercel domain configuration
3. Check middleware domain list
4. Review browser dev tools for errors

### Wrong Theme Loading
1. Verify domain in `domain-config.ts`
2. Check middleware header setting
3. Clear browser cache
4. Check for typos in domain names

### Shared Resources Not Working
1. Verify all domains point to same Vercel deployment
2. Check environment variables are set
3. Verify API endpoints work cross-domain
4. Check CORS settings if needed

## Next Steps

Consider implementing:
- Domain-specific user registration flows
- Custom analytics per domain
- Domain-specific email templates
- Advanced theming with CSS variables
- Domain-specific content filtering
