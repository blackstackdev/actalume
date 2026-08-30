import { describe, expect, it } from 'vitest';
import { seedState } from '../data/seed';
import { createProposal, ledgerReducer, simpleDigest } from './ledger';

describe('ledger custody rules', () => {
  it('will not approve without human review', () => {
    const proposed = { ...structuredClone(seedState), proposal: { ...structuredClone(seedState.proposal), status: 'proposed' as const } };
    expect(ledgerReducer(proposed, { type: 'APPROVE', approvedBy: 'Morgan Lee' })).toEqual(proposed);
  });

  it('will not request review without evidence', () => {
    const state = { ...structuredClone(seedState), proposal: { ...structuredClone(seedState.proposal), status: 'proposed' as const, receipts: [] } };
    expect(ledgerReducer(state, { type: 'REQUEST_REVIEW', actor: 'agent' })).toEqual(state);
  });

  it('seals a reviewed brick into canonical history with attribution', () => {
    const state = structuredClone(seedState);
    const result = ledgerReducer(state, { type: 'APPROVE', approvedBy: 'Morgan Lee' });
    expect(result.proposal.status).toBe('approved');
    expect(result.history).toHaveLength(state.history.length + 1);
    expect(result.history[0].approvedBy).toBe('Morgan Lee');
    expect(result.history[0].receiptCount).toBe(3);
    expect(result.history[0].digest).toMatch(/^[0-9A-F]{4}-[0-9A-F]{4}$/);
  });

  it('requires the current brick to be decided before opening another', () => {
    const next = createProposal('Next brick');
    expect(ledgerReducer(structuredClone(seedState), { type: 'NEW_BRICK', proposal: next }).proposal.id).toBe(seedState.proposal.id);
  });

  it('creates stable digests for the same input', () => {
    expect(simpleDigest('proof')).toBe(simpleDigest('proof'));
  });
});
