sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  /**
   * Template Type
   */
  var TemplateType;

  (function (TemplateType) {
    TemplateType["ListReport"] = "ListReport";
    TemplateType["ObjectPage"] = "ObjectPage";
    TemplateType["AnalyticalListPage"] = "AnalyticalListPage";
  })(TemplateType || (TemplateType = {}));

  _exports.TemplateType = TemplateType;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2VDb252ZXJ0ZXIudHMiXSwibmFtZXMiOlsiVGVtcGxhdGVUeXBlIl0sIm1hcHBpbmdzIjoiOzs7OztBQU9BOzs7TUFHWUEsWTs7YUFBQUEsWTtBQUFBQSxJQUFBQSxZO0FBQUFBLElBQUFBLFk7QUFBQUEsSUFBQUEsWTtLQUFBQSxZLEtBQUFBLFkiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFubm90YXRpb25UZXJtIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgeyBNYW5pZmVzdFdyYXBwZXIgfSBmcm9tIFwiLi4vTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHsgQW55QW5ub3RhdGlvbiwgRW50aXR5U2V0LCBFbnRpdHlUeXBlLCBQcm9wZXJ0eSwgRW50aXR5Q29udGFpbmVyIH0gZnJvbSBcIkBzYXAtdXgvYW5ub3RhdGlvbi1jb252ZXJ0ZXJcIjtcbmltcG9ydCB7IElEaWFnbm9zdGljcyB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL1RlbXBsYXRlQ29udmVydGVyXCI7XG5pbXBvcnQgeyBEYXRhTW9kZWxPYmplY3RQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuaW1wb3J0IHsgRW50aXR5VHlwZUFubm90YXRpb25zIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3R5cGVzL2dlbmVyYXRlZC9FZG1fVHlwZXNcIjtcblxuLyoqXG4gKiBUZW1wbGF0ZSBUeXBlXG4gKi9cbmV4cG9ydCBlbnVtIFRlbXBsYXRlVHlwZSB7XG5cdExpc3RSZXBvcnQgPSBcIkxpc3RSZXBvcnRcIixcblx0T2JqZWN0UGFnZSA9IFwiT2JqZWN0UGFnZVwiLFxuXHRBbmFseXRpY2FsTGlzdFBhZ2UgPSBcIkFuYWx5dGljYWxMaXN0UGFnZVwiXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVNoZWxsU2VydmljZXNQcm94eSB7XG5cdGdldENvbnRlbnREZW5zaXR5KCk6IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgUmVzb2x2ZWRBbm5vdGF0aW9uQ29udGV4dCA9IHtcblx0YW5ub3RhdGlvbjogQW55QW5ub3RhdGlvbjtcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dDtcbn07XG5cbmV4cG9ydCB0eXBlIENvbnZlcnRlckNvbnRleHQgPSB7XG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSB0aGUgZW50aXR5VHlwZSBhc3NvY2lhdGVkIHdpdGggYW4gYW5ub3RhdGlvbiBvYmplY3Rcblx0ICpcblx0ICogQHBhcmFtIGFubm90YXRpb25cblx0ICogQHJldHVybnMge0VudGl0eVR5cGV9IHRoZSBlbnRpdHkgdHlwZSB0aGUgYW5ub3RhdGlvbiByZWZlcnMgdG9cblx0ICovXG5cdGdldEFubm90YXRpb25FbnRpdHlUeXBlKGFubm90YXRpb24/OiBBbm5vdGF0aW9uVGVybTxhbnk+KTogRW50aXR5VHlwZTtcblxuXHQvKipcblx0ICogUmV0cmlldmUgdGhlIG1hbmlmZXN0IHNldHRpbmdzIGRlZmluZWQgZm9yIGEgc3BlY2lmaWMgY29udHJvbCB3aXRoaW4gY29udHJvbENvbmZpZ3VyYXRpb25cblx0ICpcblx0ICogQHBhcmFtIGFubm90YXRpb25QYXRoXG5cdCAqL1xuXHRnZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uKGFubm90YXRpb25QYXRoOiBzdHJpbmcgfCBBbm5vdGF0aW9uVGVybTxhbnk+KTogYW55O1xuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYW4gYWJzb2x1dGUgYW5ub3RhdGlvbiBwYXRoIGJhc2VkIG9uIHRoZSBjdXJyZW50IG1ldGEgbW9kZWwgY29udGV4dFxuXHQgKlxuXHQgKiBAcGFyYW0gYW5ub3RhdGlvblBhdGhcblx0ICovXG5cdGdldEFic29sdXRlQW5ub3RhdGlvblBhdGgoYW5ub3RhdGlvblBhdGg6IHN0cmluZyk6IHN0cmluZztcblxuXHQvKipcblx0ICogUmV0cmlldmUgdGhlIGN1cnJlbnQgZW50aXR5U2V0XG5cdCAqL1xuXHRnZXRFbnRpdHlTZXQoKTogRW50aXR5U2V0IHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSB0aGUgY3VycmVudCBkYXRhIG1vZGVsIG9iamVjdCBwYXRoXG5cdCAqL1xuXHRnZXREYXRhTW9kZWxPYmplY3RQYXRoKCk6IERhdGFNb2RlbE9iamVjdFBhdGg7XG5cblx0LyoqXG5cdCAqIEZpbmQgYW4gZW50aXR5IHNldCBiYXNlZCBvbiBpdHMgbmFtZVxuXHQgKi9cblx0ZmluZEVudGl0eVNldChlbnRpdHlTZXROYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBFbnRpdHlTZXQgfCB1bmRlZmluZWQ7XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgZW50aXR5IHNldCBhc3NvY2lhdGVkIHRvIGFuIGVudGl0eXR5cGUgKGFzc3VtaW5nIHRoZXJlIGlzIG9ubHkgb25lLi4uKVxuXHQgKlxuXHQgKiBAcGFyYW0gZW50aXR5VHlwZVxuXHQgKi9cblx0Z2V0RW50aXR5U2V0Rm9yRW50aXR5VHlwZShlbnRpdHlUeXBlOiBFbnRpdHlUeXBlKTogRW50aXR5U2V0IHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIGVudGl0eSBjb250YWluZXIuXG5cdCAqL1xuXHRnZXRFbnRpdHlDb250YWluZXIoKTogRW50aXR5Q29udGFpbmVyO1xuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIGVudGl0eXR5cGUgYmFzZWQgb24gdGhlIGZ1bGx5IHF1YWxpZmllZCBuYW1lLlxuXHQgKi9cblx0Z2V0RW50aXR5VHlwZSgpOiBFbnRpdHlUeXBlO1xuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSBhbiBhbm5vdGF0aW9uIGZyb20gYW4gZW50aXR5dHlwZSBiYXNlZCBvbiBhbiBhbm5vdGF0aW9uIHBhdGhcblx0ICpcblx0ICogQHBhcmFtIGFubm90YXRpb25QYXRoXG5cdCAqL1xuXHRnZXRFbnRpdHlUeXBlQW5ub3RhdGlvbihhbm5vdGF0aW9uUGF0aDogc3RyaW5nKTogUmVzb2x2ZWRBbm5vdGF0aW9uQ29udGV4dDtcblxuXHQvKipcblx0ICogUmV0cmlldmUgdGhlIHR5cGUgb2YgdGVtcGxhdGUgd2UncmUgd29ya2luZyBvbiAoZS5nLiBMaXN0UmVwb3J0IC8gT2JqZWN0UGFnZSAvIC4uLilcblx0ICovXG5cdGdldFRlbXBsYXRlVHlwZSgpOiBUZW1wbGF0ZVR5cGU7XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlIGEgcmVsYXRpdmUgYW5ub3RhdGlvbiBwYXRoIGJldHdlZW4gYW4gYW5ub3RhdGlvbnBhdGggYW5kIGFuIGVudGl0eSB0eXBlXG5cdCAqXG5cdCAqIEBwYXJhbSBhbm5vdGF0aW9uUGF0aFxuXHQgKiBAcGFyYW0gZW50aXR5VHlwZVxuXHQgKi9cblx0Z2V0UmVsYXRpdmVBbm5vdGF0aW9uUGF0aChhbm5vdGF0aW9uUGF0aDogc3RyaW5nLCBlbnRpdHlUeXBlOiBFbnRpdHlUeXBlKTogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUcmFuc2Zvcm0gYW4gZW50aXR5VHlwZSBiYXNlZCBwYXRoIHRvIGFuIGVudGl0eVNldCBiYXNlZCBvbmUgKHVpNSB0ZW1wbGF0aW5nIGdlbmVyYWxseSBleHBlY3QgYW4gZW50aXR5U2V0QmFzZWRQYXRoKVxuXHQgKlxuXHQgKiBAcGFyYW0gYW5ub3RhdGlvblBhdGhcblx0ICovXG5cdGdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoYW5ub3RhdGlvblBhdGg6IHN0cmluZyk6IHN0cmluZztcblxuXHQvKipcblx0ICogUmV0cmlldmUgdGhlIG1hbmlmZXN0IHdyYXBwZXIgZm9yIHRoZSBjdXJyZW50IGNvbnRleHRcblx0ICpcblx0ICogQHJldHVybnMge01hbmlmZXN0V3JhcHBlcn1cblx0ICovXG5cdGdldE1hbmlmZXN0V3JhcHBlcigpOiBNYW5pZmVzdFdyYXBwZXI7XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlIHRoZSBpbnN0YW5jZSBvZiB0aGUgc2hlbGwgc2VydmljZSBjbGFzcyBjdXJyZW50bHkgaW4gcGxhY2Vcblx0ICpcblx0ICogQHJldHVybnMge0lTaGVsbFNlcnZpY2VzUHJveHl9XG5cdCAqL1xuXHRnZXRTaGVsbFNlcnZpY2VzKCk6IElTaGVsbFNlcnZpY2VzUHJveHk7XG5cblx0Z2V0RGlhZ25vc3RpY3MoKTogSURpYWdub3N0aWNzO1xuXHQvKipcblx0ICogUmV0cmlldmUgYSBuZXcgY29udmVydGVyIGNvbnRleHQsIHNjb3BlZCBmb3IgYSBkaWZmZXJlbnQgZW50aXR5c2V0XG5cdCAqXG5cdCAqIEBwYXJhbSB7RW50aXR5U2V0fSB0YXJnZXRFbnRpdHlTZXQgdGhlIGVudGl0eXNldCB3ZSB3YW50IHRoZSBuZXcgY29udGV4dCBhcm91bmRcblx0ICogQHJldHVybnMge0NvbnZlcnRlckNvbnRleHR9XG5cdCAqL1xuXHRnZXRDb252ZXJ0ZXJDb250ZXh0Rm9yKHRhcmdldEVudGl0eVNldDogRW50aXR5U2V0KTogQ29udmVydGVyQ29udGV4dDtcblxuXHQvKipcblx0ICogUmV0cmlldmUgdGhlIHByb3BlcnR5IGJhc2VkIG9uIHRoZSBwYXRoXG5cdCAqXG5cdCAqIEBwYXJhbSBmdWxseVF1YWxpZmllZE5hbWUgZnVsbHlRdWFsaWZpZWROYW1lIHRoZSBmdWxseSBxdWFsaWZpZWQgbmFtZVxuXHQgKiBAcmV0dXJucyB7UHJvcGVydHl9IHRoZSBwcm9wZXJ0eSBFbnRpdHlUeXBlIGJhc2VkXG5cdCAqL1xuXHRnZXRFbnRpdHlQcm9wZXJ0eUZyb21GdWxseVF1YWxpZmllZE5hbWUoZnVsbHlRdWFsaWZpZWROYW1lOiBzdHJpbmcpOiBQcm9wZXJ0eSB8IHVuZGVmaW5lZDtcblxuXHQvKipcblx0ICogR2V0IGFsbCBhbm5vdGF0aW9ucyBvZiBhIGdpdmVuIHRlcm0gYW5kIHZvY2FidWxhcnkgb24gYW4gZW50aXR5IHR5cGVcblx0ICogKG9yIG9uIHRoZSBjdXJyZW50IGVudGl0eSB0eXBlIGlmIGVudGl0eVR5cGUgaXNuJ3Qgc3BlY2lmaWVkKVxuXHQgKlxuXHQgKiBAcGFyYW0gdm9jYWJ1bGFyeU5hbWVcblx0ICogQHBhcmFtIGFubm90YXRpb25UZXJtXG5cdCAqIEBwYXJhbSBlbnRpdHlUeXBlP1xuXHQgKi9cblx0Z2V0QW5ub3RhdGlvbnNCeVRlcm0oXG5cdFx0dm9jYWJ1bGFyeU5hbWU6IGtleW9mIEVudGl0eVR5cGVBbm5vdGF0aW9ucyxcblx0XHRhbm5vdGF0aW9uVGVybTogc3RyaW5nLFxuXHRcdGVudGl0eVR5cGU/OiBFbnRpdHlUeXBlXG5cdCk6IEFubm90YXRpb25UZXJtPGFueT5bXTtcblxuXHQvKipcblx0ICogR2V0IGFsbCBhbm5vdGF0aW9ucyBvZiBhIGdpdmVuIHRlcm0gYW5kIHZvY2FidWxhcnkgb24gdGhlIGN1cnJlbnQgZW50aXR5IHNldC5cblx0ICpcblx0ICogQHBhcmFtIHZvY2FidWxhcnlOYW1lXG5cdCAqIEBwYXJhbSBhbm5vdGF0aW9uVGVybVxuXHQgKi9cblx0Z2V0RW50aXR5U2V0QW5ub3RhdGlvbnNCeVRlcm0odm9jYWJ1bGFyeU5hbWU6IGtleW9mIEVudGl0eVR5cGVBbm5vdGF0aW9ucywgYW5ub3RhdGlvblRlcm06IHN0cmluZyk6IEFubm90YXRpb25UZXJtPGFueT5bXTtcblxuXHQvKipcblx0ICogR2V0IGFsbCBhbm5vdGF0aW9ucyBvZiBhIGdpdmVuIHRlcm0gYW5kIHZvY2FidWxhcnkgb24gdGhlIGVudGl0eSBjb250YWluZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB2b2NhYnVsYXJ5TmFtZVxuXHQgKiBAcGFyYW0gYW5ub3RhdGlvblRlcm1cblx0ICovXG5cdGdldEVudGl0eUNvbnRhaW5lckFubm90YXRpb25zQnlUZXJtKHZvY2FidWxhcnlOYW1lOiBrZXlvZiBFbnRpdHlUeXBlQW5ub3RhdGlvbnMsIGFubm90YXRpb25UZXJtOiBzdHJpbmcpOiBBbm5vdGF0aW9uVGVybTxhbnk+W107XG59O1xuIl19