import { Response } from "express";

export interface StaticRoutes {
    prefix?: string;
    path: string;
    options?: StaticOptions
}

export interface StaticOptions<T = Response> {
    acceptRanges?: boolean | undefined;
    cacheControl?: boolean | undefined;
    dotfiles?: string | undefined;
    etag?: boolean | undefined;
    extensions?: string[] | false | undefined;
    fallthrough?: boolean | undefined;
    immutable?: boolean | undefined;
    index?: boolean | string | string[] | undefined;
    lastModified?: boolean | undefined;
    maxAge?: number | string | undefined;
    redirect?: boolean | undefined;
    setHeaders?: ((res: T, path: string, stat: any) => any) | undefined;
}
