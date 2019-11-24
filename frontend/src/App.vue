<template>
    <div id="app">
        <div class="wrapper" :class="{'form-success': isReady}">
            <transition name="appear" mode="out-in">
                <div v-if="!pageLoaded" class="lds-roller" key="loadingCircle"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>

                <div v-else class="container" key="corePage">
                    <h1>Welcome</h1>
                        <transition name="appear">
                            <form key="form1" v-if="isReady" :class="[{'hide-this': !isReady}, 'hiddenBlock']" id="hiddenBlock" @submit.prevent>
                                <div class="hiddenText" id="hiddenText"></div>
                                <button type="submit" id="start-button" @click="back">Ok</button>
                            </form>
                            <form key="form2" v-else class="form" @submit.prevent>
                                <input type="number" placeholder="Tier" id="tier">
                                <input type="number" placeholder="LVL" id="lvl">
                                <input type="number" placeholder="XP" id="xp">
                                <button type="submit" id="back-button" @click="start">Ready</button>
                            </form>
                    </transition>
                </div>
            </transition>

            <ul class="bg-bubbles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <p class="creator">Created by Hui s Gory</p>
        </div>
    </div>
</template>

<script>
    import { chancesTable, lvlExperience } from './data/data.js';
    import axios from 'axios';

    export default {
        data: () => ({
            isReady: false,
            pageLoaded: false
        }),
        created() {
            axios.get('/parser')
                .then(res => {
                    this.chancesTable = res.data.chancesTable;
                    this.lvlExperience = res.data.lvlExperience;

                    console.log(this.chancesTable);
                    console.log(this.lvlExperience);

                    this.validateIncomeData();
                    this.pageLoaded = true;
                })
        },
        methods: {
            start() {
                this.isReady = true;
                this.startCompare();
            },
            back() {
                this.isReady = false;
            },
            getOneOrMoreCurrent(tier, lvl) {
                const pool = this.chancesTable.find(item => item.tier === tier);

                const probability = pool.lvlChances.find(tierChances => tierChances.lvl === lvl).probability * 5;
                const currentTierChamps = pool.count;

                return probability / currentTierChamps;
            },
            validateIncomeData() {
                //1 validate income data:
                this.chancesTable.forEach(tierObj => {
                    if (tierObj.lvlChances.length === 9) {
                        return;
                    }
                    tierObj.lvlChances = chancesTable.find(tierItem => tierItem.tier === tierObj.tier).lvlChances;
                });
                //2
                if (this.lvlExperience.length !== 7) {
                    this.lvlExperience = lvlExperience;
                }
            },
            getPossibleLvl(tier) {
                return this.chancesTable.find(tierObj => tierObj.tier === tier).lvlChances.filter(chanceItem => chanceItem.probability > 0)[0].lvl;
            },
            compareProbabilities(tier, lvl, xp) {
                let currentLvlProbability = this.getOneOrMoreCurrent(tier, lvl);
                let nextLvlProbability = this.getOneOrMoreCurrent(tier, lvl + 1);

                console.log('Current lvl probability: ' + currentLvlProbability);
                console.log('Next lvl probability: ' + nextLvlProbability);

                const maxXpAtCurrentLvl =  this.lvlExperience.find(expItem => expItem.lvl === lvl).xp;
                if (xp > maxXpAtCurrentLvl) {
                    this.appendNewNodeWithText(`You are a little liar! You can't have ${xp} XP at ${lvl} level!`);
                    this.appendNewNodeWithText(` Maximum XP at ${lvl} level is ${maxXpAtCurrentLvl} XP.`);
                    return;
                }

                if (currentLvlProbability <= 0 && nextLvlProbability <= 0) {
                    const possibleLvl = this.getPossibleLvl(tier);
                    const minProbability = Number(this.getOneOrMoreCurrent(tier, possibleLvl) / 100).toFixed(4);
                    this.appendNewNodeWithText(`You need ${possibleLvl} lvl to get it with ${minProbability}% probability. Lvl up!`);
                    return;
                }
                else if (currentLvlProbability === nextLvlProbability && currentLvlProbability !== 0) {
                    this.appendNewNodeWithText('Your lvl and next lvl have the same chances. Roll now!');
                    return;
                }

                let neededGold = Math.ceil((this.lvlExperience.find(lvlExp => parseInt(lvlExp.lvl) === lvl).xp - xp) / 4);

                const canRollCount = neededGold / 2;
                const x = (currentLvlProbability * canRollCount) / (nextLvlProbability - currentLvlProbability);
                neededGold += (x * 2);
                neededGold = Math.round(neededGold);

                this.appendNewNodeWithText('If you have more than ' + neededGold + ' gold level up and roll!');

            },
            appendNewNodeWithText(text) {
                const newNode = document.createElement('H2');
                const parentNode = document.body.querySelector('.hiddenText');

                newNode.innerText = text;
                newNode.classList.add('hiddenText');
                parentNode.appendChild(newNode);
                console.log(text);
            },
            removeChildrenNodes(node) {
                let child = node.lastElementChild;

                while (child) {
                    node.removeChild(child);
                    child = node.lastElementChild;
                }
            },
            startCompare() {
                const tier = parseInt(document.getElementById('tier').value);
                const lvl = parseInt(document.getElementById('lvl').value);
                const xp =  parseInt(document.getElementById('xp').value);
                let parentNode = document.body.querySelector('.hiddenText');


                if (tier > 5 || tier < 1 || isNaN(tier)) {
                    this.appendNewNodeWithText('Tier should be between 1 and 5');
                }
                if (lvl > 8 || lvl < 2 || isNaN(lvl)) {
                    this.appendNewNodeWithText('Lvl should be between 2 and 8');
                }
                if (xp > 64 || xp < 0 || (xp % 2 > 0) || isNaN(xp)) {
                    this.appendNewNodeWithText('Xp should be an even number between 0 and 64');
                }

                if (parentNode.innerText) {
                    return;
                }

                this.compareProbabilities(tier, lvl, xp);
            }
        }
    }
