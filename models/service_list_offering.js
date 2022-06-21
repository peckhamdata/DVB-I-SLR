const { create } = require('xmlbuilder2');
const { DataTypes, Model, Op } = require('sequelize');

class NamedModel extends Model {
  static className() {
    return this.name
  }  
}

class ServiceListOffering extends NamedModel {

  render(format) {
    let service_list_names = []

    this.ServiceListNames.forEach(element => service_list_names.push(element.render()));
    let languages = []
    this.Languages.forEach(element => languages.push(element.render()));
    // Delivery is a bit more complicated as you have to create a different entity based on
    // delivery type
    let delivery = {}
    this.Deliveries.forEach((element) => {
        delivery[element.type] = {'@required': element.required}
    })
    let target_country = []
    this.TargetCountries.forEach(element => target_country.push(element.render()));

    let genre_names = []
    this.Genres.forEach(element => genre_names.push(element.render()));
    const obj = {
      'ServiceListOffering': {
        'ServiceListName': service_list_names,
       'ServiceListURI': {
          '@contentType': 'application/xml',
          'dvbisd:URI': this.ServiceListURI
       },
       '@regulatorListFlag': this.RegulatorListFlag,
       'Genre': genre_names,
       'Delivery': delivery,
       'Language': languages,
       'TargetCountry': target_country
      }
    }

    if (format === 'xml') {
      const re = create(obj)
      return re.end({prettyPrint: true});
    }
    if (format ==='json') {
      return restify_service_list_offering(this.ServiceListNames,
                                           this.ServiceListURI,
                                           this.Deliveries,
                                           this.Languages,
                                           this.TargetCountries,
                                           this.Genres,
                                           this.Provider);
      return {}
    }
    return obj;
  }
}

ServiceListOffering.build_filter = function(query_params, valid_keys) {

  let filter = 
  {
    include: [
      {model: TargetCountry, as: 'TargetCountries'},
      {model: Language, as: 'Languages'},
      {model: ServiceListName, as: 'ServiceListNames'},
      {model: Delivery, as: 'Deliveries'},
      {model: Genre, as: 'Genres'}
    ]
  };
  if (query_params['Provider'] !== undefined) {

    if (!filter.hasOwnProperty('where')) {
      filter.where = {}
    }
    filter.where.Provider = {[Op.eq]: query_params['Provider']}
  }

  if (query_params['regulatorListFlag'] !== undefined) {
    let regulatorListFlag = false
    let flag = query_params['regulatorListFlag']
    switch(flag) {
      case 'true':
        regulatorListFlag = true
        break;
      case 'false':
        break;
      default:
        throw `invalid regulatorListFlag value: ${flag}`
    }
    if (!filter.hasOwnProperty('where')) {
      filter.where = {}
    }
    filter.where.RegulatorListFlag = {[Op.eq]: regulatorListFlag}
    
  }

  // Translate key values

  const value_map = {
    'Delivery': {
      'dvb-t': 'DVBTDelivery',
      'dvb-dash': 'DASHDelivery'
    }
  }

  for (const [key, value] of Object.entries(query_params)) {
    if (value_map.hasOwnProperty(key)) {
      query_params[key] = value_map[key][value]
    }
  }

  let where_clauses = {}
  let where_keys = {
    'Language': 'lang',
    'Genre': 'genre_name',
    'TargetCountry': 'country',
    'Delivery': 'type'
  }

  for (const [key, value] of Object.entries(query_params)) {
    // See if any of the [] params were passed in and if so normalise them to non [] ones
    let param
    if (typeof value === 'string' || value instanceof String) {
      param = [value]
    } else {
      param = value
    }
    // Append to the clause if it is there already
    if (where_clauses.hasOwnProperty(key)) {
      where_clauses[key].concat(param)
    } else {
      // Or add it if it is not
      where_clauses[key] = param
    }
  }
  filter.include.forEach((item) => {
    if (item.model.className() in where_clauses) {
      item['where'] = {[where_keys[item.model.className()]]: {[Op.in]: where_clauses[item.model.className()]}}
    }
  })

  return filter;
}

