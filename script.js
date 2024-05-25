const teams = ['Widex Munch', 'Momentum', 'Rossing Racing', 'Team TBD', 'DTU'];
const results = {
    'Widex Munch': { 'Momentum': 0, 'Rossing Racing': 0, 'Team TBD': 0, 'DTU': 0 },
    'Momentum': { 'Widex Munch': 0, 'Rossing Racing': 0, 'Team TBD': 0, 'DTU': 1 },
    'Rossing Racing': { 'Widex Munch': 0, 'Momentum': 0, 'Team TBD': 0, 'DTU': 1 },
    'Team TBD': { 'Widex Munch': 0, 'Momentum': 0, 'Rossing Racing': 0, 'DTU': 0 },
    'DTU': { 'Widex Munch': 0, 'Momentum': 0, 'Rossing Racing': 0, 'Team TBD': 0 }
};

// Results based on matches
results['DTU']['Team TBD'] = 1; // Rikke (DTU) won against Xavier (Team TBD)
results['Momentum']['DTU'] = 1; // Mo (Momentum) won against Rikke (DTU)
results['Momentum']['Team TBD'] = 1; // Mo (Momentum) won against Xavier (Team TBD)
results['Rossing Racing']['DTU'] = 1; // Matias (Rossing Racing) won against Rikke (DTU)

function calculateWinPercentage() {
    const percentages = {};
    for (let team in results) {
        const matches = Object.keys(results[team]).length;
        const wins = Object.values(results[team]).reduce((sum, win) => sum + win, 0);
        percentages[team] = (wins / matches) * 100;
    }
    return percentages;
}

function calculateRankings(percentages) {
    const teamsByWinPercentage = Object.entries(percentages)
        .sort(([, a], [, b]) => b - a)
        .map(([team]) => team);
    return teamsByWinPercentage;
}

function populateResults() {
    const tbody = document.getElementById('results-body');
    const percentages = calculateWinPercentage();
    const rankings = calculateRankings(percentages);

    teams.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team}</td>
            ${teams.map(opponent => `<td>${results[team][opponent] !== undefined ? results[team][opponent] : ''}</td>`).join('')}
            <td>${percentages[team].toFixed(2)}%</td>
        `;
        tbody.appendChild(row);
    });

    const rankRow = document.getElementById('rank-row');
    rankRow.innerHTML = `<th>Ranking</th><td colspan="6">${rankings.join(', ')}</td>`;
}

document.addEventListener('DOMContentLoaded', populateResults);
