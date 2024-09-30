import { Request } from 'express';
import { Query } from "express-serve-static-core";
import { Send } from 'express-serve-static-core';

export interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T;
}

export interface TypedRequestBody<T> extends Express.Request {
  body: T
}

export interface TypedResponse<T> extends Express.Response {
  status?: any;
  json: Send<T, this>;
}

export interface CustomRequest extends Request {
    userId?: string;
}
