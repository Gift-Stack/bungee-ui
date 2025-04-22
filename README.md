# Bungee Single-Chain Swap with EIP-5792 Smart Wallet Support

A minimal web application demonstrating token swaps (USDC to ETH) on Arbitrum using Socket APIs, with special support for Safe wallets and EIP-5792 batching capabilities.

## Features

- 🔄 Single-chain swaps from USDC to ETH on Arbitrum
- 👛 Support for both EOA and Safe smart wallets
- 🔐 EIP-5792 compliant transaction batching
- 💰 Real-time price quotes and gas estimates
- 📊 Transaction status tracking with signature collection progress
- 🎨 Clean, minimal UI focused on functionality

## Prerequisites

Before you begin, ensure you have:

- Node.js 18.x or later
- Yarn package manager
- A wallet with some Arbitrum ETH for gas fees
- A Safe wallet (optional, for testing smart wallet features)

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_SOCKET_API_KEY=your_socket_api_key
```

## Installation

1. Clone the repository:

```bash
git clone git@github.com:Gift-Stack/bungee-ui.git
cd bungee-ui
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development server:

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

### Test Scenarios

1. **EOA Wallet Flow**

   - Connect an EOA wallet
   - Enter USDC amount
   - Approve USDC spending (if first time)
   - Complete swap

2. **Safe Wallet Flow**
   - Connect a Safe wallet
   - Enter USDC amount
   - Approve and swap in a single transaction
   - Monitor signature collection progress

### Test Accounts

For testing, you'll need:

- USDC on Arbitrum: `0xaf88d065e77c8cC2239327C5EDb3A432268e5831`
- Some ETH on Arbitrum for gas fees

## Key Implementation Decisions

### 1. Wallet Integration

- Used RainbowKit for wallet connection due to its built-in Safe wallet support
- Implemented `useCapabilities` hook to detect Safe wallet features
- Configured for Arbitrum network only to keep the UI focused

### 2. Transaction Batching (EIP-5792)

- Implemented automatic detection of Safe wallets using `useCapabilities`
- For Safe wallets: Batch approval and swap transactions using `sendCallsAsync`
- For EOA wallets: Handle approval and swap sequentially
- Used atomic transactions for Safe wallets to ensure both operations succeed or fail together

### 3. State Management

- Used React Query for data fetching and caching
- Implemented custom hooks for swap-related operations:
  - `useQuote`: Fetches and manages price quotes
  - `usePrepareSwap`: Prepares transaction data
  - `useSwap`: Handles the swap execution
  - `useApprove`: Manages token approvals

### 4. Error Handling

- Implemented comprehensive error handling for:
  - Network issues
  - User rejections
  - Insufficient funds
  - Failed transactions
- Added retry mechanism for failed network requests

### 5. UI/UX Decisions

- Minimal interface focused on core functionality
- Real-time price updates with debouncing
- Clear transaction status indicators
- Signature collection progress for Safe wallets

## Project Structure

```
src/
├── actions/ # API interactions and external calls
├── components/ # React components
├── hooks/ # Custom React hooks
├── lib/ # Utility functions and constants
├── providers/ # Context providers and configurations
└── app/ # Next.js app router files
```

## Technical Considerations

### Security

- No hardcoded API keys or sensitive data
- Environment variable validation at startup
- Proper error handling for all user interactions

### Performance

- Debounced input for price quotes
- Efficient state management with React Query
- Minimal external dependencies
- Optimized class handling during hydration to remove extension-added classes

### Extension Class Handling

- Implemented automatic cleanup of extension-added classes during hydration
- Uses efficient `for...of` loop for class removal
- Prevents potential conflicts with browser extensions that add classes to the document
- Ensures clean DOM state for consistent styling

### Compatibility

- Tested with MetaMask and Safe wallets
- Support for both mobile and desktop browsers
- Graceful fallbacks for unsupported features

## Known Limitations

- Only supports USDC to ETH swaps on Arbitrum
- Requires manual approval for first-time token usage with EOA wallets
- Safe wallet operations require multiple signatures based on wallet configuration
