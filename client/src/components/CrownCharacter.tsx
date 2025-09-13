import samWithCrown from '@assets/generated_images/Sam_character_wearing_crown_ffdf863c.png';

interface CrownCharacterProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16', 
  lg: 'w-24 h-24',
  xl: 'w-32 h-32'
};

export default function CrownCharacter({ size = 'lg', className = '' }: CrownCharacterProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <img 
        src={samWithCrown} 
        alt="SAM Character with Crown" 
        className={`${sizeClasses[size]} object-contain crown-glow`}
        draggable={false}
      />
      <div className="absolute inset-0 crown-gradient opacity-10 blur-lg -z-10" />
    </div>
  );
}