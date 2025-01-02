const socket = io("https://callingsite.onrender.com"); // Yahan apna signaling server URL daalein

let localStream;
let peerConnection;

const startCallButton = document.getElementById("startCall");
const endCallButton = document.getElementById("endCall");
const remoteAudio = document.getElementById("remoteAudio");

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

startCallButton.addEventListener("click", async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  peerConnection = new RTCPeerConnection(configuration);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("candidate", event.candidate);
    }
  };

  peerConnection.ontrack = (event) => {
    remoteAudio.srcObject = event.streams[0];
  };

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit("offer", offer);
});

socket.on("offer", async (offer) => {
  if (!peerConnection) {
    peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      remoteAudio.srcObject = event.streams[0];
    };
  }

  await peerConnection.setRemoteDescription(offer);

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit("answer", answer);
});

socket.on("answer", async (answer) => {
  await peerConnection.setRemoteDescription(answer);
});

socket.on("candidate", async (candidate) => {
  if (peerConnection) {
    await peerConnection.addIceCandidate(candidate);
  }
});

endCallButton.addEventListener("click", () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
  }
  remoteAudio.srcObject = null;
});
