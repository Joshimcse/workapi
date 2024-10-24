import WorkApiRequest from './request';
import { HttpMethod, Route } from './types';
import { generateRouteRegex } from './utils';

export const routes: Array<Route> = [];

export const addRoute = (method: HttpMethod, path: string, middlewares: Array<Function>) => {
  const handler = middlewares.pop() as Function;
  const { regex, keys } = generateRouteRegex(path);
  routes.push({ method, path: { regex, keys }, middlewares, handler });
};

export const getRoute = (req: WorkApiRequest): Route | undefined => {
  const path = new URL(req.url).pathname;
  return routes.find(route => route.method === req.method && route.path.regex.test(path));
};

export const httpMethods = {
  get: (path: string, ...middlewares: Array<Function>): void => addRoute('GET', path, middlewares),
  post: (path: string, ...middlewares: Array<Function>): void =>
    addRoute('POST', path, middlewares),
};
