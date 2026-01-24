### Project Architecture & Development Rules

1. **Static Site Generation (SSG)**
    - The frontend (`apps/nextjs-front`) is a static site.
    - It must be compatible with `output: 'export'`.
    - Avoid using server-only features (e.g., dynamic server-side rendering, server actions that require a running Node.js server).
    - All data fetching must be done client-side.

2. **File Size Limit**
    - Keep source files concise.
    - Aim for a limit of **100 lines per file**.
    - If a file exceeds this limit, consider refactoring by extracting components, hooks, or utility functions into separate files.

3. **Internationalization (i18n)**
    - Use i18n for all user-facing text.
    - Avoid hardcoding strings in components.
    - (Note: Ensure an i18n library like `next-intl` or similar is set up when implementing this).

4. **Data Fetching & State Management**
    - Use **React Query (`useQuery`, `useMutation`)** for all data fetching and external state management.
    - Do not use manual `useState` + `useEffect` for fetching data from Supabase or Edge Functions.
    - Leverage hooks in `services/` for consistent API access.

5. **Authentication**
    - Use **Magic Links (`signInWithOtp`)** as the primary authentication method.
    - Leverage `onAuthStateChange` to monitor and respond to session changes across the app.
    - Ensure all auth flows are client-side compatible for static hosting.
