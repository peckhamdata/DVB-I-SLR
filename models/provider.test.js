const {ServiceListOffering,
       ServiceListName,
       Delivery,
       TargetCountry,
       Language,
       Genre,
       init_slo_models} = require('./service_list_offering');

const {Provider,
       Name,
       Address,
       init_provider_models} = require('./provider');

const { Sequelize } = require('sequelize');
const { create } = require('xmlbuilder2');

const {GUID_British_DVB_I, GUID_Freeview_Australia} = require('../guids')

function make_provider(sequelize) {
  
  init_provider_models(sequelize)
  init_slo_models(sequelize)

  const provider = Provider.build({
    Names: [{ Name: "British DVB-I" }],
    GUID: GUID_British_DVB_I,
    ElectronicAddress: 
      { Telephone: '+44 020 00000000',
        Email: 'dvbi@british-service-list-provider.co.uk'},
    Address: {
      Name: 'John Doe',
      Lines: [{
        LineNumber: 0,
        Text: 'London'
      },
      {
        LineNumber: 1,
        Text: 'UK'
      },
      {
        LineNumber: 2,
        Text: 'Europe'
      }
    ]
    }
    }, {
      include: [ Name,
                { association: Provider.ElectronicAddress },
                { association: Provider.Address,
                    include: [ Address.Lines ]
      }]
  })
  return provider
}

describe('provider', () => {
  it('has the expected structure',  async () => {
    const sequelize = new Sequelize('sqlite::memory:');
    init_provider_models(sequelize)
    await sequelize.sync();
    const our_provider = make_provider(sequelize)
    await our_provider.save()
    const cold_provider = await Provider.findOne({
      where: {GUID: our_provider.GUID},
      include: [ Name,
        { association: Provider.ElectronicAddress },
        { association: Provider.Address,
            include: [ Address.Lines ]}
        ]
    });

    const result = create(cold_provider.render('xml')).end({format: 'object'});
    const prov = result['Provider']
    expect(prov['Name']).toEqual('British DVB-I')
    const address = prov['Address']
    expect (address['mpeg7:Name']).toEqual('John Doe')
    const postal_address = address['mpeg7:PostalAddress']
    expect(postal_address['mpeg7:AddressLine']).toEqual(['London', 'UK', 'Europe'])
    const electronic_address = prov['ElectronicAddress']
    expect(electronic_address['mpeg7:Telephone']).toEqual('+44 020 00000000')
    expect(electronic_address['mpeg7:Email']).toEqual('dvbi@british-service-list-provider.co.uk')
  })

})
