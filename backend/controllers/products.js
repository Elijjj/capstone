const Product = require('../models/product');

exports.createProduct = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const product = new Product({
      productType: req.body.productType,
      productName: req.body.productName,
      productDescription: req.body.productDescription,
      imagePath: url + "/images/" + req.file.filename,
      price: req.body.price,
      quantity: req.body.quantity,
      size: req.body.size,
    });
    product.save().then(createdProduct => {
        res.status(201).json({
          message: "Product added successfully",
          products: {
            ...createdProduct,
            id: createdProduct._id
          }
        });
      }).catch(error => {
        res.status(500).json({
          message: "Creating product failed!",
          error: error  // Include the error details for debugging
        });
      });      
  }

  exports.updateProduct = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const product = new Product ({
        _id: req.body.id,
        productType: req.body.productType,
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        imagePath: imagePath,
        price: req.body.price,
        quantity: req.body.quantity,
        size: req.body.size
    });
    Product.updateOne({_id: req.params.id }, product).then(result => {
        if(result.matchedCount > 0){
            res.status(200).json({message:"Update successful!"});
        } else {
            res.status(401).json({message:"Not authorized!"});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Couldn't update product!"
        });
    });
}

exports.getProducts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const searchTerm = req.query.searchTerm;
    let productQuery;

    if (searchTerm) {
        productQuery = Product.find({ productName: new RegExp(searchTerm, 'i') });
    } else {
        productQuery = Product.find();
    }

    let fetchedProducts;
    if (pageSize && currentPage) {
        productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    productQuery.then(documents => {
        fetchedProducts = documents;
        if (searchTerm) {
            return Product.find({productName: new RegExp(searchTerm, 'i')}).countDocuments();
        } else {
            return Product.countDocuments();
        }
    }).then(count => {
        res.status(200).json({
            message: "Products fetched successfully!",
            products: fetchedProducts,
            maxProducts: count
        });
    }).catch(error => {
        res.status(500).json({
            message: "Fetching products failed!"
        });
    });
};



exports.getProduct = (req, res, next) => {
    Product.findById(req.params.id).then(product => {
        if(product) {
            res.status(200).json(product);
        }
        else{
            res.status(404).json({message:'Product not found!'});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching product failed!"
        });
    });;
}

exports.getMenuProduct = (req, res, next) => {
    Product.findById(req.params.id).then(product => {
        if(product) {
            res.status(200).json(product);
        }
        else{
            res.status(404).json({message:'Product not found!'});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching product failed!"
        });
    });;
}

exports.getByocProduct = (req, res, next) => {
    Product.findById(req.params.id).then(product => {
        if(product) {
            res.status(200).json(product);
        }
        else{
            res.status(404).json({message:'Product not found!'});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching product failed!"
        });
    });;
}

exports.deleteProduct = (req, res, next) => {
    Product.deleteOne({_id: req.params.id }).then (result =>{
        console.log(result);
        if(result.deletedCount > 0){
            res.status(200).json({message:"Deletion successful!"});
        } else {
            res.status(401).json({message:"Not authorized!"});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Deleting product failed!"
        });
    });;
}