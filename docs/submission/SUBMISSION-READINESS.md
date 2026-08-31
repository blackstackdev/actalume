# Actalume WebMCP Challenge submission readiness

Checked: 2026-08-31

## Verdict

**Submitted and publicly verified.** The MIT-licensed public-safe source, GitHub Pages app, captioned YouTube demo and Devpost entry are live. The approved `@skillissue_md` reveal also links the public demo and entry. The remaining obligation is to preserve judge access and correct only factual, access or material-security problems during judging.

## Official deadline

- Devpost submission deadline: 2026-09-03 13:00 PDT / 2026-09-03 22:00 SAST.
- Judges require a working live URL, a public open-source repository with a visible licence, an English description and a public YouTube demo under three minutes with audio.
- The live project must remain freely accessible through the judging period.

Sources:

- https://webmcp.devpost.com/
- https://webmcp.devpost.com/rules
- https://openai.com/webmcp-challenge/

## Entrant-location check

- South Africa is currently listed on OpenAI's supported-country pages for both ChatGPT and the API.
- This confirms service availability only. The entrant must still satisfy every eligibility, age, conflict and submission condition in the official challenge rules.

Source:

- https://help.openai.com/en/articles/5347006-openai-api-supported-countries-and-territories

## Local proof

- React/Vite app starts and builds.
- Ten automated tests pass.
- `npm audit` reports zero vulnerabilities across 163 dependencies.
- Six imperative WebMCP tools register through `document.modelContext.registerTool`.
- Native Chrome testing on 2026-08-27 discovered and executed all six tools.
- Agent approval was denied and canonical history remained unchanged.
- Desktop, mid-width and mobile QA passed with no horizontal overflow or console errors.
- A free/no-credit narration, 29-cue caption file and nine-shot 119.800-second demo are complete locally.
- The final demo shows the live ledger, receipt evidence, all six native tools, denied self-approval, the disabled human seal action and canonical history.

## Final local verification — 2026-08-30

- `npm test`: 3 files, 10 tests passed.
- `npm run build`: passed with Vite 8.2.2.
- `npm audit --json`: 0 vulnerabilities across 163 dependencies.
- `git diff --cached --check`: passed.
- Staged-source privacy scan: no workstation path, private studio name, surname or private collaborator name found.
- Public image privacy review: the stale native proof containing a private approver name was replaced by a public-safe proof reconstructed from the verified 2026-08-27 execution result.
- Final demo: 119.800 seconds, 1920×1080 at 30 fps, H.264 Rec.709 limited range, mono AAC at 48 kHz.
- Final demo audio: -16.16 LUFS integrated, -1.44 dBTP true peak, 2.10 LU loudness range.
- Final demo decode scan and nine-frame visual contact sheet: passed.
- Public attribution: `Actalume by Krēˈādiv Worx`.
- Root licence: MIT, copyright 2026 Krēˈādiv Worx.
- Local Git identity: Krēˈādiv Worx using the connected GitHub account's noreply address.
- Local and public Git history exist on `main`; the remote head matches the verified local commit.
- Public repository: `https://github.com/blackstackdev/actalume`.
- GitHub verification: public visibility, `main`, MIT detection, README/media rendering and exact local/remote head match passed.
- Live app: `https://blackstackdev.github.io/actalume/`.
- GitHub Pages verification: HTTP 200, correct `/actalume/` asset base, branded mark, desktop/mobile layouts, local persistence and zero public-origin console warnings/errors passed.
- Public-origin native verification: all six tools were discovered in supported Chrome with `WebMCP for testing`; the `noindex` verifier completed three read-only calls and invoked no mutation or review-request tools.

## External publication verification — 2026-08-31

- Public demo: `https://youtu.be/W7TDj8BiLsw`.
- Devpost entry: `https://devpost.com/software/actalume`; the submission and approved 1200×800 thumbnail were visually verified.
- Public reveal: `https://x.com/skillissue_md/status/2094321034413441113`; X confirmed the post and displayed the correct text, embedded two-minute demo and Devpost link.

Reference SHA-256 digests:

- `README.md`: `283CC3F96908C6E2289512530E5DE541CF64D8D91417601C48A6F145F9782418`
- `docs/media/actalume-desktop.png`: `91F4FD266BFDBC86A2EDACCB7C70D55F839589B658A86E3E09C27D33C71846CE`
- `docs/media/native-six-tools-executed.png`: `DD2CB56DE174195406CD0A9E2B4061D915220D2D646A52BAE0158913510C8EE7`
- `docs/submission/DEVPOST-COPY.md`: `963D9C9B73B7C1BE2FD8B009AB1A1482195EE865C961571B9118A25CB5E18488`
- `release/demo/Actalume-v0.5.0-WebMCP-Challenge-Demo.mp4`: `90ED84A7EF4804DC8630A67CE7101CD096A42C787ED08A3F9AE9A3D4142AD794`

## Competition fit

Actalume was created on 2026-08-26, after the submission window opened. It is not a pre-existing product retrofitted after the fact. Its WebMCP surface, governance tests, native verification, responsive product experience and demo package were all produced during the challenge window.

## Judging-preservation obligations

1. Preserve the live app, repository, public video and Devpost entry through judging.
2. Correct only factual errors, broken judge access or material security problems.
3. Keep feature expansion outside the submitted judging build.

The public repository, GitHub Pages deployment, YouTube upload, Devpost submission and X reveal each occurred only after explicit approval and were verified at their public URLs.
