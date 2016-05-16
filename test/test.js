'use strict';

describe('Controller: channelSubscriptionManager', function () {

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
                return ['channel1', 'channel2', 'randomchannel', 'something_else'];
            },
            deleteChannel: function (channel) {
                return;
            },
            
        };
    });

    // inject the controller, mock scope, and mock service
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller('channelSubscriptionManager', {
            $scope: scope,
            channelSubscriptionService: channelSubscriptionServiceMock
        });
    }));
    
    describe('addChannels', function () {
        it('should call channelSubscriptionManager.addChannelNames with the channels to add', function () {
            spyOn(channelSubscriptionServiceMock, 'addChannelNames').and.callThrough();
            
            scope.addChannels('channel');
            scope.addChannels(['channel3', 'channel59']);
            
            expect(channelSubscriptionServiceMock.addChannelNames).toHaveBeenCalledTimes(2);
        });
    });
    
    describe('deleteChannel', function () {
        it('should call channelSubscriptionManager.deleteChannel with the channels to add', function () {
            spyOn(channelSubscriptionServiceMock, 'deleteChannel');
            
            scope.deleteChannel('channeltodelete1');
            expect(channelSubscriptionServiceMock.deleteChannel).toHaveBeenCalledWith('channeltodelete1');
            
            scope.deleteChannel('channeltodelete2');
            expect(channelSubscriptionServiceMock.deleteChannel).toHaveBeenCalledWith('channeltodelete2');
        });
    });
});


























