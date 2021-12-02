const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/suppliersController');

router.get('/', suppliersController.getSuppliers);

module.exports = router;