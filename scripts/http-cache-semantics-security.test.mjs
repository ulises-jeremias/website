import CachePolicy from 'http-cache-semantics';
import { describe, expect, it } from 'vitest';

const request = {
  url: '/private',
  method: 'GET',
  headers: {},
};

const staleRequest = {
  ...request,
  headers: { 'cache-control': 'max-stale=60' },
};

describe('http-cache-semantics security patch', () => {
  it.each([
    ['shared Set-Cookie response', { 'cache-control': 'max-age=60', 'set-cookie': 'sid=secret' }],
    ['no-cache response', { 'cache-control': 'no-cache' }],
    ['proxy-revalidate response', { 'cache-control': 'max-age=60, proxy-revalidate' }],
  ])('requires revalidation for a stale %s despite request max-stale', (_label, headers) => {
    const policy = new CachePolicy(request, { status: 200, headers }, { shared: true });

    expect(policy.evaluateRequest(staleRequest).response).toBeUndefined();
  });

  it('still honors max-stale for ordinary zero-freshness responses', () => {
    const policy = new CachePolicy(
      request,
      { status: 200, headers: { 'cache-control': 'max-age=0' } },
      { shared: true },
    );

    expect(policy.evaluateRequest(staleRequest).response).toBeDefined();
  });
});
