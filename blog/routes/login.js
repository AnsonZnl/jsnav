const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /login 注册页
router.get('/', checkNotLogin, function (req, res, next) {
    res.render('login')
})

// blog /login 用户注册
router.post('/post', function (req, res, next) {
    const name = req.fields.name
    const gender = req.fields.gender
    const bio = req.fields.bio
    var avatar
    if (req.files.avatar) {
        avatar = req.files.avatar.path.split(path.sep).pop()
    } else {
        avatar = ''
    }
    let password = req.fields.password
    const repassword = req.fields.repassword
    // 校验参数
    try {
        if (!(name.length >= 1 && name.length <= 10)) {
            res.json({message: '名字请限制在 1-10 个字符'})
        }
        if (['m', 'f', 'x'].indexOf(gender) === -1) {
            res.json({message: '性别只能是 m、f 或 x'})
        }
        if (!(bio.length >= 1 && bio.length <= 30)) {
            res.json({message: '简介字数不符'})
        }

        if (password.length < 6) {
            res.json({message: '密码至少 6 个字符'})
        }
        if (password !== repassword) {
            res.json({message: '两次输入密码不一致'})
        }
    } catch (e) {
        // 注册失败，异步删除上传的头像
        fs.unlink(req.files.avatar.path)
        res.json({message: e.message})
    }

    // 明文密码加密
    password = sha1(password)

    // 待写入数据库的用户信息
    let user = {
        name: name,
        password: password,
        gender: gender,
        bio: bio,
        avatar: avatar
    }
    // 用户信息写入数据库
    UserModel.create(user)
        .then(function (result) {
            // 此 user 是插入 mongodb 后的值，包含 _id
            user = result.ops[0]
            // 删除密码这种敏感信息，将用户信息存入 session
            delete user.password
            req.session.user = user
            // 写入 flash
            res.status(200).json({message: '注册成功'})

        })
        .catch(function (e) {
            // 注册失败，异步删除上传的头像
            fs.unlink(req.files.avatar.path)
            // 用户名被占用则跳回注册页，而不是错误页
            if (e.message.match('duplicate key')) {
                res.json({message: '用户名已被占用'})
            }
            next(e)
        })
})

module.exports = router
