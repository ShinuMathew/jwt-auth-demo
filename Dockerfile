FROM node
# Pulls an image of latest node
WORKDIR /usr/src/app
# Creates a work directory /usr/src/app
COPY package*.json ./
# Copies the package.json file
RUN npm install
# install dependencies
COPY . .
# Copies all the content from the project folder to the workdir
EXPOSE 5001
# Exposes port 5001
CMD ["npm", "start"]
# Runs npm start on docker run