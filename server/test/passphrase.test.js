import request from 'supertest'
import should from 'should'
import { app, server } from '../app.js'

describe('Test /passphrase', () => {
  after(() => {
    server.close()
  })

  describe('GET /generate', () => {
    it('should return a random passphrase', (done) => {
      request(app)
        .get('/api/v2/passphrase/generate')
        .expect(200)
        .expect((res) => {
          return res.body.should.have.property('passphrase')
        })
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('should return a passphrase 12 characters long', (done) => {
      const body = {
        'length': 12
      }

      request(app)
        .get('/api/v2/passphrase/generate')
        .send(body)
        .expect(200)
        .expect((res) => {
          return res.body.should.have.property('passphrase').with.lengthOf(12)
        })
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
  })

  describe('POST /pwned', () => {
    it('should return true (pwned) when given a weak passphrase', (done) => {
      const body = {
        'passphrase': 'password'
      }

      request(app)
        .post('/api/v2/passphrase/pwned')
        .send(body)
        .expect(200)
        .expect((res) => {
          return res.body.should.have.property('pwned').be.equal(true)
        })
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('should return false (not pwned) when given a strong passphrase', (done) => {
      const body = {
        'passphrase': 'Z6bR#LWgwHrBOCnmBH%koB1GmKENBQH@'
      }

      request(app)
        .post('/api/v2/passphrase/pwned')
        .send(body)
        .expect(200)
        .expect((res) => {
          return res.body.should.have.property('pwned').be.equal(false)
        })
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
  })
})
