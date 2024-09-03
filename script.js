let teams = [];
let results = {};
let completedRaces = [];
let events = {};

const EVENTS_KEY = 'matchRaceEvents';

function saveEvents() {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    console.log('Events saved successfully', events);
}

function loadEvents() {
    const storedEvents = localStorage.getItem(EVENTS_KEY);
    if (storedEvents) {
        events = JSON.parse(storedEvents);
        console.log('Events loaded successfully', events);
        displayEventsList();
    } else {
        console.log('No events found in storage');
    }
}

function initializeResults() {
    teams.forEach(team => {
        results[team] = {};
        teams.forEach(opponent => {
            results[team][opponent] = null;
        });
    });
    console.log('Results initialized', results);
}

function updateResults() {
    initializeResults();
    completedRaces.forEach(race => {
        results[race.winner][race.loser] = 1;
        results[race.loser][race.winner] = 0;
    });
    console.log('Results updated', results);
}

function calculateWinPercentage() {
    const percentages = {};

    teams.forEach(team => {
        let wins = 0;
        let completedMatches = 0;

        teams.forEach(opponent => {
            if (results[team][opponent] !== null) {
                completedMatches++;
                if (results[team][opponent] === 1) {
                    wins++;
                }
            }
        });

        percentages[team] = completedMatches > 0 ? (wins / completedMatches) * 100 : 0;
    });

    return percentages;
}

function calculateRankings(percentages) {
    const sortedTeams = Object.keys(percentages).sort((a, b) => percentages[b] - percentages[a]);
    const rankings = {};
    sortedTeams.forEach((team, index) => {
        rankings[team] = index + 1;
    });
    return rankings;
}

function populateResults() {
    const tbody = document.getElementById('results-body');
    const headerRow = document.getElementById('header-row');
    const percentages = calculateWinPercentage();
    const rankings = calculateRankings(percentages);

    headerRow.innerHTML = '<th>Teams</th>' + teams.map(team => `<th>${team}</th>`).join('') + '<th>Win %</th><th>Rank</th>';
    tbody.innerHTML = ''; // Clear previous content

    teams.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team}</td>
            ${teams.map(opponent => {
                if (team === opponent) {
                    return `<td class="diagonal"></td>`;
                }
                return `<td>${results[team][opponent] !== null ? results[team][opponent] : ''}</td>`;
            }).join('')}
            <td>${percentages[team].toFixed(2)}%</td>
            <td>${rankings[team]}</td>
        `;
        tbody.appendChild(row);
    });
}

function populateForm() {
    const winnerSelect = document.getElementById('winner');
    const loserSelect = document.getElementById('loser');

    winnerSelect.innerHTML = teams.map(team => `<option value="${team}">${team}</option>`).join('');
    loserSelect.innerHTML = teams.map(team => `<option value="${team}">${team}</option>`).join('');
}

function addRaceResult(event) {
    event.preventDefault();
    const winner = document.getElementById('winner').value;
    const loser = document.getElementById('loser').value;

    if (winner !== loser) {
        const newRace = { winner, loser };

        // Remove any existing race between these teams
        completedRaces = completedRaces.filter(r => !(r.winner === newRace.winner && r.loser === newRace.loser));

        // Add new result
        completedRaces.push(newRace);

        updateResults();
        populateResults();

        // Save updated results for the current event
        const currentEventName = document.getElementById('event-heading').textContent;
        events[currentEventName].completedRaces = completedRaces;
        saveEvents();
    } else {
        alert("Winner and loser cannot be the same team.");
    }
}

function setupEvent(event) {
    event.preventDefault();
    const eventName = document.getElementById('event-name').value;
    const teamInputs = document.querySelectorAll('.team-name');

    teams = Array.from(teamInputs).map(input => input.value).filter(name => name.trim() !== '');

    if (teams.length < 2) {
        alert("Please enter at least two teams.");
        return;
    }

    events[eventName] = { teams, completedRaces: [] };
    saveEvents();

    document.getElementById('event-title').textContent = eventName;
    document.getElementById('event-heading').textContent = eventName;

    initializeResults();
    updateResults();
    populateResults();
    populateForm();

    document.getElementById('setup-form').style.display = 'none';
    document.getElementById('race-form').style.display = 'block';
    document.querySelector('table').style.display = 'table';

    displayEventsList();
}

function addTeamInput() {
    const teamsContainer = document.getElementById('teams-container');
    const inputCount = teamsContainer.children.length;
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'team-name';
    newInput.placeholder = `Team ${inputCount + 1}`;
    teamsContainer.appendChild(newInput);
}

function displayEventsList() {
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '';
    Object.keys(events).forEach(eventName => {
        const eventItem = document.createElement('li');
        eventItem.textContent = eventName;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            delete events[eventName];
            saveEvents();
            displayEventsList();
        });

        eventItem.appendChild(deleteButton);
        eventItem.addEventListener('click', () => {
            loadEvent(eventName);
        });

        eventsList.appendChild(eventItem);
    });
}

function loadEvent(eventName) {
    const event = events[eventName];
    teams = event.teams;
    completedRaces = event.completedRaces;

    document.getElementById('event-title').textContent = eventName;
    document.getElementById('event-heading').textContent = eventName;

    initializeResults();
    updateResults();
    populateResults();
    populateForm();

    document.getElementById('setup-form').style.display = 'none';
    document.getElementById('race-form').style.display = 'block';
}

function fetchEventData() {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Use a CORS proxy
    const targetUrl = 'https://raw.githubusercontent.com/mo-abbasi/matchrace/master/data.json'; // URL of the raw data.json file

    showLoadingSpinner();

    fetch(proxyUrl + targetUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched Event Data:', data);
            loadEventData(data);
            hideLoadingSpinner();
        })
        .catch(error => {
            console.error('Error fetching event data:', error);
            alert('Failed to load event data from data.json');
            hideLoadingSpinner();
        });
}

function loadEventData(data) {
    events = data.events;
    teams = data.teams;
    completedRaces = data.completedRaces;

    initializeResults();
    updateResults();
    populateResults();
    populateForm();
    displayEventsList();
}

document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    displayEventsList();

    document.getElementById('setup-form').addEventListener('submit', setupEvent);
    document.getElementById('race-form').addEventListener('submit', addRaceResult);
    document.getElementById('add-team').addEventListener('click', addTeamInput);

    // Fetch event data when the page loads
    fetchEventData();
});
