# UI Interaction Test Plan and Manual Test Matrix — Socratic Learning Assistant

## Scope and Objectives
This document defines a comprehensive interaction test plan and manual test matrix for the Next.js frontend. It validates the end-to-end user experience of chat, uploads, navigation, analytics, accessibility, responsive behavior, and motion preferences, ensuring behavior matches the implemented code. It pairs with UI_QA_CHECKLIST.md, but focuses on preconditions, step-by-step procedures, and expected outcomes.

Goals:
- Verify critical user flows: composing and sending chat messages, quick actions and tooltips, sidebar expand/collapse, upload drag/drop with progress and error announcements, analytics interaction and mount animations, and route transitions between primary sections.
- Validate keyboard-only navigation and screen reader support across controls and interactive regions.
- Confirm reduced-motion behavior and cross-browser/responsive layouts across breakpoints.
- Document known limitations and out-of-scope items to guide QA focus.

Out of scope:
- Backend accuracy of AI responses or retrieval quality (mocked or basic API use is acceptable here).
- Persistence layers beyond what the UI already persists (e.g., sidebar collapse preference).
- Non-UI analytics correctness or complex chart data integrity (visual/interaction checks only).

References to implementation:
- src/app/globals.css
- src/components/AppShell.tsx
- src/components/RouteTransition.tsx
- src/components/Chat/Composer.tsx
- src/components/Chat/MessageBubble.tsx
- src/components/UploadDropzone.tsx
- src/components/Upload/Dropzone.tsx
- src/components/analytics/AnalyticsCard.tsx
- src/components/analytics/BarChart.tsx
- src/components/analytics/LineChart.tsx
- src/app/page.tsx
- src/app/chat/page.tsx
- src/app/materials/page.tsx
- src/app/analytics/page.tsx
- src/lib/motion.ts
- docs/UI_QA_CHECKLIST.md

## Environments/Browsers
Test on the following environments:
- Browsers (latest two stable versions):
  - Chrome (Windows/Mac)
  - Firefox (Windows/Mac)
  - Safari (macOS)
  - Edge (Windows)
- Devices/OS:
  - macOS desktop/laptop
  - Windows desktop/laptop
  - iOS and Android for responsive verification (mobile Safari/Chrome)
- Accessibility tooling:
  - Screen reader: VoiceOver (macOS), NVDA (Windows)
  - Browser DevTools for emulating reduced motion, throttled CPU/network when needed

## Accessibility Aids and Screen Reader Expectations
Accessibility patterns implemented in the codebase:
- Landmarks and regions:
  - AppShell header role="banner", main role="main", footer role="contentinfo", sidebar role="navigation"
  - RouteTransition focuses main on route change when appropriate
  - Chat transcript uses role="log" and aria-live="polite" (app/chat/page.tsx)
- Composer:
  - SR-only tooltips via aria-describedby for quick actions and send button
  - Inline sending indicator using aria-live="polite" and aria-atomic="true"
  - Attach buttons and drag-over hint use labels and accessible names
- Upload:
  - Polite aria-live regions for errors and status; keyboard parity for Enter/Space to open file picker, drag/drop with announcements
- Charts and Cards:
  - AnalyticsCard is focusable with role="group" and accessible label including title/value
  - Recharts components are wrapped in focusable card containers
- Sidebar:
  - Collapsed state exposes aria-label/title for icon-only nav; toggles expose aria-pressed and aria-controls
- Motion:
  - Animations and transitions are gated by prefers-reduced-motion and a runtime attribute [data-reduce-motion="true"] via lib/motion.ts

Screen reader expectations:
- Focus order follows DOM, with visible focus ring on all interactive items.
- Live regions announce sending state, upload errors, and key status messages without spamming.
- Icon-only navigation items must have descriptive aria-label/title.
- Route changes move focus to main only when no element is already focused.

## Test Scenarios with Preconditions, Steps, and Expected Results

### 1) Chat composing/sending flow
Components: ChatPage, Composer, MessageBubble, globals.css

Preconditions:
- Navigate to /chat.
- Ensure network available.
- Optional: Open DevTools to observe console errors (none expected).

