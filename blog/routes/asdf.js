const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
    res.render('asdf')
})
router.post('/', function (req, res, next) {
    res.json({xx:'asdfaaaaaaa'})
})

module.exports = router
