// Utility function that returns an mousePos object
// taking into account the offsets of the element and
// of its parent. The return pos is relative to
// the top left corner of the elem. This version is supported
// by all recent browsers
// Borrowed from HTML5CanvasTutorials.com
function getMousePos(obj, evt) {
    // get canvas position
    var top = 0;
    var left = 0;
    while (obj && obj.tagName != 'BODY') {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    // return relative mouse position
    var mouseX = evt.clientX - left + window.pageXOffset;
    var mouseY = evt.clientY - top + window.pageYOffset;
    return {
        x:mouseX,
        y:mouseY
    };
}
