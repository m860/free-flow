import request from 'request'
import log4js from 'log4js'

log4js.configure({
	appenders: {sign: {type: 'file', filename: 'sign.log'}},
	categories: {default: {appenders: ['sign'], level: 'all'}}
});

const log = log4js.getLogger("sign");

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

const sign = (data)=> {
	const ssocookie = data.cookie;
	const name = data.name;
	log.info(`start ${getActionName(data.action)} ${name}`)
	return new Promise((resolve, reject)=> {
		let url = data.action;
		if (url === action.lottery) {
			url += Math.random();
		}
		let formData = {
			SSOCookie: ssocookie
		};
		if (url === action.sevenDay) {
			formData.type = 1;
		}
		request({
			url: url,
			method: "POST",
			headers: {
				"Accept-Language": "zh-CN,en-US;q=0.8",
				"Content-Type": "application/x-www-form-urlencoded",
				"Cookie": `cstamp=1504577034130; smsCityCookie=11; SmsNoPwdLoginCookie=${ssocookie}; tokenid=; SSOCookie=; JSESSIONID=${data.JSESSIONID};`,//WT_FPC=id=2218aa09807ed562c0b1504575212738:lv=1504664053259:ss=1504663773358
				"User-Agent": "Mozilla/5.0 (Linux; Android 7.0; BLN-AL10 Build/HONORBLN-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Mobile Safari/537.36/3.4.0 scmcc.mobile"
			},
			formData: formData
		}, (err, res, body)=> {
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

const ssocookies = [
	/*{
		name: "walle", cookie: "6435FA9EC9F6A64B105276D0223D129D",
		JSESSIONID: "2x5U9yCPqSRjrChOXUO6gy1osMD3WwpYznCtPhBY2MxDj2_RoAT7!3057625",
		action: action.sign
	},
	{
		name: "walle", cookie: "6435FA9EC9F6A64B105276D0223D129D",
		JSESSIONID: "2x5U9yCPqSRjrChOXUO6gy1osMD3WwpYznCtPhBY2MxDj2_RoAT7!3057625",
		action: action.lottery
	},
	{
		name: "steve",
		cookie: "8259AC0813A148B869AC6EF551FF2C5A",
		JSESSIONID: "Il1U_amdYdKfgbthGGwkeTphXFF6Ws8ZQN7ED5S8C9P2h1qLQZO8!1178766403",
		action: action.sign
	},
	{
		name: "steve",
		cookie: "8259AC0813A148B869AC6EF551FF2C5A",
		JSESSIONID: "Il1U_amdYdKfgbthGGwkeTphXFF6Ws8ZQN7ED5S8C9P2h1qLQZO8!1178766403",
		action: action.lottery
	},*/
	{
		name: "steve",
		cookie: "8259AC0813A148B869AC6EF551FF2C5A",
		JSESSIONID: "Il1U_amdYdKfgbthGGwkeTphXFF6Ws8ZQN7ED5S8C9P2h1qLQZO8!1178766403",
		action: action.sevenDay
	},
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

