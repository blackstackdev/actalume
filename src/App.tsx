import { useEffect, useMemo, useRef, useState } from 'react';
import { Archive, ArrowRight, Bot, Check, ChevronDown, CircleDot, Clock3, Download, FileCheck2, FileText, Fingerprint, History, Pencil, Plus, RefreshCcw, ShieldCheck, Sparkles, Upload, UserRound, X } from 'lucide-react';
import { Modal } from './components/Modal';
import { ActalumeMark } from './components/ActalumeMark';
import { APP_VERSION, PRODUCT_CATEGORY, PRODUCT_DESCRIPTOR, PRODUCT_LINE, PRODUCT_NAME } from './brand';
import { seedState } from './data/seed';
import { createProposal, isLedgerState } from './lib/ledger';
import { createLedgerTools, registerWebMcpTools } from './services/webmcp';
import { useLedger } from './state/LedgerContext';
import type { ProjectContract, Proposal, Receipt, ReceiptKind } from './types';

type Dialog = 'contract' | 'proposal' | 'evidence' | 'approve' | 'reject' | 'new' | null;

const formatTime = (value: string) => new Intl.DateTimeFormat('en-ZA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
const statusLabel: Record<Proposal['status'], string> = { proposed: 'Proposed', awaiting_review: 'Human review', approved: 'Approved', rejected: 'Returned' };

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return <label className="field"><span>{label}</span>{multiline ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} /> : <input value={value} onChange={(e) => onChange(e.target.value)} />}</label>;
}

