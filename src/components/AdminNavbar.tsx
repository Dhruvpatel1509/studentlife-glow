import { Home, Users, Calendar, MessageSquare } from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminNavbar = () => {
  const navItems = [
    { name: "Home", path: "/admin/home", icon: Home },
    { name: "Users", path: "/users", icon: Users },
    { name: "Events", path: "/admin/events", icon: Calendar },
    { name: "Chatbot", path: "/chatbot", icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-primary/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text overflow-visible">Zwickly Admin</h1>
          
          <ul className="flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 relative group ${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                        {isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
