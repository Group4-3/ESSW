/*
    ----- GROUP 43 Header -----
    Component Name: Passphrase/Index
    Description: Passphrase index route
    Date of Creation: 06/06/2022
    Author(s): Mitchell Sundstrom
*/

import express from 'express'
import { generate } from './generate.js'
import { validate } from './validate.js'

var router = express.Router()

/**
 * @api {get} /api/v2/passphrase/generate
 * @apiName GeneratePassphrase
 * @apiGroup Passphrase
 *
 * @apiBody {String} character_sets="lowercase,uppercase,numerical,special" Optional Comma separated list of character sets to use. Available options: lowercase uppercase numerical special.
 * @apiBody {Integer} length="32" Optional Length of the passphrase.
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
 * @api {get} /api/v2/passphrase/pwned/:passphrase
 * @apiName ValidatePassphrase
 * @apiGroup Passphrase
 *
 * @apiParam {String} passphrase Passphrase to test to see if it has been leaked online; aka pwned.
 *
 * @apiSuccess {Boolean} pwned Passphrase has been leaked online.
 * @apiSuccess {String} sha1 SHA1 hash of the passphrase.
 * @apiSuccess {String} prefix Prefix of the hash.
 * @apiSuccess {String} suffix Suffix of the hash.
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "pwned": false,
 *    "sha1": "f808cd712bcccc76376abcd38f40f57fe73948a4",
 *    "prefix": "f808c",
 *    "suffix": "d712bcccc76376abcd38f40f57fe73948a4"
 *  }
 */
router.get('/pwned/:passphrase', validate)

export { router }
