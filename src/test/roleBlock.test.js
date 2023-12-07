require('dotenv').config({ path: '.env.testing' })
const request = require('supertest')
const appRoot = require('app-root-path')
const app = require(`${appRoot}/src/test/appTest`)
const { redisClient } = require(`${appRoot}/src/config/redis`)
const legitEmail = process.env.USER_EMAIL
const legitPassword = process.env.USR_PASSWORD
const dummyAccEmail = process.env.DUMMY_EMAIL
const dummyAccName = process.env.DUMMY_FULLNAME

describe('user role check before accessing api', () => {
  /* eslint-disable */
  let agent
  /* eslint-enable */
  beforeAll(() => {
    agent = request.agent(app)
  })

  afterAll((done) => {
    redisClient.quit(() => {
      done()
    })
  })

  let sessionCookie

  it('POST /auth/login => should log in user and store session cookie', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: legitEmail,
        password: legitPassword
      })

    sessionCookie = response.headers['set-cookie']
  })

  it('POST /admin/register-user => should return unsuccessful user registration', async () => {
    return request(app)
      .post('/admin/register-user')
      .set('Cookie', sessionCookie)
      .send({
        email: dummyAccEmail,
        fullName: dummyAccName
      })
      .expect('Content-Type', /json/)
      .expect(403)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            success: false,
            message: 'Access denied: Unauthorized user.'
          })
        )
      })
  })
})
