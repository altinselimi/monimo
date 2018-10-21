<template>
    <div class="movie-card" :class="{'result': screen, 'wireframe': wireframe}">
        <div class="loader" v-if="showLoader">
            <LoaderIcon />
        </div>
        <div v-if="loading" class="loading"></div>
        <div class="contents" v-if="!loading">
            <div class="wireframe-content" v-if="wireframe">
                <slot name="empty-carousel">
                    <small>Nothing to do here</small>
                </slot>
            </div>
            <div class="background" v-if="movie">
                <image-bypasser :source="movie.poster"></image-bypasser>
                <div class="overlay">
                    <button class="unstyled remove" v-if="removable" @click.stop="$emit('remove')">
                        <remove-icon stroke-width="1" />
                    </button>
                    <div class="score" v-if="movie.score">
                        <StarIcon />
                        <span>{{movie.score}}</span>
                    </div>
                    <h4>{{movie.title.slice(0,22)}}</h4>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { LoaderIcon, StarIcon, RemoveIcon, XCircleIcon } from 'vue-feather-icons'
import ImageBypasser from './image';

export default {
    props: ['movie', 'loading', 'showLoader', 'screen', 'removable', 'wireframe'],
    components: {
        LoaderIcon,
        StarIcon,
        ImageBypasser,
        RemoveIcon: XCircleIcon,
    }
}
</script>
<style lang="scss">
$yellow: #fbbd08;
.unstyled {
    border: none;
    background: none;
    font-size: 1rem;
    outline: none;
}
.movie-card {
    --width: 350px;
    --height: 496px;
    position: relative;
    width: calc(var(--width) - 100px);
    height: calc(var(--height) - 100px);
    max-width: var(--width);
    max-height: var(--height);
    display: flex;
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    margin: 15px;

    &.wireframe {
        background-color: rgba(black, .5);
        backdrop-filter: blur(20px);
        border: dashed 1px rgba(white, .8);
        height: 100%;
        display: flex;
        align-items: center;
        .wireframe-content {
            color: rgba(white, .6);
            padding: 15px;
        }
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

    .remove {
        position: absolute;
        right: 8px;
        top: 8px;
        opacity: 0;
        will-change: opacity;
        svg {
            fill: rgba(red, .66);
            stroke: white;
            width: 25px;
            height: 25px;
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

    &:hover {
        .remove {
            opacity: 1;
        }
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