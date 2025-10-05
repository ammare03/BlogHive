# Stage 1: Build the application
FROM eclipse-temurin:22-jdk-jammy AS builder
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
COPY src ./src
RUN ls -la
RUN chmod +x ./mvnw
RUN ./mvnw clean install -DskipTests

# Stage 2: Create the final, lightweight image
FROM eclipse-temurin:22-jre-jammy
WORKDIR /app
COPY --from=builder /app/target/*.jar ./app.jar
EXPOSE 8888
ENTRYPOINT ["java", "-jar", "app.jar"]