const express = require('express');
const router = express.Router();

const CheckController = require('../controllers/checkController');

router
    .route('/checks/')
    .get(CheckController.getAllChecks)
    .post(CheckController.createNewCheck);

router
    .route('/checks/:id')
    .get(CheckController.findCheckById)
    .patch(CheckController.updateCheck)
    .delete(CheckController.deleteCheck);

module.exports = router;