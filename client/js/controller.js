

//frontpage controller
app.controller('frontpage', ['$scope', 'Socket', function ($scope, Socket) {
        
        
        var clientId = Math.floor((Math.random() * 10000) + 1);
        Socket.register(clientId);
        
        var query = {}; 
        
        $scope.dialog = function(content){
            angular.element("<div>").append(angular.element(content)).dialog({
                autoOpen:true
            })
        }

        $scope.find = function () {
            query  = {
                model: $scope.table,
                action: 'find',
                id: $scope.id
            }
            Socket.emit('query', { message: query, clientId: clientId });
        }
        $scope.fetch = function () {
            query = {
                model: $scope.table,
                action: 'fetch',
                wherePart: $scope.wherePart
            }
            Socket.emit('query', { message: query, clientId: clientId});
        }
        
        $scope.pushAll = function (data) {
            Socket.emit('push_all', {
            callBack:  {
                    fn:'dialog',
                    data:JSON.stringify(data)
                }
            });
        }

        Socket.on('push', function (data) {
            if (data.callBack)
                $scope[data.callBack.fn](data.callBack.data);
            else
                angular.extend($scope, data);

        });
        Socket.on('reconnect', function () {
            Socket.register(clientId);
            $scope.message = 'reconnected.';
        });
        $scope.message = "ClientId: " + clientId;
        
    }]).filter('htmlescape', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);;
