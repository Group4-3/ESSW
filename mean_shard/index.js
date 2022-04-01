var express = require('express');
var express_app = express();

function allRoute(req, res)
{
	console.log(req);
	res.send('<H1>Example Page</H1>');
}

express_app.get('/', allRoute);

express_app.listen(8080, function() {
	console.log('Listening on port 8080');
});
