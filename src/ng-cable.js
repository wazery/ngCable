'use strict';

angular.module('ng-cable', [])

.factory('$cable', function ($channel) {

    function AngularCable(url) {
        if (!(this instanceof AngularCable)) {
            return new AngularCable(url);
        }
        this.cable = Cable.createConsumer(url);
        this.channels = {};
    }

    AngularCable.prototype = {
        subscribe: function (channelName, callback) {
            var mixin = typeof callback == 'function'? {received: callback}: callback;
            var channel = this.cable.subscriptions.create(channelName, mixin);
            //channel = $channel(channel, this)
            this.channels[channel.name] = channel;
            return channel;
        },
        unsubscribe: function(channelName){

        }
    };
    return AngularCable;
})

.factory('$channel', function(){

    function $channel (baseChannel, $cable) {
      if (!(this instanceof $channel)) {
        return new $channel(baseChannel, $cable);
      }

      this.baseChannel = baseChannel;
      this.cable = $cable;
      this.name = baseChannel.name;
    }

    $channel.prototype = {
        send: function(){

        }
    };

    return $channel
});;
