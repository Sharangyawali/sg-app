export interface CorsOptions {
    origin?: boolean | string | RegExp | (string | RegExp)[] | CorsOptionsDelegate;
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
    maxAge?: number;
    vary?: boolean;
}

export interface CorsOptionsDelegate {
    (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void): void;
}
