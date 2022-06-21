
const { non_200_response } = require ('./api.js')
const parseString = require('xml2js').parseString;

describe('api', () => {
  it('returns the expected non 200 response',  async () => {
    
    const response = non_200_response()

    parseString(response, function (err, result) {
      expect(err).toBeNull();
    })
  })
})