function App() {
  const { state, dispatch, stateRef } = useLedger();
  const [dialog, setDialog] = useState<Dialog>(null);
  const [expandedReceipt, setExpandedReceipt] = useState<string | null>(null);
  const [webMcp, setWebMcp] = useState<{ available: boolean; count: number; error?: string }>({ available: false, count: 0 });
  const importRef = useRef<HTMLInputElement>(null);
  const tools = useMemo(() => createLedgerTools(() => stateRef.current, dispatch), [dispatch, stateRef]);

  useEffect(() => {
    let cleanup = () => {};
    registerWebMcpTools(tools).then((status) => { cleanup = status.cleanup; setWebMcp(status); });
    return () => cleanup();
  }, [tools]);

  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).matches('input, textarea, select')) return;
      if (event.key.toLowerCase() === 'e') setDialog('evidence');
      if (event.key.toLowerCase() === 'r' && state.proposal.status !== 'approved') dispatch({ type: 'REQUEST_REVIEW', actor: 'human' });
    };
    window.addEventListener('keydown', keys);
    return () => window.removeEventListener('keydown', keys);
  }, [dispatch, state.proposal.status]);

  const exportLedger = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'actalume-ledger.json'; anchor.click(); URL.revokeObjectURL(url);
  };

  const importLedger = async (file?: File) => {
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isLedgerState(parsed)) throw new Error('Not a ledger snapshot');
      dispatch({ type: 'IMPORT', state: parsed });
    } catch { window.alert('That file is not a valid Actalume ledger snapshot.'); }
  };

  const stageIndex = state.proposal.status === 'proposed' ? 1 : state.proposal.status === 'awaiting_review' ? 3 : 4;
  const stages = ['Contract', 'Proposal', 'Evidence', 'Decision', 'History'];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-main">
          <div className="brand-lockup">
            <div className="brand-mark"><ActalumeMark /></div>
            <div><p className="eyebrow">Agent Work Ledger · {PRODUCT_DESCRIPTOR}</p><h1>{PRODUCT_NAME}</h1></div>
          </div>
          <div className="top-actions">
            <div className={`mcp-status ${webMcp.count ? 'live' : ''}`} title={webMcp.error ?? (webMcp.available ? 'WebMCP browser API detected' : 'Use the browser WebMCP flag or the built-in demo harness')}>
              <CircleDot size={13} /> {webMcp.count ? `${webMcp.count} tools live` : webMcp.available ? 'WebMCP ready' : 'Demo mode'}
            </div>
            <button className="icon-button" onClick={() => importRef.current?.click()} aria-label="Import Actalume ledger"><Upload size={17} /></button>
            <input ref={importRef} hidden type="file" accept="application/json" onChange={(e) => importLedger(e.target.files?.[0])} />
            <button className="icon-button" onClick={exportLedger} aria-label="Export Actalume ledger"><Download size={17} /></button>
            <button className="quiet-button" onClick={() => window.confirm('Restore the fictional demo ledger?') && dispatch({ type: 'RESET' })}><RefreshCcw size={14} /> Reset demo</button>
          </div>
        </div>
        <div className="positioning-strip"><strong>{PRODUCT_LINE}</strong><span>{PRODUCT_CATEGORY}</span></div>
      </header>

      <main className="workspace">
        <aside className="contract-panel panel">
          <div className="contract-intro">
            <div className="section-heading"><div><p className="eyebrow">Project contract</p><h2>{state.contract.projectName}</h2></div><button className="icon-button small" onClick={() => setDialog('contract')} aria-label="Edit project contract"><Pencil size={14} /></button></div>
            <p className="contract-purpose">{state.contract.purpose}</p>
            <div className="boundary"><ShieldCheck size={16} /><div><span>Public boundary</span><p>{state.contract.publicBoundary}</p></div></div>
          </div>
          <div className="contract-rules">
            <ContractList title="Agent may" items={state.contract.agentMay} tone="may" />
            <ContractList title="Agent must not" items={state.contract.agentMustNot} tone="must-not" />
          </div>
          <div className="contract-finish">
            <div className="completion-rule"><span>Completion rule</span><p>{state.contract.completionRule}</p></div>
            <div className="revision"><Fingerprint size={13} /> contract revision {state.revision}</div>
          </div>
        </aside>

        <section className="proposal-panel panel">
          <div className="section-heading">
            <div><p className="eyebrow">Active proposal · {state.proposal.id}</p><h2>{state.proposal.title}</h2></div>
            {state.proposal.status !== 'approved' && <button className="icon-button small" onClick={() => setDialog('proposal')} aria-label="Edit proposal"><Pencil size={14} /></button>}
          </div>
          <div className={`status-pill ${state.proposal.status}`}><span></span>{statusLabel[state.proposal.status]}</div>
          <p className="proposal-intent">{state.proposal.intent}</p>
          <div className="proposal-grid"><div><span>Bounded scope</span><p>{state.proposal.scope}</p></div><div><span>Success signal</span><p>{state.proposal.successSignal}</p></div></div>

          <div className="custody" aria-label="Work custody">
            {stages.map((stage, index) => <div className={`custody-step ${index <= stageIndex ? 'active' : ''}`} key={stage}><div>{index < stageIndex ? <Check size={13} /> : index + 1}</div><span>{stage}</span></div>)}
          </div>

          <div className="receipts-heading"><div><p className="eyebrow">Evidence receipts</p><h3>{state.proposal.receipts.length} attached</h3></div>{state.proposal.status !== 'approved' && <button className="quiet-button" onClick={() => setDialog('evidence')}><Plus size={14} /> Add evidence</button>}</div>
          <div className="receipt-list">
            {state.proposal.receipts.length === 0 && <div className="empty-state">No evidence yet. Attach one public-safe receipt before requesting review.</div>}
            {state.proposal.receipts.map((receipt) => <button className="receipt" key={receipt.id} onClick={() => setExpandedReceipt(expandedReceipt === receipt.id ? null : receipt.id)} aria-expanded={expandedReceipt === receipt.id}>
              <div className={`receipt-icon ${receipt.kind}`}><FileCheck2 size={16} /></div><div><strong>{receipt.label}</strong><span>{receipt.kind} · {formatTime(receipt.createdAt)}</span>{expandedReceipt === receipt.id && <p>{receipt.detail}</p>}</div><ChevronDown className={expandedReceipt === receipt.id ? 'turned' : ''} size={16} />
            </button>)}
          </div>
        </section>

        <aside className="decision-panel panel">
          <p className="eyebrow">Human decision</p>
          <div className="human-seal"><UserRound size={24} /><span>Human-only gate</span></div>
          <h2>{state.proposal.status === 'approved' ? 'Brick entered history.' : state.proposal.status === 'rejected' ? 'Brick returned for revision.' : 'Evidence is ready for your judgment.'}</h2>
          <p className="decision-copy">The agent can propose, attach proof and request review. Only a named human can create canonical history.</p>
          {state.proposal.status === 'proposed' && <button className="primary-button" onClick={() => dispatch({ type: 'REQUEST_REVIEW', actor: 'human' })} disabled={!state.proposal.receipts.length}>Request review <ArrowRight size={16} /></button>}
          {state.proposal.status === 'awaiting_review' && <><button className="primary-button approve" onClick={() => setDialog('approve')}><Check size={16} /> Approve brick</button><button className="secondary-button" onClick={() => setDialog('proposal')}><Pencil size={15} /> Edit scope</button><button className="text-button reject" onClick={() => setDialog('reject')}><X size={14} /> Return with reason</button></>}
          {(state.proposal.status === 'approved' || state.proposal.status === 'rejected') && <button className="primary-button" onClick={() => setDialog('new')}><Plus size={16} /> Open next brick</button>}
          <div className="decision-note"><Sparkles size={15} /><p><strong>No silent autonomy.</strong><br />Every consequential transition leaves a visible receipt.</p></div>
        </aside>

        <section className="history-panel panel">
          <div className="section-heading"><div><p className="eyebrow">Canonical history</p><h2>Decisions that survived review</h2></div><Archive size={19} /></div>
          <div className="history-list">
            {state.history.map((entry) => <article className="history-entry" key={entry.id}><div className="history-check"><Check size={14} /></div><div><strong>{entry.title}</strong><p>{entry.summary}</p><span>Approved by {entry.approvedBy} · {formatTime(entry.approvedAt)} · {entry.receiptCount} receipts</span></div><code>{entry.digest}</code></article>)}
          </div>
        </section>

        <aside className="activity-panel panel">
          <div className="section-heading"><div><p className="eyebrow">Tool activity</p><h2>Visible custody</h2></div><Bot size={19} /></div>
          <div className="activity-list">{state.activity.slice(0, 5).map((entry) => <div className="activity-entry" key={entry.id}><div className={`actor-dot ${entry.actor}`}>{entry.actor === 'agent' ? <Bot size={12} /> : <UserRound size={12} />}</div><div><strong>{entry.action}</strong><p>{entry.detail}</p><span><Clock3 size={11} /> {formatTime(entry.createdAt)}</span></div></div>)}</div>
        </aside>
      </main>

      <footer><span>{PRODUCT_NAME} v{APP_VERSION} · fictional local demo · no accounts · no telemetry · no publishing</span><span><kbd>E</kbd> evidence <kbd>R</kbd> review</span></footer>

      {dialog === 'contract' && <ContractDialog contract={state.contract} onClose={() => setDialog(null)} onSave={(contract) => { dispatch({ type: 'UPDATE_CONTRACT', contract }); setDialog(null); }} />}
      {dialog === 'proposal' && <ProposalDialog proposal={state.proposal} onClose={() => setDialog(null)} onSave={(proposal) => { dispatch({ type: 'UPDATE_PROPOSAL', proposal }); setDialog(null); }} />}
      {dialog === 'evidence' && <EvidenceDialog onClose={() => setDialog(null)} onSave={(receipt) => { dispatch({ type: 'ADD_RECEIPT', receipt }); setDialog(null); }} />}
      {dialog === 'approve' && <DecisionDialog mode="approve" title={state.proposal.title} onClose={() => setDialog(null)} onSubmit={(value) => { dispatch({ type: 'APPROVE', approvedBy: value }); setDialog(null); }} />}
      {dialog === 'reject' && <DecisionDialog mode="reject" title={state.proposal.title} onClose={() => setDialog(null)} onSubmit={(value) => { dispatch({ type: 'REJECT', reason: value, rejectedBy: 'Human reviewer' }); setDialog(null); }} />}
      {dialog === 'new' && <NewBrickDialog onClose={() => setDialog(null)} onSave={(proposal) => { dispatch({ type: 'NEW_BRICK', proposal }); setDialog(null); }} />}
    </div>
  );
}

