export default defineEventHandler((event) => {
	setResponseHeader(event, 'Access-Control-Allow-Origin', '*');
	setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Api-Key');
	setResponseHeader(event, 'Access-Control-Allow-Credentials', 'true');

	if (event.node.req.method === 'OPTIONS') {
		event.node.res.statusCode = 204;
		event.node.res.end();
	}
});


