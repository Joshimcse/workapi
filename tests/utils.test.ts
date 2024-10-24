/// <reference lib="webworker" />

import {
  isGET,
  isPUT,
  isHEAD,
  isPOST,
  isPATCH,
  isDELETE,
  isOPTIONS,
  isFetchEvent,
  generateRouteRegex,
} from '../src/utils';

describe('HTTP Method checks', () => {
  const mockRequest = (method: string): Request =>
    ({
      method,
    }) as Request;

  test('should return true for GET method', () => {
    const req = mockRequest('GET');
    expect(isGET(req)).toBe(true);
  });

  test('should return false for non-GET method', () => {
    const req = mockRequest('POST');
    expect(isGET(req)).toBe(false);
  });

  test('should return true for PUT method', () => {
    const req = mockRequest('PUT');
    expect(isPUT(req)).toBe(true);
  });

  test('should return true for HEAD method', () => {
    const req = mockRequest('HEAD');
    expect(isHEAD(req)).toBe(true);
  });

  test('should return true for POST method', () => {
    const req = mockRequest('POST');
    expect(isPOST(req)).toBe(true);
  });

  test('should return true for DELETE method', () => {
    const req = mockRequest('DELETE');
    expect(isDELETE(req)).toBe(true);
  });

  test('should return true for PATCH method', () => {
    const req = mockRequest('PATCH');
    expect(isPATCH(req)).toBe(true);
  });

  test('should return true for OPTIONS method', () => {
    const req = mockRequest('OPTIONS');
    expect(isOPTIONS(req)).toBe(true);
  });
});

describe('FetchEvent check', () => {
  test('should return true for FetchEvent', () => {
    const mockFetchEvent = { request: new Request('https://example.com') } as FetchEvent;
    expect(isFetchEvent(mockFetchEvent)).toBe(true);
  });

  test('should return false for non-FetchEvent', () => {
    const mockEvent = {} as Event;
    expect(isFetchEvent(mockEvent)).toBe(false);
  });
});

describe('Route Regex Generation', () => {
  test('should generate correct regex for static route', () => {
    const result = generateRouteRegex('/users');
    expect(result.regex.test('/users')).toBe(true);
    expect(result.keys).toEqual([]);
  });

  test('should generate correct regex for dynamic route', () => {
    const result = generateRouteRegex('/users/:id');
    expect(result.regex.test('/users/123')).toBe(true);
    expect(result.keys).toEqual(['id']);
  });

  test('should generate correct regex for wildcard route', () => {
    const result = generateRouteRegex('/users/*');
    expect(result.regex.test('/users/anything')).toBe(true);
    expect(result.keys).toEqual(['*']);
  });

  test('should handle optional parameters correctly', () => {
    const result = generateRouteRegex('/users/:id?');
    expect(result.regex.test('/users')).toBe(true);
    expect(result.regex.test('/users/123')).toBe(true);
    expect(result.keys).toEqual(['id']);
  });

  test('should handle regex input directly', () => {
    const inputRegex = /^\/users\/\d+$/;
    const result = generateRouteRegex(inputRegex);
    expect(result.regex).toEqual(inputRegex);
    expect(result.keys).toEqual([]);
  });
});
