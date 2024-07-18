const webrtc = require('wrtc');
const {MediaStream} = require('wrtc');
const {v4: uuidv4} = require('uuid');
const config = require('../config');
const {broadcasters} = require('../Data/data');
const socketFunction = require('../Socket/socketFunction');

class Broadcaster {
  constructor(
    _id = null,
    _stream = new MediaStream(),
    _peer = new webrtc.RTCPeerConnection(),
    _socket_id,
    _username,
    _profilePicture,
    _title,
  ) {
    this.id = _id;
    this.stream = _stream;
    this.peer = _peer;
    this.socket_id = _socket_id;
    this.username = _username;
    this.profilePicture = _profilePicture;
    4;
    this.title = _title;
    this.watchers = 0;
    this.comments = [];
    this.isBidding = false;
    this.curBidDetails = {};
  }
}

async function addBroadcast(socket_id, sdp, username, profilePicture, title) {
  console.log('new broadcast');
  var id = uuidv4();
  console.log('username: ' + username);
  var broadcast = new Broadcaster(
    id,
    new MediaStream(),
    new webrtc.RTCPeerConnection(
      config.configurationPeerConnection,
      config.offerSdpConstraints,
    ),
    socket_id,
    username,
    profilePicture,
    title,
  );

  broadcasters[id] = broadcast;

  broadcastMediaProcess(id);

  broadcastConnectionState(id);

  broadcastOnIceCandidate(id);

  await broadcastSdpProcess(id, sdp);

  return id;
}

async function broadcastMediaProcess(id) {
  try {
    broadcasters[id].peer.ontrack = e =>
      (broadcasters[id].stream = e.streams[0]);
  } catch (e) {
    console.log(e);
  }
}
async function broadcastConnectionState(id) {
  broadcasters[id].peer.oniceconnectionstatechange = e => {
    try {
      if (broadcasters[id] != null) {
        const connectionStatus2 = broadcasters[id].peer.iceConnectionState;
        if (['disconnected', 'failed', 'closed'].includes(connectionStatus2)) {
          console.log(
            '\x1b[31m',
            'Broadcaster: ' + id + ' - ' + connectionStatus2,
            '\x1b[0m',
          );
          removeBroadcast(id);
          socketFunction.sendListUpdateSignal();
        }
        if (['connected'].includes(connectionStatus2)) {
          console.log(
            '\x1b[34m',
            'Broadcaster: ' + id + ' - ' + connectionStatus2,
            '\x1b[0m',
          );
          socketFunction.sendListUpdateSignal();
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
}

async function broadcastOnIceCandidate(id) {
  try {
    broadcasters[id].peer.onicecandidate = e => {
      if (!e || !e.candidate) return;
      var candidate = {
        candidate: String(e.candidate.candidate),
        sdpMid: String(e.candidate.sdpMid),
        sdpMLineIndex: e.candidate.sdpMLineIndex,
      };
      // console.log(candidate)
      socketFunction.sendCandidateToClient(
        broadcasters[id].socket_id,
        candidate,
      );
    };
  } catch (e) {
    console.log(e);
  }
}

async function broadcastSdpProcess(id, sdp) {
  try {
    const desc = new webrtc.RTCSessionDescription(sdp);
    await broadcasters[id].peer.setRemoteDescription(desc);
    const answer = await broadcasters[id].peer.createAnswer({
      offerToReceiveVideo: 1,
    });
    await broadcasters[id].peer.setLocalDescription(answer);
  } catch (e) {
    console.log(e);
  }
}

async function addCandidateFromClient(data) {
  if (broadcasters[data['id']] != null) {
    broadcasters[data['id']].peer.addIceCandidate(
      new webrtc.RTCIceCandidate(data['candidate']),
    );
  }
}

async function removeBroadcast(id) {
  if (broadcasters[id] != null) {
    console.log('\x1b[31m', 'remove broadcaster: ' + id, '\x1b[0m');
    broadcasters[id].peer.close();
    delete broadcasters[id];
  }
}

async function addWatcher(id) {
  if (broadcasters[id] != null) {
    console.log('\x1b[31m', 'Updating broadcaster: ' + id, '\x1b[0m');

    if (broadcasters[id].watchers == null) {
      broadcasters[id].watchers = 0;
    }
    broadcasters[id].watchers += 1;

    return broadcasters[id].watchers;
  } else {
    console.log('\x1b[31m', 'Broadcaster not found: ' + id, '\x1b[0m');
    return 0;
  }
}

async function addComment(id, comment, userUsername, userProfilePicture) {
  if (broadcasters[id] != null) {
    console.log('\x1b[31m', 'Updating broadcaster: ' + id, '\x1b[0m');
    broadcasters[id].comments.push({comment, userUsername, userProfilePicture});
  } else {
    console.log('\x1b[31m', 'Broadcaster not found: ' + id, '\x1b[0m');
  }
}

async function addBid(id, bidAmount, userUsername) {
  if (broadcasters[id] != null) {
    console.log('Updating bid for broadcaster: ' + id);
    broadcasters[id].curBidDetails = {
      userUsername,
      bidAmount,
    };
  } else {
    console.log('\x1b[31m', 'Broadcaster not found: ' + id, '\x1b[0m');
  }
}

async function startBid(id) {
  if (broadcasters[id] != null) {
    console.log('Starting bid for broadcaster: ' + id);
    //broadcasters[id].isBidding = true;

    var ret = broadcasters[id].curBidDetails;

    broadcasters[id].curBidDetails = {
      userUsername: 'null',
      bidAmount: 0,
    };

    return ret;
  } else {
    console.log('\x1b[31m', 'Broadcaster not found: ' + id, '\x1b[0m');
    return 0;
  }
}

async function endBid(id) {
  if (broadcasters[id] != null) {
    console.log('Ending bid for broadcaster: ' + id);
    broadcasters[id].isBidding = false;
    broadcasters[id].curBidDetails = {};
  } else {
    console.log('\x1b[31m', 'Broadcaster not found: ' + id, '\x1b[0m');
  }
}

function fetch() {
  var data = [];
  for (var bs in broadcasters) {
    if (broadcasters.hasOwnProperty(bs)) {
      data.push({
        id: bs,
        username: broadcasters[bs].username,
        profilePicture: broadcasters[bs].profilePicture,
        title: broadcasters[bs].title,
        socketID: broadcasters[bs].socket_id,
        watchers: broadcasters[bs].watchers,
        comments: broadcasters[bs].comments,
        isBidding: broadcasters[bs].isBidding,
        curBidDetails: broadcasters[bs].curBidDetails,
      });
    }
  }
  return data;
}

module.exports = {
  addBroadcast,
  addCandidateFromClient,
  fetch,
  addWatcher,
  addComment,
  addBid,
  startBid,
};
