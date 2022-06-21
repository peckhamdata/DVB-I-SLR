const {ServiceListOffering,
       ServiceListName,
       Delivery,
       TargetCountry,
       Language,
       Genre,
       init_slo_models} = require('./service_list_offering');
const { Sequelize } = require('sequelize');

const { create } = require('xmlbuilder2');

const {GUID_British_DVB_I, GUID_Freeview_Australia} = require('../guids')

describe('service list offering is well formed', () => {

  const sequelize = new Sequelize('sqlite::memory:');
  init_slo_models(sequelize);

  it('renders as JSON', () => {

    const expected = {
      id: 1,
      providerGUID: GUID_Freeview_Australia,
      offeringName: "Freeview",
      status: "active",
      updated: "1577836800000", // last modified datatime in Unix Epoch time milliseconds
      parent: "Freeview",
      variant: "ACT",
      regulation: "",
      regulator: "ACMA",
      serviceListNames: [
        {
        id: 1,
        lang: "en",
        text: "Freeview (ACT)",
        description:
          "Freeview brings you the best Australian television content for free. Watch your favourite shows, find new programs or plan your viewing, Freeview makes it all easy", // Description belongs with language version of name
        },
        {
        id: 2,
        lang: "it",
        text: "Freeview - ACT",
        description:
          "Freeview brings you the best Australian television content for free. Watch your favourite shows, find new programs or plan your viewing, Freeview makes it all easy", // Description belongs with language version of name",
        },
      ],
      serviceListURI: [
        {
        id: 1,
        uri: "https://peckhamdata.com/services/australia/freeview.xml",
        }
      ],
      language: ["en", "it"],
      targetCountry: ["AU"],
      genres: ["News/Current affairs"],
      delivery: ["DVB-T", "DVB_DASH"],
      parameters: ""     
    }

    const uri = 'https://peckhamdata.com/services/australia/freeview.xml'

    const SLO = ServiceListOffering.build({ServiceListURI: uri,
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

    const actual = SLO.render('json');
    expect(actual).toEqual(expected);

  })

  it('has the expected structure', () => {

    const uri = 'http://dvbi.TVfromTheWorld.com/TVservices_Germany.xml'

    const SLO = ServiceListOffering.build({ServiceListURI: uri,
                                           RegulatorListFlag: false,
                                           Genres: [{genre_name: 'news'}, {genre_name: 'sport'}],
                                           ServiceListNames: [{lang: 'en', text: 'TV services from the world in English'},
                                                              {lang: 'de', text: 'Fernsehen aus der Welt auf Englisch'}],
                                                                                  // aus ter in Spec but I believe aus der ... auf Englisch?
                                           Deliveries: [{type: 'DASHDelivery', required: true},
                                                        {type: 'DVBTDelivery', required: false}],
                                           Languages: [{lang:'de'}, {lang: 'en'}],
                                           TargetCountries: [{country: 'DEU'}]},
                                           {include: [ServiceListName, Delivery, TargetCountry, Language, Genre]})

    const result = create(SLO.render('xml')).end({format: 'object'});
    const slo = result['ServiceListOffering']
    expect(typeof(slo)).not.toBe('undefined');
    expect (slo['@regulatorListFlag']).toEqual('false')
    expect (slo['ServiceListName'][0]['@xml:lang']).toEqual('en')
    expect (slo['ServiceListName'][0]['#']).toEqual('TV services from the world in English')

    expect (slo['ServiceListName'][1]['@xml:lang']).toEqual('de')
    expect (slo['ServiceListURI']['@contentType']).toEqual('application/xml')
    expect (slo['ServiceListURI']['dvbisd:URI']).toEqual(uri)
    expect (slo['Delivery']['DASHDelivery']['@required']).toEqual('true')
    expect (slo['Delivery']['DVBTDelivery']['@required']).toEqual('false')
    expect (slo['Language'][0]).toEqual('de')
    expect (slo['Language'][1]).toEqual('en')
    expect (slo['Genre'][0]).toEqual('news')
    expect (slo['Genre'][1]).toEqual('sport')
    expect (slo['TargetCountry']).toEqual('DEU')
  })
})
