// var apiRest = apiclient;
var apiRest = apimock;
var drawApi = apidraw;

var bluePrintApp = (function (){
	var _author;
	var _blueprints = [];
	var _isAnyPlaneOpen = false;
	var currentBlueprint = null;

	var isAnyPlaneOpen = function() {
		return _isAnyPlaneOpen;
	};

	var _mapBlueprints = function(blueprints) {
		return blueprints.map(
			function(blueprint) {
				return {
					name: blueprint.name,
					numberOfPoints: blueprint.points.length
				};
			}
		);
	};
	
	var _calculateTotalPoints = function(bpList) {
		var total = 0;
		bpList.forEach(
			function(bp) {
				total += bp.numberOfPoints;
			}
		);
		$("#subt-total").text("Total user points: "+total);
	};
	
	var _fillTable = function(blueprints) {
		var bpsMaped = _mapBlueprints(blueprints);
		_calculateTotalPoints(bpsMaped);
		$('#tb-body').empty();
		bpsMaped.map(
			function (blueprint) {
				$('#tb-body').append(
					"<tr>"+
						"<td>"+blueprint.name+"</td>"+
						"<td>"+blueprint.numberOfPoints+"</td>"+
						"<td>"+
							"<button class='button-open' type='button' onclick='bluePrintApp.drawBlueprint"+
							"( \""+_author+'", "'+blueprint.name+"\")"+
							"'>open</button>"+
						"</td>"+
					"</tr>"
				);
			}
		);
		console.log("_fillTable(): Tabla Creada");
	};

	var _drawConcreteBlueprint = function(blueprint) {
		console.log("    _drawConcreteBlueprint(): Entra.");
		$("#subt-current").text("Current Blueprint: "+blueprint.name);
		currentBlueprint = blueprint;
		var points = blueprint.points;
		var canvas = document.getElementById("ownCanvas");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.moveTo(points[0].x, points[0].y);
		points.forEach(
			function(item, index) {
				if (index > 0) {
					ctx.lineTo(item.x, item.y);
				}
			}
		);
		ctx.stroke();
		_isAnyPlaneOpen = true;
		notifyApiDraw(true);
	};

	var setAuthorName = function(author) {
		_author = author;
	};

	var generateBleuprintsList = function(author) {
		setAuthorName(author);
		$("#subt-author").text(author+"'s Blueprints:");
		apiRest.getBlueprintsByAuthor(author, _fillTable);
	};

	var drawBlueprint = function(author, bpName) {
		console.log("  drawBlueprint(): Entra.");
		apiRest.getBlueprintsByNameAndAuthor(author, bpName, _drawConcreteBlueprint);
	};

	function _voidCanvas() {
		var canvas = document.getElementById("ownCanvas");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function closeCurrentBlueprint() {
		if (_isAnyPlaneOpen) {
			_voidCanvas();
			$("#subt-current").text("Current Blueprint:");
			notifyApiDraw(false);
			currentBlueprint = null;
			isAnyPlaneOpen = false;
		}
	}

	function notifyApiDraw(value) {
		drawApi.setIfisAnyPlaneOpen(value);
	}

	return {
		setAuthorName: setAuthorName,
		drawBlueprint: drawBlueprint,
		generateBleuprintsList: generateBleuprintsList,
		isAnyPlaneOpen: isAnyPlaneOpen,
		closeCurrentBlueprint: closeCurrentBlueprint
	};
})();