</script>

<style lang="scss">
    @font-face {
        font-family: 'Source Sans Pro';
        font-style: normal;
        font-weight: 200;
        src: local('Source Sans Pro ExtraLight'), local('SourceSansPro-ExtraLight'), url(https://fonts.gstatic.com/s/sourcesanspro/v13/6xKydSBYKcSV-LCoeQqfX1RYOo3i94_wlxdr.ttf) format('truetype');
    }
    @font-face {
        font-family: 'Source Sans Pro';
        font-style: normal;
        font-weight: 300;
        src: local('Source Sans Pro Light'), local('SourceSansPro-Light'), url(https://fonts.gstatic.com/s/sourcesanspro/v13/6xKydSBYKcSV-LCoeQqfX1RYOo3ik4zwlxdr.ttf) format('truetype');
    }
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-weight: 300;
    }
    body {
        font-family: 'Source Sans Pro', sans-serif;
        color: white;
        font-weight: 300;
    }
    .appear-enter {
        opacity: 0;
    }
    .appear-enter-active {
        transition: opacity 800ms;
        opacity: 0;
        /*animation: appear 2s;*/
    }
    .appear-enter-to {
        opacity: 1;
    }
    .appear-leave-active {
        opacity: 1;
        transition: opacity 800ms;
        /*animation: appear 2s reverse;*/

    }
    .appear-leave-to {
        opacity: 0;
    }

    /*@keyframes appear {*/
    /*    0% {*/
    /*        opacity: 0;*/
    /*    }*/
    /*    100% {*/
    /*        opacity: 1;*/
    /*    }*/
    /*}*/

    .hide-this {
        display: none;
    }
    .lds-roller {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
    }
    .lds-roller div {
        animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        transform-origin: 40px 40px;
    }
    .lds-roller div:after {
        content: " ";
        display: block;
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #fff;
        margin: -4px 0 0 -4px;
    }
    .lds-roller div:nth-child(1) {
        animation-delay: -0.036s;
    }
    .lds-roller div:nth-child(1):after {
        top: 63px;
        left: 63px;
    }
    .lds-roller div:nth-child(2) {
        animation-delay: -0.072s;
    }
    .lds-roller div:nth-child(2):after {
        top: 68px;
        left: 56px;
    }
    .lds-roller div:nth-child(3) {
        animation-delay: -0.108s;
    }
    .lds-roller div:nth-child(3):after {
        top: 71px;
        left: 48px;
    }
    .lds-roller div:nth-child(4) {
        animation-delay: -0.144s;
    }
    .lds-roller div:nth-child(4):after {
        top: 72px;
        left: 40px;
    }
    .lds-roller div:nth-child(5) {
        animation-delay: -0.18s;
    }
    .lds-roller div:nth-child(5):after {
        top: 71px;
        left: 32px;
    }
    .lds-roller div:nth-child(6) {
        animation-delay: -0.216s;
    }
    .lds-roller div:nth-child(6):after {
        top: 68px;
        left: 24px;
    }
    .lds-roller div:nth-child(7) {
        animation-delay: -0.252s;
    }
    .lds-roller div:nth-child(7):after {
        top: 63px;
        left: 17px;
    }
    .lds-roller div:nth-child(8) {
        animation-delay: -0.288s;
    }
    .lds-roller div:nth-child(8):after {
        top: 56px;
        left: 12px;
    }
    @keyframes lds-roller {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    body ::-webkit-input-placeholder {
        /* WebKit browsers */
        font-family: 'Source Sans Pro', sans-serif;
        color: white;
        font-weight: 300;
    }
    body :-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        font-family: 'Source Sans Pro', sans-serif;
        color: white;
        opacity: 1;
        font-weight: 300;
    }
    body ::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        font-family: 'Source Sans Pro', sans-serif;
        color: white;
        opacity: 1;
        font-weight: 300;
    }
    body :-ms-input-placeholder {
        /* Internet Explorer 10+ */
        font-family: 'Source Sans Pro', sans-serif;
        color: white;
        font-weight: 300;
    }
    html, body {margin: 0; height: 100%; overflow: hidden}
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        margin: 0;
    }
    .hiddenBlock {
        -webkit-transform: translateY(85px);
        transform: translateY(85px);
        transition: all 500ms;
    }
    .hiddenText {
        margin-bottom: 20px;
    }

    .creator {
        width: 100%;
        position: absolute;
        bottom: 20px;
        text-align: end;
        padding-right: 20px;
    }
    .wrapper {
        background: #50a3a2;
        background: linear-gradient(to bottom right, #50a3a2 0%, #53e3a6 100%);
        width: 100%;
        height: 100vh;
        overflow: hidden;
    }

    .wrapper.form-success .container h1 {
        transform: translateY(85px);
    }
    .wrapper.form-success .form{
        transition-delay: 500ms;
        display: none;
    }
    .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 80px 0;
        height: 400px;
        text-align: center;
    }
    .container h1 {
        font-size: 40px;
        transition-duration: 1s;
        transition-timing-function: ease-in-put;
        font-weight: 200;
    }

    form {
        padding: 20px 0;
        position: relative;
        z-index: 2;
    }
    form input {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        outline: 0;
        border: 1px solid rgba(255, 255, 255, 0.4);
        background-color: rgba(255, 255, 255, 0.2);
        width: 250px;
        border-radius: 3px;
        padding: 10px 15px;
        margin: 0 auto 10px auto;
        display: block;
        text-align: center;
        font-size: 18px;
        color: white;
        transition-duration: 0.25s;
        font-weight: 300;
    }
    form input:hover {
        background-color: rgba(255, 255, 255, 0.4);
    }
    form input:focus {
        background-color: white;
        width: 300px;
        color: #53e3a6;
    }
    form button {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        outline: 0;
        background-color: white;
        border: 0;
        padding: 10px 15px;
        color: #53e3a6;
        border-radius: 3px;
        width: 250px;
        cursor: pointer;
        font-size: 18px;
        transition-duration: 0.25s;
    }
    form button:hover {
        background-color: #f5f7f9;
    }

    .form {
        transition: display 500ms;
    }
    .bg-bubbles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }
    .bg-bubbles li {
        position: absolute;
        list-style: none;
        display: block;
        width: 40px;
        height: 40px;
        background-color: rgba(255, 255, 255, 0.15);
        bottom: -160px;
        -webkit-animation: square 25s infinite;
        animation: square 25s infinite;
        transition-timing-function: linear;
    }
    .bg-bubbles li:nth-child(1) {
        left: 10%;
    }
    .bg-bubbles li:nth-child(2) {
        left: 20%;
        width: 80px;
        height: 80px;
        -webkit-animation-delay: 2s;
        animation-delay: 2s;
        -webkit-animation-duration: 17s;
        animation-duration: 17s;
    }
    .bg-bubbles li:nth-child(3) {
        left: 25%;
        -webkit-animation-delay: 4s;
        animation-delay: 4s;
    }
    .bg-bubbles li:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        -webkit-animation-duration: 22s;
        animation-duration: 22s;
        background-color: rgba(255, 255, 255, 0.25);
    }
    .bg-bubbles li:nth-child(5) {
        left: 70%;
    }
    .bg-bubbles li:nth-child(6) {
        left: 80%;
        width: 120px;
        height: 120px;
        -webkit-animation-delay: 3s;
        animation-delay: 3s;
        background-color: rgba(255, 255, 255, 0.2);
    }
    .bg-bubbles li:nth-child(7) {
        left: 32%;
        width: 160px;
        height: 160px;
        -webkit-animation-delay: 7s;
        animation-delay: 7s;
    }
    .bg-bubbles li:nth-child(8) {
        left: 55%;
        width: 20px;
        height: 20px;
        -webkit-animation-delay: 15s;
        animation-delay: 15s;
        -webkit-animation-duration: 40s;
        animation-duration: 40s;
    }
    .bg-bubbles li:nth-child(9) {
        left: 25%;
        width: 10px;
        height: 10px;
        -webkit-animation-delay: 2s;
        animation-delay: 2s;
        -webkit-animation-duration: 40s;
        animation-duration: 40s;
        background-color: rgba(255, 255, 255, 0.3);
    }
    .bg-bubbles li:nth-child(10) {
        left: 90%;
        width: 160px;
        height: 160px;
        -webkit-animation-delay: 11s;
        animation-delay: 11s;
    }
    @-webkit-keyframes square {
        0% {
            -webkit-transform: translateY(0);
            transform: translateY(0);
        }
        100% {
            -webkit-transform: translateY(-700px) rotate(600deg);
            transform: translateY(-700px) rotate(600deg);
        }
    }
    @keyframes square {
        0% {
            -webkit-transform: translateY(0);
            transform: translateY(0);
        }
        100% {
            -webkit-transform: translateY(-700px) rotate(600deg);
            transform: translateY(-700px) rotate(600deg);
        }
    }

</style>
