# LTP Player App

React Native mobile app for players to discover and book turfs.

## Features

- **OTP Authentication** - Secure phone-based login
- **Home** - Featured turfs and sports categories
- **Turf Discovery** - Browse turfs by sport with filters
- **Booking Management** - View bookings and cancel if needed
- **Profile** - User profile and settings
- **Professional UI** - Modern, intuitive design

## Tech Stack

- React Native (Expo)
- React Navigation
- Axios for API calls
- AsyncStorage for local data
- Context API for state management

## Setup

```bash
cd ltp-turf-players
npm install
npm start
```

## API Integration

All APIs integrated with backend at `http://115.124.98.61:8000/api/v1/player`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # App screens
├── navigation/     # Navigation setup
├── services/       # API services
├── contexts/       # React contexts
├── constants/      # Theme and constants
└── utils/          # Utility functions
```
