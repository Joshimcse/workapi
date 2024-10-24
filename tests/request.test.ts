import WorkApiRequest from '../src/request';

describe('WorkApiRequest', () => {
  let mockRequest: Request;
  let workApiRequest: WorkApiRequest;

  beforeEach(() => {
    mockRequest = new Request('https://example.com/api', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    workApiRequest = new WorkApiRequest(mockRequest);
  });

  test('should create a WorkApiRequest instance', () => {
    expect(workApiRequest).toBeInstanceOf(WorkApiRequest);
    expect(workApiRequest).toBeInstanceOf(Request);
  });

  test('should have the same properties as the original request', () => {
    expect(workApiRequest.url).toBe(mockRequest.url);
    expect(workApiRequest.method).toBe(mockRequest.method);
    expect(workApiRequest.headers.get('Content-Type')).toBe(
      mockRequest.headers.get('Content-Type'),
    );
    expect(workApiRequest.body).toBe(null);
  });
});
