/*
    ----- GROUP 43 Header -----
    Component Name: Secret/Index
    Description: Secret index route
    Date of Creation: 06/06/2022
    Author(s): Mitchell Sundstrom
*/

import express from 'express'
import { secretSubmit } from './submit.js'
import { secretGet } from './get.js'
import { secretDestroy } from './destroy.js'

var router = express.Router()

/**
 * @api {post} /api/v2/secret/submit Submit a new secret
 * @apiVersion 2.0.0
 * @apiName SubmitSecret
 * @apiGroup Secret
 *
 * @apiBody {String} body Secret string.
 * @apiBody {String} passphrase Key to protect the secret.
 * @apiBody {String} [method="aes"] Encryption method to use. Available options: aes des tripledes rabbit rc4 rc4drop
 * @apiBody {Integer} [expiry="86400"] Number of seconds that the secret will automatically expire after. Maximum 7 days (604800).
 * @apiExample Example usage:
 *  endpoint: http://localhost/api/v2/secret/submit
 *
 *  body:
 *  {
 *    "body": "SEP Group43!",
 *    "passphrase": "#SuperS3cr3tP@ssw0rd",
 *    "expiry": "21600"
 *  }
 *
 * @apiSuccess {String} id Unique secret ID.
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "id": "e7dc39a0"
 *  }
 */
router.post('/submit', secretSubmit)

/**
 * @api {post} /api/v2/secret/:id Unlock a secret
 * @apiVersion 2.0.0
 * @apiName GetSecret
 * @apiGroup Secret
 *
 * @apiParam {String} id Unique secret ID.
 * @apiBody {String} passphrase Key to unlock the secret.
 * @apiExample Example usage:
 *  endpoint: http://localhost/api/v2/secret/e7dc39a0
 *
 *  body:
 *  {
 *    "passphrase": "#SuperS3cr3tP@ssw0rd"
 *  }
 * @apiSuccess {String} id Decrypted secret string.
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "body": "SEP Group43!"
 *  }
 */
router.post('/:id', secretGet)

/**
 * @api {delete} /api/v2/secret/:id Destroy a secret
 * @apiVersion 2.0.0
 * @apiName DestroySecret
 * @apiGroup Secret
 * @apiIgnore Not Implemented
 */
router.delete('/:id', secretDestroy)

export { router }
