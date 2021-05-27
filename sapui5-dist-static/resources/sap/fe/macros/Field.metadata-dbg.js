sap.ui.define(["sap/fe/macros/MacroMetadata", "sap/base/Log", "sap/fe/core/helpers/BindingExpression"], function (MacroMetadata, Log, BindingExpression) {
  "use strict";

  var compileBinding = BindingExpression.compileBinding;
  var resolveBindingString = BindingExpression.resolveBindingString;
  var equal = BindingExpression.equal;
  var ifElse = BindingExpression.ifElse;

  /*!
   * ${copyright}
   */

  /**
   * @classdesc
   * Content of a field
   *
   * @class sap.fe.macros.Field
   * @hideconstructor
   * @private
   * @ui5-restricted
   * @experimental
   */
  var Field = MacroMetadata.extend("sap.fe.macros.Field", {
    /**
     * Name
     */
    name: "Field",

    /**
     * Namespace
     */
    namespace: "sap.fe.macros",

    /**
     * Fragment source
     */
    fragment: "sap.fe.macros.Field",

    /**
     * Metadata
     */
    metadata: {
      /**
       * Define macro stereotype for documentation purpose
       */
      stereotype: "xmlmacro",

      /**
       * Properties.
       */
      properties: {
        /**
         * Meta Path to the field
         * Could be either an absolute path or relative to the context path
         */
        metaPath: {
          type: "sap.ui.model.Context",
          required: true
        },

        /**
         * Context path of the field
         */
        contextPath: {
          type: "sap.ui.model.Context",
          required: true
        },

        /**
         * Field ID
         */
        id: {
          type: "string",
          required: true
        },

        /**
         * Edit Mode
         */
        editable: {
          type: "boolean",
          deprecated: true,
          required: false
        },

        /**
         * Read Only
         */
        readOnly: {
          type: "boolean",
          required: false
        }
      },
      events: {
        /**
         * Event handler for change event TODO: we need to wrap this, just PoC version
         */
        change: {
          type: "function"
        }
      }
    },
    create: function (oProps) {
      if (oProps.editable !== undefined) {
        // Deprecated message
        Log.error("`editable` property has been deprecated in favor of `readOnly`");
        oProps.editModeExpression = compileBinding(ifElse(equal(resolveBindingString(oProps.editable, "boolean"), true), "Editable", "Display"));
      } else {
        oProps.editModeExpression = undefined;
      }

      if (oProps.readOnly !== undefined) {
        oProps.editModeExpression = compileBinding(ifElse(equal(resolveBindingString(oProps.readOnly, "boolean"), true), "Display", "Editable"));
      } else {
        oProps.editModeExpression = undefined;
      }

      return oProps;
    }
  });
  return Field;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpZWxkLm1ldGFkYXRhLnRzIl0sIm5hbWVzIjpbIkZpZWxkIiwiTWFjcm9NZXRhZGF0YSIsImV4dGVuZCIsIm5hbWUiLCJuYW1lc3BhY2UiLCJmcmFnbWVudCIsIm1ldGFkYXRhIiwic3RlcmVvdHlwZSIsInByb3BlcnRpZXMiLCJtZXRhUGF0aCIsInR5cGUiLCJyZXF1aXJlZCIsImNvbnRleHRQYXRoIiwiaWQiLCJlZGl0YWJsZSIsImRlcHJlY2F0ZWQiLCJyZWFkT25seSIsImV2ZW50cyIsImNoYW5nZSIsImNyZWF0ZSIsIm9Qcm9wcyIsInVuZGVmaW5lZCIsIkxvZyIsImVycm9yIiwiZWRpdE1vZGVFeHByZXNzaW9uIiwiY29tcGlsZUJpbmRpbmciLCJpZkVsc2UiLCJlcXVhbCIsInJlc29sdmVCaW5kaW5nU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBUUE7Ozs7Ozs7Ozs7QUFVQSxNQUFNQSxLQUFLLEdBQUdDLGFBQWEsQ0FBQ0MsTUFBZCxDQUFxQixxQkFBckIsRUFBNEM7QUFDekQ7OztBQUdBQyxJQUFBQSxJQUFJLEVBQUUsT0FKbUQ7O0FBS3pEOzs7QUFHQUMsSUFBQUEsU0FBUyxFQUFFLGVBUjhDOztBQVN6RDs7O0FBR0FDLElBQUFBLFFBQVEsRUFBRSxxQkFaK0M7O0FBY3pEOzs7QUFHQUMsSUFBQUEsUUFBUSxFQUFFO0FBQ1Q7OztBQUdBQyxNQUFBQSxVQUFVLEVBQUUsVUFKSDs7QUFLVDs7O0FBR0FDLE1BQUFBLFVBQVUsRUFBRTtBQUNYOzs7O0FBSUFDLFFBQUFBLFFBQVEsRUFBRTtBQUNUQyxVQUFBQSxJQUFJLEVBQUUsc0JBREc7QUFFVEMsVUFBQUEsUUFBUSxFQUFFO0FBRkQsU0FMQzs7QUFTWDs7O0FBR0FDLFFBQUFBLFdBQVcsRUFBRTtBQUNaRixVQUFBQSxJQUFJLEVBQUUsc0JBRE07QUFFWkMsVUFBQUEsUUFBUSxFQUFFO0FBRkUsU0FaRjs7QUFnQlg7OztBQUdBRSxRQUFBQSxFQUFFLEVBQUU7QUFDSEgsVUFBQUEsSUFBSSxFQUFFLFFBREg7QUFFSEMsVUFBQUEsUUFBUSxFQUFFO0FBRlAsU0FuQk87O0FBdUJYOzs7QUFHQUcsUUFBQUEsUUFBUSxFQUFFO0FBQ1RKLFVBQUFBLElBQUksRUFBRSxTQURHO0FBRVRLLFVBQUFBLFVBQVUsRUFBRSxJQUZIO0FBR1RKLFVBQUFBLFFBQVEsRUFBRTtBQUhELFNBMUJDOztBQStCWDs7O0FBR0FLLFFBQUFBLFFBQVEsRUFBRTtBQUNUTixVQUFBQSxJQUFJLEVBQUUsU0FERztBQUVUQyxVQUFBQSxRQUFRLEVBQUU7QUFGRDtBQWxDQyxPQVJIO0FBK0NUTSxNQUFBQSxNQUFNLEVBQUU7QUFDUDs7O0FBR0FDLFFBQUFBLE1BQU0sRUFBRTtBQUNQUixVQUFBQSxJQUFJLEVBQUU7QUFEQztBQUpEO0FBL0NDLEtBakIrQztBQXlFekRTLElBQUFBLE1BQU0sRUFBRSxVQUFTQyxNQUFULEVBQXNCO0FBQzdCLFVBQUlBLE1BQU0sQ0FBQ04sUUFBUCxLQUFvQk8sU0FBeEIsRUFBbUM7QUFDbEM7QUFDQUMsUUFBQUEsR0FBRyxDQUFDQyxLQUFKLENBQVUsZ0VBQVY7QUFDQUgsUUFBQUEsTUFBTSxDQUFDSSxrQkFBUCxHQUE0QkMsY0FBYyxDQUN6Q0MsTUFBTSxDQUFDQyxLQUFLLENBQUNDLG9CQUFvQixDQUFDUixNQUFNLENBQUNOLFFBQVIsRUFBa0IsU0FBbEIsQ0FBckIsRUFBbUQsSUFBbkQsQ0FBTixFQUFnRSxVQUFoRSxFQUE0RSxTQUE1RSxDQURtQyxDQUExQztBQUdBLE9BTkQsTUFNTztBQUNOTSxRQUFBQSxNQUFNLENBQUNJLGtCQUFQLEdBQTRCSCxTQUE1QjtBQUNBOztBQUNELFVBQUlELE1BQU0sQ0FBQ0osUUFBUCxLQUFvQkssU0FBeEIsRUFBbUM7QUFDbENELFFBQUFBLE1BQU0sQ0FBQ0ksa0JBQVAsR0FBNEJDLGNBQWMsQ0FDekNDLE1BQU0sQ0FBQ0MsS0FBSyxDQUFDQyxvQkFBb0IsQ0FBQ1IsTUFBTSxDQUFDSixRQUFSLEVBQWtCLFNBQWxCLENBQXJCLEVBQW1ELElBQW5ELENBQU4sRUFBZ0UsU0FBaEUsRUFBMkUsVUFBM0UsQ0FEbUMsQ0FBMUM7QUFHQSxPQUpELE1BSU87QUFDTkksUUFBQUEsTUFBTSxDQUFDSSxrQkFBUCxHQUE0QkgsU0FBNUI7QUFDQTs7QUFFRCxhQUFPRCxNQUFQO0FBQ0E7QUE1RndELEdBQTVDLENBQWQ7U0ErRmVwQixLIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqICR7Y29weXJpZ2h0fVxuICovXG5cbmltcG9ydCB7IE1hY3JvTWV0YWRhdGEgfSBmcm9tIFwic2FwL2ZlL21hY3Jvc1wiO1xuaW1wb3J0IHsgTG9nIH0gZnJvbSBcInNhcC9iYXNlXCI7XG5pbXBvcnQgeyBpZkVsc2UsIGVxdWFsLCByZXNvbHZlQmluZGluZ1N0cmluZywgY29tcGlsZUJpbmRpbmcgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuXG4vKipcbiAqIEBjbGFzc2Rlc2NcbiAqIENvbnRlbnQgb2YgYSBmaWVsZFxuICpcbiAqIEBjbGFzcyBzYXAuZmUubWFjcm9zLkZpZWxkXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKiBAcHJpdmF0ZVxuICogQHVpNS1yZXN0cmljdGVkXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmNvbnN0IEZpZWxkID0gTWFjcm9NZXRhZGF0YS5leHRlbmQoXCJzYXAuZmUubWFjcm9zLkZpZWxkXCIsIHtcblx0LyoqXG5cdCAqIE5hbWVcblx0ICovXG5cdG5hbWU6IFwiRmllbGRcIixcblx0LyoqXG5cdCAqIE5hbWVzcGFjZVxuXHQgKi9cblx0bmFtZXNwYWNlOiBcInNhcC5mZS5tYWNyb3NcIixcblx0LyoqXG5cdCAqIEZyYWdtZW50IHNvdXJjZVxuXHQgKi9cblx0ZnJhZ21lbnQ6IFwic2FwLmZlLm1hY3Jvcy5GaWVsZFwiLFxuXG5cdC8qKlxuXHQgKiBNZXRhZGF0YVxuXHQgKi9cblx0bWV0YWRhdGE6IHtcblx0XHQvKipcblx0XHQgKiBEZWZpbmUgbWFjcm8gc3RlcmVvdHlwZSBmb3IgZG9jdW1lbnRhdGlvbiBwdXJwb3NlXG5cdFx0ICovXG5cdFx0c3RlcmVvdHlwZTogXCJ4bWxtYWNyb1wiLFxuXHRcdC8qKlxuXHRcdCAqIFByb3BlcnRpZXMuXG5cdFx0ICovXG5cdFx0cHJvcGVydGllczoge1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBNZXRhIFBhdGggdG8gdGhlIGZpZWxkXG5cdFx0XHQgKiBDb3VsZCBiZSBlaXRoZXIgYW4gYWJzb2x1dGUgcGF0aCBvciByZWxhdGl2ZSB0byB0aGUgY29udGV4dCBwYXRoXG5cdFx0XHQgKi9cblx0XHRcdG1ldGFQYXRoOiB7XG5cdFx0XHRcdHR5cGU6IFwic2FwLnVpLm1vZGVsLkNvbnRleHRcIixcblx0XHRcdFx0cmVxdWlyZWQ6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIENvbnRleHQgcGF0aCBvZiB0aGUgZmllbGRcblx0XHRcdCAqL1xuXHRcdFx0Y29udGV4dFBhdGg6IHtcblx0XHRcdFx0dHlwZTogXCJzYXAudWkubW9kZWwuQ29udGV4dFwiLFxuXHRcdFx0XHRyZXF1aXJlZDogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogRmllbGQgSURcblx0XHRcdCAqL1xuXHRcdFx0aWQ6IHtcblx0XHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdFx0cmVxdWlyZWQ6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIEVkaXQgTW9kZVxuXHRcdFx0ICovXG5cdFx0XHRlZGl0YWJsZToge1xuXHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0ZGVwcmVjYXRlZDogdHJ1ZSxcblx0XHRcdFx0cmVxdWlyZWQ6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBSZWFkIE9ubHlcblx0XHRcdCAqL1xuXHRcdFx0cmVhZE9ubHk6IHtcblx0XHRcdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0XHRcdHJlcXVpcmVkOiBmYWxzZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZXZlbnRzOiB7XG5cdFx0XHQvKipcblx0XHRcdCAqIEV2ZW50IGhhbmRsZXIgZm9yIGNoYW5nZSBldmVudCBUT0RPOiB3ZSBuZWVkIHRvIHdyYXAgdGhpcywganVzdCBQb0MgdmVyc2lvblxuXHRcdFx0ICovXG5cdFx0XHRjaGFuZ2U6IHtcblx0XHRcdFx0dHlwZTogXCJmdW5jdGlvblwiXG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRjcmVhdGU6IGZ1bmN0aW9uKG9Qcm9wczogYW55KSB7XG5cdFx0aWYgKG9Qcm9wcy5lZGl0YWJsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyBEZXByZWNhdGVkIG1lc3NhZ2Vcblx0XHRcdExvZy5lcnJvcihcImBlZGl0YWJsZWAgcHJvcGVydHkgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiBgcmVhZE9ubHlgXCIpO1xuXHRcdFx0b1Byb3BzLmVkaXRNb2RlRXhwcmVzc2lvbiA9IGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRpZkVsc2UoZXF1YWwocmVzb2x2ZUJpbmRpbmdTdHJpbmcob1Byb3BzLmVkaXRhYmxlLCBcImJvb2xlYW5cIiksIHRydWUpLCBcIkVkaXRhYmxlXCIsIFwiRGlzcGxheVwiKVxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b1Byb3BzLmVkaXRNb2RlRXhwcmVzc2lvbiA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0aWYgKG9Qcm9wcy5yZWFkT25seSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRvUHJvcHMuZWRpdE1vZGVFeHByZXNzaW9uID0gY29tcGlsZUJpbmRpbmcoXG5cdFx0XHRcdGlmRWxzZShlcXVhbChyZXNvbHZlQmluZGluZ1N0cmluZyhvUHJvcHMucmVhZE9ubHksIFwiYm9vbGVhblwiKSwgdHJ1ZSksIFwiRGlzcGxheVwiLCBcIkVkaXRhYmxlXCIpXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvUHJvcHMuZWRpdE1vZGVFeHByZXNzaW9uID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHJldHVybiBvUHJvcHM7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBGaWVsZDtcbiJdfQ==