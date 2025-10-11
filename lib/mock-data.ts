import type { SpotifyPlaylist, SpotifyTrack, SpotifyUser } from "./spotify"

// Mock Spotify user data
export const mockSpotifyUser: SpotifyUser = {
  id: "demo-user",
  display_name: "Demo User",
  email: "demo@example.com",
  images: [{ url: "https://avatars.githubusercontent.com/u/1?v=4" }],
  product: "premium",
}

// Mock Spotify playlists
export const mockSpotifyPlaylists: SpotifyPlaylist[] = [
  {
    id: "playlist1",
    name: "Morning Run Mix",
    description: "Custom playlist for Morning Run with pace-optimized BPM for each segment.",
    public: false,
    collaborative: false,
    images: [{ url: "/vibrant-headphones-playlist.png" }],
    tracks: {
      total: 12,
    },
    owner: {
      id: "demo-user",
      display_name: "Demo User",
    },
  },
  {
    id: "playlist2",
    name: "Hill Training Beats",
    description: "Custom playlist for Hill Training with pace-optimized BPM for each segment.",
    public: false,
    collaborative: false,
    images: [{ url: "/rhythmic-stride.png" }],
    tracks: {
      total: 15,
    },
    owner: {
      id: "demo-user",
      display_name: "Demo User",
    },
  },
  {
    id: "playlist3",
    name: "Recovery Jog Tunes",
    description: "Relaxed beats for your recovery runs.",
    public: false,
    collaborative: false,
    images: [{ url: "/tranquil-soundscape.png" }],
    tracks: {
      total: 8,
    },
    owner: {
      id: "demo-user",
      display_name: "Demo User",
    },
  },
]

// Mock Spotify tracks
export const mockSpotifyTracks: SpotifyTrack[] = [
  {
    id: "track1",
    name: "Running Start",
    artists: [{ id: "artist1", name: "The Pacers" }],
    album: {
      id: "album1",
      name: "Marathon Beats",
      images: [{ url: "/abstract-soundscape.png" }],
    },
    duration_ms: 210000,
    popularity: 75,
    preview_url: null,
  },
  {
    id: "track2",
    name: "Uphill Battle",
    artists: [{ id: "artist2", name: "Elevation" }],
    album: {
      id: "album2",
      name: "Peak Performance",
      images: [{ url: "/abstract-soundscape.png" }],
    },
    duration_ms: 195000,
    popularity: 82,
    preview_url: null,
  },
  {
    id: "track3",
    name: "Downhill Flow",
    artists: [{ id: "artist3", name: "Gravity" }],
    album: {
      id: "album3",
      name: "Momentum",
      images: [{ url: "/pulsating-rhythms.png" }],
    },
    duration_ms: 180000,
    popularity: 68,
    preview_url: null,
  },
]

// Enhanced mock route data with detailed information
export interface DetailedRoute {
  id: string
  title: string
  distance: string // Display format (e.g., "5.2 km")
  distanceValue: number // Numeric value in km
  elevation: string // Display format (e.g., "120m")
  elevationGain: number // Numeric value in meters
  date: string
  location: string
  targetPace: string // Display format (e.g., "5:30 min/km")
  targetPaceValue: number // Numeric value in minutes per km
  hasPlaylist: boolean
  elevationProfile: ElevationPoint[]
  segments: RouteSegment[]
}

export interface ElevationPoint {
  distance: number // km from start
  elevation: number // meters
}

export interface RouteSegment {
  name: string
  startDistance: number // km from start
  endDistance: number // km from start
  avgGrade: number // percentage (e.g., 3 for 3%)
  startElevation: number // meters
  endElevation: number // meters
  recommendedBpm?: number // calculated based on target pace and grade
}

