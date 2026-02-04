# ⚡ SG-APP

**A lightweight, opinionated framework built on top of Express.**
Inspired by NestJS, `sg-app` is designed for **Clean Architecture**, **modularity**, and **developer productivity** — without hiding the power of Express.

It provides a structured, decorator-driven approach to building scalable Node.js applications, incorporating dependency injection, modular organization, and a suite of powerful features while adapting them to fit Express seamlessly.

---

## ✨ Features

- **🚀 Built on Express**: Leverages the power, flexibility, and ecosystem of Express.js.
- **🧱 Clean Architecture**: Promotes separation of concerns and maintainable code structure out of the box.
- **🧩 Modular Design**: Organize your app into reusable `@Module`s.
- **🪄 Decorator-based API**: Intuitive decorators for Controllers, Routes, Guards, Interceptors, and more.
- **🔌 Dependency Injection**: Built-in DI container for effortless dependency management (`@Inject`, `@Component`).
- **🧵 Request Context (CLS)**: Built-in Continuation Local Storage for request-scoped context across async operations.
- **📝 Centralized Logging & Config**: Integrated `AppLogger` and `ConfigService`.
- **🛠 Compatible with Express**: Easy integration with existing Express middleware and libraries.
- **🔒 Guards & Filters**: Protect routes and handle exceptions gracefully.
- **🎯 Interceptors**: Transform requests and responses globally or per-route.
- **🌐 Global Prefixes & CORS**: standard configurations made easy.

---

## 📦 Installation

To start using `sg-app`, install the CLI tool globally:

```bash
npm install -g @sharangyawali/sg-cli
```

---

## 🚀 Quick Start

### 1. Create a New Project

Use the CLI to generate a new project with a ready-to-use Clean Architecture structure.

```bash
sg create-new my-awesome-app
```

You will be prompted to:
- **Initialize TypeORM?** (Yes/No)
- **Select Database**: Postgres, MySql, Sqlite, or MongoDb (if TypeORM is selected).

### 2. Run the Application

Navigate to your project folder and start the development server:

```bash
cd my-awesome-app
npm run dev
```

The server typically starts on port **8000** (or as defined in your `.env`).

---

## 🛠 CLI Usage

The `sg` CLI helps you generate resources quickly.

### `sg create-new <appName>`
Scaffolds a complete `sg-app` project.

- **Arguments**: `appName` (The name of your project folder)
- **Interactive Prompts**:
  - Enable TypeORM?
  - Select Database Driver (Postgres, MySQL, SQLite, MongoDB)

### `sg generate`
Generates new modules, controllers, or other architectural components interactively inside your project.

```bash
sg generate
```

- **Prompts**:
  - **File Name**: e.g., `user`
  - **Class Name**: e.g., `User`
  - **Database detection**: If multiple datasources exist, it may ask you to select one.

---

## 🧩 Core Concepts & Code Examples

### 1. Bootstrap (`main.ts`)
The entry point of your application. It creates the app instance, resolves dependencies, and starts the server.

```typescript
import {
  AppLogger,
  ConfigService,
  container,
  SGFactory,
} from "@sharangyawali/sg-app";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = new SGFactory().create(AppModule, { cors: true });
  const logger = await container.resolve(AppLogger);
  const config: ConfigService = await container.resolve(ConfigService);
  const port = Number(config.get("APP_PORT")) || 8000;
  
  await app.listen(port, () => logger.log(`Listening on port ${port}`));
}
bootstrap();
```

### 2. Modules (`app.module.ts`)
Modules organize your application into cohesive blocks. Use `@Module` to define imports.

```typescript
import { Module } from "@sharangyawali/sg-app";
import { InfraModule } from "./infra/infra.module";
import { ApplicationModule } from "./application/application.module";

@Module({
  imports: [InfraModule, ApplicationModule],
})
export class AppModule {}
```

### 3. Controllers
Define routes using `@RestController` and method decorators like `@Get`, `@Post`, `@Put`, `@Delete`.

```typescript
import { Get, RestController } from "@sharangyawali/sg-app";

@RestController("demo")
export class DemoController {
  
  @Get("hello")
  hello(): string {
    return "Hello World!!";
  }
  
  // Example with parameters
  // @Post()
  // create(@Body(any) data: any) { ... }
}
```

---

## 🛡️ Advanced Features

SG-APP provides powerful features for request processing, security, and error handling.

### 1. Middleware
Middleware functions execute before the route handler. They can modify request/response objects or end the request-response cycle.

**Create a Middleware:**
Implement `SGMiddleware` and use the `@Middleware()` decorator.

```typescript
import { AppLogger, Inject, Middleware, SGMiddleware } from "@sharangyawali/sg-app";
import { Request, Response, NextFunction } from "express";

@Middleware()
export class LoggerMiddleware implements SGMiddleware {
    constructor(
        @Inject(AppLogger)
        private readonly logger: AppLogger
    ) { }
    
    use(request: Request, response: Response, next: NextFunction) {
        // ... Request logging logic ...
        next();
    }
}
```

