# Spring Boot + React starter

Spring Boot 3 (Java 17) REST API with a React 18 + Vite frontend.
Two ways to run it: two dev servers with hot reload, or one jar for production.

```
springreact/
├── pom.xml                      Maven build (also builds the frontend)
├── Dockerfile                   Multi-stage build -> single image
├── src/main/java/...            Spring Boot API
│   ├── TodoController.java      /api/hello and /api/todos (in-memory)
│   ├── SpaConfig.java           Serves React + index.html fallback for routes
│   └── ApiExceptionHandler.java Validation errors -> {"error": "..."}
├── src/test/java/...            MockMvc tests
└── frontend/                    React app (Vite, React Router)
    ├── vite.config.js           Dev proxy (/api -> :8080) + build output dir
    └── src/                     App, pages, api.js
```

## Prerequisites
- JDK 17+
- Maven 3.9+
- Node 18+ (only for the dev workflow; the Maven build downloads its own Node)

## 1. Development (hot reload)

Terminal 1, backend:
```bash
mvn spring-boot:run -Pskip-frontend
```

Terminal 2, frontend:
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Vite proxies `/api/*` to Spring Boot on port 8080,
so the browser sees a single origin and CORS is not needed.

## 2. Production (single jar)

```bash
mvn clean package
java -jar target/springreact-0.0.1-SNAPSHOT.jar
```

Open http://localhost:8080. During `package`, Maven installs Node locally in
`target/`, runs `npm install` and `npm run build`, and Vite writes the bundle
into `target/classes/static`, which is packaged into the jar.

Backend-only build (skip the frontend): `mvn package -Pskip-frontend`

## Docker
```bash
docker build -t springreact .
docker run -p 8080:8080 springreact
```

## Deploying frontend and backend separately
1. Build the React app with `VITE_API_URL=https://api.example.com npm run build`
   and host `frontend/dist` on Nginx, a CDN or similar.
2. Add CORS on the Spring side for that origin:
```java
@Bean
WebMvcConfigurer cors() {
    return new WebMvcConfigurer() {
        public void addCorsMappings(CorsRegistry r) {
            r.addMapping("/api/**").allowedOrigins("https://app.example.com");
        }
    };
}
```
(Note: with the separate build, change `outDir` in `vite.config.js` back to `dist`.)

## Next steps
- Persistence: add `spring-boot-starter-data-jpa` plus a database driver and
  replace the in-memory map in `TodoController` with a repository.
- Security: add `spring-boot-starter-security`. Permit `/`, `/index.html`,
  `/assets/**` and your SPA routes. For cookie sessions, enable CSRF handling
  with `CookieCsrfTokenRepository.withHttpOnlyFalse()`; for JWT, send the token
  in an `Authorization` header from `api.js`.
