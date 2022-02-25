FROM node:14.13.1-buster
WORKDIR /app
ENV TZ="Europe/Paris"
COPY . .
RUN yarn
CMD ["yarn", "start"]