# Product brief — Actalume

## Product promise

**Every action leaves a record.** Actalume is the human-governed system of record for agent work: recorded actions brought into view without surrendering human control.

## Target user

A solo builder or small team collaborating with one or more agents who needs to know:

- what the human actually asked for;
- what the agent claims it did;
- what evidence supports that claim;
- who accepted or rejected the change; and
- which facts are now canonical.

## The non-obvious truth

An agent's work result is not project truth merely because the agent says it is finished. It becomes project history only when a responsible human reviews the evidence and accepts the state change.

## Core loop

1. **Human contract** — goal, scope, constraints, actors and permissions.
2. **Agent work** — one bounded brick is proposed under an explicit agent identity.
3. **Evidence** — receipts are attached with type, source, result and timestamp.
4. **Human decision** — approve, edit or reject. Agent identities cannot self-approve.
5. **Canonical history** — accepted work becomes an immutable event linked to its evidence and approver.

## WebMCP tools

| Tool | Purpose | Consequence |
| --- | --- | --- |
| `list_projects` | Show public-safe demo projects and current status. | Read-only |
| `inspect_project_contract` | Return goal, scope, constraints, actors and permissions. | Read-only |
| `propose_brick` | Create a bounded pending work item under an agent identity. | Adds proposal only |
| `submit_evidence` | Attach a typed receipt to a pending brick. | Adds evidence only |
| `request_status_change` | Ask a human to move a brick to another state. | Creates pending decision only |
| `inspect_audit_history` | Return approved canonical events and their receipt links. | Read-only |

No WebMCP tool can approve a brick into history.

## Public-safe fixture

The seeded project is fictional: `Fieldnote launch`, a small team preparing a public demo. `Morgan Lee` and `Fieldnote agent` are fictional demo actors; no private project paths, medical data, account details, conversation content or unpublished studio records are included.

## Product identity

- Product: Actalume (AK-tuh-loom)
- Category: The human-governed system of record for agent work.
- Technical descriptor: The evidence layer for agentic work.
- Plain-language description: Agent Work Ledger.

## Visual direction

- **Paradigm:** dark evidence ledger with restrained technical illumination.
- **Background:** near-black charcoal with bone text and hairline rules.
- **Typography:** locally bundled Space Grotesk for product identity, headings, body and controls; locally bundled IBM Plex Mono for receipts, timestamps, labels and IDs.
- **Signature motif:** one thin custody line with five precise nodes.
- **Container model:** open rails, rules and ledger rows; cards only for the active proposal and receipts.
- **Color roles:** charcoal for the working surface, bone for recorded content, amber for actions or evidence brought into view, green only for human-verified history, and restrained rust only for rejection or prohibition.
- **Signature mark:** an illuminated A above ledger lines, carrying the dramatic brand moment while the interface remains calm and legible.
- **Motion:** a proposal approaches but does not cross the decision boundary; approval draws the final line into history. Respect reduced-motion preferences.

## Accepted concept inventory

- Desktop concept: `docs/design/agent-work-ledger-desktop-concept-v1.png`
- Mobile concept: `docs/design/agent-work-ledger-mobile-concept-v1.png`
- Above-the-fold copy is limited to the product descriptor, publisher, project title, contract, active brick, custody stages, evidence labels, decision copy, canonical-history label, connection state and version shown in those concepts or explicitly defined in this brief.
- The concept's sample 2025 timestamps are visual placeholders. The implementation must use deterministic 2026 demo timestamps.

## Build boundaries

- Local-first with browser persistence and JSON export/import.
- No login, subscription, telemetry or external data connection.
- No generated agent claims without visible fixture evidence.
- No deployment, challenge registration, public repository or submission without the entrant's separate approval.