**Registration:**
- **Scoped**: Pass options to the decorator: `@Middleware({ forRoutes: [{ path: '/demo', method: 'GET' }] })`.
- **Global**: Register it in a module's providers.

```typescript
@Module({
  providers: [LoggerMiddleware],
})
export class ServerModule { }
```

### 2. Guards
Guards determine whether a request should be handled by the route handler. They are perfect for authentication and authorization.

**Create a Guard:**
Implement `SGGuard` and implement the `canAccess` method.

```typescript
import { GlobalGuard, HttpContext, SGGuard } from "@sharangyawali/sg-app";

// Use @GlobalGuard() to make it apply to all routes automatically
@GlobalGuard()
export class AuthGuard implements SGGuard {
    async canAccess(httpContext: HttpContext): Promise<Boolean> {
        console.log('Auth Guard Checking...');
        return true; // Return false to deny access
    }
}
```

**Registration:**
- **Global**: Use `@GlobalGuard()` on the class AND register in a module.
- **Scoped**: Use `@UseGuard(AuthGuard)` on a controllers method.

```typescript
// Method-scoped
@Get("profile")
@UseGuard(AuthGuard)
getProfile() {}
```

### 3. Interceptors
Interceptors can transform the result returned from a function or extend the behavior of the method.

**Create an Interceptor:**
Implement `SGInterceptor`.

```typescript
import { GlobalInterceptors, HttpContext, SGInterceptor } from "@sharangyawali/sg-app";

@GlobalInterceptors()
export class ResponseInterceptor implements SGInterceptor {
    async intercept(httpContext: HttpContext): Promise<(data: any) => any | void> {
        console.log('Before Request...');
        
        return (data: any) => {
            console.log('After Request (Response Transformation)');
            return {
                message: 'Success',
                data
            }
        }
    }
}
```

**Registration:**
- **Global**: Use `@GlobalInterceptors()` on the class AND register in a module.
- **Scoped**: Use `@UseInterceptor(ResponseInterceptor)`.

```typescript
@UseInterceptor(ResponseInterceptor)
@Get("transform")
getData() { return { value: 1 }; }
```

### 4. Exception Filters
Exception filters let you control the exact flow of control and the content of the response sent back to the client when an exception occurs.

**Create a Filter:**
Implement `SGFilter` and decorate with `@Catch()`.

```typescript
import { Catch, HttpContext, HttpException, SGFilter } from "@sharangyawali/sg-app";

@Catch()
export class ExceptionFilter implements SGFilter {
    catch(exception: HttpException, context: HttpContext) {
        const message = exception.message;
        const statusCode = exception.statusCode;
        const response = context.getResponse();
        
        response.status(statusCode).json({
            message,
            statusCode,
            timestamp: new Date().toISOString()
        });
    }
}
```

**Registration:**
- **Global**: Use `@Catch()` AND register it as a provider in your main/server module.
- **Usage**: Once registered, it catches exceptions thrown from controllers/services.

```typescript
// Register in module
@Module({
  providers: [ExceptionFilter, ResponseInterceptor, AuthGuard, LoggerMiddleware],
})
export class ServerModule { }
```

---

### 5. Validation
SG-APP supports DTO validation using `class-validator` and `class-transformer`.

**Installation:**
You need to install these packages first:

```bash
npm install --save class-validator class-transformer
```

**Create a DTO:**
Define your data structure with validation decorators.

```typescript
import { IsEmail } from "class-validator";

export class EmailDto {
    @IsEmail()
    email: string;
}
```

**Usage in Controller:**
Use validation in route parameters (e.g., `@Query`, `@Body`).

```typescript
@Post("email")
email(@Body(EmailDto) body: EmailDto): string {
  return body.email;
}
```

---

## 📚 Decorator Reference

| Decorator | Role | Description |
| :--- | :--- | :--- |
| **`@RestController(path?)`** | Controller | Register a class as a controller. |
| **`@Module({ imports, providers })`**| Module | Defines a module. |
| **`@Component()`** | Provider | Marks a class as a provider. |
| **`@Inject(token)`** | DI | Injection token for dependencies. |
| **`@GlobalGuard()`** | Guard | Marks a guard as global. |
| **`@UseGuard(Guard)`** | Guard | Apply a guard to a specific scope. |
| **`@GlobalInterceptors()`** | Interceptor | Marks an interceptor as global. |
| **`@UseInterceptor(Int)`** | Interceptor | Apply an interceptor to a specific scope. |
| **`@Middleware(options?)`** | Middleware | Define a middleware with optional scoping. |
| **`@Catch()`** | Filter | Define an exception filter. |

---

## 📄 License

MIT
