#!/bin/bash

if [ ! -f "/etc/ssl/${NGINX_HOST}/privkey.pem" ]; then
echo "No Certificates, generating local - WARNING: Certificates will not be signed by an authorised CA";
mkdir -p /etc/ssl/${NGINX_HOST}
openssl ecparam -name prime256v1 -genkey -noout -out /etc/ssl/${NGINX_HOST}/privkey.pem
openssl ec -in /etc/ssl/${NGINX_HOST}/privkey.pem -pubout -out /etc/ssl/${NGINX_HOST}/pubkey.pem
openssl req -new -nodes -x509 -key /etc/ssl/${NGINX_HOST}/privkey.pem -in /etc/ssl/${NGINX_HOST}/pubkey.pem -out /etc/ssl/${NGINX_HOST}/certificate.pem -days 365 -subj "/C=AU/ST=GLOBAL/L=GLOBAL/O=ESSW/CN=GROUP4-3/OU=DEVOPS/"
chown -R nginx:nginx /etc/ssl/${NGINX_HOST}/ 
chmod 600 /etc/ssl/${NGINX_HOST}/*
else
echo "Certificates detected, not generating local certificates";
fi