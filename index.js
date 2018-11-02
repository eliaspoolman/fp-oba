require('dotenv').config()

const api = require('./oba-api.js')
const chalk = require('chalk');
const express = require('express')
const app = express()
const port = 3000

const obaApi = new api({
  url: 'https://zoeken.oba.nl/api/v1/',
  key: process.env.PUBLIC
})

// Search for method, params and than optional where you wanna find something
// returns first 20 items
// obaApi.get(endpoint, params, filterKey)
// possible endpoints: search (needs 'q' parameter) | details (needs a 'frabl' parameter) | availability (needs a 'frabl' parameter) | holdings/root | index/x (where x = facet type (like 'book' ))
// possible parameters: q, librarian, refine, sort etc. check oba api documentation for all
// possible filterKey: any higher order key in response object, like title returns only title objects instead of full data object

// obaApi.get('search', {
//   q: 'harry potter',
//   librarian: true,
//   refine: true
// }, 'title').then(response => {

// https://zoeken.oba.nl/api/v1/search/?q=classification:prentenboek%20diefstallen&pagesize=10&authorization=1e19898c87464e239192c8bfe422f280&facet=topic(diefstallen)

  // obaApi.get('search', {
  //   q: 'classification:prentenboek diefstallen',
  //   refine: true,
  //   facet: 'topic(diefstallen)'
  // }, ).then(response => {

   obaApi.get('search', {
     q: 'classification:prentenboek ',
     refine: true,
     librarian: true,
     facet: 'pubyear(' + 2018 + ')',
     page: 1
   }, 'subjects').then(response => {

     var initialResults = new Array
     var subjectsResults = new Array
     // weghalen van onnodig data wrapper
     initialResults = response.data

     // Onderstaande regel m.b.v. Tim
     var waarde = initialResults.map(x => x.map(y => Object.values(y)[0][0]._))
     // Onderstaande regel m.b.v. Titus
     var platteWaarde = [].concat(...waarde)

   // response ends up here
   console.log(platteWaarde)

   // Make server with the response on the port
   app.get('/', (req, res) => res.json(response))
   app.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)))
 })
