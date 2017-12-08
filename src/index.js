require("babel-core/register");
require("babel-polyfill");
import request from 'request'
import log4js from 'log4js'

log4js.configure({
	appenders: {sign: {type: 'file', filename: 'sign.log'}},
	categories: {default: {appenders: ['sign'], level: 'all'}}
});

const log = log4js.getLogger("sign");

const defaultHeaders = {
	"Accept-Language": "zh-CN,en-US;q=0.8",
	"Content-Type": "application/x-www-form-urlencoded",
	"User-Agent": "Mozilla/5.0 (Linux; Android 7.0; BLN-AL10 Build/HONORBLN-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Mobile Safari/537.36/3.4.0 scmcc.mobile"
};

const action = {
	sign: "http://218.205.252.24:18081/scmccCampaign/signCalendar/sign.do",
	lottery: "http://218.205.252.24:18081/scmccCampaign/dazhuanpan/dzpDraw.do?t=",
	sevenDay: "http://218.205.252.24:18081/scmccCampaign/signCalendar/draw.do",
};

function getActionName(value) {
	for (let key in action) {
		if (action[key] === value) {
			return key;
		}
	}
	return 'unknown';
}

export const sign = (name, SSOCookie, JSESSIONID,) => {
	let cookies = [
		`SmsNoPwdLoginCookie=${SSOCookie}`,
		`smsCityCookie=11`,
		`tokenid=`,
		`SSOCookie=`,
		`JSESSIONID=${JSESSIONID}`
	];

	log.info(`start sign ${name}`);
	return new Promise((resolve, reject) => {
		request({
			url: 'http://218.205.252.24:18081/scmccCampaign/signCalendar/sign.do',
			method: "POST",
			headers: {
				...defaultHeaders,
				"Cookie": cookies.join(';'),
			},
			formData: {
				SSOCookie: SSOCookie
			}
		}, (err, res, body) => {
			if (err) {
				log.error(err);
				resolve();
			}
			else {
				log.info(body);
				resolve();
			}
		});
	})
};

export const lottery = (name, SSOCookie, JSESSIONID) => {
	let cookies = [
		`SmsNoPwdLoginCookie=${SSOCookie}`,
		`smsCityCookie=11`,
		`tokenid=`,
		`SSOCookie=`,
		`JSESSIONID=${JSESSIONID}`
	];
	log.info(`start lottery ${name}`)
	return new Promise((resolve, reject) => {
		request({
			url: `http://218.205.252.24:18081/scmccCampaign/dazhuanpan/dzpDraw.do?t=${Math.random()}`,
			method: "POST",
			headers: {
				...defaultHeaders,
				"Cookie": cookies.join(';'),
			},
			formData: {
				SSOCookie: SSOCookie
			}
		}, (err, res, body) => {
			if (err) {
				log.error(err);
				resolve();
			}
			else {
				log.info(body);
				resolve();
			}
		});
	})
}

export const querySignStatus = (name, SSOCookie, JSESSIONID) => {
	let cookies = [
		`SmsNoPwdLoginCookie=${SSOCookie}`,
		`smsCityCookie=11`,
		`tokenid=`,
		`SSOCookie=`,
		`JSESSIONID=${JSESSIONID}`
	];
	return new Promise((resolve, reject) => {
		request({
			url: `http://218.205.252.24:18081/scmccCampaign/signCalendar/queryPrizeAndDrawStatus.do`,
			method: "POST",
			headers: {
				...defaultHeaders,
				"Cookie": cookies.join(';'),
			},
			formData: {
				SSOCookie: SSOCookie
			}
		}, (err, res, body) => {
			if (err) {
				log.error(err);
				resolve();
			}
			else {
				log.info(body);
				try {
					const result = JSON.parse(body);
					resolve(result);
				}
				catch (ex) {
					log.error(ex);
					resolve();
				}
			}
		});
	});
}

export const getSignPrize = (name, SSOCookie, JSESSIONID, type) => {
	let cookies = [
		`SmsNoPwdLoginCookie=${SSOCookie}`,
		`smsCityCookie=11`,
		`tokenid=`,
		`SSOCookie=`,
		`JSESSIONID=${JSESSIONID}`
	];
	log.info(`start get prize ${name}`);
	return new Promise((resolve, reject) => {
		request({
			url: `http://218.205.252.24:18081/scmccCampaign/signCalendar/draw.do`,
			method: "POST",
			headers: {
				...defaultHeaders,
				//Referer: "http://218.205.252.24:18081/scmccCampaign/signCalendar/index.html?abStr=6124",
				"Cookie": cookies.join(';'),
			},
			body: `SSOCookie=${SSOCookie}&type=${type}`
		}, (err, res, body) => {
			if (err) {
				log.error(err);
				resolve();
			}
			else {
				log.info(body);
				resolve();
			}
		});
	})
}

const userConfiguration = [
	{
		name: "walle",
		SSOCookie: "6435FA9EC9F6A64B105276D0223D129D",
		JSESSIONID: "lAEz0hPECqnrUDQIrg8lZXYVMHuCWAPbmCtbaXbgKcnuWCQ7uJrq!-522203662"
	},
	{
		name: "steve",
		SSOCookie: "8259AC0813A148B869AC6EF551FF2C5A",
		JSESSIONID: "clx0OGNuTCqz6mPvj5I7tFLV3c4ZdAZnJ7r38QvCI_DjEe4NvIt6!1438695398"
	}, {
		name: "eva",
		SSOCookie: "77A85FA2B434A3C275BB1953A04C7204",
		JSESSIONID: "q_N2cRJ4HD9gFJj8zrnzXAi80LhoxSVGI8-dM4XmOHy4amDOjaLQ!870828801"
	}
];

async function run(i = 0) {
	const len = userConfiguration.length;
	if (i < len) {
		const opt = userConfiguration[i];
		await sign(opt.name, opt.SSOCookie, opt.JSESSIONID);
		await lottery(opt.name, opt.SSOCookie, opt.JSESSIONID);
		// if (opt.name === 'walle') {
		// 	const signStatus = await querySignStatus(opt.name, opt.SSOCookie, opt.JSESSIONID);
		// 	if (signStatus) {
		// 		if (signStatus.result) {
		// 			if (signStatus.result.obj) {
		// 				const day = signStatus.result.obj.dayNum;
		// 				log.info(`sign ${day} day`);
		// 				if (day === 1) {
		// 					await getSignPrize(opt.name, opt.SSOCookie, opt.JSESSIONID, 0)
		// 				}
		// 				if (day === 7) {
		// 					await getSignPrize(opt.name, opt.SSOCookie, opt.JSESSIONID, 1)
		// 				}
		// 				if (day === 15) {
		// 					await getSignPrize(opt.name, opt.SSOCookie, opt.JSESSIONID, 2)
		// 				}
		// 				if (day === 25) {
		// 					await getSignPrize(opt.name, opt.SSOCookie, opt.JSESSIONID, 3)
		// 				}
		// 			}
		// 		}
		// 	}
		// }
		await run(i + 1);
	}
}

log.info('***********************************************')
run();

