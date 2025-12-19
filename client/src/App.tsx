import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRef } from "react";
import { ScrollToTop } from "@/hooks/scroll-top"

// Layout Components
import Header from "@/components/layout/header";
import BottomNav from "@/components/layout/bottom-nav";
import Footer from "@/components/layout/footer";

// Pages
import Home from "@/pages/home";
import Tickets from "@/pages/Booking/tickets";
import History from "@/pages/Booking/history";
import Profile from "@/pages/Profile/profile";
import NotFound from "@/pages/Utils/not-found";
import NewsPage from "@/pages/News/news";
import EventsPage from "@/pages/Event/events";
import EventDetail from "@/pages/Event/event-detail";
import Survey from "@/pages/Survey/survey";
import ComplaintPage from "@/pages/Survey/pengaduan";
import WBS from "@/pages/Survey/wbs";
import RegisterPage from "@/pages/Auth/register";
import LoginPage from "@/pages/Auth/login";
import BookingPage from "./pages/Booking/booking";
import DestinationsPage from "./pages/Destination/destinations";
import DestinationsDetailPage from "./pages/Destination/destination-detail";
import NewsDetailPage from "./pages/News/news-detail";
import BookingDetailPage from "./pages/Booking/booking-detail";
import MyReportsPage from "./pages/Profile/my-reports";

// Auth Context
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/protected-route";

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/" component={Home} />
      <Route path="/news" component={NewsPage} />
      <Route path="/news/:id" component={NewsDetailPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/events/:slug" component={EventDetail} />
      <Route path="/survey" component={Survey} />
      <Route path="/complaint" component={ComplaintPage} />
      <Route path="/wbs" component={WBS} />
      <Route path="/destinations" component={DestinationsPage} />
      <Route path="/destination/:slug" component={DestinationsDetailPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/login" component={LoginPage} />

      {/* Protected Pages */}
      <Route path="/tickets">
        <ProtectedRoute>
          <Tickets />
        </ProtectedRoute>
      </Route>

      <Route path="/booking">
        <ProtectedRoute>
          <BookingPage />
        </ProtectedRoute>
      </Route>

      <Route path="/history">
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      </Route>

      <Route path="/history/:id">
        <ProtectedRoute>
          <BookingDetailPage />
        </ProtectedRoute>
      </Route>

      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>

      <Route path="/profile/reports">
        <ProtectedRoute>
          <MyReportsPage />
        </ProtectedRoute>
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const isMobile = useIsMobile();
  const navRef = useRef<HTMLDivElement>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            {/* Main content area with footer */}
            <div
              className="flex flex-col flex-grow"
              style={{ paddingBottom: isMobile ? "80px" : "0px" }}
            >
              <main className="flex-grow">
                <ScrollToTop />
                <Router />
              </main>
              <Footer />
            </div>

            <div ref={navRef}>
              <BottomNav />
            </div>

            <Toaster />
          </div>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
