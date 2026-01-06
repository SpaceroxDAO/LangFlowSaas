# Langflow UI CSS Selectors for Progressive Disclosure Overlay System

**Last Updated**: 2026-01-05
**Langflow Version**: Latest (Docker image `langflowai/langflow:latest`)
**Purpose**: Document CSS selectors for hiding/showing UI elements in the educational overlay system

## Overview

This document maps the Langflow UI elements to their CSS selectors, enabling the progressive disclosure overlay system to hide advanced features from beginners and reveal them as users progress.

## UI Layout Structure

```
+------------------------------------------------------------------+
|  [data-testid="app-header"]  - Top Header/Toolbar                 |
|  (Back button, Flow name, GitHub stars, Notifications, User menu) |
+------------------+-----------------------------------------------+
| [data-testid=    |                                               |
| "shad-sidebar"]  |  [data-testid="rf__wrapper"]                  |
|                  |  .react-flow                                  |
| Left Sidebar     |                                               |
| - Search         |  CANVAS AREA                                  |
| - Components     |  (Nodes, Edges, Background)                   |
| - MCP            |                                               |
| - Bundles        |                                               |
| - Sticky Notes   |                     [Playground] [Share v]    |
|                  |                                               |
| Component        |                                               |
| Categories:      |                                               |
| - Input/Output   |                                               |
| - Data Sources   |                                               |
| - Models/Agents  |                                               |
| - LLM Operations |                                               |
| - Files          |                                               |
| - Processing     |                                               |
| - Flow Control   |                                               |
| - Utilities      |                                               |
|                  +-----------------------------------------------+
| [New Custom      | [Logs]                    [Lock][50%][Help]   |
|  Component]      | [data-testid=             [data-testid=       |
|                  |  "canvas_controls"]        "main_canvas_      |
|                  |                            controls"]         |
+------------------+-----------------------------------------------+
```

## CSS Selectors by UI Region

### 1. Header / Top Toolbar

**Primary Selector**: `[data-testid="app-header"]`

| Element | Selector | Description |
|---------|----------|-------------|
| Full Header | `[data-testid="app-header"]` | Top 48px navigation bar |
| Left Section | `[data-testid="header_left_section_wrapper"]` | Contains back button |
| Back Button | `[data-testid="icon-ChevronLeft"]` | Navigate back to projects |
| Flow Name Display | `[data-testid="menu_bar_display"]` | Clickable flow name area |
| Flow Name Text | `[data-testid="flow_name"]` | The actual flow name |
| Right Section | `[data-testid="header_right_section_wrapper"]` | Contains notifications/user |
| Notification Button | `[data-testid="notification_button"]` | Bell icon for notifications |
| User Menu Button | `[data-testid="user_menu_button"]` | User avatar/profile menu |

**CSS Classes**:
```css
[data-testid="app-header"] {
  /* z-10 flex h-[48px] w-full items-center justify-between border-b pr-5 pl-2.5 */
}
```

### 2. Left Sidebar (Component Panel)

**Primary Selector**: `[data-testid="shad-sidebar"]`

| Element | Selector | Description |
|---------|----------|-------------|
| Sidebar Container | `[data-testid="shad-sidebar"]` | Main sidebar wrapper |
| Search Nav Button | `[data-testid="sidebar-nav-search"]` | Search icon in nav |
| Components Nav Button | `[data-testid="sidebar-nav-components"]` | Components icon in nav |
| MCP Nav Button | `[data-testid="sidebar-nav-mcp"]` | MCP icon in nav |
| Bundles Nav Button | `[data-testid="sidebar-nav-bundles"]` | Bundles icon in nav |
| Sticky Notes Nav Button | `[data-testid="sidebar-nav-add_note"]` | Sticky notes icon |
| Search Input | `[data-testid="sidebar-search-input"]` | Search components input |
| Options Trigger | `[data-testid="sidebar-options-trigger"]` | Settings gear icon |
| New Custom Component | `[data-testid="sidebar-custom-component-button"]` | Create custom component |

**Component Categories** (collapsible sections):

| Category | Selector |
|----------|----------|
| Input & Output | `[data-testid="disclosure-input & output"]` |
| Data Sources | `[data-testid="disclosure-data sources"]` |
| Models & Agents | `[data-testid="disclosure-models & agents"]` |
| LLM Operations | `[data-testid="disclosure-llm operations"]` |
| Files | `[data-testid="disclosure-files"]` |
| Processing | `[data-testid="disclosure-processing"]` |
| Flow Control | `[data-testid="disclosure-flow control"]` |
| Utilities | `[data-testid="disclosure-utilities"]` |

