const CartItem = require('../models/cart');

exports.addToCart = (req, res, next) => {
    const userId = req.userData.userId;
    const productId = req.params.productId;
    const selectedQuantity = req.body.selectedQuantity || 1;
    const quantity = req.body.quantity || 1;
    const price = req.body.price;
    const originalPrice = req.body.originalPrice;
    const size = req.body.size;
    const imagePath = req.body.imagePath;
    const productDescription = req.body.productDescription;
    const productName = req.body.productName;
    const productType = req.body.productType;
    const toppings = req.body.toppings;
    const crust = req.body.crust;
    const flowers = req.body.flowers;

    const cartItem = new CartItem({
        userId: userId,
        productId: productId,
        selectedQuantity: selectedQuantity,
        quantity: quantity,
        price: price,
        size: size,
        originalPrice: originalPrice,
        imagePath: imagePath,
        productDescription: productDescription,
        productName: productName,
        productType: productType,
        toppings: toppings,
        crust: crust,
        flowers: flowers,
    });

    cartItem.save()
        .then(result => {
            res.status(200).json({ message: 'Product added to cart successfully!', cartItem: result.productName });
        })
        .catch(error => {
            res.status(500).json({ error: error });
        });
};
exports.getCart = (req, res, next) => {
    const userId = req.userData.userId;

    const cartQuery = CartItem.find({userId: userId});
    let fetchedCart;
    cartQuery.then(documents => {
        fetchedCart = documents;
        return CartItem.count();
    }).then(count =>{
        res.status(200).json({
            message: "Cart fetched successfully!",
            carts: fetchedCart,
        });
    }).catch(error => {
        res.status(500).json({
            message: "Fetching cart failed!"
        });
    });
}

exports.updateCart = (req, res, next) => {
    const { userId, productId } = req.params;

    const updatedCartItem = {
        userId: req.body.userId,
        productId: req.body.productId,
        productType: req.body.productType,
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        imagePath: req.body.imagePath,
        originalPrice: req.body.originalPrice,
        price: req.body.price,
        selectedQuantity: req.body.selectedQuantity,
        quantity: req.body.quantity,
        size: req.body.size,
        toppings: req.body.toppings,
        crust: req.body.crust,
        flowers: req.body.flowers
    };

    CartItem.updateOne({ productId: req.params.productId, userId: req.userData.userId }, updatedCartItem)
        .then(result => {
            if (result.matchedCount > 0) {
                res.status(200).json({ message: "Update successful!" });
            } else {
                res.status(401).json({ message: "Not authorized or No Modification needed!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Couldn't update product!"
            });
        });
}

exports.deleteCartItem = (req, res, next) => {
    CartItem.deleteOne({productId: req.params.productId}).then(result =>{
        console.log(result);
        if(result.deletedCount > 0){
            res.status(200).json({message:"Product removed!"});
        } else {
            res.status(401).json({message:"Not authorized!"});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Product removal failed!"
        });
    });;
}