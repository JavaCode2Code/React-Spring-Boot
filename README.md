Development with hot reload: run mvn spring-boot:run -Pskip-frontend in one terminal, then npm install && npm run dev inside frontend/ in another. Open http://localhost:5173; Vite proxies /api to Spring, so there’s no CORS setup.
Production: run mvn clean package, then java -jar target/springreact-0.0.1-SNAPSHOT.jar, and open http://localhost:8080.