class ServiceListName extends NamedModel {

  render(format) {
    return {'@xml:lang': this.lang, '#': this.text}
  }
}

class Language extends NamedModel {

  render(format) {
    return this.lang
  }

}

class Delivery extends NamedModel {}
class TargetCountry extends NamedModel {

  render(format) {
    return this.country
  }

}

class Genre extends NamedModel {

  render(format) {
    return this.genre_name
  }

}

function init_slo_models(sequelize) {

  ServiceListName.init({
      lang: {
        type: DataTypes.STRING,
        allowNull: false
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
    sequelize,
    modelName: 'ServiceListName'
  });

  ServiceListOffering.init({
      ServiceListURI: {
        type: DataTypes.STRING,
        allowNull: false
      },
      RegulatorListFlag: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      Provider: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
    sequelize,
    modelName: 'ServiceListOffering'
  });

  ServiceListName.ServiceListOffering = ServiceListName.belongsTo(ServiceListOffering)
  ServiceListOffering.ServiceListName = ServiceListOffering.hasMany(ServiceListName);

  Language.init({
      lang: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
    sequelize,
    modelName: 'Language'
  });

  Language.ServiceListOffering = Language.belongsTo(ServiceListOffering)
  ServiceListOffering.Language = ServiceListOffering.hasMany(Language);

  Delivery.init({
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      required: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    }, {
    sequelize,
    modelName: 'Delivery'
  });
  Delivery.ServiceListOffering = Delivery.belongsTo(ServiceListOffering)
  ServiceListOffering.Delivery = ServiceListOffering.hasMany(Delivery);

  TargetCountry.init({
    country: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'TargetCountry'
  });

  TargetCountry.ServiceListOffering = TargetCountry.belongsTo(ServiceListOffering)
  ServiceListOffering.TargetCountry = ServiceListOffering.hasMany(TargetCountry);

  Genre.init({
    genre_name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Genre'
  })

  Genre.ServiceListOffering = Genre.belongsTo(ServiceListOffering)
  ServiceListOffering.Genre = ServiceListOffering.hasMany(Genre);

}

module.exports = {ServiceListOffering, ServiceListName, Delivery, Language, TargetCountry, Genre, init_slo_models};

const restify_service_list_offering = (ServiceListNames,
                                        ServiceListURI,
                                        delivery,
                                        languages,
                                        target_country,
                                        genres,
                                        Provider) => {
  
  delivery_lookup = {
    "DASHDelivery": "DVB_DASH",
    "DVBTDelivery": "DVB-T"
  }

  service_list_names = []

  // TODO: Remove hard coding
  ServiceListNames.forEach((element, idx) => service_list_names.push(
    {description: "Freeview brings you the best Australian television content for free. Watch your favourite shows, find new programs or plan your viewing, Freeview makes it all easy",
     id: idx + 1,
     lang: element.lang,
     text: element.text}
  ))

  service_list_uris = [{
    id: 1,
    uri: ServiceListURI
  }]

  lang_codes = []
  languages.forEach(element => lang_codes.push(element.lang));
           
  delivery_codes = []
  delivery.forEach(element => delivery_codes.push(delivery_lookup[element.type]))

  target_country_codes = []
  target_country.forEach(element => target_country_codes.push(element.country))

  const restified = {
    id: 1,
    providerGUID: Provider,
    offeringName: "Freeview",
    status: "active",
    updated: "1577836800000", // last modified datatime in Unix Epoch time milliseconds
    parent: "Freeview",
    variant: "ACT",
    regulation: "",
    regulator: "ACMA",
    serviceListNames: service_list_names,
    serviceListURI: service_list_uris,
    language: lang_codes,
    targetCountry: target_country_codes,
    genres: ["News/Current affairs"],
    delivery: delivery_codes,
    parameters: "",
    parent: "Freeview",
    regulator: "ACMA",
    regulation: "",
  }
  return restified;
}
