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
    category:String,
    shelf:String,
    barcode_id:String,
    description:String,
    size: String,
    color:String,
    availability:{ type: String, enum: ['yes', 'no'] },
    price:Number
});


ProductSchema.plugin(common.autoIncrement.plugin, 'product_id');
var Product = common.conn.model('Product', ProductSchema);
//==========================================router calls===========================================================

//------------------------------------------product details and decription-----------------------------------------
router.route('/details/:id?')
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
//------------------------------------------------------------------------------------------------------------------
//--------------------------------------------print products by category---------------------------------------------
router.route('/categorylist/:category?')
.get(function(req,res,next){
    printProductByCategory(req.param("category"),function(category){
    console.log("catetgory: "+category);
    res.send(category);
    });
})

//------------------------------------------------------------------------------------------------------------------
//---------------------------------------------get product price based on id/barcode id-----------------------------

router.route('/price/:id?')
.get(function(req,res,next){
    printPriceById(req.param("id"),function(prod_id){
    console.log("product_id: "+prod_id);
    res.send(prod_id);
    });
})

router.route('/price-barcode/:barcodeid?')
.get(function(req,res,next){
    printPriceByBarcode(req.param("barcodeid"),function(barcode_id){
    console.log("barcode_id: "+barcode_id);
    res.send(barcode_id);
    });
})

//------------------------------------------------------------------------------------------------------------------
//-------------------------------------------get product description by id------------------------------------------

router.route('/description/:id?')
.get(function(req,res,next){
    printDescrptionById(req.param("id"),function(prod_id){
    console.log("product_id: "+prod_id);
    res.send(prod_id);
    });
})

//------------------------------------------------------------------------------------------------------------------
//-------------------------------------------get product availabitlity----------------------------------------------

router.route('/availability/:id?')
.get(function(req,res,next){
    printAvailabilityById(req.param("id"),function(prod_id){
    console.log("product_id: "+prod_id);
    res.send(prod_id);
    });
})


//------------------------------------------------------------------------------------------------------------------
//=========================================post operations==========================================================
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

function printProductByCategory(category,fn){
    Product.find({category:category}).exec(function(err,obj){
        return fn(obj);
    })
}

function printPriceById(prod_id,fn){
    Product.find({_id:prod_id},{price:1}).exec(function(err,obj){
        return fn(obj);
    })
}

function printPriceByBarcode(barcode_id,fn){
    Product.find({barcode_id:barcode_id},{price:1}).exec(function(err,obj){
        return fn(obj);
    })
}

function printDescrptionById(prod_id,fn){
    Product.find({_id:prod_id},{product_name:1,description:1}).exec(function(err,obj){
        return fn(obj);
    })
}


function printAvailabilityById(prod_id,fn){
    Product.find({_id:prod_id},{availability:1}).exec(function(err,obj){
        return fn(obj);
    })
}

// get event by id
function getProductDetailsById(pID, fn) {
    Product.findOne({_id: pID})
	.exec(function (err, obj) {
			return fn(obj);
	})
}
//------------------------------------------------------------------------------------------------------------------
module.exports = router;