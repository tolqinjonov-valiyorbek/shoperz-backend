const Order = require('../models/orderProducts.js');
const User = require("../models/User.js");


const createOrder = async (req, res) => {
    if (req.body.orderItems.length === 0) {
        res.status(400).send({
            message: 'Empty cart'
        });
    } else {
        const order = new Order({
            orderItems: req.body.orderItems,
            shippingAddress: req.body.shippingAddress,
            PaymentMethod: req.body.PaymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            totalPrice: req.body.totalPrice,
            user: req.user._id
        });

        try {
            const savedOrder = await order.save();

            // Foydalanuvchi obyektiga buyurtmani qo'shish
            const user = await User.findById(req.user._id);
            user.order.push(savedOrder._id);
            await user.save();

            res.status(201).json({
                message: 'order created',
                order: savedOrder
            });
        } catch (error) {
            res.status(500).json({ error: 'Buyurtma yaratishda xatolik yuz berdi.' });
        }
    }
};




const viewOrder = async (req, res) => {
    const order =  await Order.findById(req.params.id)
    if(order) {
        res.send(order)
    } else {
        res.status(404).send({
            message: 'not found'
        })
    }
}


module.exports = {
    createOrder,
    viewOrder
}