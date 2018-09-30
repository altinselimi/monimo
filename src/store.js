import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import Vue from 'vue';
import real_api from './api';
import cloudflare_bypass_api from './api_cloudflare_bypass.js';
let api_module = real_api;

import createPersistedState from 'vuex-persistedstate';
import hardcoded_data from './hardcoded_data.js';
const { staff_picks } = hardcoded_data;
import { remote } from 'electron';

const debug = process.env.NODE_ENV !== 'production';

Vue.use(Vuex);
export default new Vuex.Store({

  /**
   * Assign the modules to the store
   */
  state: {
    animes: null,
    last_releases: null,
    current_anime: null,
    staff_picks: staff_picks,
    current_anime_video_links: null,
    animes_w_details: {},
    preferred_genres: [],
    favorite_animes: [],
    watching_animes: {},
    searched_animes: [],
    search_query: null,
    window_mode: 'normal',
    preferred_anime_type: 0,
    preferred_quality: 720,
    notification: {
      message: null,
      type: null,
    },
    blocked_region: null,
  },
  mutations: {
    SET_ANIMES(state, payload) {
      state.animes = payload;
    },
    SET_LAST_RELEASES(state, payload) {
      state.last_releases = payload;
    },
    ADD_ANIMES(state, payload) {
      state.animes.push(payload);
    },
    SET_CURRENT_ANIME(state, payload) {
      state.current_anime = payload;
    },
    ADD_ANIME_DETAILS(state, payload) {
      let existing_details = state.animes_w_details[payload.id];
      if (existing_details) {
        payload.data.episodes.forEach((episode, index) => {
          episode.current_time = existing_details.episodes[index].current_time;
        });
      }
      Vue.set(state.animes_w_details, payload.id, { ...existing_details, ...payload.data });
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
      Vue.set(state.watching_animes, payload.info.id, payload);
    },
    REMOVE_FROM_WATCHING(state, payload) {
      Vue.delete(state.watching_animes, payload.info.id);
    },
    UPDATE_SEARCH_QUERY(state, payload) {
      state.search_query = payload;
    },
    SET_WINDOW_MODE(state, payload) {
      state.window_mode = payload;
      // if(payload === 'full') {
      // document.body.requestFullScreen();
      // remote.getCurrentWindow().setFullScreen(true);
      // } else {
      // document.body.exitFullscreen();
      // remote.getCurrentWindow().setFullScreen(false);
      // }
    },
    SET_CURRENT_TIME(state, payload) {
      if (!state.animes_w_details) return;
      state.animes_w_details[payload.anime].episodes[payload.episode - 1].current_time = payload.time;
    },
    UPDATE_DETAILED_ANIME(state, payload) {
      Vue.set(state.animes_w_details, payload.anime_id, payload.new_data);
    },
    SET_SEARCHED_ANIMES(state, payload) {
      state.searched_animes = payload;
    },
    SET_CURRENT_VIDEO_LINKS(state, payload) {
      state.current_anime_video_links = payload;
    },
    SET_PREFERRED_TYPE(state, payload) {
      state.preferred_anime_type = parseInt(payload);
    },
    SET_PREFERRED_QUALITY(state, payload) {
      state.preferred_quality = parseInt(payload);
    },
    SET_NOTIFICATION(state, payload) {
      state.notification = payload;
    },
    SET_REGION_BLOCKED(state, payload) {
      state.blocked_region = payload;
      if(payload === true) {
        console.log('Setting api module to', cloudflare_bypass_api);
        api_module = cloudflare_bypass_api;
      }
    }
  },
  actions: {
    getAnimes({ state, commit }, params) {
      return new Promise((resolve, reject) => {
        console.log('params:', params);
        let _params = {
          order: 'score_desc',
          page: 1,
        }
        if (params) {
          _params = { ..._params, ...params };
        }
        if (state.preferred_genres.length > 0 && !state.search_query) {
          _params.genres = state.preferred_genres;
        }
        console.log('params at end:', _params);
        api_module.animes(_params).then(res => {
          console.log('Response:', res);
          let animes = res.data.map(anime => {
            return { ...anime,
              ['poster']: `https://cdn.masterani.me/poster/1/${anime.poster.file}`,
            }
          });
          typeof _params.search === 'undefined' ? commit('SET_ANIMES', animes) : commit('SET_SEARCHED_ANIMES', animes);
          commit('UPDATE_SEARCH_QUERY', null);
          resolve(animes);
        }).catch(err => {
          reject(err);
        });
      });
    },
    getLastReleases({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        api_module.getReleases().then(res => {
          console.log(res);
          let animes = res.map(result => {
            return { ...result.anime,
              ['poster']: `https://cdn.masterani.me/poster/1/${result.anime.poster}`,
              ['released_at']: result.created_at,
              ['episode_number']: result.episode,
            }
          });
          commit('SET_LAST_RELEASES', animes);
          resolve(animes);
        }).catch(err => {
          reject(err);
        })
      });
    },
    getAnimeDetails({ state, commit }, anime_id) {
      return new Promise((resolve, reject) => {
        api_module.animeDetails({ anime_id: anime_id }).then(res => {
          console.log('anime details:', res);
          res.episodes.forEach(episode => episode.current_time = null);
          commit('ADD_ANIME_DETAILS', { id: anime_id, data: res });
          commit('SET_CURRENT_ANIME', res);
          resolve(res);
        }).catch(err => {
          reject(err);
        })
      })
    },
    getVideoLinks({ state, commit }, { slug, episode }) {
      return api_module.videoLinks({ slug: slug, episode: episode });
    },
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
    currently_watching: (state) => {
      let keys = Object.keys(state.watching_animes);
      let result = keys.length > 0 && keys.map(key => {
        let anime = state.watching_animes[key];
        if (!anime) return;
        return { ...anime.info, ['genres']: anime.genres, ['poster']: `https://cdn.masterani.me/poster/1/${anime.poster}` };
      });
      return result;
    },
    favorite_animes: (state) => {
      return state.favorite_animes.map(anime => {
        return { ...anime.info, ['genres']: anime.genres, ['poster']: `https://cdn.masterani.me/poster/1/${anime.poster}` };
      });
    },
    video_links: (state) => {
      let result;
      if (!state.current_anime_video_links) return;
      let subs = state.current_anime_video_links['subs'];
      let dubs = state.current_anime_video_links['dubs'];
      if (state.preferred_anime_type === 1) {
        result = dubs || subs;
      }
      result = subs;
      //return result;
      return result.filter(link => link.quality === state.preferred_quality);
    },
    searched: (state) => {
      return state.searched_animes;
    }
  },
  plugins: debug ? [] : [createPersistedState()],
});