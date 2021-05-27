sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  // This list needs to come from AVT
  var ENUM_VALUES = {
    "com.sap.vocabularies.Common.v1.FieldControlType": {
      "Mandatory": 7,
      "Optional": 3,
      "ReadOnly": 0,
      "Inapplicable": 0,
      "Disabled": 1
    }
  };

  var resolveEnumValue = function (enumName) {
    var _enumName$split = enumName.split("/"),
        _enumName$split2 = _slicedToArray(_enumName$split, 2),
        termName = _enumName$split2[0],
        value = _enumName$split2[1];

    if (ENUM_VALUES.hasOwnProperty(termName)) {
      return ENUM_VALUES[termName][value];
    } else {
      return false;
    }
  };

  _exports.resolveEnumValue = resolveEnumValue;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFubm90YXRpb25FbnVtLnRzIl0sIm5hbWVzIjpbIkVOVU1fVkFMVUVTIiwicmVzb2x2ZUVudW1WYWx1ZSIsImVudW1OYW1lIiwic3BsaXQiLCJ0ZXJtTmFtZSIsInZhbHVlIiwiaGFzT3duUHJvcGVydHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQSxNQUFNQSxXQUFXLEdBQUc7QUFDbkIsdURBQW1EO0FBQ2xELG1CQUFhLENBRHFDO0FBRWxELGtCQUFZLENBRnNDO0FBR2xELGtCQUFZLENBSHNDO0FBSWxELHNCQUFnQixDQUprQztBQUtsRCxrQkFBWTtBQUxzQztBQURoQyxHQUFwQjs7QUFTTyxNQUFNQyxnQkFBZ0IsR0FBRyxVQUFTQyxRQUFULEVBQTJCO0FBQUEsMEJBQ2hDQSxRQUFRLENBQUNDLEtBQVQsQ0FBZSxHQUFmLENBRGdDO0FBQUE7QUFBQSxRQUNuREMsUUFEbUQ7QUFBQSxRQUN6Q0MsS0FEeUM7O0FBRTFELFFBQUlMLFdBQVcsQ0FBQ00sY0FBWixDQUEyQkYsUUFBM0IsQ0FBSixFQUEwQztBQUN6QyxhQUFRSixXQUFELENBQXFCSSxRQUFyQixFQUErQkMsS0FBL0IsQ0FBUDtBQUNBLEtBRkQsTUFFTztBQUNOLGFBQU8sS0FBUDtBQUNBO0FBQ0QsR0FQTSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBsaXN0IG5lZWRzIHRvIGNvbWUgZnJvbSBBVlRcbmNvbnN0IEVOVU1fVkFMVUVTID0ge1xuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5GaWVsZENvbnRyb2xUeXBlXCI6IHtcblx0XHRcIk1hbmRhdG9yeVwiOiA3LFxuXHRcdFwiT3B0aW9uYWxcIjogMyxcblx0XHRcIlJlYWRPbmx5XCI6IDAsXG5cdFx0XCJJbmFwcGxpY2FibGVcIjogMCxcblx0XHRcIkRpc2FibGVkXCI6IDFcblx0fVxufTtcbmV4cG9ydCBjb25zdCByZXNvbHZlRW51bVZhbHVlID0gZnVuY3Rpb24oZW51bU5hbWU6IHN0cmluZykge1xuXHRjb25zdCBbdGVybU5hbWUsIHZhbHVlXSA9IGVudW1OYW1lLnNwbGl0KFwiL1wiKTtcblx0aWYgKEVOVU1fVkFMVUVTLmhhc093blByb3BlcnR5KHRlcm1OYW1lKSkge1xuXHRcdHJldHVybiAoRU5VTV9WQUxVRVMgYXMgYW55KVt0ZXJtTmFtZV1bdmFsdWVdO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufTtcbiJdfQ==