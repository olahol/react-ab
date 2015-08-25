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
    /* Interface */
    propTypes: {
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
