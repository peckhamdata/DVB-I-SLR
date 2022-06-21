# A node.js DVB-I Service List Registry

## About

Implementation of the [DVB-I](https://dvb-i.tv/) Service List Query interface - B1
in the diagram on page 13 of the [DVB BlueBook A177r3 (January 2022)](https://dvb.org/wp-content/uploads/2021/06/A177r3_Service-Discovery-and-Programme-Metadata-for-DVB-I_January-2022.pdf).

This is being iteratively developed and does not dot all the Is or cross all the Ts 
of the spec. See the _Contributing_ section below if you would like to help us with this.

## Motivation

The Internet and World Wide Web are the _de facto_ means of video content
distribution, discovery and consumption.

We think this is a good thing. It fulfills J. C. R. Licklider and Robert W. Taylor's vision of the original `Arpanet` as a means of enhancing human potential.

We are concerned that content discovery is working against that vision.

As rights holders and platform owners ring fence their content into apps
it's discovery becomes a challenge. You need to know where to look for what you want to watch.

OR

You are dependent on a search engine to help you get there. Either way you are beholden to a private company to get you to the things you want to watch.

We think things can be better. We think that open standards and a distributed means of
content discovery, think `DNS`, is better for everyone.

To this end we have implemented the `bootstrapping` part of DVB-I; the _Service List Registry_.

## Installation

`npm install`

## Configuration

### Database

Configure database access with the `DB_CONNECT_STRING` environment variable. e.g.

```
export DB_CONNECT_STRING=sqlite::/path/to/data.db
```

To test with MariaDB:

```
export DB_CONNECT_STRING=mariadb://username:password@127.0.0.1:3306/slr
```

Note use an IP address and not `localhost` as the backend expects to connect via TCP and not Unix Sockets.

### Seeding the database

To seed the database with entities:

```
node seed_new_database.js
```

## Operation

`npm start`

## Querying the interface

We have decided to namespace and version the query endpoint. We know this is not as 
per the spec and have done so in the interests of API lifecycle management.

This means queries need to be prefixed with `/api/A177r3` e.g.

```
curl http://localhost:8080/api/A177r3/query
```

or

```
curl http://localhost:8080/api/A177r3/query\?TargetCountry=ITA
```

Note escaped `\?` in query string to keep the shell happy.

For production use a proxy could be used to present this as `/query` as per the spec.

## Running the tests

`npm test`

At the time of writing a successful test run should end with:

```
Test Suites: 8 passed, 8 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        15.527 s
Ran all test suites.
```

To run a single test:

```
npm test -- -t '<describeString> <itString>'
```

e.g.

```
npm test -- -t 'GET /query It should return the default set of service list entry points'
```

## Caching and Scaling

This implementation makes no attempt to cache or scale it's capacity to respond to queries.
We would expect this to be implemented either in middleware or in a proxy such as [nginx](https://www.nginx.com/resources/wiki/start/topics/examples/reverseproxycachingexample/)
or [Varnish](https://varnish-cache.org/).

## Contributing

We'd love people to get involved in making this a useful resource for the DVB-I community
and the wider public.

Feel free to fork, branch and submit your pull requests. We do ask that any changes to 
the code are accompanied by tests that express and validate the expected behaviour and that
this `README` is kept up to date :-)

## Get in touch

We'd love to hear from you at `contact@peckhamdata.com`.

## Finally

`DVB-I` is Copyright – DVB Project 2021
