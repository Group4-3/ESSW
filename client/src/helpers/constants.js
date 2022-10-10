/*
    ----- GROUP 43 Header -----
    Component Name: group43_client_helpers_constants
    Description: Constant variables for the client-side application.
    Date of Creation: 29/9/2022
    Author(s): Petri Bayley
*/

export function getApiAddress() {
	// Ignoring Linter message because variable is external to javascript
	// eslint-disable-next-line
	const API_HOST_NAME = '${API_HOST_NAME}'
	const regex = /(\$\{.*\})/
	return (regex.test(API_HOST_NAME) ? 'http://localhost:3001' : 'https://' + API_HOST_NAME)
}
