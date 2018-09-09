<template>
    <div class="carousel-wrapper">
    	<div class="title">
        <h3 v-if="title">{{filteredSeries.length > 0 ? title + " >" : title}}</h3>
        <h5 v-for="selected in filteredSeries">
                {{ selected }} </h5>
        </div>        
        <ul class="movie-carousel">
            <li v-for="movie in movies" v-if="movies">
                <a tabindex="0">
                    <movie-card :movie="movie" @click.native="$emit('navigate', movie)" :showLoader="movie.id === showLoader" :loading="loading">
                    </movie-card>
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        props: ['movies', 'loading', 'title', 'showLoader', 'filteredSeries'],
        components: {
            movieCard: () =>
                import ('./movie-card.vue'),
        },
    };
</script>
<style lang="scss">
    .carousel-wrapper {
        display: flex;
        flex-direction: column;
        padding: 20px 0px;
        h3,
        h5 {
            display: inline-block;
            
            margin: 0px;
            color: white;
            margin-left: 20px;
            align-self: flex-start;
            padding: 5px;
            text-shadow: 1px 2px black;
        }
        h5:first-letter {
            text-transform: capitalize;
            font-size: 1.05rem;
        }
        h3 {
            text-transform: uppercase;
            font-size: 1.2rem;
        }
    }

    .title {
        display: flex;
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
        flex-wrap: nowrap;
    }
</style>