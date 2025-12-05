# Medussa Project Guide - Complete File-by-File Breakdown

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [File-by-File Explanation](#file-by-file-explanation)
3. [Architecture Summary](#architecture-summary)
4. [Simple Explanation](#simple-explanation)
5. [Data Flow Diagram](#data-flow-diagram)
6. [Neynar MiniApp Structure](#neynar-miniapp-structure)
7. [What NOT to Modify](#what-not-to-modify)
8. [Key Files You'll Work With](#key-files-youll-work-with)

---

## 🎯 Project Overview

**Medussa** is a Farcaster MiniApp built with Next.js. Think of it as a small app that runs inside Farcaster (a social network for crypto). It's like a mini-game or mini-application that users can access directly from their Farcaster feed.

**Tech Stack:**
- **Next.js 15** - React framework for building web apps
- **TypeScript** - Adds type safety to JavaScript
- **Neynar SDK** - Tools for interacting with Farcaster
- **Wagmi** - Ethereum wallet connections
- **Solana** - Solana blockchain support
- **Tailwind CSS** - Styling

---

## 📁 File-by-File Explanation

### 🗂️ Root Configuration Files

#### `package.json`
**Purpose:** Lists all the project dependencies and scripts.

**Role:** The "shopping list" of your project. It tells npm/pnpm what packages to install and what commands you can run (like `npm run dev`).

**Key Scripts:**
- `dev` - Starts development server
- `build` - Creates production version
- `deploy:vercel` - Deploys to Vercel hosting

**Connections:** Every file depends on packages listed here.

---

#### `tsconfig.json`
**Purpose:** TypeScript configuration - tells TypeScript how to compile your code.

**Role:** The "rules" for TypeScript. Defines things like:
- Where to find files (`paths: { "~/*": ["./src/*"] }`)
- What version of JavaScript to target
- How strict to be with type checking

**Connections:** All `.ts` and `.tsx` files follow these rules.

---

#### `next.config.ts`
**Purpose:** Next.js configuration file.

**Role:** Currently empty/default. You'd add custom Next.js settings here if needed (like redirects, image optimization, etc.).

**Connections:** Affects how Next.js builds and serves your app.

---

#### `tailwind.config.ts`
**Purpose:** Tailwind CSS theme configuration.

**Role:** Defines your app's color scheme and design tokens. The `primary` color (`#8b5cf6` - purple) is your main brand color. Change this to change the whole app's color scheme.

**Key Colors:**
- `primary`: `#8b5cf6` (purple) - Main brand color
- `primary-light`: `#a78bfa` - Lighter purple for hovers
- `primary-dark`: `#7c3aed` - Darker purple for active states

**Connections:** All components use these colors via Tailwind classes like `bg-primary`, `text-primary`.

---

#### `vercel.json`
**Purpose:** Vercel deployment configuration.

**Role:** Tells Vercel how to build and deploy your app. Simple config that says "use Next.js framework".

**Connections:** Only used during deployment to Vercel.

---

### 📂 `src/app/` - Next.js App Router Files

#### `layout.tsx`
**Purpose:** The root layout wrapper for your entire app.

**Role:** Like the "frame" of a picture - wraps every page. It:
- Sets up HTML structure (`<html>`, `<body>`)
- Imports global CSS
- Wraps everything in `<Providers>` component

**Key Functions:**
- Sets page title and description (metadata)
- Provides the base HTML structure

**Connections:** 
- Wraps `page.tsx` and all other pages
- Uses `providers.tsx` to wrap children
- Imports `globals.css` for styling

---

#### `page.tsx`
**Purpose:** The home page of your app.

**Role:** The "front door" of your app. When someone visits your URL, this is what they see.

**Key Functions:**
- Generates metadata (title, description, Open Graph image)
- Renders the `<App />` component
- Sets up the MiniApp embed metadata (so Farcaster knows how to display it)

**Connections:**
- Uses `App` component from `app.tsx`
- Uses constants from `lib/constants.ts`
- Uses utilities from `lib/utils.ts`

---

#### `app.tsx`
**Purpose:** Client-side wrapper for the main App component.

**Role:** A thin wrapper that dynamically imports the actual `App` component. Uses `dynamic` import because the App component uses Farcaster SDK which only works in the browser.

**Key Functions:**
- Dynamically loads `App` component (no server-side rendering)
- Passes title prop

**Connections:**
- Imports `App` from `components/App.tsx`
- Used by `page.tsx`

---

#### `providers.tsx`
**Purpose:** Sets up all the React context providers.

**Role:** Like a "power strip" - plugs in all the different services your app needs:
1. **WagmiProvider** - Ethereum wallet connections
2. **MiniAppProvider** - Neynar's Farcaster integration
3. **SafeFarcasterSolanaProvider** - Solana wallet support

**Key Functions:**
- Wraps app in multiple providers (like Russian nesting dolls)
- Configures analytics, back button, return URL
- Sets up Solana RPC endpoint

**Connections:**
- Used by `layout.tsx` to wrap the entire app
- Provides context to all child components via hooks like `useMiniApp()`, `useAccount()`

---

#### `globals.css`
**Purpose:** Global CSS styles and design system.

**Role:** The "style guide" for your entire app. Defines:
- CSS variables for colors
- Reusable component classes (`.btn`, `.card`, `.input`)
- Dark mode support
- Scrollbar hiding

**Key Classes:**
- `.btn`, `.btn-primary` - Button styles
- `.card` - Card container styles
- `.input` - Form input styles
- `.spinner` - Loading spinner

**Connections:** Imported by `layout.tsx`, used by all components.

**⚠️ Note:** The file says "DO NOT EDIT UNLESS NECESSARY" - use Tailwind classes in components instead.

---

#### `.well-known/farcaster.json/route.ts`
**Purpose:** Serves the Farcaster manifest file.

**Role:** Like a "business card" for your MiniApp. When Farcaster wants to know about your app, it checks this file. It tells Farcaster:
- Your app's name, description, icon
- Where your app lives (URL)
- What it looks like (splash screen, button text)

**Key Functions:**
- Returns JSON manifest with app metadata
- Used by Farcaster clients to display your app

**Connections:**
- Uses `getFarcasterDomainManifest()` from `lib/utils.ts`
- Accessed at `/.well-known/farcaster.json`

---

#### `share/[fid]/page.tsx`
**Purpose:** Dynamic share page for specific users.

**Role:** When someone shares your app with a user ID (FID), this page generates a custom share page. Currently just redirects to home, but could show user-specific content.

**Key Functions:**
- Generates metadata with user-specific Open Graph image
- Creates shareable URLs like `/share/123` for user with FID 123

**Connections:**
- Uses `opengraph-image` API route for images
- Redirects to home page

---

### 📂 `src/app/api/` - API Routes (Backend)

#### `auth/nonce/route.ts`
**Purpose:** Generates a nonce (random number) for authentication.

**Role:** Security helper. When users want to sign in, they need a random number (nonce) to sign. This endpoint provides that.

**Key Functions:**
- Calls Neynar API to get a nonce
- Returns it to the frontend

**Connections:**
- Used by authentication flows
- Calls `getNeynarClient()` from `lib/neynar.ts`

---

#### `auth/validate/route.ts`
**Purpose:** Validates QuickAuth tokens.

**Role:** Security checkpoint. When a user signs in with QuickAuth, this checks if their token is valid.

**Key Functions:**
- Validates JWT tokens from QuickAuth
- Returns user data if valid

**Connections:**
- Used by `useQuickAuth` hook
- Validates tokens from Farcaster SDK

---

#### `auth/signer/route.ts` & Related Auth Routes
**Purpose:** Handle Farcaster signer creation and management.

**Role:** These routes handle the complex Farcaster authentication flow:
- Creating signers (keys for signing messages)
- Managing signed keys
- Handling session signers

**Connections:**
- Used by wallet connection flows
- Part of Farcaster authentication system

---

#### `users/route.ts`
**Purpose:** Fetches user data from Neynar API.

**Role:** Backend proxy to get user information. Takes FIDs (user IDs) and returns user data.

**Key Functions:**
- Accepts comma-separated FIDs as query parameter
- Calls Neynar API to fetch user data
- Returns user objects

**Connections:**
- Used by `useNeynarUser` hook
- Calls Neynar API via `lib/neynar.ts`

---

#### `best-friends/route.ts`
**Purpose:** Gets a user's "best friends" (most interacted with users).

**Role:** Social feature - shows who a user interacts with most on Farcaster.

**Key Functions:**
- Takes FID as query parameter
- Calls Neynar API for best friends
- Returns top 3 best friends

**Connections:**
- Used by share functionality
- Calls Neynar API directly

---

#### `webhook/route.ts`
**Purpose:** Receives events from Farcaster.

**Role:** Like a "mailbox" for Farcaster events. When users add/remove your app or enable notifications, Farcaster sends events here.

**Key Functions:**
- Handles `miniapp_added` - user added your app
- Handles `miniapp_removed` - user removed your app
- Handles `notifications_enabled/disabled` - user toggled notifications
- Stores notification details in KV storage

**Connections:**
- Uses `lib/kv.ts` to store notification details
- Uses `lib/notifs.ts` to send notifications
- Called by Farcaster when events occur

---

#### `send-notification/route.ts`
**Purpose:** Sends push notifications to users.

**Role:** Notification service. When you want to notify a user, this endpoint handles it.

**Key Functions:**
- Validates notification request
- Stores notification details (if not using Neynar)
- Sends notification via Neynar API or direct Farcaster API

**Connections:**
- Uses `lib/kv.ts` for storage
- Uses `lib/neynar.ts` or `lib/notifs.ts` to send
- Called by `ActionsTab` component

---

#### `opengraph-image/route.tsx`
**Purpose:** Generates Open Graph images for social sharing.

**Role:** Creates preview images when your app is shared on social media. These are the images you see in link previews.

**Key Functions:**
- Generates dynamic images based on query params
- Returns image that shows in social media previews

**Connections:**
- Used by `page.tsx` and `share/[fid]/page.tsx` for metadata
- Creates share preview images

---

### 📂 `src/components/` - React Components

#### `App.tsx`
**Purpose:** The main app component - orchestrates everything.

**Role:** The "conductor" of your app. It:
- Manages tab navigation (Home, Actions, Context, Wallet)
- Handles Farcaster context
- Renders the appropriate tab content
- Shows loading states

**Key Functions:**
- Tab state management
- SDK loading check
- User data fetching
- Safe area insets (for mobile)

**Connections:**
- Uses `useMiniApp()` hook from Neynar
- Uses `useNeynarUser()` hook
- Renders `Header`, `Footer`, and tab components
- Manages all tab state

---

#### `providers/WagmiProvider.tsx`
**Purpose:** Sets up Ethereum wallet connections.

**Role:** The "wallet manager" for Ethereum. Configures:
- Supported chains (Base, Optimism, Mainnet, Degen, Unichain, Celo)
- Wallet connectors (Farcaster Frame, Coinbase Wallet, MetaMask)
- Auto-connection logic

**Key Functions:**
- Creates Wagmi config with chains and connectors
- Sets up React Query for data fetching
- Auto-connects Coinbase Wallet if detected

**Connections:**
- Used by `providers.tsx`
- Provides `useAccount()`, `useConnect()`, etc. hooks to all components

---

#### `providers/SafeFarcasterSolanaProvider.tsx`
**Purpose:** Safely sets up Solana wallet support.

**Role:** The "Solana wallet manager". Only loads Solana provider if it's available (not all Farcaster clients support Solana).

**Key Functions:**
- Checks if Solana provider exists
- Only wraps children if Solana is available
- Prevents errors if Solana isn't supported

**Connections:**
- Used by `providers.tsx`
- Provides Solana wallet context to components

---

#### `ui/Header.tsx`
**Purpose:** Top navigation bar.

**Role:** The "header" of your app. Shows:
- App name
- User profile picture (if logged in)
- User dropdown with profile info

**Key Functions:**
- Displays welcome message
- Shows user avatar
- Dropdown with user details (FID, username, Neynar score)

**Connections:**
- Receives `neynarUser` prop from `App.tsx`
- Uses `useMiniApp()` for context
- Uses Farcaster SDK for profile viewing

---

#### `ui/Footer.tsx`
**Purpose:** Bottom navigation bar with tabs.

**Role:** The "navigation bar" at the bottom. Shows tabs:
- 🏠 Home
- ⚡ Actions
- 📋 Context
- 👛 Wallet (if enabled)

**Key Functions:**
- Tab switching
- Visual indication of active tab
- Conditional wallet tab display

**Connections:**
- Receives `activeTab` and `setActiveTab` from `App.tsx`
- Controls tab navigation

---

#### `ui/tabs/HomeTab.tsx`
**Purpose:** The home/default tab content.

**Role:** The "landing page" tab. Currently shows placeholder content.

**Key Functions:**
- Displays welcome message
- Placeholder for your content

**Connections:**
- Rendered by `App.tsx` when Home tab is active
- This is where you'd put your main app content!

---

#### `ui/tabs/ActionsTab.tsx`
**Purpose:** Tab with interactive actions.

**Role:** The "actions playground". Shows:
- Share button (share app to Farcaster)
- Sign in button
- Open link button
- Add mini app button
- Send notification button
- Copy share URL
- Haptic feedback controls

**Key Functions:**
- Share functionality
- Notification sending
- Haptic feedback
- URL copying

**Connections:**
- Uses `useMiniApp()` for actions
- Calls `/api/send-notification` endpoint
- Uses `ShareButton` and `SignIn` components

---

#### `ui/tabs/ContextTab.tsx`
**Purpose:** Developer/debugging tab.

**Role:** The "developer tools" tab. Shows the raw Farcaster context data in JSON format.

**Key Functions:**
- Displays full context object
- Useful for debugging
- Shows what data is available

**Connections:**
- Uses `useMiniApp()` to get context
- Pure display component

---

#### `ui/tabs/WalletTab.tsx`
**Purpose:** Wallet management tab.

**Role:** The "wallet playground". Shows:
- Wallet connection/disconnection
- EVM message signing
- EVM transactions
- Chain switching
- Solana message signing
- Solana transactions

**Key Functions:**
- Wallet connection management
- Transaction sending
- Message signing (EVM and Solana)
- Chain switching
- Auto-connection in Farcaster clients

**Connections:**
- Uses Wagmi hooks (`useAccount`, `useConnect`, etc.)
- Uses Solana wallet hooks
- Renders wallet sub-components

---

#### `ui/wallet/` Components
**Purpose:** Wallet-specific UI components.

**Components:**
- `SignIn.tsx` - QuickAuth sign-in button
- `SignEvmMessage.tsx` - Sign Ethereum messages
- `SendEth.tsx` - Send ETH transactions
- `SignSolanaMessage.tsx` - Sign Solana messages
- `SendSolana.tsx` - Send SOL transactions

**Role:** Reusable wallet interaction components.

**Connections:**
- Used by `WalletTab.tsx`
- Use Wagmi/Solana hooks

---

#### `ui/Button.tsx`, `input.tsx`, `label.tsx`
**Purpose:** Reusable UI components.

**Role:** Basic building blocks for forms and interactions.

**Connections:**
- Used throughout the app
- Styled with Tailwind

---

#### `ui/Share.tsx`
**Purpose:** Share button component.

**Role:** Allows users to share the app to Farcaster with a cast.

**Key Functions:**
- Opens Farcaster share dialog
- Includes best friends mentions
- Adds embed URL

**Connections:**
- Used by `ActionsTab.tsx`
- Uses Farcaster SDK actions

---

### 📂 `src/lib/` - Utility Libraries

#### `constants.ts`
**Purpose:** All app configuration constants.

**Role:** The "settings file". Contains:
- App name, description, URLs
- Asset URLs (icon, splash, OG image)
- Feature flags (USE_WALLET, ANALYTICS_ENABLED)
- Webhook URLs
- Chain requirements

**Key Constants:**
- `APP_NAME`: "Medussa"
- `APP_URL`: Your app's URL
- `USE_WALLET`: Enable/disable wallet features
- `ANALYTICS_ENABLED`: Enable/disable analytics

**Connections:**
- Used by almost every file
- Central configuration point

**⚠️ Note:** File says it's auto-updated by init script, but you can modify values.

---

#### `utils.ts`
**Purpose:** General utility functions.

**Role:** Helper functions used throughout the app.

**Key Functions:**
- `cn()` - Combines CSS class names (uses clsx + tailwind-merge)
- `getMiniAppEmbedMetadata()` - Creates metadata for Farcaster embeds
- `getFarcasterDomainManifest()` - Creates manifest JSON

**Connections:**
- Used by `page.tsx` for metadata
- Used by `.well-known/farcaster.json` route
- `cn()` used everywhere for styling

---

#### `neynar.ts`
**Purpose:** Neynar API client wrapper.

**Role:** The "Neynar helper". Provides:
- Singleton Neynar client (reuses connection)
- User fetching functions
- Notification sending

**Key Functions:**
- `getNeynarClient()` - Gets or creates Neynar API client
- `getNeynarUser()` - Fetches user by FID
- `sendNeynarMiniAppNotification()` - Sends notifications via Neynar

**Connections:**
- Used by API routes (`/api/users`, `/api/send-notification`)
- Uses `NEYNAR_API_KEY` environment variable

---

#### `kv.ts`
**Purpose:** Key-value storage abstraction.

**Role:** The "database helper". Stores user notification details.

**Key Functions:**
- `getUserNotificationDetails()` - Gets notification details for user
- `setUserNotificationDetails()` - Saves notification details
- `deleteUserNotificationDetails()` - Removes notification details

**Storage:**
- Uses Redis (Upstash) if `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set
- Falls back to in-memory Map if Redis not configured

**Connections:**
- Used by `webhook/route.ts` to store notification details
- Used by `send-notification/route.ts` to retrieve details

---

#### `notifs.ts`
**Purpose:** Direct Farcaster notification sending.

**Role:** Alternative notification sender (when not using Neynar).

**Key Functions:**
- `sendMiniAppNotification()` - Sends notification directly to Farcaster API
- Handles rate limiting
- Returns success/error states

**Connections:**
- Used by `send-notification/route.ts` when Neynar is disabled
- Uses notification details from `kv.ts`

---

#### `errorUtils.tsx`
**Purpose:** Error rendering utility.

**Role:** The "error display helper". Formats errors nicely for users.

**Key Functions:**
- `renderError()` - Renders error as React component
- Special handling for user rejections (wallet rejections)
- Formats different error types

**Connections:**
- Used by wallet components to show errors
- Used throughout app for error display

---

#### `truncateAddress.ts`
**Purpose:** Shortens crypto addresses.

**Role:** Display helper. Converts `0x1234...5678` format for addresses.

**Connections:**
- Used by `WalletTab.tsx` to display addresses

---

#### `localStorage.ts` & `devices.ts`
**Purpose:** Browser storage and device detection utilities.

**Role:** Helper functions for client-side storage and device info.

---

### 📂 `src/hooks/` - Custom React Hooks

#### `useNeynarUser.ts`
**Purpose:** Fetches Neynar user data.

**Role:** React hook that fetches user information from your API.

**Key Functions:**
- Takes Farcaster context
- Fetches user data from `/api/users`
- Returns user, loading, and error states

**Connections:**
- Used by `App.tsx` to get user data
- Calls `/api/users` endpoint

---

#### `useQuickAuth.ts`
**Purpose:** QuickAuth authentication hook.

**Role:** Manages QuickAuth sign-in/sign-out flow.

**Key Functions:**
- `signIn()` - Initiates QuickAuth sign-in
- `signOut()` - Signs out user
- `getToken()` - Gets current auth token
- Auto-validates tokens on mount

**Connections:**
- Uses Farcaster SDK `sdk.quickAuth`
- Validates tokens via `/api/auth/validate`
- Used by `SignIn` component

---

#### `useDetectClickOutside.ts`
**Purpose:** Detects clicks outside an element.

**Role:** UI helper for dropdowns/modals. Closes them when clicking outside.

**Connections:**
- Used by components with dropdowns

---

### 📂 `scripts/` - Build & Development Scripts

#### `dev.js`
**Purpose:** Development server startup script.

**Role:** Enhanced dev server that:
- Checks if port is available
- Kills processes on port if needed
- Sets up environment variables
- Provides helpful ngrok instructions

**Key Functions:**
- Port checking and cleanup
- Starts Next.js dev server
- Handles graceful shutdown

**Connections:**
- Called by `npm run dev`
- Starts Next.js development server

---

#### `deploy.ts`
**Purpose:** Vercel deployment script.

**Role:** Automated deployment helper.

**Connections:**
- Called by `npm run deploy:vercel`

---

#### `cleanup.js`
**Purpose:** Cleans up processes on ports.

**Role:** Kills processes that might be blocking your dev server.

**Connections:**
- Called by `npm run cleanup`

---

### 📂 `public/` - Static Assets

#### `icon.png`
**Purpose:** App icon.

**Role:** The icon shown in Farcaster app listings.

**Connections:**
- Referenced in `constants.ts` as `APP_ICON_URL`
- Used in manifest

---

#### `splash.png`
**Purpose:** Splash screen image.

**Role:** Image shown while app is loading.

**Connections:**
- Referenced in `constants.ts` as `APP_SPLASH_URL`
- Used in manifest

---

## 🏗️ Architecture Summary

### High-Level Flow

```
User Opens Farcaster Client
    ↓
Farcaster Loads MiniApp (reads manifest from /.well-known/farcaster.json)
    ↓
Next.js Serves page.tsx
    ↓
page.tsx → app.tsx → App.tsx (main component)
    ↓
App.tsx Wrapped in Providers (Wagmi, Neynar, Solana)
    ↓
App.tsx Renders:
  - Header (user info)
  - Tab Content (Home/Actions/Context/Wallet)
  - Footer (navigation)
    ↓
User Interacts:
  - Tabs switch content
  - Actions trigger API calls
  - Wallet connects via Wagmi/Solana
  - Notifications sent via API
```

### Component Hierarchy

```
RootLayout (layout.tsx)
  └─ Providers (providers.tsx)
      ├─ WagmiProvider (Ethereum wallets)
      ├─ MiniAppProvider (Farcaster SDK)
      └─ SafeFarcasterSolanaProvider (Solana wallets)
          └─ App (components/App.tsx)
              ├─ Header
              ├─ Tab Content (Home/Actions/Context/Wallet)
              └─ Footer
```

### Data Flow

1. **User Authentication:**
   - Farcaster provides context → `useMiniApp()` hook
   - QuickAuth → `useQuickAuth()` → `/api/auth/validate`
   - User data → `useNeynarUser()` → `/api/users` → Neynar API

2. **Wallet Connection:**
   - User clicks connect → Wagmi connector → Wallet extension
   - Connection state → `useAccount()` hook → Components

3. **Notifications:**
   - User enables notifications → Webhook → `/api/webhook` → Store in KV
   - Send notification → `/api/send-notification` → Neynar API or Farcaster API

4. **Sharing:**
   - User shares → Farcaster SDK → Creates cast with embed
   - Share URL → `/share/[fid]` → Generates preview

---

## 🎓 Simple Explanation (For Your Grandfather)

Imagine Farcaster is like a **smartphone**, and your MiniApp is like an **app** on that phone.

**The Structure:**
- **Next.js** is like the **operating system** - it runs everything
- **Neynar** is like the **app store** - it helps your app work with Farcaster
- **Wagmi** is like a **wallet app** - it connects to crypto wallets
- **Components** are like **screens** in your app - each one shows different things

**How It Works:**
1. Someone opens Farcaster (the phone)
2. They find your MiniApp (your app)
3. Farcaster loads your app and shows it to them
4. They can interact with it - click buttons, connect wallets, share it
5. Your app talks to Farcaster's servers to do things like send notifications

**The Files:**
- **Configuration files** = Settings for your app
- **Components** = The visual parts (buttons, screens, etc.)
- **API routes** = The "back office" that does work behind the scenes
- **Libraries** = Helper tools that make things easier

It's like a restaurant:
- **Components** = The dining room (what customers see)
- **API routes** = The kitchen (where work happens)
- **Libraries** = The recipes (instructions for how to do things)

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  Farcaster      │
│  Client         │
└────────┬────────┘
         │
         │ Loads Manifest
         ▼
┌─────────────────┐
│ /.well-known/   │
│ farcaster.json  │
└────────┬────────┘
         │
         │ Serves App
         ▼
┌─────────────────┐      ┌──────────────┐
│   page.tsx      │─────▶│  app.tsx     │
│  (Home Page)    │      │  (Wrapper)   │
└────────┬────────┘      └──────┬───────┘
         │                      │
         │                      ▼
         │              ┌──────────────┐
         │              │  App.tsx     │
         │              │ (Main Logic) │
         │              └──────┬───────┘
         │                     │
         │        ┌────────────┼────────────┐
         │        │            │            │
         ▼        ▼            ▼            ▼
    ┌────────┐ ┌──────┐  ┌─────────┐ ┌────────┐
    │ Header │ │Home  │  │ Actions │ │ Wallet │
    │        │ │ Tab  │  │   Tab   │ │  Tab   │
    └────────┘ └──────┘  └────┬────┘ └───┬────┘
                              │          │
                              │          │ API Calls
                              ▼          ▼
                    ┌─────────────────────────┐
                    │   API Routes           │
                    │  /api/users            │
                    │  /api/send-notification│
                    │  /api/webhook          │
                    └───────────┬─────────────┘
                                │
                                │ External APIs
                                ▼
                    ┌─────────────────────────┐
                    │   Neynar API           │
                    │   Farcaster API        │
                    │   Blockchain APIs      │
                    └─────────────────────────┘
```

---

## 🔧 Neynar MiniApp Structure Explained

### 1. **Providers** (`providers.tsx`)
**What:** React context providers that give your app access to Farcaster features.

**Why:** They wrap your app and provide "superpowers" like:
- Access to user data
- Wallet connections
- Farcaster actions (share, open URL, etc.)

**Think of it as:** Plugging your app into Farcaster's power outlet.

---

### 2. **Manifests** (`.well-known/farcaster.json`)
**What:** A JSON file that describes your app to Farcaster.

**Why:** Farcaster reads this to know:
- What your app is called
- What it looks like (icon, splash screen)
- Where it lives (URL)
- How to display it

**Think of it as:** Your app's business card for Farcaster.

---

### 3. **API Routes** (`src/app/api/`)
**What:** Backend endpoints that handle server-side work.

**Why:** Some things must happen on the server:
- Validating authentication tokens
- Calling external APIs (Neynar, Farcaster)
- Storing data securely
- Sending notifications

**Think of it as:** The kitchen of your restaurant - customers don't see it, but it's where the work happens.

---

### 4. **Hooks** (`src/hooks/`)
**What:** Custom React hooks that encapsulate logic.

**Why:** Reusable pieces of functionality:
- `useNeynarUser` - Fetch user data
- `useQuickAuth` - Handle authentication
- `useMiniApp` - Access Farcaster context (from Neynar SDK)

**Think of it as:** Pre-made tools you can use anywhere.

---

### 5. **Client/Server Pieces**

**Client Components** (`"use client"`):
- Run in the browser
- Can use hooks, interact with users
- Examples: `App.tsx`, `Header.tsx`, all tabs

**Server Components** (default):
- Run on the server
- Can't use browser APIs
- Examples: `layout.tsx`, `page.tsx`, API routes

**Why the split:**
- Server components = Faster initial load, SEO-friendly
- Client components = Interactive, can use browser APIs

**Think of it as:**
- Server = Pre-cooked food (ready immediately)
- Client = Made-to-order (interactive)

---

## ⚠️ What NOT to Modify (As a Beginner)

### 🚫 **DO NOT TOUCH:**

1. **`src/app/globals.css`** - The design system. Use Tailwind classes instead.

2. **`src/lib/constants.ts`** - The `SIGNED_KEY_REQUEST_*` constants at the bottom. These are required by Farcaster.

3. **`src/components/providers/`** - The provider setup is complex. Only modify if you know what you're doing.

4. **`scripts/`** - Build scripts. Only modify if you understand the build process.

5. **`next.config.ts`**, `tsconfig.json` - Configuration files. Modify only if you need specific settings.

6. **`.well-known/farcaster.json/route.ts`** - The manifest structure is required by Farcaster. Don't change the structure, only the values.

7. **`package.json` dependencies** - Don't remove Neynar/Farcaster dependencies. You can add new ones, but be careful.

### ✅ **SAFE TO MODIFY:**

1. **`src/components/ui/tabs/HomeTab.tsx`** - Put your main content here!
2. **`src/lib/constants.ts`** - App name, description, URLs (except the signed key constants)
3. **`tailwind.config.ts`** - Colors and theme
4. **`src/components/ui/Header.tsx`** - Header content
5. **`src/components/ui/Footer.tsx`** - Footer/navigation
6. **`src/app/api/`** - Add new API routes for your features
7. **`public/icon.png`, `public/splash.png`** - Your app assets

---

## 🎯 Key Files You'll Work With Most Often

### 🏠 **Main Content:**
1. **`src/components/ui/tabs/HomeTab.tsx`** - Your main app content goes here
2. **`src/components/App.tsx`** - Main app logic and tab management

### 🎨 **Styling:**
3. **`tailwind.config.ts`** - Change colors and theme
4. **`src/app/globals.css`** - Global styles (use sparingly)

### ⚙️ **Configuration:**
5. **`src/lib/constants.ts`** - App name, URLs, feature flags
6. **`.env.local`** - Environment variables (API keys, etc.)

### 🔌 **Adding Features:**
7. **`src/app/api/`** - Create new API routes here
8. **`src/components/ui/`** - Create new UI components here
9. **`src/hooks/`** - Create custom hooks here

### 📱 **User Interface:**
10. **`src/components/ui/Header.tsx`** - Top bar
11. **`src/components/ui/Footer.tsx`** - Bottom navigation
12. **`src/components/ui/tabs/ActionsTab.tsx`** - Action buttons

### 🔐 **Authentication:**
13. **`src/hooks/useQuickAuth.ts`** - QuickAuth logic
14. **`src/app/api/auth/validate/route.ts`** - Token validation

### 💰 **Wallet:**
15. **`src/components/ui/tabs/WalletTab.tsx`** - Wallet UI
16. **`src/components/providers/WagmiProvider.tsx`** - Wallet config

---

## 🚀 Quick Start Guide

1. **Change App Name:**
   - Edit `src/lib/constants.ts` → `APP_NAME`

2. **Add Your Content:**
   - Edit `src/components/ui/tabs/HomeTab.tsx`

3. **Change Colors:**
   - Edit `tailwind.config.ts` → `primary` color

4. **Add New Tab:**
   - Create component in `src/components/ui/tabs/`
   - Add to `App.tsx` Tab enum and rendering logic
   - Add button to `Footer.tsx`

5. **Add API Endpoint:**
   - Create file in `src/app/api/your-endpoint/route.ts`
   - Export `GET`, `POST`, etc. functions

6. **Add New Component:**
   - Create in `src/components/ui/`
   - Import and use in your tabs

---

## 📚 Additional Resources

- **Neynar Docs:** https://docs.neynar.com
- **Next.js Docs:** https://nextjs.org/docs
- **Farcaster MiniApps:** https://docs.farcaster.xyz/miniapps
- **Wagmi Docs:** https://wagmi.sh

---

## 🎉 Summary

You now understand:
- ✅ What every file does
- ✅ How the pieces connect
- ✅ The overall architecture
- ✅ What to modify and what to avoid
- ✅ Where to add your features

**Your main workspace will be:**
- `src/components/ui/tabs/HomeTab.tsx` - For your app content
- `src/lib/constants.ts` - For configuration
- `src/app/api/` - For backend features

Happy building! 🚀

