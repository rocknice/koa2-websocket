const Koa  = require('koa');
const serve = require('koa-static');
const app = new Koa();
const router = require('koa-router')();
const render = require('koa-swig');
const path = require('path');
const co = require('co');
const server = require('http').Server(app.callback());
const io = require('socket.io')(server);
const port = 3000;
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
router.get('/websocket', async(ctx, next) => {
    ctx.body = await ctx.render('websocket')
});
io.on('connection', socket => {
    // 通知客户端已连接，第一次访问会触发事件
    socket.emit('open');
    // console.log(socket.handshake);
    // 对message事件的监听
    socket.on('message', (msg) => {
        console.log('当客户端访问网站后，服务器第一次接收到客户端的消息：', msg)
        // 返回消息
        socket.emit('test', '接入成功')
        // 向所有连接到本服务的用户广播消息
        socket.broadcast.emit('test', '其他用户接入')
    });
    // 监听退出事件
    socket.on('disconnect', () => {
        socket.emit('断开连接', '断开连接')
        socket.broadcast.emit('断开连接', '其它用户断开连接')
    });
});

server.listen(port, () => {console.log(`服务已在${port}端口启动`)})