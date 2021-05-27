sap.ui.define([], function () {
  "use strict";

  var formatWithBrackets = function (firstPart, secondPart) {
    if (secondPart) {
      return firstPart ? firstPart + " (" + secondPart + ")" : secondPart;
    } else {
      return firstPart ? firstPart : "";
    }
  };

  formatWithBrackets.__functionName = "sap.fe.core.formatters.ValueFormatter#formatWithBrackets";
  /**
   * Collection of table formatters.
   *
   * @param {object} this the context
   * @param {string} sName the inner function name
   * @param {object[]} oArgs the inner function parameters
   * @returns {object} the value from the inner function
   */

  var valueFormatters = function (sName) {
    if (valueFormatters.hasOwnProperty(sName)) {
      for (var _len = arguments.length, oArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        oArgs[_key - 1] = arguments[_key];
      }

      return valueFormatters[sName].apply(this, oArgs);
    } else {
      return "";
    }
  };

  valueFormatters.formatWithBrackets = formatWithBrackets;
  /**
   * @global
   */

  return valueFormatters;
}, true);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlZhbHVlRm9ybWF0dGVyLnRzIl0sIm5hbWVzIjpbImZvcm1hdFdpdGhCcmFja2V0cyIsImZpcnN0UGFydCIsInNlY29uZFBhcnQiLCJfX2Z1bmN0aW9uTmFtZSIsInZhbHVlRm9ybWF0dGVycyIsInNOYW1lIiwiaGFzT3duUHJvcGVydHkiLCJvQXJncyIsImFwcGx5Il0sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFNQSxrQkFBa0IsR0FBRyxVQUFTQyxTQUFULEVBQTZCQyxVQUE3QixFQUEwRDtBQUNwRixRQUFJQSxVQUFKLEVBQWdCO0FBQ2YsYUFBT0QsU0FBUyxHQUFHQSxTQUFTLEdBQUcsSUFBWixHQUFtQkMsVUFBbkIsR0FBZ0MsR0FBbkMsR0FBeUNBLFVBQXpEO0FBQ0EsS0FGRCxNQUVPO0FBQ04sYUFBT0QsU0FBUyxHQUFHQSxTQUFILEdBQWUsRUFBL0I7QUFDQTtBQUNELEdBTkQ7O0FBT0FELEVBQUFBLGtCQUFrQixDQUFDRyxjQUFuQixHQUFvQywwREFBcEM7QUFFQTs7Ozs7Ozs7O0FBUUEsTUFBTUMsZUFBZSxHQUFHLFVBQXVCQyxLQUF2QixFQUE0RDtBQUNuRixRQUFJRCxlQUFlLENBQUNFLGNBQWhCLENBQStCRCxLQUEvQixDQUFKLEVBQTJDO0FBQUEsd0NBRHFCRSxLQUNyQjtBQURxQkEsUUFBQUEsS0FDckI7QUFBQTs7QUFDMUMsYUFBUUgsZUFBRCxDQUF5QkMsS0FBekIsRUFBZ0NHLEtBQWhDLENBQXNDLElBQXRDLEVBQTRDRCxLQUE1QyxDQUFQO0FBQ0EsS0FGRCxNQUVPO0FBQ04sYUFBTyxFQUFQO0FBQ0E7QUFDRCxHQU5EOztBQVFBSCxFQUFBQSxlQUFlLENBQUNKLGtCQUFoQixHQUFxQ0Esa0JBQXJDO0FBRUE7Ozs7U0FHZUksZSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZm9ybWF0V2l0aEJyYWNrZXRzID0gZnVuY3Rpb24oZmlyc3RQYXJ0Pzogc3RyaW5nLCBzZWNvbmRQYXJ0Pzogc3RyaW5nKTogc3RyaW5nIHtcblx0aWYgKHNlY29uZFBhcnQpIHtcblx0XHRyZXR1cm4gZmlyc3RQYXJ0ID8gZmlyc3RQYXJ0ICsgXCIgKFwiICsgc2Vjb25kUGFydCArIFwiKVwiIDogc2Vjb25kUGFydDtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gZmlyc3RQYXJ0ID8gZmlyc3RQYXJ0IDogXCJcIjtcblx0fVxufTtcbmZvcm1hdFdpdGhCcmFja2V0cy5fX2Z1bmN0aW9uTmFtZSA9IFwic2FwLmZlLmNvcmUuZm9ybWF0dGVycy5WYWx1ZUZvcm1hdHRlciNmb3JtYXRXaXRoQnJhY2tldHNcIjtcblxuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIHRhYmxlIGZvcm1hdHRlcnMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHRoaXMgdGhlIGNvbnRleHRcbiAqIEBwYXJhbSB7c3RyaW5nfSBzTmFtZSB0aGUgaW5uZXIgZnVuY3Rpb24gbmFtZVxuICogQHBhcmFtIHtvYmplY3RbXX0gb0FyZ3MgdGhlIGlubmVyIGZ1bmN0aW9uIHBhcmFtZXRlcnNcbiAqIEByZXR1cm5zIHtvYmplY3R9IHRoZSB2YWx1ZSBmcm9tIHRoZSBpbm5lciBmdW5jdGlvblxuICovXG5jb25zdCB2YWx1ZUZvcm1hdHRlcnMgPSBmdW5jdGlvbih0aGlzOiBvYmplY3QsIHNOYW1lOiBzdHJpbmcsIC4uLm9BcmdzOiBhbnlbXSk6IGFueSB7XG5cdGlmICh2YWx1ZUZvcm1hdHRlcnMuaGFzT3duUHJvcGVydHkoc05hbWUpKSB7XG5cdFx0cmV0dXJuICh2YWx1ZUZvcm1hdHRlcnMgYXMgYW55KVtzTmFtZV0uYXBwbHkodGhpcywgb0FyZ3MpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG59O1xuXG52YWx1ZUZvcm1hdHRlcnMuZm9ybWF0V2l0aEJyYWNrZXRzID0gZm9ybWF0V2l0aEJyYWNrZXRzO1xuXG4vKipcbiAqIEBnbG9iYWxcbiAqL1xuZXhwb3J0IGRlZmF1bHQgdmFsdWVGb3JtYXR0ZXJzO1xuIl19