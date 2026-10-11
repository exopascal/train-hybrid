```markdown
# AGEMTS.md

This document serves as **persistent context for language models** (Claude, ChatGPT, etc.) working on code in this repository.  
It contains **mandatory guidelines** for architecture, styling, deployment, and component development.  
👉 **Every new coding task MUST reference this file.**

---

## Development Commands

**Core Development:**
```bash
yarn dev       # Start development server on localhost:3000
yarn build     # Build application for production
yarn generate  # Generate static files
yarn preview   # Preview production build locally
```

**Package Management:**
- Package manager: `yarn@1.22.22` (locked via yarn.lock)

---

## Technical Architecture

### Core Stack
- **Framework:** Nuxt.js 3 + TypeScript
- **State Management:** Pinia stores
- **Styling:** Tailwind CSS + global.css (Design Tokens)
- **CMS/Content:** Builder.io
- **Deployment:** Cloudflare Pages (via wrangler.toml)

### Builder.io Integration
- Builder.io-first architecture with strong design token system
- Custom components registered in `plugins/custom-components.ts`
- Props & Input Schemas defined for Builder.io Editor
- Only registered components appear in the visual editor
- { name: 'position', type: 'list', enum: ['top-right', 'top-left', 'bottom-right', 'bottom-left'], defaultValue: 'top-right' }, this dont work, only
    subfields with a key value paire works for a list. enum: ['top-right', 'top-left', 'bottom-right', 'bottom-left'] is for builder.io not readable.
- For a Dropdown to select values this is the way: type: 'text', enum: ['image', 'content'], defaultValue: 'image'

---

## Project Structure

```
pages/
  index.vue        # Home
  [slug].vue       # Dynamic Builder.io pages

components/
  design-system-ui-components/       # UI Primitives (NOT in Builder.io)
    Button.vue                        # Button component
    Modal.vue                         # Modal/Dialog
    InfoCard.vue                      # Info cards
    ContactCard.vue                   # Contact display
    EventCard.vue                     # Event cards
    USPCard.vue                       # USP cards

  design-system-section-components/  # Complete Sections (YES in Builder.io)
    Hero.vue                          # Hero sections
    HeroImage.vue                     # Hero with image
    FAQ.vue                           # FAQ sections
    CTA.vue                           # Call-to-action
    Timeline.vue                      # Timeline
    GalleryGrid.vue                   # Gallery
    ContentSection48.vue              # Content sections
    ... (32 total section components)

  layout/                            # Layout components
    Header.vue, Footer.vue

config/
  nuxt.config.ts   # Nuxt + Cloudflare + Builder.io
  wrangler.toml    # Cloudflare deployment
```

---

## Cloudflare Pages Optimization

- Nitro preset: `cloudflare-pages`
- Hydration mismatch prevention enabled
- Route-specific caching for static/dynamic content
- Prerendered routes: `/kurse`, `/preise`, `/team`
- Builder.io content routes use SSR with caching headers

---

## Design Token Architecture

**Token Categories:**
- Colors (brand + semantic palette)
- Typography (fonts, sizes, weights)
- Spacing & sizing
- Shadows, border radius, z-index
- Component-specific tokens
- Responsive breakpoints

👉 **Tokens in `assets/css/global.css` have highest priority** (before Tailwind utilities).

### Train Hybrid Corporate Identity (CI)

**Brand Colors:**
- **White**: `#FFFFFF`
- **Black**: `#0E0E0E`
- **Gray Dark**: `#5F5F5F`
- **Gray Light**: `#E6E6E6`

**Design Philosophy:**
- Ruhig, reduziert, führend
- Fokus auf Ordnung von Inhalten statt Aufmerksamkeitserzeugung
- Wenn ein Element auffällt, hat es eine Funktion

**Typography:**
- **Base Font**: Inter – Modern, gut lesbar, professionell
- **Heading Font**: Poppins – Charakterstark für Headlines
- Klare Hierarchie durch Font-Weights (400, 500, 600, 700)

**Color Usage Guidelines:**
- Black: Headlines, Primärtexte, fokussierte Elemente
- Gray Dark: Fließtexte, sekundäre UI-Elemente
- Gray Light: Linien, Flächen, sekundäre Hintergründe
- White: Primärfläche, ruhige Hintergründe

---

## Design System & Component Structure

**Goal:** Build a Design System with reusable components, consistent across all pages, dashboards, and Builder.io integrations.

### Component Architecture

**3-Tier System:**

1. **UI Components** (`design-system-ui-components/`)
   - Small, reusable building blocks
   - Buttons, Modals, Cards, Form elements
   - **NOT registered in Builder.io**
   - Used internally by Section Components

