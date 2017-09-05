import request from 'request'
import log4js from 'log4js'

log4js.configure({
	appenders: {sign: {type: 'file', filename: 'sign.log'}},
	categories: {default: {appenders: ['sign'], level: 'all'}}
});

const log = log4js.getLogger("sign");

const sign = (ssocookie)=> {
	log.info(`start sign ${ssocookie}`)
	return new Promise((resolve, reject)=> {
		request.post('http://218.205.252.24:18081/scmccCampaign/signCalendar/sign.do', {
			SSOCookie: ssocookie
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
	"6435FA9EC9F6A64B105276D0223D129D",
	"8259AC0813A148B869AC6EF551FF2C5A"
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