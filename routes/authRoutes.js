const express = require('express')
const authController = require('../controller/authController')

const router = express.Router();
router.use(express.json());

router
    .route('/login')
    .get(authController.get_login)
    .post(authController.post_login)

router
    .route('/signup')
    .get(authController.get_signup)
    .post(authController.post_signup)

router
    .route('/logout')
    .get(authController.get_logout)

module.exports = router;
