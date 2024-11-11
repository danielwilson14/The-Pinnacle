# frontend/Dockerfile

# Use the official Node.js image
FROM node:14

# Create and set the working directory in the container
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Expose port 3000 for the frontend app
EXPOSE 3000

# Start the application
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
