const express = require('express');
const { connect } = require('http2');
const path = require('path');

const app = express();
const server = require('http').createServer(app); //Define o protocolo http
const io = require('socket.io')(server); //Define o protocolo wss

app.use(express.static(path.join(__dirname, 'public')));

//Usar as views como html em vez de ejs;
app.set('views', path.join(__dirname, 'public'));

//Comum quando precisa se usar o html em Node;
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) =>
    res.render('index.html')
);

let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);

        socket.broadcast.emit('receivedMessage', data);
    })
})

server.listen(3000);