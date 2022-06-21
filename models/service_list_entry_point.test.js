const slep = require('./service_list_entry_point');
const offering = require('./offering');

const parseString = require('xml2js').parseString;

const {ServiceListOffering,
  ServiceListName,
  Delivery,
  TargetCountry,
  Language,
  Genre,
  init_slo_models} = require('../models/service_list_offering');

const {Provider,
  Name,
  Address,
  init_provider_models} = require('../models/provider');

const { Sequelize } = require('sequelize');

describe('Service List Entry Point', () => {

  it('has all the expected schema / namespace attributes', () => {
    const the_slep = slep('xml')
    parseString(the_slep, function (err, result) {

      expect(err).toBeNull();
      expect(typeof(result['ServiceListEntryPoints'])).not.toBe('undefined');
      const attribs = result['ServiceListEntryPoints']['$'];
      expect(attribs['xmlns']).toEqual('urn:dvb:metadata:servicelistdiscovery:2022');
      expect(attribs['xmlns:dvbisd']).toEqual('urn:dvb:metadata:servicediscovery:2022');
      expect(attribs['xmlns:mpeg7']).toEqual('urn:tva:mpeg7:2008');
      expect(attribs['xmlns:xsi']).toEqual('http://www.w3.org/2001/XMLSchema-instance');
      expect(attribs['xsi:schemaLocation']).toEqual('urn:dvb:metadata:servicelistdiscovery:2022 dvbi_service_list_discovery_v1.3.xsd');
    })
  })

  it('creates a response with multiple providers', async () => {

    const sequelize = new Sequelize('sqlite::memory:');
    init_slo_models(sequelize);
    init_provider_models(sequelize)
    const uri = 'https://somewhere'
    const provider_offerings_seed = [
      { provider: {
          Names: [{Name: "P1", Lang: "en"}],
          GUID: "P1",
          ElectronicAddress: 
            { Telephone: '+44 020 00000000',
              Email: 'p1@slrdb.com'},
          Address: {
            Name: 'P1',
            Lines: [{
              Text: 'London'
            }]
        },
        service_lists: [
          {ServiceListURI: uri,
            RegulatorListFlag: false,
            Genres: [{genre_name: 'news'}, {genre_name: 'sport'}],
            ServiceListNames: [{lang: 'en', text: 'P1 S1'},
                               {lang: 'de', text: 'P1 S1 DE'}],
                                                   // aus ter in Spec but I believe aus der ... auf Englisch?
            Deliveries: [{type: 'DASHDelivery', required: true},
                         {type: 'DVBTDelivery', required: false}],
            Languages: [{lang:'de'}, {lang: 'en'}],
            TargetCountries: [{country: 'DEU'}]},
            {ServiceListURI: uri,
              RegulatorListFlag: false,
              Genres: [{genre_name: 'news'}, {genre_name: 'sport'}],
              ServiceListNames: [{lang: 'en', text: 'P1 S2'},
                                 {lang: 'de', text: 'P1 S2 DE'}],
                                                     // aus ter in Spec but I believe aus der ... auf Englisch?
              Deliveries: [{type: 'DASHDelivery', required: true},
                           {type: 'DVBTDelivery', required: false}],
              Languages: [{lang:'de'}, {lang: 'en'}],
              TargetCountries: [{country: 'DEU'}]}
          ] 
        }
      },
      { provider: {
        Names: [{Name: "P2", Lang: "en"}],
        GUID: "P2",
        ElectronicAddress: 
          { Telephone: '+44 020 00000000',
            Email: 'p2@slrdb.com'},
        Address: {
          Name: 'P2',
          Lines: [{
            Text: 'Tamworth'
          }]
        },
        service_lists: [
          {ServiceListURI: uri,
            RegulatorListFlag: false,
            Genres: [{genre_name: 'news'}, {genre_name: 'sport'}],
            ServiceListNames: [{lang: 'en', text: 'P2 S1'},
                               {lang: 'de', text: 'P2 S1 DE'}],
                                                   // aus ter in Spec but I believe aus der ... auf Englisch?
            Deliveries: [{type: 'DASHDelivery', required: true},
                         {type: 'DVBTDelivery', required: false}],
            Languages: [{lang:'de'}, {lang: 'en'}],
            TargetCountries: [{country: 'DEU'}]},
          {ServiceListURI: uri,
            RegulatorListFlag: false,
            Genres: [{genre_name: 'news'}, {genre_name: 'sport'}],
            ServiceListNames: [{lang: 'en', text: 'P2 S2'},
                                {lang: 'de', text: 'P2 S2 DE'}],
                                                    // aus ter in Spec but I believe aus der ... auf Englisch?
            Deliveries: [{type: 'DASHDelivery', required: true},
                          {type: 'DVBTDelivery', required: false}],
            Languages: [{lang:'de'}, {lang: 'en'}],
            TargetCountries: [{country: 'DEU'}]},            
          {ServiceListURI: uri,
            RegulatorListFlag: false,
            Genres: [{genre_name: 'news'}, {genre_name: 'sport'}],
            ServiceListNames: [{lang: 'en', text: 'P2 S3'},
                                {lang: 'de', text: 'P2 S3 DE'}],
                                                    // aus ter in Spec but I believe aus der ... auf Englisch?
            Deliveries: [{type: 'DASHDelivery', required: true},
                          {type: 'DVBTDelivery', required: false}],
            Languages: [{lang:'de'}, {lang: 'en'}],
            TargetCountries: [{country: 'DEU'}]}            
            ] 
        }
      },
      { provider: {
        Names: [{Name: "P3", Lang: "en"}],
        GUID: "P3",
        ElectronicAddress: 
          { Telephone: '+44 020 00000000',
            Email: 'p3@slrdb.com'},
        Address: {
          Name: 'P3',
          Lines: [{
            Text: 'Glasgow'
          }]
        },
        service_lists: [
          {ServiceListURI: uri,
            RegulatorListFlag: false,
            Genres: [{genre_name: 'news'}, {genre_name: 'sport'}],
            ServiceListNames: [{lang: 'en', text: 'P3 S1'},
                               {lang: 'de', text: 'P3 S1 DE'}],
                                                   // aus ter in Spec but I believe aus der ... auf Englisch?
            Deliveries: [{type: 'DASHDelivery', required: true},
                         {type: 'DVBTDelivery', required: false}],
            Languages: [{lang:'de'}, {lang: 'en'}],
            TargetCountries: [{country: 'DEU'}]},

          ] 
        }
      }
    ]
    let provider_offerings = []
    for (var o = 0; o < provider_offerings_seed.length; o++) {
      const our_offering = provider_offerings_seed[o]
      const provider = await Provider.build({
        Names: our_offering.provider.Names,
        GUID: our_offering.provider.GUID,
        ElectronicAddress: our_offering.provider.ElectronicAddress,
        Address: {
          Name: our_offering.provider.Address.Name,
          Lines: our_offering.provider.Address.Lines
        }
      }, {
        include: [ Name,
                  { association: Provider.ElectronicAddress },
                  { association: Provider.Address,
                      include: [ Address.Lines ]
        }]
      })
      let slos = []
      // Add the service lists
      for (var sl = 0; sl < our_offering.provider.service_lists.length; sl ++) {
        let service_list = our_offering.provider.service_lists[sl]
        service_list.Provider = our_offering.provider.GUID
        const slo = await ServiceListOffering.build(service_list,
          {include: [ServiceListName, Delivery, TargetCountry, Language, Genre]})
        slos.push(slo)
      }
      // Create the offering
      provider_offerings.push(offering(null, provider, slos))

    }
    parseString(slep("xml", provider_offerings), function (err, result) {
    })
  })

})
