var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var instrumentSchema = new Schema({
	name: {type:String, required:true, index: {unique:true}},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

var musicStyleSchema = new Schema({
	name : {type: String, required: true, index: {unique:true}},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

var bandSchema = new Schema({
	name: {type:String, required:true, index: {unique:true}},
	musicStyle: {type:Schema.Types.ObjectId, ref: 'MusicStyle'},
	logo:{type:String, required: true},
	imageBand: {type:String},
	members: [{member:{type: Schema.Types.ObjectId, ref:"User"}}],
	slug: {type:String, required:true, index:{unique:true}},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

var citySchema = new Schema({
	name:{type: String,required:true},
	coutry:{type: Schema.Types.ObjectId, ref: 'Country'},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

var countrySchema = new Schema({
	code: {type: String, required: true, index: {unique:true}},
	name: {type: String, required: true, index: {unique:true}},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

var permissionSchema = new Schema({
	name: {type:String, required:true},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

var usertypeSchema = new Schema({
	name: {type:String, required:true},
	permissions: [{permission:{type:Schema.Types.ObjectId, ref: 'Permission'}}],
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

var userSchema = new Schema({
	fullname: {type: String},
	nickname: {type: String, index:{unique:true}},
	email: {type: String, index:{unique:true}},
	slug: {type:String, index:{unique:true}},
	token: {type:String},
	password: {type: String},
	active: {type: Boolean, default: 0},
	//country: {type: Schema.Types.ObjectId, ref:'Country'},
	//city: {type: Schema.Types.ObjectId, ref:'City'},
	status:{type:String},
	country: {type: String},
	city: {type: String},
	image:{type:String},
	backgroundImage:{type:String},
	//instruments: [{instrument:{type: Schema.Types.ObjectId, ref:'Instrument'}}],
	instruments: {type:String},
	bands: [{band:{type: Schema.Types.ObjectId, ref: 'Band'}}],
	friends: [{friend:{type: Schema.Types.ObjectId, ref: 'User'}}],
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

var jamRoomSchema = new Schema({
	name: {type:String, index:{unique:true}},
	slug: {type:String, index:{unique:true}},
	token: {type:String},
	owner: {type: Schema.Types.ObjectId, ref:"User"},
	members: [{member:{type: Schema.Types.ObjectId, ref:"User"}}],
	finished:{type:Boolean, default: false},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

var notificationSchema = new Schema({
	sender: {type: Schema.Types.ObjectId, ref:'User', required: true},
	receiver: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	message: {type: String, required: true},
	notificationtype:{type: String, required: true},
	read: {type: Boolean, default: false},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

var notificationTypeSchema = new Schema({
	name: {type:String, required: true},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}	
});

var postSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref:'User', required: true},
	text: {type: String, required: true},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('MusicStyle', musicStyleSchema)
module.exports = mongoose.model('Instrument', instrumentSchema);
module.exports = mongoose.model('City', citySchema);
module.exports = mongoose.model('Country', countrySchema);
module.exports = mongoose.model('Band', bandSchema);
module.exports = mongoose.model('Permission', permissionSchema);
module.exports = mongoose.model('Usertype', usertypeSchema);
module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('JamRoom', jamRoomSchema);
module.exports = mongoose.model('Notification', notificationSchema);
module.exports = mongoose.model('Post', postSchema);