sap.ui.define(["sap/fe/core/formatters/TableFormatterTypes"], function (TableFormatterTypes) {
  "use strict";

  var MessageType = TableFormatterTypes.MessageType;

  var rowHighlighting = function (criticalityValue) {
    var criticalityProperty;

    if (typeof criticalityValue === "string") {
      return criticalityValue;
    }

    switch (criticalityValue) {
      case 1:
        criticalityProperty = MessageType.Error;
        break;

      case 2:
        criticalityProperty = MessageType.Warning;
        break;

      case 3:
        criticalityProperty = MessageType.Success;
        break;

      case 5:
        criticalityProperty = MessageType.Information;
        break;

      default:
        criticalityProperty = MessageType.None;
    }

    return criticalityProperty;
  };

  rowHighlighting.__functionName = "sap.fe.core.formatters.TableFormatter#rowHighlighting";

  var navigatedRow = function (sDeepestPath) {
    if (this.getBindingContext() && sDeepestPath) {
      return sDeepestPath.indexOf(this.getBindingContext().getPath()) === 0;
    } else {
      return false;
    }
  };

  navigatedRow.__functionName = "sap.fe.core.formatters.TableFormatter#navigatedRow"; // See https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters for more detail on this weird syntax

  /**
   * Collection of table formatters.
   *
   * @param {object} this the context
   * @param {string} sName the inner function name
   * @param {object[]} oArgs the inner function parameters
   * @returns {object} the value from the inner function
   */

  var tableFormatters = function (sName) {
    if (tableFormatters.hasOwnProperty(sName)) {
      for (var _len = arguments.length, oArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        oArgs[_key - 1] = arguments[_key];
      }

      return tableFormatters[sName].apply(this, oArgs);
    } else {
      return "";
    }
  };

  tableFormatters.rowHighlighting = rowHighlighting;
  tableFormatters.navigatedRow = navigatedRow;
  /**
   * @global
   */

  return tableFormatters;
}, true);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRhYmxlRm9ybWF0dGVyLnRzIl0sIm5hbWVzIjpbInJvd0hpZ2hsaWdodGluZyIsImNyaXRpY2FsaXR5VmFsdWUiLCJjcml0aWNhbGl0eVByb3BlcnR5IiwiTWVzc2FnZVR5cGUiLCJFcnJvciIsIldhcm5pbmciLCJTdWNjZXNzIiwiSW5mb3JtYXRpb24iLCJOb25lIiwiX19mdW5jdGlvbk5hbWUiLCJuYXZpZ2F0ZWRSb3ciLCJzRGVlcGVzdFBhdGgiLCJnZXRCaW5kaW5nQ29udGV4dCIsImluZGV4T2YiLCJnZXRQYXRoIiwidGFibGVGb3JtYXR0ZXJzIiwic05hbWUiLCJoYXNPd25Qcm9wZXJ0eSIsIm9BcmdzIiwiYXBwbHkiXSwibWFwcGluZ3MiOiI7Ozs7O0FBR0EsTUFBTUEsZUFBZSxHQUFHLFVBQVNDLGdCQUFULEVBQXlEO0FBQ2hGLFFBQUlDLG1CQUFKOztBQUNBLFFBQUksT0FBT0QsZ0JBQVAsS0FBNEIsUUFBaEMsRUFBMEM7QUFDekMsYUFBUUEsZ0JBQVI7QUFDQTs7QUFDRCxZQUFRQSxnQkFBUjtBQUNDLFdBQUssQ0FBTDtBQUNDQyxRQUFBQSxtQkFBbUIsR0FBR0MsV0FBVyxDQUFDQyxLQUFsQztBQUNBOztBQUNELFdBQUssQ0FBTDtBQUNDRixRQUFBQSxtQkFBbUIsR0FBR0MsV0FBVyxDQUFDRSxPQUFsQztBQUNBOztBQUNELFdBQUssQ0FBTDtBQUNDSCxRQUFBQSxtQkFBbUIsR0FBR0MsV0FBVyxDQUFDRyxPQUFsQztBQUNBOztBQUNELFdBQUssQ0FBTDtBQUNDSixRQUFBQSxtQkFBbUIsR0FBR0MsV0FBVyxDQUFDSSxXQUFsQztBQUNBOztBQUNEO0FBQ0NMLFFBQUFBLG1CQUFtQixHQUFHQyxXQUFXLENBQUNLLElBQWxDO0FBZEY7O0FBZ0JBLFdBQU9OLG1CQUFQO0FBQ0EsR0F0QkQ7O0FBdUJBRixFQUFBQSxlQUFlLENBQUNTLGNBQWhCLEdBQWlDLHVEQUFqQzs7QUFFQSxNQUFNQyxZQUFZLEdBQUcsVUFBOEJDLFlBQTlCLEVBQW9EO0FBQ3hFLFFBQUksS0FBS0MsaUJBQUwsTUFBNEJELFlBQWhDLEVBQThDO0FBQzdDLGFBQU9BLFlBQVksQ0FBQ0UsT0FBYixDQUFxQixLQUFLRCxpQkFBTCxHQUF5QkUsT0FBekIsRUFBckIsTUFBNkQsQ0FBcEU7QUFDQSxLQUZELE1BRU87QUFDTixhQUFPLEtBQVA7QUFDQTtBQUNELEdBTkQ7O0FBT0FKLEVBQUFBLFlBQVksQ0FBQ0QsY0FBYixHQUE4QixvREFBOUIsQyxDQUVBOztBQUNBOzs7Ozs7Ozs7QUFRQSxNQUFNTSxlQUFlLEdBQUcsVUFBdUJDLEtBQXZCLEVBQTREO0FBQ25GLFFBQUlELGVBQWUsQ0FBQ0UsY0FBaEIsQ0FBK0JELEtBQS9CLENBQUosRUFBMkM7QUFBQSx3Q0FEcUJFLEtBQ3JCO0FBRHFCQSxRQUFBQSxLQUNyQjtBQUFBOztBQUMxQyxhQUFRSCxlQUFELENBQXlCQyxLQUF6QixFQUFnQ0csS0FBaEMsQ0FBc0MsSUFBdEMsRUFBNENELEtBQTVDLENBQVA7QUFDQSxLQUZELE1BRU87QUFDTixhQUFPLEVBQVA7QUFDQTtBQUNELEdBTkQ7O0FBUUFILEVBQUFBLGVBQWUsQ0FBQ2YsZUFBaEIsR0FBa0NBLGVBQWxDO0FBQ0FlLEVBQUFBLGVBQWUsQ0FBQ0wsWUFBaEIsR0FBK0JBLFlBQS9CO0FBQ0E7Ozs7U0FHZUssZSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWFuYWdlZE9iamVjdCB9IGZyb20gXCJzYXAvdWkvYmFzZVwiO1xuaW1wb3J0IHsgTWVzc2FnZVR5cGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvZm9ybWF0dGVycy9UYWJsZUZvcm1hdHRlclR5cGVzXCI7XG5cbmNvbnN0IHJvd0hpZ2hsaWdodGluZyA9IGZ1bmN0aW9uKGNyaXRpY2FsaXR5VmFsdWU6IHN0cmluZyB8IG51bWJlcik6IE1lc3NhZ2VUeXBlIHtcblx0bGV0IGNyaXRpY2FsaXR5UHJvcGVydHk7XG5cdGlmICh0eXBlb2YgY3JpdGljYWxpdHlWYWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybiAoY3JpdGljYWxpdHlWYWx1ZSBhcyB1bmtub3duKSBhcyBNZXNzYWdlVHlwZTtcblx0fVxuXHRzd2l0Y2ggKGNyaXRpY2FsaXR5VmFsdWUpIHtcblx0XHRjYXNlIDE6XG5cdFx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gTWVzc2FnZVR5cGUuRXJyb3I7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIDI6XG5cdFx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gTWVzc2FnZVR5cGUuV2FybmluZztcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgMzpcblx0XHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5TdWNjZXNzO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSA1OlxuXHRcdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLkluZm9ybWF0aW9uO1xuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5Ob25lO1xuXHR9XG5cdHJldHVybiBjcml0aWNhbGl0eVByb3BlcnR5O1xufTtcbnJvd0hpZ2hsaWdodGluZy5fX2Z1bmN0aW9uTmFtZSA9IFwic2FwLmZlLmNvcmUuZm9ybWF0dGVycy5UYWJsZUZvcm1hdHRlciNyb3dIaWdobGlnaHRpbmdcIjtcblxuY29uc3QgbmF2aWdhdGVkUm93ID0gZnVuY3Rpb24odGhpczogTWFuYWdlZE9iamVjdCwgc0RlZXBlc3RQYXRoOiBzdHJpbmcpIHtcblx0aWYgKHRoaXMuZ2V0QmluZGluZ0NvbnRleHQoKSAmJiBzRGVlcGVzdFBhdGgpIHtcblx0XHRyZXR1cm4gc0RlZXBlc3RQYXRoLmluZGV4T2YodGhpcy5nZXRCaW5kaW5nQ29udGV4dCgpLmdldFBhdGgoKSkgPT09IDA7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59O1xubmF2aWdhdGVkUm93Ll9fZnVuY3Rpb25OYW1lID0gXCJzYXAuZmUuY29yZS5mb3JtYXR0ZXJzLlRhYmxlRm9ybWF0dGVyI25hdmlnYXRlZFJvd1wiO1xuXG4vLyBTZWUgaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svZnVuY3Rpb25zLmh0bWwjdGhpcy1wYXJhbWV0ZXJzIGZvciBtb3JlIGRldGFpbCBvbiB0aGlzIHdlaXJkIHN5bnRheFxuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIHRhYmxlIGZvcm1hdHRlcnMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHRoaXMgdGhlIGNvbnRleHRcbiAqIEBwYXJhbSB7c3RyaW5nfSBzTmFtZSB0aGUgaW5uZXIgZnVuY3Rpb24gbmFtZVxuICogQHBhcmFtIHtvYmplY3RbXX0gb0FyZ3MgdGhlIGlubmVyIGZ1bmN0aW9uIHBhcmFtZXRlcnNcbiAqIEByZXR1cm5zIHtvYmplY3R9IHRoZSB2YWx1ZSBmcm9tIHRoZSBpbm5lciBmdW5jdGlvblxuICovXG5jb25zdCB0YWJsZUZvcm1hdHRlcnMgPSBmdW5jdGlvbih0aGlzOiBvYmplY3QsIHNOYW1lOiBzdHJpbmcsIC4uLm9BcmdzOiBhbnlbXSk6IGFueSB7XG5cdGlmICh0YWJsZUZvcm1hdHRlcnMuaGFzT3duUHJvcGVydHkoc05hbWUpKSB7XG5cdFx0cmV0dXJuICh0YWJsZUZvcm1hdHRlcnMgYXMgYW55KVtzTmFtZV0uYXBwbHkodGhpcywgb0FyZ3MpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG59O1xuXG50YWJsZUZvcm1hdHRlcnMucm93SGlnaGxpZ2h0aW5nID0gcm93SGlnaGxpZ2h0aW5nO1xudGFibGVGb3JtYXR0ZXJzLm5hdmlnYXRlZFJvdyA9IG5hdmlnYXRlZFJvdztcbi8qKlxuICogQGdsb2JhbFxuICovXG5leHBvcnQgZGVmYXVsdCB0YWJsZUZvcm1hdHRlcnM7XG4iXX0=