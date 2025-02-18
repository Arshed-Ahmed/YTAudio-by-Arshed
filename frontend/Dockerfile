# Use the official Node.js image
FROM node:20.9.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# # Build the React app
# RUN npm run build

# # Install a simple static server to serve the built React app
# RUN npm install -g serve

# Expose the port that the app will run on
EXPOSE 3000

# Run the React app with the static server
# CMD ["serve", "-s", "build", "-l", "3000"]

# Start the frontend
CMD ["npm", "run", "dev"]
