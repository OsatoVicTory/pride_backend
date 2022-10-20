const Wallet = require("../models/Wallet");
const catchAsync = require("../utils/errorsHandler/catchAsync");

exports.getWallet = catchAsync(async (req, res) => {
    const wallet = await Wallet.findOne({ user: req.user.id });

    if(!wallet) {
        return res.status(200).json({
            status: "success",
            wallet: {}
        });
    }

    return res.status(200).json({
        status: 'success',
        wallet: wallet._doc
    })
});

exports.createWallet = catchAsync(async (req, res) => {

    const userHasWallet = await Wallet.findOne({ user: req.user.id });

    const walletData = ["cardType","cardName","cardNumber","cardCvc","cardExpiry","cardAmount"];
    const wallet = {};
    Object.keys(req.body).forEach(key => {
        if(walletData.includes(key)) wallet[key] = req.body[key];
    });

    wallet["cardAmount"] = wallet["cardAmount"]||0;

    if(userHasWallet) {
        const newWallet = await Wallet.findByIdAndUpdate(
            userHasWallet._id.toString(),
            {...wallet},
            { new: true }
        );

        return res.status(200).json({
            status: 'success',
            wallet: newWallet,
            message: 'Your Wallet has been Updated Successfully'
        })
    }

    wallet["user"] = req.user.id;
    const newWallet = new Wallet(wallet);
    
    await newWallet.save();

    return res.status(200).json({
        status: 'success',
        wallet: req.body,
        message: 'New Wallet Created Successfully'
    })
})