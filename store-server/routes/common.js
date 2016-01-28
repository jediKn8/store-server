/*
 common module which provide mongodb connection pool and utility methods
 
 This is a common file and all the common variables can be defined here.
 
 */
 


var Common = {
	
	// Node Module dependencies	
	express : require('express'),
	
	bodyParser : require('body-parser'),
	
	autoIncrement : require('mongoose-auto-increment'),
	
	mongoose : require('mongoose'),
	
	Schema:require('mongoose').Schema,
	
	conn:require('mongoose').createConnection('mongodb://localhost/storeDB'),
	
	// check if the user is authenticated and can access resources 
	ensureAuthenticated : function ensureAuthenticated(req, res, next) {
		/*if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/');*/
	}

};

module.exports = Common;
