/*
    ----- GROUP 43 Header -----
    Component Name: Passphrase/Index
    Description: Passphrase index route
    Date of Creation: 06/06/2022
    Author(s): Mitchell Sundstrom
*/

import express from 'express'
import { generate } from './generate.js'
import { pwned } from './pwned.js'

var router = express.Router()

/**
 * @api {get} /api/v2/passphrase/generate Generate a random passphrase
 * @apiVersion 2.0.0
 * @apiName GeneratePassphrase
 * @apiGroup Passphrase
 *
 * @apiBody {String} [character_sets="lowercase,uppercase,numerical,special"] Comma separated list of character sets to use. Available options: lowercase uppercase numerical special.
 * @apiBody {Integer} [length="32"] Length of the passphrase.
 *
 * @apiSuccess {String} passphrase Generated passphrase.
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "passphrase": "Z6bR#LWgwHrBOCnmBH%koB1GmKENBQH@"
 *  }
 */
router.get('/generate', generate)

/**
 * @api {post} /api/v2/passphrase/pwned Validate if passphrase has been exposed
 * @apiVersion 2.0.0
 * @apiName ValidatePassphrase
 * @apiGroup Passphrase
 *
 * @apiBody {String} passphrase Passphrase to test to see if it has been leaked online aka pwned.
 * @apiExample Example usage:
 *  endpoint: http://localhost/api/v2/passphrase/pwned
 *
 *  body:
 *  {
 *    "passphrase": "#SuperS3cr3tP@ssw0rd"
 *  }
 *
 * @apiSuccess {Boolean} pwned Passphrase has been leaked online.
 * @apiSuccess {String} sha1 SHA1 hash of the passphrase.
 * @apiSuccess {String} prefix Prefix of the hash.
 * @apiSuccess {String} suffix Suffix of the hash.
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "pwned": false,
 *    "sha1": "bab002c22a1160038ae259602dfe3d848ef028cc",
 *    "prefix": "bab00",
 *    "suffix": "2c22a1160038ae259602dfe3d848ef028cc"
 *  }
 */
router.post('/pwned', pwned)

export { router }
