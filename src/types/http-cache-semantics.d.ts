declare module 'http-cache-semantics' {
  interface CacheRequest {
    url: string;
    method: string;
    headers: Record<string, string>;
  }

  interface CacheResponse {
    status: number;
    headers: Record<string, string>;
  }

  interface CachePolicyOptions {
    shared?: boolean;
  }

  interface EvaluationResult {
    response?: CacheResponse;
  }

  class CachePolicy {
    constructor(request: CacheRequest, response: CacheResponse, options?: CachePolicyOptions);
    evaluateRequest(request: CacheRequest): EvaluationResult;
  }

  export = CachePolicy;
}
