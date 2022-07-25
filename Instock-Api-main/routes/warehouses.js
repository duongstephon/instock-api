const express = require('express')
const router = express.Router()
const fs = require('fs')
const { v4: uuid } = require('uuid');

const readWarehouses = () => {
    const warehouseDataFile = fs.readFileSync('./data/warehouses.json');
    const warehouseData = JSON.parse(warehouseDataFile);
    return warehouseData;
}

const readInventory = () => {
    const inventoryDataFile = fs.readFileSync('./data/inventories.json')
    const inventoryData = JSON.parse(inventoryDataFile)
    return inventoryData
}

//GET all warehouses
router.get('/', (req, res) => {
    const warehouseList = readWarehouses();
    return res.status(200).json(warehouseList);
})

//GET single warehouse info
router.get('/:warehouseId', (req, res) => {
    const currentWarehouseId = req.params.warehouseId;
    const warehouseDataFile = fs.readFileSync('./data/warehouses.json')
    const warehouseData = JSON.parse(warehouseDataFile)
    const currentWarehouse = warehouseData.find(warehouse => warehouse.id === currentWarehouseId)

    if (!currentWarehouse) {
        res.status(404).send('No warehouse found')
        return;
    }

    res.status(200).json(currentWarehouse)
})

// GET inventory of specific 
router.get('/:warehouseId/inventory', (req, res) => {
    const inventoryData = readInventory();
    const currentWarehouseId = req.params.warehouseId;
    // console.log(currentWarehouseId, inventoryData);
    let filteredInventoryData = inventoryData.filter(item => {
        return item.warehouseID === currentWarehouseId
    })
    res.status(200).json(filteredInventoryData);
})

//ADD warehouse
router.post('/', (req, res) => {

    if (!req.body.name || !req.body.address || !req.body.city || !req.body.country || !req.body.contact.name || !req.body.contact.position || !req.body.contact.phone || !req.body.contact.email) {
        return res.status(400).send('All fields are required');

    }
    const warehouseData = readWarehouses();

    const newWarehouse = {
        id: uuid(),
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        contact: {
            name: req.body.contact.name,
            position: req.body.contact.position,
            phone: req.body.contact.phone,
            email: req.body.contact.email,
        }
    };

    warehouseData.push(newWarehouse);

    fs.writeFileSync('./data/warehouses.json', JSON.stringify(warehouseData));

    res.status(201).json(newWarehouse);
});


// DELETE single warehouse
router.delete('/:warehouseId', (req, res) => {
    const selectedWarehouseId = req.params.warehouseId;
    const warehouseList = readWarehouses();
    const selectedFilteredOutList = warehouseList.filter(warehouse => warehouse.id !== selectedWarehouseId);

    fs.writeFileSync('./data/warehouses.json', JSON.stringify(selectedFilteredOutList));

    res.status(204).json(); // write new filtered list to file
});


// PATCH REQUEST edit a warehouse
router.patch('/:warehouseId', (req, res) => {
    const selectedWarehouseId = req.params.warehouseId;
    const warehouseList = readWarehouses();
    const selectedFilteredOutList = warehouseList.filter(warehouse => warehouse.id !== selectedWarehouseId);

    selectedFilteredOutList.push(req.body);

    fs.writeFileSync('./data/warehouses.json', JSON.stringify(selectedFilteredOutList));

    res.status(204).json();
});

module.exports = router;
