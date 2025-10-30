# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lirios Cacao Frontend is an Angular 19 e-commerce application for a cacao/chocolate products business. The app features customizable chocolate-covered fruit products (chocofrutas) and ice cream (helados), with PWA support and SSR/prerendering capabilities.

**Tech Stack:**
- Angular 19 (standalone components, signals-ready)
- TypeScript 5.7 with strict mode enabled
- RxJS 7.8 for reactive state management
- PrimeNG 19 + Tailwind CSS 4 for UI
- Angular SSR with hydration and event replay

## Development Commands

### Local Development
```bash
npm start                 # Dev server at http://localhost:4200
npm run dev:ssr          # SSR dev server
npm run watch            # Build with watch mode
```

### Building
```bash
npm run build            # Production build (outputs to dist/)
npm run build:ssr        # Build with SSR
npm run serve:ssr        # Serve pre-built SSR app
npm run prerender        # Prerender routes
```

### Testing
```bash
npm test                 # Run unit tests with Karma
```

### Code Generation
```bash
ng generate component component-name    # Generate new component
ng generate --help                      # List available schematics
```

## Architecture

### Path Aliases
Configured in tsconfig.json for cleaner imports:
- `@/*` → `app/*`
- `@core/*` → `app/core/*`
- `@shared/*` → `app/shared/*`
- `@features/*` → `app/features/*`

### Core Domain Layer (`src/app/core/domain/`)

The domain layer contains business logic and models organized by product category. Each category follows this structure:

- **Models** (`*.models.ts`): TypeScript interfaces defining domain entities
- **Logic** (`*.logic.ts`): Pure functions for business calculations (e.g., price calculation)
- **Seed** (`*.seed.ts`): Static catalog data

**Example - Chocofruta domain:**
- Models define `Fruta`, `Chocolate`, `Topping`, and pricing rules
- Logic contains `calcularPrecioUnitarioChocofruta()` and `calcularSubtotalChocofruta()` functions
- Seed provides the catalog of available options

All domain exports are centralized in `src/app/core/domain/index.ts`.

### Product System

Products are transformed from domain models to UI view models (`ProductCardVM`) for display:

1. **Domain models** → defined in `core/domain/[category]/`
2. **Product files** → `core/products/[category].products.ts` transforms domain to `ProductCardVM[]`
3. **All products** → `core/products/all-products.ts` aggregates all categories
4. **ProductCardVM** → `core/ui-models/product-card.vm.ts` defines the unified card interface

**ProductCardVM structure:**
```typescript
{
  id: string;
  category: 'chocofruta' | 'helado' | 'flor' | 'evento';
  title: string;
  price: number;
  customizable?: boolean;
  data?: any;
  imageUrls: { base: string; topping?: string };
}
```

### Cart System (`src/app/features/cart/`)

The `CartService` is a singleton service managing shopping cart state with RxJS:
- Uses `BehaviorSubject` for reactive state (`items$`, `sidebarVisible$`)
- Methods: `add()`, `inc()`, `dec()`, `remove()`, `clear()`, `open()`, `close()`, `toggle()`
- Automatically merges items with the same title
- Computes `count` and `total` dynamically

The cart UI (`src/app/shared/cart/`) uses `p-dialog` from PrimeNG positioned as a right-side panel:
- Full-screen on mobile (< 768px), 600px width on desktop
- Implements `OnInit` to subscribe to `CartService.sidebarVisible$`
- Includes delivery options (domicilio/local), payment methods (efectivo/tarjeta)
- WhatsApp checkout integration with order summary formatting

### Features Structure

Feature modules are organized under `src/app/features/`:
- `home/` - Landing page with welcome, categories, featured products, contact sections
- `listproducts/` - Product catalog with search and category filters
- `product-card/` - Reusable product card component
- `info/` - About us page
- `layout/` - App shell (topbar, footer, layout wrapper)
- `cart/` - Shopping cart sidebar

### Routing

Lazy-loaded routes defined in `app.routes.ts`:
- `/` → Home
- `/sobrenosotros` → Info/About
- `/productos` → Product listing

All routes wrapped in `AppLayout` component for consistent shell.

### UI Libraries

- **PrimeNG** - Primary UI component library (Aura theme, light mode forced)
- **PrimeFlex** - Utility CSS
- **Tailwind CSS** - Custom styling
- **Leaflet** - Maps integration (for contact/location)

### PWA & Performance

- **Service Worker** enabled in production (`ngsw-config.json`)
- **SSR/Prerendering** configured via Angular Universal
- **Client Hydration** with event replay enabled
- Uses standalone components (no NgModules)

### Styling

- Component styles use SCSS
- Global styles in `src/styles.scss`
- Tailwind and PrimeNG themes configured
- Style budget: 4MB initial bundle (warns at 4MB, errors at 5MB)
- Brand color: `#452317` (dark brown/café)
- Background accents: `#FFF8F1` (cream), `#fafafa` (light gray)

### Navigation & Active State

The topbar (`src/app/features/layout/components/app.topbar/`) detects active routes:
- Subscribes to `Router.events` filtered by `NavigationEnd`
- Parses URL to determine current page (`isHome`) and category (`currentCategory`)
- Shows visual indicator (brown line) below active navigation item
- Mobile topbar: Fixed bottom, 80px height with `pb-4` and `pt-3` spacing to avoid iPhone home indicator
- Desktop topbar: Sticky top with category filters

### Product Customization Dialog

Product dialogs (`src/app/features/listproducts/components/products/`) follow a minimalist "Uber Eats" style:
- Uses `p-dialog` with `styleClass="uber-dialog"`
- Fixed preview section at top showing product image and price
- Scrollable options sections with card-based selection UI
- Selected items show brown border (`#452317`) and cream background (`#fef9f5`)
- Footer with sticky "Add to Cart" button showing total price

## Key Technical Patterns

1. **Domain-Driven Design**: Business logic separated into pure functions in domain layer
2. **Reactive State**: RxJS BehaviorSubjects for cart and UI state
3. **Standalone Components**: No NgModules, uses Angular's standalone API
4. **Lazy Loading**: All feature routes lazy-loaded for performance
5. **View Models**: Domain models transformed to presentation models (ProductCardVM)
6. **Path Aliases**: Consistent import patterns using @ aliases
7. **Minimalist UI**: Dialogs and panels use subtle shadows, rounded corners (0.75rem), and consistent spacing

## Testing Notes

- Uses Jasmine + Karma
- Test files follow `*.spec.ts` naming
- Config in `tsconfig.spec.json` and `karma.conf.js` (if exists)

## TypeScript Configuration

The project uses strict TypeScript settings:
- `strict: true` - All strict type checking options enabled
- `noImplicitReturns: true` - All code paths must return a value
- `noFallthroughCasesInSwitch: true` - Switch statements must be exhaustive
- `noPropertyAccessFromIndexSignature: true` - Use bracket notation for index access
- `isolatedModules: true` - Each file must be independently compilable

When adding new code, ensure it adheres to these strict checks.
