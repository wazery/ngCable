'use strict';

angular.module('ngCable', [])
    .factory('$cable', function ($channel) {

        function AngularCable(url) {
            if (!(this instanceof AngularCable)) {
                return new AngularCable(url);
            }
            this.client = Cable.createConsumer(url);
            this.connection = this.client.connection;
            this.channels = {};
        }

        AngularCable.prototype = {
            /**
             * Subscribes the client to the specified channelName and returns the channel object.
             *
             * @param {String} channelName name of the channel
             * @param {Object || Function} callback object contains callbacks for actions or function for 'received' action
             * @returns {Object} channel object
             */
            subscribe: function (channelName, callback) {
                var mixin = typeof callback === 'function' ? {received: callback} : callback;
                var channel = this.client.subscriptions.create(channelName, mixin);
                channel = $channel(channel, this);
                this.channels[channel.name] = channel;
                return channel;
            },

            /**
             * Unsubscribes the client from the specified channel
             *
             * @param {String} channelName name of the channel
             * @returns {Boolean} failed or succeed
             */
            unsubscribe: function (channelName) {
                var channel = this.channels[channelName];
                if (channel) {
                    var removed = this.client.subscriptions.remove(channel.baseChannel);
                    if (removed){
                        delete this.channels[channelName];
                    }
                    return removed;
                }
                return false;
            }
        };
        return AngularCable;
    })

    .factory('$channel', function () {
        function $channel(baseChannel, cable) {
            if (!(this instanceof $channel)) {
                return new $channel(baseChannel, cable);
            }

            this.baseChannel = baseChannel;
            this.client = cable;
            this.name = baseChannel.name;
        }

        $channel.prototype = {
            /**
             * Sends a message to current channel and returns message status.
             *
             * @param {Object} data object contains sender name and message body
             *        for example {sent_by: 'Peter', body: 'Hello Paul, thanks for the compliment.'}
             * @returns {Boolean} failed or succeed
             */
            send: function (data) {
                return this.baseChannel.send(data);
            },

            /**
             * Unsubscribes from the current channel
             *
             * @returns {Boolean} failed or succeed
             */
            unsubscribe: function () {
                return this.client.subscriptions.remove(this.baseChannel);
            }
        };

        return $channel;
    });

