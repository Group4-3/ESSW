/*
    ----- GROUP 43 Header -----
    Component Name: IP
    Description: IP related helpers
    Date of Creation: 27/08/2022
    Author(s): Mitchell Sundstrom
*/

export function getRemoteIp(req) {
  // in place of a more robust tooling?
  return req.headers['x-real-ip'] || req.connection.remoteAddress
}
