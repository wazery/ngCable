[![Build Status](https://travis-ci.org/wazery/ng-cable.svg)](https://travis-ci.org/wazery/ng-cable)
[![npm version](http://badge.fury.io/js/ng-cable.svg)](http://badge.fury.io/js/ng-cable)
[![github tag](https://img.shields.io/github/tag/wazery/ngCable.svg)](https://github.com/wazery/ngCable/tags)
[![Download Count](https://img.shields.io/npm/dm/ng-cable.svg)](http://www.npmjs.com/package/ng-cable)
[![Code Climate](https://codeclimate.com/github/wazery/ngCable/badges/gpa.svg)](https://codeclimate.com/github/wazery/ngCable)

![ng-cable logo](http://i.imgur.com/hicMwNW.png?1)

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

ngCable service provides easy to use and minimalistic API, but in the same time it's powerful enough. Here is the list of accessible methods that you can use:

### ``.subscribe(options)``

Method allows to subscribe to a channel.

## Example Applications

I have created example applications for both Rails, and Angular sides. You can check them here by cloning this [repository](https://github.com/wazery/ng-cable-example-apps) and following the instructions of each submodule (application).

Here is a screenshot from the Angular example application:

![Angular app screenshot](http://i.imgur.com/m8WJWfL.png?1)

## Collaboration

Your help is appreciated! If you've found a bug or something is not clear, please raise an issue.

Ideally, if you've found an issue, you will submit a PR that meets our [contributor guidelines](https://github.com/wazery/ngCable/blob/dev/contributing.markdown).

[![Throughput Graph](https://graphs.waffle.io/wazery/ngCable/throughput.svg)](https://waffle.io/wazery/ngCable/metrics)