Steps:
1. Place focus in the composer textarea. Type: “What topics are covered in Syllabus.pdf?”
2. Press Shift+Enter to insert a newline; verify newline appears and caret moves down.
3. Press Enter (without Shift) to send.
4. Observe composer value clears and an inline “Sending...” is announced via SR (aria-live="polite").
5. Wait for assistant message to appear (mocked API response).
6. Scroll behavior: end of transcript is kept in view.

Expected Results:
- Enter sends; Shift+Enter adds a newline.
- Sending state sets aria-busy on send button and shows “Sending...” in live region.
- New user/assistant messages animate in subtly (motion-safe) using msg-enter or msg-enter-user classes; user messages may slightly scale in.
- Assistant messages align left; user messages align right; system messages (if any) have left rule.
- No layout shift or overflow; chat container width respects max 880px.

Typing indicator (if implemented in future):
- If displayed, must have motion-safe shimmer and be aria-hidden, with minimal reserved height (typing-bubble) to avoid layout jump.

### 2) Composer quick actions and tooltips
Components: Composer

Preconditions:
- On /chat.

Steps:
1. Tab through quick action chips: Attach, Search, Study, Voice.
2. Hover each chip and verify hover styles; press Space/Enter to activate.
3. For Attach: it should open the file picker (if permissions allow) or focus the hidden input.
4. For Search: focus should return to textarea.
5. For Study: textarea should append a “Help me study…” template and focus textarea.
6. For Voice: alert “Voice input coming soon.” appears.

Expected Results:
- Each chip is focusable, shows focus ring, and responds to keyboard activation.
- aria-describedby tooltips exist (sr-only) with matching IDs; no visible tooltips expected.
- Attach button in toolbar also triggers file picker and includes proper title and aria-label.

### 3) Sidebar toggle expand/collapse and navigation
Components: AppShell

Preconditions:
- On any page within the app (/, /chat, /materials, /analytics).

Steps:
1. Desktop: Click the Collapse toggle (header or sidebar). Sidebar narrows to icons-only.
2. Confirm label texts fade out and are not focusable; aria-label/title is present on each nav link.
3. Click Expand toggle; focus should move to the first interactive element in the sidebar.
4. Mobile: Narrow viewport to sm. Click the menu button in header; overlay appears and drawer slides in.
5. Click overlay or toggle button to close; aria-expanded updates properly.

Expected Results:
- Collapsing switches width to w-16; expanding to ~w-[280px], with smooth transitions (motion-safe).
- Focus management on expand puts focus into the sidebar.
- Mobile overlay captures click to close drawer; aria-controls and aria-expanded reflect state.

### 4) Upload drag/drop with progress and error announcements
Components: UploadDropzone (generic), Upload/Dropzone (materials page)

Preconditions:
- For generic: integrate UploadDropzone in a test surface or verify Upload/Dropzone on /materials.
- Prepare two files: a supported (pdf or pptx) and an unsupported (e.g., .exe) file.

Steps:
1. Navigate to /materials.
2. Drag a supported file onto the dropzone; observe blue tint ring and dashed border animation.
3. Drop file; verify badge preview and micro-progress increase (shimmer until complete).
4. Drag & drop an unsupported file; verify polite error announces via SR, then clears after ~3s.
5. With dropzone focused, press Enter to open file picker. Select multiple supported files; verify staged previews with progress.
6. Click Upload; verify “Uploading...” state then items added to list as “Processing” and later “Ready”.

Expected Results:
- Drag-over adds ring, label changes to “Drop files to …”.
- Unsupported files trigger aria-live error announcements, non-blocking.
- Micro progress bars increase to 100%, shimmer while <100%.
- Keyboard parity works (Enter/Space opens file picker).
- Items appear with status badges and transition to Ready.

### 5) Analytics card/chart interactions and hover/mount animations
Components: AnalyticsCards, AnalyticsCard, BarChart, LineChart

Preconditions:
- Navigate to /analytics.

Steps:
1. Observe KPI cards grid. Tab into each card; verify focus ring and readable label.
2. Mouse hover any card; it should subtly lift and elevate (motion-safe).
3. Observe charts on initial mount. Lines/bars should fade/slide in quickly (≤220ms) when motion allowed.
4. Hover chart to see Tooltip; check axes readability.

