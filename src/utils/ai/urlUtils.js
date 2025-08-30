const FRONTEND_URL = process.env.FRONTEND_URL;
const generateProductUrl = (productId) => {
  return `${FRONTEND_URL}/products/${productId}`;
};

const generateCategoryUrl = () => {
  return `${FRONTEND_URL}/products`;
};

module.exports = {
  generateProductUrl,
  generateCategoryUrl,
};
