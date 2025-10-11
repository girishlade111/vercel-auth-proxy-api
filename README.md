# PaceBeats - Spotify Strava Integration

PaceBeats is an application that creates pace-optimized Spotify playlists based on your Strava running routes.

## Current Status

The app is currently set up in "demo mode," which allows you to explore the UI and functionality without requiring actual API connections. This makes it easy to deploy and test the app before setting up the API integrations.

## Adding API Connections Later

When you're ready to add the real API connections, follow these steps:

### 1. Set Up Strava API

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Create a new application
3. Set the following:
   - Application Name: PaceBeats (or your preferred name)
   - Website: Your app's URL (e.g., https://your-app.vercel.app)
   - Authorization Callback Domain: your-app.vercel.app (without https://)
4. After creating the application, note your Client ID and Client Secret

### 2. Set Up Spotify API

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Set the following:
   - App name: PaceBeats (or your preferred name)
   - App description: Create pace-optimized playlists for running routes
   - Redirect URI: https://your-app.vercel.app/api/auth/callback/spotify
4. After creating the application, note your Client ID and Client Secret

### 3. Add Environment Variables

Add the following environment variables to your Vercel project:

\`\`\`
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_generated_secret_here

STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
\`\`\`

For local development, create a `.env.local` file with these variables.

### 4. Remove Demo Mode (Optional)

If you want to completely remove the demo mode:

1. Edit `app/api/auth/[...nextauth]/route.ts` and remove the Credentials provider
2. Update the sign-in page to remove the demo mode option
3. Remove the demo mode indicator and related components

## Development

\`\`\`bash
# Install dependencies
npm install

# Run the development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
