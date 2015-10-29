(function() {
  this.Cable = {
    PING_IDENTIFIER: '_ping',
    createConsumer: function(url) {
      return new Cable.Consumer(url);
    }
  };

}).call(this);
(function() {
  var slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Cable.Connection = (function() {
    function Connection(consumer) {
      this.consumer = consumer;
      this.open();
    }

    Connection.prototype.send = function(data) {
      if (this.isOpen()) {
        this.webSocket.send(JSON.stringify(data));
        return true;
      } else {
        return false;
      }
    };

    Connection.prototype.open = function() {
      if (this.isState('open', 'connecting')) {
        return;
      }
      this.webSocket = new WebSocket(this.consumer.url);
      return this.installEventHandlers();
    };

    Connection.prototype.close = function() {
      var ref;
      if (this.isState('closed', 'closing')) {
        return;
      }
      return (ref = this.webSocket) != null ? ref.close() : void 0;
    };

    Connection.prototype.reopen = function() {
      if (this.isOpen()) {
        return this.closeSilently((function(_this) {
          return function() {
            return _this.open();
          };
        })(this));
      } else {
        return this.open();
      }
    };

    Connection.prototype.isOpen = function() {
      return this.isState('open');
    };

    Connection.prototype.isState = function() {
      var ref, states;
      states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return ref = this.getState(), indexOf.call(states, ref) >= 0;
    };

    Connection.prototype.getState = function() {
      var ref, state, value;
      for (state in WebSocket) {
        value = WebSocket[state];
        if (value === ((ref = this.webSocket) != null ? ref.readyState : void 0)) {
          return state.toLowerCase();
        }
      }
      return null;
    };

    Connection.prototype.closeSilently = function(callback) {
      if (callback == null) {
        callback = function() {};
      }
      this.uninstallEventHandlers();
      this.installEventHandler('close', callback);
      this.installEventHandler('error', callback);
      try {
        return this.webSocket.close();
      } finally {
        this.uninstallEventHandlers();
      }
    };

    Connection.prototype.installEventHandlers = function() {
      var eventName, results;
      results = [];
      for (eventName in this.events) {
        results.push(this.installEventHandler(eventName));
      }
      return results;
    };

    Connection.prototype.installEventHandler = function(eventName, handler) {
      if (handler == null) {
        handler = this.events[eventName].bind(this);
      }
      return this.webSocket.addEventListener(eventName, handler);
    };

    Connection.prototype.uninstallEventHandlers = function() {
      var eventName, results;
      results = [];
      for (eventName in this.events) {
        results.push(this.webSocket.removeEventListener(eventName));
      }
      return results;
    };

    Connection.prototype.events = {
      message: function(event) {
        var identifier, message, ref;
        ref = JSON.parse(event.data), identifier = ref.identifier, message = ref.message;
        return this.consumer.subscriptions.notify(identifier, 'received', message);
      },
      open: function() {
        return this.consumer.subscriptions.reload();
      },
      close: function() {
        return this.consumer.subscriptions.notifyAll('disconnected');
      },
      error: function() {
        this.consumer.subscriptions.notifyAll('disconnected');
        return this.closeSilently();
      }
    };

    Connection.prototype.toJSON = function() {
      return {
        state: this.getState()
      };
    };

    return Connection;

  })();

}).call(this);
(function() {
  Cable.ConnectionMonitor = (function() {
    var clamp, now, secondsSince;

    ConnectionMonitor.prototype.identifier = Cable.PING_IDENTIFIER;

    ConnectionMonitor.prototype.pollInterval = {
      min: 2,
      max: 30
    };

    ConnectionMonitor.prototype.staleThreshold = {
      startedAt: 4,
      pingedAt: 8
    };

    function ConnectionMonitor(consumer) {
      this.consumer = consumer;
      this.consumer.subscriptions.add(this);
      this.start();
    }

    ConnectionMonitor.prototype.connected = function() {
      this.reset();
      return this.pingedAt = now();
    };

    ConnectionMonitor.prototype.received = function() {
      return this.pingedAt = now();
    };

    ConnectionMonitor.prototype.reset = function() {
      return this.reconnectAttempts = 0;
    };

    ConnectionMonitor.prototype.start = function() {
      this.reset();
      delete this.stoppedAt;
      this.startedAt = now();
      return this.poll();
    };

    ConnectionMonitor.prototype.stop = function() {
      return this.stoppedAt = now();
    };

    ConnectionMonitor.prototype.poll = function() {
      return setTimeout((function(_this) {
        return function() {
          if (!_this.stoppedAt) {
            _this.reconnectIfStale();
            return _this.poll();
          }
        };
      })(this), this.getInterval());
    };

    ConnectionMonitor.prototype.getInterval = function() {
      var interval, max, min, ref;
      ref = this.pollInterval, min = ref.min, max = ref.max;
      interval = 4 * Math.log(this.reconnectAttempts + 1);
      return clamp(interval, min, max) * 1000;
    };

    ConnectionMonitor.prototype.reconnectIfStale = function() {
      if (this.connectionIsStale()) {
        this.reconnectAttempts += 1;
        return this.consumer.connection.reopen();
      }
    };

    ConnectionMonitor.prototype.connectionIsStale = function() {
      if (this.pingedAt) {
        return secondsSince(this.pingedAt) > this.staleThreshold.pingedAt;
      } else {
        return secondsSince(this.startedAt) > this.staleThreshold.startedAt;
      }
    };

    ConnectionMonitor.prototype.toJSON = function() {
      var connectionIsStale, interval;
      interval = this.getInterval();
      connectionIsStale = this.connectionIsStale();
      return {
        startedAt: this.startedAt,
        stoppedAt: this.stoppedAt,
        pingedAt: this.pingedAt,
        reconnectAttempts: this.reconnectAttempts,
        connectionIsStale: connectionIsStale,
        interval: interval
      };
    };

    now = function() {
      return new Date().getTime();
    };

    secondsSince = function(time) {
      return (now() - time) / 1000;
    };

    clamp = function(number, min, max) {
      return Math.max(min, Math.min(max, number));
    };

    return ConnectionMonitor;

  })();

}).call(this);
(function() {
  var slice = [].slice;

  Cable.Subscriptions = (function() {
    function Subscriptions(consumer) {
      this.consumer = consumer;
      this.subscriptions = [];
    }

    Subscriptions.prototype.create = function(channelName, mixin) {
      var channel, params;
      channel = channelName;
      params = typeof channel === 'object' ? channel : {
        channel: channel
      };
      return new Cable.Subscription(this, params, mixin);
    };

    Subscriptions.prototype.add = function(subscription) {
      this.subscriptions.push(subscription);
      this.notify(subscription, 'initialized');
      if (this.sendCommand(subscription, 'subscribe')) {
        return this.notify(subscription, 'connected');
      }
    };

    Subscriptions.prototype.reload = function() {
      var i, len, ref, results, subscription;
      ref = this.subscriptions;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        subscription = ref[i];
        if (this.sendCommand(subscription, 'subscribe')) {
          results.push(this.notify(subscription, 'connected'));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Subscriptions.prototype.remove = function(subscription) {
      var s;
      this.subscriptions = (function() {
        var i, len, ref, results;
        ref = this.subscriptions;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          s = ref[i];
          if (s !== subscription) {
            results.push(s);
          }
        }
        return results;
      }).call(this);
      if (!this.findAll(subscription.identifier).length) {
        return this.sendCommand(subscription, 'unsubscribe');
      }
    };

    Subscriptions.prototype.findAll = function(identifier) {
      var i, len, ref, results, s;
      ref = this.subscriptions;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        if (s.identifier === identifier) {
          results.push(s);
        }
      }
      return results;
    };

    Subscriptions.prototype.notifyAll = function() {
      var args, callbackName, i, len, ref, results, subscription;
      callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      ref = this.subscriptions;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        subscription = ref[i];
        results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
      }
      return results;
    };

    Subscriptions.prototype.notify = function() {
      var args, callbackName, i, len, results, subscription, subscriptions;
      subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
      if (typeof subscription === 'string') {
        subscriptions = this.findAll(subscription);
      } else {
        subscriptions = [subscription];
      }
      results = [];
      for (i = 0, len = subscriptions.length; i < len; i++) {
        subscription = subscriptions[i];
        results.push(typeof subscription[callbackName] === 'function' ? subscription[callbackName].apply(subscription, args) : void 0);
      }
      return results;
    };

    Subscriptions.prototype.sendCommand = function(subscription, command) {
      var identifier;
      identifier = subscription.identifier;
      if (identifier === Cable.PING_IDENTIFIER) {
        return this.consumer.connection.isOpen();
      } else {
        return this.consumer.send({
          command: command,
          identifier: identifier
        });
      }
    };

    Subscriptions.prototype.toJSON = function() {
      var i, len, ref, results, subscription;
      ref = this.subscriptions;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        subscription = ref[i];
        results.push(subscription.identifier);
      }
      return results;
    };

    return Subscriptions;

  })();

}).call(this);
(function() {
  Cable.Subscription = (function() {
    var extend;

    function Subscription(subscriptions, params, mixin) {
      this.subscriptions = subscriptions;
      if (params == null) {
        params = {};
      }
      this.identifier = JSON.stringify(params);
      extend(this, mixin);
      this.subscriptions.add(this);
      this.consumer = this.subscriptions.consumer;
    }

    Subscription.prototype.perform = function(action, data) {
      if (data == null) {
        data = {};
      }
      data.action = action;
      return this.send(data);
    };

    Subscription.prototype.send = function(data) {
      return this.consumer.send({
        command: 'message',
        identifier: this.identifier,
        data: JSON.stringify(data)
      });
    };

    Subscription.prototype.unsubscribe = function() {
      return this.subscriptions.remove(this);
    };

    extend = function(object, properties) {
      var key, value;
      if (properties != null) {
        for (key in properties) {
          value = properties[key];
          object[key] = value;
        }
      }
      return object;
    };

    return Subscription;

  })();

}).call(this);
(function() {
  Cable.Consumer = (function() {
    function Consumer(url) {
      this.url = url;
      this.subscriptions = new Cable.Subscriptions(this);
      this.connection = new Cable.Connection(this);
      this.connectionMonitor = new Cable.ConnectionMonitor(this);
    }

    Consumer.prototype.send = function(data) {
      return this.connection.send(data);
    };

    Consumer.prototype.inspect = function() {
      return JSON.stringify(this, null, 2);
    };

    Consumer.prototype.toJSON = function() {
      return {
        url: this.url,
        subscriptions: this.subscriptions,
        connection: this.connection,
        connectionMonitor: this.connectionMonitor
      };
    };

    return Consumer;

  })();

}).call(this);
