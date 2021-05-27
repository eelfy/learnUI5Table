sap.ui.define(["sap/fe/core/type/Email"], function (EmailType) {
  "use strict";

  describe("Email type", function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    var emailType = new EmailType();
    it("can validate correct emails", function () {
      try {
        emailType.validateValue("me@sap.com");
        emailType.validateValue("me@sap");
        emailType.validateValue("me-and.friends@sap");
      } catch (e) {
        expect(e).toBeNull();
      }
    });
    it("will throw a validate exception otherwise", function () {
      expect(function () {
        return emailType.validateValue("me@sap.");
      }).toThrow();
      expect(function () {
        return emailType.validateValue("me");
      }).toThrow();
      expect(function () {
        return emailType.validateValue("me@you@.com");
      }).toThrow();
    });
  });
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVtYWlsLnNwZWMudHMiXSwibmFtZXMiOlsiZGVzY3JpYmUiLCJlbWFpbFR5cGUiLCJFbWFpbFR5cGUiLCJpdCIsInZhbGlkYXRlVmFsdWUiLCJlIiwiZXhwZWN0IiwidG9CZU51bGwiLCJ0b1Rocm93Il0sIm1hcHBpbmdzIjoiOzs7QUFFQUEsRUFBQUEsUUFBUSxDQUFDLFlBQUQsRUFBZSxZQUFXO0FBQ2pDO0FBQ0E7QUFDQSxRQUFNQyxTQUFTLEdBQUcsSUFBSUMsU0FBSixFQUFsQjtBQUNBQyxJQUFBQSxFQUFFLENBQUMsNkJBQUQsRUFBZ0MsWUFBTTtBQUN2QyxVQUFJO0FBQ0hGLFFBQUFBLFNBQVMsQ0FBQ0csYUFBVixDQUF3QixZQUF4QjtBQUNBSCxRQUFBQSxTQUFTLENBQUNHLGFBQVYsQ0FBd0IsUUFBeEI7QUFDQUgsUUFBQUEsU0FBUyxDQUFDRyxhQUFWLENBQXdCLG9CQUF4QjtBQUNBLE9BSkQsQ0FJRSxPQUFPQyxDQUFQLEVBQVU7QUFDWEMsUUFBQUEsTUFBTSxDQUFDRCxDQUFELENBQU4sQ0FBVUUsUUFBVjtBQUNBO0FBQ0QsS0FSQyxDQUFGO0FBU0FKLElBQUFBLEVBQUUsQ0FBQywyQ0FBRCxFQUE4QyxZQUFNO0FBQ3JERyxNQUFBQSxNQUFNLENBQUM7QUFBQSxlQUFNTCxTQUFTLENBQUNHLGFBQVYsQ0FBd0IsU0FBeEIsQ0FBTjtBQUFBLE9BQUQsQ0FBTixDQUFpREksT0FBakQ7QUFDQUYsTUFBQUEsTUFBTSxDQUFDO0FBQUEsZUFBTUwsU0FBUyxDQUFDRyxhQUFWLENBQXdCLElBQXhCLENBQU47QUFBQSxPQUFELENBQU4sQ0FBNENJLE9BQTVDO0FBQ0FGLE1BQUFBLE1BQU0sQ0FBQztBQUFBLGVBQU1MLFNBQVMsQ0FBQ0csYUFBVixDQUF3QixhQUF4QixDQUFOO0FBQUEsT0FBRCxDQUFOLENBQXFESSxPQUFyRDtBQUNBLEtBSkMsQ0FBRjtBQUtBLEdBbEJPLENBQVIiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFbWFpbFR5cGUgZnJvbSBcInNhcC9mZS9jb3JlL3R5cGUvRW1haWxcIjtcblxuZGVzY3JpYmUoXCJFbWFpbCB0eXBlXCIsIGZ1bmN0aW9uKCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG5cdC8vIEB0cy1pZ25vcmVcblx0Y29uc3QgZW1haWxUeXBlID0gbmV3IEVtYWlsVHlwZSgpO1xuXHRpdChcImNhbiB2YWxpZGF0ZSBjb3JyZWN0IGVtYWlsc1wiLCAoKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGVtYWlsVHlwZS52YWxpZGF0ZVZhbHVlKFwibWVAc2FwLmNvbVwiKTtcblx0XHRcdGVtYWlsVHlwZS52YWxpZGF0ZVZhbHVlKFwibWVAc2FwXCIpO1xuXHRcdFx0ZW1haWxUeXBlLnZhbGlkYXRlVmFsdWUoXCJtZS1hbmQuZnJpZW5kc0BzYXBcIik7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0ZXhwZWN0KGUpLnRvQmVOdWxsKCk7XG5cdFx0fVxuXHR9KTtcblx0aXQoXCJ3aWxsIHRocm93IGEgdmFsaWRhdGUgZXhjZXB0aW9uIG90aGVyd2lzZVwiLCAoKSA9PiB7XG5cdFx0ZXhwZWN0KCgpID0+IGVtYWlsVHlwZS52YWxpZGF0ZVZhbHVlKFwibWVAc2FwLlwiKSkudG9UaHJvdygpO1xuXHRcdGV4cGVjdCgoKSA9PiBlbWFpbFR5cGUudmFsaWRhdGVWYWx1ZShcIm1lXCIpKS50b1Rocm93KCk7XG5cdFx0ZXhwZWN0KCgpID0+IGVtYWlsVHlwZS52YWxpZGF0ZVZhbHVlKFwibWVAeW91QC5jb21cIikpLnRvVGhyb3coKTtcblx0fSk7XG59KTtcbiJdfQ==