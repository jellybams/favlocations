module.exports = {
	development : {
		db: 'mongodb://localhost/favlocations',
	},

	production : {
		db: 'mongodb://<username:<password>@<hostname>:<port>/favlocations',
	}
};