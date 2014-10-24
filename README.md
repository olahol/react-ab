# react-ab

Simple A/B testing component for React.

## Example

An example using
[analytics.js](https://developers.google.com/analytics/devguides/collection/analyticsjs/)
from Google analytics.

```js
var choice = function (experiment, variant, index) {
  ga("set", experiment, variant);
};

var App = React.createClass({
  render: function () {
    var click = function (e) {
      ga("send", "event", "click", "button");
    };

    return (
      <div>
        <Experiment onChoice={choice} name="signup">
          <Variant name="red">
            <button onClick={click} style={{backgroundColor: "red"}}>Signup</button>
          </Variant>
          <Variant name="blue">
            <button onClick={click} style={{backgroundColor: "blue"}}>Signup</button>
          </Variant>
        </Experiment>
      </div>
    );
  }
});
```

## Components

### exports.Experiment or window.React.addons.Experiment

An A/B experiment. Required attributes `name`, `onChoice`
and `children`. `childern` has to be an array of Variant
components. `onChoice` is called when a variant is chosen with arguments
`experiment name`, `variant name` and `variant index`.  The state of the
experiment (that is the variant that was chosen) is saved in a cookie
with name "react_ab_{experiment name}" and path "/".

* * *

### exports.Variant or window.React.addons.Variant

A variant in an A/B experiment. Required attributes `name` and `children`.
