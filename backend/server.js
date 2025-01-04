const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://jalakataid-ten.vercel.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  },
  transports: ["websocket", "polling"] // Ensure transport types are set
});

let connectedClients = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  console.log('Transport used:', socket.conn.transport.name);

  connectedClients.push(socket.id); // Save connected client socket ID
  io.emit('connected-clients', connectedClients); // Send updated client list

  socket.on('text-change', (text) => {
    socket.broadcast.emit('text-update', text); // Broadcast text changes
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectedClients = connectedClients.filter(id => id !== socket.id); // Remove client on disconnect
    io.emit('connected-clients', connectedClients); // Send updated client list
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});
