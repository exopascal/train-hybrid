# Train Hybrid - Builder.io Compatible Project

A modern, Builder.io-first Nuxt 3 application with TypeScript, Tailwind CSS, and Cloudflare Pages deployment.

## Features

- **Nuxt 3** with TypeScript support
- **Builder.io** integration for visual content editing
- **Tailwind CSS** with comprehensive design token system
- **Pinia** for state management
- **Cloudflare Pages** optimized deployment
- **3-tier component architecture** (UI → Section → Content Wrappers)

## Prerequisites

- Node.js 18+
- Yarn 1.22.22 (specified in package.json)

## Getting Started

### 1. Install Dependencies

```bash
yarn install
```

### 2. Environment Setup

Copy the `.env.example` file to `.env` and add your Builder.io API key:

```bash
cp .env.example .env
```

Then edit `.env` and add your Builder.io API key:

```
BUILDER_API_KEY=your_builder_api_key_here
```

You can get your API key from [Builder.io Dashboard](https://builder.io/account/organization).

### 3. Start Development Server

```bash
yarn dev
```

The application will be available at `http://localhost:3000`.

## Development Commands

```bash
yarn dev       # Start development server
yarn build     # Build for production
yarn generate  # Generate static files
yarn preview   # Preview production build locally
```

## Project Structure

```
├── assets/
│   └── css/
│       └── global.css           # Design tokens & base styles
├── components/
│   ├── design-system-ui-components/       # UI primitives (NOT in Builder.io)
│   ├── design-system-section-components/  # Complete sections (YES in Builder.io)
│   ├── layout/                            # Header, Footer
│   ├── booking/                           # Booking features
│   ├── admin/                             # Admin features
│   ├── user/                              # User features
│   ├── gym-linden/                        # Domain-specific content
│   ├── transformation/                    # Transformation program
│   ├── about/                             # About page content
│   └── levelup/                           # Level Up program
├── pages/
│   ├── index.vue                # Home page
│   └── [slug].vue               # Dynamic Builder.io pages
├── plugins/
│   └── custom-components.ts     # Builder.io component registration
├── stores/                      # Pinia stores
├── nuxt.config.ts              # Nuxt configuration
├── wrangler.toml               # Cloudflare deployment config
└── tailwind.config.js          # Tailwind configuration
```

## Component Architecture

### 3-Tier System

1. **UI Components** (`design-system-ui-components/`)
   - Small, reusable building blocks
   - Examples: Buttons, Modals, Cards
   - **NOT registered in Builder.io**

2. **Section Components** (`design-system-section-components/`)
   - Complete, standalone sections
   - Examples: Hero, FAQ, Timeline, Gallery
   - **REGISTERED in Builder.io**
   - Generic, no domain-specific content

3. **Content Wrappers** (`components/[domain]/`)
   - Domain-specific implementations
   - Use Section Components internally
   - **CAN be registered in Builder.io**

## Design Token System

All design tokens are defined in `assets/css/global.css`:

- **Colors**: Brand colors, semantic colors
- **Typography**: Font families, sizes, weights
- **Spacing**: Consistent spacing scale
- **Shadows**: Depth and elevation
- **Border Radius**: Rounded corners
- **Transitions**: Animation timing
- **Breakpoints**: Responsive design

### Train Hybrid Corporate Identity

**Brand Colors:**
- **Primary**: `#1b263b` (Deep Navy) – Trust, Focus, Professionalism
- **Secondary**: `#4a6a7f` (Blue Gray) – Scientific, Calm, Modern
- **Accent**: `#f97316` (Orange) – Warmth, Energy, Connection to EXOPEK

**Typography:**
- **Base Font**: Inter – Modern, readable, professional
- **Heading Font**: Poppins – Bold, distinctive for headlines

**Color Usage:**
- Use **Primary** for main elements, headlines, backgrounds
- Use **Secondary** for secondary UI elements, hover states
- Use **Accent** for buttons, links, CTAs, important highlights
- Orange connects Train Hybrid with the EXOPEK brand

### Usage Example

```vue
<template>
  <div class="card">
    <h2>My Card</h2>
  </div>
</template>

<style scoped>
.card {
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  background: var(--color-background);
}
</style>
```

## Adding Builder.io Components

### Example: Creating a Hero Section Component

1. Create the component:

```vue
<!-- components/design-system-section-components/Hero.vue -->
<template>
  <section class="hero">
    <div class="container">
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
      <a :href="buttonLink" class="btn">{{ buttonText }}</a>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
}>()
</script>
```

2. Register in `plugins/custom-components.ts`:

```typescript
import Hero from '~/components/design-system-section-components/Hero.vue'

Builder.registerComponent(Hero, {
  name: 'Hero',
  inputs: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Welcome',
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Your subtitle here',
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Get Started',
    },
    {
      name: 'buttonLink',
      type: 'text',
      defaultValue: '/contact',
    },
  ],
})
```

## Deployment to Cloudflare Pages

### Via Wrangler CLI

```bash
yarn build
npx wrangler pages deploy .output/public
```

### Via Cloudflare Dashboard

1. Connect your GitHub repository
2. Set build command: `yarn build`
3. Set build output directory: `.output/public`
4. Add environment variable: `BUILDER_API_KEY`

## Important Notes

- ✅ Always use design tokens from `global.css`
- ✅ Check existing components before creating new ones
- ✅ Register only Section Components in Builder.io
- ✅ Use props + slots for component variations
- ❌ No inline styles or hardcoded values
- ❌ No single-use components
- ❌ Don't register UI Components in Builder.io

## Documentation

For detailed guidelines, see `CLAUDE.md` which contains:
- Complete architecture documentation
- Component development rules
- Builder.io integration guidelines
- Deployment instructions
- Code review checklist

## License

Private project - All rights reserved
