import axios from 'axios';
var callDuration = 0; // Biến đếm thời gian cuộc gọi (giây)
var callTimer; // Biến interval để cập nhật thời gian
var timer ='00';
let checkAnswer = false;
// Hàm cập nhật thời gian gọi
function updateCallDuration() {
    callDuration++;
    // Cập nhật hiển thị thời gian gọi ở đây (ví dụ: thông qua jQuery)
   timer = (formatTime(callDuration));
}

// Hàm định dạng thời gian thành dạng hh:mm:ss
function formatTime(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var remainingSeconds = seconds % 60;
    console.log(hours.toString().padStart(2, '0') + ':' +
    minutes.toString().padStart(2, '0') + ':' + 
    remainingSeconds.toString().padStart(2, '0'))
    return hours.toString().padStart(2, '0') + ':' +
           minutes.toString().padStart(2, '0') + ':' +
           remainingSeconds.toString().padStart(2, '0');
}

function settingCallEvent(call1, localVideo, remoteVideo, answerCallButton, endCallButton, rejectCallButton, currentCall, sendMessageCallVideo) {
    call1.on('addremotestream', function (stream) {
        // reset srcObject to work around minor bugs in Chrome and Edge.
       
        console.log('addremotestream');
        remoteVideo.srcObject = null;
        remoteVideo.srcObject = stream;
    });

    call1.on('addlocalstream', function (stream) {
        // reset srcObject to work around minor bugs in Chrome and Edge.
        console.log('addlocalstream');
        localVideo.srcObject = null;
        localVideo.srcObject = stream;
    });

    call1.on('signalingstate', function (state) {
        console.log('signalingstate ', state);
        if(state.code===3){
            callDuration = 0; // Đặt lại biến đếm thời gian
            callTimer = setInterval(updateCallDuration, 1000); 
            checkAnswer = true
        }
        if (state.code === 6 || state.code === 5)//end call or callee rejected
        {
            if (state.code === 6) {
                clearInterval(callTimer); 
                sendMessageCallVideo("Cuộc gọi video "+timer)
                console.log("thời gian cuộc gọi: ", timer)
            }
            else if(state.code === 5){
                sendMessageCallVideo("Cuộc gọi video bị từ chối")
                console.log("cuộc gọi bị từ chối")
            }
            console.log(timer);
            // alert(timer)
            window.close()
            // callButton.show();
            endCallButton.hide();
            rejectCallButton.hide();
            answerCallButton.hide();
            localVideo.srcObject = null;
            remoteVideo.srcObject = null;
            remoteVideo.src = null;
            $('#incoming-call-notice').hide();
        }
    });

    call1.on('mediastate', function (state) {
        console.log('mediastate ', state);
        if(state.code===2){
            window.close()
        }
    });

    call1.on('info', function (info) {
        console.log('on info:' + JSON.stringify(info));
    });
}