**CSS Classes**:
```css
[data-testid="shad-sidebar"] {
  /* absolute inset-y-0 z-50 flex h-full transition-[left,right,width]
     duration-200 ease-linear w-[--sidebar-width] */
}

/* Sidebar wrapper */
.group\/sidebar-wrapper {
  /* flex h-full w-full text-foreground */
}
```

### 3. Canvas / Flow Editor

**Primary Selector**: `[data-testid="rf__wrapper"]` or `.react-flow`

| Element | Selector | Description |
|---------|----------|-------------|
| React Flow Wrapper | `[data-testid="rf__wrapper"]` | Main canvas container |
| Canvas Container | `#react-flow-id` | Canvas element by ID |
| Renderer | `.react-flow__renderer` | Rendering layer |
| Pane (Draggable area) | `.react-flow__pane` | Draggable canvas area |
| Viewport | `.react-flow__viewport` | Viewport for zoom/pan |
| Edges Container | `.react-flow__edges` | All edges/connections |
| Nodes Container | `.react-flow__nodes` | All nodes |
| Background | `[data-testid="rf__background"]` | Canvas background pattern |

**CSS Classes**:
```css
[data-testid="rf__wrapper"] {
  /* react-flow theme-attribution light */
}

.bg-canvas {
  /* Canvas background color */
}
```

### 4. Canvas Controls

#### Bottom-Left Controls (Logs)

**Selector**: `[data-testid="canvas_controls"]`

```css
[data-testid="canvas_controls"] {
  /* react-flow__panel react-flow__controls !m-2 rounded-md bottom left */
}
```

#### Bottom-Right Controls (Lock, Zoom, Help)

**Selector**: `[data-testid="main_canvas_controls"]`

| Element | Selector | Description |
|---------|----------|-------------|
| Controls Container | `[data-testid="main_canvas_controls"]` | Bottom-right panel |
| Lock Status | `[data-testid="lock-status"]` | Lock/unlock toggle |
| Zoom Dropdown | `[data-testid="canvas_controls_dropdown"]` | Zoom percentage dropdown |

```css
[data-testid="main_canvas_controls"] {
  /* react-flow__panel react-flow__controls !left-auto !m-2 flex !flex-row
     rounded-md border border-border bg-background */
}
```

#### Top-Right Controls (Playground, Share)

**Selector**: `.react-flow__panel.top.right`

| Element | Selector | Description |
|---------|----------|-------------|
| Playground Button | `[data-testid="playground-btn-flow-io"]` | Opens playground dialog |
| Share Button | `[data-testid="publish-button"]` | Opens share menu |

#### Floating Controls (when sidebar collapsed)

When the sidebar is collapsed, a mini toolbar appears:

| Element | Selector | Description |
|---------|----------|-------------|
| Search | `[data-testid="search"]` | Search button |
| Components | `[data-testid="components"]` | Components button |
| MCP | `[data-testid="mcp"]` | MCP button |
| Bundles | `[data-testid="bundles"]` | Bundles button |
| Add Note | `[data-testid="add_note"]` | Add sticky note |

### 5. Nodes

| Element | Selector | Description |
|---------|----------|-------------|
| Generic Node | `.react-flow__node-genericNode` | Any node |
| Node Main Wrapper | `[data-testid$="-main-node"]` | Node content wrapper |
| Node Title | `[data-testid^="title-"]` | Node title text |
| Node Description | `[data-testid="generic-node-desc"]` | Node description |
| Run Button | `[data-testid^="button_run_"]` | Execute node button |
| Source Handle (right) | `.react-flow__handle-right` | Output connection point |
| Target Handle (left) | `.react-flow__handle-left` | Input connection point |
| Selected Node | `.react-flow__node.selected` | Currently selected node |

**Node-specific selectors** (examples):
- Chat Input node: `[data-testid="rf__node-ChatInput-{id}"]`
- Chat Output node: `[data-testid="rf__node-ChatOutput-{id}"]`
- Agent node: `[data-testid="rf__node-Agent-{id}"]`

**When node is selected**, additional options appear:
- Code button
- Controls button
- Tool Mode toggle

### 6. Edges (Connections)

| Element | Selector | Description |
|---------|----------|-------------|
| Edges Container | `.react-flow__edges` | All edges wrapper |
| Individual Edge | `[data-testid^="rf__edge-"]` | Single edge |
| Edge Path | `.react-flow__edge-path` | SVG path of edge |

