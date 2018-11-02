# Functional programming OBA

## Dag 1 - Maandag 29 oktober 2018
Eerst doorzocht ik de dataset via de website van de API. Daar haalde ik de volgende interessante content uit:
- de beschrijvingen van kinderboeken (die waren grappig om te lezen)
- het aantal pagina's
- grote boeken vs kleine boeken
- kinderboeken over bijzondere onderwerpen (zoals diefstallen en gevangenis)

Verder kwamen de volgende vragen in me op:

Hoevaak is dit boek uitgeleend?
Helaas is het niet mogelijk om dit te achterhalen met deze API.

Wat is de drukplaats van het boek?
Dit valt te achterhalen met de API.

Worden boeken op de hoek van een kast sneller uitgeleend?

Worden bepaalde kookboeken in bepaalde seizoenen meer uitgeleend?

Helaas kan je niet weten hoe vaak iets is uitgeleend, alleen of het op dit
moment is uitgeleend en hoeveel exemplaren er zijn van het boek.

## Dag 2 - Dinsdag 30 oktober 2018

## Dag 3 - Woensdag 31 oktober 2018

Voorstel van stappenplan (via presentatie van Laurens):
- Doe een succesvolle request waaruit je JSON haalt
- Krijg een idee van de informatie die je uit de API kan halen.
- Verzin onderzoeksvragen en deelvragen
- Bedenk welke variabelen je nodig hebt
- Haal data uit de API en sla die op in jouw eigen "datastore"
- Doorzoek de data op patronen
- Visualiseer de patronen met D3

De applicatie heb ik opgezet door:
- Node.js en npm te installeren.
- een hele rits kleine applicaties te installeren in de map van mijn applicaties
- index.js, .gitignore .env, .oba-api.js van slack te halen
- applicatie op te zetten dmv npm init --yes
- nodemon installeren en een kort terminal scriptje te schrijven voor nodemon in package.json
- in de terminal de applicatie te starten met npm run start
- de zoekopdracht aan te passen in index.js
- in de Google Chrome met een JSON plugin de JSON te bekijken.

Ik heb de applicatie vandaag proberen op te zetten en een aantal zoekopdrachten proberen te doen. De volgende is gelukt:

```
  obaApi.get('search', {
  q: 'classification:prentenboek diefstallen',
  refine: true,
  facet: 'topic(diefstallen)'
```

Dit komt van de URL: https://zoeken.oba.nl/api/v1/search/?q=classification:prentenboek%20diefstallen&pagesize=10&authorization=1e19898c87464e239192c8bfe422f280&facet=topic(diefstallen)

## Dag 4 - Donderdag 1 november 2018

Vandaag ben ik van plan om mijn onderzoeksvraag uit te werken en deelvragen op te stellen.

Mijn mogelijke onderwerpen zijn prentenboeken en de onderwerpen van prentenboeken.

Wat voor vraag kan je bij deze onderwerpen bedenken?

Interessante data die zijn vastgelegd over deze boeken zijn:
- titel
- auteur
- publicatiejaar
- cover thumbnail
- plaats uitgever
- onderwerpen
- samenvatting boek

Wat mij opvalt is dat er mooie informatie staat beschreven in de samenvatting van het boek.
Dit staat telkens in de laatste zin van de beschrijving. In veel van de gevallen komt dit na de woorden "prentenboek met". Daarna staat telkens een beschrijving van de type illustraties.

Dit is de hele samenvatting:

"Schatje en Scheetje hebben sokken gestolen. Daarom zitten ze vast in een donkere kerker. Scheetje wil hun gevangenis een beetje opfleuren en regelt een stukje zee en zon voor zijn liefste Schatje. Prentenboek met paginagrote kleurenillustraties. Vanaf ca. 4 jaar."

Dan kijken we naar de laatste zin:

"Prentenboek met paginagrote kleurenillustraties. Vanaf ca. 4 jaar."

