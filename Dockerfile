FROM node:20-alpine

WORKDIR /usr/src/app

# Copy app files from nested project
COPY project-web-home-antigravity/web-portal/package*.json ./
RUN npm install --production

COPY project-web-home-antigravity/web-portal/ .

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["npm", "start"]
