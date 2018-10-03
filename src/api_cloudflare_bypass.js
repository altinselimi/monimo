import cloudscraper from 'cloudscraper';

const IsJsonString = function (str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export default {
	animes: (req) => {
		console.log('req query:', req);
		let params = {
			order: req.search ? 'relevance_desc' : 'score_desc',
			genres: req.genres || null,
			page: req.page || 1,
			search: req.search || null,
		}
		let params_string = Object.keys(params).filter(key => params[key]).map(key => `${key}=${params[key]}`).join('&');
		let anime_url = `https://www.masterani.me/api/anime/filter?${params_string}`;
		return new Promise((resolve, reject) => {
			cloudscraper.request({
				method: 'GET',
				url: anime_url,
				headers: {
					//'Cache-Control': 'max-age=31556926',
					//'User-Agent': 'request',
					'content-type': 'application/json',
				}
			}, function(error, response, body) {
				if (error) {
					reject(error);
					return;
				}
				IsJsonString(body) ? resolve(JSON.parse(body)) : reject('invalid json');
			})
		});
	},
	getReleases: (req) => {
		let _url = 'https://www.masterani.me/api/releases';
		return new Promise((resolve, reject) => {
			cloudscraper.request({
				method: 'GET',
				url: _url,
				headers: {
					//'Cache-Control': 'max-age=31556926',
					//'User-Agent': 'request',
					'content-type': 'application/json',
				}
			}, function(error, response, body) {
				if (error) {
					reject(error);
					return;
				}
				IsJsonString(body) ? resolve(JSON.parse(body)) : reject('invalid json');
			})
		});
	},
	animeDetails: (req) => {
		console.log('Req:', req);
		let anime_url = `https://www.masterani.me/api/anime/${req.anime_id}/detailed`;
		if (!req.anime_id) throw new Error('missing url');
		return new Promise((resolve, reject) => {
			cloudscraper.request({
				method: 'GET',
				url: anime_url,
				headers: {
					//'Cache-Control': 'max-age=31556926',
					//'User-Agent': 'request',
					'content-type': 'application/json',
				},
			}, function(error, response, body) {
				if (error) {
					reject(error);
					return;
				}
				IsJsonString(body) ? resolve(JSON.parse(body)) : reject('invalid json');
			})
		});
	},
	videoLinks: (req) => {
		let anime_url = `https://www.masterani.me/anime/watch/${req.slug}/${req.episode}`;
		if (!anime_url) throw new Error('missing url');
		return new Promise((resolve, reject) => {
			cloudscraper.request({
				method: 'GET',
				url: anime_url,
				headers: {
					//'Cache-Control': 'max-age=31556926',
					//'User-Agent': 'request',
					'content-type': 'application/json',
				}
			}, (error, resp, body) => {
				if (error) {
					reject(error);
					return;
				}
				let res = body;
				let section = document.createElement('section');
				section.setAttribute('id', 'video-links');
				section.innerHTML = res;
				let mirrors = section.querySelector('video-mirrors');
				let links = JSON.parse(mirrors.getAttribute(':mirrors')).map(mirror => ({
					quality: mirror.quality,
					id: mirror.id,
					type: mirror.type === 1 ? 'sub' : 'dub',
					name: mirror.host.name,
					link: `${mirror.host.embed_prefix}${mirror.embed_id}${mirror.host.embed_suffix}`,
				}));//.filter(video => !video.link.includes('openload') && !video.link.includes('streamango'));
				//openload and streamango giving troubles rn. They have scripts that are clearing the console logs, which we use to communicate with parent component.
				let subs = links.filter(link => link.type === 'sub');
				let dubs = links.filter(link => link.type === 'dub');
				resolve({ subs, dubs, slug: req.slug, 'episode': req.episode });
				//section.parentNode.removeChild(section);
			})
		});
	},
};