const broadcastService = require('../Services/broadcastServices');
const consumerService = require('../Services/consumerService');

module.exports = io => {
  io.on('connection', async function (socket) {
    console.log('new connection: ' + socket.id);

    socket.emit('from-server', socket.id);

    socket.on('add-candidate-consumer', data => {
      consumerService.addCandidateFromClient(data);
    });
    socket.on('add-candidate-broadcast', data => {
      broadcastService.addCandidateFromClient(data);
    });

    socket.on('watcher', data => {
      console.log('watcher: ' + data);
      broadcastService
        .addWatcher(data.id)
        .then(updatedWatchers => {
          io.to(data.id).emit('updateWatcher', updatedWatchers);
        })
        .catch(error => {
          console.error('Error updating watchers:', error);
        });
    });

    // When a user joins a specific stream
    socket.on('joinStream', broadcastId => {
      socket.join(broadcastId);
      console.log(`User ${socket.id} joined broadcast room: ${broadcastId}`);
    });

    socket.on('broadcast-started', data => {
      const {broadcastId, socketId} = data;
      socket.join(broadcastId);
      console.log(
        `Broadcaster ${socketId} started broadcast and joined room: ${broadcastId}`,
      );
    });

    socket.on('comment', data => {
      console.log('comment: ' + data);
      broadcastService.addComment(
        data.id,
        data.comment,
        data.userUsername,
        data.userProfilePicture,
      );

      //io.emit('newComment', data);
      io.to(data.id).emit('newComment', data);
    });

    socket.on('bid', data => {
      console.log('bid: ' + data);
      broadcastService.addBid(data.id, data.bidAmount, data.userUsername);

      io.to(data.id).emit('newBid', data);
    });

    socket.on('start-bid', data => {
      console.log('start-bid: ' + data);
      broadcastService.startBid(data.id);

      io.to(data.id).emit('startBid', data);
    });

    socket.on('end-bid', data => {
      console.log('end-bid: ' + data);
      broadcastService.endBid(data.id).then(data => {
        io.to(data.id).emit('endBid', data);
      });
    });

    io.on('disconnect', socket => {
      console.log('someone disconnected');
    });
  });
};
