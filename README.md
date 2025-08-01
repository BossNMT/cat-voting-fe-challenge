# 🐱 Cat Voting App

A modern React application for voting on adorable cat photos from TheCatAPI. Built with TypeScript, React Query, Zustand, and Tailwind CSS for optimal performance and user experience.

## ✨ Key Features

- **📸 Photo Gallery**: Browse random cat photos with masonry layout
- **👍👎 Voting System**: Vote up/down with optimistic updates
- **📊 Voting History**: Track your votes with persistent storage
- **🌙 Dark Mode**: Auto system-aware light/dark theme switching
- **⚡ Performance Optimized**: Lazy loading images, memoization, debouncing
- **🛡️ Error Handling**: Error boundaries and user-friendly error messages
- **📱 Responsive**: Mobile-first design with smooth animations
- **♿ Accessibility**: Keyboard navigation and screen reader support

## 🏗️ Project Architecture

### Folder Structure
```
src/
├── components/ui/          # Reusable UI components
│   ├── DarkModeToggle.tsx  # Toggle dark/light mode
│   ├── ErrorBoundary.tsx   # Global error handling
│   ├── LoadingSpinner.tsx  # Loading indicator
│   ├── MasonryGrid.tsx     # Masonry layout grid
│   └── Toast.tsx           # Toast notifications
├── configs/                # App configuration
│   └── env.config.ts       # Environment variables
├── constants/              # App constants
│   ├── local-storage.ts    # Local storage keys
│   └── query-keys.ts       # React Query keys
├── hooks/                  # Custom React hooks
│   ├── useDarkMode.ts      # Dark mode management hook
│   ├── useDebounce.ts      # Debounce hook
│   ├── useLazyImage.ts     # Lazy image loading hook
│   └── useToast.ts         # Toast display hook
├── layouts/                # Layout components
│   ├── MainLayout.tsx      # Main app layout
│   ├── Header.tsx          # Header with logo
│   ├── Navigation.tsx      # Tab navigation
│   └── Footer.tsx          # App footer
├── modules/                # Feature modules
│   └── Home/
│       ├── gallery/        # Gallery feature module
│       │   ├── Gallery.tsx
│       │   ├── CatImageCard.tsx
│       │   └── MasonryCatImageCard.tsx
│       ├── my-votes/       # Vote history module
│       │   ├── MyVotes.tsx
│       │   └── VotedImageCard.tsx
│       └── voting/         # Voting module
│           └── VotingButton.tsx
├── pages/                  # Page components
│   └── HomePage.tsx        # Main page
├── providers/              # React providers
│   ├── QueryClientProvider.tsx
│   └── index.tsx
├── queries/                # React Query hooks
│   ├── useImages.ts        # Images fetch hook
│   └── useVotes.ts         # Vote operations hook
├── services/               # API services
│   └── catApi.ts           # TheCatAPI client
├── store/                  # State management
│   └── uiStore.ts          # Zustand store for UI state
├── types/                  # TypeScript types
│   └── cat.types.ts        # Cat data types
└── utils/                  # Utility functions
    ├── error-handler.ts    # Error handling
    ├── performance.ts      # Performance utilities
    └── subId.ts            # User ID generation
```

### Tech Stack

**Core:**
- **React 18** - Latest React with concurrent features
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool with HMR

**State Management:**
- **TanStack Query** - Server state management with intelligent caching
- **Zustand** - Lightweight client state management

**Styling:**
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Accessible UI components

**Performance:**
- **React.memo** - Memoization to prevent unnecessary re-renders
- **Lazy Loading** - Lazy load images with Intersection Observer
- **Debouncing** - Reduce unnecessary API calls
- **Query Caching** - Intelligent data caching

**Developer Tools:**
- **ESLint + Prettier** - Code quality and formatting
- **Vitest** - Unit testing framework
- **React Query Devtools** - Debug React Query

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- API key from [TheCatAPI](https://thecatapi.com) (free)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repo-url>
   cd cat-voting-fe-challenge
   npm install
   ```

2. **Environment setup**
   Create `.env` file:
   ```env
   VITE_CAT_API_KEY=your_api_key_here
   VITE_CAT_API_BASE_URL=https://api.thecatapi.com/v1
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

## 🎯 Detailed Features

### 📸 Gallery (Photo Library)
- Display random cat photos from TheCatAPI
- Responsive masonry grid layout
- Lazy loading images for performance optimization
- Loading states and error handling

### 👍👎 Voting System
- Vote up/down for each image
- Optimistic updates for smooth UX
- Debouncing to prevent double-clicks
- Store votes with persistent storage

### 📊 My Votes (Voting History)
- Display all voted images
- Sort by voting time
- Show vote type (up/down)
- Empty state when no votes

### 🌙 Dark Mode
- Auto-detect system preference
- Manual toggle with persistence
- Smooth transitions
- All components support both themes

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Coverage report
```

## 🧪 Testing

### Test Structure
```
src/
├── hooks/__tests__/        # Tests for custom hooks
├── utils/__tests__/        # Tests for utilities
└── components/__tests__/   # Tests for components (if any)
```

### Running Tests
```bash
npm run test              # Run all tests
npm run test -- --watch  # Watch mode
npm run test:coverage     # View coverage
```

## 🚀 Deployment

Detailed deployment instructions available in [DEPLOYMENT.md](DEPLOYMENT.md)

### Supported Platforms:
- **Netlify** (Recommended)
- **Vercel**
- **GitHub Pages**

### Environment variables for production:
```env
VITE_CAT_API_KEY=your_production_api_key
VITE_CAT_API_BASE_URL=https://api.thecatapi.com/v1
```

## 📈 Performance Optimizations

### React Query Features
- Smart caching with stale time
- Automatic retries for failed requests
- Optimistic updates for voting
- Background refetching

### Component Optimizations
- `React.memo` to prevent unnecessary re-renders
- `useMemo` for expensive computations
- `useCallback` for stable references
- Lazy image loading with Intersection Observer

### Custom Hooks
```typescript
// Debounce hook
const debouncedValue = useDebounce(value, 300);

// Lazy image loading
const { imgRef, src, isLoaded } = useLazyImage(imageUrl);

// Dark mode
const { isDark, toggle } = useDarkMode();
```

## 💾 Data Management

### Local Storage
- User sub_id (unique identifier)
- Dark mode preference
- Cached vote data

### API Integration
```typescript
// Fetch random images
const { data: images, isLoading } = useImages();

// Create vote
const createVoteMutation = useCreateVote();

// Get user votes
const { data: userVotes } = useUserVotes();
```

## 🛡️ Error Handling

- Global error boundary
- API error handling with retry logic
- User-friendly error messages
- Toast notifications for feedback

## ♿ Accessibility

- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Follow existing code style
4. Add tests for new functionality
5. Update documentation
6. Create pull request

### Code Standards
- Use TypeScript strict mode
- Follow feature-based organization
- Add proper error handling
- Write comprehensive tests
- Document complex logic

## 📄 License

MIT License

## 🙏 Acknowledgments

- [TheCatAPI](https://thecatapi.com) - Cat images API
- [TanStack Query](https://tanstack.com/query) - Data synchronization
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Headless UI](https://headlessui.com) - Accessible components
- [Zustand](https://github.com/pmndrs/zustand) - State management

---

**Built with ❤️ and modern React patterns** 🐾