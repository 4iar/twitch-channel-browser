'use strict';

describe('Controller: channelGrabber', function () {
    
    beforeEach(module('twitchBrowser'));
    
    var controller;
    var scope;
    var channelSubscriptionServiceMock;
    var $httpBackend;

    // set up the mock channel subscription service
    beforeEach(function () {
        channelSubscriptionServiceMock = {
            addChannelNames: function (channel) {
                return channel;
            },
            getChannelNames: function () {
                return ['freecodecamp', 'storbeck', 'brunofin', 'channelthatdoesnotexist'];
            }
        };
    });

    // inject the controller, mock scope, and mock service
    beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        controller = $controller('channelGrabber', {
            $scope: scope,
            channelSubscriptionService: channelSubscriptionServiceMock
        });
    }));
    
    // setup the http mocks
    beforeEach(function () {
        // normal
        $httpBackend.when('GET', 'https://api.twitch.tv/kraken/channels/freecodecamp').respond({"mature":false,"status":"Local Weather Project - Nick LaBelle #programming","broadcaster_language":"en","display_name":"FreeCodeCamp","game":"Creative","language":"en","_id":79776140,"name":"freecodecamp","created_at":"2015-01-14T03:36:47Z","updated_at":"2016-05-20T13:00:58Z","delay":null,"logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-profile_image-d9514f2df0962329-300x300.png","banner":null,"video_banner":"https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-channel_offline_image-b8e133c78cd51cb0-1920x1080.png","background":null,"profile_banner":"https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-profile_banner-6f5e3445ff474aec-480.png","profile_banner_background_color":null,"partner":false,"url":"https://www.twitch.tv/freecodecamp","views":148163,"followers":9674,"_links":{"self":"https://api.twitch.tv/kraken/channels/freecodecamp","follows":"https://api.twitch.tv/kraken/channels/freecodecamp/follows","commercial":"https://api.twitch.tv/kraken/channels/freecodecamp/commercial","stream_key":"https://api.twitch.tv/kraken/channels/freecodecamp/stream_key","chat":"https://api.twitch.tv/kraken/chat/freecodecamp","features":"https://api.twitch.tv/kraken/channels/freecodecamp/features","subscriptions":"https://api.twitch.tv/kraken/channels/freecodecamp/subscriptions","editors":"https://api.twitch.tv/kraken/channels/freecodecamp/editors","teams":"https://api.twitch.tv/kraken/channels/freecodecamp/teams","videos":"https://api.twitch.tv/kraken/channels/freecodecamp/videos"}});
        $httpBackend.when('GET', 'https://api.twitch.tv/kraken/channels/storbeck').respond({"mature":null,"status":null,"broadcaster_language":null,"display_name":"storbeck","game":null,"language":"en","_id":86238744,"name":"storbeck","created_at":"2015-03-25T02:23:40Z","updated_at":"2016-05-20T14:00:35Z","delay":null,"logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/storbeck-profile_image-7ab13c2f781b601d-300x300.jpeg","banner":null,"video_banner":null,"background":null,"profile_banner":null,"profile_banner_background_color":null,"partner":false,"url":"https://www.twitch.tv/storbeck","views":567,"followers":9,"_links":{"self":"https://api.twitch.tv/kraken/channels/storbeck","follows":"https://api.twitch.tv/kraken/channels/storbeck/follows","commercial":"https://api.twitch.tv/kraken/channels/storbeck/commercial","stream_key":"https://api.twitch.tv/kraken/channels/storbeck/stream_key","chat":"https://api.twitch.tv/kraken/chat/storbeck","features":"https://api.twitch.tv/kraken/channels/storbeck/features","subscriptions":"https://api.twitch.tv/kraken/channels/storbeck/subscriptions","editors":"https://api.twitch.tv/kraken/channels/storbeck/editors","teams":"https://api.twitch.tv/kraken/channels/storbeck/teams","videos":"https://api.twitch.tv/kraken/channels/storbeck/videos"}});

        // abnormal
        // unavailable on twitch ("This is a Justin.tv channel. It cannot be viewed on Twitch.")
        $httpBackend.when('GET', 'https://api.twitch.tv/kraken/channels/brunofin').respond({"error":"Unprocessable Entity","status":422,"message":"Channel 'brunofin' is not available on Twitch"});
        // channel does not exist ("The page could not be found, or has been deleted by its owner.")
        $httpBackend.when('GET', 'https://api.twitch.tv/kraken/channels/channelthatdoesnotexist').respond({"error":"Not Found","status":404,"message":"Channel 'channelthatdoesnotexist' does not exist"});
    });

    function isChannelDataObject(channelData) {
        var expectedProperties = [
            'name',
            'url',
            'description',
            'online',
            'avatarUrl'
        ];

        for (var i = 0; i < expectedProperties.length; i++) {
            if (!channelData.hasOwnProperty(expectedProperties[i])) {
                return false;
            };
        };
        return true;
    };

    describe('updateChannels', function () {
        it('should return an array of objects that contains data about subscribed channels', function () {

            var channelDataArray = scope.updateChannels();
            expect(channelDataArray).toEqual(jasmine.any(Array));

            for (var i = 0; i < channelDataArray.length; i++) {
                // Check that all the objects in the array have the correct properties
                expect(isChannelDataObject(channelDataArray[i])).toBeTruthy();
            };
        });
        
        it('array length should correspond to the number of subscribed channels', function() {
            var channelDataArray = scope.updateChannels();
            
            expect(channelDataArray.length).toBe(4)  // because we defined 4 in the mock service 
        });
    });
});


















