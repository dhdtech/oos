FROM tiangolo/uwsgi-nginx-flask:latest 

ENV PYTHONPATH=.

RUN mkdir -p /app

WORKDIR /app

COPY /requirements /app/requirements
COPY /api /app/api
COPY application.py /app
COPY /uwsgi.ini /app

# install system dependencies
RUN apt-get update \
  && apt-get -y install nginx \
  && pip3 install --no-cache-dir -r requirements/base.txt \
  && pip3 install --no-cache-dir -r requirements/develop.txt \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /app

CMD [ "/app/entrypoint.sh" ]

