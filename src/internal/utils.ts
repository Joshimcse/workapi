import { HttpMethod, Router, RouteRegexResult } from './types';

/**
 * Checks if the request method matches the specified HTTP method.
 *
 * @param req - The Request object to check.
 * @param method - The HTTP method to compare against.
 * @returns True if the request method matches, false otherwise.
 */
const isMethod = (req: Request, method: HttpMethod): boolean => req.method === method;

/**
 * Checks if the request method is GET.
 *
 * @param req - The Request object to check.
 * @returns True if the request method is GET, false otherwise.
 */
export const isGET = (req: Request): boolean => isMethod(req, 'GET');

/**
 * Checks if the request method is PUT.
 *
 * @param req - The Request object to check.
 * @returns True if the request method is PUT, false otherwise.
 */
export const isPUT = (req: Request): boolean => isMethod(req, 'PUT');

/**
 * Checks if the request method is HEAD.
 *
 * @param req - The Request object to check.
 * @returns True if the request method is HEAD, false otherwise.
 */
export const isHEAD = (req: Request): boolean => isMethod(req, 'HEAD');

/**
 * Checks if the request method is POST.
 *
 * @param req - The Request object to check.
 * @returns True if the request method is POST, false otherwise.
 */
export const isPOST = (req: Request): boolean => isMethod(req, 'POST');

/**
 * Checks if the request method is DELETE.
 *
 * @param req - The Request object to check.
 * @returns True if the request method is DELETE, false otherwise.
 */
export const isDELETE = (req: Request): boolean => isMethod(req, 'DELETE');

/**
 * Checks if the request method is PATCH.
 *
 * @param req - The Request object to check.
 * @returns True if the request method is PATCH, false otherwise.
 */
export const isPATCH = (req: Request): boolean => isMethod(req, 'PATCH');

/**
 * Checks if the request method is OPTIONS.
 *
 * @param req - The Request object to check.
 * @returns True if the request method is OPTIONS, false otherwise.
 */
export const isOPTIONS = (req: Request): boolean => isMethod(req, 'OPTIONS');

/**
 * Determines if the given event is a FetchEvent.
 *
 * @param event - The Event object to check.
 * @returns True if the event is a FetchEvent, false otherwise.
 */
export const isFetchEvent = (event: Event): event is FetchEvent => 'request' in event;

/**
 * Generates a regex pattern and keys for a given route string or RegExp.
 *
 * @param input - The route string or regular expression.
 * @returns An object containing the regex pattern and keys extracted from the input.
 */
export const generateRouteRegex = (input: string | RegExp): RouteRegexResult => {
  if (input instanceof RegExp) {
    return { keys: [], regex: input };
  }

  let c: string;
  let o: number;
  let tmp: string;
  let ext: number;
  const keys: string[] = [];
  let pattern = '';
  const arr = input.split('/');

  if (!arr[0]) arr.shift();

  while ((tmp = arr.shift()!)) {
    c = tmp[0];
    if (c === '*') {
      keys.push(c);
      pattern += tmp[1] === '?' ? '(?:/(.*))?' : '/(.*)';
    } else if (c === ':') {
      o = tmp.indexOf('?', 1);
      ext = tmp.indexOf('.', 1);
      keys.push(tmp.substring(1, o !== -1 ? o : ext !== -1 ? ext : tmp.length));
      pattern += o !== -1 && ext === -1 ? '(?:/([^/]+?))?' : '/([^/]+?)';
      if (ext !== -1) pattern += (o !== -1 ? '?' : '') + '\\' + tmp.substring(ext);
    } else {
      pattern += '/' + tmp;
    }
  }

  return {
    keys,
    regex: new RegExp('^' + pattern + '\\/?$', 'i'),
  };
};

const isRouter = (obj: any): obj is Router =>
  obj &&
  ['routes', 'middlewares'].every(prop => Array.isArray(obj[prop])) &&
  ['use', 'get', 'post'].every(method => typeof obj[method] === 'function');

export const isUseMiddleware = (args: any[]): args is [Function] => args.length === 1 && typeof args[0] === 'function';

export const isUseRouter = (args: any[]): args is [string, Router] =>
  args.length === 2 && typeof args[0] === 'string' && isRouter(args[1]);

export const isUseRouterWithMiddleware = (args: any[]): args is [string, Function, Router] =>
  args.length === 3 && typeof args[0] === 'string' && typeof args[1] === 'function' && isRouter(args[2]);
