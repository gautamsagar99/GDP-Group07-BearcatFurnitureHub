# Use an official Node.js runtime as a parent image 
FROM node:16.18.0

# Set the working directory in the container 
WORKDIR /app 

# Copy package.json and package-lock.json to the container 
COPY package*.json ./ 

# Install the dependencies 
RUN npm install 

# Copy the rest of the application source code to the container 
COPY . . 

# Expose the port your application will run on 
EXPOSE 3000 

# Start the application 
CMD ["npm", "start"]