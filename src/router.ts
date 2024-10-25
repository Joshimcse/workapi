type HttpMethod = 'GET' | 'POST';

type RouterRoute = {
  path: string;
  method: HttpMethod;
  middlewares: Array<Middleware>;
};

type Middleware = (req: Request, res: Response, next: () => void) => void;

type Router = {
  _routes: Array<RouterRoute>;
  _middlewares: Array<Middleware>;
  use: (middleware: Middleware) => void;
  get: (path: string, ...middlewares: Array<Middleware>) => void;
  post: (path: string, ...middlewares: Array<Middleware>) => void;
};

const router = (): Router => {
  const _routes: Array<RouterRoute> = [];
  const _middlewares: Array<Middleware> = [];

  const use = (middleware: Middleware): void => {
    if (typeof middleware !== 'function') {
      throw new Error('Middleware must be a function');
    }
    _middlewares.push(middleware);
  };

  const addRoute = (method: HttpMethod, path: string, middlewares: Array<Middleware>): void => {
    _routes.push({ method, path, middlewares });
  };

  const get = (path: string, ...middlewares: Array<Middleware>): void => {
    addRoute('GET', path, middlewares);
  };

  const post = (path: string, ...middlewares: Array<Middleware>): void => {
    addRoute('POST', path, middlewares);
  };

  return {
    use,
    get,
    post,
    _routes,
    _middlewares,
  };
};

export default router;
