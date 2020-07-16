var mongoose = require('mongoose');
var Country = mongoose.model('Country');

exports.findAllCountries = function(req,res){
	Country.find(function(err,countries){
		if(err) res.send(500, err.message);

		console.log('GET /countries')
			res.status(200).jsonp(countries);
	});
}

exports.findByName = function(req,res){
	Country.findOne(req.params.name, function(err,country){
		if(err) return res.send(500, err.message);
		res.status(200).jsonp(country);
	});
}

exports.findById = function(req,res){
	Country.findById(req.params.id, function(err,country){
		if(err) return res.send(500, err.message);
		res.status(200).jsonp(country);
	});
}

exports.addCountry = function(req,res){
	var country = new Country({
		name: req.body.name,
	});
	country.save(function(err,country){
		if(err) return res.send(500, err.message);
		res.status(200).jsonp(country);
	});
}

exports.updateCountry = function(req,res){
	Country.findById(req.params.id, function(err, country){
		country.name = req.body.name;
		country.save(function(err){
			if(err) return res.send(500, err.message);
			res.status(200).jsonp(country);
		});
	});
}

exports.deleteCountry = function(req,res){
	Country.findById(req.params.id, function(err,country){
		country.remove(function(err){
			if(err) return res.send(500, err.message);
			res.status(200);
		});
	});
}
