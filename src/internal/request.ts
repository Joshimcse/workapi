import { HttpMethod } from './types';

export default class WFRequest {
  url: string;
  method: string;
  headers: Headers;
  referrer: string;
  mode: RequestMode;
  integrity: string;
  keepalive: boolean;
  cache: RequestCache;
  redirect: RequestRedirect;
  referrerPolicy: ReferrerPolicy;
  credentials: RequestCredentials;
  cookies: Record<string, string> = {};
  body: BodyInit | Record<string, any> | null;
  json: () => Promise<any>;
  arrayBuffer: () => Promise<ArrayBuffer>;
  blob: () => Promise<Blob>;
  text: () => Promise<string>;

  constructor(private request: Request) {
    this.url = request.url;
    this.method = request.method;
    this.headers = new Headers(request.headers);
    this.referrer = request.referrer;
    this.mode = request.mode;
    this.integrity = request.integrity;
    this.keepalive = request.keepalive;
    this.cache = request.cache;
    this.redirect = request.redirect;
    this.referrerPolicy = request.referrerPolicy;
    this.credentials = request.credentials;
    this.body = request.body ? request.body : null;

    // Bind methods to avoid Illegal Invocation error
    this.json = request.json.bind(request);
    this.arrayBuffer = request.arrayBuffer.bind(request);
    this.blob = request.blob.bind(request);
    this.text = request.text.bind(request);
  }

  formData(): Promise<FormData> {
    return this.request.formData();
  }
}
