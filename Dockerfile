FROM node:14.13.1-buster
WORKDIR /app
ENV TZ="Europe/Berlin"
COPY . .
RUN yarn
CMD ["yarn", "start"]
