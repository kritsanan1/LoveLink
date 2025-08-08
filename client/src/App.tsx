import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Discovery from "@/pages/discovery";
import Matches from "@/pages/matches";
import Profile from "@/pages/profile";
import Chat from "@/pages/chat";
import BottomNav from "@/components/bottom-nav";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Discovery} />
      <Route path="/matches" component={Matches} />
      <Route path="/profile" component={Profile} />
      <Route path="/chat/:matchId" component={Chat} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl">
          <main className="flex-1 relative overflow-hidden">
            <Router />
          </main>
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
