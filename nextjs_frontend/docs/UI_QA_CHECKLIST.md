# Visual QA and Interaction Test Checklist — Ocean Professional Theme

## Introduction
This checklist defines visual QA, interaction behavior, accessibility checks, and acceptance criteria for the Socratic Learning Assistant frontend. It is grounded in the implemented Ocean Professional theme and the actual code across pages and components. Use this as a step-by-step guide for cross-device and cross-browser verification.

The checklist references the following implemented sources:
- Theme tokens, spacing, radii, shadows, transitions, motion gating, and chat styles in src/app/globals.css
- App shell layout, sidebar expand/collapse, header, and route transitions via AppShell.tsx and RouteTransition.tsx
- Chat components, message bubbles, typing indicator, and composer in ChatPanel.tsx, Chat/MessageBubble.tsx, Chat/Composer.tsx, app/chat/page.tsx
- Upload dropzones and staging progress in components/UploadDropzone.tsx and components/Upload/Dropzone.tsx plus UploadPanel.tsx and app/materials
- Analytics cards and Recharts animations in analytics components
- Motion utility in lib/motion.ts

## Layout and spacing
The Ocean Professional layout uses a clean, modern grid with light elevation and rounded surfaces.

What to verify
- Overall shell:
  - The main app uses a left sidebar and a sticky header with consistent horizontal padding (px-4 md:px-6) and compact header height 56 px as defined by .header-compact in globals.css.
  - Cards (.card) use rounded corners (radius 12 px/0.75rem) and soft shadow tokens.
  - Section blocks, such as page headers (gradient surface), maintain consistent vertical spacing between 16–24 px across sm/md and 24–32 px on larger screens.
- Chat canvas:
  - Message stack gap is about 12–16 px; maximum content width is constrained to 880 px via .chat-container.
  - Bubbles align left for assistant/system and right for user messages; no horizontal scrollbars in normal usage.
- Upload and analytics grids:
  - Standard grid spacing uses gap-4 and rounds to 16 px; cards keep consistent padding (p-4 or p-6).
- Elevation and hover:
  - Interactive cards use subtle lift by 1 px and add an elevated shadow only when motion is enabled.

Acceptance criteria
- Spacing scale appears consistent: base gaps and paddings are in the 12–16 px range; header remains ~56 px.
- No layout shift occurs when opening/closing overlays or dropzones.
- Cards and surfaces have consistent corner radii: 12 px for most surfaces; larger sections may use 16 px.

Screenshot guidance
- Full-page capture of: Home (/), Chat (/chat), Upload (/upload), Analytics (/analytics), Student (/student) with visible header and sidebar.
- Close-ups of a card surface, message bubble, and dropzone in both idle and hover states.

## Typography
The theme uses system sans fonts and tuned sizes for reading.

What to verify
- Headings in gradient page headers:
  - H1: 2xl at small screens and 3xl at md+ (per app/…/page.tsx headers).
- Body and prose:
  - Chat message content uses .prose-chat at ~15 px with line-height 1.65.
  - Metadata like timestamps are .msg-meta at ~12 px.
- Input placeholders and labels remain legible with sufficient contrast.

Acceptance criteria
- Headers and body sizes match the defined breakpoints (2xl→3xl at md).
- Chat text is comfortable to read without crowding; code blocks and blockquotes render with distinct styling.
- No text truncates unexpectedly within the 880 px chat container.

Screenshot guidance
- Chat transcript with mixed content (paragraphs, lists, blockquote, code snippet).
- Page header block with H1 and supporting paragraph.

## Color and contrast (WCAG AA)
Ocean Professional token decisions (globals.css) ensure AA for primary color on light backgrounds; secondary is mostly for accents.

