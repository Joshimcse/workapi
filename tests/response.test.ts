import WFResponse from '../src/response';

describe('WFResponse', () => {
  let response: WFResponse;

  beforeEach(() => {
    response = new WFResponse();
  });

  test('should initialize with default values', () => {
    expect(response.finished).toBe(false);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeNull();
    expect(response.headers).toEqual({});
  });

  test('should set status code', () => {
    response.status(404);
    expect(response.statusCode).toBe(404);
  });

  test('should set headers', () => {
    response.setHeader('Content-Type', 'application/json');
    expect(response.headers['Content-Type']).toBe('application/json');
  });

  test('should send JSON response', () => {
    response.json({ message: 'Hello World' });
    expect(response.body).toBe(JSON.stringify({ message: 'Hello World' }));
    expect(response.finished).toBe(true);
  });

  test('should send plain text response', () => {
    response.send('Hello World');
    expect(response.body).toBe('Hello World');
    expect(response.finished).toBe(true);
  });

  test('should send HTML response', () => {
    response.sendHtml('<h1>Hello World</h1>');
    expect(response.body).toBe('<h1>Hello World</h1>');
    expect(response.finished).toBe(true);
  });

  test('should handle error response', () => {
    response.error('Not Found', 404);
    expect(response.body).toBe(JSON.stringify({ error: 'Not Found' }));
    expect(response.statusCode).toBe(404);
    expect(response.finished).toBe(true);
  });
});
