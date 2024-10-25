import { CONTENT_TYPE } from './constants';

export default class WFResponse {
  private _finished = false;
  private _statusCode = 200;
  private _body: BodyInit | null = null;
  private _headers: Record<string, string> = {};

  get body() {
    return this._body;
  }
  get headers() {
    return this._headers;
  }
  get finished() {
    return this._finished;
  }
  get statusCode() {
    return this._statusCode;
  }

  private set body(data: BodyInit | null) {
    this._body = data;
  }
  private set statusCode(code: number) {
    this._statusCode = code;
  }

  status(code: number): this {
    if (!this._finished) this.statusCode = code;
    return this;
  }

  setHeader(name: string, value: string): this {
    if (!this._finished) this._headers[name] = value;
    return this;
  }

  setHeaders(headers: Record<string, string>): this {
    if (!this._finished) {
      Object.entries(headers).forEach(([key, value]) => this.setHeader(key, value));
    }
    return this;
  }

  json(data: any): this {
    return this.send(JSON.stringify(data), CONTENT_TYPE.JSON);
  }

  send(data: BodyInit, contentType = CONTENT_TYPE.TEXT): this {
    if (!this._finished) {
      this.setHeader('Content-Type', contentType);
      this.body = typeof data === 'object' ? JSON.stringify(data) : data;
      this._finished = true;
    }
    return this;
  }

  sendHtml(html: string): this {
    return this.send(html, CONTENT_TYPE.HTML);
  }

  sendStatus(code: number): this {
    if (!this._finished) {
      this.status(code);
      this.body = null;
      this._finished = true;
    }
    return this;
  }

  error(message: string, status: number): this {
    return this.status(status).json({ error: message });
  }
}
