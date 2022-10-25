/*
    ----- GROUP 43 Header -----
    Component Name: Text
    Description: General text helpers
    Date of Creation: 20/10/2022
    Author(s): Petri Bayley
*/

export function unescape(str) {
  return str.replace(/&amp;/g, "&;").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;/g, "'")
}