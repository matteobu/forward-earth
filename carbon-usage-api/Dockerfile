FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Create a .env file from template if it doesn't exist
RUN if [ ! -f ".env" ] && [ -f ".env.template" ]; then cp .env.template .env; fi


EXPOSE 3000

CMD ["npm", "run", "start:dev"]