
# for bun
FROM oven/bun:1.0 
# for node
# FROM node:20

WORKDIR /

COPY /src/server .
COPY /.env .
COPY ./bun.json ./package.json

RUN bun install 

EXPOSE 10000

# ENTRYPOINT ["yarn", "dev"]
CMD ["bun", "run", "index.ts"]

# # -----------------------------------------

# # FROM oven/bun:1.0 
# FROM node

# COPY . .

# EXPOSE 10000
# EXPOSE 3000
# # RUN yarn 
# # RUN yarn next build

# CMD ["yarn", "start"]

