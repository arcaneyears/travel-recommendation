const searchInput = document.getElementById('searchInput');
const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');
const resultsDiv = document.getElementById('results');

let travelData = null;

// Fetch data from the JSON "API"
fetch('travel_recommendation_api.json', { cache: 'no-store' })
  .then(response => response.json())
  .then(data => {
    travelData = data;
    console.log('Travel data loaded:', data);
  })
  .catch(error => console.error('Error fetching data:', error));

function getLocalTime(timeZone) {
  if (!timeZone) return '';
  const options = { timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Date().toLocaleTimeString('en-US', options);
}

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'result-card';
  const time = item.timeZone ? `<p class="time">Current local time: ${getLocalTime(item.timeZone)}</p>` : '';
  card.innerHTML = `
    <img src="${item.imageUrl}" alt="${item.name}">
    <div class="info">
      <h3>${item.name}</h3>
      ${time}
      <p>${item.description}</p>
      <button class="visit">Visit</button>
    </div>`;
  return card;
}

function search() {
  const keyword = searchInput.value.trim().toLowerCase();
  resultsDiv.innerHTML = '';
  if (!keyword) return;
  if (!travelData) {
    resultsDiv.innerHTML = '<p class="no-result">Data is still loading, please try again.</p>';
    return;
  }

  let items = [];
  if (['beach', 'beaches'].includes(keyword)) {
    items = travelData.beaches;
  } else if (['temple', 'temples'].includes(keyword)) {
    items = travelData.temples;
  } else if (['country', 'countries'].includes(keyword)) {
    travelData.countries.forEach(country => {
      const title = document.createElement('h2');
      title.className = 'country-title';
      title.textContent = country.name;
      resultsDiv.appendChild(title);
      country.cities.forEach(city => resultsDiv.appendChild(createCard(city)));
    });
    return;
  } else {
    // Search by a specific country name (e.g. "japan")
    const country = travelData.countries.find(c => c.name.toLowerCase() === keyword);
    if (country) items = country.cities;
  }

  if (items.length === 0) {
    resultsDiv.innerHTML = '<p class="no-result">No recommendations found. Try "beach", "temple" or "country".</p>';
    return;
  }
  items.forEach(item => resultsDiv.appendChild(createCard(item)));
}

function clearResults() {
  searchInput.value = '';
  resultsDiv.innerHTML = '';
}

btnSearch.addEventListener('click', search);
btnClear.addEventListener('click', clearResults);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
