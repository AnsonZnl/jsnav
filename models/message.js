const marked = require('marked')
const Message = require('../lib/mongo').Message

// 将 Message 的 content 从 markdown 转换成 html
Message.plugin('contentToHtml', {
    afterFind: function (Messages) {
        return Messages.map(function (Message) {
            Message.content = marked(Message.content)
            return Message
        })
    }
})

module.exports = {
    // 创建一个留言
    create: function create (comment) {
        return Message.create(comment).exec()
    },
    // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
    getMessages: function getMessages () {
        return Message.find({})
    }
}
