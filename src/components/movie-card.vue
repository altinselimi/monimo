<template>
    <div class="movie-card" :class="{result: screen}">
        <div class="loader" v-if=" showLoader">
            <LoaderIcon/>
        </div>
        <div v-if="loading" class="loading"></div>
        <div class="contents" v-if="!loading">
            <div class="background">
                <img :src="movie.poster">
                <div class="overlay">
                    <div class="score" v-if="movie.score">
                        <StarIcon/>
                        <span>{{movie.score}}</span>
                    </div>
                    <h4>{{movie.title.slice(0,22)}}</h4>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { LoaderIcon,StarIcon } from 'vue-feather-icons'

export default {
    props: ['movie', 'loading', 'showLoader', 'screen'],
    components:{
        LoaderIcon,
        StarIcon
    }
}
</script>
<style lang="scss">
$yellow: #fbbd08;

.movie-card {
    --width: 350px;
    --height: 496px;
    position: relative;
    width: calc( var(--width) - 100px);
    height: calc( var(--height) - 100px);
    max-width: var(--width);
    max-height: var(--height);
    display: flex;
    background-color: white;
    border-radius: 25px;
    overflow: hidden;
    margin: 15px;
    .loading {
        background-color: rgba(gray, .1);
        flex: 1;
        height: 100%;
        width: 100%;
        background-repeat: no-repeat;
        background-image: linear-gradient( 90deg,
        rgba(lightgrey, 0) 0,
        rgba(lightgrey, .8) 50%,
        rgba(lightgrey, 0) 100%);
        background-size: 50% calc(100% - 35px), 100% 35px, 100% 100%;
        background-position: -150% 0, 0 100%; //animation: loading 1.5s infinite;   
        animation: loading 1.5s linear infinite;
    }
    .loader {
        position: absolute;
        z-index: 1;
        height: 100%;
        width: 100%;
        background: rgba(black, .8);
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        svg {
            stroke: white;
            animation: spin 1s linear infinite;
        }
    }
    .contents {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .background {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        img {
            /*             height: auto;
            width: 100%; */
            object-fit: cover;
            object-position: center center;
        }
    }
    .score {
        position: absolute;
        bottom: 48px;
        left: 8px;
        padding: 2px 8px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        font-size: .75rem;
        background-color: rgba(black, .8);
        color: white;
        svg {
            fill: $yellow;
            stroke: transparent;
            width: 14px;
            height: 14px;
            margin-right: 3px;
        }
    }
    h4 {
        margin: 0px;
        padding: 10px 13px;
        text-transform: uppercase;
        font-weight: 600;
        font-size: .8rem;
        overflow: hidden;
        height: 40px;
        width: 100%;
        display: inline-flex;
        align-items: center;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(white, 1);
    }
}

.result {
    margin: 15px auto;
}

@keyframes loading {
    to {
        background-position: 350% 0,
        0 0;
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>