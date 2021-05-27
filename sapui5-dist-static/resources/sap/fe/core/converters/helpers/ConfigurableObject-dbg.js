sap.ui.define([], function () {
  "use strict";

  var _exports = {};
  var Placement;

  (function (Placement) {
    Placement["After"] = "After";
    Placement["Before"] = "Before";
    Placement["End"] = "End";
  })(Placement || (Placement = {}));

  _exports.Placement = Placement;

  /**
   * Recursive method that order the keys based on a position information.
   *
   * @param positioningItems
   * @param anchor
   * @param sorted
   * @param visited
   * @returns {number} the order of the current item
   */
  var orderPositioningItemRecursively = function (positioningItems, anchor, sorted, visited) {
    var insertIndex = sorted.indexOf(anchor);

    if (insertIndex !== -1) {
      return insertIndex;
    }

    var anchorItem = positioningItems[anchor];

    if (anchorItem === undefined) {
      //return sorted.length;
      throw new Error("position anchor not found: " + anchor);
    }

    visited[anchor] = anchorItem;

    if (anchorItem && !(anchorItem.anchor in visited)) {
      insertIndex = orderPositioningItemRecursively(positioningItems, anchorItem.anchor, sorted, visited);

      if (anchorItem.placement !== Placement.Before) {
        ++insertIndex;
      }
    } else {
      insertIndex = sorted.length;
    }

    sorted.splice(insertIndex, 0, anchor);
    return insertIndex;
  };

  function isArrayConfig(config) {
    return typeof config === "object";
  }

  function applyOverride(overwritableKeys, sourceItem, customElement) {
    var outItem = sourceItem || customElement;

    for (var overwritableKey in overwritableKeys) {
      if (Object.hasOwnProperty.call(overwritableKeys, overwritableKey)) {
        var overrideConfig = overwritableKeys[overwritableKey];

        if (sourceItem !== null) {
          switch (overrideConfig) {
            case "overwrite":
              if (customElement.hasOwnProperty(overwritableKey) && customElement[overwritableKey] !== undefined) {
                sourceItem[overwritableKey] = customElement[overwritableKey];
              }

              break;

            case "merge":
            default:
              var subItem = sourceItem[overwritableKey] || [];
              var subConfig = {};

              if (isArrayConfig(overrideConfig)) {
                subConfig = overrideConfig;
              }

              if (Array.isArray(subItem)) {
                sourceItem[overwritableKey] = insertCustomElements(subItem, customElement && customElement[overwritableKey] || {}, subConfig);
              }

              break;
          }
        } else {
          switch (overrideConfig) {
            case "overwrite":
              if (customElement.hasOwnProperty(overwritableKey) && customElement[overwritableKey] !== undefined) {
                outItem[overwritableKey] = customElement[overwritableKey];
              }

              break;

            case "merge":
            default:
              var _subConfig = {};

              if (isArrayConfig(overrideConfig)) {
                _subConfig = overrideConfig;
              }

              outItem[overwritableKey] = insertCustomElements([], customElement && customElement[overwritableKey] || {}, _subConfig);
              break;
          }
        }
      }
    }

    return outItem;
  }
  /**
   * Insert a set of custom elements in the right position in an original collection.
   *
   * @template T
   * @param rootElements a list of "ConfigurableObject" which means object that have a unique "key"
   * @param customElements an object containing extra object to add, they are indexed by a key and have a "position" object
   * @param overwritableKeys the list of keys from the original object that can be overwritten in case a custom element has the same "key"
   * @returns {T[]} an ordered array of elements including the custom ones
   */


  function insertCustomElements(rootElements, customElements) {
    var overwritableKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var firstAnchor = rootElements.length ? rootElements[0].key : null;
    var rootElementsWithoutLast = rootElements.filter(function (rootElement) {
      var _rootElement$position;

      return ((_rootElement$position = rootElement.position) === null || _rootElement$position === void 0 ? void 0 : _rootElement$position.placement) !== Placement.End;
    });
    var lastAnchor = rootElements.length ? rootElements[rootElementsWithoutLast.length - 1].key : null;
    var endElement;
    var positioningItems = {};
    var itemsPerKey = {};
    rootElements.forEach(function (rootElement) {
      var _rootElement$position2;

      if (((_rootElement$position2 = rootElement.position) === null || _rootElement$position2 === void 0 ? void 0 : _rootElement$position2.placement) === Placement.End && !endElement) {
        endElement = rootElement;
      } else {
        var _rootElement$position3, _rootElement$position4;

        positioningItems[rootElement.key] = {
          anchor: ((_rootElement$position3 = rootElement.position) === null || _rootElement$position3 === void 0 ? void 0 : _rootElement$position3.anchor) || rootElement.key,
          placement: ((_rootElement$position4 = rootElement.position) === null || _rootElement$position4 === void 0 ? void 0 : _rootElement$position4.placement) || Placement.After
        };
      }

      itemsPerKey[rootElement.key] = rootElement;
    });
    Object.keys(customElements).forEach(function (customElementKey) {
      var _customElement$menu;

      var customElement = customElements[customElementKey];
      var anchor = customElement.position.anchor; // If no placement defined we are After

      if (!customElement.position.placement) {
        customElement.position.placement = Placement.After;
      } // If no anchor we're either After the last anchor or Before the first


      if (!anchor) {
        var potentialAnchor = customElement.position.placement === Placement.After ? lastAnchor : firstAnchor;
        customElement.position.anchor = potentialAnchor ? potentialAnchor : customElementKey;
      } // Adding bound/unbound actions to menu


      customElement.menu = customElement === null || customElement === void 0 ? void 0 : (_customElement$menu = customElement.menu) === null || _customElement$menu === void 0 ? void 0 : _customElement$menu.map(function (menu) {
        var _itemsPerKey$menu$key;

        return (_itemsPerKey$menu$key = itemsPerKey[menu.key]) !== null && _itemsPerKey$menu$key !== void 0 ? _itemsPerKey$menu$key : menu;
      });

      if (itemsPerKey[customElement.key]) {
        itemsPerKey[customElement.key] = applyOverride(overwritableKeys, itemsPerKey[customElement.key], customElement);
      } else {
        itemsPerKey[customElement.key] = applyOverride(overwritableKeys, null, customElement);
        positioningItems[customElement.key] = customElement.position;
      }
    });
    var sortedKeys = [];
    Object.keys(positioningItems).forEach(function (positionItemKey) {
      orderPositioningItemRecursively(positioningItems, positionItemKey, sortedKeys, {});
    });
    var outElements = sortedKeys.map(function (key) {
      return itemsPerKey[key];
    });

    if (endElement) {
      outElements.push(endElement);
    }

    return outElements;
  }

  _exports.insertCustomElements = insertCustomElements;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbmZpZ3VyYWJsZU9iamVjdC50cyJdLCJuYW1lcyI6WyJQbGFjZW1lbnQiLCJvcmRlclBvc2l0aW9uaW5nSXRlbVJlY3Vyc2l2ZWx5IiwicG9zaXRpb25pbmdJdGVtcyIsImFuY2hvciIsInNvcnRlZCIsInZpc2l0ZWQiLCJpbnNlcnRJbmRleCIsImluZGV4T2YiLCJhbmNob3JJdGVtIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJwbGFjZW1lbnQiLCJCZWZvcmUiLCJsZW5ndGgiLCJzcGxpY2UiLCJpc0FycmF5Q29uZmlnIiwiY29uZmlnIiwiYXBwbHlPdmVycmlkZSIsIm92ZXJ3cml0YWJsZUtleXMiLCJzb3VyY2VJdGVtIiwiY3VzdG9tRWxlbWVudCIsIm91dEl0ZW0iLCJvdmVyd3JpdGFibGVLZXkiLCJPYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJvdmVycmlkZUNvbmZpZyIsInN1Ykl0ZW0iLCJzdWJDb25maWciLCJBcnJheSIsImlzQXJyYXkiLCJpbnNlcnRDdXN0b21FbGVtZW50cyIsInJvb3RFbGVtZW50cyIsImN1c3RvbUVsZW1lbnRzIiwiZmlyc3RBbmNob3IiLCJrZXkiLCJyb290RWxlbWVudHNXaXRob3V0TGFzdCIsImZpbHRlciIsInJvb3RFbGVtZW50IiwicG9zaXRpb24iLCJFbmQiLCJsYXN0QW5jaG9yIiwiZW5kRWxlbWVudCIsIml0ZW1zUGVyS2V5IiwiZm9yRWFjaCIsIkFmdGVyIiwia2V5cyIsImN1c3RvbUVsZW1lbnRLZXkiLCJwb3RlbnRpYWxBbmNob3IiLCJtZW51IiwibWFwIiwic29ydGVkS2V5cyIsInBvc2l0aW9uSXRlbUtleSIsIm91dEVsZW1lbnRzIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7OztNQUtZQSxTOzthQUFBQSxTO0FBQUFBLElBQUFBLFM7QUFBQUEsSUFBQUEsUztBQUFBQSxJQUFBQSxTO0tBQUFBLFMsS0FBQUEsUzs7OztBQXFCWjs7Ozs7Ozs7O0FBU0EsTUFBTUMsK0JBQStCLEdBQUcsVUFDdkND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LE1BQU0sQ0FBQ3VCLElBQVAsQ0FBWTVDLGdCQUFaLEVBQThCMEMsT0FBOUIsQ0FBc0MsVUFBQVEsZUFBZSxFQUFJO0FBQ3hEbkQsTUFBQUEsK0JBQStCLENBQUNDLGdCQUFELEVBQW1Ca0QsZUFBbkIsRUFBb0NELFVBQXBDLEVBQWdELEVBQWhELENBQS9CO0FBQ0EsS0FGRDtBQUlBLFFBQU1FLFdBQVcsR0FBR0YsVUFBVSxDQUFDRCxHQUFYLENBQWUsVUFBQWYsR0FBRztBQUFBLGFBQUlRLFdBQVcsQ0FBQ1IsR0FBRCxDQUFmO0FBQUEsS0FBbEIsQ0FBcEI7O0FBQ0EsUUFBSU8sVUFBSixFQUFnQjtBQUNmVyxNQUFBQSxXQUFXLENBQUNDLElBQVosQ0FBaUJaLFVBQWpCO0FBQ0E7O0FBQ0QsV0FBT1csV0FBUDtBQUNBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdHlwZSBQb3NpdGlvbiA9IHtcblx0YW5jaG9yPzogc3RyaW5nO1xuXHRwbGFjZW1lbnQ6IFBsYWNlbWVudDtcbn07XG5cbmV4cG9ydCBlbnVtIFBsYWNlbWVudCB7XG5cdEFmdGVyID0gXCJBZnRlclwiLFxuXHRCZWZvcmUgPSBcIkJlZm9yZVwiLFxuXHRFbmQgPSBcIkVuZFwiXG59XG5leHBvcnQgdHlwZSBDb25maWd1cmFibGVPYmplY3RLZXkgPSBzdHJpbmc7XG5leHBvcnQgdHlwZSBDb25maWd1cmFibGVPYmplY3QgPSBQb3NpdGlvbmFibGUgJiB7XG5cdGtleTogQ29uZmlndXJhYmxlT2JqZWN0S2V5O1xufTtcblxuZXhwb3J0IHR5cGUgQ3VzdG9tRWxlbWVudDxUIGV4dGVuZHMgQ29uZmlndXJhYmxlT2JqZWN0PiA9IFQgJiB7XG5cdHBvc2l0aW9uOiBQb3NpdGlvbjtcblx0bWVudT86IGFueVtdIHwgdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IHR5cGUgUG9zaXRpb25hYmxlID0ge1xuXHRwb3NpdGlvbj86IFBvc2l0aW9uO1xufTtcblxuZXhwb3J0IHR5cGUgQ29uZmlndXJhYmxlUmVjb3JkPFQ+ID0gUmVjb3JkPENvbmZpZ3VyYWJsZU9iamVjdEtleSwgVD47XG5cbi8qKlxuICogUmVjdXJzaXZlIG1ldGhvZCB0aGF0IG9yZGVyIHRoZSBrZXlzIGJhc2VkIG9uIGEgcG9zaXRpb24gaW5mb3JtYXRpb24uXG4gKlxuICogQHBhcmFtIHBvc2l0aW9uaW5nSXRlbXNcbiAqIEBwYXJhbSBhbmNob3JcbiAqIEBwYXJhbSBzb3J0ZWRcbiAqIEBwYXJhbSB2aXNpdGVkXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgb3JkZXIgb2YgdGhlIGN1cnJlbnQgaXRlbVxuICovXG5jb25zdCBvcmRlclBvc2l0aW9uaW5nSXRlbVJlY3Vyc2l2ZWx5ID0gKFxuXHRwb3NpdGlvbmluZ0l0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBSZXF1aXJlZDxQb3NpdGlvbj4+LFxuXHRhbmNob3I6IHN0cmluZyxcblx0c29ydGVkOiBzdHJpbmdbXSxcblx0dmlzaXRlZDogUmVjb3JkPHN0cmluZywgUmVxdWlyZWQ8UG9zaXRpb24+PlxuKTogbnVtYmVyID0+IHtcblx0bGV0IGluc2VydEluZGV4ID0gc29ydGVkLmluZGV4T2YoYW5jaG9yKTtcblx0aWYgKGluc2VydEluZGV4ICE9PSAtMSkge1xuXHRcdHJldHVybiBpbnNlcnRJbmRleDtcblx0fVxuXHRjb25zdCBhbmNob3JJdGVtOiBSZXF1aXJlZDxQb3NpdGlvbj4gPSBwb3NpdGlvbmluZ0l0ZW1zW2FuY2hvcl07XG5cdGlmIChhbmNob3JJdGVtID09PSB1bmRlZmluZWQpIHtcblx0XHQvL3JldHVybiBzb3J0ZWQubGVuZ3RoO1xuXHRcdHRocm93IG5ldyBFcnJvcihcInBvc2l0aW9uIGFuY2hvciBub3QgZm91bmQ6IFwiICsgYW5jaG9yKTtcblx0fVxuXG5cdHZpc2l0ZWRbYW5jaG9yXSA9IGFuY2hvckl0ZW07XG5cdGlmIChhbmNob3JJdGVtICYmICEoYW5jaG9ySXRlbS5hbmNob3IgaW4gdmlzaXRlZCkpIHtcblx0XHRpbnNlcnRJbmRleCA9IG9yZGVyUG9zaXRpb25pbmdJdGVtUmVjdXJzaXZlbHkocG9zaXRpb25pbmdJdGVtcywgYW5jaG9ySXRlbS5hbmNob3IsIHNvcnRlZCwgdmlzaXRlZCk7XG5cdFx0aWYgKGFuY2hvckl0ZW0ucGxhY2VtZW50ICE9PSBQbGFjZW1lbnQuQmVmb3JlKSB7XG5cdFx0XHQrK2luc2VydEluZGV4O1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRpbnNlcnRJbmRleCA9IHNvcnRlZC5sZW5ndGg7XG5cdH1cblxuXHRzb3J0ZWQuc3BsaWNlKGluc2VydEluZGV4LCAwLCBhbmNob3IpO1xuXHRyZXR1cm4gaW5zZXJ0SW5kZXg7XG59O1xuXG50eXBlIE92ZXJyaWRlVHlwZSA9IFwibWVyZ2VcIiB8IFwib3ZlcndyaXRlXCIgfCBcImlnbm9yZVwiO1xudHlwZSBBcnJheU92ZXJyaWRlVHlwZTxBcnJheVR5cGU+ID0gT3ZlcnJpZGVLZXlzPEFycmF5VHlwZT47XG5cbnR5cGUgRWxlbWVudFR5cGU8VD4gPSBUIGV4dGVuZHMgYW55W10gPyBUW251bWJlcl0gOiBUO1xudHlwZSBPdmVycmlkZUtleXM8VD4gPSB7XG5cdFtQIGluIGtleW9mIFRdPzogT3ZlcnJpZGVUeXBlIHwgQXJyYXlPdmVycmlkZVR5cGU8RWxlbWVudFR5cGU8VFtQXT4+O1xufTtcblxuZnVuY3Rpb24gaXNBcnJheUNvbmZpZzxUPihjb25maWc6IE92ZXJyaWRlVHlwZSB8IEFycmF5T3ZlcnJpZGVUeXBlPFQ+IHwgdW5kZWZpbmVkKTogY29uZmlnIGlzIEFycmF5T3ZlcnJpZGVUeXBlPFQ+IHtcblx0cmV0dXJuIHR5cGVvZiBjb25maWcgPT09IFwib2JqZWN0XCI7XG59XG5cbmZ1bmN0aW9uIGFwcGx5T3ZlcnJpZGU8VCBleHRlbmRzIE9iamVjdD4ob3ZlcndyaXRhYmxlS2V5czogT3ZlcnJpZGVLZXlzPFQ+LCBzb3VyY2VJdGVtOiBUIHwgbnVsbCwgY3VzdG9tRWxlbWVudDogVCk6IFQge1xuXHRjb25zdCBvdXRJdGVtOiBUID0gc291cmNlSXRlbSB8fCBjdXN0b21FbGVtZW50O1xuXHRmb3IgKGNvbnN0IG92ZXJ3cml0YWJsZUtleSBpbiBvdmVyd3JpdGFibGVLZXlzKSB7XG5cdFx0aWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG92ZXJ3cml0YWJsZUtleXMsIG92ZXJ3cml0YWJsZUtleSkpIHtcblx0XHRcdGNvbnN0IG92ZXJyaWRlQ29uZmlnID0gb3ZlcndyaXRhYmxlS2V5c1tvdmVyd3JpdGFibGVLZXldO1xuXHRcdFx0aWYgKHNvdXJjZUl0ZW0gIT09IG51bGwpIHtcblx0XHRcdFx0c3dpdGNoIChvdmVycmlkZUNvbmZpZykge1xuXHRcdFx0XHRcdGNhc2UgXCJvdmVyd3JpdGVcIjpcblx0XHRcdFx0XHRcdGlmIChjdXN0b21FbGVtZW50Lmhhc093blByb3BlcnR5KG92ZXJ3cml0YWJsZUtleSkgJiYgY3VzdG9tRWxlbWVudFtvdmVyd3JpdGFibGVLZXldICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0c291cmNlSXRlbVtvdmVyd3JpdGFibGVLZXldID0gY3VzdG9tRWxlbWVudFtvdmVyd3JpdGFibGVLZXldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIm1lcmdlXCI6XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdGNvbnN0IHN1Ykl0ZW0gPSBzb3VyY2VJdGVtW292ZXJ3cml0YWJsZUtleV0gfHwgKFtdIGFzIGFueVtdKTtcblx0XHRcdFx0XHRcdGxldCBzdWJDb25maWcgPSB7fTtcblx0XHRcdFx0XHRcdGlmIChpc0FycmF5Q29uZmlnKG92ZXJyaWRlQ29uZmlnKSkge1xuXHRcdFx0XHRcdFx0XHRzdWJDb25maWcgPSBvdmVycmlkZUNvbmZpZztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHN1Ykl0ZW0pKSB7XG5cdFx0XHRcdFx0XHRcdHNvdXJjZUl0ZW1bb3ZlcndyaXRhYmxlS2V5XSA9IGluc2VydEN1c3RvbUVsZW1lbnRzKFxuXHRcdFx0XHRcdFx0XHRcdHN1Ykl0ZW0sXG5cdFx0XHRcdFx0XHRcdFx0KGN1c3RvbUVsZW1lbnQgJiYgKGN1c3RvbUVsZW1lbnRbb3ZlcndyaXRhYmxlS2V5XSBhcyBSZWNvcmQ8c3RyaW5nLCBDdXN0b21FbGVtZW50PGFueT4+KSkgfHwge30sXG5cdFx0XHRcdFx0XHRcdFx0c3ViQ29uZmlnXG5cdFx0XHRcdFx0XHRcdCkgYXMgYW55O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHN3aXRjaCAob3ZlcnJpZGVDb25maWcpIHtcblx0XHRcdFx0XHRjYXNlIFwib3ZlcndyaXRlXCI6XG5cdFx0XHRcdFx0XHRpZiAoY3VzdG9tRWxlbWVudC5oYXNPd25Qcm9wZXJ0eShvdmVyd3JpdGFibGVLZXkpICYmIGN1c3RvbUVsZW1lbnRbb3ZlcndyaXRhYmxlS2V5XSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdG91dEl0ZW1bb3ZlcndyaXRhYmxlS2V5XSA9IGN1c3RvbUVsZW1lbnRbb3ZlcndyaXRhYmxlS2V5XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJtZXJnZVwiOlxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRsZXQgc3ViQ29uZmlnID0ge307XG5cdFx0XHRcdFx0XHRpZiAoaXNBcnJheUNvbmZpZyhvdmVycmlkZUNvbmZpZykpIHtcblx0XHRcdFx0XHRcdFx0c3ViQ29uZmlnID0gb3ZlcnJpZGVDb25maWc7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRvdXRJdGVtW292ZXJ3cml0YWJsZUtleV0gPSBpbnNlcnRDdXN0b21FbGVtZW50cyhcblx0XHRcdFx0XHRcdFx0W10gYXMgYW55W10sXG5cdFx0XHRcdFx0XHRcdChjdXN0b21FbGVtZW50ICYmIChjdXN0b21FbGVtZW50W292ZXJ3cml0YWJsZUtleV0gYXMgUmVjb3JkPHN0cmluZywgQ3VzdG9tRWxlbWVudDxhbnk+PikpIHx8IHt9LFxuXHRcdFx0XHRcdFx0XHRzdWJDb25maWdcblx0XHRcdFx0XHRcdCkgYXMgYW55O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIG91dEl0ZW07XG59XG5cbi8qKlxuICogSW5zZXJ0IGEgc2V0IG9mIGN1c3RvbSBlbGVtZW50cyBpbiB0aGUgcmlnaHQgcG9zaXRpb24gaW4gYW4gb3JpZ2luYWwgY29sbGVjdGlvbi5cbiAqXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIHJvb3RFbGVtZW50cyBhIGxpc3Qgb2YgXCJDb25maWd1cmFibGVPYmplY3RcIiB3aGljaCBtZWFucyBvYmplY3QgdGhhdCBoYXZlIGEgdW5pcXVlIFwia2V5XCJcbiAqIEBwYXJhbSBjdXN0b21FbGVtZW50cyBhbiBvYmplY3QgY29udGFpbmluZyBleHRyYSBvYmplY3QgdG8gYWRkLCB0aGV5IGFyZSBpbmRleGVkIGJ5IGEga2V5IGFuZCBoYXZlIGEgXCJwb3NpdGlvblwiIG9iamVjdFxuICogQHBhcmFtIG92ZXJ3cml0YWJsZUtleXMgdGhlIGxpc3Qgb2Yga2V5cyBmcm9tIHRoZSBvcmlnaW5hbCBvYmplY3QgdGhhdCBjYW4gYmUgb3ZlcndyaXR0ZW4gaW4gY2FzZSBhIGN1c3RvbSBlbGVtZW50IGhhcyB0aGUgc2FtZSBcImtleVwiXG4gKiBAcmV0dXJucyB7VFtdfSBhbiBvcmRlcmVkIGFycmF5IG9mIGVsZW1lbnRzIGluY2x1ZGluZyB0aGUgY3VzdG9tIG9uZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc2VydEN1c3RvbUVsZW1lbnRzPFQgZXh0ZW5kcyBDb25maWd1cmFibGVPYmplY3Q+KFxuXHRyb290RWxlbWVudHM6IFRbXSxcblx0Y3VzdG9tRWxlbWVudHM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUVsZW1lbnQ8VD4+LFxuXHRvdmVyd3JpdGFibGVLZXlzOiBPdmVycmlkZUtleXM8VD4gPSB7fVxuKTogVFtdIHtcblx0Y29uc3QgZmlyc3RBbmNob3IgPSByb290RWxlbWVudHMubGVuZ3RoID8gcm9vdEVsZW1lbnRzWzBdLmtleSA6IG51bGw7XG5cdGNvbnN0IHJvb3RFbGVtZW50c1dpdGhvdXRMYXN0ID0gcm9vdEVsZW1lbnRzLmZpbHRlcihyb290RWxlbWVudCA9PiB7XG5cdFx0cmV0dXJuIHJvb3RFbGVtZW50LnBvc2l0aW9uPy5wbGFjZW1lbnQgIT09IFBsYWNlbWVudC5FbmQ7XG5cdH0pO1xuXHRjb25zdCBsYXN0QW5jaG9yID0gcm9vdEVsZW1lbnRzLmxlbmd0aCA/IHJvb3RFbGVtZW50c1tyb290RWxlbWVudHNXaXRob3V0TGFzdC5sZW5ndGggLSAxXS5rZXkgOiBudWxsO1xuXHRsZXQgZW5kRWxlbWVudDogVCB8IHVuZGVmaW5lZDtcblx0Y29uc3QgcG9zaXRpb25pbmdJdGVtczogUmVjb3JkPHN0cmluZywgUmVxdWlyZWQ8UG9zaXRpb24+PiA9IHt9O1xuXHRjb25zdCBpdGVtc1BlcktleTogUmVjb3JkPHN0cmluZywgVD4gPSB7fTtcblx0cm9vdEVsZW1lbnRzLmZvckVhY2gocm9vdEVsZW1lbnQgPT4ge1xuXHRcdGlmIChyb290RWxlbWVudC5wb3NpdGlvbj8ucGxhY2VtZW50ID09PSBQbGFjZW1lbnQuRW5kICYmICFlbmRFbGVtZW50KSB7XG5cdFx0XHRlbmRFbGVtZW50ID0gcm9vdEVsZW1lbnQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBvc2l0aW9uaW5nSXRlbXNbcm9vdEVsZW1lbnQua2V5XSA9IHtcblx0XHRcdFx0YW5jaG9yOiByb290RWxlbWVudC5wb3NpdGlvbj8uYW5jaG9yIHx8IHJvb3RFbGVtZW50LmtleSxcblx0XHRcdFx0cGxhY2VtZW50OiByb290RWxlbWVudC5wb3NpdGlvbj8ucGxhY2VtZW50IHx8IFBsYWNlbWVudC5BZnRlclxuXHRcdFx0fTtcblx0XHR9XG5cdFx0aXRlbXNQZXJLZXlbcm9vdEVsZW1lbnQua2V5XSA9IHJvb3RFbGVtZW50O1xuXHR9KTtcblx0T2JqZWN0LmtleXMoY3VzdG9tRWxlbWVudHMpLmZvckVhY2goY3VzdG9tRWxlbWVudEtleSA9PiB7XG5cdFx0Y29uc3QgY3VzdG9tRWxlbWVudCA9IGN1c3RvbUVsZW1lbnRzW2N1c3RvbUVsZW1lbnRLZXldO1xuXHRcdGNvbnN0IGFuY2hvciA9IGN1c3RvbUVsZW1lbnQucG9zaXRpb24uYW5jaG9yO1xuXHRcdC8vIElmIG5vIHBsYWNlbWVudCBkZWZpbmVkIHdlIGFyZSBBZnRlclxuXHRcdGlmICghY3VzdG9tRWxlbWVudC5wb3NpdGlvbi5wbGFjZW1lbnQpIHtcblx0XHRcdGN1c3RvbUVsZW1lbnQucG9zaXRpb24ucGxhY2VtZW50ID0gUGxhY2VtZW50LkFmdGVyO1xuXHRcdH1cblx0XHQvLyBJZiBubyBhbmNob3Igd2UncmUgZWl0aGVyIEFmdGVyIHRoZSBsYXN0IGFuY2hvciBvciBCZWZvcmUgdGhlIGZpcnN0XG5cdFx0aWYgKCFhbmNob3IpIHtcblx0XHRcdGNvbnN0IHBvdGVudGlhbEFuY2hvciA9IGN1c3RvbUVsZW1lbnQucG9zaXRpb24ucGxhY2VtZW50ID09PSBQbGFjZW1lbnQuQWZ0ZXIgPyBsYXN0QW5jaG9yIDogZmlyc3RBbmNob3I7XG5cdFx0XHRjdXN0b21FbGVtZW50LnBvc2l0aW9uLmFuY2hvciA9IHBvdGVudGlhbEFuY2hvciA/IHBvdGVudGlhbEFuY2hvciA6IGN1c3RvbUVsZW1lbnRLZXk7XG5cdFx0fVxuXG5cdFx0Ly8gQWRkaW5nIGJvdW5kL3VuYm91bmQgYWN0aW9ucyB0byBtZW51XG5cdFx0Y3VzdG9tRWxlbWVudC5tZW51ID0gY3VzdG9tRWxlbWVudD8ubWVudT8ubWFwKG1lbnUgPT4ge1xuXHRcdFx0cmV0dXJuIGl0ZW1zUGVyS2V5W21lbnUua2V5XSA/PyBtZW51O1xuXHRcdH0pO1xuXG5cdFx0aWYgKGl0ZW1zUGVyS2V5W2N1c3RvbUVsZW1lbnQua2V5XSkge1xuXHRcdFx0aXRlbXNQZXJLZXlbY3VzdG9tRWxlbWVudC5rZXldID0gYXBwbHlPdmVycmlkZShvdmVyd3JpdGFibGVLZXlzLCBpdGVtc1BlcktleVtjdXN0b21FbGVtZW50LmtleV0sIGN1c3RvbUVsZW1lbnQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpdGVtc1BlcktleVtjdXN0b21FbGVtZW50LmtleV0gPSBhcHBseU92ZXJyaWRlKG92ZXJ3cml0YWJsZUtleXMsIG51bGwsIGN1c3RvbUVsZW1lbnQpO1xuXHRcdFx0cG9zaXRpb25pbmdJdGVtc1tjdXN0b21FbGVtZW50LmtleV0gPSBjdXN0b21FbGVtZW50LnBvc2l0aW9uIGFzIFJlcXVpcmVkPFBvc2l0aW9uPjtcblx0XHR9XG5cdH0pO1xuXHRjb25zdCBzb3J0ZWRLZXlzOiBzdHJpbmdbXSA9IFtdO1xuXG5cdE9iamVjdC5rZXlzKHBvc2l0aW9uaW5nSXRlbXMpLmZvckVhY2gocG9zaXRpb25JdGVtS2V5ID0+IHtcblx0XHRvcmRlclBvc2l0aW9uaW5nSXRlbVJlY3Vyc2l2ZWx5KHBvc2l0aW9uaW5nSXRlbXMsIHBvc2l0aW9uSXRlbUtleSwgc29ydGVkS2V5cywge30pO1xuXHR9KTtcblxuXHRjb25zdCBvdXRFbGVtZW50cyA9IHNvcnRlZEtleXMubWFwKGtleSA9PiBpdGVtc1BlcktleVtrZXldKTtcblx0aWYgKGVuZEVsZW1lbnQpIHtcblx0XHRvdXRFbGVtZW50cy5wdXNoKGVuZEVsZW1lbnQpO1xuXHR9XG5cdHJldHVybiBvdXRFbGVtZW50cztcbn1cbiJdfQ==