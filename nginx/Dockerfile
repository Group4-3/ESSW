FROM NGINX

EXPOSE 80
EXPOSE 443

RUN  touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/cache/nginx /var/run/nginx.pid

RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx server_route.conf /etc/nginx/conf.d/server_route.conf
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf