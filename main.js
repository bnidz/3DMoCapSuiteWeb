let socket_pose;
let socket_hands;
let canvasElement_pose , canvasCtx_pose, grid, landmarksString;//landmarkContainer;
const videoElement_pose = document.getElementById('videoElement_pose');
let input_id = 0;
//let cameraDropdown_pose = document.querySelector('.camera-dropdown_pose');
let videoDevices = [];

// navigator.mediaDevices.enumerateDevices().then(function (devices) 
// {
//   for(var i = 0; i < devices.length; i ++)
//   {
//       {
//         videoDevices.push(devices[i]);
//         var option = document.createElement('option');
//         option.text = i + 1 + ' ' + devices[i].kind; //device.kind + ' ' + (i + 1) + device.deviceId; //|| 'camera ' + (i + 1) + device.label;

//         option.value = i;
//         document.querySelector('select#camera-dropdown_pose').appendChild(option);
//       }
//   };
// });

//const selectedCamera = cameraDropdown_pose.value;
// cameraDropdown_pose.addEventListener('change', function() 
// {
//   navigator.mediaDevices_hands.getUserMedia({
//   }).then(function(stream) {
//     videoElement_pose.srcObject = videoDevices[cameraDropdown_pose.value];
//   }).catch(function(error) {
//     console.log(error);
//   });
// });
let landmarksString_hands;

const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}}); 
const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  selfieMode: true,
});

hands.onResults(onResults_hands);
let canvasElement_hands;// = document.getElementsByClassName('output_canvas_hands')[0];
let canvasCtx_hands;// =
let output_pose
function init_pose() 
{
  console.log('print socket: ' + socket_pose);
  canvasElement_pose = document.getElementsByClassName('output_canvas_pose')[0];
  canvasCtx_pose = canvasElement_pose.getContext('2d');
  landmarksString = "placeholder";
  
  canvasElement_hands = document.getElementsByClassName('output_canvas_pose')[0];
  //output_pose = canvasElement_hands.getContext('2d').getImageData(0, 0, canvasElement_hands.width, canvasElement_hands.height);
  //canvasElement_pose = document.getElementsByClassName('output_canvas_pose')[0];
  canvasCtx_hands = canvasElement_pose.getContext('2d');
  landmarksString_hands = "placeholder";
  canvasElement_hands = document.getElementsByClassName('output_canvas_pose')[0];
  
  output_pose = canvasElement_hands.getContext('2d').getImageData(0, 0, canvasElement_hands.width, canvasElement_hands.height);
  
  // canvasCtx_pose.translate(1280/3, 0);
  // canvasCtx_pose.scale(-1, 1);
}
// Button element
const button = document.querySelector('.start-button-pose');

// Function to update button text based on connection status
function updateButtonText() {
  if (isConnected) {
    button.textContent = 'STOP';
  } else {
    button.textContent = 'START';
  }
}

// START BUTTON
// Define isConnected variable
let isConnected = false;
let cam = false;
// START BUTTON
document.querySelector('.start-button-pose').addEventListener('click', () => {
  if (isConnected) {
    // Close the existing WebSocket connection
    socket_pose.close();
    socket_hands.close();
    isConnected = false;
    updateButtonText(); // Update button text
  } else {
    const wsProtocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
    const serverAddress = document.querySelector('.ip-input').value;

    socket_pose = new WebSocket(wsProtocol + serverAddress + '/pose');
    socket_pose.onmessage = function(e) {
      socket_onmessage_callback(e.data);
    }
    socket_pose.onopen = function() {
      isConnected = true;
      updateButtonText(); // Update button text
    };
  
    socket_hands = new WebSocket(wsProtocol + serverAddress + '/hands');
    socket_hands.onmessage = function(e) {
      socket_onmessage_callback(e.data);
    }
  socket_hands.onopen = function() {
    isConnected = true;
  };
  //isConnected = true;

  if(cam == false)
  {
  let camera = new Camera(videoElement_pose,
    {
        onFrame: async () => {
          if(isConnected)
          {
            // const canvas = document.createElement('canvas');
            // canvas.width = videoElement_pose.videoWidth;
            // canvas.height = videoElement_pose.videoHeight;
            // const ctx = canvas.getContext('2d');
    
            // // Flip the video feed horizontally
            // ctx.translate(canvas.width, 0);
            // ctx.scale(-1, 1);
    
            // // Draw the video frame on the canvas
            // ctx.drawImage(videoElement_pose, 0, 0, canvas.width, canvas.height);
    
            // const flippedImage = new Image();
            // flippedImage.src = canvas.toDataURL();
    
            await pose.send({ image: videoElement_pose });
            await hands.send({ image: videoElement_pose });

          }
        },
        width: 1280/3,
        height: 720/3
      });
      
      init_pose();
      var videoElement = document.getElementById('videoElement_pose');
      videoElement.onplaying = function() {
        var canvas = document.querySelector('.output_canvas_pose');
        canvas.style.backgroundImage = 'none';
      };
      camera.start();
      canvasCtx_pose = canvasElement_pose.getContext('2d');
    }
}});
function socket_onmessage_callback(data) {
}
function onResults_pose(results)
{
  if (!results.poseWorldLandmarks)
  {
    return;
  }
  const landmarks = results.poseWorldLandmarks.flatMap((lm) => [lm.x, lm.y, lm.z, lm.visibility]);
  landmarksString = landmarks.join(',');

  if (socket_pose.readyState === WebSocket.OPEN) {
    socket_pose.send(landmarksString);
  }
  //socket_pose.send(landmarksString);
  canvasCtx_pose.save();
  canvasCtx_pose.clearRect(0, 0, canvasElement_pose.width, canvasElement_pose.height);
  canvasCtx_pose.drawImage(results.segmentationMask, 0, 0,
  canvasElement_pose.width, canvasElement_pose.height);
    
  // Only overwrite existing pixels.
  canvasCtx_pose.globalCompositeOperation = 'source-in';
  canvasCtx_pose.fillStyle = '#FF0000';
  canvasCtx_pose.fillRect(0, 0, canvasElement_pose.width, canvasElement_pose.height);
  
  // Only overwrite missing pixels.
  canvasCtx_pose.globalCompositeOperation = 'destination-atop';
  canvasCtx_pose.drawImage(
    results.image, 0, 0, canvasElement_pose.width, canvasElement_pose.height);
      
  canvasCtx_pose.globalCompositeOperation = 'source-over';
  drawConnectors(canvasCtx_pose, results.poseLandmarks, POSE_CONNECTIONS,
    {color: '#000000', lineWidth: 2});
    drawLandmarks(canvasCtx_pose, results.poseLandmarks,
      {color: '#000000', lineWidth: 2});
      canvasCtx_pose.restore();          
}

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  selfieMode: true

});
pose.onResults(onResults_pose);
const videoElement_hands = document.getElementById('videoElement_hands');
 canvasElement.getContext('2d');
