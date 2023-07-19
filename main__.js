let socket_pose;
let socket_hands;
let canvasElement_pose , canvasCtx_pose, grid, landmarksString;//landmarkContainer;
const videoElement_pose = document.getElementById('videoElement_pose');

let input_id = 0;
let cameraDropdown_pose = document.querySelector('.camera-dropdown_pose');

//list all webcams to dropdown

let videoDevices = [];

navigator.mediaDevices.enumerateDevices().then(function (devices) 
{
  for(var i = 0; i < devices.length; i ++)
  {


   // var videoDevices = [];
   // devices.forEach(function(device) {
     // if (devices[i].kind === 'videoinput')
      {
        videoDevices.push(devices[i]);
        var option = document.createElement('option');
        option.text = i + 1 + ' ' + devices[i].kind; //device.kind + ' ' + (i + 1) + device.deviceId; //|| 'camera ' + (i + 1) + device.label;

        option.value = i;
        document.querySelector('select#camera-dropdown_pose').appendChild(option);
      }
    //});

    // var device = devices[i];

    // //only webcam
    // if (device.kind === 'videoinput') {
    //   var option = document.createElement('option');
    //   option.value = device.deviceId;
    //   option.text = device.kind + ' ' + (i + 1); //|| 'camera ' + (i + 1) + device.label;
    //   document.querySelector('select#camera-dropdown_pose').appendChild(option);
    // }
  };
});

const selectedCamera = cameraDropdown_pose.value;
cameraDropdown_pose.addEventListener('change', function() 
{
  navigator.mediaDevices_hands.getUserMedia({
    // video: {
    //   //deviceId: cameraDropdown_pose.value
    //  // deviceId: videoDevices[cameraDropdown_pose.value].device.deviceId
    //   device: videoDevices[cameraDropdown_pose.value]
    // }
  }).then(function(stream) {
    videoElement_pose.srcObject = videoDevices[cameraDropdown_pose.value];
  }).catch(function(error) {
    console.log(error);
  });
});

function init_pose() 
{

  console.log('print socket: ' + socket_pose);
  canvasElement_pose = document.getElementsByClassName('output_canvas_pose')[0];
  //landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
  //grid = new LandmarkGrid(landmarkContainer);
  landmarksString = "placeholder";
  canvasCtx_pose = canvasElement_pose.getContext('2d');

}

document.querySelector('.start-button-pose').addEventListener('click', () => {
  socket_pose = new WebSocket('ws://' + document.querySelector('.ip-input').value + '/pose');
  socket_pose.onmessage = function(e) {
    socket_onmessage_callback(e.data);
  }
  let camera = new Camera(videoElement_pose,
    {
      onFrame: async () => {
        await pose.send({image: videoElement_pose});
      },
      width: 1280/3,
      height: 720/3
    });
  init_pose();
  camera.start();
  canvasCtx_pose = canvasElement_pose.getContext('2d');
});

function start_pose() {
  socket_pose = new WebSocket('ws://' + document.querySelector('.ip-input').value + '/pose');
  socket_pose.onmessage = function(e) {
    socket_onmessage_callback(e.data);
  }
  let camera = new Camera(videoElement_pose,
    {
      onFrame: async () => {
        await pose.send({image: videoElement_pose});
      },
      width: 1280/3,
      height: 720/3
    });
  init_pose();
  //camera.start();
  canvasCtx_pose = canvasElement_pose.getContext('2d');
}

{/* <script type="module"> */}

function socket_onmessage_callback(data) {
}
function onResults_pose(results)
{
  if (!results.poseWorldLandmarks)
  {
    grid.updateLandmarks([]);
    return;
  }
  console.log(results);
  const landmarks = results.poseWorldLandmarks.flatMap((lm) => [lm.x, lm.y, lm.z, lm.visibility]);
  landmarksString = landmarks.join(',');
  
  socket_pose.send(landmarksString);
  canvasCtx_pose.save();
  canvasCtx_pose.clearRect(0, 0, canvasElement_pose.width, canvasElement_pose.height);
  canvasCtx_pose.drawImage(results.segmentationMask, 0, 0,
    canvasElement_pose.width, canvasElement_pose.height);
    
  // Only overwrite existing pixels.
  canvasCtx_pose.globalCompositeOperation = 'source-in';
  canvasCtx_pose.fillStyle = '#00FF00';
  canvasCtx_pose.fillRect(0, 0, canvasElement_pose.width, canvasElement_pose.height);
  
  // Only overwrite missing pixels.
  canvasCtx_pose.globalCompositeOperation = 'destination-atop';
  canvasCtx_pose.drawImage(
    results.image, 0, 0, canvasElement_pose.width, canvasElement_pose.height);
      
  canvasCtx_pose.globalCompositeOperation = 'source-over';
  drawConnectors(canvasCtx_pose, results.poseLandmarks, POSE_CONNECTIONS,
    {color: '#FF0000', lineWidth: 2});
    drawLandmarks(canvasCtx_pose, results.poseLandmarks,
      {color: '#FF0000', lineWidth: 2});
      canvasCtx_pose.restore();
  
          //rid.updateLandmarks(results.poseWorldLandmarks);
}
const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}}); 

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

