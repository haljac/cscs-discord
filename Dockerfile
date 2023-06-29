FROM --platform=linux/amd64 public.ecr.aws/lambda/nodejs:18

COPY package* .
RUN npm ci

COPY . .
RUN npm run build

# Copy function code
COPY dist/index.js ${LAMBDA_TASK_ROOT}
  
# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]
