import WFRequest from './internal/request';
import WFResponse from './internal/response';
import { generateRouteRegex } from './internal/utils';
import { HttpMethod, Route } from './internal/types';
import { findInCache, storeInCache } from './internal/cache';
import { isUseRouter, isFetchEvent, isUseMiddleware, isUseRouterWithMiddleware } from './internal/utils';

const routes: Array<Route> = [];
const middlewares: Array<Function> = [];

const addRoute = (method: HttpMethod, path: string, middlewares: Array<Function>) => {
  const handler = middlewares.pop() as Function;
  const { regex, keys } = generateRouteRegex(path);
  routes.push({ method, path: { regex, keys }, middlewares, handler });
};

const getRoute = (req: WFRequest): Route | undefined => {
  const path = new URL(req.url).pathname;
  return routes.find(route => route.method === req.method && route.path.regex.test(path));
};

const httpMethods = {
  get: (path: string, ...middlewares: Array<Function>): void => addRoute('GET', path, middlewares),
  post: (path: string, ...middlewares: Array<Function>): void => addRoute('POST', path, middlewares),
};

const run = async (request: Request): Promise<Response> => {
  const req = new WFRequest(request);
  const res = new WFResponse();
  const route = getRoute(req);

  if (!route) return new Response(`Cannot ${req.method} ${req.url}`, { status: 404 });

  await executeMiddlewares(req, res, route);

  return res.finished
    ? new Response(res.body, {
        status: res.statusCode,
        headers: res.headers,
      })
    : new Response(`Cannot ${req.method} ${req.url}`, { status: 404 });
};

const executeMiddlewares = async (req: WFRequest, res: WFResponse, route: Route): Promise<void> => {
  const { middlewares = [], handler } = route;

  const runMiddleware = async (index: number): Promise<void> => {
    if (index < middlewares.length) {
      const currentMiddleware = middlewares[index];
      await currentMiddleware(req, res, () => runMiddleware(index + 1));
    } else {
      await handler(req, res);
    }
  };

  await runMiddleware(0);
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
