const Koa = require('koa')
const koaBody = require('koa-body')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const path = require('path')
const koaStatic = require('koa-static')
const {
    DB,
    CONF
} = require('./src/db/db')
const routing = require('./src/router')
const port = 8888
const app = new Koa()



app.use(koaStatic(path.join(__dirname, 'public')))

app.use(error({
    postFormat: (e, {
        stack,
        ...rest
    }) => process.env.NODE_ENV === 'production' ? rest : {
        stack,
        ...rest
    }

}))
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, './public/uploads/'),
        keepExtensions: true // 保留图片扩展名
    }
}))
app.use(parameter(app))
routing(app)

try {
    DB.then(() => {
        console.log(`数据库 ${CONF.DATABASE} 启动成功!`)
    })
    app.listen(port, err => {
        if (!err) {
            console.log(`端口位于 ${port} 的服务器启动成功!`)
        } else {
            console.warn(err)
        }
    })
} catch (e) {
    console.log(e)
}