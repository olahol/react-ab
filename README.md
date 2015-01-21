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
