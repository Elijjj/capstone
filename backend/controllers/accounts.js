const Account = require('../models/user');

exports.getAccounts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const accountQuery = Account.find();
    let fetchedAccounts;
    if (pageSize && currentPage){
        accountQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    accountQuery.then(documents => {
        fetchedAccounts = documents;
        return Account.count();
    }).then(count =>{
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
}

exports.getAccount = (req, res, next) => {
    Account.findById(req.params.id).then(account => {
        if(account) {
            res.status(200).json(account);
        }
        else{
            res.status(404).json({message:'Account not Found!'});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching account failed!"
        });
    });;
}

// exports.updateDiscount = (req, res, next) => {
//     Account.findById(req.params.id).then(account => {
//         if(account) {
//             res.status(200).json(account);
//         }
//         else{
//             res.status(404).json({message:'Account not Found!'});
//         }
//     }).catch(error => {
//         res.status(500).json({
//             message: "Fetching account failed!"
//         });
//     });;
// }

exports.updateDiscount = (req, res, next) => {  
    const updatedFields = {
        discountType: req.body.discountType,
        discountStatus: req.body.discountStatus
    };

    Account.updateOne({ _id: req.params.id }, { $set: updatedFields }).then(result => {
        if(result.matchedCount > 0) {
            console.log(updatedFields);
            res.status(200).json({message:"Update Discount Successful!"});
        } else {
            res.status(401).json({message:"Not Authorized"});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Couldn't update discount!"
        });
    });
}



