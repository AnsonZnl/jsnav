const express = require('express')
const router = express.Router()
const BlogModel = require('../models/blog')
const CommentModel = require('../models/comments')

const checkLogin = require('../middlewares/check').checkLogin

// GET /blog 所有用户或者特定用户的文章页
//   eg: GET /blog?author=xxx
router.get('/', function (req, res, next) {
    const author = req.query.author
    BlogModel.getBlogs(author)
        .then(function (blog) {
            res.render('blog', {
                blog: blog
            })
            // res.send(blog)
        })
        .catch(next)
})


// Blog /blog/create 发表一篇文章
router.post('/create', checkLogin, function (req, res, next) {
    const author = req.session.user._id
    const title = req.fields.title
    const content = req.fields.content

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题')
        }
        if (!content.length) {
            throw new Error('请填写内容')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    let blog = {
        author: author,
        title: title,
        content: content
    }

    BlogModel.create(blog)
        .then(function (result) {
            // 此 blog 是插入 mongodb 后的值，包含 _id
            blog = result.ops[0]
            // req.flash('success', '发表成功')
            // 发表成功后跳转到该文章页
            res.status(200).json({status: 200, message: '发表成功', blogId: blog._id})
            // res.redirect(`/blog/${blog._id}`)
        })
        .catch(next)
})

// GET /blog/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
    res.render('blog_create')
})

// GET /blog/:blogId 单独一篇的文章页
router.get('/:blogId', function (req, res, next) {
    const blogId = req.params.blogId

    Promise.all([
        BlogModel.getBlogById(blogId), // 获取文章信息
        CommentModel.getComments(blogId), // 获取该文章所有留言
        BlogModel.incPv(blogId)// pv 加 1
    ])
        .then(function (result) {
            const blog = result[0]
            const comments = result[1]
            if (!blog) {
                throw new Error('该文章不存在')
            }

            res.render('blog_details', {
                blog: blog,
                comments: comments
            })
        })
        .catch(next)
})

// GET /blog/:blogId/edit 更新文章页
router.get('/:blogId/edit', checkLogin, function (req, res, next) {
    const blogId = req.params.blogId
    const author = req.session.user._id

    BlogModel.getRawBlogById(blogId)
        .then(function (blog) {
            if (!blog) {
                throw new Error('该文章不存在')
            }
            if (author.toString() !== blog.author._id.toString()) {
                throw new Error('权限不足')
            }
            res.render('blog_edit', {
                blog: blog
            })
        })
        .catch(next)
})

// Blog /blog/:blogId/edit 更新一篇文章
router.post('/:blogId/edit', checkLogin, function (req, res, next) {
    console.log(req.params,req.fields)
    const blogId = req.params.blogId
    const author = req.session.user._id
    const title = req.fields.title
    const content = req.fields.content
    // 校验参数
    try {
        if (!title.length) {
            req.json({message: '请填写内容'})
            throw new Error('请填写标题')
        }
        if (!content.length) {
            req.json({message: '请填写内容'})
            throw new Error('请填写内容')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    BlogModel.getRawBlogById(blogId)
        .then(function (blog) {
            if (!blog) {
                throw new Error('文章不存在')
            }
            if (blog.author._id.toString() !== author.toString()) {
                throw new Error('没有权限')
            }
            BlogModel.updateBlogById(blogId, {title: title, content: content})
                .then(function () {
                    req.flash('success', '编辑文章成功')
                    // 编辑成功后跳转到上一页
                    res.status(200).json({status: 200, message: '编辑文章成功'})
                    // res.redirect(`/blog/${blogId}`)
                })
                .catch(next)
        })
})

// GET /blog/:blogId/remove 删除一篇文章
router.get('/:blogId/remove', checkLogin, function (req, res, next) {
    const blogId = req.params.blogId
    const author = req.session.user._id

    BlogModel.getRawBlogById(blogId)
        .then(function (blog) {
            if (!blog) {
                res.json({message: '文章不存在'})
                throw new Error('文章不存在')
            }
            if (blog.author._id.toString() !== author.toString()) {
                res.json({message: '没有权限'})
                throw new Error('没有权限')
            }

            BlogModel.delBlogById(blogId, author)
                .then(function () {
                    res.status(200).json({message: '删除文章成功'})
                    // req.flash('success', '删除文章成功')
                    // 删除成功后跳转到主页
                    // res.redirect('/blog')
                })
                .catch(next)
        })
})

module.exports = router
