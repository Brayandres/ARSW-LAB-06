var apidraw = (function() {

    var lastPt = null;

    function init() {
        var canvas = _getCanvas();
        var liveDemoRawData = document.getElementById('liveDemoRawData');
        liveDemoRawData.style.display='block';
        var rawDataLink = document.getElementById('rawDataLink');
        rawDataLink.style.display='none';
        if (window.PointerEvent) {
            canvas.addEventListener(
                "pointerdown",
                function() {canvas.addEventListener("pointermove", _draw, false)},
                false
            );
            canvas.addEventListener("pointerup", _endPointer, false);
            canvas.addEventListener("pointermove", _getCoords, false);
        }
        else {
            canvas.addEventListener(
                "mousedown",
                function() {canvas.addEventListener("mousemove", _draw, false)},
                false
            );
            canvas.addEventListener("mouseup", _endPointer, false);
            canvas.addEventListener("mouseomove", _getCoords, false);
        }
    }

    function _getCanvas() {
        var canvas = document.getElementById("ownCanvas");
        return canvas;
    }

    function _draw(event) {
        var context = _getCanvas().getContext("2d");
        var offset = _getOffset(_getCanvas());
        if (lastPt != null) {
            context.beginPath();
            context.moveTo(lastPt.x-offset.left, lastPt.y-offset.top);
            context.lineTo(event.pageX-offset.left, event.pageY-offset.top);
            context.stroke();
        }
        lastPt = {x:event.pageX, y:event.pageY};
    }

    function _endPointer() {
        var canvas = _getCanvas();
        canvas.removeEventListener("pointermove", _draw, false);
        canvas.removeEventListener("mousemove", _draw, false);
        lastPt = null;
    }

    function _getOffset(obj) {
        var offsetLeft = 0;
        var offsetTop = 0;
        do {
            if (!isNaN(obj.offsetLeft)) {
                offsetLeft += obj.offsetLeft;
            }
            if (!isNaN(obj.offsetTop)) {
                offsetTop += obj.offsetTop;
            }   
        } while(obj = obj.offsetParent );
        return {left: offsetLeft, top: offsetTop};
    }

    function _getCoords(event) {
        let _coords = document.getElementById("coords");
        let _position = _getCanvas().getBoundingClientRect();
        let _deltaX = _position.left;
        let _deltaY = _position.top;
        coords.innerHTML = "("+(event.pageX-Math.floor(_deltaX))+", "+(event.pageY-Math.floor(_deltaY))+")";
    }

    return {init: init};

})();