# react-ab

[![npm version](https://badge.fury.io/js/react-ab.svg)](http://badge.fury.io/js/react-ab)
[![Build Status](https://travis-ci.org/olahol/react-ab.svg)](https://travis-ci.org/olahol/react-ab)
[![Coverage Status](https://img.shields.io/coveralls/olahol/react-ab.svg?style=flat)](https://coveralls.io/r/olahol/react-ab)
[![Dependency Status](https://david-dm.org/olahol/react-ab.svg)](https://david-dm.org/olahol/react-ab)
[![Download Count](https://img.shields.io/npm/dm/react-ab.svg?style=flat)](https://www.npmjs.com/package/react-ab)

> Simple and Isopmorphic A/B testing component for [React](http://facebook.github.io/react/index.html).

[![A/B Testing Demo](https://cdn.rawgit.com/olahol/react-ab/master/example/demo.gif "A/B Testing Demo")](http://olahol.github.io/react-ab)

## Install

```bash
npm install react-ab --save
```

## Example

An example using [Mixpanel](https://mixpanel.com/).

```js
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

## Experiment API

### Props

##### name (required)

Name of what you are testing, something descriptive like title or color.

##### onChoice(experiment, variant, index) (required)

Callback that fires when the chosen variant is mounted. You want to use
this to setup tracking variables.

### Methods

##### getVariant()

Returns the name of the chosen variant.

## Variant API

### Props

##### name (required)

Name of the attribute you are testing, if you are for example running
and experiment testing which color leads to the most conversion this
prop should be something like red, blue or green indicating what color
you are testing.

---

MIT Licensed
