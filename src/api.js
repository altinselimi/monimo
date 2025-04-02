import Vue from 'vue';

export default {
	animes: (req) => {
		console.log('req query:', req);
		let params = {
			order: req.order || 'score_desc',
			genres: req.genres || null,
			page: req.page || 1,
			search: req.search || null,
		}
		let params_string = Object.keys(params).filter(key => params[key]).map(key => `${key}=${params[key]}`).join('&');
		console.log('params string:', params_string);
		let anime_url = `https://www.masterani.me/api/anime/filter?${params_string}`;
		return new Promise((resolve, reject) => {
			Vue.$http.get(anime_url).then(response => {
				resolve(response.data)
			}).catch(err => {
				reject(err)
			});
		});
	},
	getReleases: (req) => {
		let url = 'https://www.masterani.me/api/releases';
		return new Promise((resolve, reject) => {
			Vue.$http.get(url).then(response => {
				resolve(response.data)
			}).catch(err => {
				reject(err)
			});
		});
	},
	animeDetails: (req) => {
		console.log('Req:', req);
		let anime_url = `https://www.masterani.me/api/anime/${req.anime_id}/detailed`;
		if (!req.anime_id) throw new Error('missing url');
		return new Promise((resolve, reject) => {
			Vue.$http.get(anime_url).then(response => {
				resolve(response.data)
			}).catch(err => {
				reject(err)
			});
		});
	},
	videoLinks: (req) => {
		let anime_url = `https://www.masterani.me/anime/watch/${req.slug}/${req.episode}`;
		console.log("anime url:", anime_url);
		if (!anime_url) throw new Error('missing url');
		return new Promise((resolve, reject) => {
			Vue.$http.get(anime_url).then(res => {
				let section = document.createElement('section');
				section.setAttribute('id', 'video-links');
				section.innerHTML = res.data;
				let mirrors = section.querySelector('video-mirrors');
				let links = JSON.parse(mirrors.getAttribute(':mirrors')).map(mirror => ({
					quality: mirror.quality,
					id: mirror.id,
					type: mirror.type === 1 ? 'sub' : 'dub',
					name: mirror.host.name,
					link: `${mirror.host.embed_prefix}${mirror.embed_id}${mirror.host.embed_suffix}`,
				})); //.filter(video => !video.link.includes('openload') && !video.link.includes('streamango'));
				//openload and streamango giving troubles rn. They have scripts that are clearing the console logs, which we use to communicate with parent component.
				let subs = links.filter(link => link.type === 'sub');
				let dubs = links.filter(link => link.type === 'dub');
				resolve({
					subs,
					dubs,
					slug: req.slug,
					'episode': req.episode
				});
				//section.parentNode.removeChild(section);
				section.parentNode.removeChild(section);
			}).catch(err => reject(err));
		});
	},
}