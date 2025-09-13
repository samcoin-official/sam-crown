import { Badge } from '@/components/ui/badge';
import ThemeToggle from './ThemeToggle';
import samLogo from '@assets/SAM Crown Logo_1757778804301.png';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img 
            src={samLogo} 
            alt="SAM Crown Logo" 
            className="w-8 h-8 object-contain"
            draggable={false}
          />
          <span className="font-gaming font-bold text-lg crown-text-gradient">SAM Crown</span>
          <Badge variant="secondary" className="text-xs">Mini App</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-gaming">
            World ID Verified
          </Badge>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}