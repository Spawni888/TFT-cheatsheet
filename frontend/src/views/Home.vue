<template>
    <div class="home">
        Boilerplate
        <button @click="request">test backend</button>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: 'home',
        methods: {
            request() {
                axios.get('/test')
                    .then(res => {
                        console.log(res);
                        alert(res)
                    })
            }
        }
    }
</script>
