var apimock = (function () {

    var mockdata = [];

    mockdata['JhonConnor'] = [
        {
            author: 'JhonConnor',
            name: "house",
            points: [
                {
                    x: 10,
                    y: 20
                },
                {
                    x: 15,
                    y: 25
                },
                {
                    x: 45,
                    y: 25
                }
            ]
        },
        {
            author: 'JhonConnor',
            name: "bike",
            points: [
                {
                    x: 30,
                    y: 35
                },
                {
                    x: 40,
                    y: 45
                }
            ]
        },
        {
            author: 'JhonConnor',
            name: "See",
            points: [
                {x:0, y:0}, {x:10, y:20}, {x:20, y:10}, {x:15, y:15}, {x:0, y:0}
            ]
        },
        {
            author: 'JhonConnor',
            name: "you",
            points: [
                {x:25, y:25}, {x:20, y:25}, {x:30, y:35}, {x:35, y:30}, {x:25, y:20}
            ]
        },
        {
            author: 'JhonConnor',
            name: "later",
            points: [
                {x:10, y:20}, {x:5, y:15}, {x:0, y:10}, {x:10, y:0}, {x:15, y:5},  {x:20, y:10}
            ]
        },
        {
            author: 'JhonConnor',
            name: "baby",
            points: [
                {x:15, y:30}, {x:10, y:20}, {x:5, y:10}, {x:10, y:5}, {x:20, y:10}, {x:30, y:15}
            ]
        }
    ]

    mockdata['LexLuthor'] = [
        {
            author: 'LexLuthor',
            name: 'kryptonite',
            points: [
                {
                    x: 60,
                    y: 65
                },
                {
                    x: 70,
                    y: 75
                }
            ]
        },
        {
            author: 'LexLuthor',
            name: 'Poison',
            points: [
                {x:60, y:65}, {x:50, y:45}, {x:50, y:30}, {x:30, y:50}, {x:65, y:60}, 
            ]
        }
    ]

    return {
        getBlueprintsByAuthor: function(author, callback) {
            callback(mockdata[author]);
        },

        getBlueprintsByNameAndAuthor: function(author, name, callback) {
            console.log("    getBlueprintsByNameAndAuthor(): Entra (callback).");
            var blueprint;
            mockdata[author].forEach(
                function(bp) {
                    if (bp.name == name) {
                        console.log("      blueprint.name: "+bp.name);
                        blueprint = bp;
                    }
                }
            );
            console.log("    BP: "+blueprint.name);
            console.log("    getBlueprintsByNameAndAuthor(): Justo antes del callback.");
            callback(blueprint);
        }
    };
})();