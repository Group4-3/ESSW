# ESSW
Ephemeral Secrets Sharing Website

## How to install

1. Clone from github (`git clone https://github.com/Group4-3/ESSW.git`).
2. Visit <https://nodejs.org/en/download/> and download the latest version of the node runtime environment.
2. Visit <https://docs.docker.com/get-started/#download-and-install-docker> and follow the install guide specific to your environment.
	- Note that docker will require virtualisation technology on your computer.
	- Ways to check if your system supports virutalisation:
		- Windows:
			1. Open task manager and navigate to the Performace tab.
			2. Select CPU and then look for the virtualisation field and the value should either say Enabled or Disabled.
		- Mac (TODO)
		- Linux:
			- Command line tool to test for Intel users: grep vmx /proc/cpuinfo
			- Command line tool to test for AMD users: grep svm /proc/cpuinfo
## How to Use

1. Open the command line interfaces and navigate one to the cloned repository.
2. (Optional) If you have generated your own certificates, place the private and public key in the nginx/user_certificates directory and name them nginx.crt.pem (Public), nginx.key.pem (Private).
3. Then type (`docker compose up`) start up the docker services.
4. Open up a web client like Chrome or Internet Explorer and naviage to <http://localhost:8080/first.html> (To be changed) for the submitting of a secret.
5. Once a secret has been submitted then navigate to <http://localhost:8080/viewsecret.html> (To be changed) to view the submitted secret