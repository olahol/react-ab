;(function () {
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

  var exports = {};

  var Variant = exports.Variant = React.createClass({
    propTypes: {
      name: React.PropTypes.string.isRequired
    }

    , render: function () {
      return React.DOM.span(null, this.props.children);
    }
  });

  var Experiment = exports.Experiment = React.createClass({
    index: null

    , propTypes: {
      name: React.PropTypes.string.isRequired
      , children: React.PropTypes.array.isRequired
      , onChoice: React.PropTypes.func.isRequired
    }

    , chooseVariant: function () {
      var index = Math.floor(Math.random() * this.props.children.length)
        , variant = this.props.children[index].props.name;

      cookie.set("react_ab_" + this.props.name, variant, "/");

      return index;
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
      var child = this.props.children[this.index]
        , variant = child.props.name;
      this.props.onChoice(this.props.name, variant, this.index);
    }

    , render: function () {
      var child = this.props.children[this.index];

      return React.DOM.span(null, child.props.children);
    }
  });

	if (typeof module === "object" && module.exports){
		module.exports = exports;
	} else {
    if (typeof window.React === "undefined") {
      console.warn("AB requires React");
      return ;
    }

    window.React.addons.Experiment = exports.Experiment;
    window.React.addons.Variant = exports.Variant;
	}
}());
