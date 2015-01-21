# react-ab

Simple A/B testing component for React. Chooses one variant at random, saves
that choice in a cookie and fires a callback.

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
        "title": variant
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

## Components

### Experiment or window.ReactAB.Experiment

An A/B experiment. Required attributes `name`, `onChoice`
and `children`. `childern` has to be an array of Variant
components. `onChoice` is called when a variant is chosen with arguments
`experiment name`, `variant name` and `variant index`.  The state of the
experiment (that is the variant that was chosen) is saved in a cookie
with name "react_ab_{experiment name}" and path "/".

* * *

### Variant or window.ReactAB.Variant

A variant in an A/B experiment. Required attributes `name` and `children`.
