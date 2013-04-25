// Generated by CoffeeScript 1.4.0
(function() {
  var Logger,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  Logger = (function() {

    Logger.prototype.severityData = {
      debug: {
        level: 1,
        prefix: '[c="color: green"]DEBUG[c]'
      },
      info: {
        level: 3,
        prefix: '[c="color: blue"]INFO[c]'
      },
      warning: {
        level: 5,
        prefix: '[c="color: orange"]WARNING[c]'
      },
      error: {
        level: 7,
        prefix: '[c="color: red"]ERROR[c]'
      },
      fatal: {
        level: 9,
        prefix: '[c="color: red"]FATAL[c]'
      }
    };

    function Logger(options) {
      var _ref;
      this.options = options;
      this.safariSupport = __bind(this.safariSupport, this);

      this.isIE = __bind(this.isIE, this);

      this.isSafari = __bind(this.isSafari, this);

      this.stringToArgs = __bind(this.stringToArgs, this);

      this.getOrderedMatches = __bind(this.getOrderedMatches, this);

      this.hasMatches = __bind(this.hasMatches, this);

      this.makeArray = __bind(this.makeArray, this);

      this._log = __bind(this._log, this);

      this.log = __bind(this.log, this);

      this.print = __bind(this.print, this);

      this.severity = ((_ref = this.severityData[this.options.severity]) != null ? _ref.level : void 0) || 5;
      return;
    }

    Logger.prototype.print = function() {
      var additional, context, contextname, message, method, type, _msg, _type;
      type = arguments[0], context = arguments[1], message = arguments[2], additional = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
      if (!(message != null)) {
        message = method;
        method = null;
      }
      contextname = context.constructor.name;
      _type = type.toLowerCase();
      if ((this.severityData[_type] != null) && this.severityData[_type].level >= this.severity) {
        _msg = "" + this.severityData[_type].prefix + ": ";
        if (context != null) {
          _msg += " `" + contextname + "` ";
        }
        _msg += "" + message;
        if (additional.length) {
          this.log(_msg, additional);
        } else {
          this.log(_msg);
        }
      }
    };

    Logger.prototype.log = function() {
      var args,
        _this = this;
      args = [];
      this.makeArray(arguments).forEach(function(arg) {
        if (typeof arg === 'string') {
          return args = args.concat(_this.stringToArgs(arg));
        } else {
          return args.push(arg);
        }
      });
      return this._log.apply(window, args);
    };

    Logger.prototype._log = function() {
      return console.log.apply(console, this.makeArray(arguments));
    };

    Logger.prototype.makeArray = function(arrayLikeThing) {
      return Array.prototype.slice.call(arrayLikeThing);
    };

    Logger.prototype.formats = [
      {
        regex: /\*([^\*)]+)\*/,
        replacer: function(m, p1) {
          return "%c" + p1 + "%c";
        },
        styles: function() {
          return ['font-style: italic', ''];
        }
      }, {
        regex: /\_([^\_)]+)\_/,
        replacer: function(m, p1) {
          return "%c" + p1 + "%c";
        },
        styles: function() {
          return ['font-weight: bold', ''];
        }
      }, {
        regex: /\`([^\`)]+)\`/,
        replacer: function(m, p1) {
          return "%c" + p1 + "%c";
        },
        styles: function() {
          return ['background: rgb(255, 255, 219); padding: 1px 5px; border: 1px solid rgba(0, 0, 0, 0.1)', ''];
        }
      }, {
        regex: /\[c\=\"([^\")]+)\"\]([^\[)]+)\[c\]/,
        replacer: function(m, p1, p2) {
          return "%c" + p2 + "%c";
        },
        styles: function(match) {
          return [match[1], ''];
        }
      }
    ];

    Logger.prototype.hasMatches = function(str) {
      var _hasMatches;
      _hasMatches = false;
      this.formats.forEach(function(format) {
        if (format.regex.test(str)) {
          return _hasMatches = true;
        }
      });
      return _hasMatches;
    };

    Logger.prototype.getOrderedMatches = function(str) {
      var matches;
      matches = [];
      this.formats.forEach(function(format) {
        var match;
        match = str.match(format.regex);
        if (match) {
          return matches.push({
            format: format,
            match: match
          });
        }
      });
      return matches.sort(function(a, b) {
        return a.match.index - b.match.index;
      });
    };

    Logger.prototype.stringToArgs = function(str) {
      var firstMatch, matches, styles;
      styles = [];
      while (this.hasMatches(str)) {
        matches = this.getOrderedMatches(str);
        firstMatch = matches[0];
        str = str.replace(firstMatch.format.regex, firstMatch.format.replacer);
        styles = styles.concat(firstMatch.format.styles(firstMatch.match));
      }
      return [str].concat(styles);
    };

    Logger.prototype.isSafari = function() {
      return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    };

    Logger.prototype.isIE = function() {
      return /MSIE/.test(navigator.userAgent);
    };

    Logger.prototype.safariSupport = function() {
      var m;
      m = navigator.userAgent.match(/AppleWebKit\/(\d+)\.(\d+)(\.|\+|\s)/);
      if (!m) {
        return false;
      }
      return 537.38 >= parseInt(m[1], 10) + (parseInt(m[2], 10) / 100);
      if ((this.isSafari() && !this.safariSupport()) || this.isIE()) {
        window.log = _log;
      } else {
        window.log = log;
      }
      return window.log.l = _log;
    };

    return Logger;

  })();

}).call(this);
