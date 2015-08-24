# react-ab

[![npm version](https://badge.fury.io/js/react-ab.svg)](http://badge.fury.io/js/react-ab)
[![Build Status](https://travis-ci.org/olahol/react-ab.svg)](https://travis-ci.org/olahol/react-ab)
[![Coverage Status](https://img.shields.io/coveralls/olahol/react-ab.svg?style=flat)](https://coveralls.io/r/olahol/react-ab)
[![Dependency Status](https://david-dm.org/olahol/react-ab.svg)](https://david-dm.org/olahol/react-ab)
[![Download Count](https://img.shields.io/npm/dm/react-ab.svg?style=flat)](https://www.npmjs.com/package/react-ab)

> Simple isopmorphic A/B testing component for [React](http://facebook.github.io/react/index.html).

### [Demo](https://olahol.github.io/react-ab/example)

[![A/B Testing Demo](https://cdn.rawgit.com/olahol/react-ab/master/example/demo.gif "A/B Testing Demo")](http://olahol.github.io/react-ab/example)

## Install

```bash
npm install react-ab --save
```

or

```bash
bower install react-ab --save
```

## Examples

Using [Mixpanel](https://mixpanel.com/).

```js
var Experiment = require("react-ab").Experiment
  , Variant = require("react-ab").Variant;

var App = React.createClass({
  choice: function (experiment, variant, index) {
    mixpanel.register({
      "tagline": variant
    });
  }

  , click: function (e) {
    mixpanel.track("click");
  }

  , render: function () {
    return (
      <div>
        <Experiment onChoice={this.choice} name="tagline">
          <Variant name="normal">
            <h1> A A/B testing component for React </h1>
          </Variant>
          <Variant name="enterprise">
            <h1> A vertically integrated React component </h1>
          </Variant>
          <Variant name="lies">
            <h1> One weird React component that will increase your metrics by 100%! </h1>
          </Variant>
        </Experiment>
        <a onClick={this.click} href="//github.com/olahol/react-ab">React AB component</a>
      </div>
    );
  }
});
```

Using [Google Universal Analytics](http://www.google.com/analytics/). Requires
a [Custom Dimension](https://support.google.com/analytics/answer/2709829?hl=en).

```js
var Experiment = require("react-ab").Experiment
  , Variant = require("react-ab").Variant;

var randomGoogle = function () {
  // base randomness off analytics.js client id.
  // https://developers.google.com/analytics/devguides/platform/user-id#clientid-userid
  var clientId = tracker.get("clientId");
  return (parseFloat(clientId, 10) % 100) / 100;
};

var App = React.createClass({
  choice: function (experiment, variant) {
    var dimension = 1; // Index of your custom dimension.
    ga("set", "dimension" + dimension, experiment + ": " + variant);
  }

  , click: function (e) {
    ga("send", "event", "click", "link");
  }

  , render: function () {
    return (
      <div>
        <Experiment onChoice={this.choice} random={randomGoogle} name="tagline">
          <Variant name="normal">
            <h1> A A/B testing component for React </h1>
          </Variant>
          <Variant name="enterprise">
            <h1> A vertically integrated React component </h1>
          </Variant>
          <Variant name="lies">
            <h1> One weird React component that will increase your metrics by 100%! </h1>
          </Variant>
        </Experiment>
        <a onClick={this.click} href="//github.com/olahol/react-ab">React AB component</a>
      </div>
    );
  }
});
```

Server side with Express.js and using ES6:

```js
import express from "express";
import cookieParser from "cookie-parser";

import React from "react/addons";
import { Experiment, Variant } from "react-ab";

var cookie = {};

var App = React.createClass({
  choice: function (experiment, variant, index) {
    console.log(experiment, variant, index);
  }

  , render: function () {
    return (
      <div>
        <Experiment {...this.props} onChoice={this.choice} name="tagline">
          <Variant name="normal">
            <h1> A A/B testing component for React </h1>
          </Variant>
          <Variant name="enterprise">
            <h1> A vertically integrated React component </h1>
          </Variant>
          <Variant name="lies">
            <h1> One weird React component that will increase your metrics by 100%! </h1>
          </Variant>
        </Experiment>
      </div>
    );
  }
});

var app = express();

app.use(cookieParser());

app.get("/", function (req, res) {
  res.send(React.renderToString(<App
    get={(x) => req.cookies[x]}
    set={(x, y) => res.cookie(x, y)}
    clear={res.clearCookie}
  />));
});

app.listen(3000);
```

## API

### Experiment

#### Props

##### name

Name of experiment, this prop is required. Should be something that
describes the category being tested like color or title.

##### onChoice

Callback that fires when a variant is chosen.  Gets arguments `experiment
name`, `variant name`, `variant index` and `was retrieved?`. `was
retrieved?` is true if the variant was retrieved using the `get` prop
usually from a cookie.

##### random

Random function, should return a number in the range [0, 1). The default uses
`crypto.getRandomValues()` when available and falls back on `Math.random`.

##### get

A function that takes an `experiment` and returns a `variant`.

##### set

A function that takes an `experiment` and `variant` and stores it.

##### clear

A function that clears/unsets an `experiment`.

#### Context

`get, set, clear, random` can also be set from `context`. If these props
exists they overwrite `context`.

##### randomExperiment

`random` function taken from `context`.

##### getExperiment

`get` function taken from `context`.

##### setExperiment

`set` function taken from `context`.

##### clearExperiment

`clear` function taken from `context`.

#### Methods

##### getVariant()

Returns the name of the current variant.

##### chooseVariant()

Choose a new variant.

##### clearCookie()

Clear the experiment cookie.

### Variant

#### Props

##### name

Name of variant, this props is required. Should be something descriptive of
the attribute the variant represent like red or large.

---

MIT Licensed