Expected Results:
- AnalyticsCard shows hover lift only when motion is allowed; focus ring is visible during keyboard focus.
- Recharts series have enter classes changing from “enter” to “entered” after mount.
- Tooltip appears, text is legible, no layout shift occurs.

### 6) Route transitions between /chat, /materials, /analytics
Components: RouteTransition, AppShell, globals.css

Preconditions:
- Start at /chat.

Steps:
1. Navigate to /materials, then /analytics, then back to /chat using sidebar links.
2. Observe subtle fade+slide-in on page content (route-transition-enter).
3. Verify focus moves to main after navigation only when nothing else is focused.

Expected Results:
- Transitions run at ~180–220ms ease-out; no content jank.
- Focus management honors current focus; main receives focus otherwise.
- Reduced motion mode disables route transitions (see reduced motion test).

### 7) Keyboard-only navigation for all controls
Components: AppShell, Composer, Upload Dropzones, Analytics Cards/Charts

Preconditions:
- Turn off mouse; use keyboard only.
- Confirm skip link behavior if present.

Steps:
1. Tab through header controls, sidebar nav items, and into main content controls.
2. On /chat: Tab to composer, use Shift+Enter for newline and Enter to send.
3. On /materials: Tab to dropzone; press Enter to open file picker (cancel if not selecting). Use Tab to reach Upload button when files are selected, press Enter to activate.
4. On /analytics: Tab through KPI cards and charts; ensure focus remains visible and logical.

Expected Results:
- Logical focus order; visible focus ring (focus-ring utility).
- No keyboard traps; toggles respond to Space/Enter; aria-pressed updates where applicable.
- All important controls are reachable, including sidebar collapse toggle and menu on mobile.

### 8) Screen reader expectations: ARIA roles/labels/live regions
Components: AppShell, Composer, ChatPage, Upload Dropzones, Analytics

Preconditions:
- Launch screen reader (VoiceOver/NVDA).

Steps:
1. On route change, verify focus moves to main landmark if no focused element exists.
2. On /chat: Send a message; SR should announce “Sending…” (polite) and subsequent assistant reply within transcript log region.
3. On /materials: Drop an unsupported file; SR should announce polite error once and it should clear after a few seconds.
4. On collapsed sidebar: Verify nav links are announced with appropriate labels.

Expected Results:
- Landmarks announced correctly (banner, navigation, main, contentinfo).
- Live regions announce pertinent status messages without repetition or noise.
- Collapsed nav provides clear labels for icon-only items.

### 9) Reduced motion behavior
Components: globals.css, lib/motion.ts, charts, bubbles, route transitions

Preconditions:
- In OS settings or DevTools, enable “Reduce Motion”.
- Alternatively, programmatically apply [data-reduce-motion="true"] on html element.

Steps:
1. With reduced motion active, navigate between routes and observe absence of enter animations.
2. On /chat: Send messages; bubbles should appear without fade/slide/scale animations.
3. On /analytics: Reload page; chart series should appear without mount animations; analytics card hover lift should not translate or increase shadow.

Expected Results:
- Transitions reduce to effectively 1ms; hover lift disabled; typing dots (if used) stop animating.
- UI remains fully usable and visually stable.

### 10) Cross-browser and responsive sizing matrix
Components: All

Preconditions:
- Prepare common test content (messages in chat, a few staged uploads, analytics charts visible).

Steps:
1. Validate rendering and interactions on Chrome, Firefox, Safari, and Edge.
2. Resize to sm, md, lg, xl and verify layout adjustments (sidebar, grid changes, chat container max width, header sizes).

Expected Results:
- No horizontal scrollbars or layout breaks at breakpoints.
- Controls remain accessible and legible; cards/charts reflow properly.
- Animations/hover behaviors consistent with motion preferences per browser.

## Keyboard-only Navigation Matrix
For each control, verify Tab reachability, focus ring, activation keys, and ARIA state:

