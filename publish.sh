#!/bin/sh

docker build . -t test-lambda:test
docker tag test-lambda:test 018345072091.dkr.ecr.us-east-1.amazonaws.com/cscs:latest
docker push 018345072091.dkr.ecr.us-east-1.amazonaws.com/cscs:latest


while [ $# -gt 0 ]
do
    case "$1" in
        --update) update=true; shift;;
        *) echo "Unknown option: $1"; exit 1;;
    esac
    shift
done

if [ "$update" = true ]
then
    aws lambda update-function-code \
      --function-name cscs-dev \
      --image-uri=018345072091.dkr.ecr.us-east-1.amazonaws.com/cscs:latest
fi
