;(function (root, factory) {
  /* istanbul ignore next */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(require("react"));
  } else if (typeof define === "function" && define.amd) {
    define(["react"], factory);
  } else {
    root.ReactAB = factory(root.React);
  }
})(this, function (React) {
  "use strict";

  var findIndex = require('lodash.findindex');

  var exports = {};

  var random = function () {
    try {
      var arr = new Uint16Array(1);
      window.crypto.getRandomValues(arr);
      return arr[0] / 65536;
    } catch(e) {
      return Math.random();
    }
  };

  var browserCookie = {
    get: function (name) {
      var eq = name + "="
        , ca = document.cookie.split(";")
        , c = null;
      for(var i=0;i < ca.length;i += 1) {
        c = ca[i];
        while (c.charAt(0) === " ") {
          c = c.substring(1, c.length);
        }
        if (c.indexOf(eq) === 0) {
          return decodeURIComponent(c.substring(eq.length, c.length));
        }
      }
      return null;
    }

    , set: function (name, value, seconds) {
      var key = name + "=" + encodeURIComponent(value)
        , expires = ""
        , path = "path=/"
        , date = null;

      if (typeof seconds !== "undefined") {
        date = new Date();
        date.setTime(date.getTime()+(seconds*1000));
        expires = "expires=" + date.toGMTString();
      }

      document.cookie = [key, expires, path].join(";");
    }

    , clear: function (name) {
      browserCookie.set(name, "", -1);
    }
  };

  exports.Variant = React.createClass({
    propTypes: {
      name: React.PropTypes.string.isRequired
      , children: React.PropTypes.node.isRequired
    }

    , render: function () {
      if (React.Children.count(this.props.children) === 1 && React.isValidElement(this.props.children)) {
        return this.props.children;
      }

      return React.createElement("span", null, this.props.children);
    }
  });

  exports.Experiment = React.createClass({
    index: -1
    , wasRetrieved: true

    , propTypes: {
      name: React.PropTypes.string.isRequired
      , children: React.PropTypes.array.isRequired
      , onChoice: React.PropTypes.func.isRequired
      , random: React.PropTypes.func
      , get: React.PropTypes.func
      , set: React.PropTypes.func
      , clear: React.PropTypes.func
    }

    , contextTypes: {
      randomExperiment: React.PropTypes.func
      , getExperiment: React.PropTypes.func
      , setExperiment: React.PropTypes.func
      , clearExperiment: React.PropTypes.func
    }

    , random: function () {
      return this.props.random || this.context.randomExperiment || random;
    }

    , get: function () {
      return this.props.get || this.context.getExperiment || browserCookie.get;
    }

    , set: function () {
      return this.props.set || this.context.setExperiment || browserCookie.set;
    }

    , clear: function () {
      return this.props.clear || this.context.clearExperiment || browserCookie.clear;
    }

	  , componentWillMount: function() {
      var variant = this.get()(this.cookieName());

      var selectedChildrenIndex = findIndex(this.props.children, function(c) {
        return c.props.name === variant;
      });

      if (selectedChildrenIndex >= 0) {
        this.index = selectedChildrenIndex;
      } else {
        this.index = this.chooseVariant();
      }
    }

    , componentDidMount: function() {
      this.props.onChoice(this.props.name, this.getVariant(), this.index, this.wasRetrieved);
    }

    , chooseVariant: function (fire) {
      var index = Math.floor(this.random()() * this.props.children.length)
        , variant = this.props.children[index].props.name;

      this.set()(this.cookieName(), variant);

      this.index = index;
      this.wasRetrieved = false;

      return index;
    }

    , getVariant: function () {
      var child = this.props.children[this.index]
        , variant = child.props.name;

      return variant;
    }

    , cookieName: function () {
      return "react_ab_" + this.props.name;
    }

    , clearCookie: function () {
      this.clear()(this.cookieName());
    }

    , render: function () {
      return this.props.children[this.index];
    }
  });

  return exports;
});
