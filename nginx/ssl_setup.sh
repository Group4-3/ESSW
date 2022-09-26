#!/bin/bash

BUILD_DIR="/etc/nginx/ssl_gen"
CA_DIR="${BUILD_DIR}/ca"
CERT_SERVER_DIR="${BUILD_DIR}/nginx_certificates"
USER_CERT_SERVER_DIR="${BUILD_DIR}/user_nginx_certificates"

NGINX_CERT_LOC="/etc/ssl/${HOST_NAME}"

mkdir -p ${NGINX_CERT_LOC}

if [ -f "${USER_CERT_SERVER_DIR}/nginx.key.pem" -a -f "${USER_CERT_SERVER_DIR}/nginx.crt.pem" ]; then
    echo "Nginx certificates (nginx.key.pem & nginx.crt.pem) have been supplied by the user, deploying for NGINX."
    cp ${USER_CERT_SERVER_DIR}/nginx.key.pem ${NGINX_CERT_LOC}/nginx.key.pem
    cp ${USER_CERT_SERVER_DIR}/nginx.crt.pem ${NGINX_CERT_LOC}/nginx.crt.pem
else
	mkdir -p ${CERT_SERVER_DIR} ${CA_DIR}
    echo "Nginx certificates have not been supplied by the user, generating certificates."
    echo "Generating CA"
	openssl ecparam -name prime256v1 -genkey -noout -out ${CA_DIR}/ca.key.pem
	openssl req -x509 -key ${CA_DIR}/ca.key.pem -out ${CA_DIR}/ca.crt.pem -days 13140 -SHA512 -subj "/C=AU/ST=GLOBAL/L=GLOBAL/O=ESSW/CN=GROUP4-3 Testing CA/OU=DEVOPS/"

	# Replace environment Vars in v3.ext
	sed -i -r "s/HOST_NAME/${HOST_NAME}/g" ${BUILD_DIR}/v3.ext
	echo "Generating NGINX certificates"
	openssl ecparam -name prime256v1 -genkey -noout -out ${CERT_SERVER_DIR}/nginx.key.pem
	openssl req -nodes -new -key ${CERT_SERVER_DIR}/nginx.key.pem -out ${CERT_SERVER_DIR}/nginx.csr.pem -SHA512 -subj "/C=AU/ST=GLOBAL/L=GLOBAL/O=${HOST_NAME}/CN=${HOST_NAME}/"
	openssl x509 -req -SHA512 -extfile ${BUILD_DIR}/v3.ext -days 365 -in ${CERT_SERVER_DIR}/nginx.csr.pem -CA ${CA_DIR}/ca.crt.pem -CAkey ${CA_DIR}/ca.key.pem -CAcreateserial -out ${CERT_SERVER_DIR}/nginx.crt.pem

	# Create Fullchain using NGINX cert and CA
	cat ${CERT_SERVER_DIR}/nginx.crt.pem ${CA_DIR}/ca.crt.pem > ${CERT_SERVER_DIR}/nginx_fullchain.crt.pem

	# Copy key and fullchain to NGINX certificate directory
	cp ${CERT_SERVER_DIR}/nginx.key.pem ${NGINX_CERT_LOC}/nginx.key.pem
    cp ${CERT_SERVER_DIR}/nginx_fullchain.crt.pem ${NGINX_CERT_LOC}/nginx.crt.pem
    chmod 600 ${CERT_SERVER_DIR}/*.pem ${CA_DIR}/*.pem ${CA_DIR}/*.srl
fi