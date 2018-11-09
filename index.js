// Onderstaande code met behulp van Dennis' begincode voor index.js en oba-api.js

require('dotenv').config()
const fs = require('fs')

const api = require('./oba-api.js')
const chalk = require('chalk');
const express = require('express')
const app = express()
const port = 3000

const obaApi = new api({
  url: 'https://zoeken.oba.nl/api/v1/',
  key: process.env.PUBLIC
})

// Onderstaande functie door Jesse Dijkman
function getTotalBooks() {
  return obaApi.get('search', {
    q: 'classification:prentenboek',
    librarian: 'true',
    refine: 'true',
    facet: 'pubYear(2009)',
  })
  .then(res => {
    return Math.ceil(res.data.aquabrowser.meta[0].count / 20)
    // return Math.ceil(JSON.parse(res).data.aquabrowser.meta.count)
  })
  .catch(error => console.log(error, 'test'))
}

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
  facet: 'pubyear(2009)',
  page: 3
}, 'subjects').then(response => {

  var initialResults = new Array
  // weghalen van onnodig data wrapper
  initialResults = response.data

  // Onderstaande regel m.b.v. Tim
  var waarde = initialResults.map(x => x.map(y => Object.values(y)[0]))

  var alleOnderwerpen = waarde.map(x => Object.values(x)[0])

  // Onderstaande regel m.b.v. Titus
  var platteWaarde = [].concat(...alleOnderwerpen)

  // Maak alle waarden lowercase.
  var platteWaarde = platteWaarde.map(x => x._.toLowerCase())

  //https://wsvincent.com/javascript-remove-duplicates-array/
  let uniekeOnderwerpen = [...new Set(platteWaarde)];


  var frequentieLijst = uniekeOnderwerpen.map(function(x) {
    var onderwerpObject = new Object();
    onderwerpObject.onderwerp = x;
    onderwerpObject.frequentie = 0;
    return onderwerpObject;
  })

  function indexOnderwerp(array, ow) {
    var index = array.findIndex(onderwerpObject => onderwerpObject.onderwerp === ow);
    return index;
  }

  function verhoogFrequentie(array, index) {
    array[index].frequentie = array[index].frequentie + 1;
  }

  platteWaarde.forEach(function(x) {
    var index = indexOnderwerp(frequentieLijst, x);
    verhoogFrequentie(frequentieLijst, index);
  })

  frequentieLijst.sort(function(a, b) {
    return b.frequentie - a.frequentie;
  });

  console.log(frequentieLijst)
  fs.writeFile('log.json', JSON.stringify(frequentieLijst), (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
  });



  // Make server with the response on the port
  app.get('/', (req, res) => res.json(response))
  app.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)))
})

getTotalBooks();

// console.log(getAllSubjects(i, 2017))
//
// var allSubjectsList = [];
//
// for (var i = 1; i < 5; i++) {
//   var helePagina = getAllSubjects(i, 2017);
//   allSubjectsList.concat(helePagina);
// }
//
// console.log(allSubjectsList);
