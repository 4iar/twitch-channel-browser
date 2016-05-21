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

        $scope.updateChannels = function () {
            $scope.channels = [];
            var endpointBaseUrl = 'https://api.twitch.tv/kraken/channels/';

            channelSubscriptionService.getChannelNames().forEach(function (channelName) {
                $http.get(endpointBaseUrl + channelName)
                    .then(function (result) {
                        $scope.channels.push($scope.parseChannelData(result.data));
                    });
            });
        };

        $scope.parseChannelData = function (data) {
            var channelData = {
                'name': data.display_name,
                'url': data.url,
                'description': data.status,
                'online': (function (status) {if (!status) {return false} else {return true}})(data.status),
                'avatarUrl': data.logo
            };
            
            return channelData
        };

    });

