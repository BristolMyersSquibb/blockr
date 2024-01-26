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

  if (isClosed) return;

  $editor.trigger("click");
};

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jay5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7VUNWQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU07QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmxvY2tyL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9ibG9ja3Ivd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmxvY2tyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9ibG9ja3Ivd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9ibG9ja3Ivd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9ibG9ja3IvLi9zcmNqcy9sb2NrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImJsb2NrclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJibG9ja3JcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJsZXQgbG9ja2VkID0gZmFsc2U7XG53aW5kb3cuU2hpbnkuYWRkQ3VzdG9tTWVzc2FnZUhhbmRsZXIoXCJsb2NrXCIsIChtc2cpID0+IHtcbiAgbG9ja2VkID0gbXNnLmxvY2tlZDtcbiAgaGFuZGxlTG9jaygpO1xuICBlbWl0RXZlbnQobXNnLmxvY2tlZCk7XG59KTtcblxuZXhwb3J0IGNvbnN0IGlzTG9ja2VkID0gKCkgPT4ge1xuICByZXR1cm4gbG9ja2VkO1xufTtcblxuY29uc3QgZW1pdEV2ZW50ID0gKGxvY2tlZCkgPT4ge1xuICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImJsb2Nrcjpsb2NrXCIsIHtcbiAgICBkZXRhaWw6IHtcbiAgICAgIGxvY2tlZDogbG9ja2VkLFxuICAgIH0sXG4gIH0pO1xuICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn07XG5cbmNvbnN0IGhhbmRsZUxvY2sgPSAoKSA9PiB7XG4gIGlmICghbG9ja2VkKSByZXR1cm47XG5cbiAgJChcIi5zdGFjay1yZW1vdmVcIikudG9nZ2xlKCk7XG4gICQoXCIuc3RhY2stZWRpdC10b2dnbGVcIikudG9nZ2xlKCk7XG4gICQoXCIuc3RhY2stY29weS1jb2RlXCIpLnRvZ2dsZSgpO1xuICAkKFwiLmJsb2NrLWNvZGUtdG9nZ2xlXCIpLnRvZ2dsZSgpO1xuICAkKFwiLmJsb2NrLW91dHB1dC10b2dnbGVcIikudG9nZ2xlKCk7XG4gICQoXCIuYmxvY2stcmVtb3ZlXCIpLnRvZ2dsZSgpO1xuXG4gICQoXCIuc3RhY2stdGl0bGVcIikub2ZmKCk7XG5cbiAgJChcIi5zdGFja1wiKS5lYWNoKChfaW5kZXgsIGVsKSA9PiB7XG4gICAgY29uc3QgJGVkaXRvciA9ICQoZWwpLmZpbmQoXCIuc3RhY2stZWRpdC10b2dnbGVcIik7XG4gICAgY29uc3QgaXNDbG9zZWQgPSAkZWRpdG9yLmZpbmQoXCJpXCIpLmhhc0NsYXNzKFwiZmEtY2hldnJvbi11cFwiKTtcblxuICAgIGlmIChpc0Nsb3NlZCkgcmV0dXJuO1xuXG4gICAgJGVkaXRvci50cmlnZ2VyKFwiY2xpY2tcIik7XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbmRlckxvY2tlZCA9IChzdGFjaywgc3RhdGUpID0+IHtcbiAgbG9ja2VkID0gc3RhdGU7XG4gIGlmICghbG9ja2VkKSByZXR1cm47XG5cbiAgbG9jayhzdGFjayk7XG59O1xuXG5jb25zdCBsb2NrID0gKHN0YWNrKSA9PiB7XG4gIGlmICghbG9ja2VkKSByZXR1cm47XG4gIGxldCAkc3RhY2sgPSAkKHN0YWNrKTtcblxuICAkc3RhY2suZmluZChcIi5zdGFjay1yZW1vdmVcIikuaGlkZSgpO1xuICAkc3RhY2suZmluZChcIi5zdGFjay1lZGl0LXRvZ2dsZVwiKS5oaWRlKCk7XG4gICRzdGFjay5maW5kKFwiLnN0YWNrLWNvcHktY29kZVwiKS5oaWRlKCk7XG4gICRzdGFjay5maW5kKFwiLmJsb2NrLWNvZGUtdG9nZ2xlXCIpLmhpZGUoKTtcbiAgJHN0YWNrLmZpbmQoXCIuYmxvY2stb3V0cHV0LXRvZ2dsZVwiKS5oaWRlKCk7XG4gICRzdGFjay5maW5kKFwiLmJsb2NrLXJlbW92ZVwiKS5oaWRlKCk7XG4gICQoXCIuc3RhY2stdGl0bGVcIikub2ZmKCk7XG5cbiAgY29uc3QgJGVkaXRvciA9ICRzdGFjay5maW5kKFwiLnN0YWNrLWVkaXQtdG9nZ2xlXCIpO1xuICBjb25zdCBpc0Nsb3NlZCA9ICRlZGl0b3IuZmluZChcImlcIikuaGFzQ2xhc3MoXCJmYS1jaGV2cm9uLXVwXCIpO1xuXG4gIGlmIChpc0Nsb3NlZCkgcmV0dXJuO1xuXG4gICRlZGl0b3IudHJpZ2dlcihcImNsaWNrXCIpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==