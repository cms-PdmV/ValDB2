# Build web application bundle
FROM node:18.16.1-alpine3.18@sha256:bf6c61feabc1a1bd565065016abe77fa378500ec75efa67f5b04e5e5c4d447cd AS frontend

WORKDIR /usr/app

COPY react_frontend .

# Enable corepack and yarn stable version (~3.X)
RUN corepack enable && corepack prepare yarn@stable --activate 
RUN yarn install
RUN yarn build

# Build dependencies
FROM python:3.11.3-alpine3.18@sha256:caafba876f841774905f73df0fcaf7fe3f55aaf9cb48a9e369a41077f860d4a7 AS build

WORKDIR /usr/app
RUN python -m venv /usr/app/venv
ENV PATH="/usr/app/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install -r requirements.txt

# Create image for deployment
FROM python:3.11.3-alpine3.18@sha256:caafba876f841774905f73df0fcaf7fe3f55aaf9cb48a9e369a41077f860d4a7 AS backend

RUN addgroup -g 1001 pdmv && adduser --disabled-password -u 1001 -G pdmv pdmv

RUN mkdir /usr/app && chown pdmv:pdmv /usr/app
WORKDIR /usr/app

COPY --chown=pdmv:pdmv --from=frontend /usr/app/build ./build
COPY --chown=pdmv:pdmv --from=build /usr/app/venv ./venv
COPY --chown=pdmv:pdmv . .

RUN rm -rf react_frontend/

USER 999

ENV PATH="/usr/app/venv/bin:$PATH"
CMD [ "gunicorn", "main:app" ]