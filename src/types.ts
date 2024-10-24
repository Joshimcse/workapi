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
