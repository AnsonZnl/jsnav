const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signin')
})

// blog /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
    const name = req.fields.name
    const password = req.fields.password
    // 校验参数
    try {
        if (!name.length) {
            throw new Error('请填写用户名')
        }
        if (!password.length) {
            throw new Error('请填写密码')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    UserModel.getUserByName(name)
        .then(function (user) {
            if (!user) {
                res.json({message: '用户不存在'})
            }
            // 检查密码是否匹配
            if (sha1(password) !== user.password) {
                res.json({message: '用户名或密码错误'})
            }
            // 用户信息写入 session
            delete user.password
            req.session.user = user
            res.status(200).json({status: 200, message: '登录成功'})
            // res.redirect('blog')
        })
        .catch(next)
})

module.exports = router