jQuery(function () {
    async function sendMessageCallVideo(text){
        const data1 = {
            message: {
              receiverId: JSON.parse(receivedData).calleeId,
              user: {
                idUser: JSON.parse(receivedData).callerId,
                name: localStorage.getItem('myName'),
                avatar: localStorage.getItem('myAvatar')
              },
              text: text,
              type: "video-call",
              chatId: localStorage.getItem('chatId')
            }
          }
         const data2 = {
            message: {
              receiverId: JSON.parse(receivedData).callerId,
              user: {
                idUser: JSON.parse(receivedData).callerId,
                name: localStorage.getItem('myName'),
                avatar: localStorage.getItem('myAvatar')
              },
              text: text,
              type: "video-call",
              chatId: localStorage.getItem('chatId')
            }
          }
        
          await axios.post('http://localhost:3000/ws/send-message-to-user', data1).then((res) => {
            //xóa đi data.message trong mảng messagesCurren
          }).catch(() => {
            console.log('Error when send message')

          })
        //   await axios.post('http://localhost:3000/ws/send-message-to-user', data2).then((res) => {
        //     //xóa đi data.message trong mảng messagesCurren
        //   }).catch(() => {
        //     console.log('Error when send message')

        //   })
        }
        
    function makeCall() {
        currentCall = new StringeeCall(client, callerId, calleeId, true);
        settingCallEvent(currentCall, localVideo, remoteVideo, answerCallButton, endCallButton, rejectCallButton, currentCall, sendMessageCallVideo);
        remoteVideo.src = "https://res.cloudinary.com/dekjrisqs/video/upload/v1715183781/oc75nvbiljleocfl8hun.mp4"
        remoteVideo.play();
        currentCall.makeCall(function (res) {
            console.log('+++ call callback: ', res);
            if (res.message === 'SUCCESS') {
                document.dispatchEvent(new Event('connect_ok'));
            }
        });
    }

    // makeCall()

    async function notifyCallVideo() {
        const stringee = localStorage.getItem('dataCall')
        const data = {
            receiverId: JSON.parse(stringee).calleeId,
            callerId: JSON.parse(stringee).callerId,
            name: localStorage.getItem('myName'),
        }
        await axios.post('http://localhost:3000/ws/sendNotifyCallVideo', data).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        }
        )
    }

    var localVideo = document.getElementById('localVideo');
    // var callButton = $('#callButton');
    var answerCallButton = $('#answerCallButton');
    var rejectCallButton = $('#rejectCallButton');
    var endCallButton = $('#endCallButton');


    var currentCall = null;

    var client = new StringeeClient();
    client.connect(token);

    client.on('connect', function () {

        console.log('+++ connected!');
    });

    client.on('authen', function (res) {
        console.log('+++ on authen: ', res);
    });

    client.on('disconnect', function (res) {
        console.log('+++ disconnected');
    });
    if (checkCall) {
        setTimeout(() => {
            makeCall()
            notifyCallVideo()
           
        }, 500);
    }
    //    var toggleMicButton = $('#toggleMicButton');
    var toggleVideoButton = $('#toggleVideoButton');

    // Function to toggle microphone
    // toggleMicButton.on('click', function(){
    //     if (currentCall != null) {
    //         var isMuted = currentCall.getMediaState().audioEnable;
    //         currentCall.mute(!isMuted, function(res){
    //             console.log('+++ toggling mic: ', res);
    //         });
    //     }
    // });

    // Function to toggle local video
    let enableCamera = true;
    toggleVideoButton.on('click', function () {
        // if (currentCall != null)
        //     {
        //         enableCamera = !enableCamera;
        //        currentCall.enableLocalVideo(enableCamera)
        //     }
    });
    window.addEventListener('beforeunload', function(event) {
        // Kiểm tra nếu cuộc gọi đang diễn ra
        if (currentCall != null) {
            clearInterval(callTimer); // Dừng interval
            // Kết thúc cuộc gọi
            currentCall.hangup(function(res) {
                console.log('+++ hangup: ', res);
            });
        }
    });
    //MAKE CALL
    // callButton.on('click', function(){



    // });


    //RECEIVE CALL
    client.on('incomingcall', function (incomingcall) {
        currentCall = incomingcall;
        settingCallEvent(currentCall, localVideo, remoteVideo, answerCallButton, endCallButton, rejectCallButton, currentCall , sendMessageCallVideo  );
        // callButton.hide();
        answerCallButton.show();
        rejectCallButton.show();

    });

    //Event handler for buttons
    answerCallButton.on('click', function () {
        $(this).hide();
        rejectCallButton.hide();
        endCallButton.show();
        // callButton.hide();
        console.log('current call ', currentCall, typeof currentCall);
        if (currentCall != null) {
            currentCall.answer(function (res) {
                console.log('+++ answering call: ', res);
            });
        }

    });

    rejectCallButton.on('click', function () {
        
        remoteVideo.src = null
        if (currentCall != null) {
            currentCall.reject(function (res) {
                console.log('+++ reject call: ', res)
                currentCall=null
                // window.close()
            });
        }

        // callButton.show();
        $(this).hide();
        answerCallButton.hide();

    });

    endCallButton.on('click', function () {
        clearInterval(callTimer); 
        if(checkAnswer===false){
            sendMessageCallVideo("Cuộc gọi nhỡ")
        }
        else{
            sendMessageCallVideo("Cuộc gọi video "+timer)
        }
        
        // alert(timer)
        remoteVideo.src = null
        if (currentCall != null) {
            currentCall.hangup(function (res) {
                console.log('+++ hangup: ', res);
                currentCall = null
                // window.close()
            });
        }

        // callButton.show();
        endCallButton.hide();

    });




    //event listener to show and hide the buttons
    document.addEventListener('connect_ok', function () {
        // callButton.hide();
        endCallButton.show();
    });


});