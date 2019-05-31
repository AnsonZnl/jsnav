const express = require('express')
const router = express.Router()
const moment= require('moment')
const MessagetModel = require('../models/message')

router.get('/', function (req, res,next) {
    MessagetModel.getMessages()
    .then(function (m) {
        res.render('about', {
            m: m
        })
        // res.send(c);
        
    })
    .catch(next)
})

// blog /comments 创建一条留言
router.post('/', function (req, res) {
    const author = req.fields.blogId
    const content = req.fields.content
    // 校验参数
    try {
        if (!content.length) {
            res.json({message: '请填写留言内容'});
            throw new Error('请填写留言内容')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.json({error: e.message});
    }

    const comment = {
        created_at: moment().format('YYYY-MM-DD hh:mm:ss'),
        author: author,
        content: content
    }
    // console.log(comment)
    //  return
    MessagetModel.create(comment)
        .then(function () {
            req.flash('success', '留言成功');
            res.json({message: '留言成功'})
            // 留言成功后跳转到上一页
            //res.redirect('back')
        })
})

module.exports = router
