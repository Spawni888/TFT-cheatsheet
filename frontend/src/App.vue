<template>
    <div id="app">
        <div class="wrapper">
            <div class="container">
                <h1>Welcome</h1>
                <form class="hiddenBlock" id="hiddenBlock" >
                    <div class="hiddenText" id="hiddenText"></div>
                    <button type="submit" id="button" @click="startCompare()">Ok</button>
                </form>
                <form class="form">
                    <input type="number" placeholder="Tier" id="tier">
                    <input type="number" placeholder="LVL" id="lvl">
                    <input type="number" placeholder="XP" id="xp">
                    <button type="submit" id="login-button" @click="startCompare()">Ready</button>
                </form>
            </div>

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


    export default {
        data() {
            return {
                chancesTable,
                lvlExperience
            }
        },
        methods: {
            getOneOrMoreCurrent(tier, lvl) {
                const pool = chancesTable.find(item => item.tier === tier);
                const probability = pool.lvlChances[lvl] * 5;
                const currentTierChamps = pool.count;

                return probability / currentTierChamps;
            },
            compareProbabilities(tier, lvl, xp) {
                const currentLvlProbability = this.getOneOrMoreCurrent(tier, lvl);
                const nextLvlProbability = this.getOneOrMoreCurrent(tier, lvl + 1);

                let neededGold = Math.ceil((lvlExperience[lvl - 1] - xp) / 4);
                console.log(neededGold);
                const canRollCount = neededGold / 2;
                const x = (currentLvlProbability * canRollCount) / (nextLvlProbability - currentLvlProbability);
                neededGold += (x * 2);

                neededGold = Math.round(neededGold);
                if (neededGold < 0 || isNaN(neededGold)) {
                    this.appendNewNodeWithText('SO RETARDED QUESTION BRO. REALLY. STOP!!!!');
                    console.log('useless question');
                }
                else {
                    console.log(neededGold + '+  - LEVEL UP');
                    this.appendNewNodeWithText('If u have more than ' + neededGold + ' u can level up');
                }

            },
            appendNewNodeWithText(text) {
                const newNode = document.createElement('H2');
                const parentNode = document.body.querySelector('.hiddenText');

                newNode.innerText = text;
                newNode.classList.add('hiddenText');
                parentNode.appendChild(newNode);
            },
            startCompare() {
                const tier = parseInt(document.getElementById('tier').value);
                const lvl = parseInt(document.getElementById('lvl').value);
                const xp =  parseInt(document.getElementById('xp').value);
                const parentNode = document.body.querySelector('.hiddenText');
                $(".hiddenText").empty();

                if (tier > 5 || tier < 1 || isNaN(tier)) {
                    this.appendNewNodeWithText('Tier should be between 1 and 5');
                    console.log('Tier should be between 1 and 5');
                }
                if (lvl > 8 || lvl < 1 || isNaN(lvl)) {
                    this.appendNewNodeWithText('Lvl should be between 1 and 8');
                    console.log('Lvl should be between 1 and 8');
                }
                if (xp > 66 || xp < 0 || (xp % 2 > 0) || isNaN(xp)) {
                    this.appendNewNodeWithText('Xp should be an even number between 0 and 66');
                    console.log('Xp should be an even number between 0 and 66');
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
        display: none;
        -webkit-transform: translateY(85px);
        transform: translateY(85px);
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
        -webkit-transform: translateY(85px);
        transform: translateY(85px);
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
