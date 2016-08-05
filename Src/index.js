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
        PublishingDate: '',
        Images: [],
        Type: '',
        Active: true
    }
    $scope.adminUsername = ''
    $scope.adminPassword = ''
    $scope.Users = ''
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
        $scope.CurrentFeature.Images.push({ Url: '' });
    }

    $scope.SaveFeature = function () {
        $scope.CurrentFeature.token = $scope.UserToken;
        var feature = angular.copy($scope.CurrentFeature)
        feature.Images = [];
        $scope.CurrentFeature.Images.forEach(function (image) {
            feature.Images.push(image.Url)

        })
        feature.User = $scope.User;
        if (feature._id) {
            $http.put('http://localhost:8080/updateFeature', JSON.stringify(feature)).success(function (data) {
                if (data.Success) {
                    getFeatures()
                }
            })

        }
        else {
            $http.post('http://localhost:8080/AddFeature', JSON.stringify(feature)).success(function (data) {
                if (data.Success) {
                    feature._id = data.Id;
                    $scope.Features.push(feature)
                }
            })
        }
    }

    $scope.EditFeature = function (feature) {
        $scope.CurrentFeature = {}
        var date = new Date(feature.PublishingDate)
        $scope.CurrentFeature.PublishingDate = date
        $scope.CurrentFeature.Images = []
        feature.Images.forEach(function (Image) {

            $scope.CurrentFeature.Images.push({ Url: Image })
        })
        $scope.CurrentFeature.Type = feature.Type
        $scope.CurrentFeature.Tags = feature.Tags
        $scope.CurrentFeature.Name = feature.Name
        $scope.CurrentFeature._id = feature._id;
    }

    $scope.RemoveImage = function (image) {
        $scope.CurrentFeature.Images.splice($scope.CurrentFeature.Images.indexOf(image), 1)
    }
    getUsers = function () {
        $http.get('http://localhost:8080/getUsers').then(function (response) {
             
            if (response.data.Success) {
              
                $scope.Users = response.data.Users;
            }
        })
    }
    $scope.AddAdmin = function () {

        $http.post('http://localhost:8080/AddAdmin', JSON.stringify({ username: $scope.adminUsername, password: $scope.adminPassword })).then(function (response) {
            if (response.data.Success) {
                getUsers();
            }
        })
    }
    getFeatures();
    getUsers();
})