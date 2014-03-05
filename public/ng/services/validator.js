
/**
 * Manage Module Validator Service
 */
favlocations.module.factory('Validator', function() {

	function validator(rules) {

		this.rules = [];
		var This = this;

		if (rules.custom) {
			rules.custom.forEach(function(rule) {
				This.addRule(rule.field, rule.test, false);
			});
		}

		if (rules.reqd) {
			rules.reqd.forEach(function(reqd) {
				This.addRule(reqd, validator.func.reqd, true);
			});
		}	

		if (rules.url) {
			rules.url.forEach(function(url) {
				This.addRule(url, validator.func.url, false);
			});
		}		
	}

	validator.func = {
		reqd : function(form, fieldname) {
			console.log('running req for ' + fieldname);
			if (!form[fieldname] || form[fieldname] === 0) {
				console.log('req failed for ' + fieldname);
				return "Field cannot be empty";
			}
		},
		price : function(form, fieldname) {
			if (!form[fieldname].match(/^\-?\d+(\.\d{1,2})?$/)) {
				return "Invalid amount";
			}			
		},
		date : function(form, fieldname) {
			
			// if date is an object, convert it to string
			if (typeof form[fieldname] == 'object') {				
				var date = Manage.Date.format('yyyy-MM-dd', form[fieldname]);
			} else {
				date = form[fieldname];	
			}

			if (!date.match(/\d{4}-[01]?\d-[0-3]?\d/)) {
				return "Invalid date";
			}
		},
		number : function(form, fieldname) {
			var val = form[fieldname];
			if (!form[fieldname].match(/^\d+(\.\d+)?$/)) {
				return "Invalid number";
			}
		},
		integer : function(form, fieldname) {
			var val = form[fieldname] + '';
			if (!val.match(/^\-?\d+$/)) {
				return "Invalid integer";
			}
		},
		positive : function(form, fieldname) {
			var val = form[fieldname];
			if (parseFloat(val) < 0) {
				return "Cannot be negative";	
			}
		},
		url : function(form, fieldname) {
			var val = form[fieldname] + '';
			var urlregex = new RegExp(
            "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
            if (!urlregex.test(val))
				return "Url is not valid (maybe http:// is missing?)";
		},
	};

	/**
	 * adds validator rules
	 *
	 * @param   Field 	string   	field name to validate
	 * @param   test	function	Value to find
	 * @param   req 	bool 		True to return index in list, else return object
	 *
	 * @return  mixed
	 */
	validator.prototype.addRule = function(field, test, reqd) {
		this.rules.push({field : field, test : test, reqd : reqd});
	};

	validator.prototype.test = function(form) {
		var errors = [], res;

		this.rules.forEach(function(rule) {
			var func = rule.test;
			//console.log(rule.field, form, form[rule.field]);
			if ( (rule.reqd && typeof form[rule.field] == 'undefined') || (typeof form[rule.field] != 'undefined' && (res = func(form, rule.field))) ) {
				errors.push({field : rule.field, error : res});
			};
		});

		if (errors.length) {
			return errors;	
		}

		return true;
	};


	Validator = {
		func : validator.func
	};

	Validator.create = function(rules) {
		return new validator(rules);
	};

	return Validator;

});

