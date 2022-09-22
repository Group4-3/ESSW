FROM nginx:1.23.1

EXPOSE 80
EXPOSE 443

ARG HOST_NAME
ENV HOST_NAME $HOST_NAME

RUN touch /run/nginx.pid
RUN mkdir /etc/nginx/ssl_gen
RUN chown -R nginx:nginx /var/cache/nginx /run/nginx.pid /etc/nginx /etc/ssl
COPY server_route.conf.template /etc/nginx/templates/server_route.conf.template
COPY nginx.conf /etc/nginx/nginx.conf
COPY ssl_setup.sh /etc/nginx/ssl_gen/ssl_setup.sh
COPY v3.ext /etc/nginx/ssl_gen/v3.ext
COPY user_certificates /etc/nginx/ssl_gen/user_nginx_certificates
RUN /etc/nginx/ssl_gen/ssl_setup.sh
RUN ls -la /etc/ssl/