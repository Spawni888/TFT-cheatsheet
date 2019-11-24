'use strict';
const request = require('request-promise');
const { JSDOM } = require('jsdom');

module.exports = {
    getParser
};

async function getParser(ctx) {
    const htmlProbabilities = await request('https://lolchess.gg/guide/reroll');
    const domProbabilities = new JSDOM(htmlProbabilities);
    const table = domProbabilities.window.document.querySelector('table.reroll-latest');
    const chancesTable = [];

    const htmlExperience = await request('https://lolchess.gg/guide/exp');
    const domExperience = new JSDOM(htmlExperience);
    const experienceTable = domExperience.window.document.querySelectorAll('table.table tbody')[3];
    const lvlExperience = [];

    // Add tier and total count of this tier champions if pool
    table.querySelectorAll('th[class^="tier"]').forEach((th, i) => {
        const tier = th.innerHTML.match(/\bTier\d?\b/)[0].slice(-1);
        const total = th.innerHTML.match(/\(\d{1,2}\sTotal\b/)[0].match(/\d{1,2}/)[0];

        chancesTable.push({
            tier: parseInt(tier),
            total: parseInt(total)
        });
    });
    // Add probabilities of any tier at any lvl
    chancesTable.forEach(tierObj => {
        const tierChances = table.querySelectorAll(`tbody tr .tier${tierObj.tier}`);
        tierObj.lvlChances = [];


        tierChances.forEach((probabilityNode, index) => {

            let probability = probabilityNode.innerHTML.match(/\d+%\s/)[0].slice(0, -2) / 100;
            let lvl = index + 1;

            tierObj.lvlChances.push({
                lvl,
                probability
            });
        });
    });
    //Add count of champions of this tier that i know
    const count = [
        { tier: 1, count: 12 },
        { tier: 2, count: 12 },
        { tier: 3, count: 12 },
        { tier: 4, count: 9 },
        { tier: 5, count: 15 }
    ];
    count.forEach(countObj => {
       chancesTable.find(tierObj => tierObj.tier === countObj.tier).count = countObj.count;
    });
    // console.log(chancesTable);   RESULT


    //Add experience info
    experienceTable.querySelectorAll('td').forEach((td, index) => {
        if (!/\d+\sXP/.test(td.innerHTML)) {
            return;
        }
        const lvl = index + 1;
        const xp = td.innerHTML.match(/\d+\sXP/)[0].slice(0, -3);

        lvlExperience.push({
            lvl,
            xp: parseInt(xp)
        })
    });
    //console.log(lvlExperience);   RESULT

    ctx.body = { chancesTable, lvlExperience };
}
