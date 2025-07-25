'use strict';

const express = require('express');
const router = express.Router();
const AccessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

//signup
router.post('/shop/signup', asyncHandler(AccessController.signup))
router.post("/shop/login", asyncHandler(AccessController.login));
// authentication

router.use(authentication)
router.post('/shop/logout', asyncHandler(AccessController.logout))
router.post("/shop/handlerRefreshToken", asyncHandler(AccessController.handlerRefreshToken));

module.exports = router;