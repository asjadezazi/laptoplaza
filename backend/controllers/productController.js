const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncError = require("../middleware/catchAsyncError")

// create Product API
exports.createProduct =catchAsyncError(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
    next();
}) 

// get all product API
exports.getAllProducts = catchAsyncError(async(req, res) => {
    const products = await Product.find();
       
      res.status(200).json({
        status: true,
        products,
    });
})  

// update produuct API
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        product,
    });
}) 

// delete produuct API

exports.deleteProduct =catchAsyncError( async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    await product.deleteOne();
    console.log(product);

    res.status(200).json({
        success: true,
        message: "Product delete Successfully",
    });
})

// product detail API

exports.getProductDetails =catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        success: true,
        product,
    });
}) 
