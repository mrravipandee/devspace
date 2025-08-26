# Deployment Guide for DevSpace

## Environment Variables Required

Create a `.env.local` file (for development) or set these environment variables on your production server:

```bash
# Database Configuration
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/devspace?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# API Configuration
NEXT_PUBLIC_API_URL=https://api.devspacee.me

# Environment
NODE_ENV=production
```

## Production Deployment Steps

### 1. Environment Setup
- Set all environment variables on your production server
- Ensure `NODE_ENV=production` is set
- Make sure `JWT_SECRET` is a strong, random string

### 2. Database Setup
- Create a MongoDB Atlas cluster or use your preferred MongoDB provider
- Update the `MONGO_URI` with your actual connection string
- Ensure the database is accessible from your server

### 3. Domain Configuration
- Set up DNS records for your domains:
  - `www.devspacee.me` → Your frontend server
  - `api.devspacee.me` → Your API server (or same server with subdomain routing)

### 4. SSL Certificate
- Ensure SSL certificates are installed for both domains
- Required for secure cookies in production

### 5. Server Configuration
- Install Node.js 18+ on your server
- Clone your repository
- Run `npm install`
- Build the application: `npm run build`
- Start the production server: `npm start`

### 6. Nginx Configuration (if using Nginx)

```nginx
# Frontend configuration
server {
    listen 80;
    server_name www.devspacee.me devspacee.me;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name www.devspacee.me devspacee.me;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# API subdomain configuration
server {
    listen 80;
    server_name api.devspacee.me;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name api.devspacee.me;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Common Issues:

1. **Login not working in production**
   - Check if `JWT_SECRET` is set
   - Verify `MONGO_URI` is correct and accessible
   - Ensure SSL certificates are valid
   - Check cookie domain settings

2. **CORS errors**
   - Verify domain names in CORS configuration
   - Check if API subdomain is properly configured

3. **Database connection issues**
   - Verify MongoDB connection string
   - Check network access to MongoDB
   - Ensure database user has proper permissions

4. **Cookie issues**
   - Ensure `secure: true` is set in production
   - Verify domain settings for cookies
   - Check if HTTPS is properly configured

## Testing Deployment

1. Test the health endpoint: `https://api.devspacee.me/api/health`
2. Try logging in with valid credentials
3. Check if cookies are being set properly
4. Verify redirects work correctly
5. Test API endpoints from the frontend

## Security Notes

- Never commit `.env.local` to version control
- Use strong, random JWT secrets
- Enable HTTPS in production
- Regularly update dependencies
- Monitor server logs for errors
