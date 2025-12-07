import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Settings, Sun, Moon, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

export const TopNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">
          {user?.role === 'manager' && 'Manager Portal'}
          {user?.role === 'waiter' && 'Waiter Portal'}
          {user?.role === 'chef' && 'Chef Portal'}
          {user?.role === 'kitchen_manager' && 'Kitchen Manager Portal'}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                5
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover border border-border">
            <div className="p-3 border-b border-border">
              <h3 className="font-semibold text-foreground">Notifications</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <span className="text-sm font-medium text-foreground">Order #1234 Ready</span>
                <span className="text-xs text-muted-foreground">Table 5 order is ready for pickup</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <span className="text-sm font-medium text-foreground">Low Stock Alert</span>
                <span className="text-xs text-muted-foreground">Salmon running low - 3 portions left</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <span className="text-sm font-medium text-foreground">New Order</span>
                <span className="text-xs text-muted-foreground">Table 8 placed a new order</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <span className="text-sm font-medium text-foreground">Chef Assigned</span>
                <span className="text-xs text-muted-foreground">Maria assigned to Order #1235</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <span className="text-sm font-medium text-foreground">Table Request</span>
                <span className="text-xs text-muted-foreground">Table 3 requested assistance</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/reports')}
        >
          <Settings className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {user?.name || 'Guest'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover border border-border">
            <div className="p-2 border-b border-border">
              <p className="text-sm font-medium text-foreground">{user?.name || 'Guest'}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role || 'Not logged in'}</p>
            </div>
            <DropdownMenuItem className="cursor-pointer">
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
