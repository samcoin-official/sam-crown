import crownImage from '@assets/generated_images/Golden_crown_game_icon_ebd40dcf.png';

interface CrownIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withGlow?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

export default function CrownIcon({ size = 'md', withGlow = false, className = '' }: CrownIconProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <img 
        src={crownImage} 
        alt="SAM Crown" 
        className={`${sizeClasses[size]} object-contain ${withGlow ? 'crown-glow' : ''}`}
        draggable={false}
      />
      {withGlow && (
        <div className="absolute inset-0 crown-gradient opacity-20 blur-sm -z-10" />
      )}
    </div>
  );
}