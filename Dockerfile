# FROM oven/bun:1.0
FROM node:20
# WORKDIR /Users/pc/Documents/JS_Runtimes/Bun/chatApp/
WORKDIR /
COPY . .
RUN ls
# RUN yarn install 
# RUN yarn next build
EXPOSE 3000
EXPOSE 10000
# ENTRYPOINT ["bun", "dev"]
CMD ["yarn", "start"]

# FROM node:16-alpine
# RUN mkdir -p /app
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build
# EXPOSE 3000
# CMD ["npm", "start"]