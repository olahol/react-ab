;(function (root, factory) {
  /* istanbul ignore next */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(require("react"), require("create-react-class"), require("prop-types"));
  } else if (typeof define === "function" && define.amd) {
    define(["react", "create-react-class", "prop-types"], factory);
  } else {
    root.ReactAB = factory(root.React, root.React.createClass, root.React.PropTypes);
  }
})(this, function (React, createClass, PropTypes) {
  "use strict";

  var exports = {};

  /* istanbul ignore next */
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

      seconds = typeof seconds === "undefined" ? 365 * 24 * 60 * 60 : seconds;

      date = new Date();
      date.setTime(date.getTime()+(seconds*1000));
      expires = "expires=" + date.toGMTString();

      document.cookie = [key, expires, path].join(";");
    }

    , clear: function (name) {
      browserCookie.set(name, "", -1);
    }
  };

  exports.Variant = createClass({
    displayName: "Variant"

    , propTypes: {
      name: PropTypes.string.isRequired
      , children: PropTypes.node
    }

    , render: function () {
      if (React.Children.count(this.props.children) === 1 && React.isValidElement(this.props.children)) {
        return this.props.children;
      }

      return React.createElement("span", null, this.props.children);
    }
  });

  exports.Experiment = createClass({
    displayName: "Experiment"

    /* Interface */
    , propTypes: {
      name: PropTypes.string.isRequired
      , children: PropTypes.array.isRequired
      , onChoice: PropTypes.func.isRequired
      , random: PropTypes.func
      , get: PropTypes.func
      , set: PropTypes.func
      , clear: PropTypes.func
    }

    , contextTypes: {
      randomExperiment: PropTypes.func
      , getExperiment: PropTypes.func
      , setExperiment: PropTypes.func
      , clearExperiment: PropTypes.func
    }

    /* Variables */
    , _index: -1

    /* Private */
    , _random: function () {
      var fn = this.props.random || this.context.randomExperiment || random;
      return fn();
    }

    , _defaultFunc: function (name, fn) {
      return this.props[name] || this.context[name + "Experiment"] || browserCookie[name];
    }

    , _keyName: function () {
      return "react_ab_" + this.props.name;
    }

    , _get: function () {
      return this._defaultFunc("get")(this._keyName());
    }

    , _set: function (v) {
      return this._defaultFunc("set")(this._keyName(), v);
    }

    , _clear: function () {
      return this._defaultFunc("clear")(this._keyName());
    }

    /* Lifecycle */
    , componentWillMount: function () {
      var variant = this._get();

      for (var i = 0; i < this.props.children.length; i += 1) {
        if (variant === this.props.children[i].props.name) {
          this._index = i;
          this.props.onChoice(this.props.name, this.props.children[i].props.name, i, true);
          return ;
        }
      }

      this.chooseVariant(false);
    }

    /* Methods */
    , chooseVariant: function (update) {
      if (typeof update === "undefined") { update = true; }

      var index = Math.floor(this._random() * this.props.children.length)
        , variant = this.props.children[index].props.name;

      this._set(variant);
      this._index = index;
      this.props.onChoice(this.props.name, variant, index, false);

      if (update) {
        this.forceUpdate();
      }

      return index;
    }

    , getVariant: function () {
      var child = this.props.children[this._index]
        , variant = child.props.name;

      return variant;
    }

    , clearCookie: function () {
      this._clear();
    }

    /* Render */
    , render: function () {
      var child = this.props.children[this._index];
      return child;
    }
  });

  return exports;
});
