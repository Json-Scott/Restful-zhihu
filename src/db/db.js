/**
 * @desc 连接数据库 mongodb: //localhost:27017/mongo-test
 */
const mongoose = require('mongoose')
const CONF = {
    URL: 'localhost',
    PORT: 27017,
    DATABASE: 'mongod'
}
mongoose.set('useCreateIndex', true)
const DB = mongoose.connect(`mongodb://${CONF.URL}:${CONF.PORT}/${CONF.DATABASE}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true

})
module.exports = {
    DB,
    CONF
}