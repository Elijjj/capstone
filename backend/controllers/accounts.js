const Account = require('../models/user');

exports.getAccounts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const discountStatus = req.query.discountStatus;

    // Initialize the query with all accounts, excluding 'Admin' role
    let accountQuery = Account.find({ role: { $ne: 'Admin' } }); // Exclude Admin accounts

    // Filter based on discountStatus if provided
    if (discountStatus) {
        accountQuery = accountQuery.find({ discountStatus: discountStatus });
    }

    let fetchedAccounts;

    // Apply pagination
    if (pageSize && currentPage) {
        accountQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    // Execute the query to get the accounts
    accountQuery.then(documents => {
        fetchedAccounts = documents;
        // If filtering, count the filtered documents; otherwise, count all non-Admin documents
        let countQuery = Account.find({ role: { $ne: 'Admin' } }); // Count query excluding Admin
        if (discountStatus) {
            countQuery = countQuery.find({ discountStatus: discountStatus });
        }
        return countQuery.countDocuments();
    }).then(count => {
        res.status(200).json({
            message: "Accounts fetched successfully!",
            accounts: fetchedAccounts,
            maxAccounts: count
        });
    }).catch(error => {
        res.status(500).json({
            message: "Fetching accounts failed!"
        });
    });
};


exports.getAccount = (req, res, next) => {
    Account.findById(req.params.id).then(account => {
        if(account) {
            res.status(200).json(account);
        }
        else{
            res.status(404).json({message:'Account not found!'});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching account failed!"
        });
    });;
}

exports.updateDiscount = (req, res, next) => {  
    const updatedFields = {
        discountType: req.body.discountType,
        discountStatus: req.body.discountStatus
    };

    Account.updateOne({ _id: req.params.id }, { $set: updatedFields }).then(result => {
        if(result.matchedCount > 0) {
            console.log(updatedFields);
            res.status(200).json({message:"Update discount successful!"});
        } else {
            res.status(401).json({message:"Not authorized!"});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Couldn't update discount!"
        });
    });
}



