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

// Search for method, params and than optional where you want to find something
// returns first 20 items
// obaApi.get(endpoint, params, filterKey)
// possible endpoints: search (needs 'q' parameter) | details (needs a 'frabl' parameter) | availability (needs a 'frabl' parameter) | holdings/root | index/x (where x = facet type (like 'book' ))
// possible parameters: q, librarian, refine, sort etc. check oba api documentation for all
// possible filterKey: any higher order key in response object, like title returns only title objects instead of full data object

   obaApi.get('search', {
     q: 'classification:prentenboek ',
     refine: true,
     librarian: true,
     facet: 'pubyear(' + 2018 + ')',
     page: 1
   }, 'subjects').then(response => {

     var initialResults = new Array
     // weghalen van onnodig data wrapper
     initialResults = response.data

     // Onderstaande regel m.b.v. Tim
     var waarde = initialResults.map(x => x.map(y => Object.values(y)[0]))

     var alleOnderwerpen = waarde.map(x => Object.values(x)[0])

     // Onderstaande regel m.b.v. Titus
     var platteWaarde = [].concat(...alleOnderwerpen)

     var platteWaarde = platteWaarde.map(x => x._.toLowerCase())

     // response ends up here
     console.log(platteWaarde)

     //https://wsvincent.com/javascript-remove-duplicates-array/

     let uniekeOnderwerpen = [...new Set(platteWaarde)];

     var frequentieLijst = uniekeOnderwerpen.map(function(x) {
       var onderwerpObject = new Object();
       onderwerpObject.onderwerp = x;
       onderwerpObject.frequentie = 0;
       return onderwerpObject;
     }
    )

    function indexOnderwerp(array, ow) {
      var index = array.findIndex(onderwerpObject => onderwerpObject.onderwerp === ow);
      return index;
    }

    function verhoogFrequentie(array, index){
      array[index].frequentie = array[index].frequentie + 1;
    }

    platteWaarde.forEach(function(x) {
      var index = indexOnderwerp(frequentieLijst, x);
      verhoogFrequentie(frequentieLijst, index);
    })

    console.log(frequentieLijst)

   // Make server with the response on the port
   app.get('/', (req, res) => res.json(response))
   app.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)))
 })
