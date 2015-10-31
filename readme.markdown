[![Build Status](https://img.shields.io/travis/wazery/ng-cable.svg?style=flat-square)](https://travis-ci.org/wazery/ng-cable)
[![npm version](https://img.shields.io/npm/v/ng-cable.svg?style=flat-square)](http://badge.fury.io/js/ng-cable)
[![github tag](https://img.shields.io/github/tag/wazery/ngCable.svg?style=flat-square)](https://github.com/wazery/ngCable/tags)
[![Download Count](https://img.shields.io/npm/dm/ng-cable.svg?style=flat-square)](http://www.npmjs.com/package/ng-cable)
[![Code Climate](https://img.shields.io/codeclimate/github/wazery/ngCable/badges/gpa.svg?style=flat-square)](https://codeclimate.com/github/wazery/ngCable)

<p align="center">
  <img src='http://i.imgur.com/hicMwNW.png' alt='ng-cable logoe'/>
</p>

> Easily integrate Rails' ActionCable into your Angular application.

### [Demo](http://wazery.github.io/ngCable)

## Install

You can download all necessary ngCable files manually or install it with Bower:

```bash
bower install ngCable
```

or NPM:

```bash
npm install ng-cable
```

## Usage

You will not need to include any files, you can start using ``ngCable`` provider in your directives, controllers and services, just after installing the Bower component or NPM module.

For example in controllers:

```javascript
var app = angular.module('exampleApp', ['ngCable']);

app.controller('MainCtrl', function ($scope, $cable) {
    var cable = $cable('ws://0.0.0.0:28080');
    var channel = cable.subscribe('RoomsChannel', { received: function(newComment){
      $scope.comments.push(newComment);
    }});
});
```

## API

ngCable factory provides easy to use and minimalistic API, but in the same time it's powerful enough.

Here is the list of accessible methods that you can use:

### Subscriptions
#### ``.subscribe(channel_name, {})``
  Method allows to subscribe to a channel.

#### ``.unsubscribe(channel_name, {})``
  Method allows to unsubscribe from a channel.

### Connection
#### ``cable.connection.isOpen()``
  To check if the connection is open, using the cable instance.

### Channels
### ``cable.channels``
  To list all of the available channels.

## Example Applications

I have created example applications for both Rails, and Angular sides.

You can check them here by cloning this [repository](https://github.com/wazery/ng-cable-example-apps) and following the instructions of each submodule (application).

**In this example application you can:**

1. Login with multiple users
2. Open different chat rooms
3. Chat in real time with online users
4. See whom are online

Here is a screenshot from the Angular example application:

![Angular app screenshot](http://i.imgur.com/m8WJWfL.png?1)

## Collaboration

Your help is appreciated! If you've found a bug or something is not clear, please raise an issue.

Ideally, if you've found an issue, you will submit a PR that meets our [contributor guidelines](https://github.com/wazery/ngCable/blob/dev/contributing.markdown).

[![Throughput Graph](https://graphs.waffle.io/wazery/ngCable/throughput.svg)](https://waffle.io/wazery/ngCable/metrics)

