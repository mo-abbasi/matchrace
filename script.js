const results = [
    { race: 1, widex: '1st', momentum: '2nd', rossing: '3rd', tbd: '4th', dtu: '5th' },
    { race: 2, widex: '3rd', momentum: '1st', rossing: '2nd', tbd: '5th', dtu: '4th' },
    { race: 3, widex: '2nd', momentum: '4th', rossing: '1st', tbd: '3rd', dtu: '5th' },
    { race: 4, widex: '4th', momentum: '3rd', rossing: '5th', tbd: '1st', dtu: '2nd' }
];

function populateResults() {
    const tbody = document.getElementById('results-body');
    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.race}</td>
            <td>${result.widex}</td>
            <td>${result.momentum}</td>
            <td>${result.rossing}</td>
            <td>${result.tbd}</td>
            <td>${result.dtu}</td>
        `;
        tbody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', populateResults);
