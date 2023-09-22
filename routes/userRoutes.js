const express = require('express')
const userControllers = require('../controllers/userControllers')
const authControllers = require('../controllers/authControllers')
const router = express.Router()

router.post('/signup',authControllers.signup)
router.route('/').get(userControllers.getAllUsers)

// router.route('/:id').get(userControllers.getUser).delete(userControllers.deleteUser).patch(userControllers.updateUser)


module.exports= router

