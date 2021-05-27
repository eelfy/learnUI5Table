sap.ui.define(["../../helpers/StableIdHelper"], function (StableIdHelper) {
  "use strict";

  var _exports = {};
  var getStableIdPartFromDataField = StableIdHelper.getStableIdPartFromDataField;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * The KeyHelper is used for dealing with Key in the concern of the flexible programming model
   */
  var KeyHelper = /*#__PURE__*/function () {
    function KeyHelper() {
      _classCallCheck(this, KeyHelper);
    }

    _exports.KeyHelper = KeyHelper;

    _createClass(KeyHelper, null, [{
      key: "generateKeyFromDataField",

      /**
       * Returns a generated key for DataFields to be used in the flexible programming model.
       *
       * @param {DataFieldAbstractTypes} oDataField dataField to generate the key for
       * @returns {string} Returns a through StableIdHelper generated key
       */
      value: function generateKeyFromDataField(oDataField) {
        return getStableIdPartFromDataField(oDataField);
      }
      /**
       * Throws a Error if any other character then aA-zZ, 0-9, ':', '_' or '-' is used.
       *
       * @param {string} key string to check validity on
       */

    }, {
      key: "validateKey",
      value: function validateKey(key) {
        var pattern = /[^A-Za-z0-9_\-:]/;

        if (pattern.exec(key)) {
          throw new Error("Invalid key: " + key + " - only 'A-Za-z0-9_-:' are allowed");
        }
      }
      /**
       * Returns the key for a selection field required for adaption.
       *
       * @param fullPropertyPath the full property path (without entityType)
       * @returns {string} the key of the selection field
       */

    }, {
      key: "getSelectionFieldKeyFromPath",
      value: function getSelectionFieldKeyFromPath(fullPropertyPath) {
        return fullPropertyPath.replace(/(\*|\+)?\//g, "::");
      }
      /**
       * Returns the path for a selection field required for adaption.
       *
       * @param selectionFieldKey the key of the selection field
       * @returns {string} the full property path
       */

    }, {
      key: "getPathFromSelectionFieldKey",
      value: function getPathFromSelectionFieldKey(selectionFieldKey) {
        return selectionFieldKey.replace(/::\//g, "/");
      }
    }]);

    return KeyHelper;
  }();

  _exports.KeyHelper = KeyHelper;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIktleS50cyJdLCJuYW1lcyI6WyJLZXlIZWxwZXIiLCJvRGF0YUZpZWxkIiwiZ2V0U3RhYmxlSWRQYXJ0RnJvbURhdGFGaWVsZCIsImtleSIsInBhdHRlcm4iLCJleGVjIiwiRXJyb3IiLCJmdWxsUHJvcGVydHlQYXRoIiwicmVwbGFjZSIsInNlbGVjdGlvbkZpZWxkS2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFHQTs7O01BR2FBLFM7Ozs7Ozs7Ozs7QUFDWjs7Ozs7OytDQU1nQ0MsVSxFQUE0QztBQUMzRSxlQUFPQyw0QkFBNEIsQ0FBQ0QsVUFBRCxDQUFuQztBQUNBO0FBRUQ7Ozs7Ozs7O2tDQUttQkUsRyxFQUFhO0FBQy9CLFlBQU1DLE9BQU8sR0FBRyxrQkFBaEI7O0FBQ0EsWUFBSUEsT0FBTyxDQUFDQyxJQUFSLENBQWFGLEdBQWIsQ0FBSixFQUF1QjtBQUN0QixnQkFBTSxJQUFJRyxLQUFKLENBQVUsa0JBQWtCSCxHQUFsQixHQUF3QixvQ0FBbEMsQ0FBTjtBQUNBO0FBQ0Q7QUFFRDs7Ozs7Ozs7O21EQU1vQ0ksZ0IsRUFBMEI7QUFDN0QsZUFBT0EsZ0JBQWdCLENBQUNDLE9BQWpCLENBQXlCLGFBQXpCLEVBQXdDLElBQXhDLENBQVA7QUFDQTtBQUVEOzs7Ozs7Ozs7bURBTW9DQyxpQixFQUEyQjtBQUM5RCxlQUFPQSxpQkFBaUIsQ0FBQ0QsT0FBbEIsQ0FBMEIsT0FBMUIsRUFBbUMsR0FBbkMsQ0FBUDtBQUNBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEYXRhRmllbGRBYnN0cmFjdFR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgeyBnZXRTdGFibGVJZFBhcnRGcm9tRGF0YUZpZWxkIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvU3RhYmxlSWRIZWxwZXJcIjtcblxuLyoqXG4gKiBUaGUgS2V5SGVscGVyIGlzIHVzZWQgZm9yIGRlYWxpbmcgd2l0aCBLZXkgaW4gdGhlIGNvbmNlcm4gb2YgdGhlIGZsZXhpYmxlIHByb2dyYW1taW5nIG1vZGVsXG4gKi9cbmV4cG9ydCBjbGFzcyBLZXlIZWxwZXIge1xuXHQvKipcblx0ICogUmV0dXJucyBhIGdlbmVyYXRlZCBrZXkgZm9yIERhdGFGaWVsZHMgdG8gYmUgdXNlZCBpbiB0aGUgZmxleGlibGUgcHJvZ3JhbW1pbmcgbW9kZWwuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RGF0YUZpZWxkQWJzdHJhY3RUeXBlc30gb0RhdGFGaWVsZCBkYXRhRmllbGQgdG8gZ2VuZXJhdGUgdGhlIGtleSBmb3Jcblx0ICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyBhIHRocm91Z2ggU3RhYmxlSWRIZWxwZXIgZ2VuZXJhdGVkIGtleVxuXHQgKi9cblx0c3RhdGljIGdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChvRGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gZ2V0U3RhYmxlSWRQYXJ0RnJvbURhdGFGaWVsZChvRGF0YUZpZWxkKSE7XG5cdH1cblxuXHQvKipcblx0ICogVGhyb3dzIGEgRXJyb3IgaWYgYW55IG90aGVyIGNoYXJhY3RlciB0aGVuIGFBLXpaLCAwLTksICc6JywgJ18nIG9yICctJyBpcyB1c2VkLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30ga2V5IHN0cmluZyB0byBjaGVjayB2YWxpZGl0eSBvblxuXHQgKi9cblx0c3RhdGljIHZhbGlkYXRlS2V5KGtleTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgcGF0dGVybiA9IC9bXkEtWmEtejAtOV9cXC06XS87XG5cdFx0aWYgKHBhdHRlcm4uZXhlYyhrZXkpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGtleTogXCIgKyBrZXkgKyBcIiAtIG9ubHkgJ0EtWmEtejAtOV8tOicgYXJlIGFsbG93ZWRcIik7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGtleSBmb3IgYSBzZWxlY3Rpb24gZmllbGQgcmVxdWlyZWQgZm9yIGFkYXB0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0gZnVsbFByb3BlcnR5UGF0aCB0aGUgZnVsbCBwcm9wZXJ0eSBwYXRoICh3aXRob3V0IGVudGl0eVR5cGUpXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBrZXkgb2YgdGhlIHNlbGVjdGlvbiBmaWVsZFxuXHQgKi9cblx0c3RhdGljIGdldFNlbGVjdGlvbkZpZWxkS2V5RnJvbVBhdGgoZnVsbFByb3BlcnR5UGF0aDogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIGZ1bGxQcm9wZXJ0eVBhdGgucmVwbGFjZSgvKFxcKnxcXCspP1xcLy9nLCBcIjo6XCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHBhdGggZm9yIGEgc2VsZWN0aW9uIGZpZWxkIHJlcXVpcmVkIGZvciBhZGFwdGlvbi5cblx0ICpcblx0ICogQHBhcmFtIHNlbGVjdGlvbkZpZWxkS2V5IHRoZSBrZXkgb2YgdGhlIHNlbGVjdGlvbiBmaWVsZFxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZnVsbCBwcm9wZXJ0eSBwYXRoXG5cdCAqL1xuXHRzdGF0aWMgZ2V0UGF0aEZyb21TZWxlY3Rpb25GaWVsZEtleShzZWxlY3Rpb25GaWVsZEtleTogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHNlbGVjdGlvbkZpZWxkS2V5LnJlcGxhY2UoLzo6XFwvL2csIFwiL1wiKTtcblx0fVxufVxuIl19