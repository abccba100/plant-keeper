# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-06-14
- Primary product surfaces: calendar, plant registration, plant health analysis, shared sidebar, schedule registration modal
- Evidence reviewed: README.md, docs/ATMOSPHERE_SYSTEM.md, docs/CANOPY_SYSTEM.md, src/components/styles, src/components/calendar/styles, current browser screenshots

## Brand
- Personality: quiet seasonal garden, premium diary, gentle but useful care tool
- Trust signals: clear schedule status, readable plant data, calm feedback, consistent controls
- Avoid: generic SaaS dashboard, heavy marketing hero sections, cartoon clutter, harsh warning UI, dense unexplained decoration

## Product goals
- Goals: help users understand today's plant care at a glance, make registration and diagnosis feel simple, preserve the seasonal atmosphere as the product identity
- Non-goals: professional horticulture analytics, complex admin dashboard, maximum abstraction
- Success signals: no horizontal overflow, primary action is obvious, Korean text is readable, each screen has one clear center of attention

## Personas and jobs
- Primary personas: casual plant owners, students preparing a presentation/demo, users who want a visual care diary
- User jobs: check today's care, add a plant from a photo, diagnose a plant, register recommended schedules
- Key contexts of use: desktop class presentation, live coding demo, casual repeated personal use

## Information architecture
- Primary navigation: sidebar with plant identification, health analysis, calendar
- Core routes/screens: /register, /analyze, /
- Content hierarchy: screen title, primary workflow surface, secondary guide/status rail, persistent plant list

## Design principles
- Principle 1: Atmosphere supports the task; it must not compete with schedule or form content.
- Principle 2: Every screen should explain itself through layout, not paragraphs.
- Tradeoffs: prefer slightly larger spacing and clearer hierarchy over maximum visible density.

## Visual language
- Color: seasonal accent plus quiet neutral surfaces; night mode uses deep blue-black with restrained glow
- Typography: Korean body text 13.5px or larger, strong labels 14-16px, page titles 26-30px
- Spacing/layout rhythm: generous outer padding, compact but breathable cards, clear column gaps
- Shape/radius/elevation: 8px for cards and controls; larger radius only for circular pills, upload zones, and modals
- Motion: short state feedback only; respect reduced motion
- Imagery/iconography: existing plant SVG and seasonal raster assets are the primary visual identity

## Components
- Existing components to reuse: PageSidebar, ProgressStepper, Icon, PlantSvg scenes, calendar styled components
- New/changed components: prefer local CSS/styled updates over new abstraction
- Variants and states: hover, selected, disabled, loading, empty, success, night mode
- Token/component ownership: shared values live in shell.css and tokens.ts; calendar-specific layout stays in calendar style files

## Accessibility
- Target standard: practical WCAG-minded readability and keyboard access
- Keyboard/focus behavior: visible focus on buttons, inputs, day cells, modal controls
- Contrast/readability: avoid low-opacity body text; keep Korean text readable in night mode
- Screen-reader semantics: keep existing labels and button names meaningful
- Reduced motion and sensory considerations: global reduced-motion rule remains mandatory

## Responsive behavior
- Supported breakpoints/devices: desktop first, tablet at 1180px, mobile at 900px and below
- Layout adaptations: right rails collapse before content overflows; calendar must not create horizontal scroll
- Touch/hover differences: large enough controls on compact screens, hover is enhancement only

## Interaction states
- Loading: quiet spinner with brand color and enough contrast
- Empty: explain the next action in one line
- Error: specific, recoverable message near the control
- Success: concise confirmation and next action
- Disabled: visually disabled, but still readable
- Offline/slow network, if applicable: not a core current surface

## Content voice
- Tone: calm, concrete, friendly Korean
- Terminology: 식물, 일정, 관리, 상태, 캘린더, 분석
- Microcopy rules: short labels over instructional paragraphs; avoid duplicate explanations in nearby areas

## Implementation constraints
- Framework/styling system: React, TypeScript, Emotion styled components, CSS files
- Design-token constraints: no new dependency or design-system layer without explicit need
- Performance constraints: preserve lazy-loaded pages and avoid expensive runtime effects
- Compatibility constraints: preserve local storage state and current navigation
- Test/screenshot expectations: run build, lint, and browser smoke checks for changed visual surfaces

## Open questions
- [ ] Final brand preference for light mode vs night mode default / owner: user / impact: presentation mood
- [ ] Whether mobile is part of the live demo / owner: user / impact: depth of responsive polish
