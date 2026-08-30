import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { LedgerProvider } from './state/LedgerContext';

describe('named human decision gate', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('requires the reviewer to deliberately enter an approver name', async () => {
    const user = userEvent.setup();
    render(<LedgerProvider><App /></LedgerProvider>);

    await user.click(screen.getByRole('button', { name: 'Approve brick' }));

    const approver = screen.getByLabelText('Approver name');
    const seal = screen.getByRole('button', { name: 'Approve and seal' });
    expect(approver).toHaveValue('');
    expect(seal).toBeDisabled();

    await user.type(approver, 'Morgan Lee');
    expect(seal).toBeEnabled();
  });
});
