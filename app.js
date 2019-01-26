const Koa  = require('koa');
const serve = require('koa-static');
const app = new Koa();
const router = require('koa-router')();
const render = require('koa-swig');
const path = require('path');
const co = require('co');
app.context.render = co.wrap(render({
    root: path.join(__dirname, 'views'),
    autoescape: true,
    cache: 'memory', // disable, set to false
    ext: 'html',
    writeBody: false
}));
app.use(serve(path.join(__dirname, 'public')));
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async ctx => ctx.body = await ctx.render('index'));
router.get('/', (ctx, next) => {
    ctx.body = 'hello'
});
router.get('/index', async(ctx, next) => {
    ctx.body = await ctx.render('index')
});
app.listen(3000, () => {console.log('服务已在3000端口启动')})