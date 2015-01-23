global.document = require("jsdom").jsdom("");
global.window = document.parentWindow;
global.navigator = window.navigator;

var assert = require("assert");

var React = require("react/addons")
  , TestUtils = React.addons.TestUtils;

var Experiment = require("../react-ab").Experiment
  , Variant = require("../react-ab").Variant;

describe("Experiment", function () {
  var createExperiment = function (name, choice, variants) {
    var variantNodes = variants.map(function (variant) {
      return React.createElement(Variant, { key: variant, name: variant }, React.createElement("span", null, variant));
    });

    return TestUtils.renderIntoDocument(React.createElement(Experiment, { name: name, onChoice: choice }, variantNodes));
  };

  it("should choose a variant", function (done) {
    var count = 3;

    var variants = ["one", "two", "three"];

    var choice = function (experiment, variant, index, ret) {
      count -= 1;
      assert.equal(experiment, "test");
      assert.equal(variants[index], variant);
      assert.ok(variants.indexOf(variant) !== -1);
      assert.equal(count == 1, ret);
      if (count === 0) { done(); }
    };

    var ex1 = createExperiment("test", choice, variants)
      , span1 = TestUtils.findRenderedDOMComponentWithTag(ex1, "span")
      , variant1 = span1.getDOMNode().textContent;

    assert.ok(variants.indexOf(variant1) !== -1);

    var ex2 = createExperiment("test", choice, variants)
      , span2 = TestUtils.findRenderedDOMComponentWithTag(ex2, "span")
      , variant2 = span2.getDOMNode().textContent;

    assert.equal(variant1, variant2);

    assert.equal(ex1.getVariant(), ex2.getVariant());

    ex1.clearCookie();

    var ex3 = createExperiment("test", choice, variants)
      , span3 = TestUtils.findRenderedDOMComponentWithTag(ex3, "span")
      , variant3 = span3.getDOMNode().textContent;

    assert.ok(variants.indexOf(variant3) !== -1);
  });
});
