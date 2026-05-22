
import "@/styles/globals.css";
import '@/lib/i18n.ts'

import { Toaster } from "sonner";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import routerRoot from "./routes/router.tsx";

export default function AppProvider() {
  const router = createBrowserRouter(routerRoot);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
