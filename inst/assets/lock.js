(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["blockr"] = factory();
	else
		root["blockr"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!***********************!*\
  !*** ./srcjs/lock.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isLocked: () => (/* binding */ isLocked),
/* harmony export */   renderLocked: () => (/* binding */ renderLocked)
/* harmony export */ });
let locked = false;
window.Shiny.addCustomMessageHandler("lock", (msg) => {
  locked = msg.locked;
  handleLock();
  emitEvent(msg.locked);
});

const isLocked = () => {
  return locked;
};

const emitEvent = (locked) => {
  const event = new CustomEvent("blockr:lock", {
    detail: {
      locked: locked,
    },
  });
  document.dispatchEvent(event);
};

const handleLock = () => {
  if (!locked) return;

  $(".stack-remove").toggle();
  $(".stack-edit-toggle").toggle();
  $(".stack-copy-code").toggle();
  $(".block-code-toggle").toggle();
  $(".block-output-toggle").toggle();
  $(".block-remove").toggle();

  $(".stack-title").off();

  $(".stack").each((_index, el) => {
    const $editor = $(el).find(".stack-edit-toggle");
    const isClosed = $editor.find("i").hasClass("fa-chevron-up");

    if (isClosed) return;

    $editor.trigger("click");
  });
};

const renderLocked = (stack, state) => {
  locked = state;
  if (!locked) return;

  lock(stack);
};

const lock = (stack) => {
  if (!locked) return;
  let $stack = $(stack);

  $stack.find(".stack-remove").hide();
  $stack.find(".stack-edit-toggle").hide();
  $stack.find(".stack-copy-code").hide();
  $stack.find(".block-code-toggle").hide();
  $stack.find(".block-output-toggle").hide();
  $stack.find(".block-remove").hide();
  $(".stack-title").off();

  const $editor = $stack.find(".stack-edit-toggle");
  const isClosed = $editor.find("i").hasClass("fa-chevron-up");
  console.log(isClosed);

  if (isClosed) return;

  $editor.trigger("click");
};

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jay5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7VUNWQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU07QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ibG9ja3Ivd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2Jsb2Nrci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9ibG9ja3Ivd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Jsb2Nrci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Jsb2Nrci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Jsb2Nrci8uL3NyY2pzL2xvY2suanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiYmxvY2tyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImJsb2NrclwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImxldCBsb2NrZWQgPSBmYWxzZTtcbndpbmRvdy5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcImxvY2tcIiwgKG1zZykgPT4ge1xuICBsb2NrZWQgPSBtc2cubG9ja2VkO1xuICBoYW5kbGVMb2NrKCk7XG4gIGVtaXRFdmVudChtc2cubG9ja2VkKTtcbn0pO1xuXG5leHBvcnQgY29uc3QgaXNMb2NrZWQgPSAoKSA9PiB7XG4gIHJldHVybiBsb2NrZWQ7XG59O1xuXG5jb25zdCBlbWl0RXZlbnQgPSAobG9ja2VkKSA9PiB7XG4gIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiYmxvY2tyOmxvY2tcIiwge1xuICAgIGRldGFpbDoge1xuICAgICAgbG9ja2VkOiBsb2NrZWQsXG4gICAgfSxcbiAgfSk7XG4gIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufTtcblxuY29uc3QgaGFuZGxlTG9jayA9ICgpID0+IHtcbiAgaWYgKCFsb2NrZWQpIHJldHVybjtcblxuICAkKFwiLnN0YWNrLXJlbW92ZVwiKS50b2dnbGUoKTtcbiAgJChcIi5zdGFjay1lZGl0LXRvZ2dsZVwiKS50b2dnbGUoKTtcbiAgJChcIi5zdGFjay1jb3B5LWNvZGVcIikudG9nZ2xlKCk7XG4gICQoXCIuYmxvY2stY29kZS10b2dnbGVcIikudG9nZ2xlKCk7XG4gICQoXCIuYmxvY2stb3V0cHV0LXRvZ2dsZVwiKS50b2dnbGUoKTtcbiAgJChcIi5ibG9jay1yZW1vdmVcIikudG9nZ2xlKCk7XG5cbiAgJChcIi5zdGFjay10aXRsZVwiKS5vZmYoKTtcblxuICAkKFwiLnN0YWNrXCIpLmVhY2goKF9pbmRleCwgZWwpID0+IHtcbiAgICBjb25zdCAkZWRpdG9yID0gJChlbCkuZmluZChcIi5zdGFjay1lZGl0LXRvZ2dsZVwiKTtcbiAgICBjb25zdCBpc0Nsb3NlZCA9ICRlZGl0b3IuZmluZChcImlcIikuaGFzQ2xhc3MoXCJmYS1jaGV2cm9uLXVwXCIpO1xuXG4gICAgaWYgKGlzQ2xvc2VkKSByZXR1cm47XG5cbiAgICAkZWRpdG9yLnRyaWdnZXIoXCJjbGlja1wiKTtcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgcmVuZGVyTG9ja2VkID0gKHN0YWNrLCBzdGF0ZSkgPT4ge1xuICBsb2NrZWQgPSBzdGF0ZTtcbiAgaWYgKCFsb2NrZWQpIHJldHVybjtcblxuICBsb2NrKHN0YWNrKTtcbn07XG5cbmNvbnN0IGxvY2sgPSAoc3RhY2spID0+IHtcbiAgaWYgKCFsb2NrZWQpIHJldHVybjtcbiAgbGV0ICRzdGFjayA9ICQoc3RhY2spO1xuXG4gICRzdGFjay5maW5kKFwiLnN0YWNrLXJlbW92ZVwiKS5oaWRlKCk7XG4gICRzdGFjay5maW5kKFwiLnN0YWNrLWVkaXQtdG9nZ2xlXCIpLmhpZGUoKTtcbiAgJHN0YWNrLmZpbmQoXCIuc3RhY2stY29weS1jb2RlXCIpLmhpZGUoKTtcbiAgJHN0YWNrLmZpbmQoXCIuYmxvY2stY29kZS10b2dnbGVcIikuaGlkZSgpO1xuICAkc3RhY2suZmluZChcIi5ibG9jay1vdXRwdXQtdG9nZ2xlXCIpLmhpZGUoKTtcbiAgJHN0YWNrLmZpbmQoXCIuYmxvY2stcmVtb3ZlXCIpLmhpZGUoKTtcbiAgJChcIi5zdGFjay10aXRsZVwiKS5vZmYoKTtcblxuICBjb25zdCAkZWRpdG9yID0gJHN0YWNrLmZpbmQoXCIuc3RhY2stZWRpdC10b2dnbGVcIik7XG4gIGNvbnN0IGlzQ2xvc2VkID0gJGVkaXRvci5maW5kKFwiaVwiKS5oYXNDbGFzcyhcImZhLWNoZXZyb24tdXBcIik7XG4gIGNvbnNvbGUubG9nKGlzQ2xvc2VkKTtcblxuICBpZiAoaXNDbG9zZWQpIHJldHVybjtcblxuICAkZWRpdG9yLnRyaWdnZXIoXCJjbGlja1wiKTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=