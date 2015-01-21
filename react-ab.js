;(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(require("react"));
  } else if (typeof define === "function" && define.amd) {
    define(["react"], factory);
  } else {
    root.ReactAB = factory(root.React);
  }
})(this, function (React) {
  "use strict";

  if (typeof document === "undefined" || typeof window === "undefined") {
    throw new Error("react-ab uses cookies and requires a browser environment");
  }

  var exports = {};

  var cookie = {
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
    , set: function (name, value, path) {
      document.cookie = name + "=" + encodeURIComponent(value) + "; path=" + encodeURI(path);
    }
  };

  exports.Variant = React.createClass({
    propTypes: {
      name: React.PropTypes.string.isRequired
      , children: React.PropTypes.node.isRequired
    }

    , render: function () {
      return this.props.children;
    }
  });

  exports.Experiment = React.createClass({
    index: null

    , propTypes: {
      name: React.PropTypes.string.isRequired
      , children: React.PropTypes.array.isRequired
      , onChoice: React.PropTypes.func.isRequired
    }

    , componentWillMount: function () {
      var variant = cookie.get("react_ab_" + this.props.name);

      if (variant === null) {
        this.index = this.chooseVariant();
        return ;
      }

      for (var i = 0; i < this.props.children.length; i += 1) {
        if (variant === this.props.children[i].props.name) {
          this.index = i;
          break;
        }
      }

      if (this.index === null) {
        this.index = this.chooseVariant();
      }
    }

    , componentDidMount: function () {
      this.props.onChoice(this.props.name, this.getVariant(), this.index);
    }

    , chooseVariant: function () {
      var index = Math.floor(Math.random() * this.props.children.length)
        , variant = this.props.children[index].props.name;

      cookie.set("react_ab_" + this.props.name, variant, "/");

      return index;
    }

    , getVariant: function () {
      if (this.index === null) { return ; }

      var child = this.props.children[this.index]
        , variant = child.props.name;

      return variant;
    }

    , render: function () {
      var child = this.props.children[this.index];

      //return React.createElement("span", null, child.props.children);
      return child;
    }
  });

  return exports;
});
