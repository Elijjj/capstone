const Inventory = require('../models/inventory');

exports.createItem = (req, res, next) => {
    const inventory = new Inventory({
      item: req.body.item,
      description: req.body.description,
      quantity: req.body.quantity,
    });
    inventory.save().then(createdItem => {
      res.status(201).json({
        message: "Item added successfully!",
        inventory: {
          id: createdItem._id,
          ...createdItem
        }
      });
    }).catch(error => {
        res.status(500).json({
            message: "Creating a item failed!"
        });
    });
  }

  exports.updateItem = (req, res, next) => {
    const inventory = new Inventory ({
        _id: req.body.id,
        item: req.body.item,
        description: req.body.description,
        quantity: req.body.quantity
    });
    Inventory.updateOne({_id: req.params.id }, inventory).then(result => {
        if(result.matchedCount > 0){
            res.status(200).json({message:"Update successful!"});
        } else {
            res.status(401).json({message:"Not authorized!"});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Couldn't update item!"
        });
    });
}

exports.getItems = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const itemQuery = Inventory.find();
    let fetchedItems;
    if (pageSize && currentPage){
        itemQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    itemQuery.then(documents => {
        fetchedItems = documents;
        return Inventory.count();
    }).then(count =>{
        res.status(200).json({
            message: "Items fetched successfully!",
            inventory: fetchedItems,
            maxItems: count
        });
    }).catch(error => {
        res.status(500).json({
            message: "Fetching items failed!"
        });
    });
}

exports.getItem = (req, res, next) => {
    Inventory.findById(req.params.id).then(item => {
        if(item) {
            res.status(200).json(item);
        }
        else{
            res.status(404).json({message:'Item not found!'});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching item failed!"
        });
    });;
}

exports.deleteItem = (req, res, next) => {
    Inventory.deleteOne({_id: req.params.id }).then (result =>{
        console.log(result);
        if(result.deletedCount > 0){
            res.status(200).json({message:"Deletion successful!"});
        } else {
            res.status(401).json({message:"Not authorized!"});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Deleting item failed!"
        });
    });;
}