### 7. Dialogs / Modals

**Primary Selector**: `[role="dialog"]`

| Element | Selector | Description |
|---------|----------|-------------|
| Dialog Wrapper | `[role="dialog"]` | Modal container |
| Close Button | Button containing "Close" text | Close the dialog |

**CSS Classes**:
```css
[role="dialog"] {
  /* fixed z-50 w-full gap-4 rounded-xl border bg-background p-6 shadow-lg */
}
```

#### Playground Dialog

| Element | Description |
|---------|-------------|
| Chat Input | `textbox "Send a message..."` |
| Send Button | `button "Send"` |
| Session Selector | `combobox` for session |

#### API Access Dialog

| Element | Selector |
|---------|----------|
| Python Tab | `[data-testid="api_tab_python"]` |
| JavaScript Tab | `[data-testid="api_tab_javascript"]` |
| cURL Tab | `[data-testid="api_tab_curl"]` |
| Copy Code Button | `[data-testid="btn-copy-code"]` |

### 8. Share Menu

**Selector**: `[role="menu"]`

| Menu Item | Description |
|-----------|-------------|
| API access | Opens API access dialog |
| Export | Export flow as JSON |
| MCP Server | MCP server configuration |
| Embed into site | Embed code generator |
| Shareable Playground | Toggle public playground |

---

## Progressive Disclosure Levels

### Level 1: Beginner (Hide Everything)

Hide these selectors to show only the simplified Q&A interface:

```css
/* Hide entire Langflow UI */
[data-testid="app-header"] { display: none !important; }
[data-testid="shad-sidebar"] { display: none !important; }
[data-testid="rf__wrapper"] { display: none !important; }
[data-testid="canvas_controls"] { display: none !important; }
[data-testid="main_canvas_controls"] { display: none !important; }
```

### Level 2: Intermediate (Show Canvas, Hide Advanced)

Show the canvas but hide advanced controls:

```css
/* Hide sidebar component categories */
[data-testid="disclosure-llm operations"] { display: none !important; }
[data-testid="disclosure-processing"] { display: none !important; }
[data-testid="disclosure-flow control"] { display: none !important; }

/* Hide custom component button */
[data-testid="sidebar-custom-component-button"] { display: none !important; }

/* Hide MCP and Bundles in sidebar */
[data-testid="sidebar-nav-mcp"] { display: none !important; }
[data-testid="sidebar-nav-bundles"] { display: none !important; }

/* Hide advanced canvas controls */
[data-testid="lock-status"] { display: none !important; }
```

### Level 3: Advanced (Show Everything)

No CSS overrides - show full Langflow UI.

---

## Implementation Notes

### Injecting CSS Overrides

To apply these styles dynamically, inject a `<style>` tag or use JavaScript:

```javascript
// Example: Hide sidebar
const style = document.createElement('style');
style.textContent = `
  [data-testid="shad-sidebar"] { display: none !important; }
`;
document.head.appendChild(style);
```

### React Flow Panel Positioning

React Flow panels use position classes:
- `bottom left` - Bottom-left corner
- `bottom right` - Bottom-right corner
- `top left` - Top-left corner
- `top right` - Top-right corner

```css
.react-flow__panel.bottom.left { /* ... */ }
.react-flow__panel.bottom.right { /* ... */ }
```

### Z-Index Layers

Key z-index values:
- Header: `z-10`
- Sidebar: `z-50`
- Dialogs: `z-50`

### CSS Variables

Langflow uses CSS variables for theming:
- `--sidebar-width` - Sidebar width
- `--sidebar-width-icon` - Collapsed sidebar width

---

## Screenshots Reference

Screenshots are saved in `.playwright-mcp/`:
- `langflow-flow-editor-full.png` - Full flow editor view
- `langflow-node-selected.png` - Node with selection options
- `langflow-api-modal.png` - API access dialog
- `langflow-playground-dialog.png` - Playground chat dialog
- `langflow-ui-overview-annotated.png` - Overview of UI

---

## Usage for Teach Charlie AI

For the progressive disclosure overlay system:

1. **Beginner Mode**: Overlay covers entire Langflow, shows custom Q&A wizard
2. **Intermediate Mode**: Show canvas + simplified sidebar, hide advanced features
3. **Advanced Mode**: Full Langflow access with educational tooltips

The selectors in this document can be used to:
- Hide/show specific UI regions
- Add overlay masks over certain areas
- Inject educational tooltips near specific elements
- Track user interactions for progression