- Sidebar
  - Items: Tab focusable; Enter/Space activates navigation. Collapsed: item has aria-label/title; labels visually hidden.
  - Collapse toggle: Tab focusable; Enter/Space toggles; aria-pressed updates; aria-controls references sidebar.
  - Mobile menu button: Tab focusable; Enter/Space toggles; aria-expanded reflects state.

- Chat Composer
  - Quick actions: Tab focusable; Enter/Space activates; aria-describedby links to SR-only tooltips.
  - Textarea: Enter sends; Shift+Enter newline; focus ring on container buttons.
  - Send button: Disabled state blocks Enter/Space; aria-busy set when sending.

- Upload Dropzones
  - Dropzone surface: Tab focusable (role="button"); Enter/Space opens file picker; drag-over states do not trap focus.
  - Browse label/input: Accessible name “Choose files”; Enter triggers file dialog.
  - Upload button: Tab focusable; Enter triggers upload; disabled state when busy.

- Analytics
  - Cards: Tab focusable role="group"; Enter/Space not required but focus ring visible; label announced.
  - Charts: Card wrapper focusable; Tooltip on hover; no keyboard trap.

Expected: All controls accessible via keyboard alone; no unexpected focus loss.

## Reduced-motion Verification Steps
- Enable OS-level reduce motion or set data-reduce-motion="true" using DevTools.
- Verify:
  - Route transitions do not animate.
  - Message bubbles render immediately with no animation.
  - Upload progress still updates width but without shimmer.
  - Analytics cards do not lift on hover; charts appear without mount transitions.
- Disable reduced motion and repeat to confirm animations return.

## Responsive Breakpoints Matrix (sm/md/lg/xl)
- sm (≤640px):
  - Sidebar hidden behind mobile drawer; header compact; cards stack to 1 column; chat composer fits viewport width.
  - Verify mobile menu toggle and overlay behavior.

- md (≥768px):
  - Page headers step up (h1 text-3xl where defined); analytics grids move to 2–3 columns; chat container remains centered.

- lg (≥1024px) and xl (≥1280px):
  - Sidebar pinned; two-column layouts for analytics/cards/charts; chat transcript height stable (no overflow beyond container).
  - Ensure no horizontal scroll and adequate spacing.

For each breakpoint:
- Verify touch targets ≥44px where possible, focus visibility, and proper wrapping of staged upload items.

## Known Limitations and Out-of-Scope
- Voice input action in composer is a placeholder (alert only).
- Analytics data is mock; charts verify visuals and interactions, not metric accuracy.
- Typing indicator in chat is referenced by styles but not rendered by default in app/chat/page.tsx.
- No explicit active nav state style is enforced across routes in this plan; focus behavior and labels are the priority.
- Modal behaviors are not central to current flows; ensure any modals adhere to focus management if added later.

## Cross-Browser/Responsive Sizing Matrix (Concise)
- Chrome, Firefox, Safari, Edge:
  - Route transitions: subtle on default; none on reduced motion.
  - Chat: Enter-to-send and Shift+Enter behave identically; bubbles render without overflow.
  - Uploads: Drag/drop, keyboard parity, error announcements consistent.
  - Analytics: Cards hover behavior consistent; Recharts mount animations controlled by motion.
  - Responsive: No horizontal scroll; drawer and overlays work on mobile.

## Conclusion
Executing this plan verifies the UI’s primary interactions, accessibility, motion preferences, and responsive behavior are consistent with the implemented code. Use UI_QA_CHECKLIST.md in conjunction for visual polish checks. Deviations should be logged with steps, environment, and screenshots/video to aid reproduction and fixes.

Sources:
- src/app/globals.css
- src/components/AppShell.tsx
- src/components/RouteTransition.tsx
- src/components/Chat/Composer.tsx
- src/components/Chat/MessageBubble.tsx
- src/components/UploadDropzone.tsx
- src/components/Upload/Dropzone.tsx
- src/components/analytics/AnalyticsCard.tsx
- src/components/analytics/BarChart.tsx
- src/components/analytics/LineChart.tsx
- src/app/page.tsx
- src/app/chat/page.tsx
- src/app/materials/page.tsx
- src/app/analytics/page.tsx
- src/lib/motion.ts
- docs/UI_QA_CHECKLIST.md
