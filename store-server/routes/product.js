// Node Module dependencies
var express = require('express');
var router = express.Router();


// Local Module dependencies
var common = require('./common.js');

common.autoIncrement.initialize(common.conn);

var ProductSchema = common.Schema({
    _id: { type: common.Schema.Types.ObjectId, ref: 'product_id' },
    product_name: String,
    quantity:Number,
    aisle_no: Number,
    shelf:String,
    barcode_id:String

});


ProductSchema.plugin(common.autoIncrement.plugin, 'product_id');
var Product = common.conn.model('Product', ProductSchema);

router.route('/:id?')
.get(function(req, res, next) {
	//console.log("req.session.user"+JSON.stringify(req.session.passport.user));
	
	console.log("req param in get: " +req.param("id"));
	if(req.param("id"))
	{
		getProductDetailsById(req.param("id"), function(items) {
			console.log("items: "+items);
			res.send(items);
		});
	} else{
		
		getProductDetails(function(items) {
			console.log("items: "+items);
			res.send(items);
		});
		
	}
})
//=========================================post operations===========================================================
router.route('/addproduct/?')
.post(function(req, res, next) {
	
	var item = new Product(req.body);
	postProduct(item, function(result) {
		res.send(result);
	});
})
//==============================================================================================================================
function postProduct(item, fn) {
	
	item.save(function (err) {
		  if (err) console.log(err);
			console.log("item: "+item);
			fn(item);
	});
}

function getProductDetails(fn) {
	Product.find({},'',{sort:{_id:1}})
	.exec(function (err, item) {
			return fn(item);
	})
}

// get event by id
function getProductDetailsById(pID, fn) {
    Product.findOne({barcode_id: pID})
	.exec(function (err, obj) {
			return fn(obj);
	})
}

module.exports = router;