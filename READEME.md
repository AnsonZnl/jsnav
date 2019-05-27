# jsnav
演示地址：http://www.jsnav.top/posts

使用Express+mongoDB搭建的blog系统，基于[N-blog](https://github.com/nswbmw/N-blog) 。

## node-express
学习自https://github.com/nswbmw/N-blog,使用 Express + MongoDB  
#### 更改的地方
+ 改为更流行的Mongoose操作数据库的形式
+ 访问时改为更常见的用户名形式  /blog/用户名/blog
+ 设置了一个默认头像，public/img/avatar.png
+ 这里的许多查询都用了callback形式，似乎不太合适，待完善修改
+ 一对多查询，根据用户查相关blog ，方法是在blog中查公共的'author'字段'  
+ 注意！！crud在后端都是异步的，连续操作结果不对，注意下是不是因为异步结果未返回
+ 时间字符串格式化,难过的哭泣，网上都没查到.mongoose的timestamps,createdAt无法格式化，即在模版里展示默认的createdAt,怎么格式化都无效.这里另设了一个属性替代createdAt,才实现  

## node-express-api
使用 Express + MongoDB 搭建多人博客
自己改造为api接口形式
### 上传文件，使用ajax+FormDada！！！！
大致改造完成，下一步，改为前后分离   暂停...

原项目地址：https://github.com/byInWind/express


**预览地址：** http://www.jsnav.top
## 文件目录：    
```
├── index.js(程序主文件)
├── package.json(项目名、作者、依赖等信息)
├── .gitignore
├── models(存放操作数据库的文件)
|    |—— users.js
|    |—— posts.js
|    |—— comments.js
|—— pubilc(存放静态文件，如样式、图片等)
|    |—— css
|        |—— style.css
|    |—— img
|    |—— js
├── routes(存放路由文件)
|    ├── index.js
|    ├── posts.js
|    |—— comments.js
|    ├── signin.js
|    ├── signout.js
|    |—— signup.js
|—— config（配置信息）
|    |—— default.js
|—— lib
|    |—— mongo.js
|—— middlewares
|    |—— check.js
|—— logs
|    |—— error.log
|    |—— success.log
|—— views(存放模板文件)
|    |—— edit.ejs
|    |—— post.ejs
|    |—— signin.ejs
|    |—— create.ejs
|    |—— header.ejs
|    |—— footer.ejs
|    |—— signup.ejs
|    |—— posts.ejs
|    |—— 404.ejs
|    |—— component
|        |—— nav.ejs
|        |—— nav-setting.ejs
|        |—— notification.ejs
|        |—— post-content.ejs 
|        |—— comments.ejs
```

> 我们遵循了 MVC（模型(model)－视图(view)－控制器(controller/route)） 的开发模式。


## 功能：
- [x] 登陆
- [x] 注册
- [x] 登出
- [x] 上传头像
- [x] 发表文章
- [x] 修改文章
- [x] 留言
- [x] 评论
- [ ] 分页
- [ ] 标签
- [ ] 二级评论
## 部分截图

![注册](https://upload-images.jianshu.io/upload_images/7072486-5590ce1d0c5f7b6a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![登陆](https://upload-images.jianshu.io/upload_images/7072486-8b6857f99a0644d1.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![博客首页](https://upload-images.jianshu.io/upload_images/7072486-f9f4772401d2478e.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![博客文章页](https://upload-images.jianshu.io/upload_images/7072486-27ca74745716ea65.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![博客发表页](https://upload-images.jianshu.io/upload_images/7072486-5288494cec50122a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



## Error log
- 出了Bug，仔细看Error log.
- 注册是图片必须上传(要放在public/img下)，否则会报错 `Callback must be a function`。
- 仔细阅读教程，可以减少很多低级错误。
- 删除功能有bug

##使用 pm2 
> pm2 是 Node.js 下的生产环境进程管理工具，就是我们常说的进程守护工具。

下载pm2 
```
npm install pm2 -g
```
修改 package.json，添加 start 的命令：
```
package.json

"scripts": {
  "test": "istanbul cover _mocha",
  "start": "cross-env NODE_ENV=production pm2 start index.js --name 'myblog'"
}
```
然后运行 npm start 通过 pm2 启动程序，如下图所示 ：
![](https://github.com/nswbmw/N-blog/raw/master/book/img/4.15.1.png)

也可直接运行：
```
NODE_ENV=production pm2 start index.js --name 'myblog'
```
pm2 常用命令:
```
pm2 start/stop: 启动/停止程序
pm2 reload/restart [id|name]: 重启程序
pm2 logs [id|name]: 查看日志
pm2 l/list: 列出程序列表
```


启动项目：
```
npm install

npm install pm2 -g

npm start
```

---

在此鸣谢作者提供的教程：[nswbmw/N-blog](https://github.com/nswbmw)
