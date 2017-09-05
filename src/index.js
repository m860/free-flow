import request from 'request'
import log4js from 'log4js'

log4js.configure({
	appenders: {sign: {type: 'file', filename: 'sign.log'}},
	categories: {default: {appenders: ['sign'], level: 'all'}}
});

const log = log4js.getLogger("sign");

const sign = (data)=> {
	const ssocookie = data.cookie;
	const name = data.name;
	log.info(`start sign ${name}`)
	return new Promise((resolve, reject)=> {
		request({
			url: "http://218.205.252.24:18081/scmccCampaign/signCalendar/sign.do",
			method: "POST",
			headers: {
				"User-Agent": "Mozilla/5.0 (Linux; Android 7.0; BLN-AL10 Build/HONORBLN-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Mobile Safari/537.36/3.4.0 scmcc.mobile"
			},
			formData: {
				SSOCookie: ssocookie
			}
		}, (err, res, body)=> {
			if (err) {
				log.error(err);
				resolve();
			}
			else {
				const contentType = res.headers['content-type'];
				if (/application\/json/.test(contentType)) {
					try {
						const result = JSON.parse(body).result;
						if (result.code === 0) {
							//success
							log.info('sign success!', body);
							resolve()
						}
						else {
							log.info('sign fail!', body);
							resolve();
						}
					}
					catch (ex) {
						log.error(ex, body);
					}
				}
				else {
					log.info(body);
				}
			}
		});
	})

}

const ssocookies = [
	{name: "walle", cookie: "6435FA9EC9F6A64B105276D0223D129D"}
];

async function run(i = 0) {
	const len = ssocookies.length;
	if (i < len) {
		const cookie = ssocookies[i];
		await sign(cookie);
		await run(i + 1);
	}
}

run()

// ssocookies.forEach(async(cookie)=> {
// 	await sign(cookie);
// });