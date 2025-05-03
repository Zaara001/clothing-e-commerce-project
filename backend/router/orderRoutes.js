const express = require('express');
const router = express.Router();

const { createOrder } = require('../controller/orderController');
const { getUserOrders } = require('../controller/orderController');


const verifyToken = require('../middleware/authMiddleware');


router.post('/', verifyToken, createOrder);

router.get('/all-orders', verifyToken, getUserOrders);

module.exports = router;
