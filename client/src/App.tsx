import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRef, useLayoutEffect, useState } from "react";
import Header from "@/components/layout/header";
import BottomNav from "@/components/layout/bottom-nav";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import Tickets from "@/pages/tickets";
import History from "@/pages/history";
import Profile from "@/pages/profile";
import AttractionDetail from "@/pages/attraction-detail";
import NotFound from "@/pages/not-found";
import NewsPage from "@/pages/news";
import EventsPage from "@/pages/events";
import Survey from "@/pages/survey";
import ComplaintPage from "@/pages/pengaduan";
import WBS from "@/pages/wbs";

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
      <Route path="/survey" component={Survey} />
      <Route path="/complaint" component={ComplaintPage} />
      <Route path="/wbs" component={WBS} />
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
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />

          {/* Content + Footer inside one wrapper */}
          <div className="flex flex-col flex-grow" style={{ paddingBottom: isMobile ? "80px" : "0px" }}>
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>

          <BottomNav />
          <Toaster />
        </div>

      </TooltipProvider>
    </QueryClientProvider>
  );
}



export default App;