// Sample routes with detailed elevation data
export const detailedRoutes: DetailedRoute[] = [
  {
    id: "route1",
    title: "Morning Run",
    distance: "5.2 km",
    distanceValue: 5.2,
    elevation: "120m",
    elevationGain: 120,
    date: "2 days ago",
    location: "Central Park",
    targetPace: "5:30 min/km",
    targetPaceValue: 5.5,
    hasPlaylist: true,
    elevationProfile: [
      { distance: 0, elevation: 100 },
      { distance: 0.5, elevation: 105 },
      { distance: 1.0, elevation: 120 },
      { distance: 1.5, elevation: 140 },
      { distance: 2.0, elevation: 150 },
      { distance: 2.5, elevation: 145 },
      { distance: 3.0, elevation: 130 },
      { distance: 3.5, elevation: 110 },
      { distance: 4.0, elevation: 105 },
      { distance: 4.5, elevation: 100 },
      { distance: 5.0, elevation: 100 },
      { distance: 5.2, elevation: 100 },
    ],
    segments: [
      {
        name: "Warm-up Flat",
        startDistance: 0,
        endDistance: 1.0,
        avgGrade: 1.0,
        startElevation: 100,
        endElevation: 120,
      },
      {
        name: "Hill Climb",
        startDistance: 1.0,
        endDistance: 2.0,
        avgGrade: 3.0,
        startElevation: 120,
        endElevation: 150,
      },
      {
        name: "Downhill Recovery",
        startDistance: 2.0,
        endDistance: 4.0,
        avgGrade: -2.0,
        startElevation: 150,
        endElevation: 105,
      },
      {
        name: "Final Flat",
        startDistance: 4.0,
        endDistance: 5.2,
        avgGrade: -0.4,
        startElevation: 105,
        endElevation: 100,
      },
    ],
  },
  {
    id: "route2",
    title: "Hill Training",
    distance: "8.7 km",
    distanceValue: 8.7,
    elevation: "350m",
    elevationGain: 350,
    date: "5 days ago",
    location: "Mountain Trail",
    targetPace: "6:15 min/km",
    targetPaceValue: 6.25,
    hasPlaylist: true,
    elevationProfile: [
      { distance: 0, elevation: 200 },
      { distance: 1.0, elevation: 220 },
      { distance: 2.0, elevation: 280 },
      { distance: 3.0, elevation: 350 },
      { distance: 4.0, elevation: 450 },
      { distance: 5.0, elevation: 500 },
      { distance: 6.0, elevation: 450 },
      { distance: 7.0, elevation: 350 },
      { distance: 8.0, elevation: 250 },
      { distance: 8.7, elevation: 220 },
    ],
    segments: [
      {
        name: "Warm-up Gradual Climb",
        startDistance: 0,
        endDistance: 2.0,
        avgGrade: 4.0,
        startElevation: 200,
        endElevation: 280,
      },
      {
        name: "Steep Climb Section",
        startDistance: 2.0,
        endDistance: 5.0,
        avgGrade: 7.3,
        startElevation: 280,
        endElevation: 500,
      },
      {
        name: "Downhill Return",
        startDistance: 5.0,
        endDistance: 8.7,
        avgGrade: -7.6,
        startElevation: 500,
        endElevation: 220,
      },
    ],
  },
  {
    id: "route3",
    title: "Recovery Jog",
    distance: "3.1 km",
    distanceValue: 3.1,
    elevation: "30m",
    elevationGain: 30,
    date: "1 week ago",
    location: "Riverside",
    targetPace: "7:00 min/km",
    targetPaceValue: 7.0,
    hasPlaylist: false,
    elevationProfile: [
      { distance: 0, elevation: 50 },
      { distance: 0.5, elevation: 55 },
      { distance: 1.0, elevation: 60 },
      { distance: 1.5, elevation: 65 },
      { distance: 2.0, elevation: 70 },
      { distance: 2.5, elevation: 75 },
      { distance: 3.0, elevation: 80 },
      { distance: 3.1, elevation: 80 },
    ],
    segments: [
      {
        name: "Gentle Riverside Path",
        startDistance: 0,
        endDistance: 3.1,
        avgGrade: 1.0,
        startElevation: 50,
        endElevation: 80,
      },
    ],
  },
  {
    id: "route4",
    title: "Long Run",
    distance: "15.3 km",
    distanceValue: 15.3,
    elevation: "210m",
    elevationGain: 210,
    date: "2 weeks ago",
    location: "City Loop",
    targetPace: "6:00 min/km",
    targetPaceValue: 6.0,
    hasPlaylist: true,
    elevationProfile: [
      { distance: 0, elevation: 100 },
      { distance: 2.0, elevation: 120 },
      { distance: 4.0, elevation: 150 },
      { distance: 6.0, elevation: 200 },
      { distance: 8.0, elevation: 250 },
      { distance: 10.0, elevation: 220 },
      { distance: 12.0, elevation: 180 },
      { distance: 14.0, elevation: 120 },
      { distance: 15.3, elevation: 100 },
    ],
    segments: [
      {
        name: "First Quarter - Gradual Climb",
        startDistance: 0,
        endDistance: 4.0,
        avgGrade: 1.25,
        startElevation: 100,
        endElevation: 150,
      },
      {
        name: "Second Quarter - Steeper Climb",
        startDistance: 4.0,
        endDistance: 8.0,
        avgGrade: 2.5,
        startElevation: 150,
        endElevation: 250,
      },
      {
        name: "Third Quarter - Gentle Descent",
        startDistance: 8.0,
        endDistance: 12.0,
        avgGrade: -1.75,
        startElevation: 250,
        endElevation: 180,
      },
      {
        name: "Final Quarter - Downhill Finish",
        startDistance: 12.0,
        endDistance: 15.3,
        avgGrade: -2.42,
        startElevation: 180,
        endElevation: 100,
      },
    ],
  },
  {
    id: "route5",
    title: "Interval Session",
    distance: "6.4 km",
    distanceValue: 6.4,
    elevation: "80m",
    elevationGain: 80,
    date: "3 weeks ago",
    location: "Track",
    targetPace: "4:45 min/km",
    targetPaceValue: 4.75,
    hasPlaylist: false,
    elevationProfile: [
      { distance: 0, elevation: 90 },
      { distance: 1.0, elevation: 100 },
      { distance: 2.0, elevation: 110 },
      { distance: 3.0, elevation: 120 },
      { distance: 4.0, elevation: 130 },
      { distance: 5.0, elevation: 140 },
      { distance: 6.0, elevation: 150 },
      { distance: 6.4, elevation: 170 },
    ],
    segments: [
      {
        name: "Warm-up",
        startDistance: 0,
        endDistance: 1.5,
        avgGrade: 1.33,
        startElevation: 90,
        endElevation: 110,
      },
      {
        name: "Interval 1",
        startDistance: 1.5,
        endDistance: 2.5,
        avgGrade: 1.0,
        startElevation: 110,
        endElevation: 120,
      },
      {
        name: "Recovery 1",
        startDistance: 2.5,
        endDistance: 3.0,
        avgGrade: 0,
        startElevation: 120,
        endElevation: 120,
      },
      {
        name: "Interval 2",
        startDistance: 3.0,
        endDistance: 4.0,
        avgGrade: 1.0,
        startElevation: 120,
        endElevation: 130,
      },
      {
        name: "Recovery 2",
        startDistance: 4.0,
        endDistance: 4.5,
        avgGrade: 0,
        startElevation: 130,
        endElevation: 130,
      },
      {
        name: "Interval 3",
        startDistance: 4.5,
        endDistance: 5.5,
        avgGrade: 2.0,
        startElevation: 130,
        endElevation: 150,
      },
      {
        name: "Cool Down",
        startDistance: 5.5,
        endDistance: 6.4,
        avgGrade: 2.22,
        startElevation: 150,
        endElevation: 170,
      },
    ],
  },
]

// Simple version of routes for display in UI
export const mockRoutes = detailedRoutes.map((route) => ({
  id: route.id,
  title: route.title,
  distance: route.distance,
  elevation: route.elevation,
  date: route.date,
  location: route.location,
  targetPace: route.targetPace,
  hasPlaylist: route.hasPlaylist,
}))

// Mock route segments for playlist creation
export const mockRouteSegments = [
  {
    name: "Warm-up Section",
    distanceRange: [0, 1] as [number, number],
    bpmRange: [140, 145] as [number, number],
    duration: 5,
  },
  {
    name: "Hill Climb",
    distanceRange: [1, 2.5] as [number, number],
    bpmRange: [155, 160] as [number, number],
    duration: 8,
  },
  {
    name: "Downhill Recovery",
    distanceRange: [2.5, 4] as [number, number],
    bpmRange: [145, 150] as [number, number],
    duration: 7,
  },
  {
    name: "Final Push",
    distanceRange: [4, 5.2] as [number, number],
    bpmRange: [140, 145] as [number, number],
    duration: 6,
  },
]
