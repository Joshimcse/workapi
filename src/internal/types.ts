export type UseFn =
  | ((middleware: Function) => void)
  | ((path: Path, middleware: Function) => void)
  | ((path: Path, middleware: Function, router: Router) => void);

export type Middlewares = Array<Function>;

export type Query = Record<string, string>;

export type Params = Record<string, string>;

export type Path = { regex: RegExp; keys: Array<string> };

export type RouteRegexResult = { keys: Array<string>; regex: RegExp };

export type HttpMethodFn = (path: string, ...middlewares: Middlewares) => void;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export type RRoute = { path: string; method: HttpMethod; middlewares: Middlewares };

export type WFRoute = Omit<RRoute, 'path'> & { path: Path; query?: Query; params?: Params; handler: Function };

export type Router = {
  use: UseFn;
  get: HttpMethodFn;
  post: HttpMethodFn;
  routes: Array<RRoute>;
  middlewares: Middlewares;
};
