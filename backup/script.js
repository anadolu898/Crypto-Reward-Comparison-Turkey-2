// JavaScript code to populate the table with crypto rewards data
const rewardsData = [
    { platform: 'BtcTurk', apy: '8%', campaign: 'Welcome Bonus', minStaking: '100 USDT' },
    { platform: 'Paribu', apy: '7.5%', campaign: 'Referral Program', minStaking: '50 USDT' },
    // Add more data as needed
];

const table = document.getElementById('rewardsTable');

// Add table headers
const headerRow = document.createElement('tr');
headerRow.innerHTML = '<th>Platform</th><th>APY</th><th>Campaign</th><th>Minimum Staking</th>';
table.appendChild(headerRow);

// Add table rows for each data entry
rewardsData.forEach(data => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${data.platform}</td><td>${data.apy}</td><td>${data.campaign}</td><td>${data.minStaking}</td>`;
    table.appendChild(row);
});
