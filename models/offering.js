const { create } = require('xmlbuilder2');

function offering(format, provider, offerings) {

  let slo = []
  offerings.forEach((offering) => {
    slo.push(offering.render()['ServiceListOffering'])
  })
  const obj = {
    'ProviderOffering': {
      'Provider': provider.render(null)["Provider"],
      'ServiceListOffering': slo
    }
  }

  if (format === 'xml') {
    const re = create(obj)
    return re.end({prettyPrint: true});
  }
  return obj;
}

module.exports = offering;
