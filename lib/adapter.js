/*!
 * jsdom-cheerio-adapter
 * Copyright (c) 2015 Leonard Wu <leonard.wu92@alumni.ic.ac.uk>
 * https://github.com/leonardw/jsdom-cheerio-adapter
 * MIT Licensed
 */
(function () {
	function _constructor(cheerio, request) {
		function procHtml(err, resp, html, callbk) {
			var window = {
				$: undefined,
				close: function(){}
			};
			if (!err && (resp === null || resp.statusCode === 200)) {
				window.$ = cheerio.load(html);
			} else if (!err) {
				err = 'Error HTTP response status ' + resp.statusCode;
			}
			callbk(err, window);
		}
		function procLink(link, callbk) {
			request(link, function(error, resp, html) {
				procHtml(error, resp, html, callbk);
			});
		}
		function _env(args) {
			console.log('html: ' +  args.html);
			console.log('scripts: ' +  args.scripts);
			console.log('done: ' +  args.done);
			
			if (args.html.indexOf('http:')===0 || args.html.indexOf('https:')===0) {
				procLink(args.html, args.done);
			} else {
				procHtml(null, null, args.html, args.done);
			}
		}
		return {
			env: _env
		};
	}
	if (typeof module !== 'undefined' && module.exports) {
		// Running in Node.js
		module.exports = _constructor;
	} else {
		// We are lost
		console.error('Unknown execution environment. Giving up.');
	}
})();
