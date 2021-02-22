//import axios from "axios";

/*async function fetchDataNew() {
    try {
        const result = await axios.get('https://restcountries.eu/rest/v2/all');
        return result;
    } catch (e) {
        console.error(e);
    }
}

fetchDataNew();

function fetchDataOld() {
    axios.get('https://restcountries.eu/rest/v2/all')
        .then((result) => {
            return console.log(result);
        }).catch((e) => {
        return console.error(e);
    });
}

fetchDataOld();

function getCountryInfo(result){
    const countryName = result.data[0].name
}
*/

// sla de referentie op naar de zoek-button en zet er een event listener op die getCountryData aanroept
const button = document.getElementById('search-button');
button.addEventListener('click', getCountryData);

// sla de referentie op naar het input-veld en zet er een event listener op die setQuery aanroept
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('keyup', setQuery)

// sla de referentie naar het "anker" element op waarin we alle landen gaan toevoegen
const countryContainer = document.getElementById('countries');

// maak query een globale variabele, zodat we deze zowel in de setQuery als in de getCountryData functie kunnen gebruiken
let query = '';

// geef het event object mee en haal de waarde eruit. Als er op 'enter' gedrukt wordt,
function setQuery(e) {
  query = e.target.value;
  if (e.keyCode === 13) {
    getCountryData();
  }
}

async function getCountryData() {
  // zorg ervoor dat als er een request gemaakt wordt, het zoekveldt leeggemaakt wordt
  searchBar.value = '';

  // sla de referentie naar onze error-message op en haal de tekst weg bij elke nieuwe zoekopdracht
  // (als er iets mis gaat, wordt 'ie in het catch blok opnieuw toegevoegd)
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = '';

  // sla de referentie op naar de country-container waarin de informatie van een land staat
  const previousSearchResult = document.getElementById('country');
  // als deze referentie bestaat (en er dus al een land op de pagina wordt weergegeven) dan halen we deze eerst weg
  if (previousSearchResult) {
    countryContainer.removeChild(previousSearchResult);
  }

  try {
    // maak een GET request naar het endpoint en voeg de searchquery als dynamische parameter in
    const result = await axios.get(`https://restcountries.eu/rest/v2/name/${query}?fullText=true`);
    // haal het land-object uit de response
    const countryInfo = result.data[0];

    console.log(result);

    // maak een country-container en geef hem de id country
    // (zodat we 'm de volgende keer kunnen herkennen en kunnen checken of er al een land op de pagina staat)
    const country = document.createElement('div');
    country.setAttribute('id', 'country');

    // maak de <img> tag om de vlag in weer te geven
    const flag = document.createElement('img');
    // stop de image url in het src attribuut van img
    flag.setAttribute('src', countryInfo.flag);
    country.appendChild(flag);

    // maak <h1> element voor de titel
    const countryName = document.createElement('h1');
    countryName.textContent = countryInfo.name;
    country.appendChild(countryName);

    // maak een <p> voor de informatie
    const population = document.createElement('p');
    population.textContent = `${countryInfo.name} is situated in ${countryInfo.subregion}. It has a population of ${countryInfo.population} people.`;
    country.appendChild(population);

    // maak een <p> voor nog meer informatie
    const capital = document.createElement('p');
    capital.textContent = `The capital is ${countryInfo.capital} and you can pay with ${createCurrencyDescription(countryInfo.currencies)}`;
    country.appendChild(capital);

    // maak een <p> voor de talen
    const languages = document.createElement('p');
    languages.textContent = createLanguageDescription(countryInfo.languages);
    country.appendChild(languages);

    // voeg de country <div> toe aan de countryContainer
    countryContainer.appendChild(country);
  } catch(e) {
    console.error(e);
    errorMessage.textContent = `${query} bestaat niet. Probeer het opnieuw!`;
  }
}

function createLanguageDescription(languages) {
  let output = 'They speak ';

  for (let i = 0; i < languages.length; i++) {
    // als dit de laatste entry is, voeg dan " and " toe
    if (i === languages.length - 1) {
      // de return zorgt ervoor dat er niet meer naar de andere if-statements gekeken wordt
      return output = output + " and " + languages[i];
    }
    // als de array sowieso maar twee talen bevat of we zijn bij de één-na-laatste naam, voeg dan alleen de taal toe
    if (languages.length === 2 || i === languages.length - 2) {
      output = output + languages[i];
    } else {
      // in andere alle gevallen voegen we een komma en spatie toe
      output = output + languages[i] + ", ";
    }
  }

  return output;
}

function createCurrencyDescription(currencies) {
  let output = 'and you can pay with ';

  if (currencies.length === 2) {
    return output + `${currencies[0]} and ${currencies[1]}'s`;
  }

  return output + `${currencies[0]}'s`;
}

