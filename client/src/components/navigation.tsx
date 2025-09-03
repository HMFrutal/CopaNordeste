import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Início", href: "/" },
    { name: "Competições", href: "/competitions" },
    { name: "Times", href: "/teams" },
    { name: "Notícias", href: "/news" },
    { name: "Galeria", href: "/gallery" },
    { name: "Contato", href: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center space-x-4 cursor-pointer">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CNE</span>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold text-primary">Copa Nordeste 2025</h1>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    data-testid={`nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
                    className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      location === item.href
                        ? "text-primary"
                        : "text-gray-700 hover:text-primary"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
              
              {/* Admin Button */}
              <Link href="/admin">
                <Button 
                  variant={location.startsWith('/admin') ? "default" : "outline"}
                  size="sm"
                  className="ml-4"
                  data-testid="nav-admin-button"
                >
                  Admin
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    data-testid={`mobile-nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
                    className={`block px-3 py-2 text-base font-medium transition-colors cursor-pointer ${
                      location === item.href
                        ? "text-primary"
                        : "text-gray-700 hover:text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
              
              {/* Admin Button Mobile */}
              <div className="px-3 py-2">
                <Link href="/admin">
                  <Button 
                    variant={location.startsWith('/admin') ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    data-testid="mobile-nav-admin-button"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
