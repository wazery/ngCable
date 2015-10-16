'use strict';

angular.module('ng-cable', [])

.service('$cable', function () {

    function AngularCable(url) {
        this.cable = Cable.createConsumerurl(url);
        this.subscriptions = {};
    }

    AngularCable.prototype = {
        createSubscription: function (channelName, callback) {
            var subscription = this.cable.subscriptions.create(channelName, callback);
            this.subscriptions[subscription.name] = subscription;
            return subscription;
        }
    };
    return AngularCable;
});
