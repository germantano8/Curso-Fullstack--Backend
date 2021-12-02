const models = require('../models');

const getProducts = async (req, res) => {
    try{
        const response = await models.Products.find();
        
        return res.status(200).json({
            data: response,
            error: false
        })
    }catch(error){
        return res.status(500).json({
            message: error,
            error: true
        });
    }
}

module.exports = {
    getProducts
}