import { Badge } from '@/components/ui/badge';
import CrownIcon from './CrownIcon';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <CrownIcon size="sm" withGlow />
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