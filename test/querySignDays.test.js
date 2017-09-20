import {querySignStatus} from '../src/index'

test('query sign days', async()=> {
	const status = await querySignStatus('walle', '6435FA9EC9F6A64B105276D0223D129D', '2x5U9yCPqSRjrChOXUO6gy1osMD3WwpYznCtPhBY2MxDj2_RoAT7!3057625');
	console.log(status);
})