export function listen(id, fn) {
	const u = dt.config.paver_endpoint.replace(/^http/, 'ws');

	const c = new WebSocket(`${u}/socket?id=${id}`);

	c.addEventListener("open", e => console.log("WebSocket Connected", e));

	c.addEventListener("close", e => console.log(`WebSocket Disconnected`, e));

	c.addEventListener("message", e => typeof fn === 'function' ? fn(e.data) : null);

	return new Promise(r => c.addEventListener("open", _ => r()));
};
