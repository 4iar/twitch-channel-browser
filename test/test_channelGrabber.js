'use strict';

describe('Controller: channelGrabber', function () {
    
    beforeEach(module('twitchBrowser'));
    
    var controller;
    var scope;
    var channelSubscriptionServiceMock;

    // set up the mock channel subscription service
    beforeEach(function () {
        channelSubscriptionServiceMock = {
            addChannelNames: function (channel) {
                return channel;
            },
            getChannelNames: function () {
                return ['channel1', 'channel2', 'channel3', 'channel4'];
            }
        };
    });

    // inject the controller, mock scope, and mock service
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller('channelGrabber', {
            $scope: scope,
            channelSubscriptionService: channelSubscriptionServiceMock
        });
    }));

    function isChannelDataObject(channelData) {
        var expectedProperties = [
            'name',
            'url',
            'description',
            'online',
            'avatar'
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


















