const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler")

// create Product API
exports.createProduct = async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
};

// get all product API
exports.getAllProducts = async (req, res) => {
    const products = await Product.find();

    res.status(200).json({
        status: true,
        products,
    });
};

// update produuct API
exports.updateProduct = async (req, res, next) => {
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
};

// delete produuct API

exports.deleteProduct = async (req, res, next) => {
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
};

// product detail API

exports.getProductDetails = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        success: true,
        product,
    });
};
