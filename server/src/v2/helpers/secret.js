/*
    ----- GROUP 43 Header -----
    Component Name: Secret
    Description: Secret helpers
    Date of Creation: 27/08/2022
    Author(s): Mitchell Sundstrom
*/

export function canAttemptAccess(secret, ip) {
  var data = JSON.parse(secret.unauthorized_attempts)
  var maxAttempts = data.max_attempts
  var ipBased = data.ip_based
  var attempts = data.attempts

  return (maxAttempts === -1
          || ipBased && (!attempts.hasOwnProperty(ip) && maxAttempts > 0
          || attempts.hasOwnProperty(ip) && attempts[ip] < maxAttempts)
          || !ipBased && attempts < maxAttempts) ? true : false
}

export function incrementUnauthorizedAttempt(secret, ip) {
  var data = JSON.parse(secret.unauthorized_attempts)
  if (data.ip_based) {
    data.attempts[ip] = ++data.attempts[ip] || 1
  } else {
    data.attempts += 1
  }

  return JSON.stringify(data)
}
