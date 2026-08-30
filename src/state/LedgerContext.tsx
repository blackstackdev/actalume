import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import { seedState, STORAGE_KEY } from '../data/seed';
import { isLedgerState, ledgerReducer } from '../lib/ledger';
import type { LedgerAction, LedgerState } from '../types';

interface LedgerContextValue {
  state: LedgerState;
  dispatch: React.Dispatch<LedgerAction>;
  stateRef: React.MutableRefObject<LedgerState>;
}

const LedgerContext = createContext<LedgerContextValue | null>(null);

function loadInitialState(): LedgerState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(seedState);
    const parsed: unknown = JSON.parse(saved);
    return isLedgerState(parsed) ? parsed : structuredClone(seedState);
  } catch {
    return structuredClone(seedState);
  }
}

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ledgerReducer, undefined, loadInitialState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => ({ state, dispatch, stateRef }), [state]);
  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
}

export function useLedger() {
  const context = useContext(LedgerContext);
  if (!context) throw new Error('useLedger must be used inside LedgerProvider');
  return context;
}
