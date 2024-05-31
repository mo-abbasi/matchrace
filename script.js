let teams = [];
let results = {};
let completedRaces = [];

async function fetchData() {
    const response = await fetch('eventData.json');
    const data = await response.json();
    return data;
}

function initializeResults() {
    teams.forEach(team => {
        results[team] = {};
        teams.forEach(opponent => {
            results[team][opponent] = null;
        });
    });
}

function updateResults() {
    completedRaces.forEach(race => {
        results[race.winner][race.loser] = 1;
        results[race.loser][race.winner] = 0;
    });
}

function calculateWinCounts() {
    const winCounts = {};
    teams.forEach(team => {
        winCounts[team] = 0;
    });

    completedRaces.forEach(race => {
        winCounts[race.winner]++;
    });

    return winCounts;
}

function calculateWinPercentage() {
    const winCounts = calculateWinCounts();
    const matchCounts = {};
    teams.forEach(team => {
        matchCounts[team] = completedRaces.filter(race => race.winner === team || race.loser === team).length;
    });

    const percentages = {};
    teams.forEach(team => {
        percentages[team] = matchCounts[team] > 0 ? (winCounts[team] / matchCounts[team]) * 100 : 0;
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
    const percentages = calculateWinPercentage();
    const rankings = calculateRankings(percentages);

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
        completedRaces.push({ winner, loser });
        updateResults();
        populateResults();
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

    document.getElementById('event-title').textContent = eventName;
    document.getElementById('event-heading').textContent = eventName;
    
    initializeResults();
    updateResults();
    populateResults();
    populateForm();
    
    document.getElementById('setup-form').style.display = 'none';
    document.getElementById('race-form').style.display = 'block';
    document.querySelector('table').style.display = 'table';
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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await fetchData();
        document.getElementById('event-title').textContent = data.eventName;
        document.getElementById('event-heading').textContent = data.eventName;
        teams = data.teams;
        completedRaces = data.completedRaces;

        initializeResults();
        updateResults();
        populateResults();
        populateForm();
        
        document.getElementById('setup-form').style.display = 'none';
        document.getElementById('race-form').style.display = 'block';
        document.querySelector('table').style.display = 'table';
    } catch (error) {
        document.getElementById('setup-form').style.display = 'block';
        document.getElementById('race-form').style.display = 'none';
        document.querySelector('table').style.display = 'none';
    }
    
    document.getElementById('setup-form').addEventListener('submit', setupEvent);
    document.getElementById('race-form').addEventListener('submit', addRaceResult);
    document.getElementById('add-team').addEventListener('click', addTeamInput);
});
