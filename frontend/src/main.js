import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

$("#login-button").click(function(event) {
  event.preventDefault();

  $(".form").fadeOut(500);
  $(".wrapper").addClass("form-success");
  $(".hiddenBlock").delay(500).fadeIn(500);
});

$("#button").click(function(event) {
  event.preventDefault();

  $(".form").delay(500).fadeIn(500);
  $(".wrapper").removeClass("form-success");
  $(".hiddenBlock").fadeOut(500).delay(500);
});

const chancesTable = [
  {
    tier: 1,
    total: 29,
    count: 12,
    lvlChances: {
      '1': 1,
      '2': 1,
      '3': .7,
      '4': .5,
      '5': .35,
      '6': .25,
      '7': .2,
      '8': .15,
      '9': 10
    }
  },
  {
    tier: 2,
    total: 22,
    count: 12,
    lvlChances: {
      '1': 0,
      '2': 0,
      '3': .25,
      '4': .35,
      '5': .35,
      '6': .35,
      '7': .3,
      '8': .2,
      '9': 15
    }
  },
  {
    tier: 3,
    total: 16,
    count: 12,
    lvlChances: {
      '1': 0,
      '2': 0,
      '3': .05,
      '4': .15,
      '5': .25,
      '6': .30,
      '7': .33,
      '8': .35,
      '9': 30
    }
  },
  {
    tier: 4,
    total: 12,
    count: 9,
    lvlChances: {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': .05,
      '6': .1,
      '7': .15,
      '8': .24,
      '9': 30
    }
  },
  {
    tier: 5,
    total: 10,
    count: 15,
    lvlChances: {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': .02,
      '8': .06,
      '9': .15
    }
  },
];

const lvlExperience = [0, 2, 6, 10, 20, 32, 50, 66];
const total = 1062;

function getOneOrMoreCurrent(tier, lvl) {
  const pool = chancesTable.find(item => item.tier === tier);
  const probability = pool.lvlChances[lvl] * 5;
  const currentTierChamps = pool.count;

  return probability / currentTierChamps;
}


function compareProbabilities(tier, lvl, xp) {
  const currentLvlProbability = getOneOrMoreCurrent(tier, lvl);
  const nextLvlProbability = getOneOrMoreCurrent(tier, lvl + 1);

  let neededGold = Math.ceil((lvlExperience[lvl - 1] - xp) / 4);
  console.log(neededGold);
  const canRollCount = neededGold / 2;
  const x = (currentLvlProbability * canRollCount) / (nextLvlProbability - currentLvlProbability);
  neededGold += (x * 2);

  neededGold = Math.round(neededGold);
  if (neededGold < 0 || isNaN(neededGold)) {
    appendNewNodeWithText('SO RETARDED QUESTION BRO. REALLY. STOP!!!!');
    console.log('useless question');
  }
  else {
    console.log(neededGold + '+  - LEVEL UP');
    appendNewNodeWithText('If u have more than ' + neededGold + ' u can level up');
  }

}

function appendNewNodeWithText(text) {
  const newNode = document.createElement('H2');
  const parentNode = document.body.querySelector('.hiddenText');

  newNode.innerText = text;
  newNode.classList.add('hiddenText');
  parentNode.appendChild(newNode);
}

function startCompare() {
  const tier = parseInt(document.getElementById('tier').value);
  const lvl = parseInt(document.getElementById('lvl').value);
  const xp =  parseInt(document.getElementById('xp').value);
  const parentNode = document.body.querySelector('.hiddenText');
  $(".hiddenText").empty();

  if (tier > 5 || tier < 1 || isNaN(tier)) {
    appendNewNodeWithText('Tier should be between 1 and 5');
    console.log('Tier should be between 1 and 5');
  }
  if (lvl > 8 || lvl < 1 || isNaN(lvl)) {
    appendNewNodeWithText('Lvl should be between 1 and 8');
    console.log('Lvl should be between 1 and 8');
  }
  if (xp > 66 || xp < 0 || (xp % 2 > 0) || isNaN(xp)) {
    appendNewNodeWithText('Xp should be an even number between 0 and 66');
    console.log('Xp should be an even number between 0 and 66');
  }

  if (parentNode.innerText) {
    return;
  }

  compareProbabilities(tier, lvl, xp);
}







