FROM --platform=linux/amd64 public.ecr.aws/lambda/nodejs:18

COPY package* .
RUN npm ci

COPY . ${LAMBDA_TASK_ROOT}
RUN npm run build
  
CMD [ "dist/index.handler" ]