Hieronder de zinnen van de eerste twintig zoekresultaten bij prentenboeken. Daarbij maak ik gebruik van de volgende code:

```
obaApi.get('search', {
  q: 'classification:prentenboek',
  refine: true
}, 'summary').then(response => {
```

1. Sfeervol prentenboek met duidelijke, eenvoudige illustraties in kleur.
2. Prentenboek met grote kleurrijke afbeeldingen in waterverf en krijt.
3. Sfeervol prentenboek met waterverfillustraties waarop glitterende hologrammen zijn aangebracht.
4. Prentenboek met eenvoudige tekeningen in kleur.

We kunnen deze zinnen uit de hele samenvatting filteren door middel van de volgende technieken:

- De tekst "prentenboek met", "*boek met", of "met" herkennen en de rest van de zin erna opslaan.
- Deze zinnen zijn telkens de voorlaatste zin in de samenvatting, dus herkennen laatste zin en dan de zin ervoor opslaan. De laatste zin is telkens: "Vanaf ca. x jaar"

Vervolgens moet de onnodige tekst uit de zinnen gefilterd worden. Eerst "prentenboek met", "boek met" en "met".

Daarna leestekens en "stating-the-obvious"-woorden zoals:
- "in kleur"
- "in"
- "en"
- "waarop"
- "zijn"
- "aangebracht"
- "op"
- "uit"

Ik twijfel nog over of de volgende woorden van toegevoegde waarde zijn of niet:
- "illustraties"
- "afbeeldingen"
- "tekeningen"

1. Sfeervol duidelijke eenvoudige illustraties
2. grote kleurrijke afbeeldingen waterverf krijt
3. Sfeervol waterverfillustraties glitterende hologrammen
4. eenvoudige tekeningen
5. krachtige illustraties
6. sfeervolle zachtgetinte waterverfillustraties
7. kleurrijke gedetailleerde zoekplaten vol losse figuren voorwerpen diverse zoekopdrachten
8. sfeervolle aquarellen
9. Hardkartonnen kleurrijke tekeningen tekst rijm
10. paginagrote illustraties vrolÐke kleuren
11. grote aquarellen
12. kleurige illustraties enkele regels tekst
13. paginagrote kleurenillustraties in zachte tinten
14. omkaderde kleurenillustraties diverse boeken over Kikker
15. kleurige illustraties in collagetechniek en een eenvoudig verhaal over de wisseling der seizoenen
16. Hardkartonnen kleurrijke tekeningen en tekst op rijm
17. grote, eenvoudige illustraties in sobere kleuren
18. grote illustraties
19. zachtgekleurde illustraties
20. paginagrote kleurenillustraties

Dit moet leiden tot de volgende classificaties. Daarvoor moeten:
- achtervoegsels en vervoegingen van woorden worden weggewerkt
- woorden worden weggehaald die de inhoud beschrijven en niet de vorm.

1. sfeervol duidelijk eenvoudig | illustratie
2. groot kleurrijk | afbeeldingen waterverf krijt
3. sfeervol glitterend hologrammen | waterverf illustraties
4. eenvoudig | tekeningen
5. krachtig | illustraties
6. sfeervol zachtgetint | waterverf illustraties
7. kleurrijk gedetailleerd | zoekplaten
8. sfeervol | aquarellen
9. kleurrijk | tekeningen
10. paginagroot vrolijk | illustraties
11. groot | aquarellen
12. kleurrijk | illustraties
13. paginagroot kleurrijk zachtgetint | illustraties
14. omkaderd kleurrijk | illustraties
15. kleurrijk | illustraties collagetechniek
16. kleurrijk | tekeningen
17. groot eenvoudige sober | illustraties
18. groot | illustraties
19. zachtgekleurd | illustraties
20. paginagroot kleurrijk | illustraties

Lijst met onderwerpen van alle prentenboeken.

