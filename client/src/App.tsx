import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

import Header from "@/components/layout/header";
import BottomNav from "@/components/layout/bottom-nav";
import Sidebar from "@/components/layout/sidebar";
import Home from "@/pages/home";
import Tickets from "@/pages/tickets";
import History from "@/pages/history";
import Profile from "@/pages/profile";
import AttractionDetail from "@/pages/attraction-detail";
import NotFound from "@/pages/not-found";
import NewsPage from "@/pages/news";
import EventsPage from "@/pages/events";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tickets" component={Tickets} />
      <Route path="/history" component={History} />
      <Route path="/profile" component={Profile} />
      <Route path="/attraction/:slug" component={AttractionDetail} />
      <Route path="/news" component={NewsPage} />
      <Route path="/events" component={EventsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          
          <main className={`${isMobile ? 'mobile-bottom-padding' : 'desktop-sidebar-margin'}`}>
            <Router />
          </main>
          
          {isMobile ? <BottomNav /> : <Sidebar />}
          
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