// = document.getElementsByClassName('input_video_hands')[0];
let canvasElement_hands;// = document.getElementsByClassName('output_canvas_hands')[0];
let canvasCtx_hands;// = canvasElement.getContext('2d');
let landmarksString_hands;

let output_pose
function init_hands() {
  
  //console.log('print sockethands : ' + socket_hands);
  canvasElement_hands = document.getElementsByClassName('output_canvas_pose')[0];
  //GET output_canvas_pose image data
  output_pose = canvasElement_hands.getContext('2d').getImageData(0, 0, canvasElement_hands.width, canvasElement_hands.height);


  //landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
  //grid = new LandmarkGrid(landmarkContainer);
  landmarksString_hands = "placeholder";
}
const cameraDropdown_hands = document.querySelector('.camera-dropdown_hands');
navigator.mediaDevices.enumerateDevices().then(function (devices) {
  for(var i = 0; i < devices.length; i ++){
    var device = devices[i];
    if (device.kind === 'videoinput') {
      var option = document.createElement('option');
      option.value = device.deviceId;
      option.text = device.kind + ' ' + (i + 1); //|| 'camera ' + (i + 1) + device.label;
      document.querySelector('select#camera-dropdown_hands').appendChild(option);
    }
  };
});
document.querySelector('.start-button-hands').addEventListener('click', () => {
  socket_hands = new WebSocket('ws://' + document.querySelector('.ip-input').value + '/hands');
  socket_hands.onmessage = function(e) {
    socket_onmessage_callback(e.data);
  }
  let camera = new Camera(videoElement_hands,
    {
      onFrame: async () => {
        await hands.send({image: videoElement_hands});
      },
      width: 1280/3,
      height: 720/3
    });
  init_hands();
  init_pose();

  camera.start();
  canvasCtx_hands = canvasElement_hands.getContext('2d');
//  start_pose();
});
// document.querySelector('.start-button-hands').addEventListener('click', () => {
//   socket_hands = new WebSocket('ws://' + document.querySelector('.ip-input').value + '/hands');
//   socket_hands.onmessage = function(e) {
//     socket_onmessage_callback(e.data);
//   //}
//   let camera = new Camera(videoElement_hands, {
//     onFrame: async () => {
//       await hands.send({image: videoElement_hands});
//     },
//     width: 1280/3,
//     height: 720/3
//   });
//   init_hands();
//   camera.start();
//   canvasCtx_hands = canvasElement_hands.getContext('2d');
// }});
const selectedCamera_hands = cameraDropdown_hands.value;
cameraDropdown_hands.addEventListener('change', function() {
  navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: cameraDropdown_hands.value
    }
  }).then(function(stream) {
    videoElement_hands.srcObject = cameraDropdown_hands.value;
  }).catch(function(error) {
    console.log(error);
  });
});
function onResults_hands(results) {
  
  console.log(results);
  canvasCtx_hands.save();
 // canvasCtx_hands.clearRect(0, 0, canvasElement_hands.width, canvasElement_hands.height);
  canvasCtx_hands.drawImage(
      results.image, 0, 0, canvasCtx_pose.width, canvasCtx_pose.height);
      pose.send({image: videoElement_pose});
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
      socket_hands.send(landmarksString_hands);
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
  
        socket_hands.send(landmarksString_hands);
      }

    }
    //console.log(landmarksString_hands)
    // for (let index = 0; index < results.multiHandWorldLandmarks.length; index++) {
    //   //const element = array[index];
    //   let wlandmarks_hands = 
    //   results.multiHandWorldLandmarks[index].flatMap((lm) => [lm.x, lm.y, lm.z]);
    //   landmarksString_hands += wlandmarks_hands.join(',');
    // }

    //console.log("whands string: " + landmarksString_hands)
    for (const landmarks_hands of results.multiHandLandmarks) {
      drawConnectors(canvasCtx_pose, landmarks_hands, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 5});
      drawLandmarks(canvasCtx_pose, landmarks_hands, {color: '#FF0000', lineWidth: 2});
    }
  }
  canvasCtx_hands.restore();
}

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

// const camera = new Camera(videoElement_hands, {
//   onFrame: async () => {
//     await hands.send({image: videoElement_hands});
//   },
//   width: 1280,
//   height: 720
// });
// camera.start();