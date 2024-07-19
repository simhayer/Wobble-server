// const configurationPeerConnection = {
//     iceServers: [{
//         urls: "stun:stun.stunprotocol.org"
//     }]
// }

const configurationPeerConnection = {
  iceServers: [
    {
      urls: "stun:stun.relay.metered.ca:80",
    },
    {
      urls: "turn:global.relay.metered.ca:80",
      username: "aca60fb4568ea274f8245009",
      credential: "Zi/jzkiJuI2fmwLx",
    },
    {
      urls: "turn:global.relay.metered.ca:80?transport=tcp",
      username: "aca60fb4568ea274f8245009",
      credential: "Zi/jzkiJuI2fmwLx",
    },
    {
      urls: "turn:global.relay.metered.ca:443",
      username: "aca60fb4568ea274f8245009",
      credential: "Zi/jzkiJuI2fmwLx",
    },
    {
      urls: "turns:global.relay.metered.ca:443?transport=tcp",
      username: "aca60fb4568ea274f8245009",
      credential: "Zi/jzkiJuI2fmwLx",
    },
  ],
};

const offerSdpConstraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
  },
  optional: [],
};

module.exports = {
  configurationPeerConnection,
  offerSdpConstraints,
};
