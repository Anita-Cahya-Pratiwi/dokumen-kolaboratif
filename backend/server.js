const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://jalakataid-ten.vercel.app/"], 
    methods: ["GET", "POST"]
  }
});

let connectedClients = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  connectedClients.push(socket.id); // Menyimpan socket ID klien yang terhubung
  
  // Kirimkan daftar klien yang terhubung
  io.emit('connected-clients', connectedClients);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectedClients = connectedClients.filter(id => id !== socket.id); // Menghapus socket ID klien yang terputus
    io.emit('connected-clients', connectedClients); // Kirimkan daftar yang diperbarui
  });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('text-change', (text) => {
    socket.broadcast.emit('text-update', text); 
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000; 
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});
