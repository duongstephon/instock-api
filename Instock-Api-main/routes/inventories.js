const express = require('express')
const router = express.Router()
const fs = require('fs')
const { v4: uuid } = require('uuid');

const readInventory = () => {
    const inventoryDataFile = fs.readFileSync('./data/inventories.json')
    const inventoryData = JSON.parse(inventoryDataFile)
    return inventoryData
}

//GET all inventory
router.get('/', (req, res) => {
    const inventoryList = readInventory();
    return res.status(200).json(inventoryList);
})

//GET single inventory item
router.get('/:inventoryId', (req, res) => {
    const currentInventoryId = req.params.inventoryId
    const inventoryDataFile = fs.readFileSync('./data/inventories.json')
    const inventoryData = JSON.parse(inventoryDataFile)
    const currentInventoryItem = inventoryData.find(item => item.id === currentInventoryId)

    if (!currentInventoryItem) {
        res.status(400).send("No inventory item found")
        return;
    }
    res.status(200).json(currentInventoryItem)
})

//ADD inventory
router.post('/', (req, res) => {
    if (!req.body.warehouseName || !req.body.itemName || !req.body.description || !req.body.category || !req.body.status || !req.body.quantity) {
        return res.status(400).send('Please try again, all fields are required');
    }
    if (isNaN(parseInt(req.body.quantity))) {
        return res.status(400).send('Quantity should be a number');
    }
    const inventoryData = readInventory();

    const newInventory = {
        id: uuid(),
        warehouseID: req.body.warehouseID,
        warehouseName: req.body.warehouseName,
        itemName: req.body.itemName,
        description: req.body.description,
        category: req.body.category,
        status: req.body.status,
        quantity: Number(req.body.quantity),
    };
    inventoryData.push(newInventory);

    fs.writeFileSync('./data/inventories.json', JSON.stringify(inventoryData));

    res.status(201).json(newInventory);
});

router.delete('/:inventoryId', (req, res) => {
    const inventoryList = readInventory();
    const selectedInventoryId = req.params.inventoryId;
    const selectedFilteredOutList = inventoryList.filter(inventory => inventory.id !== selectedInventoryId);
    fs.writeFileSync('./data/inventories.json', JSON.stringify(selectedFilteredOutList));

    res.status(204).json();
});

//PATCH REQUEST update an inventory item 
router.patch('/:inventoryId', (req, res) => {
    const selectedInventoryId = req.params.inventoryId;
    const inventoryList = readInventory();
    const selectedFilteredOutList = inventoryList.filter(inventory => inventory.id !== selectedInventoryId);

    selectedFilteredOutList.push(req.body);

    fs.writeFileSync('./data/inventories.json', JSON.stringify(selectedFilteredOutList));

    res.status(204).json();
});

module.exports = router;
