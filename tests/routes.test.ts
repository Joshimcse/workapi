/// <reference lib="webworker" />

import WFRequest from '../src/request';
import { generateRouteRegex } from '../src/utils';
import { addRoute, getRoute, httpMethods, routes } from '../src/routes';

jest.mock('../src/utils', () => ({
  generateRouteRegex: jest.fn(),
}));

describe('Routing System', () => {
  beforeEach(() => {
    routes.length = 0;
    (generateRouteRegex as jest.Mock).mockClear();
  });

  describe('addRoute', () => {
    test('should add a new route to the routes array', () => {
      const mockHandler = jest.fn();
      const path = '/users/:id';
      const middlewares = [jest.fn()];

      (generateRouteRegex as jest.Mock).mockReturnValue({
        regex: /^\/users\/([^/]+?)\/?$/i,
        keys: ['id'],
      });

      addRoute('GET', path, [...middlewares, mockHandler]);

      expect(routes).toHaveLength(1);
      expect(routes[0]).toEqual({
        method: 'GET',
        path: {
          regex: expect.any(RegExp),
          keys: ['id'],
        },
        middlewares: middlewares,
        handler: mockHandler,
      });
    });
  });

  describe('getRoute', () => {
    test('should return the correct route for a matching request', () => {
      const mockHandler = jest.fn();
      const path = '/users/:id';
      const middlewares = [jest.fn()];

      (generateRouteRegex as jest.Mock).mockReturnValue({
        regex: /^\/users\/([^/]+?)\/?$/i,
        keys: ['id'],
      });

      addRoute('GET', path, [...middlewares, mockHandler]);

      const req = new Request('http://localhost/users/123', {
        method: 'GET',
      });
      const wfRequest = new WFRequest(req);
      const route = getRoute(wfRequest);

      expect(route).toBeDefined();
      expect(route).toEqual({
        method: 'GET',
        path: {
          regex: expect.any(RegExp),
          keys: ['id'],
        },
        middlewares: middlewares,
        handler: mockHandler,
      });
    });

    test('should return undefined for a non-matching request', () => {
      const req = new Request('http://localhost/nonexistent', {
        method: 'GET',
      });
      const wfRequest = new WFRequest(req);
      const route = getRoute(wfRequest);

      expect(route).toBeUndefined();
    });
  });

  describe('httpMethods', () => {
    test('httpMethods.get should add a GET route', () => {
      const mockHandler = jest.fn();
      const path = '/users';

      httpMethods.get(path, mockHandler);

      expect(routes).toHaveLength(1);
      expect(routes[0]).toEqual({
        method: 'GET',
        path: expect.any(Object),
        middlewares: [],
        handler: mockHandler,
      });
    });

    test('httpMethods.post should add a POST route', () => {
      const mockHandler = jest.fn();
      const path = '/users';

      httpMethods.post(path, mockHandler);

      expect(routes).toHaveLength(1);
      expect(routes[0]).toEqual({
        method: 'POST',
        path: expect.any(Object),
        middlewares: [],
        handler: mockHandler,
      });
    });

    test('httpMethods.get should add a route with middlewares', () => {
      const mockMiddleware = jest.fn();
      const mockHandler = jest.fn();
      const path = '/users';

      httpMethods.get(path, mockMiddleware, mockHandler);

      expect(routes).toHaveLength(1);
      expect(routes[0]).toEqual({
        method: 'GET',
        path: expect.any(Object),
        middlewares: [mockMiddleware],
        handler: mockHandler,
      });
    });
  });
});
