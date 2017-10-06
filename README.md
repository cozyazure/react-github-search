# Github Autocomplete Search

This project is to demonstrate the implementation of autocomplete of  Github Search API using the React.

## Getting started
Run `npm install` to install all the dependencies

```bash
$ npm install
```

Starting the app:

```bash
$ npm start
```
and browse at port `3000` to view the app.

Running the test:

```bash
$ npm test
```

## Behaviour

The app is pre loaded with a set of data, approximately 100 github users. These data is stored in memory, called `Databank`. 

Upon using the autocomplete, if a user tries to search for a github user, it will try to look up in the `Databank`. If users exist in Databank, it will return the results immediately. If not, an api call will be sent to Github API to look for more users. Response from Github will then be merged with the `Databan`, with all the duplicates removed.
