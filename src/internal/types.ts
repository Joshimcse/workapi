export type Route = {
  path: Path;
  handler: Function;
  method: HttpMethod;
  middlewares: Array<Function>;
  query?: Record<string, string>;
  params?: Record<string, string>;
};
export type Path = { regex: RegExp; keys: Array<string> };
export type RouteRegexResult = { keys: Array<string>; regex: RegExp };
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export type RouterRoute = {
  path: string;
  method: HttpMethod;
  middlewares: Array<Function>;
};

export type Router = {
  _routes: Array<RouterRoute>;
  _middlewares: Array<Function>;
  use: (middleware: Function) => void;
  get: (path: string, ...middlewares: Array<Function>) => void;
  post: (path: string, ...middlewares: Array<Function>) => void;
};
