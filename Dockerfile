FROM node:22-alpine AS deps

RUN mkdir -p /app

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM deps AS build

WORKDIR /app

COPY . .
RUN yarn build

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["yarn", "start"]

