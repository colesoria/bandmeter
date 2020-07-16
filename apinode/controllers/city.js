var mongoose = require('mongoose');
var City = mongoose.model('City');

exports.findAllCities = function(req,res){
	City.find(function(err,cities){
		if(err) res.send(500, err.message);
		res.status(200).jsonp(cities);
	});
}

exports.findByName = function(req,res){
	City.findOne(req.params.name, function(err,city){
		if(err) return res.send(500, err.message);
		res.status(200).jsonp(city);
	});
}

exports.addCity = function(req,res){
	var city = new City({
		name: req.body.name,
		coutry: req.body.country
	});
	city.save(function(err,city){
		if(err) return res.send(500, err.message);
		res.status(200).jsonp(city);
	});
}

exports.updateCity = function(req,res){
	City.findById(req.params.id, function(err, city){
		city.name = req.body.name;
		city.country = requ.body.coutry;
		city.save(function(err){
		if(err) return res.send(500, err.message);
			res.status(200).jsonp(city);
		});
	});
}

exports.deleteCity = function(req,res){
	City.findById(req.params.id, function(err,city){
		city.remove(function(err){
			if(err) return res.send(500, err.message);
			res.status(200);
		});
	});
}
