# Project Overview

**erp-addon** is a React application built with TypeScript and Vite. It serves as an add-on or portal interface, connecting to backend services for authentication and core API data. 

## Tech Stack & Architecture

- **Core:** React 19, TypeScript, Vite
- **Routing:** `react-router-dom` (configured in `src/router/index.tsx`)
- **State Management:** Zustand (as defined in dependencies, with stores typically in `src/store/`)
- **Data Fetching:** Axios with custom instances (`src/api/axios.ts`) and `@tanstack/react-query`.
- **UI Framework:** Ant Design (`antd`) with a custom theme provider defined in `src/main.tsx`.
- **Styling:** Sass (`.scss` files), with global styles in `src/styles/global.scss`.

## API Integration

The project has a distinct separation for API calls (configured in `vite.config.ts` and `src/api/axios.ts`):
- **Auth API:** Proxied through `/auth` to `https://imsnext-auth.enrichco.us`.
- **Core API:** Proxied through `/api` to `https://imsnext-portal.enrichco.us`.
- **Interceptors:** The application handles token authentication with `localStorage` (keys: `"token"` and `"refreshToken"`). An Axios interceptor automatically attaches the Bearer token to core API requests and handles silent token refreshes on 401 Unauthorized responses.

## Available Commands

Run these commands using `npm run <command>`, `yarn <command>`, or `pnpm <command>`:

- **`dev` / `start`**: Starts the Vite development server with Hot Module Replacement (HMR).
- **`build`**: Compiles TypeScript and builds the application for production using Vite.
- **`lint`**: Runs ESLint across the codebase to check for linting errors.
- **`preview`**: Locally previews the production build.
- **`generate`**: Runs Plop to scaffold new files or components.

## Development Conventions

- **Components:** React Functional Components with hooks.
- **Styling:** Ant Design components combined with SCSS modules or global SCSS for custom styling.
- **Authentication:** Relies on tokens. When writing new API services, import the configured `api` or `authApi` instances from `src/api/axios.ts` rather than standard `axios` to ensure interceptors are applied.
- **Error Handling:** Use the exported `getErrorMessage` helper from `src/api/axios.ts` for consistent error message extraction from API calls.
- **Type Safety:** The project uses TypeScript. Ensure type definitions are provided for API responses and component props.

