const express = require('express');
const productRoutes = require('./src/routes/productRoutes');

const app = express();

app.use(express.json());


app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
