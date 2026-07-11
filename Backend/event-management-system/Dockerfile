# Use a lightweight Java runtime
FROM amazoncorretto:17-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file built by Maven into the container
COPY target/*.jar app.jar

# Expose the port your backend runs on
EXPOSE 8081

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
