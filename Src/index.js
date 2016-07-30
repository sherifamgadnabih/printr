var featuresApp = angular.module('featuresApp', [])

featuresApp.controller('FeatureController', function ($scope, $http) {
    $scope.Features = [];
    $scope.UserName = '';
    $scope.Password = '';
    $scope.LoginErrorMessage = '';
    $scope.UserToken = '';
    $scope.User = undefined;
    $scope.isLoggedIn = false;
    $scope.CurrentFeature = {
        Name: '',
        Tags: '',
        PublishingDate:'',
        Images: [],
        Type: '',
        Active:true
    }

    $scope.IsAdminUser = function () {
        return $scope.User && $scope.User.Role == 'Admin';
    }
    getFeatures = function () {
        if ($scope.User && $scope.User.Role == 'Admin') {

            $http.get('http://localhost:8080/GetFeaturesForAdmins', {
                headers: { 'x-access-token': $scope.UserToken }
            }).then(function (response) {
                $scope.Features = response.data.Features
            })
        }
        else {
            $http.get('http://localhost:8080/getFeatures').then(function (response) {
                $scope.Features = response.data.Features

            })

        }

    }

    getFeatures();

    $scope.Authenticate = function () {
        $http.post('http://localhost:8080/Authenticate', JSON.stringify({ username: $scope.UserName, password: $scope.Password })).success(function (data) {
            if (data.Success) {
                $scope.UserToken = data.token;
                $scope.User = data.User;
                $scope.isLoggedIn = true
                $('#LoginModal').modal('hide')
                getFeatures()

            }
            else {
                $scope.LoginErrorMessage = data.message;
            }

        })

    }

    $scope.DeactivateFeature = function (Feature) {
        $http.put('http://localhost:8080/DeactivateFeature/' + Feature._id).success(function (data) {
            if (data.Success) {

                Feature.Active = false;
            }

        })

    }
    $scope.AddImage = function (index) {
        $scope.CurrentFeature.Images.push({Url:'',index:index});
    }

     $scope.SaveFeature = function () {
         $scope.CurrentFeature.token = $scope.UserToken;
         var feature = angular.copy($scope.CurrentFeature)
         feature.Images=[];
         $scope.CurrentFeature.Images.forEach(function(image){
             feature.Images.push(image.Url)

         })
         feature.User=$scope.User;
       $http.post('http://localhost:8080/AddFeature',JSON.stringify(feature)).success(function(data){
           if(data.Success){
               var savedFeature = angular.copy($scope.CurrentFeature);
               savedFeature._id= data.Id;
               console.log(savedFeature)
               $scope.Features.push(savedFeature)
           }
       })
    }
})