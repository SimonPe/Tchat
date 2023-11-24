function initWebCam() {
    var n = navigator,
        is_webkit = false;

    function onSuccess(stream) {
        var output = document.getElementById('output'),
            source;

        output.autoplay = true;

        if (!is_webkit) {
            source = stream;
        }
        else {
            source = window.webkitURL.createObjectURL(stream);
        }

        output.src = source;
    }

    function onError() {
        // womp, womp :(
    }

    if (n.getUserMedia) {
        // opera users (hopefully everyone else at some point)
        n.getUserMedia({video:true, audio:true}, onSuccess, onError);
    }
    else if (n.webkitGetUserMedia) {
        // webkit users
        is_webkit = true;
        n.webkitGetUserMedia('video, audio', onSuccess, onError);
    }
}