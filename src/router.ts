import { Router } from 'internal/types';

const Router = (): Router => {
  const router: Router = {
    routes: [],
    middlewares: [],
    use: (middleware: Function): void => {
      if (typeof middleware !== 'function') {
        throw new TypeError('Middleware must be a function');
      }
      router.middlewares.push(middleware);
    },
    get: (path: string, ...middlewares: Function[]): void => {
      router.routes.push({ method: 'GET', path, middlewares });
    },
    post: (path: string, ...middlewares: Function[]): void => {
      router.routes.push({ method: 'POST', path, middlewares });
    },
  };

  return router;
};

export default Router;
