import request from 'supertest'
import should from 'should'
import { app, server } from '../app.js'
import { methods } from '../src/v2/helpers/cipher.js'

var secretId = undefined

describe('Test /secret', () => {
  after(() => {
    server.close()
  })

  describe('GET /methods', () => {
    it('should return a full list of available ciphers', (done) => {
      request(app)
        .get('/api/v2/secret/methods')
        .expect(200)
        .expect((res) => {
          return res.body.should.have.property('methods').with.lengthOf(methods.length)
        })
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
  })

  describe('POST /submit', () => {
    it('should return successfully with persisted secret id', (done) => {
      const secret = {
        'body': 'SEP Group43!',
        'passphrase': '#SuperS3cr3tP@ssw0rd'
      }

      request(app)
        .post('/api/v2/secret/submit')
        .send(secret)
        .expect(200)
        .expect((res) => {
          return res.body.should.have.property('id')
        })
        .end((err, res) => {
          if (err) return done(err)
          secretId = res.body.id
          done()
        })
    })

    it('should return an error 400 when providing an insecure passphrase', (done) => {
      const secret = {
        'body': 'SEP Group43!',
        'passphrase': 'password'
      }

      request(app)
        .post('/api/v2/secret/submit')
        .send(secret)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('should return successfully with persisted secret id when using an alternative cipher method', (done) => {
      const secret = {
        'body': 'SEP Group43!',
        'passphrase': '#SuperS3cr3tP@ssw0rd',
        'method': 'tripledes'
      }

      request(app)
        .post('/api/v2/secret/submit')
        .send(secret)
        .expect(200)
        .expect((res) => {
          return res.body.should.have.property('id')
        })
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('should return an error 400 when providing an unsupported cipher method', (done) => {
      const secret = {
        'body': 'SEP Group43!',
        'passphrase': '#SuperS3cr3tP@ssw0rd',
        'method': 'very_real_cipher'
      }

      request(app)
        .post('/api/v2/secret/submit')
        .send(secret)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
  })

  // this series of tests use the secret submitted as part of
  // the 'should return successfully with persisted secret id' test
  describe('POST /:id', () => {
    it('should return an error 401 when providing the incorrect passphrase', (done) => {
      request(app)
        .post('/api/v2/secret/' + secretId)
        .send({
          'passphrase': 'wrong_password123!'
        })
        .expect(401)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('should return a decrypted secret body when providing the correct passphrase', (done) => {
      request(app)
        .post('/api/v2/secret/' + secretId)
        .send({
          'passphrase': '#SuperS3cr3tP@ssw0rd'
        })
        .expect(200)
        .expect((res) => {
          return res.body.should.have.property('body').be.equal('SEP Group43!')
        })
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('should return an error 404 as the secret should not exist after viewing', (done) => {
      request(app)
        .post('/api/v2/secret/' + secretId)
        .send({
          'passphrase': '#SuperS3cr3tP@ssw0rd'
        })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
  })
})
