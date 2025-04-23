FROM node

WORKDIR /app
COPY package.json ./
EXPOSE 3000

RUN npm install
COPY . .
RUN npm run build

RUN mkdir -p /frontend_build
RUN npm run build && cp -r build/* /frontend_build
VOLUME ["/frontend_build"]