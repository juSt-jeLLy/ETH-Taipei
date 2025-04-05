# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `cd Frontend && npm run dev` - Run development server with Turbopack
- `cd Frontend && npm run build` - Build for production
- `cd Frontend && npm run start` - Start production server
- `cd Frontend && npm run lint` - Run ESLint

## Code Style Guidelines
- **TypeScript**: Use strict typing with proper interfaces/types
- **React**: Use function components with hooks
- **Formatting**: Follow Next.js/TypeScript standards
- **Imports**: Group imports by: React/Next, third-party libraries, components, styles
- **Components**: Client components use "use client" directive
- **Naming**: PascalCase for components, camelCase for functions/variables
- **State Management**: Use React hooks (useState, useEffect) and context API
- **Styling**: Use Tailwind CSS for styling
- **Animation**: Use Framer Motion for animations
- **Error Handling**: Use try/catch blocks with proper error messages
- **Web3**: Wagmi hooks for wallet connection and blockchain interactions