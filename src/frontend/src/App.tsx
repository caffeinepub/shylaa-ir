import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { LanguageProvider } from './i18n/LanguageProvider';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import PlatformsListPage from './pages/platforms/PlatformsListPage';
import PlatformDetailPage from './pages/platforms/PlatformDetailPage';
import SubmissionPlanDashboardPage from './pages/submissions/SubmissionPlanDashboardPage';
import ContentWorkspacePage from './pages/content/ContentWorkspacePage';
import KeywordToolsPage from './pages/keywords/KeywordToolsPage';
import PerformanceTrackingPage from './pages/performance/PerformanceTrackingPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminPlatformsPage from './pages/admin/AdminPlatformsPage';
import AdminSubmissionPlansPage from './pages/admin/AdminSubmissionPlansPage';
import AdminDraftsPage from './pages/admin/AdminDraftsPage';
import AdminKeywordsPage from './pages/admin/AdminKeywordsPage';
import AdminPerformancePage from './pages/admin/AdminPerformancePage';
import RequireAuth from './components/auth/RequireAuth';
import RequireAdmin from './components/auth/RequireAdmin';

const rootRoute = createRootRoute({
  component: AppShell,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const platformsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/platforms',
  component: PlatformsListPage,
});

const platformDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/platforms/$platformId',
  component: PlatformDetailPage,
});

const submissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submissions',
  component: () => (
    <RequireAuth>
      <SubmissionPlanDashboardPage />
    </RequireAuth>
  ),
});

const contentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/content',
  component: () => (
    <RequireAuth>
      <ContentWorkspacePage />
    </RequireAuth>
  ),
});

const keywordsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/keywords',
  component: () => (
    <RequireAuth>
      <KeywordToolsPage />
    </RequireAuth>
  ),
});

const performanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/performance',
  component: () => (
    <RequireAuth>
      <PerformanceTrackingPage />
    </RequireAuth>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <RequireAdmin>
      <AdminLayout />
    </RequireAdmin>
  ),
});

const adminPlatformsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/platforms',
  component: AdminPlatformsPage,
});

const adminSubmissionsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/submissions',
  component: AdminSubmissionPlansPage,
});

const adminDraftsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/drafts',
  component: AdminDraftsPage,
});

const adminKeywordsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/keywords',
  component: AdminKeywordsPage,
});

const adminPerformanceRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/performance',
  component: AdminPerformancePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  platformsRoute,
  platformDetailRoute,
  submissionsRoute,
  contentRoute,
  keywordsRoute,
  performanceRoute,
  adminRoute.addChildren([
    adminPlatformsRoute,
    adminSubmissionsRoute,
    adminDraftsRoute,
    adminKeywordsRoute,
    adminPerformanceRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <RouterProvider router={router} />
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  );
}
