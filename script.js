const teams = ['Widex Munch', 'Momentum', 'Rossing Racing', 'Team TBD', 'DTU'];

let results = {};

// Initialize the results object with null values
teams.forEach(team => {
    results[team] = {};
    teams.forEach(opponent => {
        results[team][opponent] = null;
    });
});

const completedRaces = [
    { winner: 'DTU', loser: 'Team TBD' },
    { winner: 'Momentum', loser: 'DTU' },
    { winner: 'Momentum', loser: 'Team TBD' },
    { winner: 'Rossing Racing', loser: 'DTU' },
    { winner: 'Rossing Racing', loser: 'Team TBD' },
    { winner: 'Rossing Racing', loser: 'Xavier' },
    { winner: 'Rossing Racing', loser: 'Mo' },
    { winner: 'Rossing Racing', loser: 'Morten' },
    { winner: 'Rossing Racing', loser: 'Rikke' },
    { winner: 'Morten', loser: 'Xavier' },
    { winner: 'Momentum', loser: 'Xavier' },
    { winner: 'Momentum', loser: 'Rikke' },
    { winner: 'Rikke', loser: 'Xavier' }
];

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

function updateResults() {
    completedRaces.forEach(race => {
        results[race.winner][race.loser] = 1;
        results[race.loser][race.winner] = 0;
    });
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
            ${teams.map(opponent => `<td>${results[team][opponent] !== null ? results[team][opponent] : ''}</td>`).join('')}
            <td>${percentages[team].toFixed(2)}%</td>
            <td>${rankings[team]}</td>
        `;
        tbody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateResults(); // Update results based on completed races
    populateResults(); // Populate the table with updated results
});
