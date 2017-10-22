app.controller('itemController', ['$scope', '$modal','CommonService','dashBoardService',function ($scope, $modal,  CommonService,dashBoardService) {
    $scope.itemDetails = {};
    $scope.itemDetails.itemList = [];
    $scope.itemDetails.page = 0;
    $scope.pageSize = 20;
    $scope.itemDetails.itemList=[
        {
            "id": 2,
            "name": "Test",
            "description": "Test",
            "product": {
                "id": 2,
                "name": "Test",
                "description": "Test"
            },
                "minAge": 0,
                "maxAge": 0,
                "price": 200,
                "quantity": 0,
                "size": null,
                "otherProperties": null,
                "lupDate": 1506778270327,
                "featured": true,
                "recomended": true
        },
        {
            "id": 2,
            "name": "Test2",
            "description": "Test2",
            "product": {
                "id": 2,
                "name": "Test",
                "description": "Test"
            },
            "minAge": 0,
            "maxAge": 0,
            "price": 200,
            "quantity": 0,
            "size": null,
            "otherProperties": null,
            "lupDate": 1506778270327,
            "featured": true,
            "recomended": true
        }
    ]
    $scope.itemDetails.productList = [{
        "id": 2,
        "name": "Test",
        "description": "Test",
        "isActive":true,
        "subCategory": {
            "id": 1,
            "name": "Baby Toys",
            "description": "Toys for babies",
            "category": {
                "name": "Baby Items",
                "description": "Items for babies",
                "id": 2
            }
        },
        "items": [
            {
                "id": 2,
                "name": "Test",
                "description": "Test",
                "minAge": 0,
                "maxAge": 0,
                "price": 200,
                "quantity": 0,
                "size": null,
                "otherProperties": null,
                "lupDate": 1506778270327,
                "featured": true,
                "recomended": true
            }]
    },
        {
            "id": 3,
            "name": "Test2",
            "description": "Test2",
            "isActive":false,
            "subCategory": {
                "id": 1,
                "name": "Baby Toys",
                "description": "Toys for babies",
                "category": {
                    "name": "Baby Items",
                    "description": "Items for babies",
                    "id": 2
                }
            },
            "items": [
                {
                    "id": 2,
                    "name": "Test",
                    "description": "Test",
                    "minAge": 0,
                    "maxAge": 0,
                    "price": 200,
                    "quantity": 0,
                    "size": null,
                    "otherProperties": null,
                    "lupDate": 1506778270327,
                    "featured": true,
                    "recomended": true
                }]
        }
    ];

}]);
