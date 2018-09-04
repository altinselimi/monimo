<template>
    <div class="movie-card">
        <div class="loader" v-if=" showLoader">
            <svg class="feather feather-loader sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-reactid="706">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
        </div>
        <div v-if="loading" class="loading"></div>
        <div class="contents" v-if="!loading">
            <div class="background">
                <img :src="movie.poster">
                <div class="overlay">
                    <div class="score">
                        <svg class="feather feather-star sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-reactid="1101">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span>{{movie.score}}</span>
                    </div>
                </div>
            </div>
            <h4>{{movie.title.slice(0,22)}}</h4>
        </div>
    </div>
</template>
<script>
export default {
    props: ['movie', 'loading', 'showLoader'],
}
</script>
<style lang="scss">
$yellow: #fbbd08;
.movie-card {
    position: relative;
    width: 240px;
    height: 385.6px;
    display: flex;
    background-color: white;
    border-radius: 25px;
    overflow: hidden;
    margin: 15px;
    .loading {
        background-color: rgba(gray,.1);
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
        	stroke:white;
            animation: spin 1s linear infinite;
        }
    }
    .contents {
        display: flex;
        flex-direction: column;
    }
    .background {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        img {
            height: auto;
            width: 100%;
        }
    }
    .score {
        position: absolute;
        bottom: 8px;
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
        overflow-x: hidden;
        height: 50px;
        display: inline-flex;
        align-items: center;
        position: relative;
        background-color: white;
    }
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