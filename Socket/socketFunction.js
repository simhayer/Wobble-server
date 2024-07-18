
var io = null

function init(sio)
{
    io =sio
}
function sendCandidateToClient(socket_id,candidate)
{
    io.to(socket_id).emit("candidate-from-server",candidate)
}

function sendListUpdateSignal()
{
    console.log("Sending List update Signal")
    io.emit("List-update")
}

module.exports = {
    init,
    sendCandidateToClient,
    sendListUpdateSignal
}