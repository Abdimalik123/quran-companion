import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Map, Settings, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/mushaf", icon: BookOpen, label: "Mushaf" },
  { to: "/heatmap", icon: Map, label: "Mastery Map" },
  { to: "/connections", icon: Link2, label: "Connections" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function AppNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-sm md:relative md:border-t-0 md:border-r md:h-screen md:w-20 md:flex-col">
      <div className="flex items-center justify-around md:flex-col md:justify-start md:gap-2 md:pt-8 md:px-2">
        <div className="hidden md:block mb-8 text-center">
          <span className="font-display text-2xl text-primary font-bold">حفظ</span>
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs transition-all duration-200 md:w-full",
                isActive
                  ? "text-primary bg-primary/10 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="hidden md:inline text-[10px]">{item.label}</span>
              <span className="md:hidden text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
