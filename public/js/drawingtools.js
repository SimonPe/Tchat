// Array of the available drawing tools
var setOfDrawingTools = new Array();
// Previous position of the mouse
var previousMousePos;

// The Pencil Drawing Tool Object.
setOfDrawingTools.pencil = function () {
    this.mousedown = function (event) {
        paint.started = true;
        previousMousePos = getMousePos(paint.getFrontCanvas(), event);
    };

    this.mousemove = function (event) {
        // we delegate the computation of the mouse position
        // to a utility function as this is not so trivial
        var mousePos = getMousePos(paint.getFrontCanvas(), event);

        // Let's draw some lines that follow the mouse pos
        if (paint.started) {
            paint.getMainContext().beginPath();
            paint.getMainContext().moveTo(previousMousePos.x, previousMousePos.y);
            paint.getMainContext().lineTo(mousePos.x, mousePos.y);
            paint.getMainContext().stroke();
            sendPencilMove(mousePos);
        }

        previousMousePos = mousePos;
    };

    // Send the pencil last draw to other clients.
    function sendPencilMove(mousePos) {
        var paintCommand = {};
        paintCommand.type = 'pencilMove';
        paintCommand.previousMousePos = previousMousePos;
        paintCommand.currentMousePos = mousePos;
        paintCommand.properties = paint.getCurrentContextProperties();
        now.distributePaintCommand(paintCommand);
    }

    this.mouseup = function (event) {
        paint.started = false;
    }
};

// The Line Drawing Tool Object
setOfDrawingTools.line = function () {
    this.mousedown = function (event) {
        paint.started = true;
        previousMousePos = getMousePos(paint.getFrontCanvas(), event);
    };


    this.mousemove = function (event) {
        var mousePos = getMousePos(paint.getFrontCanvas(), event);
        if (paint.started) {
            paint.getFrontContext().clearRect(0, 0, paint.getFrontCanvas().width, paint.getFrontCanvas().height);

            paint.getFrontContext().beginPath();
            paint.getFrontContext().moveTo(previousMousePos.x, previousMousePos.y);
            paint.getFrontContext().lineTo(mousePos.x, mousePos.y);
            paint.getFrontContext().stroke();
            sendLineMove(mousePos);
        }
    };

    // Send the line to other clients.
    function sendLineMove(mousePos) {
        var paintCommand = {};
        paintCommand.type = 'lineMove';
        paintCommand.previousMousePos = previousMousePos;
        paintCommand.currentMousePos = mousePos;
        paintCommand.properties = paint.getCurrentContextProperties();
        now.distributePaintCommand(paintCommand);
    }

    this.mouseup = function (event) {
        paint.started = false;
        paint.drawFrontCanvasOnMainCanvas();
        paint.sendOrderToDrawFrontCanvasOnMainCanvas();
    }
};

// The Rectangle Drawing Tool Object
setOfDrawingTools.rectangle = function() {
    var mousePos, x, y, width, height;

    this.mousedown = function (event) {
        previousMousePos = getMousePos(paint.getFrontCanvas(), event);
        paint.started = true;
    }

    this.mousemove = function (event) {
        mousePos = getMousePos(paint.getFrontCanvas(), event);
        // Draw only if we clicked somewhere
        if (paint.started) {
            // clear the content of the canvas
            paint.getFrontContext().clearRect(0, 0, paint.getFrontCanvas().width, paint.getFrontCanvas().height);

            width = Math.abs(previousMousePos.x - mousePos.x);
            height = Math.abs(previousMousePos.y - mousePos.y);
            x = Math.min(previousMousePos.x, mousePos.x);
            y = Math.min(previousMousePos.y, mousePos.y);

            if(paint.getFillShapesStatus()) {
                paint.getFrontContext().fillRect(x, y, width, height);
            }
            paint.getFrontContext().strokeRect(x, y, width, height);
            sendRectangleMove(x,y,width,height);
        }
    }

    // Send the rectangle to other clients.
    function sendRectangleMove(x,y,width,height) {
        var paintCommand = {};
        paintCommand.type = 'rectangleMove';
        paintCommand.x = x;
        paintCommand.y = y;
        paintCommand.width = width;
        paintCommand.height = height;
        paintCommand.properties = paint.getCurrentContextProperties();
        paintCommand.fill = paint.getFillShapesStatus();
        now.distributePaintCommand(paintCommand);
    }

    this.mouseup = function (event) {
        paint.started = false;
        paint.drawFrontCanvasOnMainCanvas();
        paint.sendOrderToDrawFrontCanvasOnMainCanvas();
    }
};

