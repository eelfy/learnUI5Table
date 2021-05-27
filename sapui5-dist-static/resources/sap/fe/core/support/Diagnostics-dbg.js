sap.ui.define([], function () {
  "use strict";

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Diagnostics = /*#__PURE__*/function () {
    function Diagnostics() {
      _classCallCheck(this, Diagnostics);

      this._issues = [];
    }

    _createClass(Diagnostics, [{
      key: "addIssue",
      value: function addIssue(issueCategory, issueSeverity, details, issueCategoryType, subCategory) {
        var checkIfIssueExists = this.checkIfIssueExists(issueCategory, issueSeverity, details, issueCategoryType, subCategory);

        if (!checkIfIssueExists) {
          this._issues.push({
            category: issueCategory,
            severity: issueSeverity,
            details: details,
            subCategory: subCategory
          });
        }
      }
    }, {
      key: "getIssues",
      value: function getIssues() {
        return this._issues;
      }
    }, {
      key: "getIssuesByCategory",
      value: function getIssuesByCategory(inCategory, subCategory) {
        if (subCategory) {
          return this._issues.filter(function (issue) {
            return issue.category === inCategory && issue.subCategory === subCategory;
          });
        } else {
          return this._issues.filter(function (issue) {
            return issue.category === inCategory;
          });
        }
      }
    }, {
      key: "checkIfIssueExists",
      value: function checkIfIssueExists(inCategory, severity, details, issueCategoryType, issueSubCategory) {
        if (issueCategoryType && issueCategoryType[inCategory] && issueSubCategory) {
          return this._issues.some(function (issue) {
            return issue.category === inCategory && issue.severity === severity && issue.details.replace(/\n/g, "") === details.replace(/\n/g, "") && issue.subCategory === issueSubCategory;
          });
        }

        return this._issues.some(function (issue) {
          return issue.category === inCategory && issue.severity === severity && issue.details.replace(/\n/g, "") === details.replace(/\n/g, "");
        });
      }
    }]);

    return Diagnostics;
  }();

  return Diagnostics;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRpYWdub3N0aWNzLnRzIl0sIm5hbWVzIjpbIkRpYWdub3N0aWNzIiwiX2lzc3VlcyIsImlzc3VlQ2F0ZWdvcnkiLCJpc3N1ZVNldmVyaXR5IiwiZGV0YWlscyIsImlzc3VlQ2F0ZWdvcnlUeXBlIiwic3ViQ2F0ZWdvcnkiLCJjaGVja0lmSXNzdWVFeGlzdHMiLCJwdXNoIiwiY2F0ZWdvcnkiLCJzZXZlcml0eSIsImluQ2F0ZWdvcnkiLCJmaWx0ZXIiLCJpc3N1ZSIsImlzc3VlU3ViQ2F0ZWdvcnkiLCJzb21lIiwicmVwbGFjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O01BUU1BLFc7QUFFTCwyQkFBYztBQUFBOztBQUNiLFdBQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0E7Ozs7K0JBRUFDLGEsRUFDQUMsYSxFQUNBQyxPLEVBQ0FDLGlCLEVBQ0FDLFcsRUFDTztBQUNQLFlBQU1DLGtCQUFrQixHQUFHLEtBQUtBLGtCQUFMLENBQXdCTCxhQUF4QixFQUF1Q0MsYUFBdkMsRUFBc0RDLE9BQXRELEVBQStEQyxpQkFBL0QsRUFBa0ZDLFdBQWxGLENBQTNCOztBQUNBLFlBQUksQ0FBQ0Msa0JBQUwsRUFBeUI7QUFDeEIsZUFBS04sT0FBTCxDQUFhTyxJQUFiLENBQWtCO0FBQ2pCQyxZQUFBQSxRQUFRLEVBQUVQLGFBRE87QUFFakJRLFlBQUFBLFFBQVEsRUFBRVAsYUFGTztBQUdqQkMsWUFBQUEsT0FBTyxFQUFFQSxPQUhRO0FBSWpCRSxZQUFBQSxXQUFXLEVBQUVBO0FBSkksV0FBbEI7QUFNQTtBQUNEOzs7a0NBQzhCO0FBQzlCLGVBQU8sS0FBS0wsT0FBWjtBQUNBOzs7MENBQ21CVSxVLEVBQTJCTCxXLEVBQXlDO0FBQ3ZGLFlBQUlBLFdBQUosRUFBaUI7QUFDaEIsaUJBQU8sS0FBS0wsT0FBTCxDQUFhVyxNQUFiLENBQW9CLFVBQUFDLEtBQUs7QUFBQSxtQkFBSUEsS0FBSyxDQUFDSixRQUFOLEtBQW1CRSxVQUFuQixJQUFpQ0UsS0FBSyxDQUFDUCxXQUFOLEtBQXNCQSxXQUEzRDtBQUFBLFdBQXpCLENBQVA7QUFDQSxTQUZELE1BRU87QUFDTixpQkFBTyxLQUFLTCxPQUFMLENBQWFXLE1BQWIsQ0FBb0IsVUFBQUMsS0FBSztBQUFBLG1CQUFJQSxLQUFLLENBQUNKLFFBQU4sS0FBbUJFLFVBQXZCO0FBQUEsV0FBekIsQ0FBUDtBQUNBO0FBQ0Q7Ozt5Q0FFQUEsVSxFQUNBRCxRLEVBQ0FOLE8sRUFDQUMsaUIsRUFDQVMsZ0IsRUFDVTtBQUNWLFlBQUlULGlCQUFpQixJQUFJQSxpQkFBaUIsQ0FBQ00sVUFBRCxDQUF0QyxJQUFzREcsZ0JBQTFELEVBQTRFO0FBQzNFLGlCQUFPLEtBQUtiLE9BQUwsQ0FBYWMsSUFBYixDQUNOLFVBQUFGLEtBQUs7QUFBQSxtQkFDSkEsS0FBSyxDQUFDSixRQUFOLEtBQW1CRSxVQUFuQixJQUNBRSxLQUFLLENBQUNILFFBQU4sS0FBbUJBLFFBRG5CLElBRUFHLEtBQUssQ0FBQ1QsT0FBTixDQUFjWSxPQUFkLENBQXNCLEtBQXRCLEVBQTZCLEVBQTdCLE1BQXFDWixPQUFPLENBQUNZLE9BQVIsQ0FBZ0IsS0FBaEIsRUFBdUIsRUFBdkIsQ0FGckMsSUFHQUgsS0FBSyxDQUFDUCxXQUFOLEtBQXNCUSxnQkFKbEI7QUFBQSxXQURDLENBQVA7QUFPQTs7QUFDRCxlQUFPLEtBQUtiLE9BQUwsQ0FBYWMsSUFBYixDQUNOLFVBQUFGLEtBQUs7QUFBQSxpQkFDSkEsS0FBSyxDQUFDSixRQUFOLEtBQW1CRSxVQUFuQixJQUNBRSxLQUFLLENBQUNILFFBQU4sS0FBbUJBLFFBRG5CLElBRUFHLEtBQUssQ0FBQ1QsT0FBTixDQUFjWSxPQUFkLENBQXNCLEtBQXRCLEVBQTZCLEVBQTdCLE1BQXFDWixPQUFPLENBQUNZLE9BQVIsQ0FBZ0IsS0FBaEIsRUFBdUIsRUFBdkIsQ0FIakM7QUFBQSxTQURDLENBQVA7QUFNQTs7Ozs7O1NBR2FoQixXIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJc3N1ZUNhdGVnb3J5LCBJc3N1ZVNldmVyaXR5IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Jc3N1ZU1hbmFnZXJcIjtcblxuZXhwb3J0IHR5cGUgSXNzdWVEZWZpbml0aW9uID0ge1xuXHRjYXRlZ29yeTogSXNzdWVDYXRlZ29yeTtcblx0c2V2ZXJpdHk6IElzc3VlU2V2ZXJpdHk7XG5cdGRldGFpbHM6IHN0cmluZztcblx0c3ViQ2F0ZWdvcnk/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG59O1xuY2xhc3MgRGlhZ25vc3RpY3Mge1xuXHRfaXNzdWVzOiBJc3N1ZURlZmluaXRpb25bXTtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5faXNzdWVzID0gW107XG5cdH1cblx0YWRkSXNzdWUoXG5cdFx0aXNzdWVDYXRlZ29yeTogSXNzdWVDYXRlZ29yeSxcblx0XHRpc3N1ZVNldmVyaXR5OiBJc3N1ZVNldmVyaXR5LFxuXHRcdGRldGFpbHM6IHN0cmluZyxcblx0XHRpc3N1ZUNhdGVnb3J5VHlwZT86IGFueSB8IHVuZGVmaW5lZCxcblx0XHRzdWJDYXRlZ29yeT86IHN0cmluZyB8IHVuZGVmaW5lZFxuXHQpOiB2b2lkIHtcblx0XHRjb25zdCBjaGVja0lmSXNzdWVFeGlzdHMgPSB0aGlzLmNoZWNrSWZJc3N1ZUV4aXN0cyhpc3N1ZUNhdGVnb3J5LCBpc3N1ZVNldmVyaXR5LCBkZXRhaWxzLCBpc3N1ZUNhdGVnb3J5VHlwZSwgc3ViQ2F0ZWdvcnkpO1xuXHRcdGlmICghY2hlY2tJZklzc3VlRXhpc3RzKSB7XG5cdFx0XHR0aGlzLl9pc3N1ZXMucHVzaCh7XG5cdFx0XHRcdGNhdGVnb3J5OiBpc3N1ZUNhdGVnb3J5LFxuXHRcdFx0XHRzZXZlcml0eTogaXNzdWVTZXZlcml0eSxcblx0XHRcdFx0ZGV0YWlsczogZGV0YWlscyxcblx0XHRcdFx0c3ViQ2F0ZWdvcnk6IHN1YkNhdGVnb3J5XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0Z2V0SXNzdWVzKCk6IElzc3VlRGVmaW5pdGlvbltdIHtcblx0XHRyZXR1cm4gdGhpcy5faXNzdWVzO1xuXHR9XG5cdGdldElzc3Vlc0J5Q2F0ZWdvcnkoaW5DYXRlZ29yeTogSXNzdWVDYXRlZ29yeSwgc3ViQ2F0ZWdvcnk/OiBzdHJpbmcpOiBJc3N1ZURlZmluaXRpb25bXSB7XG5cdFx0aWYgKHN1YkNhdGVnb3J5KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faXNzdWVzLmZpbHRlcihpc3N1ZSA9PiBpc3N1ZS5jYXRlZ29yeSA9PT0gaW5DYXRlZ29yeSAmJiBpc3N1ZS5zdWJDYXRlZ29yeSA9PT0gc3ViQ2F0ZWdvcnkpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faXNzdWVzLmZpbHRlcihpc3N1ZSA9PiBpc3N1ZS5jYXRlZ29yeSA9PT0gaW5DYXRlZ29yeSk7XG5cdFx0fVxuXHR9XG5cdGNoZWNrSWZJc3N1ZUV4aXN0cyhcblx0XHRpbkNhdGVnb3J5OiBJc3N1ZUNhdGVnb3J5LFxuXHRcdHNldmVyaXR5OiBJc3N1ZVNldmVyaXR5LFxuXHRcdGRldGFpbHM6IHN0cmluZyxcblx0XHRpc3N1ZUNhdGVnb3J5VHlwZT86IGFueSxcblx0XHRpc3N1ZVN1YkNhdGVnb3J5Pzogc3RyaW5nXG5cdCk6IGJvb2xlYW4ge1xuXHRcdGlmIChpc3N1ZUNhdGVnb3J5VHlwZSAmJiBpc3N1ZUNhdGVnb3J5VHlwZVtpbkNhdGVnb3J5XSAmJiBpc3N1ZVN1YkNhdGVnb3J5KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faXNzdWVzLnNvbWUoXG5cdFx0XHRcdGlzc3VlID0+XG5cdFx0XHRcdFx0aXNzdWUuY2F0ZWdvcnkgPT09IGluQ2F0ZWdvcnkgJiZcblx0XHRcdFx0XHRpc3N1ZS5zZXZlcml0eSA9PT0gc2V2ZXJpdHkgJiZcblx0XHRcdFx0XHRpc3N1ZS5kZXRhaWxzLnJlcGxhY2UoL1xcbi9nLCBcIlwiKSA9PT0gZGV0YWlscy5yZXBsYWNlKC9cXG4vZywgXCJcIikgJiZcblx0XHRcdFx0XHRpc3N1ZS5zdWJDYXRlZ29yeSA9PT0gaXNzdWVTdWJDYXRlZ29yeVxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2lzc3Vlcy5zb21lKFxuXHRcdFx0aXNzdWUgPT5cblx0XHRcdFx0aXNzdWUuY2F0ZWdvcnkgPT09IGluQ2F0ZWdvcnkgJiZcblx0XHRcdFx0aXNzdWUuc2V2ZXJpdHkgPT09IHNldmVyaXR5ICYmXG5cdFx0XHRcdGlzc3VlLmRldGFpbHMucmVwbGFjZSgvXFxuL2csIFwiXCIpID09PSBkZXRhaWxzLnJlcGxhY2UoL1xcbi9nLCBcIlwiKVxuXHRcdCk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGlhZ25vc3RpY3M7XG4iXX0=