function ContractList({ title, items, tone }: { title: string; items: string[]; tone: string }) { return <div className={`contract-list ${tone}`}><span>{title}</span>{items.map((item) => <p key={item}><i>{tone === 'may' ? '✓' : '×'}</i>{item}</p>)}</div>; }

function ContractDialog({ contract, onClose, onSave }: { contract: ProjectContract; onClose: () => void; onSave: (value: ProjectContract) => void }) {
  const [value, setValue] = useState(contract);
  return <Modal eyebrow="Human edit" title="Project contract" onClose={onClose}><form onSubmit={(e) => { e.preventDefault(); onSave(value); }}><Field label="Project name" value={value.projectName} onChange={(v) => setValue({ ...value, projectName: v })} /><Field label="Purpose" value={value.purpose} onChange={(v) => setValue({ ...value, purpose: v })} multiline /><Field label="Public boundary" value={value.publicBoundary} onChange={(v) => setValue({ ...value, publicBoundary: v })} multiline /><Field label="Completion rule" value={value.completionRule} onChange={(v) => setValue({ ...value, completionRule: v })} multiline /><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button">Save contract</button></div></form></Modal>;
}

function ProposalDialog({ proposal, onClose, onSave }: { proposal: Proposal; onClose: () => void; onSave: (value: Proposal) => void }) {
  const [value, setValue] = useState(proposal);
  return <Modal eyebrow="Bounded work" title="Edit active proposal" onClose={onClose}><form onSubmit={(e) => { e.preventDefault(); onSave(value); }}><Field label="Brick title" value={value.title} onChange={(v) => setValue({ ...value, title: v })} /><Field label="Intent" value={value.intent} onChange={(v) => setValue({ ...value, intent: v })} multiline /><Field label="Scope" value={value.scope} onChange={(v) => setValue({ ...value, scope: v })} multiline /><Field label="Success signal" value={value.successSignal} onChange={(v) => setValue({ ...value, successSignal: v })} multiline /><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button">Save proposal</button></div></form></Modal>;
}