// The Circle Drawing Tool Object
setOfDrawingTools.circle = function() {
    var mousePos, x, y, radius;

    this.mousedown = function (event) {
        previousMousePos = getMousePos(paint.getFrontCanvas(), event);
        paint.started = true;
    }

    this.mousemove = function (event) {
        mousePos = getMousePos(paint.getFrontCanvas(), event);
        // Draw only if we clicked somewhere
        if (paint.started) {
            // clear the content of the canvas
            paint.getFrontContext().clearRect(0, 0, paint.getFrontCanvas().width, paint.getFrontCanvas().height);

            // center of the circle is the position that has been clicked
            x = previousMousePos.x;
            y = previousMousePos.y;
            // radius is the distance between the clicked position (center) and current position
            radius = Math.sqrt(Math.pow(previousMousePos.x - mousePos.x, 2) +  Math.pow(previousMousePos.y - mousePos.y, 2));
            paint.getFrontContext().beginPath();
            paint.getFrontContext().arc(x, y, radius, 0, 2 * Math.PI, false);

            if(paint.getFillShapesStatus()) {
                paint.getFrontContext().fill();
            }
            paint.getFrontContext().stroke();

            sendCircleMove(x,y,radius);
        }
    }
    // Send the circle to other clients.
    function sendCircleMove(x,y,radius) {
        var paintCommand = {};
        paintCommand.type = 'circleMove';
        paintCommand.x = x;
        paintCommand.y = y;
        paintCommand.radius = radius;
        paintCommand.properties = paint.getCurrentContextProperties();
        paintCommand.fill = paint.getFillShapesStatus();
        now.distributePaintCommand(paintCommand);
    }

    this.mouseup = function (event) {
        paint.started = false;
        paint.drawFrontCanvasOnMainCanvas();
        paint.sendOrderToDrawFrontCanvasOnMainCanvas();
    }
};



setOfDrawingTools.webcam = function() {
    var mousePos, previousMousePos, x, y;
    // ref to the video element that displays webcam real time content
    var video =document.getElementById('output');

    // An off screen canvas for getting webcam data
    var offScreenCanvas= document.createElement('canvas');
    var offScreenContext = offScreenCanvas.getContext('2d');

    this.mousedown = function (event) {
        previousMousePos = getMousePos(paint.getFrontCanvas(), event);
        paint.started = true;
    }

    this.mousemove = function (event) {
        mousePos = getMousePos(paint.getFrontCanvas(), event);
        // Draw only if we clicked somewhere
        if (paint.started) {
            // clear the content of the front canvas
            paint.getFrontContext().clearRect(0, 0, paint.getFrontCanvas().width, paint.getFrontCanvas().height);

            // Size and pos of the elastic rectangle with video snapshot inside
            var imageProperties = computeProperties(previousMousePos, mousePos);

            // Draw video content on front canvas
            paint.getFrontContext().drawImage(video,imageProperties.x,imageProperties.y, imageProperties.width,imageProperties.height);


            // draw in the offscreen canvas a snapshot of current picture displayed in the video element
            offScreenCanvas.width = imageProperties.width;
            offScreenCanvas.height = imageProperties.height;
            offScreenContext.drawImage(video, 0,0, imageProperties.width,imageProperties.height);
            // Get this snapshot as a base64 picture
            var imageData = offScreenCanvas.toDataURL("image/png");

           // send image data through websocket
           sendWebcamMove(imageData,imageProperties);
        }
    }

    // Compute the coordinates of the top left corner and the size of the image drawn.
	function computeProperties(previousMousePos, mousePos){
	    var properties = {};
        properties.x = Math.min(previousMousePos.x, mousePos.x);
        properties.y = Math.min(previousMousePos.y, mousePos.y);
        properties.width = Math.abs(previousMousePos.x - mousePos.x);
        properties.height = Math.abs(previousMousePos.y - mousePos.y);
        return properties;
    }

    // Send the rectangle to other clients.
    function sendWebcamMove(imageData,properties) {
         var paintCommand = {};
        paintCommand.type = 'webcamMove';
        paintCommand.imageData = imageData;
        paintCommand.x = properties.x;
        paintCommand.y = properties.y;
        paintCommand.width = properties.width;
        paintCommand.height = properties.height;
        now.distributePaintCommand(paintCommand);
    }

    this.mouseup = function (event) {
        paint.started = false;
        paint.drawFrontCanvasOnMainCanvas();
        paint.sendOrderToDrawFrontCanvasOnMainCanvas();
    }
};