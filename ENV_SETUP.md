# Environment Variables for CMS

Add these variables to your `.env.local` file:

```bash
# Admin Authentication
ADMIN_SECRET=WXBc2wn8umNIZ5g6qDJY4TGOep9HShV3

# Email Configuration (Gmail)
EMAIL_USER=prashantbasnet111@gmail.com
EMAIL_PASSWORD=ibke wkth lquf rlrb
```

## Setting up Gmail App Password:

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification (enable if not already)
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Use it as `EMAIL_PASSWORD` in your `.env.local`

**Important**: 
- Replace `EMAIL_USER` with the Gmail account you want to send from
- Replace `EMAIL_PASSWORD` with the app password (not your regular Gmail password)
- Replace `ADMIN_SECRET` with a long random string (at least 32 characters)
- Never commit `.env.local` to git
- The admin email is hardcoded as: `prashantbasnet664@gmail.com`