What to verify
- Primary (#2563EB) on white and background (#f9fafb) achieves ≥ 5:1.
- Secondary (#F59E0B) is not used for body text on white, or if it is, the darker secondary-600 (#B45309) appears for text to reach AA/AAA.
- Button text and focus rings maintain AA contrast on their backgrounds.
- Links use readable blue hues; hover state is darker and remains AA.

Acceptance criteria
- All interactive text and core UI text meet WCAG AA for normal text.
- Focus rings are visible and meet contrast against surrounding surfaces.
- Secondary accent usage does not violate AA when used for text (secondary-600 if text is required).

Screenshot guidance
- Buttons (primary/secondary/destructive) in default/hover/disabled.
- A card with blue-tinted elements and a badge using amber tones.

## Components and states
Components include Buttons, Inputs, Badges, Cards, Modal, Sidebar, and Analytics components with stateful interactions.

What to verify
- Buttons: primary/secondary/subtle/destructive/ghost variants render correctly with hover, active (slight translateY), disabled (reduced opacity, no pointer events). Focus-visible ring appears.
- Inputs: sizes (sm/md/lg) render with consistent height, padding, border color on hover, and visible focus ring.
- Badges: small pill styling with variants (primary, secondary, subtle, success, destructive).
- Modal: overlay and card panel, Escape to close, focus-visible ring on close button, and focus management.
- Tables: rows and actions remain readable and align with the theme.
- Tooltips (sr-only): controls with aria-describedby have corresponding hidden hints.

Acceptance criteria
- Each component shows distinct hover/active/disabled states and a focus-visible ring. No tap target below 40 px height.
- Modal is dismissible with overlay click and Escape; role="dialog" with aria-modal="true" is present.

Screenshot guidance
- Buttons grid showcasing variants and states.
- Input focused versus hover and disabled.
- Modal open with overlay and close control.

## Animations and transitions (motion-safe)
Transitions are subtle and gated by prefers-reduced-motion and a runtime flag (data-reduce-motion="true").

What to verify
- Route transitions: slight fade+slide-in at 180–220 ms; no layout shift (RouteTransition + globals.css).
- Hover lift animations for cards are disabled when reduced motion is set.
- Keyframe animations for message enters and typing dots only occur under motion-safe conditions.

Acceptance criteria
- With default settings, subtle animations occur. With OS-level reduce motion or data-reduce-motion="true", animations are effectively disabled, transitions become minimal, and scroll-behavior is auto.
- No animation blocks user input or causes motion sickness risk.

Screenshot/gif guidance
- Short clips (or screen recordings) showing route transitions and typing dots with normal motion.
- A still image confirming no animation under reduced motion (e.g., motion flag enabled via DevTools).

## Chat experience specifics
Message bubbles, typing indication, and composer behavior mirror the design notes.

What to verify
- Message bubbles:
  - Assistant: slightly elevated blue-ish surface; border and subtle shadow.
  - User: light gray background and border.
  - System: neutral with a left primary color rule (4 px).
- Enter animations:
  - Assistant and user bubbles have a small fade/slide-in; user may slightly scale-in when motion is allowed.
- Typing indicator:
  - Three dot shimmer only when loading; min-height is reserved to avoid layout shift.
- Composer:
  - Quick actions: Attach, Search, Study, Voice with clear hover/active and keyboard focus.
  - Textarea auto-grows smoothly up to ~40% of viewport height; Enter sends, Shift+Enter new line.
  - Dragging files shows dashed border and labeled overlay; SR-only announcements for “Sending…” and errors.

Acceptance criteria
- Chat input supports Enter to send and Shift+Enter for newline. Focus and accessibility labels/roles are present.
- Bubbles align properly and wrap text without overflow; code blocks render correctly.
- Typing indicator does not cause layout jumps; it is hidden from screen readers to avoid noise.

Screenshot guidance
- A transcript showing assistant, user, and system messages; include timestamps and a code block.
- Composer in idle, typing, drag-over, and disabled (sending) states.

## Sidebar expand/collapse
The sidebar supports icons-only collapsed mode and expands to full width with label text.

What to verify
- Desktop:
  - Collapse toggle in header and in the sidebar footer toggles width (w-16 collapsed, ~280 px expanded) with a smooth transition.
  - When expanding, focus moves to the first interactive element in the sidebar to support keyboard users.
- Mobile:
  - Drawer slides from the left; overlay click closes it; the menu toggle updates aria-expanded and aria-controls.

Acceptance criteria
- Collapsed state hides labels visually (opacity 0 and slight translate), but provides aria-label/title on links.
- Expanded state reveals labels; focus management works; safeStorage persists the collapsed preference.

Screenshot guidance
- Collapsed and expanded side-by-side.
- Mobile drawer state with overlay visible.

## Upload dropzone interactions
Dropzones support drag-and-drop, selection, typed badges, micro progress, and polite error announcements.

What to verify
- Drag-over state: ring and blue-tinted surface with animated dashed border (motion-safe). Label updates to “Drop files to attach.”
- On unsupported files: polite aria-live error announces; message clears after ~3 seconds.
- Staging: file chips (PDF/PPT/PPTX…); progress bars advance with subtle shimmer until 100%.
- Keyboard parity: focus + Enter/Space opens the file picker.

Acceptance criteria
- Accepts supported file extensions; visually indicates progress; error announcements are accessible but unobtrusive.
- No layout jumps when preview items appear; items wrap gracefully.

Screenshot guidance
- Idle, drag-over, post-drop (with staged items), and error state.

## Analytics cards and charts
KPI cards and charts use motion-safe entrance animations and focus rings.

What to verify
- KPI cards: subtle elevation on hover; accessible labels via role="group" and text content.
- Recharts Line/Bar:
  - Series fades/slides in on mount when motion is allowed; disabled when reduced motion is preferred.
  - Tooltip and axes render in a readable way.

Acceptance criteria
- Cards are keyboard focusable and announce label/value; hover lift is disabled in reduced-motion mode.
- Charts mount without jank; series entrance is subtle and short (~180 ms).

Screenshot guidance
- Grid of cards showing different color tints.
- Line and bar charts with tooltips visible.

## Accessibility (focus, ARIA, keyboard)
Accessibility is enforced via focus-visible styles, ARIA attributes, and keyboard support.

What to verify
- Focus-visible rings:
  - All interactive elements (buttons, inputs, links, nav items) have a visible ring with sufficient contrast.
- Live regions:
  - Chat transcript and upload status errors use aria-live="polite"; typing indicator is aria-hidden.
- Landmarks:
  - Header role="banner", main role="main", footer role="contentinfo", sidebar role="navigation".
- Keyboard nav:
  - Skip link to #main appears when focused, moves focus correctly.
  - Composer: Enter/Shift+Enter behavior is correct.
  - Sidebar links are accessible in collapsed mode via aria-label/title.

Acceptance criteria
- All controls are reachable with Tab; focus order is logical and visible; Escape closes modals.
- No keyboard trap; nav labels are clear.

Screenshot guidance
- Focus ring states on primary controls (button, link, input, sidebar item).
- Skip link revealed on tabbing.

## Responsive breakpoints
The UI targets sm, md, lg, and xl with sensible breakpoints based on Tailwind defaults.

What to verify
- sm (mobile):
  - Sidebar hides; mobile drawer is used with correct overlay behavior.
  - Page headers and cards stack; paddings are reduced (px-4).
- md (tablet):
  - Page headers step to 3xl; grids become 2–3 columns where defined (e.g., analytics cards).
- lg/xl (desktop+):
  - Sidebar is pinned; grids expand; chat container remains at max 880 px and centered.

Acceptance criteria
- No horizontal scroll on any breakpoint.
- Touch targets remain ≥ 44 px where possible; composer and dropzones remain usable on mobile.

Screenshot guidance
- One capture at each breakpoint for Chat, Upload, and Analytics pages (including mobile drawer).

## Route and component transitions
Route-level transitions and in-page entrance effects must be subtle and not cause layout shift.

What to verify
- RouteTransition wraps page content and applies a route-transition-enter animation; container reserves space to avoid jolts.
- Chat message “enter” animations are reserved to most recent messages and are motion-safe.
- Charts animate on mount but do not shift layout.

Acceptance criteria
- Transitions are 150–220 ms ease-out; no excessive translation or opacity flicker.
- With reduced motion, no transitions remain.

Screenshot/gif guidance
- Quick recording of a route change and a fresh chart mount.

## Interactive states (hover/active/disabled)
Ensure consistent states across all interactive elements using u-transition and motion-safe classes.

What to verify
- Primary buttons: hover darkens to #1d4ed8; active moves down ~1 px.
- Secondary and ghost buttons: hover bg tints; disabled reduces opacity and disables pointer events.
- Sidebar items: left accent bar shows on hover/focus; active item uses blue background and text.

Acceptance criteria
- Hover and active are visually distinct while remaining subtle; disabled states are clearly non-interactive.
- Keyboard focus states are never removed or hidden.

Screenshot guidance
- Buttons and sidebar items in all three states, captured at normal and high-contrast modes if possible.

## Focus management and focus-visible styles
Focus styles and management behavior are defined globally in globals.css and used in key components.

What to verify
- Focus ring appears for keyboard navigation and is appropriately offset from the element.
- RouteTransition moves focus to <main> after a route change only when appropriate.
- Modal trap is not implemented (not required here), but Escape-to-close and overlay click are functional.

Acceptance criteria
- Focus rings present, readable, and do not get clipped by overflow or border-radius.
- No unexpected scroll when focus is moved to main.

Screenshot guidance
- Focused primary button, focused sidebar item (collapsed and expanded), focused input with ring.

## ARIA roles, labels, and live regions
The app uses ARIA to enhance accessibility and AT announcements.

What to verify
- Regions: chat area role="region"; transcript role="log" with aria-live="polite".
- Uploads: polite status regions for error/status messages; aria-atomic=true where sequence matters.
- Icons-only or condensed navigation provide aria-label or title attributes when labels are hidden.
- Tooltips for chips and icon buttons use aria-describedby linking to sr-only content.

Acceptance criteria
- All role/ARIA attributes are present and correct per component intent; no redundant or conflicting roles.
- Live region announcements do not spam AT users and clear after a reasonable time.

Screenshot guidance
- DevTools accessibility tree snapshot for chat transcript and upload error live region.

## Keyboard navigation (including toggles and quick actions)
Keyboard must be fully supported for all interactions.

What to verify
- Composer: Enter to send, Shift+Enter for newline; Tab into quick actions; Escape does not inadvertently clear input.
- Dropzones: Focusable; Enter/Space opens file dialog; drag-over states do not trap focus.
- Sidebar collapse toggle: Space/Enter triggers; aria-pressed reflects the state.

Acceptance criteria
- No keyboard traps; space/enter behavior is consistent.
- Focus management when expanding sidebar moves to the first interactive element.

Screenshot guidance
- Key sequences recorded for composer Send, sidebar collapse/expand, and upload browse.

## Reduced-motion behavior
Global motion disabling is implemented via prefers-reduced-motion and a data attribute (lib/motion.ts).

What to verify
- When prefers-reduced-motion is set or [data-reduce-motion="true"] is present:
  - Animations and transitions reduce to 1 ms; lift effects and route transitions are effectively disabled.
  - Typing indicator dots stop animating.
- When motion is enabled:
  - Subtle transitions occur, adhering to 150–220 ms ease-out tokens.

Acceptance criteria
- The UI remains fully usable and readable with motion disabled.
- There is a visible difference (animations disabled) without breaking component affordances.

Screenshot/gif guidance
- Animated vs reduced-motion comparison clips for chat typing indicator and card hover.

## Acceptance criteria and screenshots checklist
The release is acceptable when:
- Theme consistency: colors, spacing, shadows, and radii across pages match tokens in globals.css.
- Accessibility: all interactive elements have focus-visible styles; ARIA usage is correct; live regions announce only necessary changes.
- Motion: all animations are motion-safe and disabled in reduced-motion contexts.
- Responsiveness: layout has no horizontal scrollbars; controls are accessible and legible on sm/md/lg/xl breakpoints.
- Interactions: sidebar expand/collapse, upload dropzones, chat composer, and analytics charts demonstrate expected states.

Screenshot pack to include (at minimum):
- Home (/), Chat (/chat), Upload (/upload), Analytics (/analytics) at sm, md, lg.
- Sidebar collapsed/expanded, mobile drawer open.
- Buttons (all variants) in default/hover/active/disabled, input focus state.
- Chat transcript with assistant/user/system messages, typing indicator visible, composer drag-over.
- Dropzone idle, drag-over, with staged items, and error state.
- Analytics cards hover state and both charts rendered (with tooltips).

Appendix: Source references
- src/app/globals.css
- src/components/AppShell.tsx
- src/components/RouteTransition.tsx
- src/components/Chat/MessageBubble.tsx
- src/components/Chat/Composer.tsx
- src/components/UploadDropzone.tsx
- src/components/Upload/Dropzone.tsx
- src/components/analytics/AnalyticsCard.tsx
- src/components/analytics/BarChart.tsx
- src/components/analytics/LineChart.tsx
- src/app/page.tsx, src/app/chat/page.tsx, src/app/analytics/page.tsx
- src/lib/motion.ts
