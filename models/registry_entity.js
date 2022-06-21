const { create } = require('xmlbuilder2');

function registry_entity(format) {
  const obj = {
    'ServiceListRegistryEntity': {
      '@regulatorFlag': 'false',
      'Name': {
        '#': 'Peckham Data Centre Ltd'
      },
      'Address': {
        'mpeg7:PostalAddress': {
          'mpeg7:AddressLine': ['Peckham Data Centre Ltd',
                                '86-90 Paul Street',
                                'London',
                                'England',
                                'United Kingdom',
                                'EC2A 4NE'] 
        }
      },
      'ElectronicAddress': {
        'mpeg7:Email': 'contact@peckhamdata.com',
        'mpeg7:Url': 'https://github.com/peckhamdata/DVB-I-SLR'
      }
    }
  }

  if (format === 'xml') {
    const re = create(obj)
    const xml = re.end({ prettyPrint: true });
    return xml;
  }
  return obj;
}

module.exports = registry_entity;
