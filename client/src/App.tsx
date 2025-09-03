import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Teams from "@/pages/teams";
import Competitions from "@/pages/competitions";
import News from "@/pages/news";
import Gallery from "@/pages/gallery";
import Contact from "@/pages/contact";
import AdminDashboard from "@/pages/admin";
import ChampionshipsPage from "@/pages/admin/championships";
import NewChampionshipPage from "@/pages/admin/championships-new";
import ChampionshipDetailsPage from "@/pages/admin/championship-details";
import ChampionshipEditPage from "@/pages/admin/championship-edit";
import TeamsPage from "@/pages/admin/teams";
import TeamsNewPage from "@/pages/admin/teams-new";
import TeamsEditPage from "@/pages/admin/teams-edit";
import AdminLogin from "@/pages/admin/login";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/teams" component={Teams} />
      <Route path="/competitions" component={Competitions} />
      <Route path="/news" component={News} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={() => <ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/championships/new" component={() => <ProtectedRoute><NewChampionshipPage /></ProtectedRoute>} />
      <Route path="/admin/championships/:id/edit" component={() => <ProtectedRoute><ChampionshipEditPage /></ProtectedRoute>} />
      <Route path="/admin/championships/:id" component={() => <ProtectedRoute><ChampionshipDetailsPage /></ProtectedRoute>} />
      <Route path="/admin/championships" component={() => <ProtectedRoute><ChampionshipsPage /></ProtectedRoute>} />
      
      {/* Admin Teams Routes */}
      <Route path="/admin/teams/new" component={() => <ProtectedRoute><TeamsNewPage /></ProtectedRoute>} />
      <Route path="/admin/teams/:id/edit" component={() => <ProtectedRoute><TeamsEditPage /></ProtectedRoute>} />
      <Route path="/admin/teams" component={() => <ProtectedRoute><TeamsPage /></ProtectedRoute>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