function EvidenceDialog({ onClose, onSave }: { onClose: () => void; onSave: (value: Receipt) => void }) {
  const [kind, setKind] = useState<ReceiptKind>('test'); const [label, setLabel] = useState(''); const [detail, setDetail] = useState('');
  return <Modal eyebrow="Evidence, not assertion" title="Attach a receipt" onClose={onClose}><form onSubmit={(e) => { e.preventDefault(); onSave({ id: `receipt-${Date.now()}`, kind, label, detail, createdAt: new Date().toISOString(), actor: 'human' }); }}><label className="field"><span>Receipt type</span><select value={kind} onChange={(e) => setKind(e.target.value as ReceiptKind)}><option value="test">Test</option><option value="source">Source</option><option value="artifact">Artifact</option><option value="note">Note</option></select></label><Field label="Short label" value={label} onChange={setLabel} /><Field label="What this proves" value={detail} onChange={setDetail} multiline /><p className="form-note">Use fictional or public-safe information only. A receipt supports a decision; it never makes one.</p><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={!label.trim() || !detail.trim()}>Attach receipt</button></div></form></Modal>;
}

function DecisionDialog({ mode, title, onClose, onSubmit }: { mode: 'approve' | 'reject'; title: string; onClose: () => void; onSubmit: (value: string) => void }) {
  const [value, setValue] = useState('');
  return <Modal eyebrow="Human-only decision" title={mode === 'approve' ? 'Confirm canonical history' : 'Return this brick'} onClose={onClose}><div className="consequence"><ShieldCheck size={20} /><p>{mode === 'approve' ? <><strong>“{title}” will become immutable history.</strong><br />Its evidence count, approver and digest will be preserved.</> : <><strong>“{title}” will not enter history.</strong><br />The reason becomes visible in the custody log.</>}</p></div><Field label={mode === 'approve' ? 'Approver name' : 'Reason for return'} value={value} onChange={setValue} multiline={mode === 'reject'} /><div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className={`primary-button ${mode === 'approve' ? 'approve' : ''}`} disabled={!value.trim()} onClick={() => onSubmit(value)}>{mode === 'approve' ? 'Approve and seal' : 'Return brick'}</button></div></Modal>;
}

function NewBrickDialog({ onClose, onSave }: { onClose: () => void; onSave: (value: Proposal) => void }) {
  const [value, setValue] = useState(createProposal(''));
  return <Modal eyebrow="Next smallest brick" title="Open a bounded proposal" onClose={onClose}><form onSubmit={(e) => { e.preventDefault(); onSave(value); }}><Field label="Brick title" value={value.title} onChange={(v) => setValue({ ...value, title: v })} /><Field label="Intent" value={value.intent} onChange={(v) => setValue({ ...value, intent: v })} multiline /><Field label="Scope" value={value.scope} onChange={(v) => setValue({ ...value, scope: v })} multiline /><Field label="Success signal" value={value.successSignal} onChange={(v) => setValue({ ...value, successSignal: v })} multiline /><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={!value.title.trim()}>Open brick</button></div></form></Modal>;
}

export default App;
