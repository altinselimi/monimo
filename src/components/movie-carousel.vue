<template>
    <div class="carousel-wrapper" :style="`order: ${order}`">
        <div class="carousel-title">
            <h3 v-if="title">{{title}}
                <span>{{ genres ? `from ${genres}` : ''}}</span>
            </h3>
            <div class="carousel-actions" style="margin-left: auto; margin-right: 10px;">
                <button @click="$emit('changeOrder', {order: order, direction: 'up'})" v-show="order > 1">
                    <arrow-up-icon></arrow-up-icon>
                </button>
                <button @click="$emit('changeOrder', {order: order, direction: 'down'})">
                    <arrow-up-icon style="transform: rotate(180deg)"></arrow-up-icon>
                </button>
                <button :class="{'shuffled': shuffle}" @click="shuffle = !shuffle">
                    <shuffle-icon></shuffle-icon>
                </button>
            </div>
        </div>
        <ul class="movie-carousel" :class="isResult?'result':'normal'" v-if="movies">
            <li v-for="movie in movieList" v-if="movie">
                <a tabindex="0">
                    <movie-card :removable="removable" :movie="movie" @remove="$emit('remove', movie)" @click.native="$emit('navigate', movie)" :showLoader="movie.id === showLoader" :loading="loading" :screen="isResult">
                    </movie-card>
                </a>
            </li>
        </ul>
        <ul v-else-if="!movies && !willAppear">
            <h3 style="color: white;">No Results</h3>
        </ul>
        <ul class="movie-carousel" v-else-if="willAppear">
            <li>
                <a tabindex="0">
                    <movie-card :wireframe="true">
                        <small slot="empty-carousel">{{message}}</small>
                    </movie-card>
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
import { ShuffleIcon, ArrowUpIcon } from 'vue-feather-icons';

export default {
    props: ['movies', 'sectionOrder', 'willAppear', 'message', 'loading', 'title', 'showLoader', 'selectedGenres', 'isResult', 'removable'],
    components: {
        movieCard: () =>
            import ('./movie-card.vue'),
        ShuffleIcon,
        ArrowUpIcon
    },
    data: () => ({
        shuffle: false,
    }),
    computed: {
        order() {
            return this.sectionOrder.order;
        },
        genres() {
            if (!this.selectedGenres || this.selectedGenres.length === 0) return;
            return this.selectedGenres.reduce((acc, cur, idx, src) => {
                if (idx > 0 && (idx === src.length - 1)) return acc += ` AND ${cur}`;
                if (idx > 0) return acc += `, ${cur}`;
                return acc += ` ${cur}`;
            }, '');
        },
        movieList() {
            return this.shuffle ? this.fisherYatesSorting(this.movies) : this.movies;
        },
    },
    methods: {
        fisherYatesSorting(arr, b, c, d) { //array,placeholder,placeholder,placeholder
            let a = arr.slice(0);
            c = a.length;
            while (c) b = Math.random() * c-- | 0, d = a[c], a[c] = a[b], a[b] = d;
            return a;
        }
    },
};
</script>
<style lang="scss">
$blue: #03A9F4;

.carousel-wrapper {
    display: flex;
    flex-direction: column;
    padding: 20px 0px;

    &:hover .carousel-actions {
        opacity: 1;
    }

    .carousel-actions button {
        background: transparent;
        border: solid 1px white;
        padding: 0px;
        background-color: rgba(black, .85);
        color: white;
        display: inline-flex;
        justify-content: center;
        border-radius: 23px;
        height: 23px;
        width: 23px;
        margin: 0 5px;

        svg {
            width: 13px;
            height: 13px;
        }
    }

    h3 {
        margin: 0px;
        color: white;
        margin-left: 15px;
        align-self: flex-start;
        text-shadow: 1px 2px black;
        text-transform: uppercase;
        font-size: 1.2rem;
    }

    .image-wrapper {
        min-width: 350px;
        min-height: 496px;
    }
}

.carousel-title {
    display: flex;
    align-items: center;
    color: white;
    letter-spacing: .7px;

    span {
        font-weight: 400;
        font-size: 85%;
        opacity: .8;
    }

    .carousel-actions {
        opacity: .5;
    }

    button.shuffled svg {
        stroke: $blue;
    }
}

ul.movie-carousel {
    padding: 0px;
    margin: 0px;
    list-style: none;
    display: flex;
    align-items: center;

    >li {
        width: auto;
    }
}

ul.normal {
    flex-wrap: nowrap;
}

ul.result {
    flex-wrap: wrap;
    justify-content: flex-start;

    >li {
        margin: 0px 15px;
    }
}
</style>