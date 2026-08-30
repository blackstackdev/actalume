export type Actor = 'agent' | 'human';
export type ReceiptKind = 'test' | 'source' | 'artifact' | 'note';
export type ProposalStatus = 'proposed' | 'awaiting_review' | 'approved' | 'rejected';

export interface ProjectContract {
  projectName: string;
  purpose: string;
  publicBoundary: string;
  agentMay: string[];
  agentMustNot: string[];
  completionRule: string;
}

export interface Receipt {
  id: string;
  kind: ReceiptKind;
  label: string;
  detail: string;
  createdAt: string;
  actor: Actor;
}

export interface Proposal {
  id: string;
  title: string;
  intent: string;
  scope: string;
  successSignal: string;
  status: ProposalStatus;
  proposedAt: string;
  proposedBy: string;
  receipts: Receipt[];
}

export interface HistoryEntry {
  id: string;
  proposalId: string;
  title: string;
  summary: string;
  approvedAt: string;
  approvedBy: string;
  receiptCount: number;
  digest: string;
}

export interface ActivityEntry {
  id: string;
  action: string;
  detail: string;
  actor: Actor;
  createdAt: string;
}

export interface LedgerState {
  contract: ProjectContract;
  proposal: Proposal;
  history: HistoryEntry[];
  activity: ActivityEntry[];
  revision: number;
}

export type LedgerAction =
  | { type: 'UPDATE_CONTRACT'; contract: ProjectContract }
  | { type: 'UPDATE_PROPOSAL'; proposal: Proposal }
  | { type: 'ADD_RECEIPT'; receipt: Receipt; actor?: Actor }
  | { type: 'REQUEST_REVIEW'; actor?: Actor }
  | { type: 'APPROVE'; approvedBy: string }
  | { type: 'REJECT'; reason: string; rejectedBy: string }
  | { type: 'NEW_BRICK'; proposal: Proposal }
  | { type: 'IMPORT'; state: LedgerState }
  | { type: 'RESET' };
