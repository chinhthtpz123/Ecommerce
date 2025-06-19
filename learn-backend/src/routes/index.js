'use strict';

const express = require('express');
const { checkApiKey, permissions } = require('../auth/checkAuth');
const router = express.Router();

//check api key 
router.use(checkApiKey)

// permissions api
router.use(permissions('0000'))


router.use('/v1/api', require('./access'));
module.exports = router;