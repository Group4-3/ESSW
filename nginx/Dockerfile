FROM nginx:1.23.1

EXPOSE 80
EXPOSE 443

RUN touch /run/nginx.pid
RUN mkdir /etc/nginx/ssl_gen
RUN chown -R nginx:nginx /var/cache/nginx /run/nginx.pid /etc/nginx /etc/ssl
COPY server_route.conf.template /etc/nginx/templates/server_route.conf.template
COPY nginx.conf /etc/nginx/nginx.conf
COPY ssl_setup.sh /docker-entrypoint.d/ssl_setup.sh
COPY v3.ext /etc/nginx/ssl_gen/v3.ext