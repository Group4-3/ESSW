#!/bin/bash

if [ ! -f "/etc/ssl/${HOST_NAME}/fullchain.pem" ]; then
echo "No Certificates, generating local - WARNING: Certificates will not be signed by an authorised CA";
mkdir -p /etc/ssl/${HOST_NAME}
openssl ecparam -name prime256v1 -genkey -noout -out /etc/ssl/${HOST_NAME}/privkey.pem
openssl ec -in /etc/ssl/${HOST_NAME}/privkey.pem -pubout -out /etc/ssl/${HOST_NAME}/cert.pem
openssl req -new -nodes -x509 -key /etc/ssl/${HOST_NAME}/privkey.pem -in /etc/ssl/${HOST_NAME}/cert.pem -out /etc/ssl/${HOST_NAME}/fullchain.pem -days 365 -subj "/C=AU/ST=GLOBAL/L=GLOBAL/O=ESSW/CN=GROUP4-3/OU=DEVOPS/"
chown -R nginx:nginx /etc/ssl/${HOST_NAME}/ 
chmod 600 /etc/ssl/${HOST_NAME}/*
else
echo "Certificates detected, not generating local certificates";
fi