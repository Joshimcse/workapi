import WFRequest from './request';
import { HttpMethod, Router, RouteRegexResult } from './types';

export const isGET = (method: string): boolean => method === 'GET';
export const isPUT = (method: string): boolean => method === 'PUT';
export const isHEAD = (method: string): boolean => method === 'HEAD';
export const isPOST = (method: string): boolean => method === 'POST';
export const isPATCH = (method: string): boolean => method === 'PATCH';
export const isDELETE = (method: string): boolean => method === 'DELETE';
export const isOPTIONS = (method: string): boolean => method === 'OPTIONS';

export const isFetchEvent = (event: Event): event is FetchEvent => 'request' in event;

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
