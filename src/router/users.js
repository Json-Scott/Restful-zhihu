const jwt = require('koa-jwt')
const Router = require('koa-router')
const router = new Router({
    prefix: '/users'
})
const {
    secret
} = require('../../utils/config')
const {
    find,
    findById,
    create,
    update,
    delete: del,
    login,
    checkOwner,
    listFollowing,
    follow,
    unfollow,
    listFollowers,
    checkUserExist
} = require('../controllers/users')

// 注意必须传对象!!!!!
const auth = jwt({
    secret
})

router.get('/', find)
router.post('/', create)
router.get('/:id', findById)
router.patch('/:id', auth, checkOwner, update)
router.delete('/:id', auth, checkOwner, del)
router.post('/login', login)
router.get('/:id/following', listFollowing)
router.put('/following/:id', auth, checkUserExist, follow)
router.delete('/following/:id', auth, checkUserExist, unfollow)
router.get('/:id/followers', listFollowers);

module.exports = router