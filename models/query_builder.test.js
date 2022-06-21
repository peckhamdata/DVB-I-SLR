const {ServiceListOffering,
       TargetCountry,
       ServiceListName,
       Delivery,
       Language,
       Genre} = require('./service_list_offering');

const { Op } = require('sequelize');

describe("Query Builder", () => {

  it("should return everything wthout a filter", async() => {
    const actual = ServiceListOffering.build_filter({})
    const expected = 
      {include: [
        {
          model: TargetCountry,
          as: 'TargetCountries'
        },
        {
          model: Language,
          as: 'Languages',
        },
        {
          model: ServiceListName,
          as: 'ServiceListNames',
        },
        {
          model: Delivery,
          as: 'Deliveries',
        },
        { 
          model: Genre,
          as: 'Genres',
        }]
      }
      expect(actual).toEqual(expected);
  });

  it("should filter on one target country", async () => {

    const actual = ServiceListOffering.build_filter({'TargetCountry': 'ITA'})

    const expected = {include: 
      [{
          model: TargetCountry,
          as: 'TargetCountries',
          where: {
            country: {[Op.in]: ["ITA"]}
          }
        },
        {
          model: Language,
          as: 'Languages',
        },
        {
          model: ServiceListName,
          as: 'ServiceListNames',
        },
        {
          model: Delivery,
          as: 'Deliveries',
        },
        { 
          model: Genre,
          as: 'Genres',
        }]
      };

    expect(actual).toEqual(expected);

  });

  it("should filter on multiple target countries", async () => {

    const actual = ServiceListOffering.build_filter({'TargetCountry': ['ITA', 'DEU']})

    const expected = {include: 
      [
        {
          model: TargetCountry,
          as: 'TargetCountries',
          where: {
          country: {[Op.in]: ["ITA", "DEU"]}
          }
        },
        {
          model: Language,
          as: 'Languages'
        },
        {
          model: ServiceListName,
          as: 'ServiceListNames'
        },
        {
          model: Delivery,
          as: 'Deliveries'
        },
        { 
          model: Genre,
          as: 'Genres',
        }
      ]
    };

    expect(actual).toEqual(expected);

  });

  it("should filter on language", async () => {

    const actual = ServiceListOffering.build_filter({'Language': 'it'})

    const expected = {include: 
      [
        {
          model: TargetCountry,
          as: 'TargetCountries'
        },
        {
          model: Language,
          as: 'Languages',
          where: {
            lang: {[Op.in]: ["it"]}
          }
        },
        {
          model: ServiceListName,
          as: 'ServiceListNames'
        },
        {
          model: Delivery,
          as: 'Deliveries'
        },
        { 
          model: Genre,
          as: 'Genres',
        }
      ]
    };

    expect(actual).toEqual(expected);

  });

  it("should filter on multiple languages", async () => {

    const actual = ServiceListOffering.build_filter({'Language': ['it', 'de']})

    const expected = {include: 
      [
        {
          model: TargetCountry,
          as: 'TargetCountries'
        },
        {
          model: Language,
          as: 'Languages',
          where: {
            lang: {[Op.in]: ["it", "de"]}
          }
        },
        {
          model: ServiceListName,
          as: 'ServiceListNames'
        },
        {
          model: Delivery,
          as: 'Deliveries'
        },
        { 
          model: Genre,
          as: 'Genres',
        }
      ]
    };

    expect(actual).toEqual(expected);

  });

  it("should filter on target country and language", async () => {

    const actual = ServiceListOffering.build_filter({'Language': ['it', 'de'], 'TargetCountry': ['DEU']})

    const expected = {include: 
      [
        {
          model: TargetCountry,
          as: 'TargetCountries',
          where: {
            country: {[Op.in]: ["DEU"]}
          }
       },
       {
          model: Language,
          as: 'Languages',
          where: {
            lang: {[Op.in]: ["it", "de"]}
          }
       },
       {
          model: ServiceListName,
          as: 'ServiceListNames',
       },
       {
          model: Delivery,
          as: 'Deliveries',
       },
       { 
        model: Genre,
        as: 'Genres',
      }
    ]
  };

    expect(actual).toEqual(expected);

  });

  it("should filter out unregulated services", async () => {

    
    const actual = ServiceListOffering.build_filter({'regulatorListFlag': 'true'})

    const expected = {
      include: 
      [
        {
          model: TargetCountry,
          as: 'TargetCountries',
        },
        {
          model: Language,
          as: 'Languages',
        },
        {
          model: ServiceListName,
          as: 'ServiceListNames',
        },
        {
          model: Delivery,
          as: 'Deliveries',
        },
        { 
          model: Genre,
          as: 'Genres',
        }
      ],
      where: {
        RegulatorListFlag: {[Op.eq]: true}
      }
    }
 
    expect(actual).toEqual(expected);

  })

  it("should filter by genre", async () => {
    const actual = ServiceListOffering.build_filter({'Genre': ['sports', 'news']})

    const expected = {
      include: 
      [
        {
          model: TargetCountry,
          as: 'TargetCountries',
        },
        {
          model: Language,
          as: 'Languages',
        },
        {
          model: ServiceListName,
          as: 'ServiceListNames',
        },
        {
          model: Delivery,
          as: 'Deliveries',
        },
        { 
          model: Genre,
          as: 'Genres',
          where: {
            genre_name: {[Op.in]: ['sports', 'news']}
          }
        }
  
      ],
    }
 
    expect(actual).toEqual(expected);
  })

  it("should filter by provider", async () => {

    const actual = ServiceListOffering.build_filter({'Provider': 'UNIQUE-PROVIDER-GUID'})

    const expected = {
      include: 
      [
        {
          model: TargetCountry,
          as: 'TargetCountries',
        },
        {
          model: Language,
          as: 'Languages',
        },
        {
          model: ServiceListName,
          as: 'ServiceListNames',
        },
        {
          model: Delivery,
          as: 'Deliveries',
        },
        { 
          model: Genre,
          as: 'Genres',
        }
      ],
      where: {
        Provider: {[Op.eq]: 'UNIQUE-PROVIDER-GUID'}
      }
    }

    expect(actual).toEqual(expected);

  })

  it("should filter by delivery", async () => {

    const actual = ServiceListOffering.build_filter({'Delivery': 'dvb-t'})

    const expected = {
      include: 
      [
        {
          model: TargetCountry,
          as: 'TargetCountries',
        },
        {
          model: Language,
          as: 'Languages',
        },
        {
          model: ServiceListName,
          as: 'ServiceListNames',
        },
        {
          model: Delivery,
          as: 'Deliveries',
          where: {
            type: {[Op.in]: ["DVBTDelivery"]}
          }
        },
        { 
          model: Genre,
          as: 'Genres',
        }
      ]
    }
    expect(actual).toEqual(expected);

  })

  
})