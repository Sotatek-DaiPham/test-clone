FROM 642370744938.dkr.ecr.ap-southeast-1.amazonaws.com/base-nodejs:20 as builder
WORKDIR /app
COPY . .
# COPY yarn.lock ./
RUN yarn
# RUN cp .env.docker .env
RUN yarn build:staging

FROM 642370744938.dkr.ecr.ap-southeast-1.amazonaws.com/base-nodejs:20-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 9993

CMD ["yarn", "start:staging"]