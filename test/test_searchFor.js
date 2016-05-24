'use strict';

describe('Filter: searchFor', function () {
    var searchFor;
    var channels;

    beforeEach(module('twitchBrowser'));

    beforeEach(inject(function ($filter) {
        searchFor = $filter('searchFor', {});
    }));

    // setup the mock data
    beforeEach(function () {
        channels = [
            {name: "FreeCodeCamp"},
            {name: "storbeck"},
            {name: "brunofin"},
            {name: "channelthatdoesnotexist"},
            {name: "starladder_cs_en"},
            {name: "starladder_sc2_en"}
        ];
    });
    
    it('should return an array of all channels if no search string was provided', function () {
        expect(searchFor(channels, "")).toBe(channels);
    });
    
    it('should return an array of channels whose names contain the search string', function () {
        expect(searchFor(channels, "en")).toEqual([{name: "starladder_cs_en"}, {name: "starladder_sc2_en"}]);
    });
    
    it('should perform case insensitive searches', function () {
        expect(searchFor(channels, "Free")).toEqual([{name: "FreeCodeCamp"}]);
        expect(searchFor(channels, "free")).toEqual([{name: "FreeCodeCamp"}]);
    });
});


















