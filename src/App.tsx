import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";
import Events from "./pages/Events";
import Chatbot from "./pages/Chatbot";
import KommPakt from "./pages/KommPakt";
import AdminHome from "./pages/admin/AdminHome";
import AdminEvents from "./pages/admin/Events";
import StudentAuth from "./pages/StudentAuth";
import AdminAuth from "./pages/AdminAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/users" element={<Users />} />
          <Route path="/student-auth" element={<StudentAuth />} />
          <Route path="/admin-auth" element={<AdminAuth />} />
          <Route path="/events" element={<Events />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/kommpakt" element={<KommPakt />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
