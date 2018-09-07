import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import Vue from 'vue';

const debug = process.env.NODE_ENV !== 'production';

Vue.use(Vuex);
export default new Vuex.Store({

  /**
   * Assign the modules to the store
   */
  state: {
    animes: null,
    current_anime: null,
    animes_w_details: {},
    preferred_genres: [],
    favorite_animes: [],
    watching_animes: [],
    search_query: null,
    window_mode: 'normal'
  },
  mutations: {
    SET_ANIMES(state, payload) {
      state.animes = payload;
    },
    ADD_ANIMES(state, payload) {
      state.animes.push(payload);
    },
    SET_CURRENT_ANIME(state, payload) {
      state.current_anime = payload;
    },
    ADD_ANIME_DETAILS(state, payload) {
      Vue.set(state.animes_w_details, payload.id, payload.data);
    },
    ADD_PREFERRED_GENRE(state, payload) {
      state.preferred_genres.push(payload);
    },
    REMOVE_PREFERRED_GENRE(state, payload) {
      let index = state.preferred_genres.findIndex(category => category === payload)
      state.preferred_genres.splice(index, 1);
    },
    ADD_TO_FAVORITES(state, payload) {
      state.favorite_animes.push(payload);
    },
    REMOVE_FROM_FAVORITES(state, payload) {
      let index = state.favorite_animes.findIndex(anime => anime.info.id === payload.info.id);
      state.favorite_animes.splice(index, 1);
    },
    ADD_TO_WATCHING(state, payload) {
      state.watching_animes.push(payload);
    },
    REMOVE_FROM_WATCHING(state, payload) {
      let index = state.watching_animes.findIndex(anime => anime.info.id === payload.info.id);
      state.watching_animes.splice(index, 1);
    },
    UPDATE_SEARCH_QUERY(state, payload) {
      state.search_query = payload;
    },
    SET_WINDOW_MODE(state, payload){
      state.window_mode = payload;
    }
  },
  actions: {
    getAnimes({ state, commit }, params) {
      return new Promise((resolve, reject) => {
        let _params = {
          order: 'score_desc',
          page: 1,
        }
        if (params) {
          _params = { ..._params, ...params };
        }
        if (state.preferred_genres.length > 0) {
          _params.genres = state.preferred_genres;
        }
        Vue.$http.get('/animes', { params: _params }).then(res => {
          let animes = res.data.data.map(anime => {
            return { ...anime,
              ['poster']: `https://cdn.masterani.me/poster/1/${anime.poster.file}`,
            }
          });
          commit('SET_ANIMES', animes);
          resolve(animes);
        }).catch(err => {
          reject(err);
        });
      });
    },
    getAnimeDetails({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        Vue.$http.get('/anime-details', { params: { anime_id: payload } }).then(res => {
          console.log('anime details:', res.data);
          commit('ADD_ANIME_DETAILS', { id: payload, data: res.data });
          commit('SET_CURRENT_ANIME', res.data);
          resolve(res.data);
        }).catch(err => {
          reject(err);
        })
      })
    },
    getVideoLink({ state, commit }, { slug, episode }) {
      return Vue.$http.get('/get-video-link', { params: { slug: slug, episode: episode } });
    }
  },
  getters: {
    normalized_animes: (state) => {
      return state.animes && state.animes.reduce((b, a) => {
        b[a.id] = a;
        return b;
      }, {});
    },
    filtered_animes: (state) => {
      let to_be_filtered = state.favorite_animes; //.concat(state.watching_animes);
      return state.animes && state.animes.filter(anime => !to_be_filtered.find(_anime => _anime.info.id === anime.id));
    },
    favorite_animes: (state) => {
      return state.favorite_animes.map(anime => {
        return { ...anime.info, ['genres']: anime.genres, ['poster']: `https://cdn.masterani.me/poster/1/${anime.poster}` };
      });
    },
    currently_watching: (state) => {
      return state.watching_animes.map(anime => {
        return { ...anime.info, ['genres']: anime.genres, ['poster']: `https://cdn.masterani.me/poster/1/${anime.poster}` };
      });
    },
  },
});