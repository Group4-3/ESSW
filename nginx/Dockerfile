FROM nginx:1.23.1

EXPOSE 80
EXPOSE 443

RUN touch /run/nginx.pid && chown -R nginx:nginx /var/cache/nginx /run/nginx.pid
COPY server_route.conf /etc/nginx/conf.d/server_route.conf
COPY nginx.conf /etc/nginx/nginx.conf