import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRef, useLayoutEffect, useState } from "react";
import { ScrollToTop } from "@/hooks/scroll-top"

// Layout Components
import Header from "@/components/layout/header";
import BottomNav from "@/components/layout/bottom-nav";
import Footer from "@/components/layout/footer";

// Pages
import Home from "@/pages/home";
import Tickets from "@/pages/tickets";
import History from "@/pages/history";
import Profile from "@/pages/profile";
import AttractionDetail from "@/pages/destination-detail";
import NotFound from "@/pages/not-found";
import NewsPage from "@/pages/news";
import EventsPage from "@/pages/events";
import EventDetail from "@/pages/event-detail";
import Survey from "@/pages/survey";
import ComplaintPage from "@/pages/pengaduan";
import WBS from "@/pages/wbs";
import RegisterPage from "@/pages/register";
import LoginPage from "@/pages/login";
import BookingPage from "./pages/booking";
import DestinationsPage from "./pages/destinations";
import DestinationsDetailPage from "./pages/destination-detail";
import NewsDetailPage from "./pages/news-detail";
import BookingDetailPage from "./pages/booking-detail";
import MyReportsPage from "./pages/my-reports";

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
      <Route path="/attraction/:slug" component={AttractionDetail} />
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
  const [navHeight, setNavHeight] = useState(0);

  useLayoutEffect(() => {
    if (isMobile && navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    } else {
      setNavHeight(0);
    }
  }, [isMobile]);

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
