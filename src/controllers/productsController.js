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

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const response = await models.Products.findById(productId);

        if (response) {
            res.status(200).json({
                data: response,
                error: false,
            });
        } else {
        res.status(404).json({
            msg: "El producto no existe",
            error: true,
        });
        }
    } catch (error) {
        return res.status(500).json({
            msg: error,
            error: true,
        });
    }
}

const addProduct = async (req, res) => {
    try {
        const product = new models.Products(req.body);

        if(!validFields(req.body)){
            res.status(400).json({
                error: true,
                msg: "Los campos no son válidos",
            });
        }

        const supplier = await models.Suppliers.findById(req.body.idSupplier);
        
        if (!supplier) {
            res.status(400).json({
                error: true,
                msg: "El proveedor no existe",
            });
        }
        
        await product.save();
        res.status(200).json({
            data: product,
            error: false,
        });
    } catch (error) {
        return res.status(500).json({
            msg: error,
            error: true,
        });
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        if(!validFields(req.body)){
            res.status(400).json({
                error: true,
                msg: "Los campos no son válidos",
            });
        }

        const supplier = await models.Suppliers.findById(req.body.idSupplier);

        if (!supplier) {
            res.status(400).json({
                error: true,
                msg: "El proveedor no existe",
            });
        }

        const product = await models.Products.findByIdAndUpdate(
            productId,
            req.body,
            // el new: true, retorna el objeto ya actualizado, y no el objeto antes de actualizar
            { new: true }
        );
    
        if (product) {
            res.status(200).json({
                error: false,
                data: product,
            });
        } else {
            res.status(400).json({
                error: true,
                msg: "El producto no existe",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            msg: error,
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const productResponse = await models.Products.findByIdAndRemove(
            productId
        );

        if (productResponse) {

            res.status(200).json({
                error: false,
                data: {
                    product: productResponse,
                },
                msg: `El producto con id ${productId} fue eliminado exitosamente`,
            });
        } else {
            res.status(404).json({
                error: true,
                msg: "El producto no existe",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            msg: error,
        });
    }
}

const validFields = (body) => {
    const fields = [
        'title',
        'price',
        'stock',
        'idSupplier',
    ];

    if(fields && body.price > 0){
        return true;
    }else{
        return false;
    }
}



module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
}