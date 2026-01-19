# QR Code Public Access Setup

## Problem
QR codes with `localhost:3000` URLs don't work on phones because phones can't reach your computer's localhost.

## Solution
We use **localtunnel** to create a public URL that tunnels to your localhost.

## Steps to Make QR Codes Work on Your Phone:

### 1. Start the tunnel (Already running)
```bash
npx localtunnel --port 3000
```

Current tunnel URL: `https://floppy-seas-rule.loca.lt`

### 2. Restart Next.js server
Stop the current `npm run dev` and restart it to pick up the new environment variable:

```bash
# Press Ctrl+C to stop the current server
# Then run:
npm run dev
```

### 3. Test the QR Code
1. Go to http://localhost:3000/dashboard/profiles
2. Select a profile (e.g., "Ayoub Derdoukh")
3. The QR code will now encode: `https://floppy-seas-rule.loca.lt/qr/4qq0CtNc`
4. Scan with your phone - it should work!

## Important Notes:

- ⚠️ **The tunnel URL changes** every time you restart localtunnel
- ⚠️ **You need to update `.env.local`** with the new URL each time
- ⚠️ **Keep the tunnel running** while testing QR codes
- ✅ **In production**, you won't need this - QR codes will use your real domain

## When You Deploy to Production:

1. Remove or update `NEXT_PUBLIC_URL` in `.env.local` to your production domain
2. QR codes will automatically use the production URL
3. No tunnel needed!

## Alternative: Use ngrok (More stable)

If you want a more stable tunnel:

```bash
# Install ngrok
brew install ngrok

# Start tunnel
ngrok http 3000
```

Then update `.env.local` with the ngrok URL.
