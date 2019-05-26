const marked = require('marked')
const Blog = require('../lib/mongo').Blog
const CommentModel = require('./comments')

// 给 blog 添加留言数 commentsCount
Blog.plugin('addCommentsCount', {
    afterFind: function (blogs) {
        return Promise.all(blogs.map(function (blog) {
            return CommentModel.getCommentsCount(blog._id).then(function (commentsCount) {
                blog.commentsCount = commentsCount
                return blog
            })
        }))
    },
    afterFindOne: function (blog) {
        if (blog) {
            return CommentModel.getCommentsCount(blog._id).then(function (count) {
                blog.commentsCount = count
                return blog
            })
        }
        return blog
    }
})
// 将 blog 的 content 从 markdown 转换成 html
Blog.plugin('contentToHtml', {
    afterFind: function (blogs) {
        return blogs.map(function (blog) {
            blog.content = marked(blog.content)
            return blog
        })
    },
    afterFindOne: function (blog) {
        if (blog) {
            blog.content = marked(blog.content)
        }
        return blog
    }
})

module.exports = {
    // 创建一篇文章
    create: function create(blog) {
        return Blog.create(blog).exec()
    },

    // 通过文章 id 获取一篇文章
    getBlogById: function getBlogById(blogId) {
        return Blog
            .findOne({_id: blogId})
            .populate({path: 'author', model: 'User'})
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .exec()
    },

    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getBlogs: function getBlogs(author) {
        const query = {}
        if (author) {
            query.author = author
        }

        return Blog
            .find(query)
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .exec()
    },

    // 通过文章 id 给 pv 加 1
    incPv: function incPv(blogId) {
        return Blog
            .update({_id: blogId}, {$inc: {pv: 1}})
            .exec()
    },
    // 通过文章 id 获取一篇原生文章（编辑文章）
    getRawBlogById: function getRawBlogById(blogId) {
        return Blog
            .findOne({_id: blogId})
            .populate({path: 'author', model: 'User'})
            .exec()
    },

    // 通过文章 id 更新一篇文章
    updateBlogById: function updateBlogById(blogId, data) {
        return Blog.update({_id: blogId}, {$set: data}).exec()
    },

    // 通过用户 id 和文章 id 删除一篇文章
    delBlogById: function delBlogById(blogId, author) {
        return Blog.deleteOne({author: author, _id: blogId})
            .exec()
            .then(function (res) {
                // 文章删除后，再删除该文章下的所有留言
                if (res.result.ok && res.result.n > 0) {
                    return CommentModel.delCommentsByBlogId(blogId)
                }
            })
    }
}
