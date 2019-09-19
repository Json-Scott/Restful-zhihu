const jsonwebtoken = require('jsonwebtoken')

const User = require('../model/users')
const config = require('../../utils/config')
class UsersCtl {
    // 查找列表
    async find(ctx) {
        ctx.body = await User.find()
    }
    // 查找用户
    async findById(ctx) {
        const {
            fields = ''
        } = ctx.query
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const result = await User.findById(ctx.params.id).select(selectFields)
        if (!result) throw (404, '用户不存在')
        ctx.body = result
    }
    // 创建用户
    async create(ctx) {
        ctx.verifyParams({
            name: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                require: true
            }
        })
        const {
            name
        } = ctx.request.body
        const repeatName = await User.findOne({
            name
        })
        if (repeatName) ctx.throw(409, '用户存在')
        const user = await new User(ctx.request.body).save()
        ctx.body = user
    }
    // 检查权限
    async checkOwner(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '没有权限')
        }
        await next()
    }
    // 更新用户
    async update(ctx) {
        ctx.verifyParams({
            name: {
                type: 'string',
                required: false
            },
            password: {
                type: 'string',
                required: false
            },
            avatar_url: {
                type: 'string',
                required: false
            },
            gender: {
                type: 'string',
                required: false
            },
            headline: {
                type: 'string',
                required: false
            },
            location: {
                type: 'array',
                itemType: 'string',
                required: false
            },
            business: {
                type: 'string',
                required: false
            },
            employment: {
                type: 'array',
                itemType: 'object',
                required: false
            },
            education: {
                type: 'array',
                itemType: 'object',
                required: false
            }
        })
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!user) throw (404, '不存在')
        ctx.body = user
    }
    //删除用户
    async delete(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id)
        if (!user) throw (404, '不存在')
        ctx.status = 204
    }
    // 登录
    async login(ctx) {
        ctx.verifyParams({
            name: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            }
        })
        const user = await User.findOne(ctx.request.body)
        if (!user) throw (401, '用户名或密码不正确')
        const {
            _id,
            name
        } = user
        const token = jsonwebtoken.sign({
            _id,
            name
        }, config.secret, {
            expiresIn: '1d'
        })
        ctx.body = {
            token
        }
    }
    // 获取关注列表
    async listFollowing(ctx) {
        const user = await User.findById(ctx.params.id).select('+following').populate('following')
        if (!user) throw (404, '用户不存在')
        ctx.body = user.following
    }
    // 添加关注
    async follow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following');
        if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
            me.following.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
    }
    // 取消关注
    async unfollow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following');
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id);
        if (index > -1) {
            me.following.splice(index, 1);
            me.save();
        }
        ctx.status = 204;
    }
    // 检查用户存在
    async checkUserExist(ctx, next) {
        const user = await User.findById(ctx.params.id);
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        await next();
    }
    // 获取某人粉丝列表
    async listFollowers(ctx) {
        const users = await User.find({
            following: ctx.params.id
        });
        ctx.body = users;
    }
}

module.exports = new UsersCtl()