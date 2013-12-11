(function(exports) {
	exports.settings = {
		POST_MAX_SIZE : 40, // MB
		UPLOAD_MAX_FILE_SIZE : 40, // MB
		ROOT_DIR : (__dirname + '/../').replace(new RegExp(
				/[\\|\/][^\/|\\]+\/\.\.\//g), "\\"),
		DATABASE : {
			database : 'nttchat',
			user : 'root',
			password : '7144'
		},
		COOKIE_EXPIRED : 1800000, // 3600000 = 1h
		URL : '',
	}
})(typeof (exports) === 'undefined' ? window : exports);