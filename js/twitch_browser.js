"use strict"

angular.module('twitchBrowser', [])
    .service('channelSubscriptionService', function() {
        this.names = [];

        this.addChannelNames = function(names) {
            this.names = this.names.concat(names);
        };

        this.getChannelNames = function() {
            return this.names;
        };
    })
    .controller("channelSubscriptionManager", function($scope, channelSubscriptionService) {

        var defaultChannelNames = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff"];
        channelSubscriptionService.addChannelNames(defaultChannelNames);
        
        $scope.channels = channelSubscriptionService.getChannelNames();

        $scope.addChannels = function addChannels(channel) {
            channelSubscriptionService.addChannelNames(channel);
        };
        
        $scope.deleteChannel = function (channel) {
            channelSubscriptionService.deleteChannel(channel);
        };
    })
    .controller("channelGrabber", function($scope, $http, channelSubscriptionService) {

        $scope.fetchChannelDataForSubscribedChannels = function () {
            var channelNames = channelSubscriptionService.getChannelNames();

            var channelDataArray = [];
            for (var i = 0; i < channelNames.length; i++) {
                channelDataArray.push(
                    $scope.parseChannelData(channelNames[i])
                )
            };

            return channelDataArray;
        };




    });

