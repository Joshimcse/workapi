/// <reference lib="webworker" />

import { Route } from './types';
import WorkApiRequest from './request';
import { isFetchEvent } from './utils';
import WorkApiResponse from './response';
import { getRoute, httpMethods } from './routes';
import { findInCache, storeInCache } from './cache';

const handler = async (event: FetchEvent): Promise<Response> => {
  const req = new WorkApiRequest(event.request);
  const res = new WorkApiResponse();
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

const executeMiddlewares = async (
  req: WorkApiRequest,
  res: WorkApiResponse,
  route: Route,
): Promise<void> => {
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
    findInCache(event).then(
      cached => cached || handler(event).then(res => storeInCache(event, res)),
    ),
  );
};

const listen = (): void => {
  addEventListener('fetch', reply);
};

const workapi = () => ({
  listen,
  ...httpMethods,
});

export default workapi;
