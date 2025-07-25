const socketIo = require('socket.io');
const User = require('./models/user');
const Captain = require('./models/captain');

let io;

function initializeSocket(server) {

    io = socketIo(server, {
        cors: {
          origin: '*', 
          methods: ["GET", "POST"]
        }
    });

    // Handle socket connection
    io.on('connection', (socket) => {

        console.log(' New client connected:', socket.id);

        socket.on('join' , async(data) => {

            const {userId , userType} = data;

            if(userType === 'user') {
                await User.findByIdAndUpdate(userId , {socketId:socket.id} , {new: true})
            }
            else if(userType === 'captain') {
                await Captain.findByIdAndUpdate(userId , {socketId:socket.id} , {new:true})
            }
        })

        socket.on('update-location-captain' , async(data) => {

            const {userId , location} = data;

            if(!location || !location.ltd || !location.lng){
                return socket.emit('error' , {message: 'Invalid location data'})
            }

            await Captain.findByIdAndUpdate(userId , {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            })
        })
  
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };