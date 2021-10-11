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
        if (bpApp.isAnyBlueprintOpen()) {
            var offset = _getOffset(_getCanvas());
            var context = _getCanvas().getContext("2d");
            var point = {x:event.pageX-offset.left, y:event.pageY-offset.top};
            context.fillRect(point.x, point.y, 4, 4);
            bpApp.drawWithNewPoint(point);
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