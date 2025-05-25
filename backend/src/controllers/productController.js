const productModel = require('../models/schema');

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

