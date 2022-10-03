export function getApiAddress() {
	// Ignoring Linter message because variable is external to javascript
	// eslint-disable-next-line
	const API_HOST_NAME = "${API_HOST_NAME}"
	const regex = /(\$\{.*\})/
	return (regex.test(API_HOST_NAME) ? 'http://localhost:3001' : 'https://' + API_HOST_NAME)
}