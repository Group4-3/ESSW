# ESSW
Ephemeral Secrets Sharing Website

## How to install

1. Clone from github (`git clone https://github.com/Group4-3/ESSW.git`).
2. Visit <https://docs.docker.com/get-started/#download-and-install-docker> and follow the install guide specific to your environment.
	- Note that docker will require virtualisation technology on your computer.

## How to Use

1. Open the command line interfaces and navigate one to the cloned repository.
2. (Optional) If you have generated your own certificates, place the private and public key in the nginx/user_certificates directory and name them nginx.crt.pem (Public), nginx.key.pem (Private).
3. Run './essw setup' and enter the FQDN (e.g. www.google.com) that will be used to access the website.
4. Once setup is complete, deployment using './essw start' can be run and the website should be accessible using either localhost or the fqdn specified.
5. To stop the application just to './essw stop' and to cleanup run './essw cleanup'