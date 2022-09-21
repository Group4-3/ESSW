FROM nginx:1.23.1

EXPOSE 80
EXPOSE 443

RUN touch /run/nginx.pid
RUN mkdir /ssl_gen /ssl_gen/user_nginx_certificates
RUN chown -R nginx:nginx /var/cache/nginx /run/nginx.pid /etc/nginx /ssl_gen /etc/ssl /ssl_gen/user_nginx_certificates
COPY server_route.conf.template /etc/nginx/templates/server_route.conf.template
COPY nginx.conf /etc/nginx/nginx.conf
COPY ssl_setup.sh /docker-entrypoint.d/ssl_setup.sh
COPY v3.ext /ssl_gen/v3.ext