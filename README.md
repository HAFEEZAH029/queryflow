# QueryFlow

QueryFlow is a visual query builder built with Next.js that enables users to construct complex nested queries through an intuitive graphical interface without writing raw query syntax manually.

Inspired by tools such as MongoDB Compass, Postman Query Builders, Supabase Filters, and GraphQL Explorers, QueryFlow provides a schema-driven experience for creating, validating, previewing, and executing advanced queries using recursive condition groups.

---

## Features

### Dynamic Query Builder

* Field selection
* Operator selection
* Dynamic value inputs
* Schema-aware controls
* Context-sensitive operators

### Nested Condition Groups

* Unlimited nesting depth
* AND / OR logic switching
* Recursive rendering
* Collapsible groups
* Drag-and-drop reordering

### Query Engine

* Live Mongo-style query generation
* Query execution simulation
* Result inspection
* Query validation
* Query sanitization

### Advanced Interactions

* Query history
* Saved query presets
* Import query JSON
* Export query JSON
* Copy query output
* Keyboard shortcuts
* Dark/Light mode
* Animated transitions

### Testing

* Unit tests
* Integration tests
* Recursive rendering tests
* State management tests
* Query engine tests

---

## Tech Stack

### Core

* Next.js (App Router)
* React
* TypeScript

### Styling

* Tailwind CSS

### State Management

* Zustand

### Drag & Drop

* DnD Kit

### Testing

* Vitest
* React Testing Library

---

## Setup Instructions

### Clone Repository

```bash
git clone https://github.com/HAFEEZAH029/queryflow.git
cd queryflow
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Run Tests

```bash
npm run test
```

### Run Production Build

```bash
npm run build
```

---

## Architecture Overview

The application is organized around a recursive query tree model.

Each query is represented as a tree of nodes:

* Condition Nodes
* Group Nodes

Condition nodes represent individual filtering rules.

Group nodes represent logical containers capable of holding additional condition nodes or nested group nodes.

This architecture allows the system to support unlimited nesting depth while maintaining a predictable state structure.

```txt
Root Group
├── Condition
├── Condition
└── Group
    ├── Condition
    └── Group
        └── Condition
```

The same query tree powers:

* Rendering
* Validation
* Query generation
* Execution
* History restoration
* Import/Export

This ensures a single source of truth across the application.

---

## Recursive Rendering Strategy

One of the primary goals of this challenge was supporting deeply nested query structures.

The `QueryGroup` component renders itself recursively whenever a child node is another group.

This allows the UI to support unlimited nesting depth without creating separate rendering implementations for each level.

The same recursive approach is also used throughout:

### Query Validation

The validation engine traverses the query tree recursively to detect:

* Empty groups
* Invalid fields
* Incompatible operators
* Missing values

### Query Generation

The query engine recursively transforms query nodes into Mongo-style query objects.

### Query Execution

The execution simulator recursively evaluates query conditions against datasets.

This recursive architecture keeps the system maintainable, scalable, and extensible.

---

## State Management Architecture

State is managed using Zustand.

The store maintains:

* Active query tree
* Selected schema
* Query history
* Query presets
* Execution status
* Execution results
* Theme preferences

Key design decisions:

### Immutable Updates

All tree modifications create new state references rather than mutating existing state.

### Recursive State Handling

Tree operations such as:

* Add condition
* Add group
* Remove node
* Reorder nodes
* Toggle logic

are implemented through recursive traversal helpers.

### Centralized Source of Truth

The query tree serves as the application's canonical data structure.

Every major subsystem consumes the same tree.

---

## Query Engine Design

The query engine consists of several independent modules:

### Query Generation

Converts query trees into Mongo-style query objects.

Supported operators:

* equals
* notEquals
* contains
* startsWith
* greaterThan
* lessThan
* between
* inArray

### Query Validation

Prevents invalid query execution by validating:

* Schema compatibility
* Operator compatibility
* Empty values
* Empty groups

### Query Execution Simulator

Executes generated query logic against mock datasets.

Supports:

* AND groups
* OR groups
* Nested groups
* Range queries
* Array operators

---

## Security & Stability

Several safeguards were implemented to improve reliability.

### Query Sanitization

Generated query values are sanitized before execution.

### Import Validation

Imported JSON files are recursively validated before being accepted.

### Recursive Structure Validation

Malformed query trees are rejected to prevent invalid application state.

### Safe Dynamic Rendering

The application does not use unsafe HTML rendering techniques and only renders validated query structures.

---

## Performance Optimization Techniques

The application was designed to remain responsive when working with deeply nested queries.

### Memoization

Query generation is memoized to avoid unnecessary recomputation.

### Stable Keys

Nodes use unique identifiers to ensure stable React rendering.

### Component Isolation

Rendering responsibilities are split into focused components:

* QueryGroup
* QueryCondition
* QueryPreview
* ResultPanel
* QueryActions

### Recursive Update Helpers

Centralized recursive update utilities reduce duplicated traversal logic and improve maintainability.

### Scoped Drag-and-Drop

Drag-and-drop operations are isolated to the active parent group to avoid unnecessary state updates.

---

## Testing Strategy

The project includes both unit and integration testing.

### Unit Tests

Coverage includes:

* Query generation
* Validation engine
* Query execution
* Query sanitization
* Import validation

### Integration Tests

Coverage includes:

* Recursive rendering
* Query builder interactions
* State management workflows
* History restoration
* Preset loading
* Query execution lifecycle

The test suite focuses on architecture confidence, correctness, and edge-case handling rather than raw test quantity.

---

## Continuous Deployment

The application is continuously deployed through Netlify.

Deployment pipeline features:

* Automatic production deployments
* Pull request preview deployments
* Stable production environment

This ensures every pull request can be reviewed independently before merging.

---

## Trade-offs Made

### Mongo-Style Queries Instead of SQL

Mongo-style query objects were selected because they map naturally to recursive tree structures and simplify query generation.

### Mock Data Instead of Real Backend

The challenge focuses on frontend architecture and interaction engineering, so a simulated execution engine was implemented instead of integrating a backend service.

### Parent-Scoped Drag-and-Drop

Drag-and-drop is currently restricted to the active parent group.

This reduces implementation complexity while maintaining a predictable user experience.

### In-Memory History

Query history is maintained in application state rather than persistent storage.

This keeps the implementation lightweight and focused on the challenge objectives.

---

## Future Improvements

Potential future enhancements include:

* Persistent query history
* Saved custom presets
* Pagination
* Result sorting
* Virtualized result rendering
* Advanced date operators
* Regex operators
* Null-check operators
* Backend query execution

---

## Demo

Live URL: queryflow.netlify.app

Demo Video: (https://www.loom.com/share/05a2fb46dd0943b28d3b611c4bf52952)
