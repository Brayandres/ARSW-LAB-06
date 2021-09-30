var apiRest = apimock;

var bluePrintApp = (function (){
	var _author;
	var _blueprints = [];

	var setAuthorName = function(author) {
		_author = author;
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
					"<tr><td>"+
					blueprint.name+
					"</td>"+
					"<td>"+
					blueprint.numberOfPoints+
					"</td>"+
					"<td>"+
					"</td></tr>"
				);
			}
		);
	};

	var generateBleuprintsList = function(author) {
		setAuthorName(author);
		$("#subt-author").text(author+"'s Blueprints:");
		apiRest.getBlueprintsByAuthor(author, _fillTable);
	};

	return {
		setAuthorName: setAuthorName,
		generateBleuprintsList: generateBleuprintsList
	};
})();