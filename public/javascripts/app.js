var app = angular.module("newApp",[]);
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
app.factory('newService',["$http", function($http){
  let servicios = {
    getObject : function(route) {
      return $http.get('/'+route);
    },

    postObject : function(payload,route){
      keys = Object.keys(payload);
      form = new FormData();
      console.log(payload);
      for(let i = 0; i < keys.length; i++){
        console.log(keys[i], payload[keys[i]]);
        form.append(keys[i], payload[keys[i]]);
      }
      console.log(form);
      return $http.post('/'+route,form, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
      });
    },
    putObject : function(payload,route){
      keys = Object.keys(payload);
      form = new FormData();
      for(let i = 0; i < keys.length; i++){
        console.log(keys[i], payload[keys[i]]);
        form.append(keys[i], payload[keys[i]]);
      }
      console.log(form);
      return $http.put('/'+route+'/'+payload._id,form, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
      });
    },
    deleteObject: function(id,route) {
      return $http.delete('/'+route+'/'+id);
    }
  }
  return servicios;
}]);
app.controller("newController",["newService","$scope",function(newService, $scope){
  $scope.payload = {};
  $scope.route = "";
  $scope.show = false;
  $scope.init = function (route){
    newService.getObject(route).then(function(objects) {
      console.log(objects.data);
      $scope.objects = objects.data;
      $scope.show = true;
    });
  }
  $scope.postObject = function(payload,route) {

    console.log("TRATANDO DE HACER POST");
    newService.postObject(payload,route).
      then(function successCallback(objects){
        console.log("SE HIZO POST", objects);

        let object = objects.data.object;
        object.img.data = objects.data.base64;
        console.log(object);

        $scope.objects.push(object);
        $scope.payload = {};
        return objects;
      }, function errorCallback(error) {
        console.log("ERROR POST");

        return error;
      });
  }
  $scope.putObject = function(payload,route) {

    console.log("TRATANDO DE HACER PUT");
    newService.postObject(payload,route).
      then(function successCallback(objects){
        console.log("SE HIZO PUT");
        let object = objects.data.object;
        object.img.data = objects.data.base64;
        console.log(object);

        $scope.objects.push(object);
        $scope.payload = {};
        return objects;
      }, function errorCallback(error) {
        console.log("ERROR POST");

        return error;
      });
  }
  $scope.deleteObject = function(id, array, index, route) {
    newService.deleteObject(id,route).
      then(function successCallback(objects){
        array.splice(index,1)
      },
      function errorCallback(err) {
        console.log(err);
      });
  }
}]);
