# Use official OpenJDK image
FROM openjdk:21-jdk-slim

# App directory
WORKDIR /app

# Copy jar file
COPY target/RemoveBg-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java","-jar","app.jar"]
