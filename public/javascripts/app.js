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
      for(let i = 0; i < keys.length; i++){
        form.append(keys[i], payload[keys[i]]);
      }
      return $http.post('/'+route,form, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
      });
    },
    putObject : function(payload,route,id){
      keys = Object.keys(payload);
      form = new FormData();
      for(let i = 0; i < keys.length; i++){
        form.append(keys[i], payload[keys[i]]);
      }
      return $http.put('/'+route+'/'+id,form, {
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
  $scope.showInput = [];
  $scope.init = function (route){
    newService.getObject(route).then(function(objects) {
      $scope.objects = objects.data;
      for (let i = 0; i < $scope.objects.length; i++) {
        $scope.objects[i].showInput = false;
      }
      $scope.show = true;
    });
  }
  $scope.postObject = function(payload,route) {
    newService.postObject(payload,route).
      then(function successCallback(objects){
        let object = objects.data.object;
        object.img.data = objects.data.base64;
        $scope.objects.push(object);
        $scope.payload = {};
        return objects;
      }, function errorCallback(error) {
        return error;
      });
  }
  $scope.putObject = function(payload,route,id,index) {

    console.log("TRATANDO DE HACER PUT");
    newService.putObject(payload,route,id).
      then(function successCallback(objects){
        $scope.objects[index].showInput = !$scope.objects[index].showInput;
        console.log("SE HIZO PUT");
      }, function errorCallback(error) {
        console.log("ERROR PUT");

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
  $scope.showInput = false;
 $scope.toggleShowInput = function(index){
      $scope.objects[index].showInput = !$scope.objects[index].showInput;
  }
}]);
