const request = require("supertest");
const app = require("./server");
const parseString = require('xml2js').parseString;

const version = '/api/A177r3';

const {seed_database} = require('./seed.js');
const { Sequelize } = require('sequelize');

const {GUID_British_DVB_I, GUID_Freeview_Australia} = require('./guids')

describe("GET /status", () => {

  test("It should tell you the status and version of the backend", async() => {

    const response = await request(app).get(version.concat("/status"));
    expect(response.statusCode).toBe(200);
    const resp = response.text;

  })

})

describe("GET /query", () => {
  test("It should return the default set of service list entry points", async () => {

    const sequelize = new Sequelize('sqlite::memory:', {logging: false});
    await seed_database(sequelize, true)

    const response = await request(app).get(version.concat("/query"));
    expect(response.statusCode).toBe(200);
    const xml = response.text;
    parseString(xml, function (err, result) {
      expect(err).toBeNull();
      expect(typeof(result['ServiceListEntryPoints'])).not.toBe('undefined');
    })
  })

  test("It should return something meaningful if no service list offerings can be found", async () => {

    const sequelize = new Sequelize('sqlite::memory:', {logging: false});
    await seed_database(sequelize, true)

    const response = await request(app).get(version.concat("/query?TargetCountry=AFG"));
    expect(response.statusCode).toBe(404);
  })

  test("It should filter on the query string by language", async() => {

    const sequelize = new Sequelize('sqlite::memory:', {logging: false});
    await seed_database(sequelize, true)

    const response = await request(app).get(version.concat("/query?Language=it"));
    expect(response.statusCode).toBe(200);
    const xml = response.text;
    parseString(xml, function (err, result) {
      expect(err).toBeNull();
      expect(result['ServiceListEntryPoints']['ProviderOffering'][0]['ServiceListOffering']).toHaveLength(1)
    })

  })

  test("It should filter on regulatorListFlag", async() => {

    const sequelize = new Sequelize('sqlite::memory:', {logging: false});
    await seed_database(sequelize, true)

    const response = await request(app).get(version.concat("/query?regulatorListFlag=true"));
    expect(response.statusCode).toBe(200);
    // const xml = response.text;
    // parseString(xml, function (err, result) {
    //   expect(err).toBeNull();
    //   expect(result['sld:ServiceListEntryPoints']['sld:ProviderOffering'][0]['sld:ServiceListOffering']).toHaveLength(1)
    // })

  })

  test("It should filter on Genre", async() => {

    const sequelize = new Sequelize('sqlite::memory:', {logging: false});
    await seed_database(sequelize, true)

    const response = await request(app).get(version.concat("/query?Genre[]=News"));
    expect(response.statusCode).toBe(200);
    const xml = response.text;
    parseString(xml, function (err, result) {
      expect(err).toBeNull();
      expect(result['ServiceListEntryPoints']['ProviderOffering'][0]['ServiceListOffering']).toHaveLength(1)
    })

  })

  test("It should filter on Provider", async() => {

    const sequelize = new Sequelize('sqlite::memory:', {logging: false});
    await seed_database(sequelize, true)

    const response = await request(app).get(version.concat("/query?ProviderName=Freeview%20Australia"));
    expect(response.statusCode).toBe(200);
    const xml = response.text;
    parseString(xml, function (err, result) {
      expect(err).toBeNull();
      expect(result['ServiceListEntryPoints']['ProviderOffering'][0]['Provider'][0]['Name'][0]).toEqual('Freeview Australia')
      expect(result['ServiceListEntryPoints']['ProviderOffering'][0]['ServiceListOffering']).toHaveLength(1)
    })

  })

  test("It should filter on Delivery", async() => {

    const sequelize = new Sequelize('sqlite::memory:', {logging: false});
    await seed_database(sequelize, true)

    const response = await request(app).get(version.concat("/query?Delivery=dvb-t"));
    expect(response.statusCode).toBe(200);
    const xml = response.text;
    parseString(xml, function (err, result) {
      expect(err).toBeNull();
      expect(result['ServiceListEntryPoints']['ProviderOffering'][0]['Provider'][0]['Name'][0]).toEqual('Freeview Australia')
      expect(result['ServiceListEntryPoints']['ProviderOffering'][0]['ServiceListOffering']).toHaveLength(1)
    })

  })

  // TODO: Test with params in query order

  test("It should return a 400 for unknown params", async() => {

    const sequelize = new Sequelize('sqlite::memory:', {logging: false});
    await seed_database(sequelize)

    const response = await request(app).get(version.concat("/query?Goat=tortoise"));
    expect(response.statusCode).toBe(400);
    const xml = response.text;
    parseString(xml, function (err, result) {
      expect(err).toBeNull();
    })

  })

});
