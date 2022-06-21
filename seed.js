// Seed the database with sample ServiceListOfferings
const {ServiceListOffering,
       ServiceListName,
       Delivery,
       TargetCountry,
       Language,
       Genre,
       init_slo_models} = require('./models/service_list_offering');

const {Provider,
       Name,
       Address,
       init_provider_models} = require('./models/provider');

const {GUID_British_DVB_I,
       GUID_France,
       GUID_Freeview_Australia,
       GUID_De,
       GUID_It,
       GUID_GB,
       GUID_EN,
       GUID_ES} = require('./guids')

const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const seed_data = [
  { provider: {
      Names: [{ Name: "Freeview Australia" }],
      GUID: GUID_Freeview_Australia,
      ElectronicAddress: 
        { Telephone: '61-280789000'},
      Address: {
        Name: 'Freeview Australia',
        Lines: [{ LineNumber: 0, Text: 'Suite 1'},
                { LineNumber: 1, Text: 'Level 2'},
                { LineNumber: 2, Text: '76 Berry Street'},
                { LineNumber: 3, Text: 'North Sydney'},
                { LineNumber: 4, Text: 'New South Wales'},
                { LineNumber: 5, Text: '2060'},
                { LineNumber: 6, Text: 'Australia'}]
      } 
    },
    service_lists: [
    {
      ServiceListURI:   "https://lists.peckhamdata.com/services/australia/freeview.xml",
      ServiceListNames: [{lang: 'en', text: 'Freeview'}],
      Deliveries:       [{type: 'DASHDelivery', required: false},
                         {type: 'DVBTDelivery', required: true}],
      RegulatorListFlag: true,
      Languages:        [{lang: 'en'}],
      TargetCountries:  [{country: 'AUS'}]
    }]
  },
  { provider: {
    Names: [{ Name: "France Télévisions" }],
    GUID: GUID_France,
    ElectronicAddress: 
      { Telephone: '33-8-90-71-02-02'},
    Address: {
      Name: 'France Télévisions',
      Lines: [{ LineNumber: 0, Text: '7 Esplanade Henri De France'},
              { LineNumber: 1, Text: 'Paris'},
              { LineNumber: 2, Text: '75015'},
              { LineNumber: 3, Text: 'France'}]
    }
  },
  service_lists: [
  {
    ServiceListURI:   "https://lists.peckhamdata.com/services/france/france_televisions.xml",
    ServiceListNames: [{lang: 'fr', text: 'France Télévisions'}],
    Deliveries:       [{type: 'DASHDelivery', required: true},
                       {type: 'DVBTDelivery', required: true}],
    RegulatorListFlag: true,
    Languages:        [{lang: 'fr'}],
    TargetCountries:  [{country: 'FRA'}]
    }]
  },
  { provider: {
    Names: [{ Name: "Rundfunk Berlin-Brandenburg" }],
    GUID: GUID_De,
    ElectronicAddress: 
      {},
    Address: {
      Name: 'Rundfunk Berlin-Brandenburg',
      Lines: [{ LineNumber: 0, Text: 'Masurenallee 8-14'},
              { LineNumber: 1, Text: '14057'},
              { LineNumber: 2, Text: 'Berlin'},
              { LineNumber: 3, Text: 'Germany'}]
    }
  },
  service_lists: [
  {
    ServiceListURI:   "https://lists.peckhamdata.com/services/germany/rbb.xml",
    ServiceListNames: [{lang: 'en', text: 'Rundfunk Berlin-Brandenburg'}],
    Deliveries:       [{type: 'DASHDelivery', required: false},
                       {type: 'DVBTDelivery', required: true}],
    RegulatorListFlag: true,
    Languages:        [{lang: 'de'}],
    TargetCountries:  [{country: 'DEU'}]
  }]
},
{ provider: {
  Names: [{ Name: "RAI Radiotelevisione Italiana SPA" }],
  GUID: GUID_It,
  ElectronicAddress: 
    { Telephone: '39-0105762911'},
  Address: {
    Name: 'RAI',
    Lines: [{ LineNumber: 0, Text: 'Viale Giuseppe Mazzini'},
            { LineNumber: 1, Text: '14 Roma'},
            { LineNumber: 2, Text: 'Roma'},
            { LineNumber: 3, Text: '00195'},
            { LineNumber: 4, Text: 'Italy'}]
  }
},
service_lists: [
{
  ServiceListURI:   "https://lists.peckhamdata.com/services/italy/rai.xml",
  ServiceListNames: [{lang: 'it', text: 'Rai'}],
  Deliveries:       [{type: 'DASHDelivery', required: true},
                     {type: 'DVBTDelivery', required: true}],
  RegulatorListFlag: true,
  Languages:        [{lang: 'it'}],
  TargetCountries:  [{country: 'ITA'}]
}]
},
{ provider: {
  Names: [{ Name: "Freeview" }],
  GUID: GUID_GB,
  ElectronicAddress: 
    {},
  Address: {
    Name: 'Freeview',
    Lines: [{ LineNumber: 0, Text: 'Riverbank House'},
            { LineNumber: 1, Text: '2 Swan Lane'},
            { LineNumber: 2, Text: 'London'},
            { LineNumber: 3, Text: 'EC4R 3TT'},
            { LineNumber: 4, Text: 'United Kingdom'}]
  }
},
service_lists: [
{
  ServiceListURI:   "https://lists.peckhamdata.com/services/uk/freeview.xml",
  ServiceListNames: [{lang: 'en', text: 'Freeview'}],
  Deliveries:       [{type: 'DASHDelivery', required: false},
                     {type: 'DVBTDelivery', required: true}],
  RegulatorListFlag: true,
  Languages:        [{lang: 'en'}],
  TargetCountries:  [{country: 'GBR'}]
}]
},
{ provider: {
  Names: [{ Name: "Euronews" }],
  GUID: GUID_EN,
  ElectronicAddress: 
    { Telephone: '(33) 4 28 67 00 00'},
  Address: {
    Name: 'Euronews',
    Lines: [{ LineNumber: 0, Text: '56, Quai Rambaud'},
            { LineNumber: 1, Text: '69002'},
            { LineNumber: 2, Text: 'Lyon'},
            { LineNumber: 3, Text: 'France'}]
  }
},
service_lists: [
{
  ServiceListURI:   "https://lists.peckhamdata.com/services/eu/euronews.xml",
  ServiceListNames: [{lang: 'en', text: 'Euronews'}],
  Deliveries:       [{type: 'DASHDelivery', required: true},
                     {type: 'DVBTDelivery', required: false}],
  RegulatorListFlag: true,
  Languages:        [{lang: 'de'}, {lang: 'en'}, {lang: 'fr'}, {lang: 'it'}],
  TargetCountries:  [{country: 'DEU'}, {country: 'FRA'}, {country: 'GBR'}, {country: 'ITA'}],
  Genres: [{"genre_name": "News"}],
}]
},
{ provider: {
  Names: [{ Name: "Eurosport" }],
  GUID: GUID_ES,
  ElectronicAddress: 
    { Telephone: '33-963215488'},
  Address: {
    Name: 'Eurosport',
    Lines: [{ LineNumber: 0, Text: '3, Rue Gaston et René Caudron'},
            { LineNumber: 1, Text: '92130'},
            { LineNumber: 2, Text: 'Issy Les Moulineaux'},
            { LineNumber: 3, Text: 'Ile De France'},
            { LineNumber: 4, Text: 'France'}]
  }
},
service_lists: [
  {
    ServiceListURI:   "https://lists.peckhamdata.com/services/eu/eurosport.xml",
    ServiceListNames: [{lang: 'en', text: 'Eurosport'}],
    Deliveries:       [{type: 'DASHDelivery', required: true},
                       {type: 'DVBTDelivery', required: false}],
    RegulatorListFlag: true,
    Languages:        [{lang: 'de'}, {lang: 'en'}, {lang: 'fr'}, {lang: 'it'}],
    TargetCountries:  [{country: 'DEU'}, {country: 'FRA'}, {country: 'GBR'}, {country: 'ITA'}],
    Genres: [{"genre_name": "Sports"}],
  }]
  }
  ];

