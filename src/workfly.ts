import WFRequest from './internal/request';
import WFResponse from './internal/response';
import { generateRouteRegex } from './internal/utils';
import { findInCache, storeInCache } from './internal/cache';
import { HttpMethod, Middlewares, WFRoute } from './internal/types';
import { isUseRouter, isFetchEvent, isUseMiddleware, isUseRouterWithMiddleware } from './internal/utils';

const routes: Array<WFRoute> = [];
const middlewares: Middlewares = [];

const addRoute = (method: HttpMethod, path: string, middlewares: Middlewares) => {
  const handler = middlewares.pop() as Function;
  const { regex, keys } = generateRouteRegex(path);
  routes.push({ method, path: { regex, keys }, middlewares, handler });
};

const getRoute = (req: WFRequest): WFRoute | undefined => {
  const path = new URL(req.url).pathname;
  return routes.find(route => route.method === req.method && route.path.regex.test(path));
};

const httpMethods = {
  get: (path: string, ...middlewares: Middlewares): void => addRoute('GET', path, middlewares),
  post: (path: string, ...middlewares: Middlewares): void => addRoute('POST', path, middlewares),
};

const run = async (request: Request): Promise<Response> => {
  const req = new WFRequest(request);
  const res = new WFResponse();
  const route = getRoute(req);

  if (!route) return new Response(`Cannot ${req.method} ${req.url}`, { status: 404 });

  await runMiddlewares(req, res, route);

  if (res.isExecTimeLog) {
    console.log(`[workfly:log] ${route.method} ${req.url} - ${res.elapsedTime}ms`);
  }

  return res.finished
    ? new Response(res.body, { status: res.statusCode, headers: res.headers })
    : new Response(`Cannot ${req.method} ${req.url}`, { status: 404 });
};

const runMiddlewares = async (req: WFRequest, res: WFResponse, route: WFRoute): Promise<void> => {
  const _middlewares = [...middlewares, ...route.middlewares];

  const next = async (i: number): Promise<void> => {
    if (i < _middlewares.length) {
      await _middlewares[i](req, res, () => next(i + 1));
    } else {
      await route.handler(req, res);
    }
  };

  await next(0);
};

const reply = (event: Event): void => {
  if (!isFetchEvent(event)) return;

  event.respondWith(
    findInCache(event).then(cached => cached || run(event.request).then(res => storeInCache(event, res))),
  );
};

const use = (...args: Array<any>) => {
  if (isUseMiddleware(args)) {
    const [middleware] = args;
    middlewares.push(middleware);
  } else if (isUseRouter(args)) {
    const [path, router] = args;
    const routerRoutes = router.routes;
    const routerMiddlewares = router.middlewares;

    routerRoutes.forEach(route => {
      const { path: routePath, method, middlewares } = route;
      const fullPath = `${path}${routePath}`;
      addRoute(method, fullPath, [...routerMiddlewares, ...middlewares]);
    });
  } else if (isUseRouterWithMiddleware(args)) {
    const [path, middleware, router] = args;
    const routerRoutes = router.routes;
    const routerMiddlewares = router.middlewares;

    routerRoutes.forEach(route => {
      const { path: routePath, method, middlewares } = route;
      const fullPath = `${path}${routePath}`;
      addRoute(method, fullPath, [middleware, ...routerMiddlewares, ...middlewares]);
    });
  }
};

const listen = (): void => {
  addEventListener('fetch', reply);
};

const workfly = () => ({
  listen,
  use,
  ...httpMethods,
});

export default workfly;
