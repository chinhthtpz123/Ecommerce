'use strict';

const express = require('express');
const router = express.Router();
const AccessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth')

//signup
router.post('/shop/signup', asyncHandler(AccessController.signup))

module.exports = router;