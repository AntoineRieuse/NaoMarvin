FROM node:14.13.1-buster
WORKDIR /app
COPY . .
RUN yarn
CMD ["yarn", "start"]