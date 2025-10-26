# Stage 1: Build the application using Maven
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the Maven wrapper files first
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy the source code
COPY src ./src

# Package the application
RUN ./mvnw package -DskipTests

# Stage 2: Create the final image using a slim JRE
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the Eureka Server runs on (default 8761)
EXPOSE 8761

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]