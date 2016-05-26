"use strict"

angular.module('twitchBrowser', [])
    .filter('searchFor', function () {
        return function (channels, searchString) {

            if (!searchString) {
                return channels;
            }

            var selectedChannels = [];

            // lowercase this using another function?
            // need to strip stuff too
            searchString = searchString.toLowerCase();

            channels.forEach(function (channel) {
                if (channel.name.toLowerCase().indexOf(searchString) !== -1) {
                    selectedChannels.push(channel);
                };
            });
            return selectedChannels;
        };
    })
    .service('channelSubscriptionService', function() {
        this.names = [];

        this.addChannelNames = function(names) {
            this.names = this.names.concat(names);
        };

        this.getChannelNames = function() {
            return this.names;
        };

        this.deleteChannel = function (channelNameToDelete) {
            this.names = this.names.filter(function (channelName) {
                return channelName.toLowerCase() !== channelNameToDelete.toLowerCase();
            });
        };
    })
    .controller("channelGrabber", function($scope, $http, channelSubscriptionService) {

        $scope.deleteChannel = function (channelNameToDelete) {
            // remove a channel from the channel subscription service
            channelSubscriptionService.deleteChannel(channelNameToDelete);

            // and also immediately remove it from the list of parsed channels
            // -- alternative is to just call $scope.updateChannels() but this would require more requests to be sent
            $scope.channels = $scope.channels.filter(function (channel) {
                return channel.name.toLowerCase() !== channelNameToDelete.toLowerCase();
            });
        };

        $scope.addChannel = function (channelName) {
            channelSubscriptionService.addChannelNames(channelName)
            $scope.updateChannels();
        };
        

        $scope.getAvatarUrl = function (avatarUrl) {
            if (avatarUrl) {
                return avatarUrl;
            } else {
                return "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_300x300.png";
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
                'avatarUrl': $scope.getAvatarUrl(result.data.logo),
                'error': true
            };
        };

        $scope.parseSuccessfulChannelData = function (result) {
            return {
                'name': result.data.display_name,
                'url': result.data.url,
                'description': result.data.status,
                'online': (function (status) {if (!status) {return false} else {return true}})(result.data.status),
                'avatarUrl': $scope.getAvatarUrl(result.data.logo),
                'error': false
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

        var defaultChannelNames = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "kjaerbye98", "brunofin", "channelthatdoesnotexist"];
        channelSubscriptionService.addChannelNames(defaultChannelNames);
        
        $scope.updateChannels();
    });
