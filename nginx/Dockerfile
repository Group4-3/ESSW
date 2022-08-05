FROM NGINX

EXPOSE 80
EXPOSE 443

RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY server_route.conf /etc/nginx/conf.d/server_route.conf
COPY nginx.conf /etc/nginx/nginx.conf