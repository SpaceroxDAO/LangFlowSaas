# Langflow Design Match Specification

This document details every visual element from Langflow's UI and the exact changes needed to match it in our frontend.

---

## Part 1: Langflow UI Analysis (from Screenshots)

### 1.1 Color Palette

| Element | Langflow Value | Notes |
|---------|---------------|-------|
| Page background | `#FFFFFF` (pure white) | Not off-white/gray |
| Sidebar background | `#FFFFFF` (white) | Light sidebar, NOT dark |
| Primary buttons | `#000000` (black) | "+ New Flow" is black |
| Button text | `#FFFFFF` (white) | On black buttons |
| Primary text | `#000000` or `#111827` | Nearly black |
| Secondary text | `#6B7280` (gray-500) | Timestamps, descriptions |
| Muted text | `#9CA3AF` (gray-400) | Placeholders |
| Borders | `#E5E7EB` (gray-200) | Subtle gray borders |
| Selected item | `#F3F4F6` (gray-100) | Light gray highlight |
| Hover | `#F9FAFB` (gray-50) | Very subtle hover |
| Flow icons | Gradient colors | Pink, cyan, purple, coral, etc. |

### 1.2 Typography

| Element | Langflow Style |
|---------|---------------|
| Font family | Inter, system-ui, sans-serif |
| Page title | 18-20px, font-medium (500), normal case |
| Flow name | 14-15px, font-medium (500) |
| Timestamp | 13-14px, font-normal (400), gray |
| Tab labels | 14px, font-normal, underline active |
| Button text | 14px, font-medium (500) |
| Sidebar header | 12px, font-semibold, uppercase |
| Search placeholder | 14px, font-normal, gray-400 |

### 1.3 Sidebar (Langflow)

```
Width: 160-180px (narrow)
Background: White (#FFFFFF)
Border: None or very subtle gray-200 right border

Structure:
┌─────────────────────┐
│ [Logo] Projects ⬆️ ＋ │  <- Header with upload/add icons
├─────────────────────┤
│ • Starter Project ... │  <- Project row (selected = gray bg)
│                       │
│                       │
│                       │
│                       │
├─────────────────────┤
│ 📁 My Files           │  <- Bottom link (simple text)
└─────────────────────┘

Project row:
- No expand arrow
- Simple text, hover shows gray background
- Three-dot menu on right
- Selected = #F3F4F6 background
```

### 1.4 Main Content Header

```
┌─────────────────────────────────────────────────────────────────┐
│ Starter Project                               [+ New Flow] (black)│
│ ═══════════                                                       │
│ Flows   MCP Server  (tabs with underline active)                 │
└─────────────────────────────────────────────────────────────────┘

Title: "Starter Project"
- Normal case (NOT uppercase)
- Font-medium weight
- ~20px size
- No "Default" badge in main area

Tabs:
- "Flows" | "MCP Server"
- Active tab has underline
- Normal font weight
- ~14px size
```

### 1.5 Toolbar

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔍 Search flows...                                    ≡  ⊞     │
└─────────────────────────────────────────────────────────────────┘

Search input:
- Left-aligned search icon (gray-400)
- Placeholder: "Search flows..."
- No visible border (or very subtle gray-200)
- ~300px width
- Gray background or white with subtle border

View toggle:
- Two simple icons (list ≡, grid ⊞)
- No container/border around icons
- Active icon is darker (black), inactive is gray
- ~20px icon size
```

### 1.6 Flow List Items

```
┌─────────────────────────────────────────────────────────────────┐
│ [●] Charlie the car salesment (Copy) - 974a...7c  Edited 10m ago ⋯│
│ [●] Support Bot - 974a39d3...                     Edited 1h ago  ⋯│
│ [●] Charlie the car salesment - 974a...           Edited 1h ago  ⋯│
└─────────────────────────────────────────────────────────────────┘

Row structure:
- Height: ~48-52px
- Padding: 12px horizontal
- Border-bottom: 1px gray-200 (subtle)

Elements (left to right):
1. Colored circle icon (~32px, gradient colors)
2. Flow name (font-medium, black)
3. " - " + UUID fragment (gray text, optional)
4. "Edited X ago" (gray-500, right-aligned or inline)
5. Three-dot menu "..." (horizontal, gray, on hover/always)

NO "Active" badge in Langflow
NO checkbox/bulk select in list view
Menu icon: "..." horizontal (not vertical ⋮)
```

### 1.7 Pagination

```
┌─────────────────────────────────────────────────────────────────┐
│ 1-12 of 204 flows               [1 ▼] of 17 pages    ◀  ▶      │
└─────────────────────────────────────────────────────────────────┘

Left: "1-12 of 204 flows" (gray text)
Center: Page dropdown "[1 ▼]" + "of 17 pages"
Right: < > navigation arrows
```

### 1.8 Flow Item Menu (Dropdown)

When clicking "..." on a flow:
- Edit details
- Export
- Duplicate
- Delete

Simple dropdown, white background, subtle shadow

---

## Part 2: Our Current UI vs Langflow

| Element | Our Current | Langflow | Change Needed |
|---------|-------------|----------|---------------|
| Sidebar bg | `bg-gray-900` (dark) | White | Change to white |
| Sidebar width | 256px (`w-64`) | ~160px | Reduce width |
| Primary button | Violet-500 | Black | Change to black |
| "New Agent" location | Sidebar bottom | Main header | Move button |
| Tabs | None | "Flows / MCP Server" | Add tabs |
| Flow items | Cards with borders | Simple rows | Simplify |
| Active badge | Green "Active" | Not shown | Remove |
| View toggle | Bordered container | Simple icons | Simplify |
| Three-dot menu | Vertical ⋮ | Horizontal ⋯ | Change orientation |
| Pagination format | "Page X of Y" | "1-12 of N flows" | Match format |
| Project title | Title case, bold | Normal case, medium | Adjust |
| Bulk select | Has button | Hidden | Remove from toolbar |

---

## Part 3: Detailed Implementation Plan

### Step 1: CSS/Theme Updates (index.css)

```css
/* Change from dark theme to light theme */
--color-sidebar: #FFFFFF;
--color-sidebar-hover: #F3F4F6;
--color-sidebar-active: #F3F4F6;
--color-sidebar-border: #E5E7EB;
--color-sidebar-text: #111827;
--color-sidebar-text-muted: #6B7280;

/* Primary action buttons = black */
--color-primary-button: #000000;
--color-primary-button-hover: #1F2937;
```

### Step 2: Sidebar.tsx Changes

**Before:**
```tsx
<div className="w-64 h-full bg-gray-900 flex flex-col">
```

**After:**
```tsx
<div className="w-44 h-full bg-white border-r border-gray-200 flex flex-col">
```

Changes:
- [ ] Width: `w-64` → `w-44` (176px to match Langflow's ~160-180px)
- [ ] Background: `bg-gray-900` → `bg-white`
- [ ] Add right border: `border-r border-gray-200`
- [ ] Text colors: white/gray-300 → black/gray-600
- [ ] Remove "New Agent" button from sidebar
- [ ] Header: Keep logo, remove collapse button or make subtle
- [ ] Project items: Simple text, gray hover, no cards
- [ ] "My Files" stays at bottom, simple link style

### Step 3: ProjectDetailPage.tsx Changes

**Header Section:**
- [ ] Project name: Normal case (not bold), `font-medium text-lg`
- [ ] Remove "Default" badge from main area (keep in sidebar if needed)
- [ ] Add tabs: "Flows" (active) | (optional second tab)
- [ ] Move "+ New Agent" button: Black bg, white text, right side

**Toolbar Section:**
- [ ] Remove bordered container
- [ ] Search: Simpler style, subtle border or borderless
- [ ] View toggle: Simple icons without container
- [ ] Remove bulk select button from default view
- [ ] Remove "Select all" button

**Agent List (List View):**
- [ ] Remove cards, use simple rows
- [ ] Remove "Active" badge
- [ ] Change vertical ⋮ to horizontal ⋯
- [ ] Format: Icon | Name | Timestamp | Menu
- [ ] Subtle row borders (border-b border-gray-100)

**Pagination:**
- [ ] Format: "1-12 of X agents" | Page selector | "of Y pages" | < >

### Step 4: Component Color Updates

All components need color updates:

| Find | Replace With |
|------|--------------|
| `bg-violet-500` (primary buttons) | `bg-black` |
| `hover:bg-violet-600` | `hover:bg-gray-800` |
| `text-violet-*` (accents) | `text-gray-900` or `text-black` |
| `ring-violet-*` | `ring-gray-400` |
| `focus:ring-violet-500` | `focus:ring-gray-400` |
| `border-violet-*` | `border-gray-300` |
| `bg-violet-100` (light accents) | `bg-gray-100` |

**Keep violet only for:**
- Flow/agent icons (colored gradient circles)
- Active states in specific places

### Step 5: Agent/Flow Icons

Langflow uses colorful gradient circle icons. Match this:
```tsx
// Gradient icon colors (rotate through these)
const iconColors = [
  'from-pink-500 to-rose-500',    // Pink/coral
  'from-cyan-500 to-blue-500',    // Cyan
  'from-purple-500 to-violet-500', // Purple
  'from-green-500 to-emerald-500', // Green
  'from-orange-500 to-amber-500',  // Orange
]

