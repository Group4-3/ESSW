import request from 'supertest'
import should from 'should'
import { app } from '../app.js'

describe("Test /passphrase", () => {
  describe("GET /generate", () => {
    it("should return a random passphrase", (done) => {
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

    it("should return a passphrase 12 characters long", (done) => {
      request(app)
        .get('/api/v2/passphrase/generate')
        .send({
          "length": 12
        })
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
})
