# Stage 1: Build the application using Maven
FROM openjdk:17-jre-slim-bullseye

WORKDIR /app

# Copy the Maven wrapper and the root pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Copy the specific module's pom.xml
COPY post-service/pom.xml ./post-service/

# Make the mvnw script executable
RUN chmod +x ./mvnw

# Download dependencies.
RUN ./mvnw -f post-service/pom.xml dependency:go-offline

# Copy the source code for the specific module
COPY post-service/src ./post-service/src

# Build and package the application, skipping tests
RUN ./mvnw -f post-service/pom.xml clean package -DskipTests

# Stage 2: Create the final, lightweight image
FROM openjdk:17-jre-slim-bullseye

WORKDIR /app

# Copy the built JAR file from the builder stage
COPY --from=builder /app/post-service/target/*.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]