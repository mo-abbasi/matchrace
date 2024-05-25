const teams = ['Widex Munch', 'Momentum', 'Rossing Racing', 'Team TBD', 'DTU'];
const results = {
    'Widex Munch': { 'Momentum': null, 'Rossing Racing': null, 'Team TBD': null, 'DTU': null },
    'Momentum': { 'Widex Munch': null, 'Rossing Racing': null, 'Team TBD': 1, 'DTU': 1 },
    'Rossing Racing': { 'Widex Munch': null, 'Momentum': null, 'Team TBD': null, 'DTU': 1 },
    'Team TBD': { 'Widex Munch': null, 'Momentum': 0, 'Rossing Racing': null, 'DTU': 0 },
    'DTU': { 'Widex Munch': null, 'Momentum': 0, 'Rossing Racing': 0, 'Team TBD': 1 }
};

const completedRaces = [
    { winner: 'DTU', loser: 'Team TBD' },   // Rikke (DTU) won against Xavier (Team TBD)
    { winner: 'Momentum', loser: 'DTU' },   // Mo (Momentum) won against Rikke (DTU)
    { winner: 'Momentum', loser: 'Team TBD' },  // Mo (Momentum) won against Xavier (Team TBD)
    { winner: 'Rossing Racing', loser: 'DTU' }  // Matias (Rossing Racing) won against Rikke (DTU)
];

function calculateWinPercentage() {
    const winCounts = {};
    const matchCounts = {};
    teams.forEach(team => {
        winCounts[team] = 0;
        matchCounts[team] = 0;
    });

    completedRaces.forEach(race => {
        winCounts[race.winner]++;
        matchCounts[race.winner]++;
        matchCounts[race.loser]++;
    });

    const percentages = {};
    teams.forEach(team => {
        percentages[team] = matchCounts[team] > 0 ? (winCounts[team] / matchCounts[team]) * 100 : 0;
    });

    return percentages;
}

function calculateRankings(percentages) {
    return Object.entries(percentages)
        .sort(([, a], [, b]) => b - a) // Sort by win percentage
        .map(([team], index) => [team, index + 1]); // Assign ranks
}

function populateResults() {
    const tbody = document.getElementById('results-body');
    const percentages = calculateWinPercentage();
    const rankings = calculateRankings(percentages);
    const rankingMap = {};
    rankings.forEach(([team, rank]) => {
        rankingMap[team] = rank;
    });

    teams.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team}</td>
            ${teams.map(opponent => `<td>${results[team][opponent] !== null ? results[team][opponent] : ''}</td>`).join('')}
            <td>${percentages[team].toFixed(2)}%</td>
            <td>${rankingMap[team]}</td>
        `;
        tbody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', populateResults);
