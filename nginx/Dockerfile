FROM nginx:1.23.1

EXPOSE 80
EXPOSE 443

RUN touch /run/nginx.pid && chown -R nginx:nginx /var/cache/nginx /run/nginx.pid /etc/nginx /etc/ssl
COPY server_route.conf.template /etc/nginx/templates/server_route.conf.template
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx_noncertbot_gen.sh /docker-entrypoint.d/nginx_noncertbot_gen.sh