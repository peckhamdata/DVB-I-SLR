const { create } = require('xmlbuilder2');
const registry_entity = require('./registry_entity');
const provider = require('./provider');

function service_list_entry_points(format, provider_offerings) {


  let obj = {
    'ServiceListEntryPoints': {
      '@xml:lang': 'en',
      '@xmlns': 'urn:dvb:metadata:servicelistdiscovery:2022',
      '@xmlns:dvbisd': 'urn:dvb:metadata:servicediscovery:2022',
      '@xmlns:mpeg7': 'urn:tva:mpeg7:2008',
      '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@xsi:schemaLocation': 'urn:dvb:metadata:servicelistdiscovery:2022 dvbi_service_list_discovery_v1.3.xsd',
      'ServiceListRegistryEntity': registry_entity()['ServiceListRegistryEntity']
    }
  }

  if (provider_offerings !== undefined) {
    obj['ServiceListEntryPoints']['ProviderOffering'] = provider_offerings
  }

  if (format === 'xml') {
    const re = create(obj, {
      version: '1.0',
      encoding: 'UTF-8'      
    })
    return re.end({prettyPrint: true});
  }
  return obj;
}

module.exports = service_list_entry_points;
