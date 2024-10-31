import WFRequest from 'internal/request';
import WFResponse from 'internal/response';
import { isGET, isHEAD } from 'internal/utils';

// export const execTimeLog = () => (req: WFRequest, res: WFResponse, next: Function) => {
//   res.isExecTimeLog = true;
//   next();
// };

export const bodyParser = () => async (req: WFRequest, res: WFResponse, next: Function) => {
  const ctype = req.headers.get('content-type');

  if (!ctype || isGET(req.method) || isHEAD(req.method)) return next();

  try {
    if (ctype.includes('application/json')) {
      req.body = await req.json();
    } else if (ctype.includes('multipart/form-data') || ctype.includes('application/x-www-form-urlencoded')) {
      req.body = Object.fromEntries(
        ((await req.formData()) as any).entries() as Iterable<[string, FormDataEntryValue]>,
      );
    } else if (ctype.startsWith('text/')) {
      req.body = await req.text();
    } else {
      req.body = await req.arrayBuffer();
    }
  } catch (err) {
    console.error('Error parsing request body:', err);
  }
  next();
};

export const cookieParser = () => (req: WFRequest, res: WFResponse, next: Function) => {
  req.cookies = Object.fromEntries((req.headers.get('cookie') || '').split(';').map(c => c.trim().split('=')));
  next();
};
