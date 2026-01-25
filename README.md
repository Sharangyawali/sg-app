# ⚡ SG-APP

A lightweight, opinionated framework built on top of **Express**, inspired by NestJS, designed for **Clean Architecture**, **modularity**, and **developer productivity** — without hiding Express.

SG-APP is a tailored for Express applications. It provides a structured, decorator-driven approach to building scalable Node.js applications, incorporating many NestJS concepts while adapting them to fit Express seamlessly.

---

## ✨ Features

- 🚀 Built on **Express** - Leverages the power and flexibility of Express.js
- 🧱 Clean Architecture out of the box - Promotes separation of concerns and maintainable code
- 🧩 Module-based structure - Organize your app into reusable modules
- 🪄 Decorator-based API - Use decorators for controllers, routes, guards, interceptors, filters, and more
- 🔌 Dependency Injection - Built-in DI container for managing dependencies
- 🧵 Request-scoped context via CLS (Continuation Local Storage) - Maintain context across asynchronous operations
- 📝 Centralized logging & configuration - Integrated AppLogger and ConfigService
- 🛠 Compatible with plain Express middleware - Easy integration with existing Express ecosystem
- 🔒 Guards and Filters - Protect routes and handle errors gracefully
- 🎯 Interceptors - Transform requests and responses
- 🌐 Global Prefixes and CORS support - Configure app-wide settings

---

## 🧩 Components

### Decorators

SG-APP provides a rich set of decorators, similar to NestJS but with some custom naming:

- **@RestController** - Defines a controller class
- **@Get, @Post, @Put, @Delete, @Patch** (via route-mapping) - HTTP method decorators for routes
- **@Inject** - Marks dependencies for injection
- **@Module** - Defines a module with providers, controllers, etc.
- **@Component** - Marks a class as a component for DI
- **@UseGuard** - Defines route guards
- **@GlobalGuard** - Defines global guards
- **@UseInterceptor** - Defines routes request/response interceptors
- **@GlobalInterceptors** - Defines global request/response interceptors
- **@Catch** - Defines exception filters
- **@Middleware** - Applies middleware to routes or controllers
- **@Body, @Params, @Query, @UploadedFiles, @UploadedFile, @Req, @Res** - Routes parameters

### Services and Core Features

- **Dependency Injection (DI) Container** - Manages and injects dependencies automatically
- **Routes Configuration** - Centralized route setup and management
- **CLS Service** - Provides request-scoped context using Continuation Local Storage for tracking requests across async operations
- **AppLogger** - Centralized logging service for consistent application logging
- **ConfigService** - Manages application configuration from environment variables or files
- **HTTP Context** - Access to request and response objects in a structured way
- **HTTP Exceptions** - Standardized error handling with custom exceptions
- **SG Application** - Core application class for bootstrapping
- **SG Factory** - Factory for creating and configuring the app instance

---

## 📥 Installation

```bash
npm install -g @sharangyawali/sg-cli
sg-cli create-new test
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
