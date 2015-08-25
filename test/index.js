var getRandomValues = require("get-random-values");
global.document = require("jsdom").jsdom("");
global.window = document.parentWindow;
global.navigator = window.navigator;

var defineGetRandomValues = function () {
  global.window.crypto = {
    getRandomValues: getRandomValues
  };
};

var assert = require("assert");

var React = require("react/addons")
  , TestUtils = React.addons.TestUtils;

var Experiment = require("../react-ab").Experiment
  , Variant = require("../react-ab").Variant;

describe("Experiment", function () {
  var createExperiment = function (name, choice, variants, factory) {
    factory = factory || function (variant) {
      return React.createElement("span", null, variant);
    };

    var variantNodes = variants.map(function (variant) {
      return React.createElement(Variant, { key: variant, name: variant }, factory(variant));
    });

    return TestUtils.renderIntoDocument(React.createElement(Experiment, { name: name, onChoice: choice }, variantNodes));
  };

  it("should choose a variant", function (done) {
    var variants = ["one", "two", "three"];

    var count1 = 3;
    var choice1 = function (experiment, variant, index, ret) {
      count1 -= 1;
      assert.equal(variants[index], variant);
      assert.ok(variants.indexOf(variant) !== -1);
      assert.equal(count1 == 1, ret);
    };

    var ex1 = createExperiment("test1", choice1, variants)
      , span1 = TestUtils.findRenderedDOMComponentWithTag(ex1, "span")
      , variant1 = span1.getDOMNode().textContent;

    assert.ok(variants.indexOf(variant1) !== -1);

    var ex2 = createExperiment("test1", choice1, variants)
      , span2 = TestUtils.findRenderedDOMComponentWithTag(ex2, "span")
      , variant2 = span2.getDOMNode().textContent;

    assert.equal(variant1, variant2); // variants should be the same as the cookie was not cleared

    assert.equal(ex1.getVariant(), ex2.getVariant()); // get variant should also work as intended.

    defineGetRandomValues(); // define random values here to test it

    ex1.clearCookie();

    var ex3 = createExperiment("test1", choice1, variants)
      , span3 = TestUtils.findRenderedDOMComponentWithTag(ex3, "span")
      , variant3 = span3.getDOMNode().textContent;

    assert.ok(variants.indexOf(variant3) !== -1);

    // test another cookie
    var count2 = 2;
    var choice2 = function (experiment, variant, index, ret) {
      count2 -= 1;
      assert.equal(experiment, " test2");
      assert.equal(variants[index], variant);
      assert.ok(variants.indexOf(variant) !== -1);
      if (count2 === 0) { done(); }
    };

    var ex4 = createExperiment(" test2", choice2, variants)
      , span4 = TestUtils.findRenderedDOMComponentWithTag(ex4, "span")
      , variant4 = span4.getDOMNode().textContent;

    assert.ok(variants.indexOf(variant4) !== -1);

    var ex5 = createExperiment(" test2", choice2, variants)
      , span5 = TestUtils.findRenderedDOMComponentWithTag(ex5, "span")
      , variant5 = span5.getDOMNode().textContent;

    assert.ok(variants.indexOf(variant5) !== -1);

    assert.equal(variant4, variant5);

    assert.equal(ex4.getVariant(), ex5.getVariant());
  });

  it("should work when variants have multiple children", function () {
    var variant1 = React.createElement(Variant, { name: "one" }, React.createElement("span", null, ""), React.createElement("span", null, ""));
    var variant2 = React.createElement(Variant, { name: "two" }, React.createElement("span", null, ""), React.createElement("span", null, ""));
    var ex = TestUtils.renderIntoDocument(React.createElement(Experiment, { name: "test", onChoice: function () { }}, variant1, variant2));

    assert.ok(ex);
  });

  it("should work universal", function () {
    var variant1 = React.createElement(Variant, { name: "one" }, React.createElement("span", null, "one"));
    var variant2 = React.createElement(Variant, { name: "two" }, React.createElement("span", null, "two"));
    var cookie = {};
    var html = React.renderToString(React.createElement(Experiment, {
      name: "test"
      , get: function (x) { return cookie[x]; }
      , set: function (x, y) { cookie[x] = y; }
      , clear: function (x) { delete cookie[x] }
      , onChoice: function () { }
    }, variant1, variant2));

    assert.ok(/(one|two)/.test(html), "one or two should be in html");
    assert.equal(Object.keys(cookie).length, 1, "there should be one key");
  });

  it("should work with universal context", function () {
    var cookie = {};

    var App = React.createClass({
      childContextTypes: {
        getExperiment: React.PropTypes.func
        , setExperiment: React.PropTypes.func
        , clearExperiment: React.PropTypes.func
      }

      , getChildContext: function () {
        return {
          getExperiment: function (x) { return cookie[x]; }
          , setExperiment: function (x, y) { cookie[x] = y; }
          , clearExperiment: function (x) { delete cookie[x] }
        };
      }

      , render: function () {
        var variant1 = React.createElement(Variant, { name: "one" }, React.createElement("span", null, "one"));
        var variant2 = React.createElement(Variant, { name: "two" }, React.createElement("span", null, "two"));

        return React.createElement(Experiment, { name: "test" , onChoice: function () { } }, variant1, variant2);
      }
    });

    var html = React.renderToString(React.createElement(App));
    assert.ok(/(one|two)/.test(html), "one or two should be in html");
    assert.equal(Object.keys(cookie).length, 1, "there should be one key");
  });

  it("should work with text nodes", function () {
    var variant1 = React.createElement(Variant, { name: "one" }, "one");
    var variant2 = React.createElement(Variant, { name: "two" }, "two");
    var ex = TestUtils.renderIntoDocument(React.createElement(Experiment, { name: "test", onChoice: function () { }}, variant1, variant2));

    assert.ok(ex);
  });

  it("should test choose variant", function () {
    var variant1 = React.createElement(Variant, { name: "one" }, "one");
    var variant2 = React.createElement(Variant, { name: "two" }, "two");
    var ex = TestUtils.renderIntoDocument(React.createElement(Experiment, { name: "test", onChoice: function () { }}, variant1, variant2));

    ex.chooseVariant();

    assert.ok(ex);
  });
});
