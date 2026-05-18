import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
import { BrowserRouter } from "react-router";
import {SentryErrorFallback} from "./components/SentryErrorFallback.tsx";
import { SentryUserSync } from "./components/SentryUserSynce.tsx";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const queryClient = new QueryClient();
const apiBase=import.meta.env.VITE_API_URL??''
const tracePropagationTargets =
  apiBase.length > 0 ? [apiBase] : typeof window !== "undefined" ? [window.location.origin] : [];

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Text masking (default: true)
      maskAllText: true,
      // Block images/videos (default: true)
      blockAllMedia: true,
      // Mask specific inputs
      maskAllInputs: true,
    }),
  ],
  tracesSampleRate:1.0,
  replaysOnErrorSampleRate: 1.0,
  tracePropagationTargets:tracePropagationTargets,
  replaysSessionSampleRate: 1.0,
  sendDefaultPii: true,
  enableLogs:true
});
createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <SentryUserSync/>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <Sentry.ErrorBoundary fallback={<SentryErrorFallback/>}>
  <App /> 
      </Sentry.ErrorBoundary>
     
      </BrowserRouter>
     
    </QueryClientProvider>
  </ClerkProvider>,
);