// Icon component
<div className={`w-8 h-8 rounded-full bg-gradient-to-br ${iconColor} flex items-center justify-center`}>
  <svg className="w-4 h-4 text-white" ...>
</div>
```

### Step 6: Files to Update

1. **src/index.css** - Theme variables
2. **src/components/Sidebar.tsx** - Complete restyling
3. **src/pages/ProjectDetailPage.tsx** - Header, toolbar, list items
4. **src/pages/ProjectsPage.tsx** - Button colors, styling
5. **src/pages/PlaygroundPage.tsx** - Button colors
6. **src/pages/CreateAgentPage.tsx** - Button colors
7. **src/pages/EditAgentPage.tsx** - Button colors
8. **src/pages/FilesPage.tsx** - Button colors
9. **src/pages/SettingsPage.tsx** - Button colors
10. **src/components/AppShell.tsx** - If header changes needed
11. **src/components/Pagination.tsx** - Format changes
12. **src/components/ShareDeployModal.tsx** - Button colors

---

## Part 4: Visual Reference

### Sidebar (Target)
```
┌──────────────────┐
│ ⚡ Projects  ⬆️ + │
├──────────────────┤
│ Starter Project ⋯│ <- Gray bg when selected
│                  │
│                  │
│                  │
├──────────────────┤
│ 📁 My Files      │
│ ⚙️ Settings      │
└──────────────────┘
```

### Project Detail Page (Target)
```
┌──────────────────────────────────────────────────────────────┐
│ Starter Project                                [+ New Agent] │
│ ══════════════                                    (black btn)│
│ Flows                                                        │
├──────────────────────────────────────────────────────────────┤
│ 🔍 Search agents...                               ≡  ⊞      │
├──────────────────────────────────────────────────────────────┤
│ [●] Agent Name                              Edited 10m ago ⋯ │
│ [●] Another Agent                           Edited 1h ago  ⋯ │
│ [●] Third Agent                             Edited 2h ago  ⋯ │
├──────────────────────────────────────────────────────────────┤
│ 1-3 of 3 agents                    [1 ▼] of 1 pages    ◀  ▶ │
└──────────────────────────────────────────────────────────────┘
```

---

## Part 5: Implementation Order

1. **Phase A: Base Theme (30 min)**
   - Update index.css with new color variables
   - Create utility classes for black buttons

2. **Phase B: Sidebar (45 min)**
   - Complete Sidebar.tsx rewrite
   - White bg, narrow width, simple rows

3. **Phase C: Project Detail Page (60 min)**
   - Add tabs
   - Move New Agent button to header
   - Simplify toolbar
   - Update list view to match Langflow

4. **Phase D: Button Colors (30 min)**
   - Update all primary buttons to black
   - Update all accent colors

5. **Phase E: Other Pages (30 min)**
   - Apply consistent styling across all pages

6. **Phase F: Testing (30 min)**
   - Visual comparison with Langflow screenshots
   - Ensure all interactions work

---

## Part 6: Success Criteria

- [ ] Sidebar is white with narrow width (~160-180px)
- [ ] Primary buttons are black (not violet)
- [ ] Project title is normal case, medium weight
- [ ] Agent list uses simple rows (no cards in list view)
- [ ] No "Active" badge shown on agents
- [ ] Three-dot menu is horizontal (⋯)
- [ ] Pagination shows "1-12 of X agents" format
- [ ] View toggle icons have no container/border
- [ ] Overall color scheme is black/white/gray (minimal color)
- [ ] Only agent icons have colorful gradients
