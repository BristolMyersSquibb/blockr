# Live Collaboration in blockr — Design Research

## Problem

blockr is a Shiny-based app where each browser tab gets its own R session
and reactive graph. There is no mechanism for one user's changes to be
visible to another user. For collaborative pipeline editing we need to sync:

- DAG structure (which blocks exist, how they're connected)
- Block parameters (filter conditions, selected columns, plot settings)
- Dock/board layout (panel positions, sizes)
- Presence/awareness (who's online, what they're editing)

## Approaches

### 1. Shared Reactive Database (simplest, R-native)

Use a change-feed database as shared state between Shiny sessions.

**Implementation**: [shiny.collections](https://github.com/Appsilon/shiny.collections)
uses RethinkDB, which pushes change notifications to connected clients —
no polling needed. Each Shiny session subscribes to the same collection.

For blockr, serialize the board state (DAG + block configs) to the DB on
every change; have each session watch for updates.

**Pros**: Stays entirely in R; works with Shiny's reactive model.
**Cons**: Coarse-grained (full state replacement, not incremental diffs);
conflict resolution is last-write-wins; latency depends on DB round-trips.
Does not handle two users editing the same block simultaneously.

### 2. CRDTs (Conflict-free Replicated Data Types)

CRDTs guarantee that concurrent edits by different users converge to the
same state without a central coordinator. This is the approach used by
Figma, Google Docs (partially), Apple Notes, and others.

#### Key Libraries

| Library                                   | Language       | Notes                                      |
|-------------------------------------------|----------------|--------------------------------------------|
| [Yjs](https://github.com/yjs/yjs)        | JavaScript     | Most mature, 900k+ weekly downloads        |
| [Automerge](https://automerge.org/)       | Rust+JS (WASM) | JSON data model, good for structured data  |
| [Loro](https://loro.dev/)                 | Rust+JS (WASM) | Best perf, native movable tree CRDT        |

Loro's **movable tree CRDT** maps naturally to blockr's DAG, but Yjs is
the safer production choice due to ecosystem maturity.

#### Recommended Architecture: Yjs + Shiny Custom Messages

```
┌─────────────┐     ┌─────────────┐
│  Browser A   │     │  Browser B   │
│  ┌────────┐  │     │  ┌────────┐  │
│  │ Yjs Doc│◄─┼─────┼─►│ Yjs Doc│  │
│  └───┬────┘  │     │  └───┬────┘  │
│      │       │     │      │       │
│  Shiny UI    │     │  Shiny UI    │
└──────┼───────┘     └──────┼───────┘
       │   WebSocket         │
       ▼                     ▼
┌──────────────────────────────────┐
│  y-websocket server (Node.js)   │
│  or Hocuspocus                  │
└──────────────────────────────────┘
       │
       ▼ (optional persistence)
┌──────────────────────────────────┐
│  R/Shiny Server                  │
│  (receives merged state via      │
│   Shiny.setInputValue)           │
└──────────────────────────────────┘
```

**Flow**:

1. Client-side JS holds a Yjs `Y.Doc` representing the board state
   (blocks as `Y.Map`, edges as `Y.Array`, params as nested `Y.Map`).
2. Yjs syncs between browsers via `y-websocket` (lightweight Node.js
   relay) or `y-webrtc` (peer-to-peer, no server needed).
3. When the Yjs doc changes (from any peer), a JS observer calls
   `Shiny.setInputValue("board_state", serializedState)` to push the
   merged state into R's reactive system.
4. R reacts to the new state and re-evaluates the DAG.

**Presence/awareness**: Yjs has a built-in Awareness protocol for
broadcasting ephemeral state (selected block, cursor position, user
name/color) that doesn't persist.

### 3. Mapping blockr State to CRDT Types

Given blockr's current data model (from `run_app()`):

```r
run_app(
  blocks = c(data = new_dataset_block("mtcars"), ...),
  links = list(from = c("data"), to = c("filter"), input = c("data"))
)
```

A natural Yjs mapping:

```javascript
const ydoc = new Y.Doc()

// Each block is a Y.Map with its type and parameters
const blocks = ydoc.getMap('blocks')
blocks.set('data', new Y.Map([
  ['type', 'dataset_block'],
  ['params', new Y.Map([['dataset', 'mtcars']])]
]))

// Edges stored as an array of {from, to, input} objects
const edges = ydoc.getArray('edges')
edges.push([{ from: 'data', to: 'filter', input: 'data' }])

// Layout stored separately (positions, sizes)
const layout = ydoc.getMap('layout')
```

### 4. Bidirectionality Challenge

The main engineering challenge: user edits flow through the CRDT and sync
to all peers, but R-computed results (block outputs) flow back from the
server. These must not create feedback loops.

**Solution**: Distinguish "user state" (synced via CRDT) from "computed
state" (pushed from R server, read-only). Only user-editable fields
(block params, DAG structure, layout) go through the CRDT. Computed
outputs are local to each R session.

### 5. Other Frameworks Considered

- **Microsoft Fluid Framework**: CRDT-inspired, but requires Azure Fluid
  Relay or self-hosted Routerlicious. More opinionated, less flexible.
- **RxDB**: CRDTs on NoSQL documents. Good for offline-first apps with
  replication, but heavier than needed for in-memory collaboration.
- **SyncedStore**: Built on Yjs, provides plain JS objects that sync
  automatically. Could simplify the JS-side integration.
- **GUN**: Graph CRDT with WebRTC. Interesting for P2P but less mature
  than Yjs for production use.

## Recommendation

For blockr, the **Yjs + Hocuspocus** combination offers the best balance:

1. **Mature and proven** — Yjs powers Notion, Evernote, and many others.
2. **Flexible networking** — WebSocket for reliability, WebRTC for P2P.
3. **Offline support** — y-indexeddb persists state in the browser.
4. **Hocuspocus** provides auth hooks, persistence, and webhooks out of
   the box as the server component.
5. **Minimal R-side changes** — the CRDT logic stays in JS; R receives
   the merged state via `Shiny.setInputValue()`.

The main work would be:
- Adding a JS module to blockr that initializes a Yjs doc and providers
- Defining observers that bridge Yjs state changes to/from Shiny inputs
- Running Hocuspocus alongside (or proxied through) the Shiny server
- Adding presence UI (user avatars, selection highlights)

## References

- https://github.com/yjs/yjs
- https://automerge.org/
- https://loro.dev/
- https://github.com/fkatada/js-hocuspocus
- https://velt.dev/blog/best-crdt-libraries-real-time-data-sync
- https://velt.dev/blog/crdt-implementation-guide-conflict-free-apps
- https://www.tiny.cloud/blog/real-time-collaboration-ot-vs-crdt/
- https://crdt.tech/implementations
- https://github.com/ginberg/shiny.collaboration
- https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type