1. winter vriendschap
2. verliefdheid
3. vriendschap eenzaamheid buitenstaanders
4. verjaardagen vriendschap
5. vriendschap
6. angsten slapen
7. boerderijen zoekboeken
8. buitenstaanders vriendschap discriminatie
9. angsten rijmvertellingen repeteerverhalen
10. anders zijn pesten
11. heimwee lichamelijk gehandicapten vriendschap grootouders
12. heimwee reizen vriendschap
13. verdwalen
14. abc-boeken
15. natuur seizoenen
16. angsten rijmvertellingen
17. gezin
18. gezin
19. anders zijn heksen
20. liefde diefstallen

De stijlen en de onderwerpen vind ik beide mooie termen opleveren die een indruk geven van het prentenboek.

Vragen die in me op komen zijn:

Welke grote categorieën zijn er te vinden op het gebied van onderwerp en stijl?
Wat is de frequentie waarin alle onderwerpen en stijlen voorkomen?

Het is bijna net zoals wijn. Daar heb je ook grote wijncategorieën en smaakbeschrijvingen. Er is een (grote) categorie als een bepaald type prentenboek heel vaak voorkomt met een bepaalde combinatie aan onderwerpen / stijlen.

Ik twijfel over hoe dit gevisualiseerd moet worden en in hoeverre er patronen kunnen worden gezien.

Hoe zijn top 10 meest voorkomende onderwerpen van prentenboeken veranderd in de afgelopen 10 jaar?
Hiervoor zijn de volgende dingen nodig: publicatiejaar, onderwerp.

Je maakt een lijst van alle prentenboeken uit een bepaald jaar. Zet daarvan alle onderwerpen in een array met twee waarde onderwerp en count. De 10 onderwerpen die het meest voorkomen zet je in een aparte array.

Hoofdvraag: Hoe zijn top 10 meest voorkomende onderwerpen van prentenboeken veranderd in de afgelopen 10 jaar?
Deelvragen:
- Wat zijn alle onderwerpen in 2018, 2017, enz.?
- Hoevaak komt elk onderwerp voor?

To-do:
- zoekopdracht doen van prentenboeken uit 2018
- onderwerpen van elk boek in de console zetten
- dit in een array zetten

Dit is de zoekopdracht die de onderwerpen van de boeken geeft uit een bepaald jaar:

```
obaApi.get('search', {
  q: 'classification:prentenboek ',
  refine: true,
  facet: 'pubyear(2017)'
}, 'subjects').then(response => {
```

Dan is dit mijn resultaat in de browser:

```
{
  "data": [
    [
      {
        "topical-subject": [
          {
            "_": "Boerderijen",
            "$": {
              "translation": "Onderwerp",
              "search-method": "subject",
              "search-term": "Boerderijen",
              "search-type": "fuzzy"
            }
          },
          {
            "_": "Zoekboeken",
            "$": {
              "translation": "Onderwerp",
              "search-method": "subject",
              "search-term": "Zoekboeken",
              "search-type": "fuzzy"
            }
          }
        ]
      }
    ]
```

Hoe moet ik mijn code zo aanpassen dat hier alleen de search-term uitkomt?

En dit in de terminal:

```
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ],
 [ [Object] ] ]
```

Wat moet ik toevoegen zodat hier op elke rij een array komt van het onderwerp van het boek?

```
obaApi.get('search', {
  q: 'classification:prentenboek ',
  refine: true,
  librarian: true,
  facet: 'pubyear(2018)'
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
```

Nu hebben we een lijst van onderwerpen:

```
[ 'Angsten',
  'Vriendschap',
  'Anders zijn',
  'Ridders',
  'Vooroordelen',
  'Reizen',
  'Boosheid',
  'Eten',
  'Kalender',
  'Dinosaurussen',
  'Fantasiewezens',
  'Angsten',
  'Monsters',
  'Pasen',
  'Maan',
  'Zeerovers',
  'Katten',
  'Slapengaan',
  'Delen',
  'Pasen' ]
```
