import { Flame, Heart, MessageCircle, User } from "lucide-react";
import { useLocation } from "wouter";

const navItems = [
  { icon: Flame, label: "Discover", path: "/" },
  { icon: Heart, label: "Matches", path: "/matches" },
  { icon: MessageCircle, label: "Messages", path: "/matches" },
  { icon: User, label: "Profile", path: "/profile" },
];

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location === item.path || 
            (item.path === "/" && location === "/") ||
            (item.path === "/matches" && location.startsWith("/matches"));

          return (
            <button
              key={index}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center py-2 transition-colors ${
                isActive ? "text-tinder-red" : "text-gray-400"
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
