import { afterEach, describe, expect, it, vi } from 'vitest';
import { seedState } from '../data/seed';
import { createLedgerTools, registerWebMcpTools } from './webmcp';

const readResult = async (value: ReturnType<ReturnType<typeof createLedgerTools>[number]['execute']>) => JSON.parse((await value).content[0].text);

describe('WebMCP surface', () => {
  afterEach(() => {
    delete document.modelContext;
    delete window.ledgerDemoTools;
  });

  it('exposes six narrow, legible tools and no approval tool', () => {
    const tools = createLedgerTools(() => structuredClone(seedState), vi.fn());
    expect(tools.map((tool) => tool.name)).toEqual(['list_projects', 'inspect_project_contract', 'propose_brick', 'submit_evidence', 'request_status_change', 'inspect_audit_history']);
    expect(tools.some((tool) => tool.name.includes('approve'))).toBe(false);
  });

  it('refuses an agent request to approve', async () => {
    const tools = createLedgerTools(() => structuredClone(seedState), vi.fn());
    const requestTool = tools.find((tool) => tool.name === 'request_status_change')!;
    const response = await readResult(requestTool.execute({ requestedStatus: 'approved' }));
    expect(response.ok).toBe(false);
    expect(response.reason).toContain('human-only');
  });

  it('returns canonical history through a read-only inspection tool', async () => {
    const tools = createLedgerTools(() => structuredClone(seedState), vi.fn());
    const inspect = tools.find((tool) => tool.name === 'inspect_audit_history')!;
    expect(inspect.annotations?.readOnlyHint).toBe(true);
    expect(await readResult(inspect.execute({}))).toHaveLength(2);
  });

  it('registers all six tools when the native document.modelContext surface is available', async () => {
    const registeredNames: string[] = [];
    const registerTool: NonNullable<Document['modelContext']>['registerTool'] = vi.fn(async (tool) => {
      registeredNames.push(tool.name);
    });
    document.modelContext = { registerTool };
    const tools = createLedgerTools(() => structuredClone(seedState), vi.fn());

    const registration = await registerWebMcpTools(tools);

    expect(registration).toMatchObject({ available: true, count: 6 });
    expect(registerTool).toHaveBeenCalledTimes(6);
    expect(registeredNames).toEqual([
      'list_projects',
      'inspect_project_contract',
      'propose_brick',
      'submit_evidence',
      'request_status_change',
      'inspect_audit_history'
    ]);
    registration.cleanup();
    expect(window.ledgerDemoTools).toBeUndefined();
  });
});
