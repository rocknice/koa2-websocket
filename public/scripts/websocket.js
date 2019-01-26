$(function(){
    // 建立websocket连接
    const socket = io.connect('http://localhost:3000');
    // 收到server的连接确认
    socket.on('open', function() {
        console.log('已连接');
        socket.send('接入服务器');
    })
    // 监听服务端的test事件发回来的消息
    socket.on('test', function(msg) {
        console.log('服务端：', msg);
    })
    socket.on('断开连接', function(msg) {
        console.log('断开连接：', msg);
    })
})