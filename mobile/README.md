# Mobile App - Collaborative Shopping Group

React Native mobile application for the Collaborative Shopping Group platform.

## Features

- **User Authentication**: Secure login and registration
- **Group Management**: Create and manage shopping groups
- **Shared Shopping Carts**: Real-time cart synchronization
- **Product Discovery**: Browse and scrape products from multiple platforms
- **Order Tracking**: Monitor orders across different e-commerce sites
- **Real-time Updates**: Socket.IO integration for live updates

## Tech Stack

- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **State Management**: React Context API
- **API Client**: Axios
- **Real-time**: Socket.IO Client
- **Storage**: AsyncStorage
- **Language**: TypeScript

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Update API configuration in `app.json`:
```json
{
  "extra": {
    "apiUrl": "http://your-backend-url:3000/api"
  }
}
```

3. Start the development server:
```bash
npm start
```

4. Run on platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
mobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── groups.tsx     # Groups list
│   │   ├── products.tsx   # Products browser
│   │   ├── orders.tsx     # Orders history
│   │   └── profile.tsx    # User profile
│   ├── auth/              # Authentication screens
│   │   ├── login.tsx      # Login screen
│   │   └── register.tsx   # Registration screen
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry point
├── services/              # API services
│   ├── api.ts             # Axios configuration
│   ├── auth.service.ts    # Authentication
│   ├── group.service.ts   # Groups API
│   ├── cart.service.ts    # Cart API
│   ├── product.service.ts # Products API
│   ├── order.service.ts   # Orders API
│   └── socket.service.ts  # Socket.IO
├── context/               # React Context
│   └── AuthContext.tsx    # Auth state management
├── config/                # Configuration
│   └── index.ts           # App config
├── app.json               # Expo configuration
├── package.json
└── tsconfig.json
```

## Supported Platforms

### E-commerce
- Amazon
- Flipkart
- Myntra
- H&M
- Blinkit

## Features Roadmap

- [x] User authentication
- [x] Group management
- [x] Real-time cart sync
- [ ] Product scraping UI
- [ ] Complete order flow
- [ ] Push notifications
- [ ] Offline support
- [ ] Payment integration
- [ ] Chat within groups
- [ ] Product recommendations

## API Integration

The app connects to the backend API. Ensure your backend server is running before using the app.

Default API endpoint: `http://localhost:3000/api`

## Development

### Running Tests
```bash
npm test
```

### Building for Production

#### iOS
```bash
expo build:ios
```

#### Android
```bash
expo build:android
```

## Environment Variables

Configure in `app.json` under `expo.extra`:
- `apiUrl`: Backend API URL

## Troubleshooting

### Cannot connect to backend
- Ensure backend server is running
- Check API URL in `app.json`
- For physical devices, use your computer's IP address instead of localhost

### Expo issues
- Clear Expo cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## License

MIT
