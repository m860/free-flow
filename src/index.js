import request from 'request'

const sign = (ssocookie)=> {
	return new Promise((resolve, reject)=> {
		request.post('http://218.205.252.24:18081/scmccCampaign/signCalendar/sign.do', {
			SSOCookie: ssocookie
		}, (err, res, body)=> {
			if (err) {
				reject(err);
			}
			else {
				const result = JSON.parse(body).result;
				if (result.code === 0) {
					//success
					resolve('signed success')
				}
				else {
					resolve(`signed fail.result=${JSON.stringify(result)}`)
				}
			}
		});
	})

}

const ssocookies = [
	"6435FA9EC9F6A64B105276D0223D129D"
];

ssocookies.map(async(cookie)=> {
	try {
		const message = await sign(cookie);
		console.log(message);
	}
	catch (ex) {
		console.error(ex);
	}
});