# SAM Drip Crown Game - Design Guidelines

## Design Approach
**Reference-Based Approach**: Gaming-focused with inspiration from modern mobile games like Clash Royale and social gaming apps. The design should feel premium yet approachable, emphasizing the competitive crown mechanics and World ID verification trust.

## Core Design Elements

### Color Palette
**Primary Colors (Dark Mode)**
- Background: 12 8% 6% (deep charcoal)
- Surface: 240 6% 10% (dark slate)
- Crown Gold: 45 95% 58% (royal gold)
- Success: 142 76% 47% (emerald)
- Danger: 0 84% 60% (vibrant red)

**Light Mode**
- Background: 0 0% 100% (pure white)
- Surface: 240 4% 96% (light gray)
- Crown Gold: 45 95% 48% (deeper gold)

### Typography
- **Primary**: Inter (Google Fonts) - clean, modern
- **Accent**: Orbitron (Google Fonts) - futuristic gaming feel for crown timer and competitive elements
- Hierarchy: Bold titles (2xl-4xl), medium body text (base-lg), light captions (sm)

### Layout System
**Spacing**: Tailwind units of 2, 4, 6, and 8 for consistent rhythm
- Tight spacing: p-2, m-2 for compact elements
- Standard spacing: p-4, gap-4 for general layout
- Generous spacing: p-6, m-6 for sections
- Large spacing: p-8, mt-8 for major separations

### Component Library

**Crown Competition Interface**
- Prominent crown icon with golden glow effect
- Large countdown timer with gaming aesthetics
- Current holder display with avatar/World ID verification badge
- "Steal Crown" button with premium golden styling
- Earnings display with animated counter

**World ID Verification**
- Trust badge components with verified checkmarks
- Clean verification flow cards
- Success states with subtle animations
- Clear error handling with helpful messaging

**Gaming Elements**
- King-of-the-hill status cards
- Cooldown timers with progress indicators
- Competition leaderboard components
- Achievement-style success notifications

**Navigation & Layout**
- Mobile-first bottom navigation
- Clean header with crown game branding
- Card-based content organization
- Responsive grid for game statistics

### Visual Treatment
**Gradients**: Subtle crown-themed gradients from gold (45 95% 58%) to amber (35 85% 50%) for premium buttons and crown elements

**Background**: Dark gaming aesthetic with subtle texture overlay suggestions - avoid busy patterns that compete with crown focus

**Contrast**: High contrast for gaming clarity - bright crown gold against dark backgrounds, clear white text on dark surfaces

### Images
**Crown Icon**: Central golden crown illustration - should be the hero element, prominently displayed in the main game interface. Consider SVG with subtle glow effects.

**World ID Badge**: Small verification icons throughout the interface showing trusted user status.

**No large hero image needed** - the crown icon serves as the primary visual focus with supporting gaming UI elements.

## Key Design Principles
1. **Gaming Premium**: Sophisticated mobile game aesthetics without being overwhelming
2. **Trust & Verification**: Clear World ID integration with confidence-building design
3. **Competition Focus**: Crown mechanics are the star - everything supports the core game loop
4. **Mobile Gaming UX**: Thumb-friendly interactions, clear feedback, immediate responses