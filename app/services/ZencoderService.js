const axios = require('axios')
const config = require('../../config.json')
const ENDPOINT = config.zencoder.endpoint
const APP_DOMAIN = config.api_domain

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Zencoder-Api-Key'] = config.zencoder.secret

module.exports = {
  async createJob ({ input, bucket, key }){
    const data = {
      input: input,
      outputs: [
        {
          label: 'web',
          url: `s3://${bucket}/processed_${key}`,
          public: true,
          notifications: [
            APP_DOMAIN+'/video/job/callback'
          ]
        }
      ]
    }
    return await axios.post(`${ENDPOINT}/jobs`, data)
      .then(function (response) {
        return response
      })
      .catch(function (error) {
        return null
      });
  }
}