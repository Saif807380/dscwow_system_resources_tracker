FROM alpine:latest

RUN apk add --update build-base
RUN apk add --update alpine-sdk
RUN apk add --update nodejs npm
RUN apk add --update npm
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

WORKDIR /usr/src/app

COPY . .
ENTRYPOINT ["/bin/sh"]

