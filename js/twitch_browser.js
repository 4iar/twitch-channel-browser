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

        var defaultChannelNames = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "kjaerbye98", "brunofin", "channelthatdoesnotexist"];
        channelSubscriptionService.addChannelNames(defaultChannelNames);

        $scope.addChannels = function addChannels(channel) {
            channelSubscriptionService.addChannelNames(channel);
        };
        
        $scope.deleteChannel = function (channel) {
            channelSubscriptionService.deleteChannel(channel);
        };
    })
    .controller("channelGrabber", function($scope, $http, channelSubscriptionService) {

        $scope.getAvatarUrl = function (avatarUrl) {
            if (avatarUrl) {
                return avatarUrl;
            } else {
                return "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png";
            }
        };

        $scope.parseFailedChannelData = function (result) {
            // bit of a hack - api error response doesn't return display_name, so we have to extract it
            // from the request url
            var channelName = result.config.url.split('/')[5]

            return {
                'name': channelName,
                'url': "https://www.twitch.tv/" + channelName,
                'description': result.data.message,
                'online': false,
                'avatarUrl': $scope.getAvatarUrl(result.data.logo)
            };
        };

        $scope.parseSuccessfulChannelData = function (result) {
            return {
                'name': result.data.display_name,
                'url': result.data.url,
                'description': result.data.status,
                'online': (function (status) {if (!status) {return false} else {return true}})(result.data.status),
                'avatarUrl': $scope.getAvatarUrl(result.data.logo)
            };
        };
        
        $scope.updateChannels = function () {
            $scope.channels = [];
            var endpointBaseUrl = 'https://api.twitch.tv/kraken/channels/';

            channelSubscriptionService.getChannelNames().forEach(function (channelName) {
                $http.get(endpointBaseUrl + channelName)
                    .then(function (result) {
                        $scope.channels.push($scope.parseSuccessfulChannelData(result));
                    })
                    .catch(function (result) {
                        // handle unavailable or missing channels
                        $scope.channels.push($scope.parseFailedChannelData(result));
                    });
            });
        };

        $scope.updateChannels();
    });