2. **Section Components** (`design-system-section-components/`)
   - Complete, standalone sections
   - Hero, FAQ, Timeline, Gallery, etc.
   - **REGISTERED in Builder.io**
   - Generic, no domain-specific content
   - Names WITHOUT "Base" prefix (e.g., `Hero.vue`, not `BaseHero.vue`)

3. **Content Wrappers** (`components/[domain]/`)
   - Domain-specific implementations
   - Use Section Components internally
   - Examples: `gym-linden/`, `transformation/`, `about/`
   - **CAN be registered in Builder.io** with specific content

### Principles

**Reusability**
- No single-use components
- Props & slots for flexible variations

**Design Tokens First**
- Colors, spacing, typography only via tokens
- No hardcoded values (#hex, px, etc.)

**Builder.io Compatibility**
- Only Section Components and Content Wrappers in Builder.io
- Props must have defaults for visual editor
- Always register in `custom-components.ts`

---

## Component Rules

- **UI Components**: Check `design-system-ui-components/` before creating new
- **Sections**: Check `design-system-section-components/` for existing sections
- Use props instead of variant-specific classes (`<Button variant="primary" />`)
- Templates under 80 lines → split if larger
- Document props with JSDoc/TS comments
- Section component names WITHOUT "Base" prefix

---

## Development Patterns

### Adding New Builder.io Components

**For Section Components:**
1. Create Vue component in `components/design-system-section-components/`
2. Use descriptive name WITHOUT "Base" prefix (e.g., `ContactSection.vue`)
3. Import UI Components from `design-system-ui-components/`
4. Register in `plugins/custom-components.ts`
5. Define input schema + props with meaningful defaults
6. Test in Builder.io editor
7. Document component props

**For Content Wrappers:**
1. Create in `components/[domain]/` (e.g., `gym-linden/`)
2. Use Section Components internally
3. Add domain-specific content and styling
4. Register in `plugins/custom-components.ts` if needed in Builder.io

---

## Environment Configuration

- **API Key:** `BUILDER_API_KEY`
- Configured in `nuxt.config.ts` + `wrangler.toml`
- Handle dev vs prod environments

---

## UI Development Style Guide

### Design Philosophy
- Minimal, grid-based
- Rounded corners, glassmorphism, gradients
- Bold headlines, sporty visuals
- Consistent across marketing site, dashboards, admin panels

### CSS Framework Usage
- **Primary:** Tailwind CSS utilities
- **Priority:** Tokens First → then Tailwind → then custom CSS
- **Never** inline styles or hardcoded values

---

## Component Development Rules

- **Reuse before creating new**
- **Check design-system-ui-components/ first** for existing UI primitives
- **Check design-system-section-components/** for existing sections
- Create UI Component → then Section Component → then Content Wrapper
- Props + slots for variations
- Accessible markup (semantic HTML, ARIA)
- Import paths:
  - UI: `~/components/design-system-ui-components/[Name].vue`
  - Sections: `~/components/design-system-section-components/[Name].vue`
  - Domain: `~/components/[domain]/[Name].vue`

---

## Responsive Design

- Mobile-first
- Container max-width: `var(--container-max-width)` (1200px)
- Use responsive padding defined in `global.css`

---

## Animation & Transitions

- Use variables: `--transition-fast`, `--transition-normal`, `--transition-slow`
- Prebuilt classes: `.fade-in`, `.slide-up`

---

## Builder.io Component Guidelines

- Keep templates simple
- Always use design tokens
- Provide meaningful input schemas
- Test in the visual editor
- Document props

---

## Code Review Checklist

- ✅ Uses design tokens (no hardcoded values)
- ✅ Reuses existing components when possible
- ✅ Tailwind utility-first approach
- ✅ Template within size guidelines
- ✅ Responsive & accessible
- ✅ Proper Builder.io registration

---

## Key File Dependencies

- `plugins/custom-components.ts` → Builder.io registration
- `nuxt.config.ts` → Nuxt + Cloudflare + Builder.io config
- `specs/plan.md` → Roadmap for gym booking system

---

## 🔑 Quick Reference / TL;DR

```
✅ Use design tokens from global.css
✅ 3-tier structure: UI Components → Section Components → Content Wrappers
✅ Props + slots for variations, no duplication
✅ Register Section Components & Content Wrappers in Builder.io
✅ Reuse existing components before creating new ones
✅ Section names WITHOUT "Base" prefix

❌ No inline styles or hardcoded colors (#hex)
❌ No oversized templates (>80 lines)
❌ No one-off components built only for a single page
❌ Don't register UI Components in Builder.io
```
```
