import { AsyncLocalStorage } from "async_hooks";
import crypto from "crypto";
import { Request, Response } from "express";

export class CLSService {
  private readonly asyncLocalStorage: AsyncLocalStorage<any>;
  constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage();
  }

  run(req: Request, fn: () => Promise<any> | any) {
    const requestId = crypto.randomUUID();
    return this.asyncLocalStorage.run({ requestId, request: req }, fn);
  }

  set(key: string, value: any): void {
    const store = this.asyncLocalStorage.getStore();
    if (!store) {
      throw new Error("CLS context not initialized");
    }
    store[key] = value;
  }

  get<T = any>(key: string): T {
    const store = this.asyncLocalStorage.getStore();
    if (!store) {
      throw new Error("CLS context not initialized");
    }
    return store[key];
  }
}
