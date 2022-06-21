const offering = require('./offering');
const parseString = require('xml2js').parseString;

const {ServiceListOffering,
  ServiceListName,
  Delivery,
  TargetCountry,
  Language,
  Genre,
  init_slo_models} = require('./service_list_offering');

const {Provider, Name, Address, ElectronicAddress, init_provider_models} = require('./provider');

const {GUID_British_DVB_I, GUID_Freeview_Australia} = require('../guids')

const { Sequelize } = require('sequelize');

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
        Text: 'London'
      },
      {
        Text: 'UK'
      },
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

describe('offering', () => {
  it('has the expected structure', () => {
    const sequelize = new Sequelize('sqlite::memory:');
    const our_provider = make_provider(sequelize)

    const SLO = ServiceListOffering.build({ServiceListURI: "https://an.example",
      Provider: GUID_Freeview_Australia,
      RegulatorListFlag: false,
      Genres: [{genre_name: 'news'}, {genre_name: 'sport'}],
      ServiceListNames: [{lang: 'en', text: 'Freeview (ACT)'},
                        {lang: 'it',
                          text: 'Freeview - ACT',
                          description:  "Freeview ti offre gratuitamente i migliori contenuti televisivi australiani. Guarda i tuoi programmi preferiti, trova nuovi programmi o pianifica la tua visione, Freeview rende tutto facile."}],
      Deliveries: [{type: 'DVBTDelivery', required: false},
                  {type: 'DASHDelivery', required: true}],
      Languages: [{lang:'en'}, {lang: 'it'}],
      TargetCountries: [{country: 'AU'}]},
      {include: [ServiceListName, Delivery, TargetCountry, Language, Genre]})

    parseString(offering('xml', our_provider, [SLO]), function (err, result) {

      expect(err).toBeNull();
      expect(typeof(result['ProviderOffering'])).not.toBe('undefined');
      const provider = result['ProviderOffering']['Provider'][0]
      expect(provider['Name'][0]).toEqual('British DVB-I')
      const address = provider['Address'][0]
      expect (address['mpeg7:Name'][0]).toEqual('John Doe')
      const postal_address = address['mpeg7:PostalAddress'][0]
      expect(postal_address['mpeg7:AddressLine']).toEqual(['London', 'UK'])
      const electronic_address = provider['ElectronicAddress'][0]
      expect(electronic_address['mpeg7:Telephone'][0]).toEqual('+44 020 00000000')
      expect(electronic_address['mpeg7:Email'][0]).toEqual('dvbi@british-service-list-provider.co.uk')
      })
  })
})
  



// mavy888uy - Serveress Expresso
