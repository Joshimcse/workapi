import { isGET, isHEAD } from './utils';

const Cache: Cache = (caches as any).default;

export const findInCache = async (event: FetchEvent) => {
  let req = event.request;
  if (isHEAD(req)) req = new Request(req, { method: 'GET' });

  let res = await Cache.match(req);
  if (isHEAD(req) && res) res = new Response(null, res);
  return res;
};

export const canBeCached = (res: Response): boolean => {
  if (res.status === 206) return false;

  const vary = res.headers.get('Vary') || '';
  if (!!~vary.indexOf('*')) return false;

  const ccontrol = res.headers.get('Cache-Control') || '';
  if (/(private|no-cache|no-store)/i.test(ccontrol)) return false;

  return true;
};

export const storeInCache = (event: FetchEvent, res: Response) => {
  const req = event.request;

  if ((isGET(req) || typeof req === 'string') && canBeCached(res)) {
    if (res.headers.has('Set-Cookie')) {
      res = new Response(res.body, res);
      res.headers.append('Cache-Control', 'private=Set-Cookie');
    }
    event.waitUntil(Cache.put(req, res.clone()));
  }

  return res;
};
