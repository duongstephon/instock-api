const express = require('express');
const app = express();
const cors = require('cors')

app.use(express.json())
app.use(express.static('public'))
app.use(cors());

const warehouseRoutes = require('./routes/warehouses')
app.use('/warehouses', warehouseRoutes)

const inventoryRoutes = require('./routes/inventories')
app.use('/inventories', inventoryRoutes)

app.listen(8080, () => {
    console.log('server is running')
})

