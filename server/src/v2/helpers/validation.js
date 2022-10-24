/*
    ----- GROUP 43 Header -----
    Component Name: Validation
    Description: Helpers for param validation and type conversion
    Date of Creation: 05/10/2022
    Author(s): Mitchell Sundstrom
*/

export function hasProperty(body, property) {
  // need to reprocess otherwise [Object: null prototype]
  return {...body}.hasOwnProperty(property)
}

export function isBooleanProperty(property) {
  return (typeof property === 'boolean' || typeof property === 'string' && ['true', 'on', '1', 'false', 'off', '0'].includes(property.toLowerCase()))
}

export function parseInsecureBoolean(property) {
  if (typeof property === 'boolean') return property

  // we should be able to implicitly assume a false result if  the property
  // is not a stringas isBooleanProperty() check should be run before this
  // function is called on the property
  if (typeof property !== 'string') return false

  return ['true', 'on', '1'].includes(property.toLowerCase())
}
