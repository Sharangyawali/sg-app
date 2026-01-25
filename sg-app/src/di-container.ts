import "reflect-metadata";
import {
  Constructor,
  Provider,
  REQUEST,
  Scope,
  Token
} from "./common";
import { CLSService } from "./cls";

class Container {
  private providers = new Map<Token, Provider>();
  private singletons = new Map<Token, any>();
  private requestCache = new Map<string, Map<Token, any>>();
  private effectiveScopeCache = new Map<Token, Scope>();
  private readonly ScopeRank: Record<Scope, number> = {
    ['singleton']: 0,
    ['request']: 1,
    ['transient']: 2,
  };
  register(provider: Provider) {
    this.providers.set(provider.token, provider);
  }

  async resolve<T>(token: Token<T>, requestId?: string): Promise<T> {
    const provider = this.providers.get(token);
    if (token === REQUEST) {
      const cls = await this.resolve(CLSService);
      return cls.get("request");
    }
    const effectiveScope = this.computeEffectiveScope(token);

    if (provider?.useValue !== undefined) {
      return provider.useValue;
    }

    if (effectiveScope === Scope.SINGLETON) {
      if (!this.singletons.has(token)) {
        const instance = await this.createInstance(provider, requestId, token);
        this.singletons.set(token, instance);
      }
      return this.singletons.get(token);
    }

    if (effectiveScope === Scope.REQUEST) {
      if (!requestId) {
        throw new Error(
          `Request-scoped provider "${String(token)}" requires requestId`
        );
      }

      let cache = this.requestCache.get(requestId);
      if (!cache) {
        cache = new Map();
        this.requestCache.set(requestId, cache);
      }

      if (!cache.has(token)) {
        const instance = await this.createInstance(provider, requestId, token);
        cache.set(token, instance);
      }

      return cache.get(token);
    }

    return this.createInstance(provider, requestId, token);
  }

  private async createInstance<T>(
    provider: Provider,
    requestId: string | undefined,
    token: Token<T>
  ): Promise<T> {
    if (!provider) {
      throw new Error(`No provider for token ${String(token)}`);
    }

    if (provider.useFactory) {
      const deps = await this.resolveDeps(provider.inject ?? [], requestId);
      return provider.useFactory(...deps) as T;
    }

    if (provider.useClass) {
      return await this.construct(provider.useClass, requestId);
    }

    throw new Error(`Invalid provider for ${String(token)}`);
  }

  private async resolveDeps(tokens: Token[], requestId?: string) {
    const deps = [];
    for (const t of tokens) {
      deps.push(await this.resolve(t, requestId));
    }
    return deps;
  }

  private async construct<T>(
    target: Constructor<T>,
    requestId?: string
  ): Promise<T> {
    const injections =
      Reflect.getMetadata("custom:inject_tokens", target) || {};

    const args = [];
    for (const index of Object.keys(injections)) {
      args[+index] = await this.resolve(injections[index], requestId);
    }

    return new target(...args);
  }

  computeEffectiveScope(token: Token): Scope {
    if (token === REQUEST) {
      return Scope.REQUEST
    }
    if (this.effectiveScopeCache.has(token)) {
      return this.effectiveScopeCache.get(token)!;
    }

    const provider = this.providers.get(token);
    let scope = provider?.scope ?? Scope.SINGLETON;

    const deps: Token[] = [];

    if (provider?.inject) {
      deps.push(...provider.inject);
    }

    if (provider?.useClass) {
      const injections =
        Reflect.getMetadata("custom:inject_tokens", provider.useClass) || {};
      deps.push(...Object.values(injections) as any);
    }

    for (const dep of deps) {
      const depScope = this.computeEffectiveScope(dep);
      scope = this.maxScope(scope, depScope);
    }

    this.effectiveScopeCache.set(token, scope);
    return scope;
  }

  private maxScope(a: Scope, b: Scope): Scope {
    return this.ScopeRank[a] > this.ScopeRank[b] ? a : b;
  }

  removeRequest(requestId: string) {
    this.requestCache.delete(requestId);
  }
}

export const container = new Container();