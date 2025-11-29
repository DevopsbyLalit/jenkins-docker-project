# build stage (optional, for optimization if you want to pre-build assets)
FROM node:18-alpine AS build
WORKDIR /app

# copy everything
COPY package.json package-lock.json* . 2>/dev/null || true
COPY . .

# (no build step needed for plain HTML/CSS/JS)
# If in future you add React/Vue/Svelte, then:
# RUN npm ci && npm run build

# final stage: use nginx to serve static files
FROM nginx:stable-alpine

# remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# copy site files to nginx www
COPY --from=build /app /usr/share/nginx/html

# expose port 80 inside container (we'll map to 3000 on host)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
