#!/bin/bash

if [ ! -f "/etc/ssl/${NGINX_HOST}/privkey.pem" ]; then
echo "No cerbot certificates, generating local - WARNING: Certificates will not be signed by an authorised CA";
mkdir -p /etc/ssl/${NGINX_HOST}
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/${NGINX_HOST}/privkey.pem -keyform PEM -out /etc/ssl/${NGINX_HOST}/fullchain.pem -keyform PEM -passout pass:foobar -subj "/C=AU/ST=GLOBAL/L=GLOBAL/O=ESSW/CN=${nginx_server}"
chown -R nginx:nginx /etc/ssl/${NGINX_HOST}/ 
chmod -R 755 /etc/ssl/${NGINX_HOST}/
fi