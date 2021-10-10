var bpApp = bluePrintApp;

var apidraw = (function() {

    function init() {
        var canvas = _getCanvas();
        if (window.PointerEvent) {
            canvas.addEventListener("pointerdown", _draw, false);
            canvas.addEventListener("pointermove", _getCoords, false);
        }
        else {
            canvas.addEventListener("mousedown", _draw, false);
            canvas.addEventListener("mouseomove", _getCoords, false);
        }
    }

    function _getCanvas() {
        var canvas = document.getElementById("ownCanvas");
        return canvas;
    }

    function _draw(event) {
        if (bpApp.isAnyPlaneOpen()) {
            var offset = _getOffset(_getCanvas());
            var context = _getCanvas().getContext("2d");
            context.fillRect(event.pageX-offset.left, event.pageY-offset.top, 5, 5);
        }
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
        } while(obj = obj.offsetParent);
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