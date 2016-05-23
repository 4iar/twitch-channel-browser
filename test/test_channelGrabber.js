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
        beforeEach(function () {
            scope.parseChannelData = function (channelName) {
                return {
                    'name': 'storbeck',
                    'url': 'https://www.twitch.tv/freecodecamp',
                    'description': 'Local Weather Project - Nick LaBelle #programming',
                    'online': true,
                    'avatarUrl': 'https://static-cdn.jtvnw.net/jtv_user_pictures/storbeck-profile_image-7ab13c2f781b601d-300x300.jpeg'
                };
            };
        });

        xit('should set $scope.channels to an array of objects that contains data about subscribed channels', function () {
            scope.updateChannels();
            expect(scope.channels).toEqual(jasmine.any(Array));

            // this is bad because test results are affected by length of the array --- see below test
            // i.e. false +ve if array is not written
            for (var i = 0; i < scope.channels.length; i++) {
                // Check that all the objects in the array have the correct properties
                expect(isChannelDataObject(scope.channels[i])).toBeTruthy();
            };
        });


        it('should call $http.get() with the correct urls', function () {

            $httpBackend.expectGET('https://api.twitch.tv/kraken/channels/freecodecamp');
            $httpBackend.expectGET('https://api.twitch.tv/kraken/channels/storbeck');
            $httpBackend.expectGET('https://api.twitch.tv/kraken/channels/brunofin');
            $httpBackend.expectGET('https://api.twitch.tv/kraken/channels/channelthatdoesnotexist');

            scope.updateChannels();

            $httpBackend.flush()
        });

        xit('should call $scope.parseChannelData() with the response.data', function () {
            spyOn(scope, 'parseChannelData').and.callThrough();

            scope.updateChannels();

            // TODO: fix this test
            // .calls.allArgs() doesn't seem to show any arguments when called from the $http.get callback
            // but does work when called synchronously e.g. in the for loop
            expect(scope.parseChannelData.calls.allArgs()).toEqual(
                ['{"mature":false,"status":"Local Weather Project - Nick LaBelle #programming","broadcaster_language":"en","display_name":"FreeCodeCamp","game":"Creative","language":"en","_id":79776140,"name":"freecodecamp","created_at":"2015-01-14T03:36:47Z","updated_at":"2016-05-20T13:00:58Z","delay":null,"logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-profile_image-d9514f2df0962329-300x300.png","banner":null,"video_banner":"https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-channel_offline_image-b8e133c78cd51cb0-1920x1080.png","background":null,"profile_banner":"https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-profile_banner-6f5e3445ff474aec-480.png","profile_banner_background_color":null,"partner":false,"url":"https://www.twitch.tv/freecodecamp","views":148163,"followers":9674,"_links":{"self":"https://api.twitch.tv/kraken/channels/freecodecamp","follows":"https://api.twitch.tv/kraken/channels/freecodecamp/follows","commercial":"https://api.twitch.tv/kraken/channels/freecodecamp/commercial","stream_key":"https://api.twitch.tv/kraken/channels/freecodecamp/stream_key","chat":"https://api.twitch.tv/kraken/chat/freecodecamp","features":"https://api.twitch.tv/kraken/channels/freecodecamp/features","subscriptions":"https://api.twitch.tv/kraken/channels/freecodecamp/subscriptions","editors":"https://api.twitch.tv/kraken/channels/freecodecamp/editors","teams":"https://api.twitch.tv/kraken/channels/freecodecamp/teams","videos":"https://api.twitch.tv/kraken/channels/freecodecamp/videos"}'],
                ['{"mature":null,"status":null,"broadcaster_language":null,"display_name":"storbeck","game":null,"language":"en","_id":86238744,"name":"storbeck","created_at":"2015-03-25T02:23:40Z","updated_at":"2016-05-20T14:00:35Z","delay":null,"logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/storbeck-profile_image-7ab13c2f781b601d-300x300.jpeg","banner":null,"video_banner":null,"background":null,"profile_banner":null,"profile_banner_background_color":null,"partner":false,"url":"https://www.twitch.tv/storbeck","views":567,"followers":9,"_links":{"self":"https://api.twitch.tv/kraken/channels/storbeck","follows":"https://api.twitch.tv/kraken/channels/storbeck/follows","commercial":"https://api.twitch.tv/kraken/channels/storbeck/commercial","stream_key":"https://api.twitch.tv/kraken/channels/storbeck/stream_key","chat":"https://api.twitch.tv/kraken/chat/storbeck","features":"https://api.twitch.tv/kraken/channels/storbeck/features","subscriptions":"https://api.twitch.tv/kraken/channels/storbeck/subscriptions","editors":"https://api.twitch.tv/kraken/channels/storbeck/editors","teams":"https://api.twitch.tv/kraken/channels/storbeck/teams","videos":"https://api.twitch.tv/kraken/channels/storbeck/videos"}'],
                ['{"error":"Unprocessable Entity","status":422,"message":"Channel \'brunofin\' is not available on Twitch"}'],
                ['{"error":"Not Found","status":404,"message":"Channel \'channelthatdoesnotexist\' does not exist"}']
            );
        });

        xit('should push return values from $scope.parseChannelData() to $scope.channels', function () {
            spyOn(scope, 'parseChannelData').and.callThrough();

            var channelObject = {
                'name': 'storbeck',
                'url': 'https://www.twitch.tv/freecodecamp',
                'description': 'Local Weather Project - Nick LaBelle #programming',
                'online': true,
                'avatarUrl': 'https://static-cdn.jtvnw.net/jtv_user_pictures/storbeck-profile_image-7ab13c2f781b601d-300x300.jpeg'
            };

            // TODO: same as above
            scope.updateChannels();
            
            expect(scope.channels).toEqual([channelObject, channelObject, channelObject, channelObject]);
        });
    });


    describe('parseSuccessfulChannelData', function () {

        // set up normal sample data
        beforeEach(function () {
            this.freeCodeCampData = {};
            this.freeCodeCampData.data = {"mature":false,"status":"Local Weather Project - Nick LaBelle #programming","broadcaster_language":"en","display_name":"FreeCodeCamp","game":"Creative","language":"en","_id":79776140,"name":"freecodecamp","created_at":"2015-01-14T03:36:47Z","updated_at":"2016-05-21T20:02:15Z","delay":null,"logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-profile_image-d9514f2df0962329-300x300.png","banner":null,"video_banner":"https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-channel_offline_image-b8e133c78cd51cb0-1920x1080.png","background":null,"profile_banner":"https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-profile_banner-6f5e3445ff474aec-480.png","profile_banner_background_color":null,"partner":false,"url":"https://www.twitch.tv/freecodecamp","views":148398,"followers":9678,"_links":{"self":"https://api.twitch.tv/kraken/channels/freecodecamp","follows":"https://api.twitch.tv/kraken/channels/freecodecamp/follows","commercial":"https://api.twitch.tv/kraken/channels/freecodecamp/commercial","stream_key":"https://api.twitch.tv/kraken/channels/freecodecamp/stream_key","chat":"https://api.twitch.tv/kraken/chat/freecodecamp","features":"https://api.twitch.tv/kraken/channels/freecodecamp/features","subscriptions":"https://api.twitch.tv/kraken/channels/freecodecamp/subscriptions","editors":"https://api.twitch.tv/kraken/channels/freecodecamp/editors","teams":"https://api.twitch.tv/kraken/channels/freecodecamp/teams","videos":"https://api.twitch.tv/kraken/channels/freecodecamp/videos"}};
            
            this.storbeckData  = {};
            this.storbeckData.data = {"mature":null,"status":null,"broadcaster_language":null,"display_name":"storbeck","game":null,"language":"en","_id":86238744,"name":"storbeck","created_at":"2015-03-25T02:23:40Z","updated_at":"2016-05-20T14:00:35Z","delay":null,"logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/storbeck-profile_image-7ab13c2f781b601d-300x300.jpeg","banner":null,"video_banner":null,"background":null,"profile_banner":null,"profile_banner_background_color":null,"partner":false,"url":"https://www.twitch.tv/storbeck","views":567,"followers":9,"_links":{"self":"https://api.twitch.tv/kraken/channels/storbeck","follows":"https://api.twitch.tv/kraken/channels/storbeck/follows","commercial":"https://api.twitch.tv/kraken/channels/storbeck/commercial","stream_key":"https://api.twitch.tv/kraken/channels/storbeck/stream_key","chat":"https://api.twitch.tv/kraken/chat/storbeck","features":"https://api.twitch.tv/kraken/channels/storbeck/features","subscriptions":"https://api.twitch.tv/kraken/channels/storbeck/subscriptions","editors":"https://api.twitch.tv/kraken/channels/storbeck/editors","teams":"https://api.twitch.tv/kraken/channels/storbeck/teams","videos":"https://api.twitch.tv/kraken/channels/storbeck/videos"}};
        });


        it('should return a channel data object', function () {
            var returnValue = scope.parseSuccessfulChannelData(this.freeCodeCampData);
            
            expect(isChannelDataObject(returnValue)).toBeTruthy()
        });

        it('should return the correct channel name as a property', function () {
            expect(scope.parseSuccessfulChannelData(this.freeCodeCampData).name).toBe('FreeCodeCamp');
            expect(scope.parseSuccessfulChannelData(this.storbeckData).name).toBe('storbeck');
        });

        it('should return the url of the channel page as a property', function () {
            expect(scope.parseSuccessfulChannelData(this.freeCodeCampData).url).toBe("https://www.twitch.tv/freecodecamp");
            expect(scope.parseSuccessfulChannelData(this.storbeckData).url).toBe("https://www.twitch.tv/storbeck");
        });

        it('if the user has an avatar, it should return the avatar url as a property', function () {
            expect(scope.parseSuccessfulChannelData(this.freeCodeCampData).avatarUrl).toBe("https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-profile_image-d9514f2df0962329-300x300.png");
            expect(scope.parseSuccessfulChannelData(this.storbeckData).avatarUrl).toBe("https://static-cdn.jtvnw.net/jtv_user_pictures/storbeck-profile_image-7ab13c2f781b601d-300x300.jpeg");
        });

       it('should provide a placeholder avatar if the user does not have an avatar', function () {
           this.freeCodeCampData.data.logo = null;
           this.storbeckData.data.logo = null;
           
           expect(scope.parseSuccessfulChannelData(this.freeCodeCampData).avatarUrl).toBe("https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png");
           expect(scope.parseSuccessfulChannelData(this.storbeckData).avatarUrl).toBe("https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png");
       });

        it('should return the online/offline state as a boolean property', function () {
            expect(scope.parseSuccessfulChannelData(this.freeCodeCampData).online).toBeTruthy();
            expect(scope.parseSuccessfulChannelData(this.storbeckData).online).toBeFalsy();
        });

        it('should return a description of what is being streamed (as a property) if the stream is online', function () {
            expect(scope.parseSuccessfulChannelData(this.freeCodeCampData).description).toBe("Local Weather Project - Nick LaBelle #programming");
        });
        
        it('should set the description property to null if the stream is offline', function () {
            expect(scope.parseSuccessfulChannelData(this.storbeckData).description).toBeNull()
        });
    });
    
   describe('parseFailedChannelData', function () {

        // set up failed sample data
        beforeEach(function () {
            this.brunofinData = {};
            this.brunofinData.data = {"error":"Unprocessable Entity","status":422,"message":"Channel \'brunofin\' is not available on Twitch"};
            this.brunofinData.config = {};
            this.brunofinData.config.url = "https://api.twitch.tv/kraken/channels/brunofin"
            
            this.channelthatdoesnotexistData = {};
            this.channelthatdoesnotexistData.data = {"error":"Not Found","status":404,"message":"Channel \'channelthatdoesnotexist\' does not exist"};
            this.channelthatdoesnotexistData.config = {};
            this.channelthatdoesnotexistData.config.url = "https://api.twitch.tv/kraken/channels/channelthatdoesnotexist"
        });
       
       it('should return the channel name using the response config url', function () {
           expect(scope.parseFailedChannelData(this.brunofinData).name).toBe('brunofin')

           expect(scope.parseFailedChannelData(this.channelthatdoesnotexistData).name).toBe('channelthatdoesnotexist')
       });

       it('should return the url of the channel page as a property', function () {
           expect(scope.parseFailedChannelData(this.brunofinData).url).toBe("https://www.twitch.tv/brunofin");
           expect(scope.parseFailedChannelData(this.channelthatdoesnotexistData).url).toBe("https://www.twitch.tv/channelthatdoesnotexist");
       });
       
       it('should set the error message to the description property', function () {
           expect(scope.parseFailedChannelData(this.channelthatdoesnotexistData).description).toBe("Channel \'channelthatdoesnotexist\' does not exist");
           expect(scope.parseFailedChannelData(this.brunofinData).description).toBe("Channel \'brunofin\' is not available on Twitch");
       });
       
       it('should set the online property to false', function () {
           expect(scope.parseFailedChannelData(this.brunofinData).online).toBeFalsy();
           expect(scope.parseFailedChannelData(this.channelthatdoesnotexistData).online).toBeFalsy();
       });
       
       it('should provide a placeholder avatar if the user does not have an avatar', function () {
           expect(scope.parseFailedChannelData(this.brunofinData).avatarUrl).toBe("https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png");
           expect(scope.parseFailedChannelData(this.channelthatdoesnotexistData).avatarUrl).toBe("https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png");
       });
   });
});


