async function seed_database(sequelize, populate) {
    try {
      init_slo_models(sequelize)
      init_provider_models(sequelize)
      await sequelize.sync();
      logger.info("All models were synchronized successfully.");

      if (populate === true) {
        for (var o = 0; o < seed_data.length; o++) {
          const offering = seed_data[o]
          logger.info(`Seeding provider ${offering.provider.Names[0].Name}:${offering.provider.GUID}`)

          const provider = await Provider.create({
            Names: offering.provider.Names,
            GUID: offering.provider.GUID,
            ElectronicAddress: offering.provider.ElectronicAddress,
            Address: {
              Name: offering.provider.Address.Name,
              Lines: offering.provider.Address.Lines
            }
          }, {
            include: [ Name,
                      { association: Provider.ElectronicAddress },
                      { association: Provider.Address,
                          include: [ Address.Lines ]
            }]
          })
          // Create an offering
          for (var sl = 0; sl < offering.service_lists.length; sl ++) {
            let service_list = offering.service_lists[sl]
            service_list.Provider = offering.provider.GUID
            logger.info("Seeding service list " + service_list.ServiceListURI)
            const slo = await ServiceListOffering.create(service_list,
              {include: [ServiceListName, Delivery, TargetCountry, Language, Genre]})
            logger.info(slo.id);
          }
        }
      }
    } catch (e) {
        // Deal with the fact the chain failed
      logger.error(e)
    }
}

module.exports = { seed_database };
