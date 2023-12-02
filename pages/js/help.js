let audioRecorder;
let recordedChunks = [];
import System from "../firebase/system.js";

const system = new System()

document.getElementById('startRecord').addEventListener('click', startRecording);
document.getElementById('stopRecord').addEventListener('click', stopRecording);
document.getElementById('saveRecord').addEventListener('click', saveRecording);

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
      audioRecorder = new MediaRecorder(stream);
      audioRecorder.ondataavailable = function (e) {
        recordedChunks.push(e.data);
      };
      audioRecorder.onstop = function () {
        const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        document.getElementById('audioPlayback').src = audioUrl;
        document.getElementById('status').innerText = 'Recording Stopped';
        document.getElementById('startRecord').disabled = false;
        document.getElementById('stopRecord').disabled = true;
        document.getElementById('saveRecord').disabled = false;
      };
      audioRecorder.start();
      document.getElementById('status').innerText = 'Recording...';
      document.getElementById('startRecord').disabled = true;
      document.getElementById('stopRecord').disabled = false;
      document.getElementById('saveRecord').disabled = true;
    })
    .catch(function (err) {
      console.error('Error accessing the microphone:', err);
    });
}

function stopRecording() {
  audioRecorder.stop();
}

function saveRecording() {
  const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
  system.store(audioBlob, 0)
  console.log("passed")
  /*const audioUrl = URL.createObjectURL(audioBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = audioUrl;
  downloadLink.download = 'recorded_audio.wav';
  downloadLink.click();
  **/
}
