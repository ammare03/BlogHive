# Stage 1: Build the application using Maven
FROM openjdk:17-jdk-slim as builder

WORKDIR /app

# Copy the Maven wrapper and the root pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Copy the specific module's pom.xml
COPY comment-service/pom.xml ./comment-service/

# Make the mvnw script executable
RUN chmod +x ./mvnw

# Download dependencies.
RUN ./mvnw -f comment-service/pom.xml dependency:go-offline

# Copy the source code for the specific module
COPY comment-service/src ./comment-service/src

# Build and package the application, skipping tests
RUN ./mvnw -f comment-service/pom.xml clean package -DskipTests

# Stage 2: Create the final, lightweight image
FROM openjdk:17-jre-slim

WORKDIR /app

# Copy the built JAR file from the builder stage
COPY --from=builder /app/comment-service/target/*.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]