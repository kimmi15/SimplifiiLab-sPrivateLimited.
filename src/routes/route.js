const express = require('express')
const router = express.Router()
const {generateOtp, userLogin} = require('../controllers/userController')

router.post('/generateOtp', generateOtp)
router.post('/login', userLogin)
module.exports = router;