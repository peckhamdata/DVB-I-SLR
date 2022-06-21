const registry_entity = require('./registry_entity');

const { create } = require('xmlbuilder2');

describe('registry entity is well formed', () => {
  it('has the expected structure', () => {
    const result = create(registry_entity('xml')).end({ format: 'object' });
    const slre = result['ServiceListRegistryEntity']
    expect(typeof(slre)).not.toBe('undefined');
    expect(slre['@regulatorFlag']).toEqual('false');
    const name = slre['Name'];
    expect(name).toEqual('Peckham Data Centre Ltd')
    const address = slre['Address'];
    const postal_address = address['mpeg7:PostalAddress']
    expect(postal_address['mpeg7:AddressLine'][0]).toEqual('Peckham Data Centre Ltd')
    const electronic_address = slre['ElectronicAddress']
    expect(electronic_address['mpeg7:Email']).toEqual('contact@peckhamdata.com')
  });

});
