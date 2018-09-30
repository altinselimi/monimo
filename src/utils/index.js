import cloudscraper from "cloudscraper";
export const bypassWallpaper = link => {
	return new Promise((resolve, reject) => {
		cloudscraper.request({
				method: "GET",
				url: link,
				encoding: null,
				headers: {
					"User-Agent": "monimo",
					"content-type": "image/jpeg",
					"Cache-Control": "max-age:31556926"
				}
			},
			(error, res, body) => {
				if (error) {
					reject(error);
					return;
				}
				let data =
					"data:" +
					res.headers["content-type"] +
					";base64," +
					new Buffer(body).toString("base64");
				resolve(data);
			}
		);
	});
};