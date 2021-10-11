//PARA PROBAR EL EJEMPLO:
//-Analice qué hacen las funciones implementadas en el módulo, y revise cómo la función pública (invocada con el botón) las invoca 'secuencialmente'.
//-Use la aplicación (oprima el botón) y mire el resultado.
//-Cambie la función pública para que encadene las funciones a través de promesas.
//-Pruebe nuevamente el funcionamiento y analice por qué es diferente el resultado.
//-En la penúltima operación (GET), dañe la URL para que falle, y revise qué ocurre con la promesa final.

var app = (function () {

    //private functions

    var request1Response = "";
    var request2Response = "";

    putForumPost = function () {

        var putPromise = $.ajax({
            url: "https://jsonplaceholder.typicode.com/posts/1",
            type: 'PUT',
            data: '{"userId": 1,"id": 1,"title": "sunt", "body":"quia "}',
            contentType: "application/json"
        });

        putPromise.then(
                function () {
                    console.info("OK");
                },
                function () {
                    console.info("ERROR");
                }

        );

        return putPromise;
    };

    var usersGet = function () {
        var promise = $.get("https://jsonplaceholder.typicode.com/users/2");

        promise.then(
                function (data) {
                    request1Response = data;
                },
                function () {
                    alert("$.get failed!");
                }
        );

        return promise;
    };

    var anotherUsersGet = function () {
        var promise = $.get("https://jsonplaceholder.typicode.com/todos/2");
        //var promise = $.get("https://jsonplaceholder.typicode.com/to2/2");
        promise.then(
                function (data) {
                    request2Response = data;
                },
                function () {
                    alert("$.get failed!");
                }
        );
        return promise;

    };

    var finalAction = function () {
        alert("Collected data:\nAPI#1:" + JSON.stringify(request1Response) + "\n=======\nAPI #2:" + JSON.stringify(request2Response));

    };

    //public functions
    return {
        viewPromises: function () {
            usersGet();
            putForumPost();
            anotherUsersGet();
            finalAction();
        },
        chained: function() {
            usersGet()
                    .then(putForumPost)
                    .then(anotherUsersGet)
                    .then(finalAction);
        }
    };

})();