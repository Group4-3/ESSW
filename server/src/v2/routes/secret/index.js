/*
    ----- GROUP 43 Header -----
    Component Name: Secret/Index
    Description: Secret index route
    Date of Creation: 06/06/2022
    Author(s): Mitchell Sundstrom
*/

import express from 'express'
import { methods } from '../../helpers/cipher.js'
import { fileAttacher } from '../../modules/file.js'
import { secretSubmit } from './submit.js'
import { secretGet } from './get.js'
import { secretDestroy } from './destroy.js'

var router = express.Router()

/**
 * @api {get} /api/v2/secret/methods Return a list of available encryption methods
 * @apiVersion 2.0.0
 * @apiName EncryptionMethods
 * @apiGroup Secret
 *
 * @apiSuccess {Array} methods Array of available encryption methods.
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "methods": ["aes", "tripledes", "rc4drop"]
 *  }
 */
router.get('/methods', function(req, res, next) {
  return res.status(200).send({methods: methods})
})

/**
 * @api {post} /api/v2/secret/submit Submit a new secret
 * @apiVersion 2.0.0
 * @apiName SubmitSecret
 * @apiGroup Secret
 *
 * @apiBody {String} text Secret string.
 * @apiBody {String} passphrase Key to protect the secret.
 * @apiBody {String} [method="aes"] Encryption method to use. Available options: aes des tripledes rabbit rc4 rc4drop publickey
 * @apiBody {Integer} [expiry="1800"] Number of seconds that the secret will automatically expire after. Default 30 minutes (1800). Maximum 7 days (604800).
 * @apiBody {Integer} [max_access_attempts=5] Number of unsuccessful access attempts that can be made before the secret is automatically destroyed. Use -1 for infinite attempts.
 * @apiBody {Boolean} [ip_based_access_attempts=false] Whether unsuccessful access attempts should be counted per IP address or collectively irrespective of request IP.
 * @apiExample Example usage:
 *  endpoint: http://localhost/api/v2/secret/submit
 *
 *  body:
 *  {
 *    "text": "SEP Group43!",
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
router.post('/submit', fileAttacher, secretSubmit)

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
 *
 * @apiSuccess {String} id Decrypted secret string.
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "text": "SEP Group43!"
 *  }
 */
router.post('/:id', secretGet)

/**
 * @api {delete} /api/v2/secret/:id Destroy a secret
 * @apiVersion 2.0.0
 * @apiName DestroySecret
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
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 */
router.delete('/:id', secretDestroy)

export { router }
