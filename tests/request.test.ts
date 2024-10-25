import WFRequest from '../src/internal/request';

describe('WFRequest', () => {
  let mockRequest: Request;
  let wfRequest: WFRequest;

  beforeEach(() => {
    mockRequest = new Request('https://example.com/api', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    wfRequest = new WFRequest(mockRequest);
  });

  test('should create a WFRequest instance', () => {
    expect(wfRequest).toBeInstanceOf(WFRequest);
    expect(wfRequest).toBeInstanceOf(Request);
  });

  test('should have the same properties as the original request', () => {
    expect(wfRequest.url).toBe(mockRequest.url);
    expect(wfRequest.method).toBe(mockRequest.method);
    expect(wfRequest.headers.get('Content-Type')).toBe(mockRequest.headers.get('Content-Type'));
    expect(wfRequest.body).toBe(null);
  });
});
