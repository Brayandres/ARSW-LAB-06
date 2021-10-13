var apiRest = apiclient;
// var apiRest = apimock;

var bluePrintApp = (function (){

	var _author = null;
	var _newPoints = [];
	var _blueprints = [];
	var _lastDrawnPoint = null;
	var _isAnyBlueprintOpen = false;
	var _currentBlueprint = null;

	var isAnyBlueprintOpen = function() {
		return _isAnyBlueprintOpen;
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
		_currentBlueprint = blueprint;
		var points = blueprint.points;
		if (!(points == null || points.length == 0)) {
			_lastDrawnPoint = points[points.length - 1];
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
		}
		_isAnyBlueprintOpen = true;
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
		if (_isAnyBlueprintOpen) {
			_voidCanvas();
			$("#subt-current").text("Current Blueprint:");
			_newPoints = [];
			_lastDrawnPoint = null;
			_currentBlueprint = null;
			_isAnyBlueprintOpen = false;
		}
	}

	function drawWithNewPoint(point) {
		_newPoints.push(point);
		var canvas = document.getElementById("ownCanvas");
		var context = canvas.getContext("2d");
		if (_lastDrawnPoint != null) {
			context.moveTo(_lastDrawnPoint.x, _lastDrawnPoint.y);
			context.lineTo(point.x, point.y);
			context.stroke();
		}
		_lastDrawnPoint = point;
	}


	// -------------------------------------- POST's & GET's --------------------------------------
	function putUpdatedBluePrint() {
		console.log("---- ("+_currentBlueprint.name+") NEW_POINTS LEN:"+_newPoints.length);
		let allPoints = _currentBlueprint.points.concat(_newPoints);
		_currentBlueprint.points = allPoints;
		console.log("---- CurrentBP.Points: "+_currentBlueprint.points);
		var putPromise = $.ajax({
			url: "blueprints/"+_currentBlueprint.author+"/"+_currentBlueprint.name,
			type: "PUT",
			data: JSON.stringify(_currentBlueprint),
			contentType: "application/json"
		});
		putPromise.then(
			function() {
				generateBleuprintsList(_currentBlueprint.author);
				_newPoints = [];
				apiRest.getBlueprintsByNameAndAuthor(
					_currentBlueprint.author,
					_currentBlueprint.name,
					function(blueprint) {
						_currentBlueprint = blueprint;
					}
				);
				alert("The Blueprint has been updated correctly!");
			},
			function() {
				alert("Oops something has gone wrong...");
			}
		);
	}

	function _addNewBlueprint(bPname) {
		closeCurrentBlueprint();
		let currentAuthor = (_author == null || _author.length == 0)?"User":_author;
		let newBlueprint = {author:currentAuthor, name:bPname, points:[]};
		var postPromise = $.ajax({
			url: "blueprints/", type: "POST", data: JSON.stringify(newBlueprint),
			contentType: "application/json"
		});
		postPromise.then(
			function() {
				_currentBlueprint = newBlueprint;
				_isAnyBlueprintOpen = true;
				$("#subt-current").text("Current Blueprint: "+bPname);
				generateBleuprintsList(_currentBlueprint.author);
				alert("Your new Blueprint has been CREATED correctly!");
			},
			function() {
				alert("Oops something has gone wrong...");
			}
		);
	}

	function createNewBlueprint() {
		bootbox.confirm(
			"Ingresa el nombre del nuevo plano:"+
			"<p>"+
				"<input id='newBpName' type='text' size='20' placeholder='Nombre del plano'/>"+
			"</p>",
			function (result) {
				let newName = $("#newBpName").val();
				if (!result) {
					// Do nothing
				}
				else if (newName == null || newName.length == 0) {
					alert("Debe ingresar un nombre para poder crear el plano.");
				}
				else if (result) {
					_addNewBlueprint(newName);
				}
			}
		);
	}

	function deleteBlueprint() {
		if (_isAnyBlueprintOpen) {
			let deletePromise = $.ajax({
				url: "blueprints/"+_currentBlueprint.author+"/"+_currentBlueprint.name,
				type: "DELETE", contentType: "application/json"
			});
			deletePromise.then(
				function() {
					closeCurrentBlueprint();
					generateBleuprintsList(_author);
					alert("Se ha eleiminado el plano");
				},
				function() {
					alert("Oops something has gone wrong...");
				}
			);
		}
		else {
			alert("Debe abrir un plano para poder eliminarlo.");
		}
	}

	return {
		setAuthorName: setAuthorName,
		drawBlueprint: drawBlueprint,
		generateBleuprintsList: generateBleuprintsList,
		isAnyBlueprintOpen: isAnyBlueprintOpen,
		closeCurrentBlueprint: closeCurrentBlueprint,
		drawWithNewPoint: drawWithNewPoint,
		putUpdatedBluePrint: putUpdatedBluePrint,
		createNewBlueprint: createNewBlueprint,
		deleteBlueprint: deleteBlueprint
	};
})();