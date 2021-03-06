sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  var getPath = function (oContext, oInterface) {
    if (oInterface && oInterface.context) {
      return oInterface.context.getPath();
    }

    return "";
  };

  getPath.requiresIContext = true;
  _exports.getPath = getPath;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1hY3JvVGVtcGxhdGluZy50cyJdLCJuYW1lcyI6WyJnZXRQYXRoIiwib0NvbnRleHQiLCJvSW50ZXJmYWNlIiwiY29udGV4dCIsInJlcXVpcmVzSUNvbnRleHQiXSwibWFwcGluZ3MiOiI7Ozs7O0FBRU8sTUFBTUEsT0FBTyxHQUFHLFVBQVNDLFFBQVQsRUFBcUNDLFVBQXJDLEVBQXNGO0FBQzVHLFFBQUlBLFVBQVUsSUFBSUEsVUFBVSxDQUFDQyxPQUE3QixFQUFzQztBQUNyQyxhQUFPRCxVQUFVLENBQUNDLE9BQVgsQ0FBbUJILE9BQW5CLEVBQVA7QUFDQTs7QUFDRCxXQUFPLEVBQVA7QUFDQSxHQUxNOztBQU1QQSxFQUFBQSxPQUFPLENBQUNJLGdCQUFSLEdBQTJCLElBQTNCIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wdXRlZEFubm90YXRpb25JbnRlcmZhY2UsIE1ldGFNb2RlbENvbnRleHQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9VSUZvcm1hdHRlcnNcIjtcblxuZXhwb3J0IGNvbnN0IGdldFBhdGggPSBmdW5jdGlvbihvQ29udGV4dDogTWV0YU1vZGVsQ29udGV4dCwgb0ludGVyZmFjZTogQ29tcHV0ZWRBbm5vdGF0aW9uSW50ZXJmYWNlKTogc3RyaW5nIHtcblx0aWYgKG9JbnRlcmZhY2UgJiYgb0ludGVyZmFjZS5jb250ZXh0KSB7XG5cdFx0cmV0dXJuIG9JbnRlcmZhY2UuY29udGV4dC5nZXRQYXRoKCk7XG5cdH1cblx0cmV0dXJuIFwiXCI7XG59O1xuZ2V0UGF0aC5yZXF1aXJlc0lDb250ZXh0ID0gdHJ1ZTtcbiJdfQ==