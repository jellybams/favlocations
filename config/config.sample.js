module.exports = {
	development : {
		db: 'mongodb://localhost/favlocations',
		secret: 'somesecretstring'
	},

	production : {
		db: 'mongodb://<username:<password>@<hostname>:<port>/favlocations',
		secret: 'somesecretstring'
	}
};