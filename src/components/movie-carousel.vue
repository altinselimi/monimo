<template>
    <div class="carousel-wrapper">
        <div class="title">
            <h3 v-if="title">{{title}}
                <span>{{ genres ? `from ${genres}` : ''}}</span>
            </h3>
        </div>
        <ul class="movie-carousel" :class="isResult?'result':'normal'" v-if="movies">
            <li v-for="movie in movies" v-if="movie">
                <a tabindex="0">
                    <movie-card :removable="removable" :movie="movie" @remove="$emit('remove', movie)" @click.native="$emit('navigate', movie)" :showLoader="movie.id === showLoader" :loading="loading" :screen="isResult">
                    </movie-card>
                </a>
            </li>
        </ul>
        <ul v-else>
            <h3 style="color: white;">No Results</h3>
        </ul>
    </div>
</template>
<script>
export default {
    props: ['movies', 'loading', 'title', 'showLoader', 'selectedGenres', 'isResult', 'removable'],
    components: {
        movieCard: () =>
            import ('./movie-card.vue'),
    },
    computed: {
        genres() {
            if (!this.selectedGenres || this.selectedGenres.length === 0) return;
            return this.selectedGenres.reduce((acc, cur, idx, src) => {
                if (idx > 0 && (idx === src.length - 1)) return acc += ` AND ${cur}`;
                if (idx > 0) return acc += `, ${cur}`;
                return acc += ` ${cur}`;
            }, '');
        },
    },
};
</script>
<style lang="scss">
.carousel-wrapper {
    display: flex;
    flex-direction: column;
    padding: 20px 0px;
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

.title {
    display: flex;
    align-items: center;
    color: white;
    letter-spacing: .7px;
    span {
        font-weight: 400;
        font-size: 85%;
        opacity: .8;
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