const selectedCamera_hands = cameraDropdown_hands.value;
function onResults_hands(results) {
  console.log(results);
  canvasCtx_hands.save();
  landmarksString_hands ="";
  if (results.multiHandLandmarks) {
    
    const multiHandedness = results.multiHandedness;
    let fillString = ",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
    let _fillString = "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,";
    let sent = false;
    //BOTH HANDS
    if(results.multiHandedness.length > 1)
    {
      //get both 
      let label = multiHandedness[0].label;
      if(label == 'Right')
      {
        let wlandmarks_hands = results.multiHandWorldLandmarks[0].flatMap((lm) => [lm.x, lm.y, lm.z]);
        landmarksString_hands += wlandmarks_hands.join(',');
        //& left
        let _wlandmarks_hands = results.multiHandWorldLandmarks[1].flatMap((lm) => [lm.x, lm.y, lm.z]);
        landmarksString_hands += ',';
        landmarksString_hands += _wlandmarks_hands.join(',');
      }
      else
      {

        let wlandmarks_hands = results.multiHandWorldLandmarks[1].flatMap((lm) => [lm.x, lm.y, lm.z]);
        landmarksString_hands += wlandmarks_hands.join(',');
        //& left
        let _wlandmarks_hands = results.multiHandWorldLandmarks[0].flatMap((lm) => [lm.x, lm.y, lm.z]);
        landmarksString_hands += ',';
        landmarksString_hands += _wlandmarks_hands.join(',');

      }
      console.log('HANDS : ' + landmarksString_hands);
      if (socket_hands.readyState === WebSocket.OPEN) {
        socket_hands.send(landmarksString_hands);
      }
      //socket_hands.send(landmarksString_hands);
      sent = true;
    }
    // ONLY ONE HAND
    if(!sent)
    {
      if(results.multiHandedness.length == 1)
      {
        //get both 
        let label = multiHandedness[0].label;
        if(label == 'Right')
        {
          let wlandmarks_hands = results.multiHandWorldLandmarks[0].flatMap((lm) => [lm.x, lm.y, lm.z]);
          landmarksString_hands += wlandmarks_hands.join(',');
          //& left zoew
          landmarksString_hands += fillString
        }
        else
        {
          landmarksString_hands = _fillString
          let wlandmarks_hands = results.multiHandWorldLandmarks[0].flatMap((lm) => [lm.x, lm.y, lm.z]);
          landmarksString_hands += wlandmarks_hands.join(',');
          //& left zoew
        }
        console.log('HANDS : ' + landmarksString_hands);
        if (socket_hands.readyState === WebSocket.OPEN) {
          socket_hands.send(landmarksString_hands);
        }
        //socket_hands.send(landmarksString_hands);
      }
    }
    for (const landmarks_hands of results.multiHandLandmarks) {
      drawConnectors(canvasCtx_pose, landmarks_hands, HAND_CONNECTIONS,
                     {color: '#0000FF', lineWidth: 5});
      drawLandmarks(canvasCtx_pose, landmarks_hands, {color: '#0000FF', lineWidth: 2});
    }
  }
  canvasCtx_hands.restore();
}

