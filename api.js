const fs = require('fs');
const parseString = require('xml2js').parseString;
const slep = require('./models/service_list_entry_point');
const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const { Op } = require('sequelize');

const offering = require('./models/offering');
const {ServiceListOffering} = require('./models/service_list_offering');
const {Provider, Name, Address} = require('./models/provider');
const { emitWarning } = require('process');

const non_200_response = () => {

  const xml = slep('xml')
  return xml;
}

const mgmt_provider_offering = async (req, res, next) => {
  let filter = ServiceListOffering.build_filter({});
  filter.where = {
      id: req.params.offeringId
  }
  const slo = await ServiceListOffering.findOne(filter);
  if(slo === null) {
    res.status(404).send('Not found')
    next()
  } else {
    res.json(slo.render('json'))
  } 
}

const status = async (req, res, next) => {
  const response = process.env.SHA
  res.send(response)
}

const dvb_i_client_service_list_discovery_query = async (req, res, next) => {

  res.type('application/xml');
  let valid = true
  // Filter Service List Offering based on Params
  const valid_keys = ['Language', 'TargetCountry', 'regulatorListFlag', 'Genre', 'ProviderName', 'Delivery']
  Object.keys(req.query).forEach(key => {
    if (!valid_keys.includes(key)) {
      res.status(400).send(non_200_response())
      valid = false
    }
  });

  if (valid === true) {
    // See if we need to reduce scope to that of a single provider
    if (req.query.hasOwnProperty("ProviderName")) {
      const filter = {
        include:
          [
            {
              model: Name,
              as: 'Names',
              where: {Name: {[Op.eq]: req.query["ProviderName"]}}
            }
          ]
        }
      const prov = await Provider.findOne(filter)
      req.query.Provider = prov.GUID
    }

    // let filter;
    
    try {
      filter = ServiceListOffering.build_filter(req.query, valid_keys);
    }
    catch(err) {
      logger.error(err)
      res.status(400).send(non_200_response())
      valid = false
    }

    if (valid === true) {
      const slo = await ServiceListOffering.findAll(filter);
      let offerings = {}

      if (slo.length > 0) {
        for(var i=0; i < slo.length; i++) {
          const provider_guid = slo[i].Provider
          const provider = await Provider.findOne({
            where: {GUID: provider_guid},
            include: [ Name,
              { association: Provider.ElectronicAddress },
              { association: Provider.Address,
                  include: [ Address.Lines ]}
              ]
          });
          if (!(provider_guid in offerings)) {
            offerings[provider_guid] = {provider: provider, slos:[]}
          }
          offerings[provider_guid].slos.push(slo[i]);
        }

        let the_offerings = []
        for (const [key, value] of Object.entries(offerings)) {
          the_offerings.push(offering(null, value.provider, value.slos)['ProviderOffering'])
        }
  
        res.send(slep("xml", the_offerings))
  
      } else {
        res.status(404).send(non_200_response())
      }
    }
  }
}

module.exports = { mgmt_provider_offering, 
                   dvb_i_client_service_list_discovery_query,
                   status,
                   non_200_response}
