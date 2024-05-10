import axios from 'axios';
var callDuration = 0; // Biến đếm thời gian cuộc gọi (giây)
var callTimer; // Biến interval để cập nhật thời gian
var timer;

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
 
    return hours.toString().padStart(2, '0') + ':' +
           minutes.toString().padStart(2, '0') + ':' +
           remainingSeconds.toString().padStart(2, '0');
}

function settingCallEvent(call1, localVideo, remoteVideo, answerCallButton, endCallButton, rejectCallButton) {
    call1.on('addremotestream', function (stream) {
        // reset srcObject to work around minor bugs in Chrome and Edge.
        callDuration = 0; // Đặt lại biến đếm thời gian
        callTimer = setInterval(updateCallDuration, 1000); // Bắt đầu interval
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

        if (state.code === 6 || state.code === 5)//end call or callee rejected
        {
            clearInterval(callTimer); // Dừng interval
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
    });

    call1.on('info', function (info) {
        console.log('on info:' + JSON.stringify(info));
    });
}

jQuery(function () {
    function makeCall() {
        currentCall = new StringeeCall(client, callerId, calleeId, true);

        settingCallEvent(currentCall, localVideo, remoteVideo, answerCallButton, endCallButton, rejectCallButton);
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
            notifyCallVideo()
            makeCall()
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
    toggleVideoButton.on('click', function () {
        var localStream = localVideo.srcObject;
        if (localStream) {
            var tracks = localStream.getTracks();
            tracks.forEach(function (track) {
                track.enabled = !track.enabled;
            });
        }
    });
    window.addEventListener('beforeunload', function(event) {
        // Kiểm tra nếu cuộc gọi đang diễn ra
        if (currentCall != null) {
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
        settingCallEvent(currentCall, localVideo, remoteVideo, answerCallButton, endCallButton, rejectCallButton);
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
                console.log('+++ reject call: ', res);
                window.close()
            });
        }

        // callButton.show();
        $(this).hide();
        answerCallButton.hide();

    });

    endCallButton.on('click', function () {
        clearInterval(callTimer); 
        // alert(timer)
        remoteVideo.src = null
        if (currentCall != null) {
            currentCall.hangup(function (res) {
                console.log('+++ hangup: ', res);
                window.close()
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