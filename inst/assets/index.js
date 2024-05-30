(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Shiny"));
	else if(typeof define === 'function' && define.amd)
		define(["Shiny"], factory);
	else if(typeof exports === 'object')
		exports["blockr"] = factory(require("Shiny"));
	else
		root["blockr"] = factory(root["Shiny"]);
})(self, (__WEBPACK_EXTERNAL_MODULE_shiny__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./srcjs/collapse.js":
/*!***************************!*\
  !*** ./srcjs/collapse.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   collapseOtherBlocks: () => (/* binding */ collapseOtherBlocks),
/* harmony export */   handleIcons: () => (/* binding */ handleIcons),
/* harmony export */   showLastOutput: () => (/* binding */ showLastOutput)
/* harmony export */ });
$(() => {
  editor();
  toggleOutputInput();
  handleIcons();
});

// handles icons collapse state
const handleIcons = () => {
  $("body").on("click", ".stack-edit-toggle", (event) => {
    $(event.currentTarget)
      .find("i")
      .toggleClass("fa-chevron-up fa-chevron-down");
  });

  $("body").on("click", ".block-output-toggle", (event) => {
    $(event.currentTarget)
      .find("i")
      .toggleClass("fa-chevron-up fa-chevron-down");
  });
};

// handles the toggling of input and output
const toggleOutputInput = () => {
  $("body").on("click", ".block-output-toggle", (event) => {
    const $block = $(event.target).closest(".block");

    const inputVisible = $block.find(".block-inputs").is(":visible");

    let toggle = inputVisible;

    if (toggle) {
      $block.find(".block-inputs").addClass("d-none");
      $block.find(".block-output").addClass("d-none");
    } else {
      $block.find(".block-inputs").removeClass("d-none");
      $block.find(".block-output").removeClass("d-none");
    }

    let ev = "shown";
    if ($block.find(".block-output").hasClass("d-none")) {
      ev = "hidden";
    }

    $block.find(".block-inputs").trigger(ev);
    $block.find(".block-output").trigger(ev);
  });
};

// handles the toggling of editing mode on stacks
const editor = () => {
  $("body").on("click", ".stack-edit-toggle", (event) => {
    const $stack = $(event.target).closest(".stack");
    const $blocks = $stack.find(".block");

    $(event.currentTarget).toggleClass("editable");
    const editable = $(event.currentTarget).hasClass("editable");

    $blocks.each((index, block) => {
      const $block = $(block);

      if (editable) {
        $block.removeClass("d-none");
        $block.find(".block-title").removeClass("d-none");

        $block.find(".block-download").removeClass("d-none");
        $block.find(".block-code-toggle").removeClass("d-none");
        $block.find(".block-output-toggle").removeClass("d-none");

        if (index == $blocks.length - 1) {
          $block.find(".block-output").addClass("show");
          $block.find(".block-output").removeClass("d-none");
          $block.find(".block-output").trigger("shown");

          const code = window.bootstrap.Collapse.getOrCreateInstance(
            $block.find(".block-code")[0],
            { toggle: false },
          );
          code.hide();

          $block.find(".block-inputs").removeClass("d-none");
          $block.find(".block-inputs").trigger("shown");
          return;
        }

        $block.find(".block-loading").addClass("d-none");
        return;
      }

      $block.find(".block-download").addClass("d-none");
      $block.find(".block-code-toggle").addClass("d-none");
      $block.find(".block-output-toggle").addClass("d-none");
      $block.find(".block-output-toggle").find("i").addClass("fa-chevron-up");
      $block
        .find(".block-output-toggle")
        .find("i")
        .removeClass("fa-chevron-down");

      $block.find(".block-title").addClass("d-none");
      if (index == $blocks.length - 1) {
        $block.removeClass("d-none");

        $block.find(".block-output").addClass("show");
        $block.find(".block-output").removeClass("d-none");
        $block.find(".block-output").trigger("shown");

        const code = window.bootstrap.Collapse.getOrCreateInstance(
          $block.find(".block-code")[0],
          { toggle: false },
        );
        code.hide();

        $block.find(".block-inputs").addClass("d-none");
        $block.find(".block-inputs").trigger("hidden");
        return;
      }

      $block.addClass("d-none");
    });
  });
};

const showLastOutput = (el) => {
  const $block = $(el).find(".block").last();

  const $lastOutput = $block.find(".block-output");
  const $lastTitle = $block.find(".block-title");
  const $lastInputs = $block.find(".block-inputs");

  $lastTitle.addClass("d-none");
  $lastInputs.addClass("d-none");

  // hide togglers
  $block.find(".block-download").addClass("d-none");
  $block.find(".block-code-toggle").addClass("d-none");
  $block.find(".block-output-toggle").addClass("d-none");

  // we have a loading state
  // because some block validations have no last output
  const tableId = $lastOutput.find(".shiny-bound-output").first().attr("id");

  $(document).on("shiny:value", (event) => {
    if (event.name !== tableId) {
      return;
    }

    $lastOutput.find(".block-loading").addClass("d-none");
  });
};

const collapseOtherBlocks = (stack, block) => {
  const btns = $(stack).find(".block-output-toggle");

  $(btns).each((_index, btn) => {
    if ($(btn).closest(".block").data("value") == `${block}-block`) return;

    const isCollapsed = $(btn).find("i").hasClass("fa-chevron-down");
    if (isCollapsed) return;

    $(btn).trigger("click");
  });
};


/***/ }),

/***/ "./srcjs/copy.js":
/*!***********************!*\
  !*** ./srcjs/copy.js ***!
  \***********************/
/***/ (() => {

const copyText = (txt) => {
  navigator.clipboard.writeText(txt);
};

window.Shiny.addCustomMessageHandler("blockr-copy-code", (msg) => {
  // todo notify user
  if (!msg.code) {
    window.Shiny.notifications.show({
      html: "<span>Failed to copy code to clipboard</span>",
      type: "error",
    });
    return;
  }
  copyText(msg.code.map((code) => code.trim()).join("\n\t"));
  window.Shiny.notifications.show({
    html: "<span>Code copied to clipboard</span>",
    type: "message",
  });
});


/***/ }),

/***/ "./srcjs/hl.js":
/*!*********************!*\
  !*** ./srcjs/hl.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! highlight.js/lib/core */ "./node_modules/highlight.js/es/core.js");
/* harmony import */ var highlight_js_lib_languages_r__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! highlight.js/lib/languages/r */ "./node_modules/highlight.js/es/languages/r.js");



highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_0__["default"].registerLanguage("r", highlight_js_lib_languages_r__WEBPACK_IMPORTED_MODULE_1__["default"]);

$(() => {
  $(document).on("shiny:value", (e) => {
    if (!e.name.match(/-code$/)) {
      return;
    }

    $(`#${e.name}`).addClass("language-r");
    setTimeout(() => {
      delete document.getElementById(e.name).dataset.highlighted;
      highlight_js_lib_core__WEBPACK_IMPORTED_MODULE_0__["default"].highlightElement(document.getElementById(e.name));
    }, 250);
  });
});


/***/ }),

/***/ "./srcjs/loading.js":
/*!**************************!*\
  !*** ./srcjs/loading.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loading: () => (/* binding */ loading)
/* harmony export */ });
const loading = (stack) => {
  $(document).on("shiny:outputinvalidated", (event) => {
    if (!event.name.match(`^${stack}`)) return;
    if (!event.name.match("res$|plot$")) return;

    $(`#${event.name}`).addClass("d-none");
    $(`#${event.name}`)
      .closest(".block")
      .find(".block-loading")
      .removeClass("d-none");
  });

  $(document).on("shiny:value shiny:error", (event) => {
    if (!event.name.match(`^${stack}`)) return;
    if (!event.name.match("res$|plot$")) return;

    $(`#${event.name}`).removeClass("d-none");
    $(`#${event.name}`)
      .closest(".block")
      .find(".block-loading")
      .addClass("d-none");
  });
};


/***/ }),

/***/ "./srcjs/lock.js":
/*!***********************!*\
  !*** ./srcjs/lock.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

  $(".block-code-toggle").hide();
  $(".block-output-toggle").hide();
  $(".stack-remove").hide();
  $(".stack-add-block").hide();
  $(".stack-edit-toggle").hide();
  $(".block-remove").hide();

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

  $stack.find(".block-code-toggle").hide();
  $stack.find(".block-output-toggle").hide();
  $stack.find(".stack-remove").hide();
  $stack.find(".stack-add-block").hide();
  $stack.find(".stack-edit-toggle").hide();
  $stack.find(".block-remove").hide();
  $stack.find(".stack-title").off();

  const $editor = $stack.find(".stack-edit-toggle");
  const isClosed = $editor.find("i").hasClass("fa-chevron-up");

  if (isClosed) return;

  $editor.trigger("click");
};


/***/ }),

/***/ "./srcjs/shiny.js":
/*!************************!*\
  !*** ./srcjs/shiny.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _collapse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./collapse.js */ "./srcjs/collapse.js");
/* harmony import */ var _stack_title_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stack-title.js */ "./srcjs/stack-title.js");
/* harmony import */ var _stack_title_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_stack_title_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lock_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lock.js */ "./srcjs/lock.js");
/* harmony import */ var _loading_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./loading.js */ "./srcjs/loading.js");





window.Shiny.addCustomMessageHandler("blockr-render-stack", (msg) => {
  const stack = `#${msg.stack}`;
  (0,_collapse_js__WEBPACK_IMPORTED_MODULE_0__.showLastOutput)(stack);
  (0,_lock_js__WEBPACK_IMPORTED_MODULE_2__.renderLocked)(stack, msg.locked);
  (0,_loading_js__WEBPACK_IMPORTED_MODULE_3__.loading)(msg.stack);
  const event = new CustomEvent("blockr:stack-render", { detail: msg });
  document.dispatchEvent(event);
});

window.Shiny.addCustomMessageHandler("blockr-add-block", (msg) => {
  const stack = `#${msg.stack}`;
  $(stack).removeClass("d-none");

  setTimeout(() => {
    (0,_collapse_js__WEBPACK_IMPORTED_MODULE_0__.collapseOtherBlocks)(stack, msg.block);
  }, 350);
});

// Block color feedback (validation)
window.Shiny.addCustomMessageHandler("validate-block", (msg) => {
  if (msg.state) {
    $(`[data-value="${msg.id}"] .card`).removeClass("border-danger");
    return;
  }

  $(`[data-value="${msg.id}"] .card`).addClass("border-danger");
});

// Input color feedback (validation)
const changeInputBorder = (args) => {
  let sel;
  if ($(`#${args.id}`).hasClass("shiny-input-select")) {
    // border is on parent div
    sel = $(`#${args.id}-selectized`).parent(".selectize-input").closest("div");
  } else {
    sel = `#${args.id}`;
  }

  // Some inputs are dynamically generated like in filter block.
  // Adding a delay "ensure" they're in the DOM.
  setTimeout(() => {
    if (!args.state) {
      $(sel).addClass("is-invalid");
      return;
    }

    $(sel).addClass("is-valid");
  }, 500);
};

const showInputsOnError = (opts) => {
  // input is valid - we skip
  if (opts.state) return;

  // input is invalid
  // we show the parent input block
  // this is because if the error occurs in the
  // last block then the inputs are hidden by default
  $(`#${opts.id}`).closest(".block-inputs").removeClass("d-none");
};

window.Shiny.addCustomMessageHandler("validate-input", (msg) => {
  showInputsOnError(msg);
  changeInputBorder(msg);
});

window.Shiny.addCustomMessageHandler("toggle-submit", (msg) => {
  $(`#${msg.id}`).prop("disabled", !msg.state);
});


/***/ }),

/***/ "./srcjs/stack-title.js":
/*!******************************!*\
  !*** ./srcjs/stack-title.js ***!
  \******************************/
/***/ (() => {

$(() => {
  $("body").on("click", ".stack-title-display", (event) => {
    const $group = $(event.target).closest(".stack-title");

    $group.find(".stack-title-display").addClass("d-none");
    $group.find(".stack-title-input").removeClass("d-none");
    $group.find(".stack-title-input").find("input").focus();
  });

  $("body").on("click", ".stack-title-save", (event) => {
    const $group = $(event.target)
      .closest(".input-group")
      .closest(".stack-title");

    const v = $group.find(".stack-title-input").find("input").val();
    if (v === "") {
      window.Shiny.notifications.show({
        html: "Must set a title",
        type: "error",
      });
      return;
    }
    $group.find(".stack-title-display").text(v);

    $group.find(".stack-title-input").addClass("d-none");
    $group.find(".stack-title-display").removeClass("d-none");
  });

  $("body").on("keydown", ".stack-title-input", (event) => {
    if (event.key !== "Enter") return;

    const $group = $(event.target).closest(".stack-title");

    const v = $(event.target).val();
    if (v === "") {
      window.Shiny.notifications.show({
        html: "Must set a title",
        type: "error",
      });
      return;
    }
    $group.find(".stack-title-display").text(v);

    $group.find(".stack-title-display").removeClass("d-none");
    $group.find(".stack-title-input").addClass("d-none");
  });
});


/***/ }),

/***/ "./srcjs/tooltips.js":
/*!***************************!*\
  !*** ./srcjs/tooltips.js ***!
  \***************************/
/***/ (() => {

$(() => {
  tooltip();
});

const tooltip = () => {
  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltips].map((el) => new window.bootstrap.Tooltip(el));
};


/***/ }),

/***/ "shiny":
/*!************************!*\
  !*** external "Shiny" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_shiny__;

/***/ }),

/***/ "./node_modules/highlight.js/lib/core.js":
/*!***********************************************!*\
  !*** ./node_modules/highlight.js/lib/core.js ***!
  \***********************************************/
/***/ ((module) => {

/* eslint-disable no-multi-assign */

function deepFreeze(obj) {
  if (obj instanceof Map) {
    obj.clear =
      obj.delete =
      obj.set =
        function () {
          throw new Error('map is read-only');
        };
  } else if (obj instanceof Set) {
    obj.add =
      obj.clear =
      obj.delete =
        function () {
          throw new Error('set is read-only');
        };
  }

  // Freeze self
  Object.freeze(obj);

  Object.getOwnPropertyNames(obj).forEach((name) => {
    const prop = obj[name];
    const type = typeof prop;

    // Freeze prop if it is an object or function and also not already frozen
    if ((type === 'object' || type === 'function') && !Object.isFrozen(prop)) {
      deepFreeze(prop);
    }
  });

  return obj;
}

/** @typedef {import('highlight.js').CallbackResponse} CallbackResponse */
/** @typedef {import('highlight.js').CompiledMode} CompiledMode */
/** @implements CallbackResponse */

class Response {
  /**
   * @param {CompiledMode} mode
   */
  constructor(mode) {
    // eslint-disable-next-line no-undefined
    if (mode.data === undefined) mode.data = {};

    this.data = mode.data;
    this.isMatchIgnored = false;
  }

  ignoreMatch() {
    this.isMatchIgnored = true;
  }
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeHTML(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * performs a shallow merge of multiple objects into one
 *
 * @template T
 * @param {T} original
 * @param {Record<string,any>[]} objects
 * @returns {T} a single new object
 */
function inherit$1(original, ...objects) {
  /** @type Record<string,any> */
  const result = Object.create(null);

  for (const key in original) {
    result[key] = original[key];
  }
  objects.forEach(function(obj) {
    for (const key in obj) {
      result[key] = obj[key];
    }
  });
  return /** @type {T} */ (result);
}

/**
 * @typedef {object} Renderer
 * @property {(text: string) => void} addText
 * @property {(node: Node) => void} openNode
 * @property {(node: Node) => void} closeNode
 * @property {() => string} value
 */

/** @typedef {{scope?: string, language?: string, sublanguage?: boolean}} Node */
/** @typedef {{walk: (r: Renderer) => void}} Tree */
/** */

const SPAN_CLOSE = '</span>';

/**
 * Determines if a node needs to be wrapped in <span>
 *
 * @param {Node} node */
const emitsWrappingTags = (node) => {
  // rarely we can have a sublanguage where language is undefined
  // TODO: track down why
  return !!node.scope;
};

/**
 *
 * @param {string} name
 * @param {{prefix:string}} options
 */
const scopeToCSSClass = (name, { prefix }) => {
  // sub-language
  if (name.startsWith("language:")) {
    return name.replace("language:", "language-");
  }
  // tiered scope: comment.line
  if (name.includes(".")) {
    const pieces = name.split(".");
    return [
      `${prefix}${pieces.shift()}`,
      ...(pieces.map((x, i) => `${x}${"_".repeat(i + 1)}`))
    ].join(" ");
  }
  // simple scope
  return `${prefix}${name}`;
};

/** @type {Renderer} */
class HTMLRenderer {
  /**
   * Creates a new HTMLRenderer
   *
   * @param {Tree} parseTree - the parse tree (must support `walk` API)
   * @param {{classPrefix: string}} options
   */
  constructor(parseTree, options) {
    this.buffer = "";
    this.classPrefix = options.classPrefix;
    parseTree.walk(this);
  }

  /**
   * Adds texts to the output stream
   *
   * @param {string} text */
  addText(text) {
    this.buffer += escapeHTML(text);
  }

  /**
   * Adds a node open to the output stream (if needed)
   *
   * @param {Node} node */
  openNode(node) {
    if (!emitsWrappingTags(node)) return;

    const className = scopeToCSSClass(node.scope,
      { prefix: this.classPrefix });
    this.span(className);
  }

  /**
   * Adds a node close to the output stream (if needed)
   *
   * @param {Node} node */
  closeNode(node) {
    if (!emitsWrappingTags(node)) return;

    this.buffer += SPAN_CLOSE;
  }

  /**
   * returns the accumulated buffer
  */
  value() {
    return this.buffer;
  }

  // helpers

  /**
   * Builds a span element
   *
   * @param {string} className */
  span(className) {
    this.buffer += `<span class="${className}">`;
  }
}

/** @typedef {{scope?: string, language?: string, children: Node[]} | string} Node */
/** @typedef {{scope?: string, language?: string, children: Node[]} } DataNode */
/** @typedef {import('highlight.js').Emitter} Emitter */
/**  */

/** @returns {DataNode} */
const newNode = (opts = {}) => {
  /** @type DataNode */
  const result = { children: [] };
  Object.assign(result, opts);
  return result;
};

class TokenTree {
  constructor() {
    /** @type DataNode */
    this.rootNode = newNode();
    this.stack = [this.rootNode];
  }

  get top() {
    return this.stack[this.stack.length - 1];
  }

  get root() { return this.rootNode; }

  /** @param {Node} node */
  add(node) {
    this.top.children.push(node);
  }

  /** @param {string} scope */
  openNode(scope) {
    /** @type Node */
    const node = newNode({ scope });
    this.add(node);
    this.stack.push(node);
  }

  closeNode() {
    if (this.stack.length > 1) {
      return this.stack.pop();
    }
    // eslint-disable-next-line no-undefined
    return undefined;
  }

  closeAllNodes() {
    while (this.closeNode());
  }

  toJSON() {
    return JSON.stringify(this.rootNode, null, 4);
  }

  /**
   * @typedef { import("./html_renderer").Renderer } Renderer
   * @param {Renderer} builder
   */
  walk(builder) {
    // this does not
    return this.constructor._walk(builder, this.rootNode);
    // this works
    // return TokenTree._walk(builder, this.rootNode);
  }

  /**
   * @param {Renderer} builder
   * @param {Node} node
   */
  static _walk(builder, node) {
    if (typeof node === "string") {
      builder.addText(node);
    } else if (node.children) {
      builder.openNode(node);
      node.children.forEach((child) => this._walk(builder, child));
      builder.closeNode(node);
    }
    return builder;
  }

  /**
   * @param {Node} node
   */
  static _collapse(node) {
    if (typeof node === "string") return;
    if (!node.children) return;

    if (node.children.every(el => typeof el === "string")) {
      // node.text = node.children.join("");
      // delete node.children;
      node.children = [node.children.join("")];
    } else {
      node.children.forEach((child) => {
        TokenTree._collapse(child);
      });
    }
  }
}

/**
  Currently this is all private API, but this is the minimal API necessary
  that an Emitter must implement to fully support the parser.

  Minimal interface:

  - addText(text)
  - __addSublanguage(emitter, subLanguageName)
  - startScope(scope)
  - endScope()
  - finalize()
  - toHTML()

*/

/**
 * @implements {Emitter}
 */
class TokenTreeEmitter extends TokenTree {
  /**
   * @param {*} options
   */
  constructor(options) {
    super();
    this.options = options;
  }

  /**
   * @param {string} text
   */
  addText(text) {
    if (text === "") { return; }

    this.add(text);
  }

  /** @param {string} scope */
  startScope(scope) {
    this.openNode(scope);
  }

  endScope() {
    this.closeNode();
  }

  /**
   * @param {Emitter & {root: DataNode}} emitter
   * @param {string} name
   */
  __addSublanguage(emitter, name) {
    /** @type DataNode */
    const node = emitter.root;
    if (name) node.scope = `language:${name}`;

    this.add(node);
  }

  toHTML() {
    const renderer = new HTMLRenderer(this, this.options);
    return renderer.value();
  }

  finalize() {
    this.closeAllNodes();
    return true;
  }
}

/**
 * @param {string} value
 * @returns {RegExp}
 * */

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function source(re) {
  if (!re) return null;
  if (typeof re === "string") return re;

  return re.source;
}

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function lookahead(re) {
  return concat('(?=', re, ')');
}

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function anyNumberOfTimes(re) {
  return concat('(?:', re, ')*');
}

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function optional(re) {
  return concat('(?:', re, ')?');
}

/**
 * @param {...(RegExp | string) } args
 * @returns {string}
 */
function concat(...args) {
  const joined = args.map((x) => source(x)).join("");
  return joined;
}

/**
 * @param { Array<string | RegExp | Object> } args
 * @returns {object}
 */
function stripOptionsFromArgs(args) {
  const opts = args[args.length - 1];

  if (typeof opts === 'object' && opts.constructor === Object) {
    args.splice(args.length - 1, 1);
    return opts;
  } else {
    return {};
  }
}

/** @typedef { {capture?: boolean} } RegexEitherOptions */

/**
 * Any of the passed expresssions may match
 *
 * Creates a huge this | this | that | that match
 * @param {(RegExp | string)[] | [...(RegExp | string)[], RegexEitherOptions]} args
 * @returns {string}
 */
function either(...args) {
  /** @type { object & {capture?: boolean} }  */
  const opts = stripOptionsFromArgs(args);
  const joined = '('
    + (opts.capture ? "" : "?:")
    + args.map((x) => source(x)).join("|") + ")";
  return joined;
}

/**
 * @param {RegExp | string} re
 * @returns {number}
 */
function countMatchGroups(re) {
  return (new RegExp(re.toString() + '|')).exec('').length - 1;
}

/**
 * Does lexeme start with a regular expression match at the beginning
 * @param {RegExp} re
 * @param {string} lexeme
 */
function startsWith(re, lexeme) {
  const match = re && re.exec(lexeme);
  return match && match.index === 0;
}

// BACKREF_RE matches an open parenthesis or backreference. To avoid
// an incorrect parse, it additionally matches the following:
// - [...] elements, where the meaning of parentheses and escapes change
// - other escape sequences, so we do not misparse escape sequences as
//   interesting elements
// - non-matching or lookahead parentheses, which do not capture. These
//   follow the '(' with a '?'.
const BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;

// **INTERNAL** Not intended for outside usage
// join logically computes regexps.join(separator), but fixes the
// backreferences so they continue to match.
// it also places each individual regular expression into it's own
// match group, keeping track of the sequencing of those match groups
// is currently an exercise for the caller. :-)
/**
 * @param {(string | RegExp)[]} regexps
 * @param {{joinWith: string}} opts
 * @returns {string}
 */
function _rewriteBackreferences(regexps, { joinWith }) {
  let numCaptures = 0;

  return regexps.map((regex) => {
    numCaptures += 1;
    const offset = numCaptures;
    let re = source(regex);
    let out = '';

    while (re.length > 0) {
      const match = BACKREF_RE.exec(re);
      if (!match) {
        out += re;
        break;
      }
      out += re.substring(0, match.index);
      re = re.substring(match.index + match[0].length);
      if (match[0][0] === '\\' && match[1]) {
        // Adjust the backreference.
        out += '\\' + String(Number(match[1]) + offset);
      } else {
        out += match[0];
        if (match[0] === '(') {
          numCaptures++;
        }
      }
    }
    return out;
  }).map(re => `(${re})`).join(joinWith);
}

/** @typedef {import('highlight.js').Mode} Mode */
/** @typedef {import('highlight.js').ModeCallback} ModeCallback */

// Common regexps
const MATCH_NOTHING_RE = /\b\B/;
const IDENT_RE = '[a-zA-Z]\\w*';
const UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
const NUMBER_RE = '\\b\\d+(\\.\\d+)?';
const C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
const BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
const RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

/**
* @param { Partial<Mode> & {binary?: string | RegExp} } opts
*/
const SHEBANG = (opts = {}) => {
  const beginShebang = /^#![ ]*\//;
  if (opts.binary) {
    opts.begin = concat(
      beginShebang,
      /.*\b/,
      opts.binary,
      /\b.*/);
  }
  return inherit$1({
    scope: 'meta',
    begin: beginShebang,
    end: /$/,
    relevance: 0,
    /** @type {ModeCallback} */
    "on:begin": (m, resp) => {
      if (m.index !== 0) resp.ignoreMatch();
    }
  }, opts);
};

// Common modes
const BACKSLASH_ESCAPE = {
  begin: '\\\\[\\s\\S]', relevance: 0
};
const APOS_STRING_MODE = {
  scope: 'string',
  begin: '\'',
  end: '\'',
  illegal: '\\n',
  contains: [BACKSLASH_ESCAPE]
};
const QUOTE_STRING_MODE = {
  scope: 'string',
  begin: '"',
  end: '"',
  illegal: '\\n',
  contains: [BACKSLASH_ESCAPE]
};
const PHRASAL_WORDS_MODE = {
  begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
};
/**
 * Creates a comment mode
 *
 * @param {string | RegExp} begin
 * @param {string | RegExp} end
 * @param {Mode | {}} [modeOptions]
 * @returns {Partial<Mode>}
 */
const COMMENT = function(begin, end, modeOptions = {}) {
  const mode = inherit$1(
    {
      scope: 'comment',
      begin,
      end,
      contains: []
    },
    modeOptions
  );
  mode.contains.push({
    scope: 'doctag',
    // hack to avoid the space from being included. the space is necessary to
    // match here to prevent the plain text rule below from gobbling up doctags
    begin: '[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)',
    end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
    excludeBegin: true,
    relevance: 0
  });
  const ENGLISH_WORD = either(
    // list of common 1 and 2 letter words in English
    "I",
    "a",
    "is",
    "so",
    "us",
    "to",
    "at",
    "if",
    "in",
    "it",
    "on",
    // note: this is not an exhaustive list of contractions, just popular ones
    /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, // contractions - can't we'd they're let's, etc
    /[A-Za-z]+[-][a-z]+/, // `no-way`, etc.
    /[A-Za-z][a-z]{2,}/ // allow capitalized words at beginning of sentences
  );
  // looking like plain text, more likely to be a comment
  mode.contains.push(
    {
      // TODO: how to include ", (, ) without breaking grammars that use these for
      // comment delimiters?
      // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
      // ---

      // this tries to find sequences of 3 english words in a row (without any
      // "programming" type syntax) this gives us a strong signal that we've
      // TRULY found a comment - vs perhaps scanning with the wrong language.
      // It's possible to find something that LOOKS like the start of the
      // comment - but then if there is no readable text - good chance it is a
      // false match and not a comment.
      //
      // for a visual example please see:
      // https://github.com/highlightjs/highlight.js/issues/2827

      begin: concat(
        /[ ]+/, // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
        '(',
        ENGLISH_WORD,
        /[.]?[:]?([.][ ]|[ ])/,
        '){3}') // look for 3 words in a row
    }
  );
  return mode;
};
const C_LINE_COMMENT_MODE = COMMENT('//', '$');
const C_BLOCK_COMMENT_MODE = COMMENT('/\\*', '\\*/');
const HASH_COMMENT_MODE = COMMENT('#', '$');
const NUMBER_MODE = {
  scope: 'number',
  begin: NUMBER_RE,
  relevance: 0
};
const C_NUMBER_MODE = {
  scope: 'number',
  begin: C_NUMBER_RE,
  relevance: 0
};
const BINARY_NUMBER_MODE = {
  scope: 'number',
  begin: BINARY_NUMBER_RE,
  relevance: 0
};
const REGEXP_MODE = {
  scope: "regexp",
  begin: /\/(?=[^/\n]*\/)/,
  end: /\/[gimuy]*/,
  contains: [
    BACKSLASH_ESCAPE,
    {
      begin: /\[/,
      end: /\]/,
      relevance: 0,
      contains: [BACKSLASH_ESCAPE]
    }
  ]
};
const TITLE_MODE = {
  scope: 'title',
  begin: IDENT_RE,
  relevance: 0
};
const UNDERSCORE_TITLE_MODE = {
  scope: 'title',
  begin: UNDERSCORE_IDENT_RE,
  relevance: 0
};
const METHOD_GUARD = {
  // excludes method names from keyword processing
  begin: '\\.\\s*' + UNDERSCORE_IDENT_RE,
  relevance: 0
};

/**
 * Adds end same as begin mechanics to a mode
 *
 * Your mode must include at least a single () match group as that first match
 * group is what is used for comparison
 * @param {Partial<Mode>} mode
 */
const END_SAME_AS_BEGIN = function(mode) {
  return Object.assign(mode,
    {
      /** @type {ModeCallback} */
      'on:begin': (m, resp) => { resp.data._beginMatch = m[1]; },
      /** @type {ModeCallback} */
      'on:end': (m, resp) => { if (resp.data._beginMatch !== m[1]) resp.ignoreMatch(); }
    });
};

var MODES = /*#__PURE__*/Object.freeze({
  __proto__: null,
  APOS_STRING_MODE: APOS_STRING_MODE,
  BACKSLASH_ESCAPE: BACKSLASH_ESCAPE,
  BINARY_NUMBER_MODE: BINARY_NUMBER_MODE,
  BINARY_NUMBER_RE: BINARY_NUMBER_RE,
  COMMENT: COMMENT,
  C_BLOCK_COMMENT_MODE: C_BLOCK_COMMENT_MODE,
  C_LINE_COMMENT_MODE: C_LINE_COMMENT_MODE,
  C_NUMBER_MODE: C_NUMBER_MODE,
  C_NUMBER_RE: C_NUMBER_RE,
  END_SAME_AS_BEGIN: END_SAME_AS_BEGIN,
  HASH_COMMENT_MODE: HASH_COMMENT_MODE,
  IDENT_RE: IDENT_RE,
  MATCH_NOTHING_RE: MATCH_NOTHING_RE,
  METHOD_GUARD: METHOD_GUARD,
  NUMBER_MODE: NUMBER_MODE,
  NUMBER_RE: NUMBER_RE,
  PHRASAL_WORDS_MODE: PHRASAL_WORDS_MODE,
  QUOTE_STRING_MODE: QUOTE_STRING_MODE,
  REGEXP_MODE: REGEXP_MODE,
  RE_STARTERS_RE: RE_STARTERS_RE,
  SHEBANG: SHEBANG,
  TITLE_MODE: TITLE_MODE,
  UNDERSCORE_IDENT_RE: UNDERSCORE_IDENT_RE,
  UNDERSCORE_TITLE_MODE: UNDERSCORE_TITLE_MODE
});

/**
@typedef {import('highlight.js').CallbackResponse} CallbackResponse
@typedef {import('highlight.js').CompilerExt} CompilerExt
*/

// Grammar extensions / plugins
// See: https://github.com/highlightjs/highlight.js/issues/2833

// Grammar extensions allow "syntactic sugar" to be added to the grammar modes
// without requiring any underlying changes to the compiler internals.

// `compileMatch` being the perfect small example of now allowing a grammar
// author to write `match` when they desire to match a single expression rather
// than being forced to use `begin`.  The extension then just moves `match` into
// `begin` when it runs.  Ie, no features have been added, but we've just made
// the experience of writing (and reading grammars) a little bit nicer.

// ------

// TODO: We need negative look-behind support to do this properly
/**
 * Skip a match if it has a preceding dot
 *
 * This is used for `beginKeywords` to prevent matching expressions such as
 * `bob.keyword.do()`. The mode compiler automatically wires this up as a
 * special _internal_ 'on:begin' callback for modes with `beginKeywords`
 * @param {RegExpMatchArray} match
 * @param {CallbackResponse} response
 */
function skipIfHasPrecedingDot(match, response) {
  const before = match.input[match.index - 1];
  if (before === ".") {
    response.ignoreMatch();
  }
}

/**
 *
 * @type {CompilerExt}
 */
function scopeClassName(mode, _parent) {
  // eslint-disable-next-line no-undefined
  if (mode.className !== undefined) {
    mode.scope = mode.className;
    delete mode.className;
  }
}

/**
 * `beginKeywords` syntactic sugar
 * @type {CompilerExt}
 */
function beginKeywords(mode, parent) {
  if (!parent) return;
  if (!mode.beginKeywords) return;

  // for languages with keywords that include non-word characters checking for
  // a word boundary is not sufficient, so instead we check for a word boundary
  // or whitespace - this does no harm in any case since our keyword engine
  // doesn't allow spaces in keywords anyways and we still check for the boundary
  // first
  mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')(?!\\.)(?=\\b|\\s)';
  mode.__beforeBegin = skipIfHasPrecedingDot;
  mode.keywords = mode.keywords || mode.beginKeywords;
  delete mode.beginKeywords;

  // prevents double relevance, the keywords themselves provide
  // relevance, the mode doesn't need to double it
  // eslint-disable-next-line no-undefined
  if (mode.relevance === undefined) mode.relevance = 0;
}

/**
 * Allow `illegal` to contain an array of illegal values
 * @type {CompilerExt}
 */
function compileIllegal(mode, _parent) {
  if (!Array.isArray(mode.illegal)) return;

  mode.illegal = either(...mode.illegal);
}

/**
 * `match` to match a single expression for readability
 * @type {CompilerExt}
 */
function compileMatch(mode, _parent) {
  if (!mode.match) return;
  if (mode.begin || mode.end) throw new Error("begin & end are not supported with match");

  mode.begin = mode.match;
  delete mode.match;
}

/**
 * provides the default 1 relevance to all modes
 * @type {CompilerExt}
 */
function compileRelevance(mode, _parent) {
  // eslint-disable-next-line no-undefined
  if (mode.relevance === undefined) mode.relevance = 1;
}

// allow beforeMatch to act as a "qualifier" for the match
// the full match begin must be [beforeMatch][begin]
const beforeMatchExt = (mode, parent) => {
  if (!mode.beforeMatch) return;
  // starts conflicts with endsParent which we need to make sure the child
  // rule is not matched multiple times
  if (mode.starts) throw new Error("beforeMatch cannot be used with starts");

  const originalMode = Object.assign({}, mode);
  Object.keys(mode).forEach((key) => { delete mode[key]; });

  mode.keywords = originalMode.keywords;
  mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
  mode.starts = {
    relevance: 0,
    contains: [
      Object.assign(originalMode, { endsParent: true })
    ]
  };
  mode.relevance = 0;

  delete originalMode.beforeMatch;
};

// keywords that should have no default relevance value
const COMMON_KEYWORDS = [
  'of',
  'and',
  'for',
  'in',
  'not',
  'or',
  'if',
  'then',
  'parent', // common variable name
  'list', // common variable name
  'value' // common variable name
];

const DEFAULT_KEYWORD_SCOPE = "keyword";

/**
 * Given raw keywords from a language definition, compile them.
 *
 * @param {string | Record<string,string|string[]> | Array<string>} rawKeywords
 * @param {boolean} caseInsensitive
 */
function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
  /** @type {import("highlight.js/private").KeywordDict} */
  const compiledKeywords = Object.create(null);

  // input can be a string of keywords, an array of keywords, or a object with
  // named keys representing scopeName (which can then point to a string or array)
  if (typeof rawKeywords === 'string') {
    compileList(scopeName, rawKeywords.split(" "));
  } else if (Array.isArray(rawKeywords)) {
    compileList(scopeName, rawKeywords);
  } else {
    Object.keys(rawKeywords).forEach(function(scopeName) {
      // collapse all our objects back into the parent object
      Object.assign(
        compiledKeywords,
        compileKeywords(rawKeywords[scopeName], caseInsensitive, scopeName)
      );
    });
  }
  return compiledKeywords;

  // ---

  /**
   * Compiles an individual list of keywords
   *
   * Ex: "for if when while|5"
   *
   * @param {string} scopeName
   * @param {Array<string>} keywordList
   */
  function compileList(scopeName, keywordList) {
    if (caseInsensitive) {
      keywordList = keywordList.map(x => x.toLowerCase());
    }
    keywordList.forEach(function(keyword) {
      const pair = keyword.split('|');
      compiledKeywords[pair[0]] = [scopeName, scoreForKeyword(pair[0], pair[1])];
    });
  }
}

/**
 * Returns the proper score for a given keyword
 *
 * Also takes into account comment keywords, which will be scored 0 UNLESS
 * another score has been manually assigned.
 * @param {string} keyword
 * @param {string} [providedScore]
 */
function scoreForKeyword(keyword, providedScore) {
  // manual scores always win over common keywords
  // so you can force a score of 1 if you really insist
  if (providedScore) {
    return Number(providedScore);
  }

  return commonKeyword(keyword) ? 0 : 1;
}

/**
 * Determines if a given keyword is common or not
 *
 * @param {string} keyword */
function commonKeyword(keyword) {
  return COMMON_KEYWORDS.includes(keyword.toLowerCase());
}

/*

For the reasoning behind this please see:
https://github.com/highlightjs/highlight.js/issues/2880#issuecomment-747275419

*/

/**
 * @type {Record<string, boolean>}
 */
const seenDeprecations = {};

/**
 * @param {string} message
 */
const error = (message) => {
  console.error(message);
};

/**
 * @param {string} message
 * @param {any} args
 */
const warn = (message, ...args) => {
  console.log(`WARN: ${message}`, ...args);
};

/**
 * @param {string} version
 * @param {string} message
 */
const deprecated = (version, message) => {
  if (seenDeprecations[`${version}/${message}`]) return;

  console.log(`Deprecated as of ${version}. ${message}`);
  seenDeprecations[`${version}/${message}`] = true;
};

/* eslint-disable no-throw-literal */

/**
@typedef {import('highlight.js').CompiledMode} CompiledMode
*/

const MultiClassError = new Error();

/**
 * Renumbers labeled scope names to account for additional inner match
 * groups that otherwise would break everything.
 *
 * Lets say we 3 match scopes:
 *
 *   { 1 => ..., 2 => ..., 3 => ... }
 *
 * So what we need is a clean match like this:
 *
 *   (a)(b)(c) => [ "a", "b", "c" ]
 *
 * But this falls apart with inner match groups:
 *
 * (a)(((b)))(c) => ["a", "b", "b", "b", "c" ]
 *
 * Our scopes are now "out of alignment" and we're repeating `b` 3 times.
 * What needs to happen is the numbers are remapped:
 *
 *   { 1 => ..., 2 => ..., 5 => ... }
 *
 * We also need to know that the ONLY groups that should be output
 * are 1, 2, and 5.  This function handles this behavior.
 *
 * @param {CompiledMode} mode
 * @param {Array<RegExp | string>} regexes
 * @param {{key: "beginScope"|"endScope"}} opts
 */
function remapScopeNames(mode, regexes, { key }) {
  let offset = 0;
  const scopeNames = mode[key];
  /** @type Record<number,boolean> */
  const emit = {};
  /** @type Record<number,string> */
  const positions = {};

  for (let i = 1; i <= regexes.length; i++) {
    positions[i + offset] = scopeNames[i];
    emit[i + offset] = true;
    offset += countMatchGroups(regexes[i - 1]);
  }
  // we use _emit to keep track of which match groups are "top-level" to avoid double
  // output from inside match groups
  mode[key] = positions;
  mode[key]._emit = emit;
  mode[key]._multi = true;
}

/**
 * @param {CompiledMode} mode
 */
function beginMultiClass(mode) {
  if (!Array.isArray(mode.begin)) return;

  if (mode.skip || mode.excludeBegin || mode.returnBegin) {
    error("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
    throw MultiClassError;
  }

  if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
    error("beginScope must be object");
    throw MultiClassError;
  }

  remapScopeNames(mode, mode.begin, { key: "beginScope" });
  mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
}

/**
 * @param {CompiledMode} mode
 */
function endMultiClass(mode) {
  if (!Array.isArray(mode.end)) return;

  if (mode.skip || mode.excludeEnd || mode.returnEnd) {
    error("skip, excludeEnd, returnEnd not compatible with endScope: {}");
    throw MultiClassError;
  }

  if (typeof mode.endScope !== "object" || mode.endScope === null) {
    error("endScope must be object");
    throw MultiClassError;
  }

  remapScopeNames(mode, mode.end, { key: "endScope" });
  mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
}

/**
 * this exists only to allow `scope: {}` to be used beside `match:`
 * Otherwise `beginScope` would necessary and that would look weird

  {
    match: [ /def/, /\w+/ ]
    scope: { 1: "keyword" , 2: "title" }
  }

 * @param {CompiledMode} mode
 */
function scopeSugar(mode) {
  if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
    mode.beginScope = mode.scope;
    delete mode.scope;
  }
}

/**
 * @param {CompiledMode} mode
 */
function MultiClass(mode) {
  scopeSugar(mode);

  if (typeof mode.beginScope === "string") {
    mode.beginScope = { _wrap: mode.beginScope };
  }
  if (typeof mode.endScope === "string") {
    mode.endScope = { _wrap: mode.endScope };
  }

  beginMultiClass(mode);
  endMultiClass(mode);
}

/**
@typedef {import('highlight.js').Mode} Mode
@typedef {import('highlight.js').CompiledMode} CompiledMode
@typedef {import('highlight.js').Language} Language
@typedef {import('highlight.js').HLJSPlugin} HLJSPlugin
@typedef {import('highlight.js').CompiledLanguage} CompiledLanguage
*/

// compilation

/**
 * Compiles a language definition result
 *
 * Given the raw result of a language definition (Language), compiles this so
 * that it is ready for highlighting code.
 * @param {Language} language
 * @returns {CompiledLanguage}
 */
function compileLanguage(language) {
  /**
   * Builds a regex with the case sensitivity of the current language
   *
   * @param {RegExp | string} value
   * @param {boolean} [global]
   */
  function langRe(value, global) {
    return new RegExp(
      source(value),
      'm'
      + (language.case_insensitive ? 'i' : '')
      + (language.unicodeRegex ? 'u' : '')
      + (global ? 'g' : '')
    );
  }

  /**
    Stores multiple regular expressions and allows you to quickly search for
    them all in a string simultaneously - returning the first match.  It does
    this by creating a huge (a|b|c) regex - each individual item wrapped with ()
    and joined by `|` - using match groups to track position.  When a match is
    found checking which position in the array has content allows us to figure
    out which of the original regexes / match groups triggered the match.

    The match object itself (the result of `Regex.exec`) is returned but also
    enhanced by merging in any meta-data that was registered with the regex.
    This is how we keep track of which mode matched, and what type of rule
    (`illegal`, `begin`, end, etc).
  */
  class MultiRegex {
    constructor() {
      this.matchIndexes = {};
      // @ts-ignore
      this.regexes = [];
      this.matchAt = 1;
      this.position = 0;
    }

    // @ts-ignore
    addRule(re, opts) {
      opts.position = this.position++;
      // @ts-ignore
      this.matchIndexes[this.matchAt] = opts;
      this.regexes.push([opts, re]);
      this.matchAt += countMatchGroups(re) + 1;
    }

    compile() {
      if (this.regexes.length === 0) {
        // avoids the need to check length every time exec is called
        // @ts-ignore
        this.exec = () => null;
      }
      const terminators = this.regexes.map(el => el[1]);
      this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: '|' }), true);
      this.lastIndex = 0;
    }

    /** @param {string} s */
    exec(s) {
      this.matcherRe.lastIndex = this.lastIndex;
      const match = this.matcherRe.exec(s);
      if (!match) { return null; }

      // eslint-disable-next-line no-undefined
      const i = match.findIndex((el, i) => i > 0 && el !== undefined);
      // @ts-ignore
      const matchData = this.matchIndexes[i];
      // trim off any earlier non-relevant match groups (ie, the other regex
      // match groups that make up the multi-matcher)
      match.splice(0, i);

      return Object.assign(match, matchData);
    }
  }

  /*
    Created to solve the key deficiently with MultiRegex - there is no way to
    test for multiple matches at a single location.  Why would we need to do
    that?  In the future a more dynamic engine will allow certain matches to be
    ignored.  An example: if we matched say the 3rd regex in a large group but
    decided to ignore it - we'd need to started testing again at the 4th
    regex... but MultiRegex itself gives us no real way to do that.

    So what this class creates MultiRegexs on the fly for whatever search
    position they are needed.

    NOTE: These additional MultiRegex objects are created dynamically.  For most
    grammars most of the time we will never actually need anything more than the
    first MultiRegex - so this shouldn't have too much overhead.

    Say this is our search group, and we match regex3, but wish to ignore it.

      regex1 | regex2 | regex3 | regex4 | regex5    ' ie, startAt = 0

    What we need is a new MultiRegex that only includes the remaining
    possibilities:

      regex4 | regex5                               ' ie, startAt = 3

    This class wraps all that complexity up in a simple API... `startAt` decides
    where in the array of expressions to start doing the matching. It
    auto-increments, so if a match is found at position 2, then startAt will be
    set to 3.  If the end is reached startAt will return to 0.

    MOST of the time the parser will be setting startAt manually to 0.
  */
  class ResumableMultiRegex {
    constructor() {
      // @ts-ignore
      this.rules = [];
      // @ts-ignore
      this.multiRegexes = [];
      this.count = 0;

      this.lastIndex = 0;
      this.regexIndex = 0;
    }

    // @ts-ignore
    getMatcher(index) {
      if (this.multiRegexes[index]) return this.multiRegexes[index];

      const matcher = new MultiRegex();
      this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
      matcher.compile();
      this.multiRegexes[index] = matcher;
      return matcher;
    }

    resumingScanAtSamePosition() {
      return this.regexIndex !== 0;
    }

    considerAll() {
      this.regexIndex = 0;
    }

    // @ts-ignore
    addRule(re, opts) {
      this.rules.push([re, opts]);
      if (opts.type === "begin") this.count++;
    }

    /** @param {string} s */
    exec(s) {
      const m = this.getMatcher(this.regexIndex);
      m.lastIndex = this.lastIndex;
      let result = m.exec(s);

      // The following is because we have no easy way to say "resume scanning at the
      // existing position but also skip the current rule ONLY". What happens is
      // all prior rules are also skipped which can result in matching the wrong
      // thing. Example of matching "booger":

      // our matcher is [string, "booger", number]
      //
      // ....booger....

      // if "booger" is ignored then we'd really need a regex to scan from the
      // SAME position for only: [string, number] but ignoring "booger" (if it
      // was the first match), a simple resume would scan ahead who knows how
      // far looking only for "number", ignoring potential string matches (or
      // future "booger" matches that might be valid.)

      // So what we do: We execute two matchers, one resuming at the same
      // position, but the second full matcher starting at the position after:

      //     /--- resume first regex match here (for [number])
      //     |/---- full match here for [string, "booger", number]
      //     vv
      // ....booger....

      // Which ever results in a match first is then used. So this 3-4 step
      // process essentially allows us to say "match at this position, excluding
      // a prior rule that was ignored".
      //
      // 1. Match "booger" first, ignore. Also proves that [string] does non match.
      // 2. Resume matching for [number]
      // 3. Match at index + 1 for [string, "booger", number]
      // 4. If #2 and #3 result in matches, which came first?
      if (this.resumingScanAtSamePosition()) {
        if (result && result.index === this.lastIndex) ; else { // use the second matcher result
          const m2 = this.getMatcher(0);
          m2.lastIndex = this.lastIndex + 1;
          result = m2.exec(s);
        }
      }

      if (result) {
        this.regexIndex += result.position + 1;
        if (this.regexIndex === this.count) {
          // wrap-around to considering all matches again
          this.considerAll();
        }
      }

      return result;
    }
  }

  /**
   * Given a mode, builds a huge ResumableMultiRegex that can be used to walk
   * the content and find matches.
   *
   * @param {CompiledMode} mode
   * @returns {ResumableMultiRegex}
   */
  function buildModeRegex(mode) {
    const mm = new ResumableMultiRegex();

    mode.contains.forEach(term => mm.addRule(term.begin, { rule: term, type: "begin" }));

    if (mode.terminatorEnd) {
      mm.addRule(mode.terminatorEnd, { type: "end" });
    }
    if (mode.illegal) {
      mm.addRule(mode.illegal, { type: "illegal" });
    }

    return mm;
  }

  /** skip vs abort vs ignore
   *
   * @skip   - The mode is still entered and exited normally (and contains rules apply),
   *           but all content is held and added to the parent buffer rather than being
   *           output when the mode ends.  Mostly used with `sublanguage` to build up
   *           a single large buffer than can be parsed by sublanguage.
   *
   *             - The mode begin ands ends normally.
   *             - Content matched is added to the parent mode buffer.
   *             - The parser cursor is moved forward normally.
   *
   * @abort  - A hack placeholder until we have ignore.  Aborts the mode (as if it
   *           never matched) but DOES NOT continue to match subsequent `contains`
   *           modes.  Abort is bad/suboptimal because it can result in modes
   *           farther down not getting applied because an earlier rule eats the
   *           content but then aborts.
   *
   *             - The mode does not begin.
   *             - Content matched by `begin` is added to the mode buffer.
   *             - The parser cursor is moved forward accordingly.
   *
   * @ignore - Ignores the mode (as if it never matched) and continues to match any
   *           subsequent `contains` modes.  Ignore isn't technically possible with
   *           the current parser implementation.
   *
   *             - The mode does not begin.
   *             - Content matched by `begin` is ignored.
   *             - The parser cursor is not moved forward.
   */

  /**
   * Compiles an individual mode
   *
   * This can raise an error if the mode contains certain detectable known logic
   * issues.
   * @param {Mode} mode
   * @param {CompiledMode | null} [parent]
   * @returns {CompiledMode | never}
   */
  function compileMode(mode, parent) {
    const cmode = /** @type CompiledMode */ (mode);
    if (mode.isCompiled) return cmode;

    [
      scopeClassName,
      // do this early so compiler extensions generally don't have to worry about
      // the distinction between match/begin
      compileMatch,
      MultiClass,
      beforeMatchExt
    ].forEach(ext => ext(mode, parent));

    language.compilerExtensions.forEach(ext => ext(mode, parent));

    // __beforeBegin is considered private API, internal use only
    mode.__beforeBegin = null;

    [
      beginKeywords,
      // do this later so compiler extensions that come earlier have access to the
      // raw array if they wanted to perhaps manipulate it, etc.
      compileIllegal,
      // default to 1 relevance if not specified
      compileRelevance
    ].forEach(ext => ext(mode, parent));

    mode.isCompiled = true;

    let keywordPattern = null;
    if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
      // we need a copy because keywords might be compiled multiple times
      // so we can't go deleting $pattern from the original on the first
      // pass
      mode.keywords = Object.assign({}, mode.keywords);
      keywordPattern = mode.keywords.$pattern;
      delete mode.keywords.$pattern;
    }
    keywordPattern = keywordPattern || /\w+/;

    if (mode.keywords) {
      mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
    }

    cmode.keywordPatternRe = langRe(keywordPattern, true);

    if (parent) {
      if (!mode.begin) mode.begin = /\B|\b/;
      cmode.beginRe = langRe(cmode.begin);
      if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
      if (mode.end) cmode.endRe = langRe(cmode.end);
      cmode.terminatorEnd = source(cmode.end) || '';
      if (mode.endsWithParent && parent.terminatorEnd) {
        cmode.terminatorEnd += (mode.end ? '|' : '') + parent.terminatorEnd;
      }
    }
    if (mode.illegal) cmode.illegalRe = langRe(/** @type {RegExp | string} */ (mode.illegal));
    if (!mode.contains) mode.contains = [];

    mode.contains = [].concat(...mode.contains.map(function(c) {
      return expandOrCloneMode(c === 'self' ? mode : c);
    }));
    mode.contains.forEach(function(c) { compileMode(/** @type Mode */ (c), cmode); });

    if (mode.starts) {
      compileMode(mode.starts, parent);
    }

    cmode.matcher = buildModeRegex(cmode);
    return cmode;
  }

  if (!language.compilerExtensions) language.compilerExtensions = [];

  // self is not valid at the top-level
  if (language.contains && language.contains.includes('self')) {
    throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
  }

  // we need a null object, which inherit will guarantee
  language.classNameAliases = inherit$1(language.classNameAliases || {});

  return compileMode(/** @type Mode */ (language));
}

/**
 * Determines if a mode has a dependency on it's parent or not
 *
 * If a mode does have a parent dependency then often we need to clone it if
 * it's used in multiple places so that each copy points to the correct parent,
 * where-as modes without a parent can often safely be re-used at the bottom of
 * a mode chain.
 *
 * @param {Mode | null} mode
 * @returns {boolean} - is there a dependency on the parent?
 * */
function dependencyOnParent(mode) {
  if (!mode) return false;

  return mode.endsWithParent || dependencyOnParent(mode.starts);
}

/**
 * Expands a mode or clones it if necessary
 *
 * This is necessary for modes with parental dependenceis (see notes on
 * `dependencyOnParent`) and for nodes that have `variants` - which must then be
 * exploded into their own individual modes at compile time.
 *
 * @param {Mode} mode
 * @returns {Mode | Mode[]}
 * */
function expandOrCloneMode(mode) {
  if (mode.variants && !mode.cachedVariants) {
    mode.cachedVariants = mode.variants.map(function(variant) {
      return inherit$1(mode, { variants: null }, variant);
    });
  }

  // EXPAND
  // if we have variants then essentially "replace" the mode with the variants
  // this happens in compileMode, where this function is called from
  if (mode.cachedVariants) {
    return mode.cachedVariants;
  }

  // CLONE
  // if we have dependencies on parents then we need a unique
  // instance of ourselves, so we can be reused with many
  // different parents without issue
  if (dependencyOnParent(mode)) {
    return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
  }

  if (Object.isFrozen(mode)) {
    return inherit$1(mode);
  }

  // no special dependency issues, just return ourselves
  return mode;
}

var version = "11.9.0";

class HTMLInjectionError extends Error {
  constructor(reason, html) {
    super(reason);
    this.name = "HTMLInjectionError";
    this.html = html;
  }
}

/*
Syntax highlighting with language autodetection.
https://highlightjs.org/
*/



/**
@typedef {import('highlight.js').Mode} Mode
@typedef {import('highlight.js').CompiledMode} CompiledMode
@typedef {import('highlight.js').CompiledScope} CompiledScope
@typedef {import('highlight.js').Language} Language
@typedef {import('highlight.js').HLJSApi} HLJSApi
@typedef {import('highlight.js').HLJSPlugin} HLJSPlugin
@typedef {import('highlight.js').PluginEvent} PluginEvent
@typedef {import('highlight.js').HLJSOptions} HLJSOptions
@typedef {import('highlight.js').LanguageFn} LanguageFn
@typedef {import('highlight.js').HighlightedHTMLElement} HighlightedHTMLElement
@typedef {import('highlight.js').BeforeHighlightContext} BeforeHighlightContext
@typedef {import('highlight.js/private').MatchType} MatchType
@typedef {import('highlight.js/private').KeywordData} KeywordData
@typedef {import('highlight.js/private').EnhancedMatch} EnhancedMatch
@typedef {import('highlight.js/private').AnnotatedError} AnnotatedError
@typedef {import('highlight.js').AutoHighlightResult} AutoHighlightResult
@typedef {import('highlight.js').HighlightOptions} HighlightOptions
@typedef {import('highlight.js').HighlightResult} HighlightResult
*/


const escape = escapeHTML;
const inherit = inherit$1;
const NO_MATCH = Symbol("nomatch");
const MAX_KEYWORD_HITS = 7;

/**
 * @param {any} hljs - object that is extended (legacy)
 * @returns {HLJSApi}
 */
const HLJS = function(hljs) {
  // Global internal variables used within the highlight.js library.
  /** @type {Record<string, Language>} */
  const languages = Object.create(null);
  /** @type {Record<string, string>} */
  const aliases = Object.create(null);
  /** @type {HLJSPlugin[]} */
  const plugins = [];

  // safe/production mode - swallows more errors, tries to keep running
  // even if a single syntax or parse hits a fatal error
  let SAFE_MODE = true;
  const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
  /** @type {Language} */
  const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: 'Plain text', contains: [] };

  // Global options used when within external APIs. This is modified when
  // calling the `hljs.configure` function.
  /** @type HLJSOptions */
  let options = {
    ignoreUnescapedHTML: false,
    throwUnescapedHTML: false,
    noHighlightRe: /^(no-?highlight)$/i,
    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
    classPrefix: 'hljs-',
    cssSelector: 'pre code',
    languages: null,
    // beta configuration options, subject to change, welcome to discuss
    // https://github.com/highlightjs/highlight.js/issues/1086
    __emitter: TokenTreeEmitter
  };

  /* Utility functions */

  /**
   * Tests a language name to see if highlighting should be skipped
   * @param {string} languageName
   */
  function shouldNotHighlight(languageName) {
    return options.noHighlightRe.test(languageName);
  }

  /**
   * @param {HighlightedHTMLElement} block - the HTML element to determine language for
   */
  function blockLanguage(block) {
    let classes = block.className + ' ';

    classes += block.parentNode ? block.parentNode.className : '';

    // language-* takes precedence over non-prefixed class names.
    const match = options.languageDetectRe.exec(classes);
    if (match) {
      const language = getLanguage(match[1]);
      if (!language) {
        warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
        warn("Falling back to no-highlight mode for this block.", block);
      }
      return language ? match[1] : 'no-highlight';
    }

    return classes
      .split(/\s+/)
      .find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
  }

  /**
   * Core highlighting function.
   *
   * OLD API
   * highlight(lang, code, ignoreIllegals, continuation)
   *
   * NEW API
   * highlight(code, {lang, ignoreIllegals})
   *
   * @param {string} codeOrLanguageName - the language to use for highlighting
   * @param {string | HighlightOptions} optionsOrCode - the code to highlight
   * @param {boolean} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
   *
   * @returns {HighlightResult} Result - an object that represents the result
   * @property {string} language - the language name
   * @property {number} relevance - the relevance score
   * @property {string} value - the highlighted HTML code
   * @property {string} code - the original raw code
   * @property {CompiledMode} top - top of the current mode stack
   * @property {boolean} illegal - indicates whether any illegal matches were found
  */
  function highlight(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
    let code = "";
    let languageName = "";
    if (typeof optionsOrCode === "object") {
      code = codeOrLanguageName;
      ignoreIllegals = optionsOrCode.ignoreIllegals;
      languageName = optionsOrCode.language;
    } else {
      // old API
      deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
      deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
      languageName = codeOrLanguageName;
      code = optionsOrCode;
    }

    // https://github.com/highlightjs/highlight.js/issues/3149
    // eslint-disable-next-line no-undefined
    if (ignoreIllegals === undefined) { ignoreIllegals = true; }

    /** @type {BeforeHighlightContext} */
    const context = {
      code,
      language: languageName
    };
    // the plugin can change the desired language or the code to be highlighted
    // just be changing the object it was passed
    fire("before:highlight", context);

    // a before plugin can usurp the result completely by providing it's own
    // in which case we don't even need to call highlight
    const result = context.result
      ? context.result
      : _highlight(context.language, context.code, ignoreIllegals);

    result.code = context.code;
    // the plugin can change anything in result to suite it
    fire("after:highlight", result);

    return result;
  }

  /**
   * private highlight that's used internally and does not fire callbacks
   *
   * @param {string} languageName - the language to use for highlighting
   * @param {string} codeToHighlight - the code to highlight
   * @param {boolean?} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
   * @param {CompiledMode?} [continuation] - current continuation mode, if any
   * @returns {HighlightResult} - result of the highlight operation
  */
  function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
    const keywordHits = Object.create(null);

    /**
     * Return keyword data if a match is a keyword
     * @param {CompiledMode} mode - current mode
     * @param {string} matchText - the textual match
     * @returns {KeywordData | false}
     */
    function keywordData(mode, matchText) {
      return mode.keywords[matchText];
    }

    function processKeywords() {
      if (!top.keywords) {
        emitter.addText(modeBuffer);
        return;
      }

      let lastIndex = 0;
      top.keywordPatternRe.lastIndex = 0;
      let match = top.keywordPatternRe.exec(modeBuffer);
      let buf = "";

      while (match) {
        buf += modeBuffer.substring(lastIndex, match.index);
        const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
        const data = keywordData(top, word);
        if (data) {
          const [kind, keywordRelevance] = data;
          emitter.addText(buf);
          buf = "";

          keywordHits[word] = (keywordHits[word] || 0) + 1;
          if (keywordHits[word] <= MAX_KEYWORD_HITS) relevance += keywordRelevance;
          if (kind.startsWith("_")) {
            // _ implied for relevance only, do not highlight
            // by applying a class name
            buf += match[0];
          } else {
            const cssClass = language.classNameAliases[kind] || kind;
            emitKeyword(match[0], cssClass);
          }
        } else {
          buf += match[0];
        }
        lastIndex = top.keywordPatternRe.lastIndex;
        match = top.keywordPatternRe.exec(modeBuffer);
      }
      buf += modeBuffer.substring(lastIndex);
      emitter.addText(buf);
    }

    function processSubLanguage() {
      if (modeBuffer === "") return;
      /** @type HighlightResult */
      let result = null;

      if (typeof top.subLanguage === 'string') {
        if (!languages[top.subLanguage]) {
          emitter.addText(modeBuffer);
          return;
        }
        result = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
        continuations[top.subLanguage] = /** @type {CompiledMode} */ (result._top);
      } else {
        result = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
      }

      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Use case in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        relevance += result.relevance;
      }
      emitter.__addSublanguage(result._emitter, result.language);
    }

    function processBuffer() {
      if (top.subLanguage != null) {
        processSubLanguage();
      } else {
        processKeywords();
      }
      modeBuffer = '';
    }

    /**
     * @param {string} text
     * @param {string} scope
     */
    function emitKeyword(keyword, scope) {
      if (keyword === "") return;

      emitter.startScope(scope);
      emitter.addText(keyword);
      emitter.endScope();
    }

    /**
     * @param {CompiledScope} scope
     * @param {RegExpMatchArray} match
     */
    function emitMultiClass(scope, match) {
      let i = 1;
      const max = match.length - 1;
      while (i <= max) {
        if (!scope._emit[i]) { i++; continue; }
        const klass = language.classNameAliases[scope[i]] || scope[i];
        const text = match[i];
        if (klass) {
          emitKeyword(text, klass);
        } else {
          modeBuffer = text;
          processKeywords();
          modeBuffer = "";
        }
        i++;
      }
    }

    /**
     * @param {CompiledMode} mode - new mode to start
     * @param {RegExpMatchArray} match
     */
    function startNewMode(mode, match) {
      if (mode.scope && typeof mode.scope === "string") {
        emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
      }
      if (mode.beginScope) {
        // beginScope just wraps the begin match itself in a scope
        if (mode.beginScope._wrap) {
          emitKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
          modeBuffer = "";
        } else if (mode.beginScope._multi) {
          // at this point modeBuffer should just be the match
          emitMultiClass(mode.beginScope, match);
          modeBuffer = "";
        }
      }

      top = Object.create(mode, { parent: { value: top } });
      return top;
    }

    /**
     * @param {CompiledMode } mode - the mode to potentially end
     * @param {RegExpMatchArray} match - the latest match
     * @param {string} matchPlusRemainder - match plus remainder of content
     * @returns {CompiledMode | void} - the next mode, or if void continue on in current mode
     */
    function endOfMode(mode, match, matchPlusRemainder) {
      let matched = startsWith(mode.endRe, matchPlusRemainder);

      if (matched) {
        if (mode["on:end"]) {
          const resp = new Response(mode);
          mode["on:end"](match, resp);
          if (resp.isMatchIgnored) matched = false;
        }

        if (matched) {
          while (mode.endsParent && mode.parent) {
            mode = mode.parent;
          }
          return mode;
        }
      }
      // even if on:end fires an `ignore` it's still possible
      // that we might trigger the end node because of a parent mode
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, match, matchPlusRemainder);
      }
    }

    /**
     * Handle matching but then ignoring a sequence of text
     *
     * @param {string} lexeme - string containing full match text
     */
    function doIgnore(lexeme) {
      if (top.matcher.regexIndex === 0) {
        // no more regexes to potentially match here, so we move the cursor forward one
        // space
        modeBuffer += lexeme[0];
        return 1;
      } else {
        // no need to move the cursor, we still have additional regexes to try and
        // match at this very spot
        resumeScanAtSamePosition = true;
        return 0;
      }
    }

    /**
     * Handle the start of a new potential mode match
     *
     * @param {EnhancedMatch} match - the current match
     * @returns {number} how far to advance the parse cursor
     */
    function doBeginMatch(match) {
      const lexeme = match[0];
      const newMode = match.rule;

      const resp = new Response(newMode);
      // first internal before callbacks, then the public ones
      const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
      for (const cb of beforeCallbacks) {
        if (!cb) continue;
        cb(match, resp);
        if (resp.isMatchIgnored) return doIgnore(lexeme);
      }

      if (newMode.skip) {
        modeBuffer += lexeme;
      } else {
        if (newMode.excludeBegin) {
          modeBuffer += lexeme;
        }
        processBuffer();
        if (!newMode.returnBegin && !newMode.excludeBegin) {
          modeBuffer = lexeme;
        }
      }
      startNewMode(newMode, match);
      return newMode.returnBegin ? 0 : lexeme.length;
    }

    /**
     * Handle the potential end of mode
     *
     * @param {RegExpMatchArray} match - the current match
     */
    function doEndMatch(match) {
      const lexeme = match[0];
      const matchPlusRemainder = codeToHighlight.substring(match.index);

      const endMode = endOfMode(top, match, matchPlusRemainder);
      if (!endMode) { return NO_MATCH; }

      const origin = top;
      if (top.endScope && top.endScope._wrap) {
        processBuffer();
        emitKeyword(lexeme, top.endScope._wrap);
      } else if (top.endScope && top.endScope._multi) {
        processBuffer();
        emitMultiClass(top.endScope, match);
      } else if (origin.skip) {
        modeBuffer += lexeme;
      } else {
        if (!(origin.returnEnd || origin.excludeEnd)) {
          modeBuffer += lexeme;
        }
        processBuffer();
        if (origin.excludeEnd) {
          modeBuffer = lexeme;
        }
      }
      do {
        if (top.scope) {
          emitter.closeNode();
        }
        if (!top.skip && !top.subLanguage) {
          relevance += top.relevance;
        }
        top = top.parent;
      } while (top !== endMode.parent);
      if (endMode.starts) {
        startNewMode(endMode.starts, match);
      }
      return origin.returnEnd ? 0 : lexeme.length;
    }

    function processContinuations() {
      const list = [];
      for (let current = top; current !== language; current = current.parent) {
        if (current.scope) {
          list.unshift(current.scope);
        }
      }
      list.forEach(item => emitter.openNode(item));
    }

    /** @type {{type?: MatchType, index?: number, rule?: Mode}}} */
    let lastMatch = {};

    /**
     *  Process an individual match
     *
     * @param {string} textBeforeMatch - text preceding the match (since the last match)
     * @param {EnhancedMatch} [match] - the match itself
     */
    function processLexeme(textBeforeMatch, match) {
      const lexeme = match && match[0];

      // add non-matched text to the current mode buffer
      modeBuffer += textBeforeMatch;

      if (lexeme == null) {
        processBuffer();
        return 0;
      }

      // we've found a 0 width match and we're stuck, so we need to advance
      // this happens when we have badly behaved rules that have optional matchers to the degree that
      // sometimes they can end up matching nothing at all
      // Ref: https://github.com/highlightjs/highlight.js/issues/2140
      if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
        // spit the "skipped" character that our regex choked on back into the output sequence
        modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
        if (!SAFE_MODE) {
          /** @type {AnnotatedError} */
          const err = new Error(`0 width match regex (${languageName})`);
          err.languageName = languageName;
          err.badRule = lastMatch.rule;
          throw err;
        }
        return 1;
      }
      lastMatch = match;

      if (match.type === "begin") {
        return doBeginMatch(match);
      } else if (match.type === "illegal" && !ignoreIllegals) {
        // illegal match, we do not continue processing
        /** @type {AnnotatedError} */
        const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || '<unnamed>') + '"');
        err.mode = top;
        throw err;
      } else if (match.type === "end") {
        const processed = doEndMatch(match);
        if (processed !== NO_MATCH) {
          return processed;
        }
      }

      // edge case for when illegal matches $ (end of line) which is technically
      // a 0 width match but not a begin/end match so it's not caught by the
      // first handler (when ignoreIllegals is true)
      if (match.type === "illegal" && lexeme === "") {
        // advance so we aren't stuck in an infinite loop
        return 1;
      }

      // infinite loops are BAD, this is a last ditch catch all. if we have a
      // decent number of iterations yet our index (cursor position in our
      // parsing) still 3x behind our index then something is very wrong
      // so we bail
      if (iterations > 100000 && iterations > match.index * 3) {
        const err = new Error('potential infinite loop, way more iterations than matches');
        throw err;
      }

      /*
      Why might be find ourselves here?  An potential end match that was
      triggered but could not be completed.  IE, `doEndMatch` returned NO_MATCH.
      (this could be because a callback requests the match be ignored, etc)

      This causes no real harm other than stopping a few times too many.
      */

      modeBuffer += lexeme;
      return lexeme.length;
    }

    const language = getLanguage(languageName);
    if (!language) {
      error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
      throw new Error('Unknown language: "' + languageName + '"');
    }

    const md = compileLanguage(language);
    let result = '';
    /** @type {CompiledMode} */
    let top = continuation || md;
    /** @type Record<string,CompiledMode> */
    const continuations = {}; // keep continuations for sub-languages
    const emitter = new options.__emitter(options);
    processContinuations();
    let modeBuffer = '';
    let relevance = 0;
    let index = 0;
    let iterations = 0;
    let resumeScanAtSamePosition = false;

    try {
      if (!language.__emitTokens) {
        top.matcher.considerAll();

        for (;;) {
          iterations++;
          if (resumeScanAtSamePosition) {
            // only regexes not matched previously will now be
            // considered for a potential match
            resumeScanAtSamePosition = false;
          } else {
            top.matcher.considerAll();
          }
          top.matcher.lastIndex = index;

          const match = top.matcher.exec(codeToHighlight);
          // console.log("match", match[0], match.rule && match.rule.begin)

          if (!match) break;

          const beforeMatch = codeToHighlight.substring(index, match.index);
          const processedCount = processLexeme(beforeMatch, match);
          index = match.index + processedCount;
        }
        processLexeme(codeToHighlight.substring(index));
      } else {
        language.__emitTokens(codeToHighlight, emitter);
      }

      emitter.finalize();
      result = emitter.toHTML();

      return {
        language: languageName,
        value: result,
        relevance,
        illegal: false,
        _emitter: emitter,
        _top: top
      };
    } catch (err) {
      if (err.message && err.message.includes('Illegal')) {
        return {
          language: languageName,
          value: escape(codeToHighlight),
          illegal: true,
          relevance: 0,
          _illegalBy: {
            message: err.message,
            index,
            context: codeToHighlight.slice(index - 100, index + 100),
            mode: err.mode,
            resultSoFar: result
          },
          _emitter: emitter
        };
      } else if (SAFE_MODE) {
        return {
          language: languageName,
          value: escape(codeToHighlight),
          illegal: false,
          relevance: 0,
          errorRaised: err,
          _emitter: emitter,
          _top: top
        };
      } else {
        throw err;
      }
    }
  }

  /**
   * returns a valid highlight result, without actually doing any actual work,
   * auto highlight starts with this and it's possible for small snippets that
   * auto-detection may not find a better match
   * @param {string} code
   * @returns {HighlightResult}
   */
  function justTextHighlightResult(code) {
    const result = {
      value: escape(code),
      illegal: false,
      relevance: 0,
      _top: PLAINTEXT_LANGUAGE,
      _emitter: new options.__emitter(options)
    };
    result._emitter.addText(code);
    return result;
  }

  /**
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - secondBest (object with the same structure for second-best heuristically
    detected language, may be absent)

    @param {string} code
    @param {Array<string>} [languageSubset]
    @returns {AutoHighlightResult}
  */
  function highlightAuto(code, languageSubset) {
    languageSubset = languageSubset || options.languages || Object.keys(languages);
    const plaintext = justTextHighlightResult(code);

    const results = languageSubset.filter(getLanguage).filter(autoDetection).map(name =>
      _highlight(name, code, false)
    );
    results.unshift(plaintext); // plaintext is always an option

    const sorted = results.sort((a, b) => {
      // sort base on relevance
      if (a.relevance !== b.relevance) return b.relevance - a.relevance;

      // always award the tie to the base language
      // ie if C++ and Arduino are tied, it's more likely to be C++
      if (a.language && b.language) {
        if (getLanguage(a.language).supersetOf === b.language) {
          return 1;
        } else if (getLanguage(b.language).supersetOf === a.language) {
          return -1;
        }
      }

      // otherwise say they are equal, which has the effect of sorting on
      // relevance while preserving the original ordering - which is how ties
      // have historically been settled, ie the language that comes first always
      // wins in the case of a tie
      return 0;
    });

    const [best, secondBest] = sorted;

    /** @type {AutoHighlightResult} */
    const result = best;
    result.secondBest = secondBest;

    return result;
  }

  /**
   * Builds new class name for block given the language name
   *
   * @param {HTMLElement} element
   * @param {string} [currentLang]
   * @param {string} [resultLang]
   */
  function updateClassName(element, currentLang, resultLang) {
    const language = (currentLang && aliases[currentLang]) || resultLang;

    element.classList.add("hljs");
    element.classList.add(`language-${language}`);
  }

  /**
   * Applies highlighting to a DOM node containing code.
   *
   * @param {HighlightedHTMLElement} element - the HTML element to highlight
  */
  function highlightElement(element) {
    /** @type HTMLElement */
    let node = null;
    const language = blockLanguage(element);

    if (shouldNotHighlight(language)) return;

    fire("before:highlightElement",
      { el: element, language });

    if (element.dataset.highlighted) {
      console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", element);
      return;
    }

    // we should be all text, no child nodes (unescaped HTML) - this is possibly
    // an HTML injection attack - it's likely too late if this is already in
    // production (the code has likely already done its damage by the time
    // we're seeing it)... but we yell loudly about this so that hopefully it's
    // more likely to be caught in development before making it to production
    if (element.children.length > 0) {
      if (!options.ignoreUnescapedHTML) {
        console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
        console.warn("https://github.com/highlightjs/highlight.js/wiki/security");
        console.warn("The element with unescaped HTML:");
        console.warn(element);
      }
      if (options.throwUnescapedHTML) {
        const err = new HTMLInjectionError(
          "One of your code blocks includes unescaped HTML.",
          element.innerHTML
        );
        throw err;
      }
    }

    node = element;
    const text = node.textContent;
    const result = language ? highlight(text, { language, ignoreIllegals: true }) : highlightAuto(text);

    element.innerHTML = result.value;
    element.dataset.highlighted = "yes";
    updateClassName(element, language, result.language);
    element.result = {
      language: result.language,
      // TODO: remove with version 11.0
      re: result.relevance,
      relevance: result.relevance
    };
    if (result.secondBest) {
      element.secondBest = {
        language: result.secondBest.language,
        relevance: result.secondBest.relevance
      };
    }

    fire("after:highlightElement", { el: element, result, text });
  }

  /**
   * Updates highlight.js global options with the passed options
   *
   * @param {Partial<HLJSOptions>} userOptions
   */
  function configure(userOptions) {
    options = inherit(options, userOptions);
  }

  // TODO: remove v12, deprecated
  const initHighlighting = () => {
    highlightAll();
    deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
  };

  // TODO: remove v12, deprecated
  function initHighlightingOnLoad() {
    highlightAll();
    deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
  }

  let wantsHighlight = false;

  /**
   * auto-highlights all pre>code elements on the page
   */
  function highlightAll() {
    // if we are called too early in the loading process
    if (document.readyState === "loading") {
      wantsHighlight = true;
      return;
    }

    const blocks = document.querySelectorAll(options.cssSelector);
    blocks.forEach(highlightElement);
  }

  function boot() {
    // if a highlight was requested before DOM was loaded, do now
    if (wantsHighlight) highlightAll();
  }

  // make sure we are in the browser environment
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('DOMContentLoaded', boot, false);
  }

  /**
   * Register a language grammar module
   *
   * @param {string} languageName
   * @param {LanguageFn} languageDefinition
   */
  function registerLanguage(languageName, languageDefinition) {
    let lang = null;
    try {
      lang = languageDefinition(hljs);
    } catch (error$1) {
      error("Language definition for '{}' could not be registered.".replace("{}", languageName));
      // hard or soft error
      if (!SAFE_MODE) { throw error$1; } else { error(error$1); }
      // languages that have serious errors are replaced with essentially a
      // "plaintext" stand-in so that the code blocks will still get normal
      // css classes applied to them - and one bad language won't break the
      // entire highlighter
      lang = PLAINTEXT_LANGUAGE;
    }
    // give it a temporary name if it doesn't have one in the meta-data
    if (!lang.name) lang.name = languageName;
    languages[languageName] = lang;
    lang.rawDefinition = languageDefinition.bind(null, hljs);

    if (lang.aliases) {
      registerAliases(lang.aliases, { languageName });
    }
  }

  /**
   * Remove a language grammar module
   *
   * @param {string} languageName
   */
  function unregisterLanguage(languageName) {
    delete languages[languageName];
    for (const alias of Object.keys(aliases)) {
      if (aliases[alias] === languageName) {
        delete aliases[alias];
      }
    }
  }

  /**
   * @returns {string[]} List of language internal names
   */
  function listLanguages() {
    return Object.keys(languages);
  }

  /**
   * @param {string} name - name of the language to retrieve
   * @returns {Language | undefined}
   */
  function getLanguage(name) {
    name = (name || '').toLowerCase();
    return languages[name] || languages[aliases[name]];
  }

  /**
   *
   * @param {string|string[]} aliasList - single alias or list of aliases
   * @param {{languageName: string}} opts
   */
  function registerAliases(aliasList, { languageName }) {
    if (typeof aliasList === 'string') {
      aliasList = [aliasList];
    }
    aliasList.forEach(alias => { aliases[alias.toLowerCase()] = languageName; });
  }

  /**
   * Determines if a given language has auto-detection enabled
   * @param {string} name - name of the language
   */
  function autoDetection(name) {
    const lang = getLanguage(name);
    return lang && !lang.disableAutodetect;
  }

  /**
   * Upgrades the old highlightBlock plugins to the new
   * highlightElement API
   * @param {HLJSPlugin} plugin
   */
  function upgradePluginAPI(plugin) {
    // TODO: remove with v12
    if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
      plugin["before:highlightElement"] = (data) => {
        plugin["before:highlightBlock"](
          Object.assign({ block: data.el }, data)
        );
      };
    }
    if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
      plugin["after:highlightElement"] = (data) => {
        plugin["after:highlightBlock"](
          Object.assign({ block: data.el }, data)
        );
      };
    }
  }

  /**
   * @param {HLJSPlugin} plugin
   */
  function addPlugin(plugin) {
    upgradePluginAPI(plugin);
    plugins.push(plugin);
  }

  /**
   * @param {HLJSPlugin} plugin
   */
  function removePlugin(plugin) {
    const index = plugins.indexOf(plugin);
    if (index !== -1) {
      plugins.splice(index, 1);
    }
  }

  /**
   *
   * @param {PluginEvent} event
   * @param {any} args
   */
  function fire(event, args) {
    const cb = event;
    plugins.forEach(function(plugin) {
      if (plugin[cb]) {
        plugin[cb](args);
      }
    });
  }

  /**
   * DEPRECATED
   * @param {HighlightedHTMLElement} el
   */
  function deprecateHighlightBlock(el) {
    deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
    deprecated("10.7.0", "Please use highlightElement now.");

    return highlightElement(el);
  }

  /* Interface definition */
  Object.assign(hljs, {
    highlight,
    highlightAuto,
    highlightAll,
    highlightElement,
    // TODO: Remove with v12 API
    highlightBlock: deprecateHighlightBlock,
    configure,
    initHighlighting,
    initHighlightingOnLoad,
    registerLanguage,
    unregisterLanguage,
    listLanguages,
    getLanguage,
    registerAliases,
    autoDetection,
    inherit,
    addPlugin,
    removePlugin
  });

  hljs.debugMode = function() { SAFE_MODE = false; };
  hljs.safeMode = function() { SAFE_MODE = true; };
  hljs.versionString = version;

  hljs.regex = {
    concat: concat,
    lookahead: lookahead,
    either: either,
    optional: optional,
    anyNumberOfTimes: anyNumberOfTimes
  };

  for (const key in MODES) {
    // @ts-ignore
    if (typeof MODES[key] === "object") {
      // @ts-ignore
      deepFreeze(MODES[key]);
    }
  }

  // merge all the modes/regexes into our main object
  Object.assign(hljs, MODES);

  return hljs;
};

// Other names for the variable may break build script
const highlight = HLJS({});

// returns a new instance of the highlighter to be used for extensions
// check https://github.com/wooorm/lowlight/issues/47
highlight.newInstance = () => HLJS({});

module.exports = highlight;
highlight.HighlightJS = highlight;
highlight.default = highlight;


/***/ }),

/***/ "./node_modules/highlight.js/es/core.js":
/*!**********************************************!*\
  !*** ./node_modules/highlight.js/es/core.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HighlightJS: () => (/* reexport default export from named module */ _lib_core_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/core.js */ "./node_modules/highlight.js/lib/core.js");
// https://nodejs.org/api/packages.html#packages_writing_dual_packages_while_avoiding_or_minimizing_hazards


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_lib_core_js__WEBPACK_IMPORTED_MODULE_0__);


/***/ }),

/***/ "./node_modules/highlight.js/es/languages/r.js":
/*!*****************************************************!*\
  !*** ./node_modules/highlight.js/es/languages/r.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ r)
/* harmony export */ });
/*
Language: R
Description: R is a free software environment for statistical computing and graphics.
Author: Joe Cheng <joe@rstudio.org>
Contributors: Konrad Rudolph <konrad.rudolph@gmail.com>
Website: https://www.r-project.org
Category: common,scientific
*/

/** @type LanguageFn */
function r(hljs) {
  const regex = hljs.regex;
  // Identifiers in R cannot start with `_`, but they can start with `.` if it
  // is not immediately followed by a digit.
  // R also supports quoted identifiers, which are near-arbitrary sequences
  // delimited by backticks (`…`), which may contain escape sequences. These are
  // handled in a separate mode. See `test/markup/r/names.txt` for examples.
  // FIXME: Support Unicode identifiers.
  const IDENT_RE = /(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/;
  const NUMBER_TYPES_RE = regex.either(
    // Special case: only hexadecimal binary powers can contain fractions
    /0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/,
    // Hexadecimal numbers without fraction and optional binary power
    /0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/,
    // Decimal numbers
    /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/
  );
  const OPERATORS_RE = /[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/;
  const PUNCTUATION_RE = regex.either(
    /[()]/,
    /[{}]/,
    /\[\[/,
    /[[\]]/,
    /\\/,
    /,/
  );

  return {
    name: 'R',

    keywords: {
      $pattern: IDENT_RE,
      keyword:
        'function if in break next repeat else for while',
      literal:
        'NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 '
        + 'NA_character_|10 NA_complex_|10',
      built_in:
        // Builtin constants
        'LETTERS letters month.abb month.name pi T F '
        // Primitive functions
        // These are all the functions in `base` that are implemented as a
        // `.Primitive`, minus those functions that are also keywords.
        + 'abs acos acosh all any anyNA Arg as.call as.character '
        + 'as.complex as.double as.environment as.integer as.logical '
        + 'as.null.default as.numeric as.raw asin asinh atan atanh attr '
        + 'attributes baseenv browser c call ceiling class Conj cos cosh '
        + 'cospi cummax cummin cumprod cumsum digamma dim dimnames '
        + 'emptyenv exp expression floor forceAndCall gamma gc.time '
        + 'globalenv Im interactive invisible is.array is.atomic is.call '
        + 'is.character is.complex is.double is.environment is.expression '
        + 'is.finite is.function is.infinite is.integer is.language '
        + 'is.list is.logical is.matrix is.na is.name is.nan is.null '
        + 'is.numeric is.object is.pairlist is.raw is.recursive is.single '
        + 'is.symbol lazyLoadDBfetch length lgamma list log max min '
        + 'missing Mod names nargs nzchar oldClass on.exit pos.to.env '
        + 'proc.time prod quote range Re rep retracemem return round '
        + 'seq_along seq_len seq.int sign signif sin sinh sinpi sqrt '
        + 'standardGeneric substitute sum switch tan tanh tanpi tracemem '
        + 'trigamma trunc unclass untracemem UseMethod xtfrm',
    },

    contains: [
      // Roxygen comments
      hljs.COMMENT(
        /#'/,
        /$/,
        { contains: [
          {
            // Handle `@examples` separately to cause all subsequent code
            // until the next `@`-tag on its own line to be kept as-is,
            // preventing highlighting. This code is example R code, so nested
            // doctags shouldn’t be treated as such. See
            // `test/markup/r/roxygen.txt` for an example.
            scope: 'doctag',
            match: /@examples/,
            starts: {
              end: regex.lookahead(regex.either(
                // end if another doc comment
                /\n^#'\s*(?=@[a-zA-Z]+)/,
                // or a line with no comment
                /\n^(?!#')/
              )),
              endsParent: true
            }
          },
          {
            // Handle `@param` to highlight the parameter name following
            // after.
            scope: 'doctag',
            begin: '@param',
            end: /$/,
            contains: [
              {
                scope: 'variable',
                variants: [
                  { match: IDENT_RE },
                  { match: /`(?:\\.|[^`\\])+`/ }
                ],
                endsParent: true
              }
            ]
          },
          {
            scope: 'doctag',
            match: /@[a-zA-Z]+/
          },
          {
            scope: 'keyword',
            match: /\\[a-zA-Z]+/
          }
        ] }
      ),

      hljs.HASH_COMMENT_MODE,

      {
        scope: 'string',
        contains: [ hljs.BACKSLASH_ESCAPE ],
        variants: [
          hljs.END_SAME_AS_BEGIN({
            begin: /[rR]"(-*)\(/,
            end: /\)(-*)"/
          }),
          hljs.END_SAME_AS_BEGIN({
            begin: /[rR]"(-*)\{/,
            end: /\}(-*)"/
          }),
          hljs.END_SAME_AS_BEGIN({
            begin: /[rR]"(-*)\[/,
            end: /\](-*)"/
          }),
          hljs.END_SAME_AS_BEGIN({
            begin: /[rR]'(-*)\(/,
            end: /\)(-*)'/
          }),
          hljs.END_SAME_AS_BEGIN({
            begin: /[rR]'(-*)\{/,
            end: /\}(-*)'/
          }),
          hljs.END_SAME_AS_BEGIN({
            begin: /[rR]'(-*)\[/,
            end: /\](-*)'/
          }),
          {
            begin: '"',
            end: '"',
            relevance: 0
          },
          {
            begin: "'",
            end: "'",
            relevance: 0
          }
        ],
      },

      // Matching numbers immediately following punctuation and operators is
      // tricky since we need to look at the character ahead of a number to
      // ensure the number is not part of an identifier, and we cannot use
      // negative look-behind assertions. So instead we explicitly handle all
      // possible combinations of (operator|punctuation), number.
      // TODO: replace with negative look-behind when available
      // { begin: /(?<![a-zA-Z0-9._])0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/ },
      // { begin: /(?<![a-zA-Z0-9._])0[xX][0-9a-fA-F]+([pP][+-]?\d+)?[Li]?/ },
      // { begin: /(?<![a-zA-Z0-9._])(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?[Li]?/ }
      {
        relevance: 0,
        variants: [
          {
            scope: {
              1: 'operator',
              2: 'number'
            },
            match: [
              OPERATORS_RE,
              NUMBER_TYPES_RE
            ]
          },
          {
            scope: {
              1: 'operator',
              2: 'number'
            },
            match: [
              /%[^%]*%/,
              NUMBER_TYPES_RE
            ]
          },
          {
            scope: {
              1: 'punctuation',
              2: 'number'
            },
            match: [
              PUNCTUATION_RE,
              NUMBER_TYPES_RE
            ]
          },
          {
            scope: { 2: 'number' },
            match: [
              /[^a-zA-Z0-9._]|^/, // not part of an identifier, or start of document
              NUMBER_TYPES_RE
            ]
          }
        ]
      },

      // Operators/punctuation when they're not directly followed by numbers
      {
        // Relevance boost for the most common assignment form.
        scope: { 3: 'operator' },
        match: [
          IDENT_RE,
          /\s+/,
          /<-/,
          /\s+/
        ]
      },

      {
        scope: 'operator',
        relevance: 0,
        variants: [
          { match: OPERATORS_RE },
          { match: /%[^%]*%/ }
        ]
      },

      {
        scope: 'punctuation',
        relevance: 0,
        match: PUNCTUATION_RE
      },

      {
        // Escaped identifier
        begin: '`',
        end: '`',
        contains: [ { begin: /\\./ } ]
      }
    ]
  };
}




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************!*\
  !*** ./srcjs/index.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isLocked: () => (/* reexport safe */ _lock_js__WEBPACK_IMPORTED_MODULE_6__.isLocked)
/* harmony export */ });
/* harmony import */ var shiny__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! shiny */ "shiny");
/* harmony import */ var shiny__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(shiny__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _copy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./copy.js */ "./srcjs/copy.js");
/* harmony import */ var _copy_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_copy_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _hl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./hl.js */ "./srcjs/hl.js");
/* harmony import */ var _shiny_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shiny.js */ "./srcjs/shiny.js");
/* harmony import */ var _stack_title_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./stack-title.js */ "./srcjs/stack-title.js");
/* harmony import */ var _stack_title_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_stack_title_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _tooltips_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tooltips.js */ "./srcjs/tooltips.js");
/* harmony import */ var _tooltips_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_tooltips_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _lock_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lock.js */ "./srcjs/lock.js");











})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOZTtBQUNJO0FBQ0Y7QUFDRztBQUNNO0FBQ0g7QUFDSjtBQUNrQjs7QUFFakIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ibG9ja3Ivd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2Jsb2Nrci8uL3NyY2pzL2NvbGxhcHNlLmpzIiwid2VicGFjazovL2Jsb2Nrci8uL3NyY2pzL2NvcHkuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLy4vc3JjanMvaGwuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLy4vc3JjanMvbG9hZGluZy5qcyIsIndlYnBhY2s6Ly9ibG9ja3IvLi9zcmNqcy9sb2NrLmpzIiwid2VicGFjazovL2Jsb2Nrci8uL3NyY2pzL3NoaW55LmpzIiwid2VicGFjazovL2Jsb2Nrci8uL3NyY2pzL3N0YWNrLXRpdGxlLmpzIiwid2VicGFjazovL2Jsb2Nrci8uL3NyY2pzL3Rvb2x0aXBzLmpzIiwid2VicGFjazovL2Jsb2Nrci9leHRlcm5hbCB1bWQgXCJTaGlueVwiIiwid2VicGFjazovL2Jsb2Nrci8uL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvbGliL2NvcmUuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLy4vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9lcy9jb3JlLmpzIiwid2VicGFjazovL2Jsb2Nrci8uL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZXMvbGFuZ3VhZ2VzL3IuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Jsb2Nrci93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9ibG9ja3Ivd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Jsb2Nrci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Jsb2Nrci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Jsb2Nrci8uL3NyY2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcIlNoaW55XCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcIlNoaW55XCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImJsb2NrclwiXSA9IGZhY3RvcnkocmVxdWlyZShcIlNoaW55XCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJibG9ja3JcIl0gPSBmYWN0b3J5KHJvb3RbXCJTaGlueVwiXSk7XG59KShzZWxmLCAoX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9zaGlueV9fKSA9PiB7XG5yZXR1cm4gIiwiJCgoKSA9PiB7XG4gIGVkaXRvcigpO1xuICB0b2dnbGVPdXRwdXRJbnB1dCgpO1xuICBoYW5kbGVJY29ucygpO1xufSk7XG5cbi8vIGhhbmRsZXMgaWNvbnMgY29sbGFwc2Ugc3RhdGVcbmV4cG9ydCBjb25zdCBoYW5kbGVJY29ucyA9ICgpID0+IHtcbiAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5zdGFjay1lZGl0LXRvZ2dsZVwiLCAoZXZlbnQpID0+IHtcbiAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpXG4gICAgICAuZmluZChcImlcIilcbiAgICAgIC50b2dnbGVDbGFzcyhcImZhLWNoZXZyb24tdXAgZmEtY2hldnJvbi1kb3duXCIpO1xuICB9KTtcblxuICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLmJsb2NrLW91dHB1dC10b2dnbGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgJChldmVudC5jdXJyZW50VGFyZ2V0KVxuICAgICAgLmZpbmQoXCJpXCIpXG4gICAgICAudG9nZ2xlQ2xhc3MoXCJmYS1jaGV2cm9uLXVwIGZhLWNoZXZyb24tZG93blwiKTtcbiAgfSk7XG59O1xuXG4vLyBoYW5kbGVzIHRoZSB0b2dnbGluZyBvZiBpbnB1dCBhbmQgb3V0cHV0XG5jb25zdCB0b2dnbGVPdXRwdXRJbnB1dCA9ICgpID0+IHtcbiAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5ibG9jay1vdXRwdXQtdG9nZ2xlXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0ICRibG9jayA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KFwiLmJsb2NrXCIpO1xuXG4gICAgY29uc3QgaW5wdXRWaXNpYmxlID0gJGJsb2NrLmZpbmQoXCIuYmxvY2staW5wdXRzXCIpLmlzKFwiOnZpc2libGVcIik7XG5cbiAgICBsZXQgdG9nZ2xlID0gaW5wdXRWaXNpYmxlO1xuXG4gICAgaWYgKHRvZ2dsZSkge1xuICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2staW5wdXRzXCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stb3V0cHV0XCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkYmxvY2suZmluZChcIi5ibG9jay1pbnB1dHNcIikucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgICAkYmxvY2suZmluZChcIi5ibG9jay1vdXRwdXRcIikucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgfVxuXG4gICAgbGV0IGV2ID0gXCJzaG93blwiO1xuICAgIGlmICgkYmxvY2suZmluZChcIi5ibG9jay1vdXRwdXRcIikuaGFzQ2xhc3MoXCJkLW5vbmVcIikpIHtcbiAgICAgIGV2ID0gXCJoaWRkZW5cIjtcbiAgICB9XG5cbiAgICAkYmxvY2suZmluZChcIi5ibG9jay1pbnB1dHNcIikudHJpZ2dlcihldik7XG4gICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stb3V0cHV0XCIpLnRyaWdnZXIoZXYpO1xuICB9KTtcbn07XG5cbi8vIGhhbmRsZXMgdGhlIHRvZ2dsaW5nIG9mIGVkaXRpbmcgbW9kZSBvbiBzdGFja3NcbmNvbnN0IGVkaXRvciA9ICgpID0+IHtcbiAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5zdGFjay1lZGl0LXRvZ2dsZVwiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCAkc3RhY2sgPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdChcIi5zdGFja1wiKTtcbiAgICBjb25zdCAkYmxvY2tzID0gJHN0YWNrLmZpbmQoXCIuYmxvY2tcIik7XG5cbiAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnRvZ2dsZUNsYXNzKFwiZWRpdGFibGVcIik7XG4gICAgY29uc3QgZWRpdGFibGUgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmhhc0NsYXNzKFwiZWRpdGFibGVcIik7XG5cbiAgICAkYmxvY2tzLmVhY2goKGluZGV4LCBibG9jaykgPT4ge1xuICAgICAgY29uc3QgJGJsb2NrID0gJChibG9jayk7XG5cbiAgICAgIGlmIChlZGl0YWJsZSkge1xuICAgICAgICAkYmxvY2sucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgICAgICRibG9jay5maW5kKFwiLmJsb2NrLXRpdGxlXCIpLnJlbW92ZUNsYXNzKFwiZC1ub25lXCIpO1xuXG4gICAgICAgICRibG9jay5maW5kKFwiLmJsb2NrLWRvd25sb2FkXCIpLnJlbW92ZUNsYXNzKFwiZC1ub25lXCIpO1xuICAgICAgICAkYmxvY2suZmluZChcIi5ibG9jay1jb2RlLXRvZ2dsZVwiKS5yZW1vdmVDbGFzcyhcImQtbm9uZVwiKTtcbiAgICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stb3V0cHV0LXRvZ2dsZVwiKS5yZW1vdmVDbGFzcyhcImQtbm9uZVwiKTtcblxuICAgICAgICBpZiAoaW5kZXggPT0gJGJsb2Nrcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stb3V0cHV0XCIpLmFkZENsYXNzKFwic2hvd1wiKTtcbiAgICAgICAgICAkYmxvY2suZmluZChcIi5ibG9jay1vdXRwdXRcIikucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stb3V0cHV0XCIpLnRyaWdnZXIoXCJzaG93blwiKTtcblxuICAgICAgICAgIGNvbnN0IGNvZGUgPSB3aW5kb3cuYm9vdHN0cmFwLkNvbGxhcHNlLmdldE9yQ3JlYXRlSW5zdGFuY2UoXG4gICAgICAgICAgICAkYmxvY2suZmluZChcIi5ibG9jay1jb2RlXCIpWzBdLFxuICAgICAgICAgICAgeyB0b2dnbGU6IGZhbHNlIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb2RlLmhpZGUoKTtcblxuICAgICAgICAgICRibG9jay5maW5kKFwiLmJsb2NrLWlucHV0c1wiKS5yZW1vdmVDbGFzcyhcImQtbm9uZVwiKTtcbiAgICAgICAgICAkYmxvY2suZmluZChcIi5ibG9jay1pbnB1dHNcIikudHJpZ2dlcihcInNob3duXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICRibG9jay5maW5kKFwiLmJsb2NrLWxvYWRpbmdcIikuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stZG93bmxvYWRcIikuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgICAkYmxvY2suZmluZChcIi5ibG9jay1jb2RlLXRvZ2dsZVwiKS5hZGRDbGFzcyhcImQtbm9uZVwiKTtcbiAgICAgICRibG9jay5maW5kKFwiLmJsb2NrLW91dHB1dC10b2dnbGVcIikuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgICAkYmxvY2suZmluZChcIi5ibG9jay1vdXRwdXQtdG9nZ2xlXCIpLmZpbmQoXCJpXCIpLmFkZENsYXNzKFwiZmEtY2hldnJvbi11cFwiKTtcbiAgICAgICRibG9ja1xuICAgICAgICAuZmluZChcIi5ibG9jay1vdXRwdXQtdG9nZ2xlXCIpXG4gICAgICAgIC5maW5kKFwiaVwiKVxuICAgICAgICAucmVtb3ZlQ2xhc3MoXCJmYS1jaGV2cm9uLWRvd25cIik7XG5cbiAgICAgICRibG9jay5maW5kKFwiLmJsb2NrLXRpdGxlXCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuICAgICAgaWYgKGluZGV4ID09ICRibG9ja3MubGVuZ3RoIC0gMSkge1xuICAgICAgICAkYmxvY2sucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG5cbiAgICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stb3V0cHV0XCIpLmFkZENsYXNzKFwic2hvd1wiKTtcbiAgICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stb3V0cHV0XCIpLnJlbW92ZUNsYXNzKFwiZC1ub25lXCIpO1xuICAgICAgICAkYmxvY2suZmluZChcIi5ibG9jay1vdXRwdXRcIikudHJpZ2dlcihcInNob3duXCIpO1xuXG4gICAgICAgIGNvbnN0IGNvZGUgPSB3aW5kb3cuYm9vdHN0cmFwLkNvbGxhcHNlLmdldE9yQ3JlYXRlSW5zdGFuY2UoXG4gICAgICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stY29kZVwiKVswXSxcbiAgICAgICAgICB7IHRvZ2dsZTogZmFsc2UgfSxcbiAgICAgICAgKTtcbiAgICAgICAgY29kZS5oaWRlKCk7XG5cbiAgICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2staW5wdXRzXCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuICAgICAgICAkYmxvY2suZmluZChcIi5ibG9jay1pbnB1dHNcIikudHJpZ2dlcihcImhpZGRlblwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAkYmxvY2suYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHNob3dMYXN0T3V0cHV0ID0gKGVsKSA9PiB7XG4gIGNvbnN0ICRibG9jayA9ICQoZWwpLmZpbmQoXCIuYmxvY2tcIikubGFzdCgpO1xuXG4gIGNvbnN0ICRsYXN0T3V0cHV0ID0gJGJsb2NrLmZpbmQoXCIuYmxvY2stb3V0cHV0XCIpO1xuICBjb25zdCAkbGFzdFRpdGxlID0gJGJsb2NrLmZpbmQoXCIuYmxvY2stdGl0bGVcIik7XG4gIGNvbnN0ICRsYXN0SW5wdXRzID0gJGJsb2NrLmZpbmQoXCIuYmxvY2staW5wdXRzXCIpO1xuXG4gICRsYXN0VGl0bGUuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICRsYXN0SW5wdXRzLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuXG4gIC8vIGhpZGUgdG9nZ2xlcnNcbiAgJGJsb2NrLmZpbmQoXCIuYmxvY2stZG93bmxvYWRcIikuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICRibG9jay5maW5kKFwiLmJsb2NrLWNvZGUtdG9nZ2xlXCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuICAkYmxvY2suZmluZChcIi5ibG9jay1vdXRwdXQtdG9nZ2xlXCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuXG4gIC8vIHdlIGhhdmUgYSBsb2FkaW5nIHN0YXRlXG4gIC8vIGJlY2F1c2Ugc29tZSBibG9jayB2YWxpZGF0aW9ucyBoYXZlIG5vIGxhc3Qgb3V0cHV0XG4gIGNvbnN0IHRhYmxlSWQgPSAkbGFzdE91dHB1dC5maW5kKFwiLnNoaW55LWJvdW5kLW91dHB1dFwiKS5maXJzdCgpLmF0dHIoXCJpZFwiKTtcblxuICAkKGRvY3VtZW50KS5vbihcInNoaW55OnZhbHVlXCIsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC5uYW1lICE9PSB0YWJsZUlkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJGxhc3RPdXRwdXQuZmluZChcIi5ibG9jay1sb2FkaW5nXCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBjb2xsYXBzZU90aGVyQmxvY2tzID0gKHN0YWNrLCBibG9jaykgPT4ge1xuICBjb25zdCBidG5zID0gJChzdGFjaykuZmluZChcIi5ibG9jay1vdXRwdXQtdG9nZ2xlXCIpO1xuXG4gICQoYnRucykuZWFjaCgoX2luZGV4LCBidG4pID0+IHtcbiAgICBpZiAoJChidG4pLmNsb3Nlc3QoXCIuYmxvY2tcIikuZGF0YShcInZhbHVlXCIpID09IGAke2Jsb2NrfS1ibG9ja2ApIHJldHVybjtcblxuICAgIGNvbnN0IGlzQ29sbGFwc2VkID0gJChidG4pLmZpbmQoXCJpXCIpLmhhc0NsYXNzKFwiZmEtY2hldnJvbi1kb3duXCIpO1xuICAgIGlmIChpc0NvbGxhcHNlZCkgcmV0dXJuO1xuXG4gICAgJChidG4pLnRyaWdnZXIoXCJjbGlja1wiKTtcbiAgfSk7XG59O1xuIiwiY29uc3QgY29weVRleHQgPSAodHh0KSA9PiB7XG4gIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHR4dCk7XG59O1xuXG53aW5kb3cuU2hpbnkuYWRkQ3VzdG9tTWVzc2FnZUhhbmRsZXIoXCJibG9ja3ItY29weS1jb2RlXCIsIChtc2cpID0+IHtcbiAgLy8gdG9kbyBub3RpZnkgdXNlclxuICBpZiAoIW1zZy5jb2RlKSB7XG4gICAgd2luZG93LlNoaW55Lm5vdGlmaWNhdGlvbnMuc2hvdyh7XG4gICAgICBodG1sOiBcIjxzcGFuPkZhaWxlZCB0byBjb3B5IGNvZGUgdG8gY2xpcGJvYXJkPC9zcGFuPlwiLFxuICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBjb3B5VGV4dChtc2cuY29kZS5tYXAoKGNvZGUpID0+IGNvZGUudHJpbSgpKS5qb2luKFwiXFxuXFx0XCIpKTtcbiAgd2luZG93LlNoaW55Lm5vdGlmaWNhdGlvbnMuc2hvdyh7XG4gICAgaHRtbDogXCI8c3Bhbj5Db2RlIGNvcGllZCB0byBjbGlwYm9hcmQ8L3NwYW4+XCIsXG4gICAgdHlwZTogXCJtZXNzYWdlXCIsXG4gIH0pO1xufSk7XG4iLCJpbXBvcnQgaGxqcyBmcm9tIFwiaGlnaGxpZ2h0LmpzL2xpYi9jb3JlXCI7XG5pbXBvcnQgciBmcm9tIFwiaGlnaGxpZ2h0LmpzL2xpYi9sYW5ndWFnZXMvclwiO1xuXG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoXCJyXCIsIHIpO1xuXG4kKCgpID0+IHtcbiAgJChkb2N1bWVudCkub24oXCJzaGlueTp2YWx1ZVwiLCAoZSkgPT4ge1xuICAgIGlmICghZS5uYW1lLm1hdGNoKC8tY29kZSQvKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgICQoYCMke2UubmFtZX1gKS5hZGRDbGFzcyhcImxhbmd1YWdlLXJcIik7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkZWxldGUgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZS5uYW1lKS5kYXRhc2V0LmhpZ2hsaWdodGVkO1xuICAgICAgaGxqcy5oaWdobGlnaHRFbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGUubmFtZSkpO1xuICAgIH0sIDI1MCk7XG4gIH0pO1xufSk7XG4iLCJleHBvcnQgY29uc3QgbG9hZGluZyA9IChzdGFjaykgPT4ge1xuICAkKGRvY3VtZW50KS5vbihcInNoaW55Om91dHB1dGludmFsaWRhdGVkXCIsIChldmVudCkgPT4ge1xuICAgIGlmICghZXZlbnQubmFtZS5tYXRjaChgXiR7c3RhY2t9YCkpIHJldHVybjtcbiAgICBpZiAoIWV2ZW50Lm5hbWUubWF0Y2goXCJyZXMkfHBsb3QkXCIpKSByZXR1cm47XG5cbiAgICAkKGAjJHtldmVudC5uYW1lfWApLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuICAgICQoYCMke2V2ZW50Lm5hbWV9YClcbiAgICAgIC5jbG9zZXN0KFwiLmJsb2NrXCIpXG4gICAgICAuZmluZChcIi5ibG9jay1sb2FkaW5nXCIpXG4gICAgICAucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG4gIH0pO1xuXG4gICQoZG9jdW1lbnQpLm9uKFwic2hpbnk6dmFsdWUgc2hpbnk6ZXJyb3JcIiwgKGV2ZW50KSA9PiB7XG4gICAgaWYgKCFldmVudC5uYW1lLm1hdGNoKGBeJHtzdGFja31gKSkgcmV0dXJuO1xuICAgIGlmICghZXZlbnQubmFtZS5tYXRjaChcInJlcyR8cGxvdCRcIikpIHJldHVybjtcblxuICAgICQoYCMke2V2ZW50Lm5hbWV9YCkucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgJChgIyR7ZXZlbnQubmFtZX1gKVxuICAgICAgLmNsb3Nlc3QoXCIuYmxvY2tcIilcbiAgICAgIC5maW5kKFwiLmJsb2NrLWxvYWRpbmdcIilcbiAgICAgIC5hZGRDbGFzcyhcImQtbm9uZVwiKTtcbiAgfSk7XG59O1xuIiwibGV0IGxvY2tlZCA9IGZhbHNlO1xud2luZG93LlNoaW55LmFkZEN1c3RvbU1lc3NhZ2VIYW5kbGVyKFwibG9ja1wiLCAobXNnKSA9PiB7XG4gIGxvY2tlZCA9IG1zZy5sb2NrZWQ7XG4gIGhhbmRsZUxvY2soKTtcbiAgZW1pdEV2ZW50KG1zZy5sb2NrZWQpO1xufSk7XG5cbmV4cG9ydCBjb25zdCBpc0xvY2tlZCA9ICgpID0+IHtcbiAgcmV0dXJuIGxvY2tlZDtcbn07XG5cbmNvbnN0IGVtaXRFdmVudCA9IChsb2NrZWQpID0+IHtcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJibG9ja3I6bG9ja1wiLCB7XG4gICAgZGV0YWlsOiB7XG4gICAgICBsb2NrZWQ6IGxvY2tlZCxcbiAgICB9LFxuICB9KTtcbiAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG59O1xuXG5jb25zdCBoYW5kbGVMb2NrID0gKCkgPT4ge1xuICBpZiAoIWxvY2tlZCkgcmV0dXJuO1xuXG4gICQoXCIuYmxvY2stY29kZS10b2dnbGVcIikuaGlkZSgpO1xuICAkKFwiLmJsb2NrLW91dHB1dC10b2dnbGVcIikuaGlkZSgpO1xuICAkKFwiLnN0YWNrLXJlbW92ZVwiKS5oaWRlKCk7XG4gICQoXCIuc3RhY2stYWRkLWJsb2NrXCIpLmhpZGUoKTtcbiAgJChcIi5zdGFjay1lZGl0LXRvZ2dsZVwiKS5oaWRlKCk7XG4gICQoXCIuYmxvY2stcmVtb3ZlXCIpLmhpZGUoKTtcblxuICAkKFwiLnN0YWNrLXRpdGxlXCIpLm9mZigpO1xuXG4gICQoXCIuc3RhY2tcIikuZWFjaCgoX2luZGV4LCBlbCkgPT4ge1xuICAgIGNvbnN0ICRlZGl0b3IgPSAkKGVsKS5maW5kKFwiLnN0YWNrLWVkaXQtdG9nZ2xlXCIpO1xuICAgIGNvbnN0IGlzQ2xvc2VkID0gJGVkaXRvci5maW5kKFwiaVwiKS5oYXNDbGFzcyhcImZhLWNoZXZyb24tdXBcIik7XG5cbiAgICBpZiAoaXNDbG9zZWQpIHJldHVybjtcblxuICAgICRlZGl0b3IudHJpZ2dlcihcImNsaWNrXCIpO1xuICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW5kZXJMb2NrZWQgPSAoc3RhY2ssIHN0YXRlKSA9PiB7XG4gIGxvY2tlZCA9IHN0YXRlO1xuICBpZiAoIWxvY2tlZCkgcmV0dXJuO1xuXG4gIGxvY2soc3RhY2spO1xufTtcblxuY29uc3QgbG9jayA9IChzdGFjaykgPT4ge1xuICBpZiAoIWxvY2tlZCkgcmV0dXJuO1xuICBsZXQgJHN0YWNrID0gJChzdGFjayk7XG5cbiAgJHN0YWNrLmZpbmQoXCIuYmxvY2stY29kZS10b2dnbGVcIikuaGlkZSgpO1xuICAkc3RhY2suZmluZChcIi5ibG9jay1vdXRwdXQtdG9nZ2xlXCIpLmhpZGUoKTtcbiAgJHN0YWNrLmZpbmQoXCIuc3RhY2stcmVtb3ZlXCIpLmhpZGUoKTtcbiAgJHN0YWNrLmZpbmQoXCIuc3RhY2stYWRkLWJsb2NrXCIpLmhpZGUoKTtcbiAgJHN0YWNrLmZpbmQoXCIuc3RhY2stZWRpdC10b2dnbGVcIikuaGlkZSgpO1xuICAkc3RhY2suZmluZChcIi5ibG9jay1yZW1vdmVcIikuaGlkZSgpO1xuICAkc3RhY2suZmluZChcIi5zdGFjay10aXRsZVwiKS5vZmYoKTtcblxuICBjb25zdCAkZWRpdG9yID0gJHN0YWNrLmZpbmQoXCIuc3RhY2stZWRpdC10b2dnbGVcIik7XG4gIGNvbnN0IGlzQ2xvc2VkID0gJGVkaXRvci5maW5kKFwiaVwiKS5oYXNDbGFzcyhcImZhLWNoZXZyb24tdXBcIik7XG5cbiAgaWYgKGlzQ2xvc2VkKSByZXR1cm47XG5cbiAgJGVkaXRvci50cmlnZ2VyKFwiY2xpY2tcIik7XG59O1xuIiwiaW1wb3J0IHsgY29sbGFwc2VPdGhlckJsb2Nrcywgc2hvd0xhc3RPdXRwdXQgfSBmcm9tIFwiLi9jb2xsYXBzZS5qc1wiO1xuaW1wb3J0IFwiLi9zdGFjay10aXRsZS5qc1wiO1xuaW1wb3J0IHsgcmVuZGVyTG9ja2VkIH0gZnJvbSBcIi4vbG9jay5qc1wiO1xuaW1wb3J0IHsgbG9hZGluZyB9IGZyb20gXCIuL2xvYWRpbmcuanNcIjtcblxud2luZG93LlNoaW55LmFkZEN1c3RvbU1lc3NhZ2VIYW5kbGVyKFwiYmxvY2tyLXJlbmRlci1zdGFja1wiLCAobXNnKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gYCMke21zZy5zdGFja31gO1xuICBzaG93TGFzdE91dHB1dChzdGFjayk7XG4gIHJlbmRlckxvY2tlZChzdGFjaywgbXNnLmxvY2tlZCk7XG4gIGxvYWRpbmcobXNnLnN0YWNrKTtcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJibG9ja3I6c3RhY2stcmVuZGVyXCIsIHsgZGV0YWlsOiBtc2cgfSk7XG4gIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufSk7XG5cbndpbmRvdy5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcImJsb2Nrci1hZGQtYmxvY2tcIiwgKG1zZykgPT4ge1xuICBjb25zdCBzdGFjayA9IGAjJHttc2cuc3RhY2t9YDtcbiAgJChzdGFjaykucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgY29sbGFwc2VPdGhlckJsb2NrcyhzdGFjaywgbXNnLmJsb2NrKTtcbiAgfSwgMzUwKTtcbn0pO1xuXG4vLyBCbG9jayBjb2xvciBmZWVkYmFjayAodmFsaWRhdGlvbilcbndpbmRvdy5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcInZhbGlkYXRlLWJsb2NrXCIsIChtc2cpID0+IHtcbiAgaWYgKG1zZy5zdGF0ZSkge1xuICAgICQoYFtkYXRhLXZhbHVlPVwiJHttc2cuaWR9XCJdIC5jYXJkYCkucmVtb3ZlQ2xhc3MoXCJib3JkZXItZGFuZ2VyXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gICQoYFtkYXRhLXZhbHVlPVwiJHttc2cuaWR9XCJdIC5jYXJkYCkuYWRkQ2xhc3MoXCJib3JkZXItZGFuZ2VyXCIpO1xufSk7XG5cbi8vIElucHV0IGNvbG9yIGZlZWRiYWNrICh2YWxpZGF0aW9uKVxuY29uc3QgY2hhbmdlSW5wdXRCb3JkZXIgPSAoYXJncykgPT4ge1xuICBsZXQgc2VsO1xuICBpZiAoJChgIyR7YXJncy5pZH1gKS5oYXNDbGFzcyhcInNoaW55LWlucHV0LXNlbGVjdFwiKSkge1xuICAgIC8vIGJvcmRlciBpcyBvbiBwYXJlbnQgZGl2XG4gICAgc2VsID0gJChgIyR7YXJncy5pZH0tc2VsZWN0aXplZGApLnBhcmVudChcIi5zZWxlY3RpemUtaW5wdXRcIikuY2xvc2VzdChcImRpdlwiKTtcbiAgfSBlbHNlIHtcbiAgICBzZWwgPSBgIyR7YXJncy5pZH1gO1xuICB9XG5cbiAgLy8gU29tZSBpbnB1dHMgYXJlIGR5bmFtaWNhbGx5IGdlbmVyYXRlZCBsaWtlIGluIGZpbHRlciBibG9jay5cbiAgLy8gQWRkaW5nIGEgZGVsYXkgXCJlbnN1cmVcIiB0aGV5J3JlIGluIHRoZSBET00uXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGlmICghYXJncy5zdGF0ZSkge1xuICAgICAgJChzZWwpLmFkZENsYXNzKFwiaXMtaW52YWxpZFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkKHNlbCkuYWRkQ2xhc3MoXCJpcy12YWxpZFwiKTtcbiAgfSwgNTAwKTtcbn07XG5cbmNvbnN0IHNob3dJbnB1dHNPbkVycm9yID0gKG9wdHMpID0+IHtcbiAgLy8gaW5wdXQgaXMgdmFsaWQgLSB3ZSBza2lwXG4gIGlmIChvcHRzLnN0YXRlKSByZXR1cm47XG5cbiAgLy8gaW5wdXQgaXMgaW52YWxpZFxuICAvLyB3ZSBzaG93IHRoZSBwYXJlbnQgaW5wdXQgYmxvY2tcbiAgLy8gdGhpcyBpcyBiZWNhdXNlIGlmIHRoZSBlcnJvciBvY2N1cnMgaW4gdGhlXG4gIC8vIGxhc3QgYmxvY2sgdGhlbiB0aGUgaW5wdXRzIGFyZSBoaWRkZW4gYnkgZGVmYXVsdFxuICAkKGAjJHtvcHRzLmlkfWApLmNsb3Nlc3QoXCIuYmxvY2staW5wdXRzXCIpLnJlbW92ZUNsYXNzKFwiZC1ub25lXCIpO1xufTtcblxud2luZG93LlNoaW55LmFkZEN1c3RvbU1lc3NhZ2VIYW5kbGVyKFwidmFsaWRhdGUtaW5wdXRcIiwgKG1zZykgPT4ge1xuICBzaG93SW5wdXRzT25FcnJvcihtc2cpO1xuICBjaGFuZ2VJbnB1dEJvcmRlcihtc2cpO1xufSk7XG5cbndpbmRvdy5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcInRvZ2dsZS1zdWJtaXRcIiwgKG1zZykgPT4ge1xuICAkKGAjJHttc2cuaWR9YCkucHJvcChcImRpc2FibGVkXCIsICFtc2cuc3RhdGUpO1xufSk7XG4iLCIkKCgpID0+IHtcbiAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5zdGFjay10aXRsZS1kaXNwbGF5XCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0ICRncm91cCA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KFwiLnN0YWNrLXRpdGxlXCIpO1xuXG4gICAgJGdyb3VwLmZpbmQoXCIuc3RhY2stdGl0bGUtZGlzcGxheVwiKS5hZGRDbGFzcyhcImQtbm9uZVwiKTtcbiAgICAkZ3JvdXAuZmluZChcIi5zdGFjay10aXRsZS1pbnB1dFwiKS5yZW1vdmVDbGFzcyhcImQtbm9uZVwiKTtcbiAgICAkZ3JvdXAuZmluZChcIi5zdGFjay10aXRsZS1pbnB1dFwiKS5maW5kKFwiaW5wdXRcIikuZm9jdXMoKTtcbiAgfSk7XG5cbiAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5zdGFjay10aXRsZS1zYXZlXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0ICRncm91cCA9ICQoZXZlbnQudGFyZ2V0KVxuICAgICAgLmNsb3Nlc3QoXCIuaW5wdXQtZ3JvdXBcIilcbiAgICAgIC5jbG9zZXN0KFwiLnN0YWNrLXRpdGxlXCIpO1xuXG4gICAgY29uc3QgdiA9ICRncm91cC5maW5kKFwiLnN0YWNrLXRpdGxlLWlucHV0XCIpLmZpbmQoXCJpbnB1dFwiKS52YWwoKTtcbiAgICBpZiAodiA9PT0gXCJcIikge1xuICAgICAgd2luZG93LlNoaW55Lm5vdGlmaWNhdGlvbnMuc2hvdyh7XG4gICAgICAgIGh0bWw6IFwiTXVzdCBzZXQgYSB0aXRsZVwiLFxuICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJGdyb3VwLmZpbmQoXCIuc3RhY2stdGl0bGUtZGlzcGxheVwiKS50ZXh0KHYpO1xuXG4gICAgJGdyb3VwLmZpbmQoXCIuc3RhY2stdGl0bGUtaW5wdXRcIikuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgJGdyb3VwLmZpbmQoXCIuc3RhY2stdGl0bGUtZGlzcGxheVwiKS5yZW1vdmVDbGFzcyhcImQtbm9uZVwiKTtcbiAgfSk7XG5cbiAgJChcImJvZHlcIikub24oXCJrZXlkb3duXCIsIFwiLnN0YWNrLXRpdGxlLWlucHV0XCIsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC5rZXkgIT09IFwiRW50ZXJcIikgcmV0dXJuO1xuXG4gICAgY29uc3QgJGdyb3VwID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoXCIuc3RhY2stdGl0bGVcIik7XG5cbiAgICBjb25zdCB2ID0gJChldmVudC50YXJnZXQpLnZhbCgpO1xuICAgIGlmICh2ID09PSBcIlwiKSB7XG4gICAgICB3aW5kb3cuU2hpbnkubm90aWZpY2F0aW9ucy5zaG93KHtcbiAgICAgICAgaHRtbDogXCJNdXN0IHNldCBhIHRpdGxlXCIsXG4gICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAkZ3JvdXAuZmluZChcIi5zdGFjay10aXRsZS1kaXNwbGF5XCIpLnRleHQodik7XG5cbiAgICAkZ3JvdXAuZmluZChcIi5zdGFjay10aXRsZS1kaXNwbGF5XCIpLnJlbW92ZUNsYXNzKFwiZC1ub25lXCIpO1xuICAgICRncm91cC5maW5kKFwiLnN0YWNrLXRpdGxlLWlucHV0XCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuICB9KTtcbn0pO1xuIiwiJCgoKSA9PiB7XG4gIHRvb2x0aXAoKTtcbn0pO1xuXG5jb25zdCB0b29sdGlwID0gKCkgPT4ge1xuICBjb25zdCB0b29sdGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWJzLXRvZ2dsZT1cInRvb2x0aXBcIl0nKTtcbiAgWy4uLnRvb2x0aXBzXS5tYXAoKGVsKSA9PiBuZXcgd2luZG93LmJvb3RzdHJhcC5Ub29sdGlwKGVsKSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3NoaW55X187IiwiLyogZXNsaW50LWRpc2FibGUgbm8tbXVsdGktYXNzaWduICovXG5cbmZ1bmN0aW9uIGRlZXBGcmVlemUob2JqKSB7XG4gIGlmIChvYmogaW5zdGFuY2VvZiBNYXApIHtcbiAgICBvYmouY2xlYXIgPVxuICAgICAgb2JqLmRlbGV0ZSA9XG4gICAgICBvYmouc2V0ID1cbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbWFwIGlzIHJlYWQtb25seScpO1xuICAgICAgICB9O1xuICB9IGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIFNldCkge1xuICAgIG9iai5hZGQgPVxuICAgICAgb2JqLmNsZWFyID1cbiAgICAgIG9iai5kZWxldGUgPVxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXQgaXMgcmVhZC1vbmx5Jyk7XG4gICAgICAgIH07XG4gIH1cblxuICAvLyBGcmVlemUgc2VsZlxuICBPYmplY3QuZnJlZXplKG9iaik7XG5cbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgY29uc3QgcHJvcCA9IG9ialtuYW1lXTtcbiAgICBjb25zdCB0eXBlID0gdHlwZW9mIHByb3A7XG5cbiAgICAvLyBGcmVlemUgcHJvcCBpZiBpdCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gYW5kIGFsc28gbm90IGFscmVhZHkgZnJvemVuXG4gICAgaWYgKCh0eXBlID09PSAnb2JqZWN0JyB8fCB0eXBlID09PSAnZnVuY3Rpb24nKSAmJiAhT2JqZWN0LmlzRnJvemVuKHByb3ApKSB7XG4gICAgICBkZWVwRnJlZXplKHByb3ApO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkNhbGxiYWNrUmVzcG9uc2V9IENhbGxiYWNrUmVzcG9uc2UgKi9cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Db21waWxlZE1vZGV9IENvbXBpbGVkTW9kZSAqL1xuLyoqIEBpbXBsZW1lbnRzIENhbGxiYWNrUmVzcG9uc2UgKi9cblxuY2xhc3MgUmVzcG9uc2Uge1xuICAvKipcbiAgICogQHBhcmFtIHtDb21waWxlZE1vZGV9IG1vZGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKG1vZGUpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gICAgaWYgKG1vZGUuZGF0YSA9PT0gdW5kZWZpbmVkKSBtb2RlLmRhdGEgPSB7fTtcblxuICAgIHRoaXMuZGF0YSA9IG1vZGUuZGF0YTtcbiAgICB0aGlzLmlzTWF0Y2hJZ25vcmVkID0gZmFsc2U7XG4gIH1cblxuICBpZ25vcmVNYXRjaCgpIHtcbiAgICB0aGlzLmlzTWF0Y2hJZ25vcmVkID0gdHJ1ZTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZXNjYXBlSFRNTCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWVcbiAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgIC5yZXBsYWNlKC8nL2csICcmI3gyNzsnKTtcbn1cblxuLyoqXG4gKiBwZXJmb3JtcyBhIHNoYWxsb3cgbWVyZ2Ugb2YgbXVsdGlwbGUgb2JqZWN0cyBpbnRvIG9uZVxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0ge1R9IG9yaWdpbmFsXG4gKiBAcGFyYW0ge1JlY29yZDxzdHJpbmcsYW55PltdfSBvYmplY3RzXG4gKiBAcmV0dXJucyB7VH0gYSBzaW5nbGUgbmV3IG9iamVjdFxuICovXG5mdW5jdGlvbiBpbmhlcml0JDEob3JpZ2luYWwsIC4uLm9iamVjdHMpIHtcbiAgLyoqIEB0eXBlIFJlY29yZDxzdHJpbmcsYW55PiAqL1xuICBjb25zdCByZXN1bHQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIGZvciAoY29uc3Qga2V5IGluIG9yaWdpbmFsKSB7XG4gICAgcmVzdWx0W2tleV0gPSBvcmlnaW5hbFtrZXldO1xuICB9XG4gIG9iamVjdHMuZm9yRWFjaChmdW5jdGlvbihvYmopIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcbiAgICAgIHJlc3VsdFtrZXldID0gb2JqW2tleV07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIC8qKiBAdHlwZSB7VH0gKi8gKHJlc3VsdCk7XG59XG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gUmVuZGVyZXJcbiAqIEBwcm9wZXJ0eSB7KHRleHQ6IHN0cmluZykgPT4gdm9pZH0gYWRkVGV4dFxuICogQHByb3BlcnR5IHsobm9kZTogTm9kZSkgPT4gdm9pZH0gb3Blbk5vZGVcbiAqIEBwcm9wZXJ0eSB7KG5vZGU6IE5vZGUpID0+IHZvaWR9IGNsb3NlTm9kZVxuICogQHByb3BlcnR5IHsoKSA9PiBzdHJpbmd9IHZhbHVlXG4gKi9cblxuLyoqIEB0eXBlZGVmIHt7c2NvcGU/OiBzdHJpbmcsIGxhbmd1YWdlPzogc3RyaW5nLCBzdWJsYW5ndWFnZT86IGJvb2xlYW59fSBOb2RlICovXG4vKiogQHR5cGVkZWYge3t3YWxrOiAocjogUmVuZGVyZXIpID0+IHZvaWR9fSBUcmVlICovXG4vKiogKi9cblxuY29uc3QgU1BBTl9DTE9TRSA9ICc8L3NwYW4+JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIGEgbm9kZSBuZWVkcyB0byBiZSB3cmFwcGVkIGluIDxzcGFuPlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAqL1xuY29uc3QgZW1pdHNXcmFwcGluZ1RhZ3MgPSAobm9kZSkgPT4ge1xuICAvLyByYXJlbHkgd2UgY2FuIGhhdmUgYSBzdWJsYW5ndWFnZSB3aGVyZSBsYW5ndWFnZSBpcyB1bmRlZmluZWRcbiAgLy8gVE9ETzogdHJhY2sgZG93biB3aHlcbiAgcmV0dXJuICEhbm9kZS5zY29wZTtcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge3twcmVmaXg6c3RyaW5nfX0gb3B0aW9uc1xuICovXG5jb25zdCBzY29wZVRvQ1NTQ2xhc3MgPSAobmFtZSwgeyBwcmVmaXggfSkgPT4ge1xuICAvLyBzdWItbGFuZ3VhZ2VcbiAgaWYgKG5hbWUuc3RhcnRzV2l0aChcImxhbmd1YWdlOlwiKSkge1xuICAgIHJldHVybiBuYW1lLnJlcGxhY2UoXCJsYW5ndWFnZTpcIiwgXCJsYW5ndWFnZS1cIik7XG4gIH1cbiAgLy8gdGllcmVkIHNjb3BlOiBjb21tZW50LmxpbmVcbiAgaWYgKG5hbWUuaW5jbHVkZXMoXCIuXCIpKSB7XG4gICAgY29uc3QgcGllY2VzID0gbmFtZS5zcGxpdChcIi5cIik7XG4gICAgcmV0dXJuIFtcbiAgICAgIGAke3ByZWZpeH0ke3BpZWNlcy5zaGlmdCgpfWAsXG4gICAgICAuLi4ocGllY2VzLm1hcCgoeCwgaSkgPT4gYCR7eH0ke1wiX1wiLnJlcGVhdChpICsgMSl9YCkpXG4gICAgXS5qb2luKFwiIFwiKTtcbiAgfVxuICAvLyBzaW1wbGUgc2NvcGVcbiAgcmV0dXJuIGAke3ByZWZpeH0ke25hbWV9YDtcbn07XG5cbi8qKiBAdHlwZSB7UmVuZGVyZXJ9ICovXG5jbGFzcyBIVE1MUmVuZGVyZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBIVE1MUmVuZGVyZXJcbiAgICpcbiAgICogQHBhcmFtIHtUcmVlfSBwYXJzZVRyZWUgLSB0aGUgcGFyc2UgdHJlZSAobXVzdCBzdXBwb3J0IGB3YWxrYCBBUEkpXG4gICAqIEBwYXJhbSB7e2NsYXNzUHJlZml4OiBzdHJpbmd9fSBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJzZVRyZWUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmJ1ZmZlciA9IFwiXCI7XG4gICAgdGhpcy5jbGFzc1ByZWZpeCA9IG9wdGlvbnMuY2xhc3NQcmVmaXg7XG4gICAgcGFyc2VUcmVlLndhbGsodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0ZXh0cyB0byB0aGUgb3V0cHV0IHN0cmVhbVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAqL1xuICBhZGRUZXh0KHRleHQpIHtcbiAgICB0aGlzLmJ1ZmZlciArPSBlc2NhcGVIVE1MKHRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBub2RlIG9wZW4gdG8gdGhlIG91dHB1dCBzdHJlYW0gKGlmIG5lZWRlZClcbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlICovXG4gIG9wZW5Ob2RlKG5vZGUpIHtcbiAgICBpZiAoIWVtaXRzV3JhcHBpbmdUYWdzKG5vZGUpKSByZXR1cm47XG5cbiAgICBjb25zdCBjbGFzc05hbWUgPSBzY29wZVRvQ1NTQ2xhc3Mobm9kZS5zY29wZSxcbiAgICAgIHsgcHJlZml4OiB0aGlzLmNsYXNzUHJlZml4IH0pO1xuICAgIHRoaXMuc3BhbihjbGFzc05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBub2RlIGNsb3NlIHRvIHRoZSBvdXRwdXQgc3RyZWFtIChpZiBuZWVkZWQpXG4gICAqXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAqL1xuICBjbG9zZU5vZGUobm9kZSkge1xuICAgIGlmICghZW1pdHNXcmFwcGluZ1RhZ3Mobm9kZSkpIHJldHVybjtcblxuICAgIHRoaXMuYnVmZmVyICs9IFNQQU5fQ0xPU0U7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyB0aGUgYWNjdW11bGF0ZWQgYnVmZmVyXG4gICovXG4gIHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlcjtcbiAgfVxuXG4gIC8vIGhlbHBlcnNcblxuICAvKipcbiAgICogQnVpbGRzIGEgc3BhbiBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgKi9cbiAgc3BhbihjbGFzc05hbWUpIHtcbiAgICB0aGlzLmJ1ZmZlciArPSBgPHNwYW4gY2xhc3M9XCIke2NsYXNzTmFtZX1cIj5gO1xuICB9XG59XG5cbi8qKiBAdHlwZWRlZiB7e3Njb3BlPzogc3RyaW5nLCBsYW5ndWFnZT86IHN0cmluZywgY2hpbGRyZW46IE5vZGVbXX0gfCBzdHJpbmd9IE5vZGUgKi9cbi8qKiBAdHlwZWRlZiB7e3Njb3BlPzogc3RyaW5nLCBsYW5ndWFnZT86IHN0cmluZywgY2hpbGRyZW46IE5vZGVbXX0gfSBEYXRhTm9kZSAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkVtaXR0ZXJ9IEVtaXR0ZXIgKi9cbi8qKiAgKi9cblxuLyoqIEByZXR1cm5zIHtEYXRhTm9kZX0gKi9cbmNvbnN0IG5ld05vZGUgPSAob3B0cyA9IHt9KSA9PiB7XG4gIC8qKiBAdHlwZSBEYXRhTm9kZSAqL1xuICBjb25zdCByZXN1bHQgPSB7IGNoaWxkcmVuOiBbXSB9O1xuICBPYmplY3QuYXNzaWduKHJlc3VsdCwgb3B0cyk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5jbGFzcyBUb2tlblRyZWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvKiogQHR5cGUgRGF0YU5vZGUgKi9cbiAgICB0aGlzLnJvb3ROb2RlID0gbmV3Tm9kZSgpO1xuICAgIHRoaXMuc3RhY2sgPSBbdGhpcy5yb290Tm9kZV07XG4gIH1cblxuICBnZXQgdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV07XG4gIH1cblxuICBnZXQgcm9vdCgpIHsgcmV0dXJuIHRoaXMucm9vdE5vZGU7IH1cblxuICAvKiogQHBhcmFtIHtOb2RlfSBub2RlICovXG4gIGFkZChub2RlKSB7XG4gICAgdGhpcy50b3AuY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgfVxuXG4gIC8qKiBAcGFyYW0ge3N0cmluZ30gc2NvcGUgKi9cbiAgb3Blbk5vZGUoc2NvcGUpIHtcbiAgICAvKiogQHR5cGUgTm9kZSAqL1xuICAgIGNvbnN0IG5vZGUgPSBuZXdOb2RlKHsgc2NvcGUgfSk7XG4gICAgdGhpcy5hZGQobm9kZSk7XG4gICAgdGhpcy5zdGFjay5wdXNoKG5vZGUpO1xuICB9XG5cbiAgY2xvc2VOb2RlKCkge1xuICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YWNrLnBvcCgpO1xuICAgIH1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNsb3NlQWxsTm9kZXMoKSB7XG4gICAgd2hpbGUgKHRoaXMuY2xvc2VOb2RlKCkpO1xuICB9XG5cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnJvb3ROb2RlLCBudWxsLCA0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7IGltcG9ydChcIi4vaHRtbF9yZW5kZXJlclwiKS5SZW5kZXJlciB9IFJlbmRlcmVyXG4gICAqIEBwYXJhbSB7UmVuZGVyZXJ9IGJ1aWxkZXJcbiAgICovXG4gIHdhbGsoYnVpbGRlcikge1xuICAgIC8vIHRoaXMgZG9lcyBub3RcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5fd2FsayhidWlsZGVyLCB0aGlzLnJvb3ROb2RlKTtcbiAgICAvLyB0aGlzIHdvcmtzXG4gICAgLy8gcmV0dXJuIFRva2VuVHJlZS5fd2FsayhidWlsZGVyLCB0aGlzLnJvb3ROb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1JlbmRlcmVyfSBidWlsZGVyXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAgKi9cbiAgc3RhdGljIF93YWxrKGJ1aWxkZXIsIG5vZGUpIHtcbiAgICBpZiAodHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGJ1aWxkZXIuYWRkVGV4dChub2RlKTtcbiAgICB9IGVsc2UgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgIGJ1aWxkZXIub3Blbk5vZGUobm9kZSk7XG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB0aGlzLl93YWxrKGJ1aWxkZXIsIGNoaWxkKSk7XG4gICAgICBidWlsZGVyLmNsb3NlTm9kZShub2RlKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1aWxkZXI7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqL1xuICBzdGF0aWMgX2NvbGxhcHNlKG5vZGUpIHtcbiAgICBpZiAodHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIpIHJldHVybjtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHJldHVybjtcblxuICAgIGlmIChub2RlLmNoaWxkcmVuLmV2ZXJ5KGVsID0+IHR5cGVvZiBlbCA9PT0gXCJzdHJpbmdcIikpIHtcbiAgICAgIC8vIG5vZGUudGV4dCA9IG5vZGUuY2hpbGRyZW4uam9pbihcIlwiKTtcbiAgICAgIC8vIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgbm9kZS5jaGlsZHJlbiA9IFtub2RlLmNoaWxkcmVuLmpvaW4oXCJcIildO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgIFRva2VuVHJlZS5fY29sbGFwc2UoY2hpbGQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICBDdXJyZW50bHkgdGhpcyBpcyBhbGwgcHJpdmF0ZSBBUEksIGJ1dCB0aGlzIGlzIHRoZSBtaW5pbWFsIEFQSSBuZWNlc3NhcnlcbiAgdGhhdCBhbiBFbWl0dGVyIG11c3QgaW1wbGVtZW50IHRvIGZ1bGx5IHN1cHBvcnQgdGhlIHBhcnNlci5cblxuICBNaW5pbWFsIGludGVyZmFjZTpcblxuICAtIGFkZFRleHQodGV4dClcbiAgLSBfX2FkZFN1Ymxhbmd1YWdlKGVtaXR0ZXIsIHN1Ykxhbmd1YWdlTmFtZSlcbiAgLSBzdGFydFNjb3BlKHNjb3BlKVxuICAtIGVuZFNjb3BlKClcbiAgLSBmaW5hbGl6ZSgpXG4gIC0gdG9IVE1MKClcblxuKi9cblxuLyoqXG4gKiBAaW1wbGVtZW50cyB7RW1pdHRlcn1cbiAqL1xuY2xhc3MgVG9rZW5UcmVlRW1pdHRlciBleHRlbmRzIFRva2VuVHJlZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0geyp9IG9wdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiAgICovXG4gIGFkZFRleHQodGV4dCkge1xuICAgIGlmICh0ZXh0ID09PSBcIlwiKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5hZGQodGV4dCk7XG4gIH1cblxuICAvKiogQHBhcmFtIHtzdHJpbmd9IHNjb3BlICovXG4gIHN0YXJ0U2NvcGUoc2NvcGUpIHtcbiAgICB0aGlzLm9wZW5Ob2RlKHNjb3BlKTtcbiAgfVxuXG4gIGVuZFNjb3BlKCkge1xuICAgIHRoaXMuY2xvc2VOb2RlKCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbWl0dGVyICYge3Jvb3Q6IERhdGFOb2RlfX0gZW1pdHRlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKi9cbiAgX19hZGRTdWJsYW5ndWFnZShlbWl0dGVyLCBuYW1lKSB7XG4gICAgLyoqIEB0eXBlIERhdGFOb2RlICovXG4gICAgY29uc3Qgbm9kZSA9IGVtaXR0ZXIucm9vdDtcbiAgICBpZiAobmFtZSkgbm9kZS5zY29wZSA9IGBsYW5ndWFnZToke25hbWV9YDtcblxuICAgIHRoaXMuYWRkKG5vZGUpO1xuICB9XG5cbiAgdG9IVE1MKCkge1xuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IEhUTUxSZW5kZXJlcih0aGlzLCB0aGlzLm9wdGlvbnMpO1xuICAgIHJldHVybiByZW5kZXJlci52YWx1ZSgpO1xuICB9XG5cbiAgZmluYWxpemUoKSB7XG4gICAgdGhpcy5jbG9zZUFsbE5vZGVzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqIEByZXR1cm5zIHtSZWdFeHB9XG4gKiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7UmVnRXhwIHwgc3RyaW5nIH0gcmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHNvdXJjZShyZSkge1xuICBpZiAoIXJlKSByZXR1cm4gbnVsbDtcbiAgaWYgKHR5cGVvZiByZSA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIHJlO1xuXG4gIHJldHVybiByZS5zb3VyY2U7XG59XG5cbi8qKlxuICogQHBhcmFtIHtSZWdFeHAgfCBzdHJpbmcgfSByZVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gbG9va2FoZWFkKHJlKSB7XG4gIHJldHVybiBjb25jYXQoJyg/PScsIHJlLCAnKScpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7UmVnRXhwIHwgc3RyaW5nIH0gcmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGFueU51bWJlck9mVGltZXMocmUpIHtcbiAgcmV0dXJuIGNvbmNhdCgnKD86JywgcmUsICcpKicpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7UmVnRXhwIHwgc3RyaW5nIH0gcmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIG9wdGlvbmFsKHJlKSB7XG4gIHJldHVybiBjb25jYXQoJyg/OicsIHJlLCAnKT8nKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gey4uLihSZWdFeHAgfCBzdHJpbmcpIH0gYXJnc1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gY29uY2F0KC4uLmFyZ3MpIHtcbiAgY29uc3Qgam9pbmVkID0gYXJncy5tYXAoKHgpID0+IHNvdXJjZSh4KSkuam9pbihcIlwiKTtcbiAgcmV0dXJuIGpvaW5lZDtcbn1cblxuLyoqXG4gKiBAcGFyYW0geyBBcnJheTxzdHJpbmcgfCBSZWdFeHAgfCBPYmplY3Q+IH0gYXJnc1xuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuZnVuY3Rpb24gc3RyaXBPcHRpb25zRnJvbUFyZ3MoYXJncykge1xuICBjb25zdCBvcHRzID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuXG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ29iamVjdCcgJiYgb3B0cy5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgYXJncy5zcGxpY2UoYXJncy5sZW5ndGggLSAxLCAxKTtcbiAgICByZXR1cm4gb3B0cztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cblxuLyoqIEB0eXBlZGVmIHsge2NhcHR1cmU/OiBib29sZWFufSB9IFJlZ2V4RWl0aGVyT3B0aW9ucyAqL1xuXG4vKipcbiAqIEFueSBvZiB0aGUgcGFzc2VkIGV4cHJlc3NzaW9ucyBtYXkgbWF0Y2hcbiAqXG4gKiBDcmVhdGVzIGEgaHVnZSB0aGlzIHwgdGhpcyB8IHRoYXQgfCB0aGF0IG1hdGNoXG4gKiBAcGFyYW0geyhSZWdFeHAgfCBzdHJpbmcpW10gfCBbLi4uKFJlZ0V4cCB8IHN0cmluZylbXSwgUmVnZXhFaXRoZXJPcHRpb25zXX0gYXJnc1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZWl0aGVyKC4uLmFyZ3MpIHtcbiAgLyoqIEB0eXBlIHsgb2JqZWN0ICYge2NhcHR1cmU/OiBib29sZWFufSB9ICAqL1xuICBjb25zdCBvcHRzID0gc3RyaXBPcHRpb25zRnJvbUFyZ3MoYXJncyk7XG4gIGNvbnN0IGpvaW5lZCA9ICcoJ1xuICAgICsgKG9wdHMuY2FwdHVyZSA/IFwiXCIgOiBcIj86XCIpXG4gICAgKyBhcmdzLm1hcCgoeCkgPT4gc291cmNlKHgpKS5qb2luKFwifFwiKSArIFwiKVwiO1xuICByZXR1cm4gam9pbmVkO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7UmVnRXhwIHwgc3RyaW5nfSByZVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gY291bnRNYXRjaEdyb3VwcyhyZSkge1xuICByZXR1cm4gKG5ldyBSZWdFeHAocmUudG9TdHJpbmcoKSArICd8JykpLmV4ZWMoJycpLmxlbmd0aCAtIDE7XG59XG5cbi8qKlxuICogRG9lcyBsZXhlbWUgc3RhcnQgd2l0aCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBtYXRjaCBhdCB0aGUgYmVnaW5uaW5nXG4gKiBAcGFyYW0ge1JlZ0V4cH0gcmVcbiAqIEBwYXJhbSB7c3RyaW5nfSBsZXhlbWVcbiAqL1xuZnVuY3Rpb24gc3RhcnRzV2l0aChyZSwgbGV4ZW1lKSB7XG4gIGNvbnN0IG1hdGNoID0gcmUgJiYgcmUuZXhlYyhsZXhlbWUpO1xuICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2guaW5kZXggPT09IDA7XG59XG5cbi8vIEJBQ0tSRUZfUkUgbWF0Y2hlcyBhbiBvcGVuIHBhcmVudGhlc2lzIG9yIGJhY2tyZWZlcmVuY2UuIFRvIGF2b2lkXG4vLyBhbiBpbmNvcnJlY3QgcGFyc2UsIGl0IGFkZGl0aW9uYWxseSBtYXRjaGVzIHRoZSBmb2xsb3dpbmc6XG4vLyAtIFsuLi5dIGVsZW1lbnRzLCB3aGVyZSB0aGUgbWVhbmluZyBvZiBwYXJlbnRoZXNlcyBhbmQgZXNjYXBlcyBjaGFuZ2Vcbi8vIC0gb3RoZXIgZXNjYXBlIHNlcXVlbmNlcywgc28gd2UgZG8gbm90IG1pc3BhcnNlIGVzY2FwZSBzZXF1ZW5jZXMgYXNcbi8vICAgaW50ZXJlc3RpbmcgZWxlbWVudHNcbi8vIC0gbm9uLW1hdGNoaW5nIG9yIGxvb2thaGVhZCBwYXJlbnRoZXNlcywgd2hpY2ggZG8gbm90IGNhcHR1cmUuIFRoZXNlXG4vLyAgIGZvbGxvdyB0aGUgJygnIHdpdGggYSAnPycuXG5jb25zdCBCQUNLUkVGX1JFID0gL1xcWyg/OlteXFxcXFxcXV18XFxcXC4pKlxcXXxcXChcXD8/fFxcXFwoWzEtOV1bMC05XSopfFxcXFwuLztcblxuLy8gKipJTlRFUk5BTCoqIE5vdCBpbnRlbmRlZCBmb3Igb3V0c2lkZSB1c2FnZVxuLy8gam9pbiBsb2dpY2FsbHkgY29tcHV0ZXMgcmVnZXhwcy5qb2luKHNlcGFyYXRvciksIGJ1dCBmaXhlcyB0aGVcbi8vIGJhY2tyZWZlcmVuY2VzIHNvIHRoZXkgY29udGludWUgdG8gbWF0Y2guXG4vLyBpdCBhbHNvIHBsYWNlcyBlYWNoIGluZGl2aWR1YWwgcmVndWxhciBleHByZXNzaW9uIGludG8gaXQncyBvd25cbi8vIG1hdGNoIGdyb3VwLCBrZWVwaW5nIHRyYWNrIG9mIHRoZSBzZXF1ZW5jaW5nIG9mIHRob3NlIG1hdGNoIGdyb3Vwc1xuLy8gaXMgY3VycmVudGx5IGFuIGV4ZXJjaXNlIGZvciB0aGUgY2FsbGVyLiA6LSlcbi8qKlxuICogQHBhcmFtIHsoc3RyaW5nIHwgUmVnRXhwKVtdfSByZWdleHBzXG4gKiBAcGFyYW0ge3tqb2luV2l0aDogc3RyaW5nfX0gb3B0c1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gX3Jld3JpdGVCYWNrcmVmZXJlbmNlcyhyZWdleHBzLCB7IGpvaW5XaXRoIH0pIHtcbiAgbGV0IG51bUNhcHR1cmVzID0gMDtcblxuICByZXR1cm4gcmVnZXhwcy5tYXAoKHJlZ2V4KSA9PiB7XG4gICAgbnVtQ2FwdHVyZXMgKz0gMTtcbiAgICBjb25zdCBvZmZzZXQgPSBudW1DYXB0dXJlcztcbiAgICBsZXQgcmUgPSBzb3VyY2UocmVnZXgpO1xuICAgIGxldCBvdXQgPSAnJztcblxuICAgIHdoaWxlIChyZS5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IEJBQ0tSRUZfUkUuZXhlYyhyZSk7XG4gICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgIG91dCArPSByZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBvdXQgKz0gcmUuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KTtcbiAgICAgIHJlID0gcmUuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgIGlmIChtYXRjaFswXVswXSA9PT0gJ1xcXFwnICYmIG1hdGNoWzFdKSB7XG4gICAgICAgIC8vIEFkanVzdCB0aGUgYmFja3JlZmVyZW5jZS5cbiAgICAgICAgb3V0ICs9ICdcXFxcJyArIFN0cmluZyhOdW1iZXIobWF0Y2hbMV0pICsgb2Zmc2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dCArPSBtYXRjaFswXTtcbiAgICAgICAgaWYgKG1hdGNoWzBdID09PSAnKCcpIHtcbiAgICAgICAgICBudW1DYXB0dXJlcysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH0pLm1hcChyZSA9PiBgKCR7cmV9KWApLmpvaW4oam9pbldpdGgpO1xufVxuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuTW9kZX0gTW9kZSAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLk1vZGVDYWxsYmFja30gTW9kZUNhbGxiYWNrICovXG5cbi8vIENvbW1vbiByZWdleHBzXG5jb25zdCBNQVRDSF9OT1RISU5HX1JFID0gL1xcYlxcQi87XG5jb25zdCBJREVOVF9SRSA9ICdbYS16QS1aXVxcXFx3Kic7XG5jb25zdCBVTkRFUlNDT1JFX0lERU5UX1JFID0gJ1thLXpBLVpfXVxcXFx3Kic7XG5jb25zdCBOVU1CRVJfUkUgPSAnXFxcXGJcXFxcZCsoXFxcXC5cXFxcZCspPyc7XG5jb25zdCBDX05VTUJFUl9SRSA9ICcoLT8pKFxcXFxiMFt4WF1bYS1mQS1GMC05XSt8KFxcXFxiXFxcXGQrKFxcXFwuXFxcXGQqKT98XFxcXC5cXFxcZCspKFtlRV1bLStdP1xcXFxkKyk/KSc7IC8vIDB4Li4uLCAwLi4uLCBkZWNpbWFsLCBmbG9hdFxuY29uc3QgQklOQVJZX05VTUJFUl9SRSA9ICdcXFxcYigwYlswMV0rKSc7IC8vIDBiLi4uXG5jb25zdCBSRV9TVEFSVEVSU19SRSA9ICchfCE9fCE9PXwlfCU9fCZ8JiZ8Jj18XFxcXCp8XFxcXCo9fFxcXFwrfFxcXFwrPXwsfC18LT18Lz18L3w6fDt8PDx8PDw9fDw9fDx8PT09fD09fD18Pj4+PXw+Pj18Pj18Pj4+fD4+fD58XFxcXD98XFxcXFt8XFxcXHt8XFxcXCh8XFxcXF58XFxcXF49fFxcXFx8fFxcXFx8PXxcXFxcfFxcXFx8fH4nO1xuXG4vKipcbiogQHBhcmFtIHsgUGFydGlhbDxNb2RlPiAmIHtiaW5hcnk/OiBzdHJpbmcgfCBSZWdFeHB9IH0gb3B0c1xuKi9cbmNvbnN0IFNIRUJBTkcgPSAob3B0cyA9IHt9KSA9PiB7XG4gIGNvbnN0IGJlZ2luU2hlYmFuZyA9IC9eIyFbIF0qXFwvLztcbiAgaWYgKG9wdHMuYmluYXJ5KSB7XG4gICAgb3B0cy5iZWdpbiA9IGNvbmNhdChcbiAgICAgIGJlZ2luU2hlYmFuZyxcbiAgICAgIC8uKlxcYi8sXG4gICAgICBvcHRzLmJpbmFyeSxcbiAgICAgIC9cXGIuKi8pO1xuICB9XG4gIHJldHVybiBpbmhlcml0JDEoe1xuICAgIHNjb3BlOiAnbWV0YScsXG4gICAgYmVnaW46IGJlZ2luU2hlYmFuZyxcbiAgICBlbmQ6IC8kLyxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgLyoqIEB0eXBlIHtNb2RlQ2FsbGJhY2t9ICovXG4gICAgXCJvbjpiZWdpblwiOiAobSwgcmVzcCkgPT4ge1xuICAgICAgaWYgKG0uaW5kZXggIT09IDApIHJlc3AuaWdub3JlTWF0Y2goKTtcbiAgICB9XG4gIH0sIG9wdHMpO1xufTtcblxuLy8gQ29tbW9uIG1vZGVzXG5jb25zdCBCQUNLU0xBU0hfRVNDQVBFID0ge1xuICBiZWdpbjogJ1xcXFxcXFxcW1xcXFxzXFxcXFNdJywgcmVsZXZhbmNlOiAwXG59O1xuY29uc3QgQVBPU19TVFJJTkdfTU9ERSA9IHtcbiAgc2NvcGU6ICdzdHJpbmcnLFxuICBiZWdpbjogJ1xcJycsXG4gIGVuZDogJ1xcJycsXG4gIGlsbGVnYWw6ICdcXFxcbicsXG4gIGNvbnRhaW5zOiBbQkFDS1NMQVNIX0VTQ0FQRV1cbn07XG5jb25zdCBRVU9URV9TVFJJTkdfTU9ERSA9IHtcbiAgc2NvcGU6ICdzdHJpbmcnLFxuICBiZWdpbjogJ1wiJyxcbiAgZW5kOiAnXCInLFxuICBpbGxlZ2FsOiAnXFxcXG4nLFxuICBjb250YWluczogW0JBQ0tTTEFTSF9FU0NBUEVdXG59O1xuY29uc3QgUEhSQVNBTF9XT1JEU19NT0RFID0ge1xuICBiZWdpbjogL1xcYihhfGFufHRoZXxhcmV8SSdtfGlzbid0fGRvbid0fGRvZXNuJ3R8d29uJ3R8YnV0fGp1c3R8c2hvdWxkfHByZXR0eXxzaW1wbHl8ZW5vdWdofGdvbm5hfGdvaW5nfHd0Znxzb3xzdWNofHdpbGx8eW91fHlvdXJ8dGhleXxsaWtlfG1vcmUpXFxiL1xufTtcbi8qKlxuICogQ3JlYXRlcyBhIGNvbW1lbnQgbW9kZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nIHwgUmVnRXhwfSBiZWdpblxuICogQHBhcmFtIHtzdHJpbmcgfCBSZWdFeHB9IGVuZFxuICogQHBhcmFtIHtNb2RlIHwge319IFttb2RlT3B0aW9uc11cbiAqIEByZXR1cm5zIHtQYXJ0aWFsPE1vZGU+fVxuICovXG5jb25zdCBDT01NRU5UID0gZnVuY3Rpb24oYmVnaW4sIGVuZCwgbW9kZU9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBtb2RlID0gaW5oZXJpdCQxKFxuICAgIHtcbiAgICAgIHNjb3BlOiAnY29tbWVudCcsXG4gICAgICBiZWdpbixcbiAgICAgIGVuZCxcbiAgICAgIGNvbnRhaW5zOiBbXVxuICAgIH0sXG4gICAgbW9kZU9wdGlvbnNcbiAgKTtcbiAgbW9kZS5jb250YWlucy5wdXNoKHtcbiAgICBzY29wZTogJ2RvY3RhZycsXG4gICAgLy8gaGFjayB0byBhdm9pZCB0aGUgc3BhY2UgZnJvbSBiZWluZyBpbmNsdWRlZC4gdGhlIHNwYWNlIGlzIG5lY2Vzc2FyeSB0b1xuICAgIC8vIG1hdGNoIGhlcmUgdG8gcHJldmVudCB0aGUgcGxhaW4gdGV4dCBydWxlIGJlbG93IGZyb20gZ29iYmxpbmcgdXAgZG9jdGFnc1xuICAgIGJlZ2luOiAnWyBdKig/PShUT0RPfEZJWE1FfE5PVEV8QlVHfE9QVElNSVpFfEhBQ0t8WFhYKTopJyxcbiAgICBlbmQ6IC8oVE9ET3xGSVhNRXxOT1RFfEJVR3xPUFRJTUlaRXxIQUNLfFhYWCk6LyxcbiAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH0pO1xuICBjb25zdCBFTkdMSVNIX1dPUkQgPSBlaXRoZXIoXG4gICAgLy8gbGlzdCBvZiBjb21tb24gMSBhbmQgMiBsZXR0ZXIgd29yZHMgaW4gRW5nbGlzaFxuICAgIFwiSVwiLFxuICAgIFwiYVwiLFxuICAgIFwiaXNcIixcbiAgICBcInNvXCIsXG4gICAgXCJ1c1wiLFxuICAgIFwidG9cIixcbiAgICBcImF0XCIsXG4gICAgXCJpZlwiLFxuICAgIFwiaW5cIixcbiAgICBcIml0XCIsXG4gICAgXCJvblwiLFxuICAgIC8vIG5vdGU6IHRoaXMgaXMgbm90IGFuIGV4aGF1c3RpdmUgbGlzdCBvZiBjb250cmFjdGlvbnMsIGp1c3QgcG9wdWxhciBvbmVzXG4gICAgL1tBLVphLXpdK1snXShkfHZlfHJlfGxsfHR8c3xuKS8sIC8vIGNvbnRyYWN0aW9ucyAtIGNhbid0IHdlJ2QgdGhleSdyZSBsZXQncywgZXRjXG4gICAgL1tBLVphLXpdK1stXVthLXpdKy8sIC8vIGBuby13YXlgLCBldGMuXG4gICAgL1tBLVphLXpdW2Etel17Mix9LyAvLyBhbGxvdyBjYXBpdGFsaXplZCB3b3JkcyBhdCBiZWdpbm5pbmcgb2Ygc2VudGVuY2VzXG4gICk7XG4gIC8vIGxvb2tpbmcgbGlrZSBwbGFpbiB0ZXh0LCBtb3JlIGxpa2VseSB0byBiZSBhIGNvbW1lbnRcbiAgbW9kZS5jb250YWlucy5wdXNoKFxuICAgIHtcbiAgICAgIC8vIFRPRE86IGhvdyB0byBpbmNsdWRlIFwiLCAoLCApIHdpdGhvdXQgYnJlYWtpbmcgZ3JhbW1hcnMgdGhhdCB1c2UgdGhlc2UgZm9yXG4gICAgICAvLyBjb21tZW50IGRlbGltaXRlcnM/XG4gICAgICAvLyBiZWdpbjogL1sgXSsoWygpXCJdPyhbQS1aYS16Jy1dezMsfXxpc3xhfEl8c298dXN8W3RUXVtvT118YXR8aWZ8aW58aXR8b24pWy5dP1soKVwiOl0/KFsuXVsgXXxbIF18XFwpKSl7M30vXG4gICAgICAvLyAtLS1cblxuICAgICAgLy8gdGhpcyB0cmllcyB0byBmaW5kIHNlcXVlbmNlcyBvZiAzIGVuZ2xpc2ggd29yZHMgaW4gYSByb3cgKHdpdGhvdXQgYW55XG4gICAgICAvLyBcInByb2dyYW1taW5nXCIgdHlwZSBzeW50YXgpIHRoaXMgZ2l2ZXMgdXMgYSBzdHJvbmcgc2lnbmFsIHRoYXQgd2UndmVcbiAgICAgIC8vIFRSVUxZIGZvdW5kIGEgY29tbWVudCAtIHZzIHBlcmhhcHMgc2Nhbm5pbmcgd2l0aCB0aGUgd3JvbmcgbGFuZ3VhZ2UuXG4gICAgICAvLyBJdCdzIHBvc3NpYmxlIHRvIGZpbmQgc29tZXRoaW5nIHRoYXQgTE9PS1MgbGlrZSB0aGUgc3RhcnQgb2YgdGhlXG4gICAgICAvLyBjb21tZW50IC0gYnV0IHRoZW4gaWYgdGhlcmUgaXMgbm8gcmVhZGFibGUgdGV4dCAtIGdvb2QgY2hhbmNlIGl0IGlzIGFcbiAgICAgIC8vIGZhbHNlIG1hdGNoIGFuZCBub3QgYSBjb21tZW50LlxuICAgICAgLy9cbiAgICAgIC8vIGZvciBhIHZpc3VhbCBleGFtcGxlIHBsZWFzZSBzZWU6XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaGlnaGxpZ2h0anMvaGlnaGxpZ2h0LmpzL2lzc3Vlcy8yODI3XG5cbiAgICAgIGJlZ2luOiBjb25jYXQoXG4gICAgICAgIC9bIF0rLywgLy8gbmVjZXNzYXJ5IHRvIHByZXZlbnQgdXMgZ29iYmxpbmcgdXAgZG9jdGFncyBsaWtlIC8qIEBhdXRob3IgQm9iIE1jZ2lsbCAqL1xuICAgICAgICAnKCcsXG4gICAgICAgIEVOR0xJU0hfV09SRCxcbiAgICAgICAgL1suXT9bOl0/KFsuXVsgXXxbIF0pLyxcbiAgICAgICAgJyl7M30nKSAvLyBsb29rIGZvciAzIHdvcmRzIGluIGEgcm93XG4gICAgfVxuICApO1xuICByZXR1cm4gbW9kZTtcbn07XG5jb25zdCBDX0xJTkVfQ09NTUVOVF9NT0RFID0gQ09NTUVOVCgnLy8nLCAnJCcpO1xuY29uc3QgQ19CTE9DS19DT01NRU5UX01PREUgPSBDT01NRU5UKCcvXFxcXConLCAnXFxcXCovJyk7XG5jb25zdCBIQVNIX0NPTU1FTlRfTU9ERSA9IENPTU1FTlQoJyMnLCAnJCcpO1xuY29uc3QgTlVNQkVSX01PREUgPSB7XG4gIHNjb3BlOiAnbnVtYmVyJyxcbiAgYmVnaW46IE5VTUJFUl9SRSxcbiAgcmVsZXZhbmNlOiAwXG59O1xuY29uc3QgQ19OVU1CRVJfTU9ERSA9IHtcbiAgc2NvcGU6ICdudW1iZXInLFxuICBiZWdpbjogQ19OVU1CRVJfUkUsXG4gIHJlbGV2YW5jZTogMFxufTtcbmNvbnN0IEJJTkFSWV9OVU1CRVJfTU9ERSA9IHtcbiAgc2NvcGU6ICdudW1iZXInLFxuICBiZWdpbjogQklOQVJZX05VTUJFUl9SRSxcbiAgcmVsZXZhbmNlOiAwXG59O1xuY29uc3QgUkVHRVhQX01PREUgPSB7XG4gIHNjb3BlOiBcInJlZ2V4cFwiLFxuICBiZWdpbjogL1xcLyg/PVteL1xcbl0qXFwvKS8sXG4gIGVuZDogL1xcL1tnaW11eV0qLyxcbiAgY29udGFpbnM6IFtcbiAgICBCQUNLU0xBU0hfRVNDQVBFLFxuICAgIHtcbiAgICAgIGJlZ2luOiAvXFxbLyxcbiAgICAgIGVuZDogL1xcXS8sXG4gICAgICByZWxldmFuY2U6IDAsXG4gICAgICBjb250YWluczogW0JBQ0tTTEFTSF9FU0NBUEVdXG4gICAgfVxuICBdXG59O1xuY29uc3QgVElUTEVfTU9ERSA9IHtcbiAgc2NvcGU6ICd0aXRsZScsXG4gIGJlZ2luOiBJREVOVF9SRSxcbiAgcmVsZXZhbmNlOiAwXG59O1xuY29uc3QgVU5ERVJTQ09SRV9USVRMRV9NT0RFID0ge1xuICBzY29wZTogJ3RpdGxlJyxcbiAgYmVnaW46IFVOREVSU0NPUkVfSURFTlRfUkUsXG4gIHJlbGV2YW5jZTogMFxufTtcbmNvbnN0IE1FVEhPRF9HVUFSRCA9IHtcbiAgLy8gZXhjbHVkZXMgbWV0aG9kIG5hbWVzIGZyb20ga2V5d29yZCBwcm9jZXNzaW5nXG4gIGJlZ2luOiAnXFxcXC5cXFxccyonICsgVU5ERVJTQ09SRV9JREVOVF9SRSxcbiAgcmVsZXZhbmNlOiAwXG59O1xuXG4vKipcbiAqIEFkZHMgZW5kIHNhbWUgYXMgYmVnaW4gbWVjaGFuaWNzIHRvIGEgbW9kZVxuICpcbiAqIFlvdXIgbW9kZSBtdXN0IGluY2x1ZGUgYXQgbGVhc3QgYSBzaW5nbGUgKCkgbWF0Y2ggZ3JvdXAgYXMgdGhhdCBmaXJzdCBtYXRjaFxuICogZ3JvdXAgaXMgd2hhdCBpcyB1c2VkIGZvciBjb21wYXJpc29uXG4gKiBAcGFyYW0ge1BhcnRpYWw8TW9kZT59IG1vZGVcbiAqL1xuY29uc3QgRU5EX1NBTUVfQVNfQkVHSU4gPSBmdW5jdGlvbihtb2RlKSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKG1vZGUsXG4gICAge1xuICAgICAgLyoqIEB0eXBlIHtNb2RlQ2FsbGJhY2t9ICovXG4gICAgICAnb246YmVnaW4nOiAobSwgcmVzcCkgPT4geyByZXNwLmRhdGEuX2JlZ2luTWF0Y2ggPSBtWzFdOyB9LFxuICAgICAgLyoqIEB0eXBlIHtNb2RlQ2FsbGJhY2t9ICovXG4gICAgICAnb246ZW5kJzogKG0sIHJlc3ApID0+IHsgaWYgKHJlc3AuZGF0YS5fYmVnaW5NYXRjaCAhPT0gbVsxXSkgcmVzcC5pZ25vcmVNYXRjaCgpOyB9XG4gICAgfSk7XG59O1xuXG52YXIgTU9ERVMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gIF9fcHJvdG9fXzogbnVsbCxcbiAgQVBPU19TVFJJTkdfTU9ERTogQVBPU19TVFJJTkdfTU9ERSxcbiAgQkFDS1NMQVNIX0VTQ0FQRTogQkFDS1NMQVNIX0VTQ0FQRSxcbiAgQklOQVJZX05VTUJFUl9NT0RFOiBCSU5BUllfTlVNQkVSX01PREUsXG4gIEJJTkFSWV9OVU1CRVJfUkU6IEJJTkFSWV9OVU1CRVJfUkUsXG4gIENPTU1FTlQ6IENPTU1FTlQsXG4gIENfQkxPQ0tfQ09NTUVOVF9NT0RFOiBDX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgQ19MSU5FX0NPTU1FTlRfTU9ERTogQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgQ19OVU1CRVJfTU9ERTogQ19OVU1CRVJfTU9ERSxcbiAgQ19OVU1CRVJfUkU6IENfTlVNQkVSX1JFLFxuICBFTkRfU0FNRV9BU19CRUdJTjogRU5EX1NBTUVfQVNfQkVHSU4sXG4gIEhBU0hfQ09NTUVOVF9NT0RFOiBIQVNIX0NPTU1FTlRfTU9ERSxcbiAgSURFTlRfUkU6IElERU5UX1JFLFxuICBNQVRDSF9OT1RISU5HX1JFOiBNQVRDSF9OT1RISU5HX1JFLFxuICBNRVRIT0RfR1VBUkQ6IE1FVEhPRF9HVUFSRCxcbiAgTlVNQkVSX01PREU6IE5VTUJFUl9NT0RFLFxuICBOVU1CRVJfUkU6IE5VTUJFUl9SRSxcbiAgUEhSQVNBTF9XT1JEU19NT0RFOiBQSFJBU0FMX1dPUkRTX01PREUsXG4gIFFVT1RFX1NUUklOR19NT0RFOiBRVU9URV9TVFJJTkdfTU9ERSxcbiAgUkVHRVhQX01PREU6IFJFR0VYUF9NT0RFLFxuICBSRV9TVEFSVEVSU19SRTogUkVfU1RBUlRFUlNfUkUsXG4gIFNIRUJBTkc6IFNIRUJBTkcsXG4gIFRJVExFX01PREU6IFRJVExFX01PREUsXG4gIFVOREVSU0NPUkVfSURFTlRfUkU6IFVOREVSU0NPUkVfSURFTlRfUkUsXG4gIFVOREVSU0NPUkVfVElUTEVfTU9ERTogVU5ERVJTQ09SRV9USVRMRV9NT0RFXG59KTtcblxuLyoqXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5DYWxsYmFja1Jlc3BvbnNlfSBDYWxsYmFja1Jlc3BvbnNlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Db21waWxlckV4dH0gQ29tcGlsZXJFeHRcbiovXG5cbi8vIEdyYW1tYXIgZXh0ZW5zaW9ucyAvIHBsdWdpbnNcbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy9pc3N1ZXMvMjgzM1xuXG4vLyBHcmFtbWFyIGV4dGVuc2lvbnMgYWxsb3cgXCJzeW50YWN0aWMgc3VnYXJcIiB0byBiZSBhZGRlZCB0byB0aGUgZ3JhbW1hciBtb2Rlc1xuLy8gd2l0aG91dCByZXF1aXJpbmcgYW55IHVuZGVybHlpbmcgY2hhbmdlcyB0byB0aGUgY29tcGlsZXIgaW50ZXJuYWxzLlxuXG4vLyBgY29tcGlsZU1hdGNoYCBiZWluZyB0aGUgcGVyZmVjdCBzbWFsbCBleGFtcGxlIG9mIG5vdyBhbGxvd2luZyBhIGdyYW1tYXJcbi8vIGF1dGhvciB0byB3cml0ZSBgbWF0Y2hgIHdoZW4gdGhleSBkZXNpcmUgdG8gbWF0Y2ggYSBzaW5nbGUgZXhwcmVzc2lvbiByYXRoZXJcbi8vIHRoYW4gYmVpbmcgZm9yY2VkIHRvIHVzZSBgYmVnaW5gLiAgVGhlIGV4dGVuc2lvbiB0aGVuIGp1c3QgbW92ZXMgYG1hdGNoYCBpbnRvXG4vLyBgYmVnaW5gIHdoZW4gaXQgcnVucy4gIEllLCBubyBmZWF0dXJlcyBoYXZlIGJlZW4gYWRkZWQsIGJ1dCB3ZSd2ZSBqdXN0IG1hZGVcbi8vIHRoZSBleHBlcmllbmNlIG9mIHdyaXRpbmcgKGFuZCByZWFkaW5nIGdyYW1tYXJzKSBhIGxpdHRsZSBiaXQgbmljZXIuXG5cbi8vIC0tLS0tLVxuXG4vLyBUT0RPOiBXZSBuZWVkIG5lZ2F0aXZlIGxvb2stYmVoaW5kIHN1cHBvcnQgdG8gZG8gdGhpcyBwcm9wZXJseVxuLyoqXG4gKiBTa2lwIGEgbWF0Y2ggaWYgaXQgaGFzIGEgcHJlY2VkaW5nIGRvdFxuICpcbiAqIFRoaXMgaXMgdXNlZCBmb3IgYGJlZ2luS2V5d29yZHNgIHRvIHByZXZlbnQgbWF0Y2hpbmcgZXhwcmVzc2lvbnMgc3VjaCBhc1xuICogYGJvYi5rZXl3b3JkLmRvKClgLiBUaGUgbW9kZSBjb21waWxlciBhdXRvbWF0aWNhbGx5IHdpcmVzIHRoaXMgdXAgYXMgYVxuICogc3BlY2lhbCBfaW50ZXJuYWxfICdvbjpiZWdpbicgY2FsbGJhY2sgZm9yIG1vZGVzIHdpdGggYGJlZ2luS2V5d29yZHNgXG4gKiBAcGFyYW0ge1JlZ0V4cE1hdGNoQXJyYXl9IG1hdGNoXG4gKiBAcGFyYW0ge0NhbGxiYWNrUmVzcG9uc2V9IHJlc3BvbnNlXG4gKi9cbmZ1bmN0aW9uIHNraXBJZkhhc1ByZWNlZGluZ0RvdChtYXRjaCwgcmVzcG9uc2UpIHtcbiAgY29uc3QgYmVmb3JlID0gbWF0Y2guaW5wdXRbbWF0Y2guaW5kZXggLSAxXTtcbiAgaWYgKGJlZm9yZSA9PT0gXCIuXCIpIHtcbiAgICByZXNwb25zZS5pZ25vcmVNYXRjaCgpO1xuICB9XG59XG5cbi8qKlxuICpcbiAqIEB0eXBlIHtDb21waWxlckV4dH1cbiAqL1xuZnVuY3Rpb24gc2NvcGVDbGFzc05hbWUobW9kZSwgX3BhcmVudCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gIGlmIChtb2RlLmNsYXNzTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbW9kZS5zY29wZSA9IG1vZGUuY2xhc3NOYW1lO1xuICAgIGRlbGV0ZSBtb2RlLmNsYXNzTmFtZTtcbiAgfVxufVxuXG4vKipcbiAqIGBiZWdpbktleXdvcmRzYCBzeW50YWN0aWMgc3VnYXJcbiAqIEB0eXBlIHtDb21waWxlckV4dH1cbiAqL1xuZnVuY3Rpb24gYmVnaW5LZXl3b3Jkcyhtb2RlLCBwYXJlbnQpIHtcbiAgaWYgKCFwYXJlbnQpIHJldHVybjtcbiAgaWYgKCFtb2RlLmJlZ2luS2V5d29yZHMpIHJldHVybjtcblxuICAvLyBmb3IgbGFuZ3VhZ2VzIHdpdGgga2V5d29yZHMgdGhhdCBpbmNsdWRlIG5vbi13b3JkIGNoYXJhY3RlcnMgY2hlY2tpbmcgZm9yXG4gIC8vIGEgd29yZCBib3VuZGFyeSBpcyBub3Qgc3VmZmljaWVudCwgc28gaW5zdGVhZCB3ZSBjaGVjayBmb3IgYSB3b3JkIGJvdW5kYXJ5XG4gIC8vIG9yIHdoaXRlc3BhY2UgLSB0aGlzIGRvZXMgbm8gaGFybSBpbiBhbnkgY2FzZSBzaW5jZSBvdXIga2V5d29yZCBlbmdpbmVcbiAgLy8gZG9lc24ndCBhbGxvdyBzcGFjZXMgaW4ga2V5d29yZHMgYW55d2F5cyBhbmQgd2Ugc3RpbGwgY2hlY2sgZm9yIHRoZSBib3VuZGFyeVxuICAvLyBmaXJzdFxuICBtb2RlLmJlZ2luID0gJ1xcXFxiKCcgKyBtb2RlLmJlZ2luS2V5d29yZHMuc3BsaXQoJyAnKS5qb2luKCd8JykgKyAnKSg/IVxcXFwuKSg/PVxcXFxifFxcXFxzKSc7XG4gIG1vZGUuX19iZWZvcmVCZWdpbiA9IHNraXBJZkhhc1ByZWNlZGluZ0RvdDtcbiAgbW9kZS5rZXl3b3JkcyA9IG1vZGUua2V5d29yZHMgfHwgbW9kZS5iZWdpbktleXdvcmRzO1xuICBkZWxldGUgbW9kZS5iZWdpbktleXdvcmRzO1xuXG4gIC8vIHByZXZlbnRzIGRvdWJsZSByZWxldmFuY2UsIHRoZSBrZXl3b3JkcyB0aGVtc2VsdmVzIHByb3ZpZGVcbiAgLy8gcmVsZXZhbmNlLCB0aGUgbW9kZSBkb2Vzbid0IG5lZWQgdG8gZG91YmxlIGl0XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZmluZWRcbiAgaWYgKG1vZGUucmVsZXZhbmNlID09PSB1bmRlZmluZWQpIG1vZGUucmVsZXZhbmNlID0gMDtcbn1cblxuLyoqXG4gKiBBbGxvdyBgaWxsZWdhbGAgdG8gY29udGFpbiBhbiBhcnJheSBvZiBpbGxlZ2FsIHZhbHVlc1xuICogQHR5cGUge0NvbXBpbGVyRXh0fVxuICovXG5mdW5jdGlvbiBjb21waWxlSWxsZWdhbChtb2RlLCBfcGFyZW50KSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShtb2RlLmlsbGVnYWwpKSByZXR1cm47XG5cbiAgbW9kZS5pbGxlZ2FsID0gZWl0aGVyKC4uLm1vZGUuaWxsZWdhbCk7XG59XG5cbi8qKlxuICogYG1hdGNoYCB0byBtYXRjaCBhIHNpbmdsZSBleHByZXNzaW9uIGZvciByZWFkYWJpbGl0eVxuICogQHR5cGUge0NvbXBpbGVyRXh0fVxuICovXG5mdW5jdGlvbiBjb21waWxlTWF0Y2gobW9kZSwgX3BhcmVudCkge1xuICBpZiAoIW1vZGUubWF0Y2gpIHJldHVybjtcbiAgaWYgKG1vZGUuYmVnaW4gfHwgbW9kZS5lbmQpIHRocm93IG5ldyBFcnJvcihcImJlZ2luICYgZW5kIGFyZSBub3Qgc3VwcG9ydGVkIHdpdGggbWF0Y2hcIik7XG5cbiAgbW9kZS5iZWdpbiA9IG1vZGUubWF0Y2g7XG4gIGRlbGV0ZSBtb2RlLm1hdGNoO1xufVxuXG4vKipcbiAqIHByb3ZpZGVzIHRoZSBkZWZhdWx0IDEgcmVsZXZhbmNlIHRvIGFsbCBtb2Rlc1xuICogQHR5cGUge0NvbXBpbGVyRXh0fVxuICovXG5mdW5jdGlvbiBjb21waWxlUmVsZXZhbmNlKG1vZGUsIF9wYXJlbnQpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmaW5lZFxuICBpZiAobW9kZS5yZWxldmFuY2UgPT09IHVuZGVmaW5lZCkgbW9kZS5yZWxldmFuY2UgPSAxO1xufVxuXG4vLyBhbGxvdyBiZWZvcmVNYXRjaCB0byBhY3QgYXMgYSBcInF1YWxpZmllclwiIGZvciB0aGUgbWF0Y2hcbi8vIHRoZSBmdWxsIG1hdGNoIGJlZ2luIG11c3QgYmUgW2JlZm9yZU1hdGNoXVtiZWdpbl1cbmNvbnN0IGJlZm9yZU1hdGNoRXh0ID0gKG1vZGUsIHBhcmVudCkgPT4ge1xuICBpZiAoIW1vZGUuYmVmb3JlTWF0Y2gpIHJldHVybjtcbiAgLy8gc3RhcnRzIGNvbmZsaWN0cyB3aXRoIGVuZHNQYXJlbnQgd2hpY2ggd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhlIGNoaWxkXG4gIC8vIHJ1bGUgaXMgbm90IG1hdGNoZWQgbXVsdGlwbGUgdGltZXNcbiAgaWYgKG1vZGUuc3RhcnRzKSB0aHJvdyBuZXcgRXJyb3IoXCJiZWZvcmVNYXRjaCBjYW5ub3QgYmUgdXNlZCB3aXRoIHN0YXJ0c1wiKTtcblxuICBjb25zdCBvcmlnaW5hbE1vZGUgPSBPYmplY3QuYXNzaWduKHt9LCBtb2RlKTtcbiAgT2JqZWN0LmtleXMobW9kZSkuZm9yRWFjaCgoa2V5KSA9PiB7IGRlbGV0ZSBtb2RlW2tleV07IH0pO1xuXG4gIG1vZGUua2V5d29yZHMgPSBvcmlnaW5hbE1vZGUua2V5d29yZHM7XG4gIG1vZGUuYmVnaW4gPSBjb25jYXQob3JpZ2luYWxNb2RlLmJlZm9yZU1hdGNoLCBsb29rYWhlYWQob3JpZ2luYWxNb2RlLmJlZ2luKSk7XG4gIG1vZGUuc3RhcnRzID0ge1xuICAgIHJlbGV2YW5jZTogMCxcbiAgICBjb250YWluczogW1xuICAgICAgT2JqZWN0LmFzc2lnbihvcmlnaW5hbE1vZGUsIHsgZW5kc1BhcmVudDogdHJ1ZSB9KVxuICAgIF1cbiAgfTtcbiAgbW9kZS5yZWxldmFuY2UgPSAwO1xuXG4gIGRlbGV0ZSBvcmlnaW5hbE1vZGUuYmVmb3JlTWF0Y2g7XG59O1xuXG4vLyBrZXl3b3JkcyB0aGF0IHNob3VsZCBoYXZlIG5vIGRlZmF1bHQgcmVsZXZhbmNlIHZhbHVlXG5jb25zdCBDT01NT05fS0VZV09SRFMgPSBbXG4gICdvZicsXG4gICdhbmQnLFxuICAnZm9yJyxcbiAgJ2luJyxcbiAgJ25vdCcsXG4gICdvcicsXG4gICdpZicsXG4gICd0aGVuJyxcbiAgJ3BhcmVudCcsIC8vIGNvbW1vbiB2YXJpYWJsZSBuYW1lXG4gICdsaXN0JywgLy8gY29tbW9uIHZhcmlhYmxlIG5hbWVcbiAgJ3ZhbHVlJyAvLyBjb21tb24gdmFyaWFibGUgbmFtZVxuXTtcblxuY29uc3QgREVGQVVMVF9LRVlXT1JEX1NDT1BFID0gXCJrZXl3b3JkXCI7XG5cbi8qKlxuICogR2l2ZW4gcmF3IGtleXdvcmRzIGZyb20gYSBsYW5ndWFnZSBkZWZpbml0aW9uLCBjb21waWxlIHRoZW0uXG4gKlxuICogQHBhcmFtIHtzdHJpbmcgfCBSZWNvcmQ8c3RyaW5nLHN0cmluZ3xzdHJpbmdbXT4gfCBBcnJheTxzdHJpbmc+fSByYXdLZXl3b3Jkc1xuICogQHBhcmFtIHtib29sZWFufSBjYXNlSW5zZW5zaXRpdmVcbiAqL1xuZnVuY3Rpb24gY29tcGlsZUtleXdvcmRzKHJhd0tleXdvcmRzLCBjYXNlSW5zZW5zaXRpdmUsIHNjb3BlTmFtZSA9IERFRkFVTFRfS0VZV09SRF9TQ09QRSkge1xuICAvKiogQHR5cGUge2ltcG9ydChcImhpZ2hsaWdodC5qcy9wcml2YXRlXCIpLktleXdvcmREaWN0fSAqL1xuICBjb25zdCBjb21waWxlZEtleXdvcmRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAvLyBpbnB1dCBjYW4gYmUgYSBzdHJpbmcgb2Yga2V5d29yZHMsIGFuIGFycmF5IG9mIGtleXdvcmRzLCBvciBhIG9iamVjdCB3aXRoXG4gIC8vIG5hbWVkIGtleXMgcmVwcmVzZW50aW5nIHNjb3BlTmFtZSAod2hpY2ggY2FuIHRoZW4gcG9pbnQgdG8gYSBzdHJpbmcgb3IgYXJyYXkpXG4gIGlmICh0eXBlb2YgcmF3S2V5d29yZHMgPT09ICdzdHJpbmcnKSB7XG4gICAgY29tcGlsZUxpc3Qoc2NvcGVOYW1lLCByYXdLZXl3b3Jkcy5zcGxpdChcIiBcIikpO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmF3S2V5d29yZHMpKSB7XG4gICAgY29tcGlsZUxpc3Qoc2NvcGVOYW1lLCByYXdLZXl3b3Jkcyk7XG4gIH0gZWxzZSB7XG4gICAgT2JqZWN0LmtleXMocmF3S2V5d29yZHMpLmZvckVhY2goZnVuY3Rpb24oc2NvcGVOYW1lKSB7XG4gICAgICAvLyBjb2xsYXBzZSBhbGwgb3VyIG9iamVjdHMgYmFjayBpbnRvIHRoZSBwYXJlbnQgb2JqZWN0XG4gICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICBjb21waWxlZEtleXdvcmRzLFxuICAgICAgICBjb21waWxlS2V5d29yZHMocmF3S2V5d29yZHNbc2NvcGVOYW1lXSwgY2FzZUluc2Vuc2l0aXZlLCBzY29wZU5hbWUpXG4gICAgICApO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb21waWxlZEtleXdvcmRzO1xuXG4gIC8vIC0tLVxuXG4gIC8qKlxuICAgKiBDb21waWxlcyBhbiBpbmRpdmlkdWFsIGxpc3Qgb2Yga2V5d29yZHNcbiAgICpcbiAgICogRXg6IFwiZm9yIGlmIHdoZW4gd2hpbGV8NVwiXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY29wZU5hbWVcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBrZXl3b3JkTGlzdFxuICAgKi9cbiAgZnVuY3Rpb24gY29tcGlsZUxpc3Qoc2NvcGVOYW1lLCBrZXl3b3JkTGlzdCkge1xuICAgIGlmIChjYXNlSW5zZW5zaXRpdmUpIHtcbiAgICAgIGtleXdvcmRMaXN0ID0ga2V5d29yZExpc3QubWFwKHggPT4geC50b0xvd2VyQ2FzZSgpKTtcbiAgICB9XG4gICAga2V5d29yZExpc3QuZm9yRWFjaChmdW5jdGlvbihrZXl3b3JkKSB7XG4gICAgICBjb25zdCBwYWlyID0ga2V5d29yZC5zcGxpdCgnfCcpO1xuICAgICAgY29tcGlsZWRLZXl3b3Jkc1twYWlyWzBdXSA9IFtzY29wZU5hbWUsIHNjb3JlRm9yS2V5d29yZChwYWlyWzBdLCBwYWlyWzFdKV07XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBwcm9wZXIgc2NvcmUgZm9yIGEgZ2l2ZW4ga2V5d29yZFxuICpcbiAqIEFsc28gdGFrZXMgaW50byBhY2NvdW50IGNvbW1lbnQga2V5d29yZHMsIHdoaWNoIHdpbGwgYmUgc2NvcmVkIDAgVU5MRVNTXG4gKiBhbm90aGVyIHNjb3JlIGhhcyBiZWVuIG1hbnVhbGx5IGFzc2lnbmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGtleXdvcmRcbiAqIEBwYXJhbSB7c3RyaW5nfSBbcHJvdmlkZWRTY29yZV1cbiAqL1xuZnVuY3Rpb24gc2NvcmVGb3JLZXl3b3JkKGtleXdvcmQsIHByb3ZpZGVkU2NvcmUpIHtcbiAgLy8gbWFudWFsIHNjb3JlcyBhbHdheXMgd2luIG92ZXIgY29tbW9uIGtleXdvcmRzXG4gIC8vIHNvIHlvdSBjYW4gZm9yY2UgYSBzY29yZSBvZiAxIGlmIHlvdSByZWFsbHkgaW5zaXN0XG4gIGlmIChwcm92aWRlZFNjb3JlKSB7XG4gICAgcmV0dXJuIE51bWJlcihwcm92aWRlZFNjb3JlKTtcbiAgfVxuXG4gIHJldHVybiBjb21tb25LZXl3b3JkKGtleXdvcmQpID8gMCA6IDE7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBhIGdpdmVuIGtleXdvcmQgaXMgY29tbW9uIG9yIG5vdFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXl3b3JkICovXG5mdW5jdGlvbiBjb21tb25LZXl3b3JkKGtleXdvcmQpIHtcbiAgcmV0dXJuIENPTU1PTl9LRVlXT1JEUy5pbmNsdWRlcyhrZXl3b3JkLnRvTG93ZXJDYXNlKCkpO1xufVxuXG4vKlxuXG5Gb3IgdGhlIHJlYXNvbmluZyBiZWhpbmQgdGhpcyBwbGVhc2Ugc2VlOlxuaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy9pc3N1ZXMvMjg4MCNpc3N1ZWNvbW1lbnQtNzQ3Mjc1NDE5XG5cbiovXG5cbi8qKlxuICogQHR5cGUge1JlY29yZDxzdHJpbmcsIGJvb2xlYW4+fVxuICovXG5jb25zdCBzZWVuRGVwcmVjYXRpb25zID0ge307XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAqL1xuY29uc3QgZXJyb3IgPSAobWVzc2FnZSkgPT4ge1xuICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICogQHBhcmFtIHthbnl9IGFyZ3NcbiAqL1xuY29uc3Qgd2FybiA9IChtZXNzYWdlLCAuLi5hcmdzKSA9PiB7XG4gIGNvbnNvbGUubG9nKGBXQVJOOiAke21lc3NhZ2V9YCwgLi4uYXJncyk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJzaW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICovXG5jb25zdCBkZXByZWNhdGVkID0gKHZlcnNpb24sIG1lc3NhZ2UpID0+IHtcbiAgaWYgKHNlZW5EZXByZWNhdGlvbnNbYCR7dmVyc2lvbn0vJHttZXNzYWdlfWBdKSByZXR1cm47XG5cbiAgY29uc29sZS5sb2coYERlcHJlY2F0ZWQgYXMgb2YgJHt2ZXJzaW9ufS4gJHttZXNzYWdlfWApO1xuICBzZWVuRGVwcmVjYXRpb25zW2Ake3ZlcnNpb259LyR7bWVzc2FnZX1gXSA9IHRydWU7XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby10aHJvdy1saXRlcmFsICovXG5cbi8qKlxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuQ29tcGlsZWRNb2RlfSBDb21waWxlZE1vZGVcbiovXG5cbmNvbnN0IE11bHRpQ2xhc3NFcnJvciA9IG5ldyBFcnJvcigpO1xuXG4vKipcbiAqIFJlbnVtYmVycyBsYWJlbGVkIHNjb3BlIG5hbWVzIHRvIGFjY291bnQgZm9yIGFkZGl0aW9uYWwgaW5uZXIgbWF0Y2hcbiAqIGdyb3VwcyB0aGF0IG90aGVyd2lzZSB3b3VsZCBicmVhayBldmVyeXRoaW5nLlxuICpcbiAqIExldHMgc2F5IHdlIDMgbWF0Y2ggc2NvcGVzOlxuICpcbiAqICAgeyAxID0+IC4uLiwgMiA9PiAuLi4sIDMgPT4gLi4uIH1cbiAqXG4gKiBTbyB3aGF0IHdlIG5lZWQgaXMgYSBjbGVhbiBtYXRjaCBsaWtlIHRoaXM6XG4gKlxuICogICAoYSkoYikoYykgPT4gWyBcImFcIiwgXCJiXCIsIFwiY1wiIF1cbiAqXG4gKiBCdXQgdGhpcyBmYWxscyBhcGFydCB3aXRoIGlubmVyIG1hdGNoIGdyb3VwczpcbiAqXG4gKiAoYSkoKChiKSkpKGMpID0+IFtcImFcIiwgXCJiXCIsIFwiYlwiLCBcImJcIiwgXCJjXCIgXVxuICpcbiAqIE91ciBzY29wZXMgYXJlIG5vdyBcIm91dCBvZiBhbGlnbm1lbnRcIiBhbmQgd2UncmUgcmVwZWF0aW5nIGBiYCAzIHRpbWVzLlxuICogV2hhdCBuZWVkcyB0byBoYXBwZW4gaXMgdGhlIG51bWJlcnMgYXJlIHJlbWFwcGVkOlxuICpcbiAqICAgeyAxID0+IC4uLiwgMiA9PiAuLi4sIDUgPT4gLi4uIH1cbiAqXG4gKiBXZSBhbHNvIG5lZWQgdG8ga25vdyB0aGF0IHRoZSBPTkxZIGdyb3VwcyB0aGF0IHNob3VsZCBiZSBvdXRwdXRcbiAqIGFyZSAxLCAyLCBhbmQgNS4gIFRoaXMgZnVuY3Rpb24gaGFuZGxlcyB0aGlzIGJlaGF2aW9yLlxuICpcbiAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlfSBtb2RlXG4gKiBAcGFyYW0ge0FycmF5PFJlZ0V4cCB8IHN0cmluZz59IHJlZ2V4ZXNcbiAqIEBwYXJhbSB7e2tleTogXCJiZWdpblNjb3BlXCJ8XCJlbmRTY29wZVwifX0gb3B0c1xuICovXG5mdW5jdGlvbiByZW1hcFNjb3BlTmFtZXMobW9kZSwgcmVnZXhlcywgeyBrZXkgfSkge1xuICBsZXQgb2Zmc2V0ID0gMDtcbiAgY29uc3Qgc2NvcGVOYW1lcyA9IG1vZGVba2V5XTtcbiAgLyoqIEB0eXBlIFJlY29yZDxudW1iZXIsYm9vbGVhbj4gKi9cbiAgY29uc3QgZW1pdCA9IHt9O1xuICAvKiogQHR5cGUgUmVjb3JkPG51bWJlcixzdHJpbmc+ICovXG4gIGNvbnN0IHBvc2l0aW9ucyA9IHt9O1xuXG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IHJlZ2V4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBwb3NpdGlvbnNbaSArIG9mZnNldF0gPSBzY29wZU5hbWVzW2ldO1xuICAgIGVtaXRbaSArIG9mZnNldF0gPSB0cnVlO1xuICAgIG9mZnNldCArPSBjb3VudE1hdGNoR3JvdXBzKHJlZ2V4ZXNbaSAtIDFdKTtcbiAgfVxuICAvLyB3ZSB1c2UgX2VtaXQgdG8ga2VlcCB0cmFjayBvZiB3aGljaCBtYXRjaCBncm91cHMgYXJlIFwidG9wLWxldmVsXCIgdG8gYXZvaWQgZG91YmxlXG4gIC8vIG91dHB1dCBmcm9tIGluc2lkZSBtYXRjaCBncm91cHNcbiAgbW9kZVtrZXldID0gcG9zaXRpb25zO1xuICBtb2RlW2tleV0uX2VtaXQgPSBlbWl0O1xuICBtb2RlW2tleV0uX211bHRpID0gdHJ1ZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0NvbXBpbGVkTW9kZX0gbW9kZVxuICovXG5mdW5jdGlvbiBiZWdpbk11bHRpQ2xhc3MobW9kZSkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobW9kZS5iZWdpbikpIHJldHVybjtcblxuICBpZiAobW9kZS5za2lwIHx8IG1vZGUuZXhjbHVkZUJlZ2luIHx8IG1vZGUucmV0dXJuQmVnaW4pIHtcbiAgICBlcnJvcihcInNraXAsIGV4Y2x1ZGVCZWdpbiwgcmV0dXJuQmVnaW4gbm90IGNvbXBhdGlibGUgd2l0aCBiZWdpblNjb3BlOiB7fVwiKTtcbiAgICB0aHJvdyBNdWx0aUNsYXNzRXJyb3I7XG4gIH1cblxuICBpZiAodHlwZW9mIG1vZGUuYmVnaW5TY29wZSAhPT0gXCJvYmplY3RcIiB8fCBtb2RlLmJlZ2luU2NvcGUgPT09IG51bGwpIHtcbiAgICBlcnJvcihcImJlZ2luU2NvcGUgbXVzdCBiZSBvYmplY3RcIik7XG4gICAgdGhyb3cgTXVsdGlDbGFzc0Vycm9yO1xuICB9XG5cbiAgcmVtYXBTY29wZU5hbWVzKG1vZGUsIG1vZGUuYmVnaW4sIHsga2V5OiBcImJlZ2luU2NvcGVcIiB9KTtcbiAgbW9kZS5iZWdpbiA9IF9yZXdyaXRlQmFja3JlZmVyZW5jZXMobW9kZS5iZWdpbiwgeyBqb2luV2l0aDogXCJcIiB9KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0NvbXBpbGVkTW9kZX0gbW9kZVxuICovXG5mdW5jdGlvbiBlbmRNdWx0aUNsYXNzKG1vZGUpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KG1vZGUuZW5kKSkgcmV0dXJuO1xuXG4gIGlmIChtb2RlLnNraXAgfHwgbW9kZS5leGNsdWRlRW5kIHx8IG1vZGUucmV0dXJuRW5kKSB7XG4gICAgZXJyb3IoXCJza2lwLCBleGNsdWRlRW5kLCByZXR1cm5FbmQgbm90IGNvbXBhdGlibGUgd2l0aCBlbmRTY29wZToge31cIik7XG4gICAgdGhyb3cgTXVsdGlDbGFzc0Vycm9yO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBtb2RlLmVuZFNjb3BlICE9PSBcIm9iamVjdFwiIHx8IG1vZGUuZW5kU2NvcGUgPT09IG51bGwpIHtcbiAgICBlcnJvcihcImVuZFNjb3BlIG11c3QgYmUgb2JqZWN0XCIpO1xuICAgIHRocm93IE11bHRpQ2xhc3NFcnJvcjtcbiAgfVxuXG4gIHJlbWFwU2NvcGVOYW1lcyhtb2RlLCBtb2RlLmVuZCwgeyBrZXk6IFwiZW5kU2NvcGVcIiB9KTtcbiAgbW9kZS5lbmQgPSBfcmV3cml0ZUJhY2tyZWZlcmVuY2VzKG1vZGUuZW5kLCB7IGpvaW5XaXRoOiBcIlwiIH0pO1xufVxuXG4vKipcbiAqIHRoaXMgZXhpc3RzIG9ubHkgdG8gYWxsb3cgYHNjb3BlOiB7fWAgdG8gYmUgdXNlZCBiZXNpZGUgYG1hdGNoOmBcbiAqIE90aGVyd2lzZSBgYmVnaW5TY29wZWAgd291bGQgbmVjZXNzYXJ5IGFuZCB0aGF0IHdvdWxkIGxvb2sgd2VpcmRcblxuICB7XG4gICAgbWF0Y2g6IFsgL2RlZi8sIC9cXHcrLyBdXG4gICAgc2NvcGU6IHsgMTogXCJrZXl3b3JkXCIgLCAyOiBcInRpdGxlXCIgfVxuICB9XG5cbiAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlfSBtb2RlXG4gKi9cbmZ1bmN0aW9uIHNjb3BlU3VnYXIobW9kZSkge1xuICBpZiAobW9kZS5zY29wZSAmJiB0eXBlb2YgbW9kZS5zY29wZSA9PT0gXCJvYmplY3RcIiAmJiBtb2RlLnNjb3BlICE9PSBudWxsKSB7XG4gICAgbW9kZS5iZWdpblNjb3BlID0gbW9kZS5zY29wZTtcbiAgICBkZWxldGUgbW9kZS5zY29wZTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlfSBtb2RlXG4gKi9cbmZ1bmN0aW9uIE11bHRpQ2xhc3MobW9kZSkge1xuICBzY29wZVN1Z2FyKG1vZGUpO1xuXG4gIGlmICh0eXBlb2YgbW9kZS5iZWdpblNjb3BlID09PSBcInN0cmluZ1wiKSB7XG4gICAgbW9kZS5iZWdpblNjb3BlID0geyBfd3JhcDogbW9kZS5iZWdpblNjb3BlIH07XG4gIH1cbiAgaWYgKHR5cGVvZiBtb2RlLmVuZFNjb3BlID09PSBcInN0cmluZ1wiKSB7XG4gICAgbW9kZS5lbmRTY29wZSA9IHsgX3dyYXA6IG1vZGUuZW5kU2NvcGUgfTtcbiAgfVxuXG4gIGJlZ2luTXVsdGlDbGFzcyhtb2RlKTtcbiAgZW5kTXVsdGlDbGFzcyhtb2RlKTtcbn1cblxuLyoqXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Nb2RlfSBNb2RlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Db21waWxlZE1vZGV9IENvbXBpbGVkTW9kZVxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuTGFuZ3VhZ2V9IExhbmd1YWdlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5ITEpTUGx1Z2lufSBITEpTUGx1Z2luXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Db21waWxlZExhbmd1YWdlfSBDb21waWxlZExhbmd1YWdlXG4qL1xuXG4vLyBjb21waWxhdGlvblxuXG4vKipcbiAqIENvbXBpbGVzIGEgbGFuZ3VhZ2UgZGVmaW5pdGlvbiByZXN1bHRcbiAqXG4gKiBHaXZlbiB0aGUgcmF3IHJlc3VsdCBvZiBhIGxhbmd1YWdlIGRlZmluaXRpb24gKExhbmd1YWdlKSwgY29tcGlsZXMgdGhpcyBzb1xuICogdGhhdCBpdCBpcyByZWFkeSBmb3IgaGlnaGxpZ2h0aW5nIGNvZGUuXG4gKiBAcGFyYW0ge0xhbmd1YWdlfSBsYW5ndWFnZVxuICogQHJldHVybnMge0NvbXBpbGVkTGFuZ3VhZ2V9XG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGVMYW5ndWFnZShsYW5ndWFnZSkge1xuICAvKipcbiAgICogQnVpbGRzIGEgcmVnZXggd2l0aCB0aGUgY2FzZSBzZW5zaXRpdml0eSBvZiB0aGUgY3VycmVudCBsYW5ndWFnZVxuICAgKlxuICAgKiBAcGFyYW0ge1JlZ0V4cCB8IHN0cmluZ30gdmFsdWVcbiAgICogQHBhcmFtIHtib29sZWFufSBbZ2xvYmFsXVxuICAgKi9cbiAgZnVuY3Rpb24gbGFuZ1JlKHZhbHVlLCBnbG9iYWwpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChcbiAgICAgIHNvdXJjZSh2YWx1ZSksXG4gICAgICAnbSdcbiAgICAgICsgKGxhbmd1YWdlLmNhc2VfaW5zZW5zaXRpdmUgPyAnaScgOiAnJylcbiAgICAgICsgKGxhbmd1YWdlLnVuaWNvZGVSZWdleCA/ICd1JyA6ICcnKVxuICAgICAgKyAoZ2xvYmFsID8gJ2cnIDogJycpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgIFN0b3JlcyBtdWx0aXBsZSByZWd1bGFyIGV4cHJlc3Npb25zIGFuZCBhbGxvd3MgeW91IHRvIHF1aWNrbHkgc2VhcmNoIGZvclxuICAgIHRoZW0gYWxsIGluIGEgc3RyaW5nIHNpbXVsdGFuZW91c2x5IC0gcmV0dXJuaW5nIHRoZSBmaXJzdCBtYXRjaC4gIEl0IGRvZXNcbiAgICB0aGlzIGJ5IGNyZWF0aW5nIGEgaHVnZSAoYXxifGMpIHJlZ2V4IC0gZWFjaCBpbmRpdmlkdWFsIGl0ZW0gd3JhcHBlZCB3aXRoICgpXG4gICAgYW5kIGpvaW5lZCBieSBgfGAgLSB1c2luZyBtYXRjaCBncm91cHMgdG8gdHJhY2sgcG9zaXRpb24uICBXaGVuIGEgbWF0Y2ggaXNcbiAgICBmb3VuZCBjaGVja2luZyB3aGljaCBwb3NpdGlvbiBpbiB0aGUgYXJyYXkgaGFzIGNvbnRlbnQgYWxsb3dzIHVzIHRvIGZpZ3VyZVxuICAgIG91dCB3aGljaCBvZiB0aGUgb3JpZ2luYWwgcmVnZXhlcyAvIG1hdGNoIGdyb3VwcyB0cmlnZ2VyZWQgdGhlIG1hdGNoLlxuXG4gICAgVGhlIG1hdGNoIG9iamVjdCBpdHNlbGYgKHRoZSByZXN1bHQgb2YgYFJlZ2V4LmV4ZWNgKSBpcyByZXR1cm5lZCBidXQgYWxzb1xuICAgIGVuaGFuY2VkIGJ5IG1lcmdpbmcgaW4gYW55IG1ldGEtZGF0YSB0aGF0IHdhcyByZWdpc3RlcmVkIHdpdGggdGhlIHJlZ2V4LlxuICAgIFRoaXMgaXMgaG93IHdlIGtlZXAgdHJhY2sgb2Ygd2hpY2ggbW9kZSBtYXRjaGVkLCBhbmQgd2hhdCB0eXBlIG9mIHJ1bGVcbiAgICAoYGlsbGVnYWxgLCBgYmVnaW5gLCBlbmQsIGV0YykuXG4gICovXG4gIGNsYXNzIE11bHRpUmVnZXgge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgdGhpcy5tYXRjaEluZGV4ZXMgPSB7fTtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMucmVnZXhlcyA9IFtdO1xuICAgICAgdGhpcy5tYXRjaEF0ID0gMTtcbiAgICAgIHRoaXMucG9zaXRpb24gPSAwO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBhZGRSdWxlKHJlLCBvcHRzKSB7XG4gICAgICBvcHRzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbisrO1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpcy5tYXRjaEluZGV4ZXNbdGhpcy5tYXRjaEF0XSA9IG9wdHM7XG4gICAgICB0aGlzLnJlZ2V4ZXMucHVzaChbb3B0cywgcmVdKTtcbiAgICAgIHRoaXMubWF0Y2hBdCArPSBjb3VudE1hdGNoR3JvdXBzKHJlKSArIDE7XG4gICAgfVxuXG4gICAgY29tcGlsZSgpIHtcbiAgICAgIGlmICh0aGlzLnJlZ2V4ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIGF2b2lkcyB0aGUgbmVlZCB0byBjaGVjayBsZW5ndGggZXZlcnkgdGltZSBleGVjIGlzIGNhbGxlZFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXMuZXhlYyA9ICgpID0+IG51bGw7XG4gICAgICB9XG4gICAgICBjb25zdCB0ZXJtaW5hdG9ycyA9IHRoaXMucmVnZXhlcy5tYXAoZWwgPT4gZWxbMV0pO1xuICAgICAgdGhpcy5tYXRjaGVyUmUgPSBsYW5nUmUoX3Jld3JpdGVCYWNrcmVmZXJlbmNlcyh0ZXJtaW5hdG9ycywgeyBqb2luV2l0aDogJ3wnIH0pLCB0cnVlKTtcbiAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcbiAgICB9XG5cbiAgICAvKiogQHBhcmFtIHtzdHJpbmd9IHMgKi9cbiAgICBleGVjKHMpIHtcbiAgICAgIHRoaXMubWF0Y2hlclJlLmxhc3RJbmRleCA9IHRoaXMubGFzdEluZGV4O1xuICAgICAgY29uc3QgbWF0Y2ggPSB0aGlzLm1hdGNoZXJSZS5leGVjKHMpO1xuICAgICAgaWYgKCFtYXRjaCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gICAgICBjb25zdCBpID0gbWF0Y2guZmluZEluZGV4KChlbCwgaSkgPT4gaSA+IDAgJiYgZWwgIT09IHVuZGVmaW5lZCk7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjb25zdCBtYXRjaERhdGEgPSB0aGlzLm1hdGNoSW5kZXhlc1tpXTtcbiAgICAgIC8vIHRyaW0gb2ZmIGFueSBlYXJsaWVyIG5vbi1yZWxldmFudCBtYXRjaCBncm91cHMgKGllLCB0aGUgb3RoZXIgcmVnZXhcbiAgICAgIC8vIG1hdGNoIGdyb3VwcyB0aGF0IG1ha2UgdXAgdGhlIG11bHRpLW1hdGNoZXIpXG4gICAgICBtYXRjaC5zcGxpY2UoMCwgaSk7XG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG1hdGNoLCBtYXRjaERhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAgQ3JlYXRlZCB0byBzb2x2ZSB0aGUga2V5IGRlZmljaWVudGx5IHdpdGggTXVsdGlSZWdleCAtIHRoZXJlIGlzIG5vIHdheSB0b1xuICAgIHRlc3QgZm9yIG11bHRpcGxlIG1hdGNoZXMgYXQgYSBzaW5nbGUgbG9jYXRpb24uICBXaHkgd291bGQgd2UgbmVlZCB0byBkb1xuICAgIHRoYXQ/ICBJbiB0aGUgZnV0dXJlIGEgbW9yZSBkeW5hbWljIGVuZ2luZSB3aWxsIGFsbG93IGNlcnRhaW4gbWF0Y2hlcyB0byBiZVxuICAgIGlnbm9yZWQuICBBbiBleGFtcGxlOiBpZiB3ZSBtYXRjaGVkIHNheSB0aGUgM3JkIHJlZ2V4IGluIGEgbGFyZ2UgZ3JvdXAgYnV0XG4gICAgZGVjaWRlZCB0byBpZ25vcmUgaXQgLSB3ZSdkIG5lZWQgdG8gc3RhcnRlZCB0ZXN0aW5nIGFnYWluIGF0IHRoZSA0dGhcbiAgICByZWdleC4uLiBidXQgTXVsdGlSZWdleCBpdHNlbGYgZ2l2ZXMgdXMgbm8gcmVhbCB3YXkgdG8gZG8gdGhhdC5cblxuICAgIFNvIHdoYXQgdGhpcyBjbGFzcyBjcmVhdGVzIE11bHRpUmVnZXhzIG9uIHRoZSBmbHkgZm9yIHdoYXRldmVyIHNlYXJjaFxuICAgIHBvc2l0aW9uIHRoZXkgYXJlIG5lZWRlZC5cblxuICAgIE5PVEU6IFRoZXNlIGFkZGl0aW9uYWwgTXVsdGlSZWdleCBvYmplY3RzIGFyZSBjcmVhdGVkIGR5bmFtaWNhbGx5LiAgRm9yIG1vc3RcbiAgICBncmFtbWFycyBtb3N0IG9mIHRoZSB0aW1lIHdlIHdpbGwgbmV2ZXIgYWN0dWFsbHkgbmVlZCBhbnl0aGluZyBtb3JlIHRoYW4gdGhlXG4gICAgZmlyc3QgTXVsdGlSZWdleCAtIHNvIHRoaXMgc2hvdWxkbid0IGhhdmUgdG9vIG11Y2ggb3ZlcmhlYWQuXG5cbiAgICBTYXkgdGhpcyBpcyBvdXIgc2VhcmNoIGdyb3VwLCBhbmQgd2UgbWF0Y2ggcmVnZXgzLCBidXQgd2lzaCB0byBpZ25vcmUgaXQuXG5cbiAgICAgIHJlZ2V4MSB8IHJlZ2V4MiB8IHJlZ2V4MyB8IHJlZ2V4NCB8IHJlZ2V4NSAgICAnIGllLCBzdGFydEF0ID0gMFxuXG4gICAgV2hhdCB3ZSBuZWVkIGlzIGEgbmV3IE11bHRpUmVnZXggdGhhdCBvbmx5IGluY2x1ZGVzIHRoZSByZW1haW5pbmdcbiAgICBwb3NzaWJpbGl0aWVzOlxuXG4gICAgICByZWdleDQgfCByZWdleDUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyBpZSwgc3RhcnRBdCA9IDNcblxuICAgIFRoaXMgY2xhc3Mgd3JhcHMgYWxsIHRoYXQgY29tcGxleGl0eSB1cCBpbiBhIHNpbXBsZSBBUEkuLi4gYHN0YXJ0QXRgIGRlY2lkZXNcbiAgICB3aGVyZSBpbiB0aGUgYXJyYXkgb2YgZXhwcmVzc2lvbnMgdG8gc3RhcnQgZG9pbmcgdGhlIG1hdGNoaW5nLiBJdFxuICAgIGF1dG8taW5jcmVtZW50cywgc28gaWYgYSBtYXRjaCBpcyBmb3VuZCBhdCBwb3NpdGlvbiAyLCB0aGVuIHN0YXJ0QXQgd2lsbCBiZVxuICAgIHNldCB0byAzLiAgSWYgdGhlIGVuZCBpcyByZWFjaGVkIHN0YXJ0QXQgd2lsbCByZXR1cm4gdG8gMC5cblxuICAgIE1PU1Qgb2YgdGhlIHRpbWUgdGhlIHBhcnNlciB3aWxsIGJlIHNldHRpbmcgc3RhcnRBdCBtYW51YWxseSB0byAwLlxuICAqL1xuICBjbGFzcyBSZXN1bWFibGVNdWx0aVJlZ2V4IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMucnVsZXMgPSBbXTtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMubXVsdGlSZWdleGVzID0gW107XG4gICAgICB0aGlzLmNvdW50ID0gMDtcblxuICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xuICAgICAgdGhpcy5yZWdleEluZGV4ID0gMDtcbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZ2V0TWF0Y2hlcihpbmRleCkge1xuICAgICAgaWYgKHRoaXMubXVsdGlSZWdleGVzW2luZGV4XSkgcmV0dXJuIHRoaXMubXVsdGlSZWdleGVzW2luZGV4XTtcblxuICAgICAgY29uc3QgbWF0Y2hlciA9IG5ldyBNdWx0aVJlZ2V4KCk7XG4gICAgICB0aGlzLnJ1bGVzLnNsaWNlKGluZGV4KS5mb3JFYWNoKChbcmUsIG9wdHNdKSA9PiBtYXRjaGVyLmFkZFJ1bGUocmUsIG9wdHMpKTtcbiAgICAgIG1hdGNoZXIuY29tcGlsZSgpO1xuICAgICAgdGhpcy5tdWx0aVJlZ2V4ZXNbaW5kZXhdID0gbWF0Y2hlcjtcbiAgICAgIHJldHVybiBtYXRjaGVyO1xuICAgIH1cblxuICAgIHJlc3VtaW5nU2NhbkF0U2FtZVBvc2l0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVnZXhJbmRleCAhPT0gMDtcbiAgICB9XG5cbiAgICBjb25zaWRlckFsbCgpIHtcbiAgICAgIHRoaXMucmVnZXhJbmRleCA9IDA7XG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGFkZFJ1bGUocmUsIG9wdHMpIHtcbiAgICAgIHRoaXMucnVsZXMucHVzaChbcmUsIG9wdHNdKTtcbiAgICAgIGlmIChvcHRzLnR5cGUgPT09IFwiYmVnaW5cIikgdGhpcy5jb3VudCsrO1xuICAgIH1cblxuICAgIC8qKiBAcGFyYW0ge3N0cmluZ30gcyAqL1xuICAgIGV4ZWMocykge1xuICAgICAgY29uc3QgbSA9IHRoaXMuZ2V0TWF0Y2hlcih0aGlzLnJlZ2V4SW5kZXgpO1xuICAgICAgbS5sYXN0SW5kZXggPSB0aGlzLmxhc3RJbmRleDtcbiAgICAgIGxldCByZXN1bHQgPSBtLmV4ZWMocyk7XG5cbiAgICAgIC8vIFRoZSBmb2xsb3dpbmcgaXMgYmVjYXVzZSB3ZSBoYXZlIG5vIGVhc3kgd2F5IHRvIHNheSBcInJlc3VtZSBzY2FubmluZyBhdCB0aGVcbiAgICAgIC8vIGV4aXN0aW5nIHBvc2l0aW9uIGJ1dCBhbHNvIHNraXAgdGhlIGN1cnJlbnQgcnVsZSBPTkxZXCIuIFdoYXQgaGFwcGVucyBpc1xuICAgICAgLy8gYWxsIHByaW9yIHJ1bGVzIGFyZSBhbHNvIHNraXBwZWQgd2hpY2ggY2FuIHJlc3VsdCBpbiBtYXRjaGluZyB0aGUgd3JvbmdcbiAgICAgIC8vIHRoaW5nLiBFeGFtcGxlIG9mIG1hdGNoaW5nIFwiYm9vZ2VyXCI6XG5cbiAgICAgIC8vIG91ciBtYXRjaGVyIGlzIFtzdHJpbmcsIFwiYm9vZ2VyXCIsIG51bWJlcl1cbiAgICAgIC8vXG4gICAgICAvLyAuLi4uYm9vZ2VyLi4uLlxuXG4gICAgICAvLyBpZiBcImJvb2dlclwiIGlzIGlnbm9yZWQgdGhlbiB3ZSdkIHJlYWxseSBuZWVkIGEgcmVnZXggdG8gc2NhbiBmcm9tIHRoZVxuICAgICAgLy8gU0FNRSBwb3NpdGlvbiBmb3Igb25seTogW3N0cmluZywgbnVtYmVyXSBidXQgaWdub3JpbmcgXCJib29nZXJcIiAoaWYgaXRcbiAgICAgIC8vIHdhcyB0aGUgZmlyc3QgbWF0Y2gpLCBhIHNpbXBsZSByZXN1bWUgd291bGQgc2NhbiBhaGVhZCB3aG8ga25vd3MgaG93XG4gICAgICAvLyBmYXIgbG9va2luZyBvbmx5IGZvciBcIm51bWJlclwiLCBpZ25vcmluZyBwb3RlbnRpYWwgc3RyaW5nIG1hdGNoZXMgKG9yXG4gICAgICAvLyBmdXR1cmUgXCJib29nZXJcIiBtYXRjaGVzIHRoYXQgbWlnaHQgYmUgdmFsaWQuKVxuXG4gICAgICAvLyBTbyB3aGF0IHdlIGRvOiBXZSBleGVjdXRlIHR3byBtYXRjaGVycywgb25lIHJlc3VtaW5nIGF0IHRoZSBzYW1lXG4gICAgICAvLyBwb3NpdGlvbiwgYnV0IHRoZSBzZWNvbmQgZnVsbCBtYXRjaGVyIHN0YXJ0aW5nIGF0IHRoZSBwb3NpdGlvbiBhZnRlcjpcblxuICAgICAgLy8gICAgIC8tLS0gcmVzdW1lIGZpcnN0IHJlZ2V4IG1hdGNoIGhlcmUgKGZvciBbbnVtYmVyXSlcbiAgICAgIC8vICAgICB8Ly0tLS0gZnVsbCBtYXRjaCBoZXJlIGZvciBbc3RyaW5nLCBcImJvb2dlclwiLCBudW1iZXJdXG4gICAgICAvLyAgICAgdnZcbiAgICAgIC8vIC4uLi5ib29nZXIuLi4uXG5cbiAgICAgIC8vIFdoaWNoIGV2ZXIgcmVzdWx0cyBpbiBhIG1hdGNoIGZpcnN0IGlzIHRoZW4gdXNlZC4gU28gdGhpcyAzLTQgc3RlcFxuICAgICAgLy8gcHJvY2VzcyBlc3NlbnRpYWxseSBhbGxvd3MgdXMgdG8gc2F5IFwibWF0Y2ggYXQgdGhpcyBwb3NpdGlvbiwgZXhjbHVkaW5nXG4gICAgICAvLyBhIHByaW9yIHJ1bGUgdGhhdCB3YXMgaWdub3JlZFwiLlxuICAgICAgLy9cbiAgICAgIC8vIDEuIE1hdGNoIFwiYm9vZ2VyXCIgZmlyc3QsIGlnbm9yZS4gQWxzbyBwcm92ZXMgdGhhdCBbc3RyaW5nXSBkb2VzIG5vbiBtYXRjaC5cbiAgICAgIC8vIDIuIFJlc3VtZSBtYXRjaGluZyBmb3IgW251bWJlcl1cbiAgICAgIC8vIDMuIE1hdGNoIGF0IGluZGV4ICsgMSBmb3IgW3N0cmluZywgXCJib29nZXJcIiwgbnVtYmVyXVxuICAgICAgLy8gNC4gSWYgIzIgYW5kICMzIHJlc3VsdCBpbiBtYXRjaGVzLCB3aGljaCBjYW1lIGZpcnN0P1xuICAgICAgaWYgKHRoaXMucmVzdW1pbmdTY2FuQXRTYW1lUG9zaXRpb24oKSkge1xuICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5pbmRleCA9PT0gdGhpcy5sYXN0SW5kZXgpIDsgZWxzZSB7IC8vIHVzZSB0aGUgc2Vjb25kIG1hdGNoZXIgcmVzdWx0XG4gICAgICAgICAgY29uc3QgbTIgPSB0aGlzLmdldE1hdGNoZXIoMCk7XG4gICAgICAgICAgbTIubGFzdEluZGV4ID0gdGhpcy5sYXN0SW5kZXggKyAxO1xuICAgICAgICAgIHJlc3VsdCA9IG0yLmV4ZWMocyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICB0aGlzLnJlZ2V4SW5kZXggKz0gcmVzdWx0LnBvc2l0aW9uICsgMTtcbiAgICAgICAgaWYgKHRoaXMucmVnZXhJbmRleCA9PT0gdGhpcy5jb3VudCkge1xuICAgICAgICAgIC8vIHdyYXAtYXJvdW5kIHRvIGNvbnNpZGVyaW5nIGFsbCBtYXRjaGVzIGFnYWluXG4gICAgICAgICAgdGhpcy5jb25zaWRlckFsbCgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIGEgbW9kZSwgYnVpbGRzIGEgaHVnZSBSZXN1bWFibGVNdWx0aVJlZ2V4IHRoYXQgY2FuIGJlIHVzZWQgdG8gd2Fsa1xuICAgKiB0aGUgY29udGVudCBhbmQgZmluZCBtYXRjaGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0NvbXBpbGVkTW9kZX0gbW9kZVxuICAgKiBAcmV0dXJucyB7UmVzdW1hYmxlTXVsdGlSZWdleH1cbiAgICovXG4gIGZ1bmN0aW9uIGJ1aWxkTW9kZVJlZ2V4KG1vZGUpIHtcbiAgICBjb25zdCBtbSA9IG5ldyBSZXN1bWFibGVNdWx0aVJlZ2V4KCk7XG5cbiAgICBtb2RlLmNvbnRhaW5zLmZvckVhY2godGVybSA9PiBtbS5hZGRSdWxlKHRlcm0uYmVnaW4sIHsgcnVsZTogdGVybSwgdHlwZTogXCJiZWdpblwiIH0pKTtcblxuICAgIGlmIChtb2RlLnRlcm1pbmF0b3JFbmQpIHtcbiAgICAgIG1tLmFkZFJ1bGUobW9kZS50ZXJtaW5hdG9yRW5kLCB7IHR5cGU6IFwiZW5kXCIgfSk7XG4gICAgfVxuICAgIGlmIChtb2RlLmlsbGVnYWwpIHtcbiAgICAgIG1tLmFkZFJ1bGUobW9kZS5pbGxlZ2FsLCB7IHR5cGU6IFwiaWxsZWdhbFwiIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBtbTtcbiAgfVxuXG4gIC8qKiBza2lwIHZzIGFib3J0IHZzIGlnbm9yZVxuICAgKlxuICAgKiBAc2tpcCAgIC0gVGhlIG1vZGUgaXMgc3RpbGwgZW50ZXJlZCBhbmQgZXhpdGVkIG5vcm1hbGx5IChhbmQgY29udGFpbnMgcnVsZXMgYXBwbHkpLFxuICAgKiAgICAgICAgICAgYnV0IGFsbCBjb250ZW50IGlzIGhlbGQgYW5kIGFkZGVkIHRvIHRoZSBwYXJlbnQgYnVmZmVyIHJhdGhlciB0aGFuIGJlaW5nXG4gICAqICAgICAgICAgICBvdXRwdXQgd2hlbiB0aGUgbW9kZSBlbmRzLiAgTW9zdGx5IHVzZWQgd2l0aCBgc3VibGFuZ3VhZ2VgIHRvIGJ1aWxkIHVwXG4gICAqICAgICAgICAgICBhIHNpbmdsZSBsYXJnZSBidWZmZXIgdGhhbiBjYW4gYmUgcGFyc2VkIGJ5IHN1Ymxhbmd1YWdlLlxuICAgKlxuICAgKiAgICAgICAgICAgICAtIFRoZSBtb2RlIGJlZ2luIGFuZHMgZW5kcyBub3JtYWxseS5cbiAgICogICAgICAgICAgICAgLSBDb250ZW50IG1hdGNoZWQgaXMgYWRkZWQgdG8gdGhlIHBhcmVudCBtb2RlIGJ1ZmZlci5cbiAgICogICAgICAgICAgICAgLSBUaGUgcGFyc2VyIGN1cnNvciBpcyBtb3ZlZCBmb3J3YXJkIG5vcm1hbGx5LlxuICAgKlxuICAgKiBAYWJvcnQgIC0gQSBoYWNrIHBsYWNlaG9sZGVyIHVudGlsIHdlIGhhdmUgaWdub3JlLiAgQWJvcnRzIHRoZSBtb2RlIChhcyBpZiBpdFxuICAgKiAgICAgICAgICAgbmV2ZXIgbWF0Y2hlZCkgYnV0IERPRVMgTk9UIGNvbnRpbnVlIHRvIG1hdGNoIHN1YnNlcXVlbnQgYGNvbnRhaW5zYFxuICAgKiAgICAgICAgICAgbW9kZXMuICBBYm9ydCBpcyBiYWQvc3Vib3B0aW1hbCBiZWNhdXNlIGl0IGNhbiByZXN1bHQgaW4gbW9kZXNcbiAgICogICAgICAgICAgIGZhcnRoZXIgZG93biBub3QgZ2V0dGluZyBhcHBsaWVkIGJlY2F1c2UgYW4gZWFybGllciBydWxlIGVhdHMgdGhlXG4gICAqICAgICAgICAgICBjb250ZW50IGJ1dCB0aGVuIGFib3J0cy5cbiAgICpcbiAgICogICAgICAgICAgICAgLSBUaGUgbW9kZSBkb2VzIG5vdCBiZWdpbi5cbiAgICogICAgICAgICAgICAgLSBDb250ZW50IG1hdGNoZWQgYnkgYGJlZ2luYCBpcyBhZGRlZCB0byB0aGUgbW9kZSBidWZmZXIuXG4gICAqICAgICAgICAgICAgIC0gVGhlIHBhcnNlciBjdXJzb3IgaXMgbW92ZWQgZm9yd2FyZCBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQGlnbm9yZSAtIElnbm9yZXMgdGhlIG1vZGUgKGFzIGlmIGl0IG5ldmVyIG1hdGNoZWQpIGFuZCBjb250aW51ZXMgdG8gbWF0Y2ggYW55XG4gICAqICAgICAgICAgICBzdWJzZXF1ZW50IGBjb250YWluc2AgbW9kZXMuICBJZ25vcmUgaXNuJ3QgdGVjaG5pY2FsbHkgcG9zc2libGUgd2l0aFxuICAgKiAgICAgICAgICAgdGhlIGN1cnJlbnQgcGFyc2VyIGltcGxlbWVudGF0aW9uLlxuICAgKlxuICAgKiAgICAgICAgICAgICAtIFRoZSBtb2RlIGRvZXMgbm90IGJlZ2luLlxuICAgKiAgICAgICAgICAgICAtIENvbnRlbnQgbWF0Y2hlZCBieSBgYmVnaW5gIGlzIGlnbm9yZWQuXG4gICAqICAgICAgICAgICAgIC0gVGhlIHBhcnNlciBjdXJzb3IgaXMgbm90IG1vdmVkIGZvcndhcmQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBDb21waWxlcyBhbiBpbmRpdmlkdWFsIG1vZGVcbiAgICpcbiAgICogVGhpcyBjYW4gcmFpc2UgYW4gZXJyb3IgaWYgdGhlIG1vZGUgY29udGFpbnMgY2VydGFpbiBkZXRlY3RhYmxlIGtub3duIGxvZ2ljXG4gICAqIGlzc3Vlcy5cbiAgICogQHBhcmFtIHtNb2RlfSBtb2RlXG4gICAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlIHwgbnVsbH0gW3BhcmVudF1cbiAgICogQHJldHVybnMge0NvbXBpbGVkTW9kZSB8IG5ldmVyfVxuICAgKi9cbiAgZnVuY3Rpb24gY29tcGlsZU1vZGUobW9kZSwgcGFyZW50KSB7XG4gICAgY29uc3QgY21vZGUgPSAvKiogQHR5cGUgQ29tcGlsZWRNb2RlICovIChtb2RlKTtcbiAgICBpZiAobW9kZS5pc0NvbXBpbGVkKSByZXR1cm4gY21vZGU7XG5cbiAgICBbXG4gICAgICBzY29wZUNsYXNzTmFtZSxcbiAgICAgIC8vIGRvIHRoaXMgZWFybHkgc28gY29tcGlsZXIgZXh0ZW5zaW9ucyBnZW5lcmFsbHkgZG9uJ3QgaGF2ZSB0byB3b3JyeSBhYm91dFxuICAgICAgLy8gdGhlIGRpc3RpbmN0aW9uIGJldHdlZW4gbWF0Y2gvYmVnaW5cbiAgICAgIGNvbXBpbGVNYXRjaCxcbiAgICAgIE11bHRpQ2xhc3MsXG4gICAgICBiZWZvcmVNYXRjaEV4dFxuICAgIF0uZm9yRWFjaChleHQgPT4gZXh0KG1vZGUsIHBhcmVudCkpO1xuXG4gICAgbGFuZ3VhZ2UuY29tcGlsZXJFeHRlbnNpb25zLmZvckVhY2goZXh0ID0+IGV4dChtb2RlLCBwYXJlbnQpKTtcblxuICAgIC8vIF9fYmVmb3JlQmVnaW4gaXMgY29uc2lkZXJlZCBwcml2YXRlIEFQSSwgaW50ZXJuYWwgdXNlIG9ubHlcbiAgICBtb2RlLl9fYmVmb3JlQmVnaW4gPSBudWxsO1xuXG4gICAgW1xuICAgICAgYmVnaW5LZXl3b3JkcyxcbiAgICAgIC8vIGRvIHRoaXMgbGF0ZXIgc28gY29tcGlsZXIgZXh0ZW5zaW9ucyB0aGF0IGNvbWUgZWFybGllciBoYXZlIGFjY2VzcyB0byB0aGVcbiAgICAgIC8vIHJhdyBhcnJheSBpZiB0aGV5IHdhbnRlZCB0byBwZXJoYXBzIG1hbmlwdWxhdGUgaXQsIGV0Yy5cbiAgICAgIGNvbXBpbGVJbGxlZ2FsLFxuICAgICAgLy8gZGVmYXVsdCB0byAxIHJlbGV2YW5jZSBpZiBub3Qgc3BlY2lmaWVkXG4gICAgICBjb21waWxlUmVsZXZhbmNlXG4gICAgXS5mb3JFYWNoKGV4dCA9PiBleHQobW9kZSwgcGFyZW50KSk7XG5cbiAgICBtb2RlLmlzQ29tcGlsZWQgPSB0cnVlO1xuXG4gICAgbGV0IGtleXdvcmRQYXR0ZXJuID0gbnVsbDtcbiAgICBpZiAodHlwZW9mIG1vZGUua2V5d29yZHMgPT09IFwib2JqZWN0XCIgJiYgbW9kZS5rZXl3b3Jkcy4kcGF0dGVybikge1xuICAgICAgLy8gd2UgbmVlZCBhIGNvcHkgYmVjYXVzZSBrZXl3b3JkcyBtaWdodCBiZSBjb21waWxlZCBtdWx0aXBsZSB0aW1lc1xuICAgICAgLy8gc28gd2UgY2FuJ3QgZ28gZGVsZXRpbmcgJHBhdHRlcm4gZnJvbSB0aGUgb3JpZ2luYWwgb24gdGhlIGZpcnN0XG4gICAgICAvLyBwYXNzXG4gICAgICBtb2RlLmtleXdvcmRzID0gT2JqZWN0LmFzc2lnbih7fSwgbW9kZS5rZXl3b3Jkcyk7XG4gICAgICBrZXl3b3JkUGF0dGVybiA9IG1vZGUua2V5d29yZHMuJHBhdHRlcm47XG4gICAgICBkZWxldGUgbW9kZS5rZXl3b3Jkcy4kcGF0dGVybjtcbiAgICB9XG4gICAga2V5d29yZFBhdHRlcm4gPSBrZXl3b3JkUGF0dGVybiB8fCAvXFx3Ky87XG5cbiAgICBpZiAobW9kZS5rZXl3b3Jkcykge1xuICAgICAgbW9kZS5rZXl3b3JkcyA9IGNvbXBpbGVLZXl3b3Jkcyhtb2RlLmtleXdvcmRzLCBsYW5ndWFnZS5jYXNlX2luc2Vuc2l0aXZlKTtcbiAgICB9XG5cbiAgICBjbW9kZS5rZXl3b3JkUGF0dGVyblJlID0gbGFuZ1JlKGtleXdvcmRQYXR0ZXJuLCB0cnVlKTtcblxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGlmICghbW9kZS5iZWdpbikgbW9kZS5iZWdpbiA9IC9cXEJ8XFxiLztcbiAgICAgIGNtb2RlLmJlZ2luUmUgPSBsYW5nUmUoY21vZGUuYmVnaW4pO1xuICAgICAgaWYgKCFtb2RlLmVuZCAmJiAhbW9kZS5lbmRzV2l0aFBhcmVudCkgbW9kZS5lbmQgPSAvXFxCfFxcYi87XG4gICAgICBpZiAobW9kZS5lbmQpIGNtb2RlLmVuZFJlID0gbGFuZ1JlKGNtb2RlLmVuZCk7XG4gICAgICBjbW9kZS50ZXJtaW5hdG9yRW5kID0gc291cmNlKGNtb2RlLmVuZCkgfHwgJyc7XG4gICAgICBpZiAobW9kZS5lbmRzV2l0aFBhcmVudCAmJiBwYXJlbnQudGVybWluYXRvckVuZCkge1xuICAgICAgICBjbW9kZS50ZXJtaW5hdG9yRW5kICs9IChtb2RlLmVuZCA/ICd8JyA6ICcnKSArIHBhcmVudC50ZXJtaW5hdG9yRW5kO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobW9kZS5pbGxlZ2FsKSBjbW9kZS5pbGxlZ2FsUmUgPSBsYW5nUmUoLyoqIEB0eXBlIHtSZWdFeHAgfCBzdHJpbmd9ICovIChtb2RlLmlsbGVnYWwpKTtcbiAgICBpZiAoIW1vZGUuY29udGFpbnMpIG1vZGUuY29udGFpbnMgPSBbXTtcblxuICAgIG1vZGUuY29udGFpbnMgPSBbXS5jb25jYXQoLi4ubW9kZS5jb250YWlucy5tYXAoZnVuY3Rpb24oYykge1xuICAgICAgcmV0dXJuIGV4cGFuZE9yQ2xvbmVNb2RlKGMgPT09ICdzZWxmJyA/IG1vZGUgOiBjKTtcbiAgICB9KSk7XG4gICAgbW9kZS5jb250YWlucy5mb3JFYWNoKGZ1bmN0aW9uKGMpIHsgY29tcGlsZU1vZGUoLyoqIEB0eXBlIE1vZGUgKi8gKGMpLCBjbW9kZSk7IH0pO1xuXG4gICAgaWYgKG1vZGUuc3RhcnRzKSB7XG4gICAgICBjb21waWxlTW9kZShtb2RlLnN0YXJ0cywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBjbW9kZS5tYXRjaGVyID0gYnVpbGRNb2RlUmVnZXgoY21vZGUpO1xuICAgIHJldHVybiBjbW9kZTtcbiAgfVxuXG4gIGlmICghbGFuZ3VhZ2UuY29tcGlsZXJFeHRlbnNpb25zKSBsYW5ndWFnZS5jb21waWxlckV4dGVuc2lvbnMgPSBbXTtcblxuICAvLyBzZWxmIGlzIG5vdCB2YWxpZCBhdCB0aGUgdG9wLWxldmVsXG4gIGlmIChsYW5ndWFnZS5jb250YWlucyAmJiBsYW5ndWFnZS5jb250YWlucy5pbmNsdWRlcygnc2VsZicpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRVJSOiBjb250YWlucyBgc2VsZmAgaXMgbm90IHN1cHBvcnRlZCBhdCB0aGUgdG9wLWxldmVsIG9mIGEgbGFuZ3VhZ2UuICBTZWUgZG9jdW1lbnRhdGlvbi5cIik7XG4gIH1cblxuICAvLyB3ZSBuZWVkIGEgbnVsbCBvYmplY3QsIHdoaWNoIGluaGVyaXQgd2lsbCBndWFyYW50ZWVcbiAgbGFuZ3VhZ2UuY2xhc3NOYW1lQWxpYXNlcyA9IGluaGVyaXQkMShsYW5ndWFnZS5jbGFzc05hbWVBbGlhc2VzIHx8IHt9KTtcblxuICByZXR1cm4gY29tcGlsZU1vZGUoLyoqIEB0eXBlIE1vZGUgKi8gKGxhbmd1YWdlKSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBhIG1vZGUgaGFzIGEgZGVwZW5kZW5jeSBvbiBpdCdzIHBhcmVudCBvciBub3RcbiAqXG4gKiBJZiBhIG1vZGUgZG9lcyBoYXZlIGEgcGFyZW50IGRlcGVuZGVuY3kgdGhlbiBvZnRlbiB3ZSBuZWVkIHRvIGNsb25lIGl0IGlmXG4gKiBpdCdzIHVzZWQgaW4gbXVsdGlwbGUgcGxhY2VzIHNvIHRoYXQgZWFjaCBjb3B5IHBvaW50cyB0byB0aGUgY29ycmVjdCBwYXJlbnQsXG4gKiB3aGVyZS1hcyBtb2RlcyB3aXRob3V0IGEgcGFyZW50IGNhbiBvZnRlbiBzYWZlbHkgYmUgcmUtdXNlZCBhdCB0aGUgYm90dG9tIG9mXG4gKiBhIG1vZGUgY2hhaW4uXG4gKlxuICogQHBhcmFtIHtNb2RlIHwgbnVsbH0gbW9kZVxuICogQHJldHVybnMge2Jvb2xlYW59IC0gaXMgdGhlcmUgYSBkZXBlbmRlbmN5IG9uIHRoZSBwYXJlbnQ/XG4gKiAqL1xuZnVuY3Rpb24gZGVwZW5kZW5jeU9uUGFyZW50KG1vZGUpIHtcbiAgaWYgKCFtb2RlKSByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIG1vZGUuZW5kc1dpdGhQYXJlbnQgfHwgZGVwZW5kZW5jeU9uUGFyZW50KG1vZGUuc3RhcnRzKTtcbn1cblxuLyoqXG4gKiBFeHBhbmRzIGEgbW9kZSBvciBjbG9uZXMgaXQgaWYgbmVjZXNzYXJ5XG4gKlxuICogVGhpcyBpcyBuZWNlc3NhcnkgZm9yIG1vZGVzIHdpdGggcGFyZW50YWwgZGVwZW5kZW5jZWlzIChzZWUgbm90ZXMgb25cbiAqIGBkZXBlbmRlbmN5T25QYXJlbnRgKSBhbmQgZm9yIG5vZGVzIHRoYXQgaGF2ZSBgdmFyaWFudHNgIC0gd2hpY2ggbXVzdCB0aGVuIGJlXG4gKiBleHBsb2RlZCBpbnRvIHRoZWlyIG93biBpbmRpdmlkdWFsIG1vZGVzIGF0IGNvbXBpbGUgdGltZS5cbiAqXG4gKiBAcGFyYW0ge01vZGV9IG1vZGVcbiAqIEByZXR1cm5zIHtNb2RlIHwgTW9kZVtdfVxuICogKi9cbmZ1bmN0aW9uIGV4cGFuZE9yQ2xvbmVNb2RlKG1vZGUpIHtcbiAgaWYgKG1vZGUudmFyaWFudHMgJiYgIW1vZGUuY2FjaGVkVmFyaWFudHMpIHtcbiAgICBtb2RlLmNhY2hlZFZhcmlhbnRzID0gbW9kZS52YXJpYW50cy5tYXAoZnVuY3Rpb24odmFyaWFudCkge1xuICAgICAgcmV0dXJuIGluaGVyaXQkMShtb2RlLCB7IHZhcmlhbnRzOiBudWxsIH0sIHZhcmlhbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gRVhQQU5EXG4gIC8vIGlmIHdlIGhhdmUgdmFyaWFudHMgdGhlbiBlc3NlbnRpYWxseSBcInJlcGxhY2VcIiB0aGUgbW9kZSB3aXRoIHRoZSB2YXJpYW50c1xuICAvLyB0aGlzIGhhcHBlbnMgaW4gY29tcGlsZU1vZGUsIHdoZXJlIHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGZyb21cbiAgaWYgKG1vZGUuY2FjaGVkVmFyaWFudHMpIHtcbiAgICByZXR1cm4gbW9kZS5jYWNoZWRWYXJpYW50cztcbiAgfVxuXG4gIC8vIENMT05FXG4gIC8vIGlmIHdlIGhhdmUgZGVwZW5kZW5jaWVzIG9uIHBhcmVudHMgdGhlbiB3ZSBuZWVkIGEgdW5pcXVlXG4gIC8vIGluc3RhbmNlIG9mIG91cnNlbHZlcywgc28gd2UgY2FuIGJlIHJldXNlZCB3aXRoIG1hbnlcbiAgLy8gZGlmZmVyZW50IHBhcmVudHMgd2l0aG91dCBpc3N1ZVxuICBpZiAoZGVwZW5kZW5jeU9uUGFyZW50KG1vZGUpKSB7XG4gICAgcmV0dXJuIGluaGVyaXQkMShtb2RlLCB7IHN0YXJ0czogbW9kZS5zdGFydHMgPyBpbmhlcml0JDEobW9kZS5zdGFydHMpIDogbnVsbCB9KTtcbiAgfVxuXG4gIGlmIChPYmplY3QuaXNGcm96ZW4obW9kZSkpIHtcbiAgICByZXR1cm4gaW5oZXJpdCQxKG1vZGUpO1xuICB9XG5cbiAgLy8gbm8gc3BlY2lhbCBkZXBlbmRlbmN5IGlzc3VlcywganVzdCByZXR1cm4gb3Vyc2VsdmVzXG4gIHJldHVybiBtb2RlO1xufVxuXG52YXIgdmVyc2lvbiA9IFwiMTEuOS4wXCI7XG5cbmNsYXNzIEhUTUxJbmplY3Rpb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IocmVhc29uLCBodG1sKSB7XG4gICAgc3VwZXIocmVhc29uKTtcbiAgICB0aGlzLm5hbWUgPSBcIkhUTUxJbmplY3Rpb25FcnJvclwiO1xuICAgIHRoaXMuaHRtbCA9IGh0bWw7XG4gIH1cbn1cblxuLypcblN5bnRheCBoaWdobGlnaHRpbmcgd2l0aCBsYW5ndWFnZSBhdXRvZGV0ZWN0aW9uLlxuaHR0cHM6Ly9oaWdobGlnaHRqcy5vcmcvXG4qL1xuXG5cblxuLyoqXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Nb2RlfSBNb2RlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Db21waWxlZE1vZGV9IENvbXBpbGVkTW9kZVxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuQ29tcGlsZWRTY29wZX0gQ29tcGlsZWRTY29wZVxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuTGFuZ3VhZ2V9IExhbmd1YWdlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5ITEpTQXBpfSBITEpTQXBpXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5ITEpTUGx1Z2lufSBITEpTUGx1Z2luXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5QbHVnaW5FdmVudH0gUGx1Z2luRXZlbnRcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkhMSlNPcHRpb25zfSBITEpTT3B0aW9uc1xuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuTGFuZ3VhZ2VGbn0gTGFuZ3VhZ2VGblxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuSGlnaGxpZ2h0ZWRIVE1MRWxlbWVudH0gSGlnaGxpZ2h0ZWRIVE1MRWxlbWVudFxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuQmVmb3JlSGlnaGxpZ2h0Q29udGV4dH0gQmVmb3JlSGlnaGxpZ2h0Q29udGV4dFxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzL3ByaXZhdGUnKS5NYXRjaFR5cGV9IE1hdGNoVHlwZVxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzL3ByaXZhdGUnKS5LZXl3b3JkRGF0YX0gS2V5d29yZERhdGFcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcy9wcml2YXRlJykuRW5oYW5jZWRNYXRjaH0gRW5oYW5jZWRNYXRjaFxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzL3ByaXZhdGUnKS5Bbm5vdGF0ZWRFcnJvcn0gQW5ub3RhdGVkRXJyb3JcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkF1dG9IaWdobGlnaHRSZXN1bHR9IEF1dG9IaWdobGlnaHRSZXN1bHRcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkhpZ2hsaWdodE9wdGlvbnN9IEhpZ2hsaWdodE9wdGlvbnNcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkhpZ2hsaWdodFJlc3VsdH0gSGlnaGxpZ2h0UmVzdWx0XG4qL1xuXG5cbmNvbnN0IGVzY2FwZSA9IGVzY2FwZUhUTUw7XG5jb25zdCBpbmhlcml0ID0gaW5oZXJpdCQxO1xuY29uc3QgTk9fTUFUQ0ggPSBTeW1ib2woXCJub21hdGNoXCIpO1xuY29uc3QgTUFYX0tFWVdPUkRfSElUUyA9IDc7XG5cbi8qKlxuICogQHBhcmFtIHthbnl9IGhsanMgLSBvYmplY3QgdGhhdCBpcyBleHRlbmRlZCAobGVnYWN5KVxuICogQHJldHVybnMge0hMSlNBcGl9XG4gKi9cbmNvbnN0IEhMSlMgPSBmdW5jdGlvbihobGpzKSB7XG4gIC8vIEdsb2JhbCBpbnRlcm5hbCB2YXJpYWJsZXMgdXNlZCB3aXRoaW4gdGhlIGhpZ2hsaWdodC5qcyBsaWJyYXJ5LlxuICAvKiogQHR5cGUge1JlY29yZDxzdHJpbmcsIExhbmd1YWdlPn0gKi9cbiAgY29uc3QgbGFuZ3VhZ2VzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgLyoqIEB0eXBlIHtSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fSAqL1xuICBjb25zdCBhbGlhc2VzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgLyoqIEB0eXBlIHtITEpTUGx1Z2luW119ICovXG4gIGNvbnN0IHBsdWdpbnMgPSBbXTtcblxuICAvLyBzYWZlL3Byb2R1Y3Rpb24gbW9kZSAtIHN3YWxsb3dzIG1vcmUgZXJyb3JzLCB0cmllcyB0byBrZWVwIHJ1bm5pbmdcbiAgLy8gZXZlbiBpZiBhIHNpbmdsZSBzeW50YXggb3IgcGFyc2UgaGl0cyBhIGZhdGFsIGVycm9yXG4gIGxldCBTQUZFX01PREUgPSB0cnVlO1xuICBjb25zdCBMQU5HVUFHRV9OT1RfRk9VTkQgPSBcIkNvdWxkIG5vdCBmaW5kIHRoZSBsYW5ndWFnZSAne30nLCBkaWQgeW91IGZvcmdldCB0byBsb2FkL2luY2x1ZGUgYSBsYW5ndWFnZSBtb2R1bGU/XCI7XG4gIC8qKiBAdHlwZSB7TGFuZ3VhZ2V9ICovXG4gIGNvbnN0IFBMQUlOVEVYVF9MQU5HVUFHRSA9IHsgZGlzYWJsZUF1dG9kZXRlY3Q6IHRydWUsIG5hbWU6ICdQbGFpbiB0ZXh0JywgY29udGFpbnM6IFtdIH07XG5cbiAgLy8gR2xvYmFsIG9wdGlvbnMgdXNlZCB3aGVuIHdpdGhpbiBleHRlcm5hbCBBUElzLiBUaGlzIGlzIG1vZGlmaWVkIHdoZW5cbiAgLy8gY2FsbGluZyB0aGUgYGhsanMuY29uZmlndXJlYCBmdW5jdGlvbi5cbiAgLyoqIEB0eXBlIEhMSlNPcHRpb25zICovXG4gIGxldCBvcHRpb25zID0ge1xuICAgIGlnbm9yZVVuZXNjYXBlZEhUTUw6IGZhbHNlLFxuICAgIHRocm93VW5lc2NhcGVkSFRNTDogZmFsc2UsXG4gICAgbm9IaWdobGlnaHRSZTogL14obm8tP2hpZ2hsaWdodCkkL2ksXG4gICAgbGFuZ3VhZ2VEZXRlY3RSZTogL1xcYmxhbmcoPzp1YWdlKT8tKFtcXHctXSspXFxiL2ksXG4gICAgY2xhc3NQcmVmaXg6ICdobGpzLScsXG4gICAgY3NzU2VsZWN0b3I6ICdwcmUgY29kZScsXG4gICAgbGFuZ3VhZ2VzOiBudWxsLFxuICAgIC8vIGJldGEgY29uZmlndXJhdGlvbiBvcHRpb25zLCBzdWJqZWN0IHRvIGNoYW5nZSwgd2VsY29tZSB0byBkaXNjdXNzXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy9pc3N1ZXMvMTA4NlxuICAgIF9fZW1pdHRlcjogVG9rZW5UcmVlRW1pdHRlclxuICB9O1xuXG4gIC8qIFV0aWxpdHkgZnVuY3Rpb25zICovXG5cbiAgLyoqXG4gICAqIFRlc3RzIGEgbGFuZ3VhZ2UgbmFtZSB0byBzZWUgaWYgaGlnaGxpZ2h0aW5nIHNob3VsZCBiZSBza2lwcGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZU5hbWVcbiAgICovXG4gIGZ1bmN0aW9uIHNob3VsZE5vdEhpZ2hsaWdodChsYW5ndWFnZU5hbWUpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5ub0hpZ2hsaWdodFJlLnRlc3QobGFuZ3VhZ2VOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hpZ2hsaWdodGVkSFRNTEVsZW1lbnR9IGJsb2NrIC0gdGhlIEhUTUwgZWxlbWVudCB0byBkZXRlcm1pbmUgbGFuZ3VhZ2UgZm9yXG4gICAqL1xuICBmdW5jdGlvbiBibG9ja0xhbmd1YWdlKGJsb2NrKSB7XG4gICAgbGV0IGNsYXNzZXMgPSBibG9jay5jbGFzc05hbWUgKyAnICc7XG5cbiAgICBjbGFzc2VzICs9IGJsb2NrLnBhcmVudE5vZGUgPyBibG9jay5wYXJlbnROb2RlLmNsYXNzTmFtZSA6ICcnO1xuXG4gICAgLy8gbGFuZ3VhZ2UtKiB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgbm9uLXByZWZpeGVkIGNsYXNzIG5hbWVzLlxuICAgIGNvbnN0IG1hdGNoID0gb3B0aW9ucy5sYW5ndWFnZURldGVjdFJlLmV4ZWMoY2xhc3Nlcyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCBsYW5ndWFnZSA9IGdldExhbmd1YWdlKG1hdGNoWzFdKTtcbiAgICAgIGlmICghbGFuZ3VhZ2UpIHtcbiAgICAgICAgd2FybihMQU5HVUFHRV9OT1RfRk9VTkQucmVwbGFjZShcInt9XCIsIG1hdGNoWzFdKSk7XG4gICAgICAgIHdhcm4oXCJGYWxsaW5nIGJhY2sgdG8gbm8taGlnaGxpZ2h0IG1vZGUgZm9yIHRoaXMgYmxvY2suXCIsIGJsb2NrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsYW5ndWFnZSA/IG1hdGNoWzFdIDogJ25vLWhpZ2hsaWdodCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYXNzZXNcbiAgICAgIC5zcGxpdCgvXFxzKy8pXG4gICAgICAuZmluZCgoX2NsYXNzKSA9PiBzaG91bGROb3RIaWdobGlnaHQoX2NsYXNzKSB8fCBnZXRMYW5ndWFnZShfY2xhc3MpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3JlIGhpZ2hsaWdodGluZyBmdW5jdGlvbi5cbiAgICpcbiAgICogT0xEIEFQSVxuICAgKiBoaWdobGlnaHQobGFuZywgY29kZSwgaWdub3JlSWxsZWdhbHMsIGNvbnRpbnVhdGlvbilcbiAgICpcbiAgICogTkVXIEFQSVxuICAgKiBoaWdobGlnaHQoY29kZSwge2xhbmcsIGlnbm9yZUlsbGVnYWxzfSlcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvZGVPckxhbmd1YWdlTmFtZSAtIHRoZSBsYW5ndWFnZSB0byB1c2UgZm9yIGhpZ2hsaWdodGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZyB8IEhpZ2hsaWdodE9wdGlvbnN9IG9wdGlvbnNPckNvZGUgLSB0aGUgY29kZSB0byBoaWdobGlnaHRcbiAgICogQHBhcmFtIHtib29sZWFufSBbaWdub3JlSWxsZWdhbHNdIC0gd2hldGhlciB0byBpZ25vcmUgaWxsZWdhbCBtYXRjaGVzLCBkZWZhdWx0IGlzIHRvIGJhaWxcbiAgICpcbiAgICogQHJldHVybnMge0hpZ2hsaWdodFJlc3VsdH0gUmVzdWx0IC0gYW4gb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgcmVzdWx0XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBsYW5ndWFnZSAtIHRoZSBsYW5ndWFnZSBuYW1lXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByZWxldmFuY2UgLSB0aGUgcmVsZXZhbmNlIHNjb3JlXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2YWx1ZSAtIHRoZSBoaWdobGlnaHRlZCBIVE1MIGNvZGVcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGNvZGUgLSB0aGUgb3JpZ2luYWwgcmF3IGNvZGVcbiAgICogQHByb3BlcnR5IHtDb21waWxlZE1vZGV9IHRvcCAtIHRvcCBvZiB0aGUgY3VycmVudCBtb2RlIHN0YWNrXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaWxsZWdhbCAtIGluZGljYXRlcyB3aGV0aGVyIGFueSBpbGxlZ2FsIG1hdGNoZXMgd2VyZSBmb3VuZFxuICAqL1xuICBmdW5jdGlvbiBoaWdobGlnaHQoY29kZU9yTGFuZ3VhZ2VOYW1lLCBvcHRpb25zT3JDb2RlLCBpZ25vcmVJbGxlZ2Fscykge1xuICAgIGxldCBjb2RlID0gXCJcIjtcbiAgICBsZXQgbGFuZ3VhZ2VOYW1lID0gXCJcIjtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnNPckNvZGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGNvZGUgPSBjb2RlT3JMYW5ndWFnZU5hbWU7XG4gICAgICBpZ25vcmVJbGxlZ2FscyA9IG9wdGlvbnNPckNvZGUuaWdub3JlSWxsZWdhbHM7XG4gICAgICBsYW5ndWFnZU5hbWUgPSBvcHRpb25zT3JDb2RlLmxhbmd1YWdlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvbGQgQVBJXG4gICAgICBkZXByZWNhdGVkKFwiMTAuNy4wXCIsIFwiaGlnaGxpZ2h0KGxhbmcsIGNvZGUsIC4uLmFyZ3MpIGhhcyBiZWVuIGRlcHJlY2F0ZWQuXCIpO1xuICAgICAgZGVwcmVjYXRlZChcIjEwLjcuMFwiLCBcIlBsZWFzZSB1c2UgaGlnaGxpZ2h0KGNvZGUsIG9wdGlvbnMpIGluc3RlYWQuXFxuaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy9pc3N1ZXMvMjI3N1wiKTtcbiAgICAgIGxhbmd1YWdlTmFtZSA9IGNvZGVPckxhbmd1YWdlTmFtZTtcbiAgICAgIGNvZGUgPSBvcHRpb25zT3JDb2RlO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9oaWdobGlnaHRqcy9oaWdobGlnaHQuanMvaXNzdWVzLzMxNDlcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gICAgaWYgKGlnbm9yZUlsbGVnYWxzID09PSB1bmRlZmluZWQpIHsgaWdub3JlSWxsZWdhbHMgPSB0cnVlOyB9XG5cbiAgICAvKiogQHR5cGUge0JlZm9yZUhpZ2hsaWdodENvbnRleHR9ICovXG4gICAgY29uc3QgY29udGV4dCA9IHtcbiAgICAgIGNvZGUsXG4gICAgICBsYW5ndWFnZTogbGFuZ3VhZ2VOYW1lXG4gICAgfTtcbiAgICAvLyB0aGUgcGx1Z2luIGNhbiBjaGFuZ2UgdGhlIGRlc2lyZWQgbGFuZ3VhZ2Ugb3IgdGhlIGNvZGUgdG8gYmUgaGlnaGxpZ2h0ZWRcbiAgICAvLyBqdXN0IGJlIGNoYW5naW5nIHRoZSBvYmplY3QgaXQgd2FzIHBhc3NlZFxuICAgIGZpcmUoXCJiZWZvcmU6aGlnaGxpZ2h0XCIsIGNvbnRleHQpO1xuXG4gICAgLy8gYSBiZWZvcmUgcGx1Z2luIGNhbiB1c3VycCB0aGUgcmVzdWx0IGNvbXBsZXRlbHkgYnkgcHJvdmlkaW5nIGl0J3Mgb3duXG4gICAgLy8gaW4gd2hpY2ggY2FzZSB3ZSBkb24ndCBldmVuIG5lZWQgdG8gY2FsbCBoaWdobGlnaHRcbiAgICBjb25zdCByZXN1bHQgPSBjb250ZXh0LnJlc3VsdFxuICAgICAgPyBjb250ZXh0LnJlc3VsdFxuICAgICAgOiBfaGlnaGxpZ2h0KGNvbnRleHQubGFuZ3VhZ2UsIGNvbnRleHQuY29kZSwgaWdub3JlSWxsZWdhbHMpO1xuXG4gICAgcmVzdWx0LmNvZGUgPSBjb250ZXh0LmNvZGU7XG4gICAgLy8gdGhlIHBsdWdpbiBjYW4gY2hhbmdlIGFueXRoaW5nIGluIHJlc3VsdCB0byBzdWl0ZSBpdFxuICAgIGZpcmUoXCJhZnRlcjpoaWdobGlnaHRcIiwgcmVzdWx0KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogcHJpdmF0ZSBoaWdobGlnaHQgdGhhdCdzIHVzZWQgaW50ZXJuYWxseSBhbmQgZG9lcyBub3QgZmlyZSBjYWxsYmFja3NcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlTmFtZSAtIHRoZSBsYW5ndWFnZSB0byB1c2UgZm9yIGhpZ2hsaWdodGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZVRvSGlnaGxpZ2h0IC0gdGhlIGNvZGUgdG8gaGlnaGxpZ2h0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbj99IFtpZ25vcmVJbGxlZ2Fsc10gLSB3aGV0aGVyIHRvIGlnbm9yZSBpbGxlZ2FsIG1hdGNoZXMsIGRlZmF1bHQgaXMgdG8gYmFpbFxuICAgKiBAcGFyYW0ge0NvbXBpbGVkTW9kZT99IFtjb250aW51YXRpb25dIC0gY3VycmVudCBjb250aW51YXRpb24gbW9kZSwgaWYgYW55XG4gICAqIEByZXR1cm5zIHtIaWdobGlnaHRSZXN1bHR9IC0gcmVzdWx0IG9mIHRoZSBoaWdobGlnaHQgb3BlcmF0aW9uXG4gICovXG4gIGZ1bmN0aW9uIF9oaWdobGlnaHQobGFuZ3VhZ2VOYW1lLCBjb2RlVG9IaWdobGlnaHQsIGlnbm9yZUlsbGVnYWxzLCBjb250aW51YXRpb24pIHtcbiAgICBjb25zdCBrZXl3b3JkSGl0cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4ga2V5d29yZCBkYXRhIGlmIGEgbWF0Y2ggaXMgYSBrZXl3b3JkXG4gICAgICogQHBhcmFtIHtDb21waWxlZE1vZGV9IG1vZGUgLSBjdXJyZW50IG1vZGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWF0Y2hUZXh0IC0gdGhlIHRleHR1YWwgbWF0Y2hcbiAgICAgKiBAcmV0dXJucyB7S2V5d29yZERhdGEgfCBmYWxzZX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBrZXl3b3JkRGF0YShtb2RlLCBtYXRjaFRleHQpIHtcbiAgICAgIHJldHVybiBtb2RlLmtleXdvcmRzW21hdGNoVGV4dF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0tleXdvcmRzKCkge1xuICAgICAgaWYgKCF0b3Aua2V5d29yZHMpIHtcbiAgICAgICAgZW1pdHRlci5hZGRUZXh0KG1vZGVCdWZmZXIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBsYXN0SW5kZXggPSAwO1xuICAgICAgdG9wLmtleXdvcmRQYXR0ZXJuUmUubGFzdEluZGV4ID0gMDtcbiAgICAgIGxldCBtYXRjaCA9IHRvcC5rZXl3b3JkUGF0dGVyblJlLmV4ZWMobW9kZUJ1ZmZlcik7XG4gICAgICBsZXQgYnVmID0gXCJcIjtcblxuICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgIGJ1ZiArPSBtb2RlQnVmZmVyLnN1YnN0cmluZyhsYXN0SW5kZXgsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgY29uc3Qgd29yZCA9IGxhbmd1YWdlLmNhc2VfaW5zZW5zaXRpdmUgPyBtYXRjaFswXS50b0xvd2VyQ2FzZSgpIDogbWF0Y2hbMF07XG4gICAgICAgIGNvbnN0IGRhdGEgPSBrZXl3b3JkRGF0YSh0b3AsIHdvcmQpO1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgIGNvbnN0IFtraW5kLCBrZXl3b3JkUmVsZXZhbmNlXSA9IGRhdGE7XG4gICAgICAgICAgZW1pdHRlci5hZGRUZXh0KGJ1Zik7XG4gICAgICAgICAgYnVmID0gXCJcIjtcblxuICAgICAgICAgIGtleXdvcmRIaXRzW3dvcmRdID0gKGtleXdvcmRIaXRzW3dvcmRdIHx8IDApICsgMTtcbiAgICAgICAgICBpZiAoa2V5d29yZEhpdHNbd29yZF0gPD0gTUFYX0tFWVdPUkRfSElUUykgcmVsZXZhbmNlICs9IGtleXdvcmRSZWxldmFuY2U7XG4gICAgICAgICAgaWYgKGtpbmQuc3RhcnRzV2l0aChcIl9cIikpIHtcbiAgICAgICAgICAgIC8vIF8gaW1wbGllZCBmb3IgcmVsZXZhbmNlIG9ubHksIGRvIG5vdCBoaWdobGlnaHRcbiAgICAgICAgICAgIC8vIGJ5IGFwcGx5aW5nIGEgY2xhc3MgbmFtZVxuICAgICAgICAgICAgYnVmICs9IG1hdGNoWzBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjc3NDbGFzcyA9IGxhbmd1YWdlLmNsYXNzTmFtZUFsaWFzZXNba2luZF0gfHwga2luZDtcbiAgICAgICAgICAgIGVtaXRLZXl3b3JkKG1hdGNoWzBdLCBjc3NDbGFzcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1ZiArPSBtYXRjaFswXTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0SW5kZXggPSB0b3Aua2V5d29yZFBhdHRlcm5SZS5sYXN0SW5kZXg7XG4gICAgICAgIG1hdGNoID0gdG9wLmtleXdvcmRQYXR0ZXJuUmUuZXhlYyhtb2RlQnVmZmVyKTtcbiAgICAgIH1cbiAgICAgIGJ1ZiArPSBtb2RlQnVmZmVyLnN1YnN0cmluZyhsYXN0SW5kZXgpO1xuICAgICAgZW1pdHRlci5hZGRUZXh0KGJ1Zik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc1N1Ykxhbmd1YWdlKCkge1xuICAgICAgaWYgKG1vZGVCdWZmZXIgPT09IFwiXCIpIHJldHVybjtcbiAgICAgIC8qKiBAdHlwZSBIaWdobGlnaHRSZXN1bHQgKi9cbiAgICAgIGxldCByZXN1bHQgPSBudWxsO1xuXG4gICAgICBpZiAodHlwZW9mIHRvcC5zdWJMYW5ndWFnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKCFsYW5ndWFnZXNbdG9wLnN1Ykxhbmd1YWdlXSkge1xuICAgICAgICAgIGVtaXR0ZXIuYWRkVGV4dChtb2RlQnVmZmVyKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gX2hpZ2hsaWdodCh0b3Auc3ViTGFuZ3VhZ2UsIG1vZGVCdWZmZXIsIHRydWUsIGNvbnRpbnVhdGlvbnNbdG9wLnN1Ykxhbmd1YWdlXSk7XG4gICAgICAgIGNvbnRpbnVhdGlvbnNbdG9wLnN1Ykxhbmd1YWdlXSA9IC8qKiBAdHlwZSB7Q29tcGlsZWRNb2RlfSAqLyAocmVzdWx0Ll90b3ApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gaGlnaGxpZ2h0QXV0byhtb2RlQnVmZmVyLCB0b3Auc3ViTGFuZ3VhZ2UubGVuZ3RoID8gdG9wLnN1Ykxhbmd1YWdlIDogbnVsbCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENvdW50aW5nIGVtYmVkZGVkIGxhbmd1YWdlIHNjb3JlIHRvd2FyZHMgdGhlIGhvc3QgbGFuZ3VhZ2UgbWF5IGJlIGRpc2FibGVkXG4gICAgICAvLyB3aXRoIHplcm9pbmcgdGhlIGNvbnRhaW5pbmcgbW9kZSByZWxldmFuY2UuIFVzZSBjYXNlIGluIHBvaW50IGlzIE1hcmtkb3duIHRoYXRcbiAgICAgIC8vIGFsbG93cyBYTUwgZXZlcnl3aGVyZSBhbmQgbWFrZXMgZXZlcnkgWE1MIHNuaXBwZXQgdG8gaGF2ZSBhIG11Y2ggbGFyZ2VyIE1hcmtkb3duXG4gICAgICAvLyBzY29yZS5cbiAgICAgIGlmICh0b3AucmVsZXZhbmNlID4gMCkge1xuICAgICAgICByZWxldmFuY2UgKz0gcmVzdWx0LnJlbGV2YW5jZTtcbiAgICAgIH1cbiAgICAgIGVtaXR0ZXIuX19hZGRTdWJsYW5ndWFnZShyZXN1bHQuX2VtaXR0ZXIsIHJlc3VsdC5sYW5ndWFnZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0J1ZmZlcigpIHtcbiAgICAgIGlmICh0b3Auc3ViTGFuZ3VhZ2UgIT0gbnVsbCkge1xuICAgICAgICBwcm9jZXNzU3ViTGFuZ3VhZ2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2Nlc3NLZXl3b3JkcygpO1xuICAgICAgfVxuICAgICAgbW9kZUJ1ZmZlciA9ICcnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNjb3BlXG4gICAgICovXG4gICAgZnVuY3Rpb24gZW1pdEtleXdvcmQoa2V5d29yZCwgc2NvcGUpIHtcbiAgICAgIGlmIChrZXl3b3JkID09PSBcIlwiKSByZXR1cm47XG5cbiAgICAgIGVtaXR0ZXIuc3RhcnRTY29wZShzY29wZSk7XG4gICAgICBlbWl0dGVyLmFkZFRleHQoa2V5d29yZCk7XG4gICAgICBlbWl0dGVyLmVuZFNjb3BlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtDb21waWxlZFNjb3BlfSBzY29wZVxuICAgICAqIEBwYXJhbSB7UmVnRXhwTWF0Y2hBcnJheX0gbWF0Y2hcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlbWl0TXVsdGlDbGFzcyhzY29wZSwgbWF0Y2gpIHtcbiAgICAgIGxldCBpID0gMTtcbiAgICAgIGNvbnN0IG1heCA9IG1hdGNoLmxlbmd0aCAtIDE7XG4gICAgICB3aGlsZSAoaSA8PSBtYXgpIHtcbiAgICAgICAgaWYgKCFzY29wZS5fZW1pdFtpXSkgeyBpKys7IGNvbnRpbnVlOyB9XG4gICAgICAgIGNvbnN0IGtsYXNzID0gbGFuZ3VhZ2UuY2xhc3NOYW1lQWxpYXNlc1tzY29wZVtpXV0gfHwgc2NvcGVbaV07XG4gICAgICAgIGNvbnN0IHRleHQgPSBtYXRjaFtpXTtcbiAgICAgICAgaWYgKGtsYXNzKSB7XG4gICAgICAgICAgZW1pdEtleXdvcmQodGV4dCwga2xhc3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1vZGVCdWZmZXIgPSB0ZXh0O1xuICAgICAgICAgIHByb2Nlc3NLZXl3b3JkcygpO1xuICAgICAgICAgIG1vZGVCdWZmZXIgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0NvbXBpbGVkTW9kZX0gbW9kZSAtIG5ldyBtb2RlIHRvIHN0YXJ0XG4gICAgICogQHBhcmFtIHtSZWdFeHBNYXRjaEFycmF5fSBtYXRjaFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN0YXJ0TmV3TW9kZShtb2RlLCBtYXRjaCkge1xuICAgICAgaWYgKG1vZGUuc2NvcGUgJiYgdHlwZW9mIG1vZGUuc2NvcGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgZW1pdHRlci5vcGVuTm9kZShsYW5ndWFnZS5jbGFzc05hbWVBbGlhc2VzW21vZGUuc2NvcGVdIHx8IG1vZGUuc2NvcGUpO1xuICAgICAgfVxuICAgICAgaWYgKG1vZGUuYmVnaW5TY29wZSkge1xuICAgICAgICAvLyBiZWdpblNjb3BlIGp1c3Qgd3JhcHMgdGhlIGJlZ2luIG1hdGNoIGl0c2VsZiBpbiBhIHNjb3BlXG4gICAgICAgIGlmIChtb2RlLmJlZ2luU2NvcGUuX3dyYXApIHtcbiAgICAgICAgICBlbWl0S2V5d29yZChtb2RlQnVmZmVyLCBsYW5ndWFnZS5jbGFzc05hbWVBbGlhc2VzW21vZGUuYmVnaW5TY29wZS5fd3JhcF0gfHwgbW9kZS5iZWdpblNjb3BlLl93cmFwKTtcbiAgICAgICAgICBtb2RlQnVmZmVyID0gXCJcIjtcbiAgICAgICAgfSBlbHNlIGlmIChtb2RlLmJlZ2luU2NvcGUuX211bHRpKSB7XG4gICAgICAgICAgLy8gYXQgdGhpcyBwb2ludCBtb2RlQnVmZmVyIHNob3VsZCBqdXN0IGJlIHRoZSBtYXRjaFxuICAgICAgICAgIGVtaXRNdWx0aUNsYXNzKG1vZGUuYmVnaW5TY29wZSwgbWF0Y2gpO1xuICAgICAgICAgIG1vZGVCdWZmZXIgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRvcCA9IE9iamVjdC5jcmVhdGUobW9kZSwgeyBwYXJlbnQ6IHsgdmFsdWU6IHRvcCB9IH0pO1xuICAgICAgcmV0dXJuIHRvcDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0NvbXBpbGVkTW9kZSB9IG1vZGUgLSB0aGUgbW9kZSB0byBwb3RlbnRpYWxseSBlbmRcbiAgICAgKiBAcGFyYW0ge1JlZ0V4cE1hdGNoQXJyYXl9IG1hdGNoIC0gdGhlIGxhdGVzdCBtYXRjaFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtYXRjaFBsdXNSZW1haW5kZXIgLSBtYXRjaCBwbHVzIHJlbWFpbmRlciBvZiBjb250ZW50XG4gICAgICogQHJldHVybnMge0NvbXBpbGVkTW9kZSB8IHZvaWR9IC0gdGhlIG5leHQgbW9kZSwgb3IgaWYgdm9pZCBjb250aW51ZSBvbiBpbiBjdXJyZW50IG1vZGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlbmRPZk1vZGUobW9kZSwgbWF0Y2gsIG1hdGNoUGx1c1JlbWFpbmRlcikge1xuICAgICAgbGV0IG1hdGNoZWQgPSBzdGFydHNXaXRoKG1vZGUuZW5kUmUsIG1hdGNoUGx1c1JlbWFpbmRlcik7XG5cbiAgICAgIGlmIChtYXRjaGVkKSB7XG4gICAgICAgIGlmIChtb2RlW1wib246ZW5kXCJdKSB7XG4gICAgICAgICAgY29uc3QgcmVzcCA9IG5ldyBSZXNwb25zZShtb2RlKTtcbiAgICAgICAgICBtb2RlW1wib246ZW5kXCJdKG1hdGNoLCByZXNwKTtcbiAgICAgICAgICBpZiAocmVzcC5pc01hdGNoSWdub3JlZCkgbWF0Y2hlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgICAgICB3aGlsZSAobW9kZS5lbmRzUGFyZW50ICYmIG1vZGUucGFyZW50KSB7XG4gICAgICAgICAgICBtb2RlID0gbW9kZS5wYXJlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBtb2RlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBldmVuIGlmIG9uOmVuZCBmaXJlcyBhbiBgaWdub3JlYCBpdCdzIHN0aWxsIHBvc3NpYmxlXG4gICAgICAvLyB0aGF0IHdlIG1pZ2h0IHRyaWdnZXIgdGhlIGVuZCBub2RlIGJlY2F1c2Ugb2YgYSBwYXJlbnQgbW9kZVxuICAgICAgaWYgKG1vZGUuZW5kc1dpdGhQYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIGVuZE9mTW9kZShtb2RlLnBhcmVudCwgbWF0Y2gsIG1hdGNoUGx1c1JlbWFpbmRlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIG1hdGNoaW5nIGJ1dCB0aGVuIGlnbm9yaW5nIGEgc2VxdWVuY2Ugb2YgdGV4dFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxleGVtZSAtIHN0cmluZyBjb250YWluaW5nIGZ1bGwgbWF0Y2ggdGV4dFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRvSWdub3JlKGxleGVtZSkge1xuICAgICAgaWYgKHRvcC5tYXRjaGVyLnJlZ2V4SW5kZXggPT09IDApIHtcbiAgICAgICAgLy8gbm8gbW9yZSByZWdleGVzIHRvIHBvdGVudGlhbGx5IG1hdGNoIGhlcmUsIHNvIHdlIG1vdmUgdGhlIGN1cnNvciBmb3J3YXJkIG9uZVxuICAgICAgICAvLyBzcGFjZVxuICAgICAgICBtb2RlQnVmZmVyICs9IGxleGVtZVswXTtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBubyBuZWVkIHRvIG1vdmUgdGhlIGN1cnNvciwgd2Ugc3RpbGwgaGF2ZSBhZGRpdGlvbmFsIHJlZ2V4ZXMgdG8gdHJ5IGFuZFxuICAgICAgICAvLyBtYXRjaCBhdCB0aGlzIHZlcnkgc3BvdFxuICAgICAgICByZXN1bWVTY2FuQXRTYW1lUG9zaXRpb24gPSB0cnVlO1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIHN0YXJ0IG9mIGEgbmV3IHBvdGVudGlhbCBtb2RlIG1hdGNoXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VuaGFuY2VkTWF0Y2h9IG1hdGNoIC0gdGhlIGN1cnJlbnQgbWF0Y2hcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBob3cgZmFyIHRvIGFkdmFuY2UgdGhlIHBhcnNlIGN1cnNvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRvQmVnaW5NYXRjaChtYXRjaCkge1xuICAgICAgY29uc3QgbGV4ZW1lID0gbWF0Y2hbMF07XG4gICAgICBjb25zdCBuZXdNb2RlID0gbWF0Y2gucnVsZTtcblxuICAgICAgY29uc3QgcmVzcCA9IG5ldyBSZXNwb25zZShuZXdNb2RlKTtcbiAgICAgIC8vIGZpcnN0IGludGVybmFsIGJlZm9yZSBjYWxsYmFja3MsIHRoZW4gdGhlIHB1YmxpYyBvbmVzXG4gICAgICBjb25zdCBiZWZvcmVDYWxsYmFja3MgPSBbbmV3TW9kZS5fX2JlZm9yZUJlZ2luLCBuZXdNb2RlW1wib246YmVnaW5cIl1dO1xuICAgICAgZm9yIChjb25zdCBjYiBvZiBiZWZvcmVDYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKCFjYikgY29udGludWU7XG4gICAgICAgIGNiKG1hdGNoLCByZXNwKTtcbiAgICAgICAgaWYgKHJlc3AuaXNNYXRjaElnbm9yZWQpIHJldHVybiBkb0lnbm9yZShsZXhlbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV3TW9kZS5za2lwKSB7XG4gICAgICAgIG1vZGVCdWZmZXIgKz0gbGV4ZW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG5ld01vZGUuZXhjbHVkZUJlZ2luKSB7XG4gICAgICAgICAgbW9kZUJ1ZmZlciArPSBsZXhlbWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvY2Vzc0J1ZmZlcigpO1xuICAgICAgICBpZiAoIW5ld01vZGUucmV0dXJuQmVnaW4gJiYgIW5ld01vZGUuZXhjbHVkZUJlZ2luKSB7XG4gICAgICAgICAgbW9kZUJ1ZmZlciA9IGxleGVtZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3RhcnROZXdNb2RlKG5ld01vZGUsIG1hdGNoKTtcbiAgICAgIHJldHVybiBuZXdNb2RlLnJldHVybkJlZ2luID8gMCA6IGxleGVtZS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBwb3RlbnRpYWwgZW5kIG9mIG1vZGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVnRXhwTWF0Y2hBcnJheX0gbWF0Y2ggLSB0aGUgY3VycmVudCBtYXRjaFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRvRW5kTWF0Y2gobWF0Y2gpIHtcbiAgICAgIGNvbnN0IGxleGVtZSA9IG1hdGNoWzBdO1xuICAgICAgY29uc3QgbWF0Y2hQbHVzUmVtYWluZGVyID0gY29kZVRvSGlnaGxpZ2h0LnN1YnN0cmluZyhtYXRjaC5pbmRleCk7XG5cbiAgICAgIGNvbnN0IGVuZE1vZGUgPSBlbmRPZk1vZGUodG9wLCBtYXRjaCwgbWF0Y2hQbHVzUmVtYWluZGVyKTtcbiAgICAgIGlmICghZW5kTW9kZSkgeyByZXR1cm4gTk9fTUFUQ0g7IH1cblxuICAgICAgY29uc3Qgb3JpZ2luID0gdG9wO1xuICAgICAgaWYgKHRvcC5lbmRTY29wZSAmJiB0b3AuZW5kU2NvcGUuX3dyYXApIHtcbiAgICAgICAgcHJvY2Vzc0J1ZmZlcigpO1xuICAgICAgICBlbWl0S2V5d29yZChsZXhlbWUsIHRvcC5lbmRTY29wZS5fd3JhcCk7XG4gICAgICB9IGVsc2UgaWYgKHRvcC5lbmRTY29wZSAmJiB0b3AuZW5kU2NvcGUuX211bHRpKSB7XG4gICAgICAgIHByb2Nlc3NCdWZmZXIoKTtcbiAgICAgICAgZW1pdE11bHRpQ2xhc3ModG9wLmVuZFNjb3BlLCBtYXRjaCk7XG4gICAgICB9IGVsc2UgaWYgKG9yaWdpbi5za2lwKSB7XG4gICAgICAgIG1vZGVCdWZmZXIgKz0gbGV4ZW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCEob3JpZ2luLnJldHVybkVuZCB8fCBvcmlnaW4uZXhjbHVkZUVuZCkpIHtcbiAgICAgICAgICBtb2RlQnVmZmVyICs9IGxleGVtZTtcbiAgICAgICAgfVxuICAgICAgICBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIGlmIChvcmlnaW4uZXhjbHVkZUVuZCkge1xuICAgICAgICAgIG1vZGVCdWZmZXIgPSBsZXhlbWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKHRvcC5zY29wZSkge1xuICAgICAgICAgIGVtaXR0ZXIuY2xvc2VOb2RlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0b3Auc2tpcCAmJiAhdG9wLnN1Ykxhbmd1YWdlKSB7XG4gICAgICAgICAgcmVsZXZhbmNlICs9IHRvcC5yZWxldmFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgdG9wID0gdG9wLnBhcmVudDtcbiAgICAgIH0gd2hpbGUgKHRvcCAhPT0gZW5kTW9kZS5wYXJlbnQpO1xuICAgICAgaWYgKGVuZE1vZGUuc3RhcnRzKSB7XG4gICAgICAgIHN0YXJ0TmV3TW9kZShlbmRNb2RlLnN0YXJ0cywgbWF0Y2gpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9yaWdpbi5yZXR1cm5FbmQgPyAwIDogbGV4ZW1lLmxlbmd0aDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzQ29udGludWF0aW9ucygpIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBbXTtcbiAgICAgIGZvciAobGV0IGN1cnJlbnQgPSB0b3A7IGN1cnJlbnQgIT09IGxhbmd1YWdlOyBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQpIHtcbiAgICAgICAgaWYgKGN1cnJlbnQuc2NvcGUpIHtcbiAgICAgICAgICBsaXN0LnVuc2hpZnQoY3VycmVudC5zY29wZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QuZm9yRWFjaChpdGVtID0+IGVtaXR0ZXIub3Blbk5vZGUoaXRlbSkpO1xuICAgIH1cblxuICAgIC8qKiBAdHlwZSB7e3R5cGU/OiBNYXRjaFR5cGUsIGluZGV4PzogbnVtYmVyLCBydWxlPzogTW9kZX19fSAqL1xuICAgIGxldCBsYXN0TWF0Y2ggPSB7fTtcblxuICAgIC8qKlxuICAgICAqICBQcm9jZXNzIGFuIGluZGl2aWR1YWwgbWF0Y2hcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0QmVmb3JlTWF0Y2ggLSB0ZXh0IHByZWNlZGluZyB0aGUgbWF0Y2ggKHNpbmNlIHRoZSBsYXN0IG1hdGNoKVxuICAgICAqIEBwYXJhbSB7RW5oYW5jZWRNYXRjaH0gW21hdGNoXSAtIHRoZSBtYXRjaCBpdHNlbGZcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwcm9jZXNzTGV4ZW1lKHRleHRCZWZvcmVNYXRjaCwgbWF0Y2gpIHtcbiAgICAgIGNvbnN0IGxleGVtZSA9IG1hdGNoICYmIG1hdGNoWzBdO1xuXG4gICAgICAvLyBhZGQgbm9uLW1hdGNoZWQgdGV4dCB0byB0aGUgY3VycmVudCBtb2RlIGJ1ZmZlclxuICAgICAgbW9kZUJ1ZmZlciArPSB0ZXh0QmVmb3JlTWF0Y2g7XG5cbiAgICAgIGlmIChsZXhlbWUgPT0gbnVsbCkge1xuICAgICAgICBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuXG4gICAgICAvLyB3ZSd2ZSBmb3VuZCBhIDAgd2lkdGggbWF0Y2ggYW5kIHdlJ3JlIHN0dWNrLCBzbyB3ZSBuZWVkIHRvIGFkdmFuY2VcbiAgICAgIC8vIHRoaXMgaGFwcGVucyB3aGVuIHdlIGhhdmUgYmFkbHkgYmVoYXZlZCBydWxlcyB0aGF0IGhhdmUgb3B0aW9uYWwgbWF0Y2hlcnMgdG8gdGhlIGRlZ3JlZSB0aGF0XG4gICAgICAvLyBzb21ldGltZXMgdGhleSBjYW4gZW5kIHVwIG1hdGNoaW5nIG5vdGhpbmcgYXQgYWxsXG4gICAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9oaWdobGlnaHRqcy9oaWdobGlnaHQuanMvaXNzdWVzLzIxNDBcbiAgICAgIGlmIChsYXN0TWF0Y2gudHlwZSA9PT0gXCJiZWdpblwiICYmIG1hdGNoLnR5cGUgPT09IFwiZW5kXCIgJiYgbGFzdE1hdGNoLmluZGV4ID09PSBtYXRjaC5pbmRleCAmJiBsZXhlbWUgPT09IFwiXCIpIHtcbiAgICAgICAgLy8gc3BpdCB0aGUgXCJza2lwcGVkXCIgY2hhcmFjdGVyIHRoYXQgb3VyIHJlZ2V4IGNob2tlZCBvbiBiYWNrIGludG8gdGhlIG91dHB1dCBzZXF1ZW5jZVxuICAgICAgICBtb2RlQnVmZmVyICs9IGNvZGVUb0hpZ2hsaWdodC5zbGljZShtYXRjaC5pbmRleCwgbWF0Y2guaW5kZXggKyAxKTtcbiAgICAgICAgaWYgKCFTQUZFX01PREUpIHtcbiAgICAgICAgICAvKiogQHR5cGUge0Fubm90YXRlZEVycm9yfSAqL1xuICAgICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihgMCB3aWR0aCBtYXRjaCByZWdleCAoJHtsYW5ndWFnZU5hbWV9KWApO1xuICAgICAgICAgIGVyci5sYW5ndWFnZU5hbWUgPSBsYW5ndWFnZU5hbWU7XG4gICAgICAgICAgZXJyLmJhZFJ1bGUgPSBsYXN0TWF0Y2gucnVsZTtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICBsYXN0TWF0Y2ggPSBtYXRjaDtcblxuICAgICAgaWYgKG1hdGNoLnR5cGUgPT09IFwiYmVnaW5cIikge1xuICAgICAgICByZXR1cm4gZG9CZWdpbk1hdGNoKG1hdGNoKTtcbiAgICAgIH0gZWxzZSBpZiAobWF0Y2gudHlwZSA9PT0gXCJpbGxlZ2FsXCIgJiYgIWlnbm9yZUlsbGVnYWxzKSB7XG4gICAgICAgIC8vIGlsbGVnYWwgbWF0Y2gsIHdlIGRvIG5vdCBjb250aW51ZSBwcm9jZXNzaW5nXG4gICAgICAgIC8qKiBAdHlwZSB7QW5ub3RhdGVkRXJyb3J9ICovXG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcignSWxsZWdhbCBsZXhlbWUgXCInICsgbGV4ZW1lICsgJ1wiIGZvciBtb2RlIFwiJyArICh0b3Auc2NvcGUgfHwgJzx1bm5hbWVkPicpICsgJ1wiJyk7XG4gICAgICAgIGVyci5tb2RlID0gdG9wO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9IGVsc2UgaWYgKG1hdGNoLnR5cGUgPT09IFwiZW5kXCIpIHtcbiAgICAgICAgY29uc3QgcHJvY2Vzc2VkID0gZG9FbmRNYXRjaChtYXRjaCk7XG4gICAgICAgIGlmIChwcm9jZXNzZWQgIT09IE5PX01BVENIKSB7XG4gICAgICAgICAgcmV0dXJuIHByb2Nlc3NlZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBlZGdlIGNhc2UgZm9yIHdoZW4gaWxsZWdhbCBtYXRjaGVzICQgKGVuZCBvZiBsaW5lKSB3aGljaCBpcyB0ZWNobmljYWxseVxuICAgICAgLy8gYSAwIHdpZHRoIG1hdGNoIGJ1dCBub3QgYSBiZWdpbi9lbmQgbWF0Y2ggc28gaXQncyBub3QgY2F1Z2h0IGJ5IHRoZVxuICAgICAgLy8gZmlyc3QgaGFuZGxlciAod2hlbiBpZ25vcmVJbGxlZ2FscyBpcyB0cnVlKVxuICAgICAgaWYgKG1hdGNoLnR5cGUgPT09IFwiaWxsZWdhbFwiICYmIGxleGVtZSA9PT0gXCJcIikge1xuICAgICAgICAvLyBhZHZhbmNlIHNvIHdlIGFyZW4ndCBzdHVjayBpbiBhbiBpbmZpbml0ZSBsb29wXG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuXG4gICAgICAvLyBpbmZpbml0ZSBsb29wcyBhcmUgQkFELCB0aGlzIGlzIGEgbGFzdCBkaXRjaCBjYXRjaCBhbGwuIGlmIHdlIGhhdmUgYVxuICAgICAgLy8gZGVjZW50IG51bWJlciBvZiBpdGVyYXRpb25zIHlldCBvdXIgaW5kZXggKGN1cnNvciBwb3NpdGlvbiBpbiBvdXJcbiAgICAgIC8vIHBhcnNpbmcpIHN0aWxsIDN4IGJlaGluZCBvdXIgaW5kZXggdGhlbiBzb21ldGhpbmcgaXMgdmVyeSB3cm9uZ1xuICAgICAgLy8gc28gd2UgYmFpbFxuICAgICAgaWYgKGl0ZXJhdGlvbnMgPiAxMDAwMDAgJiYgaXRlcmF0aW9ucyA+IG1hdGNoLmluZGV4ICogMykge1xuICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoJ3BvdGVudGlhbCBpbmZpbml0ZSBsb29wLCB3YXkgbW9yZSBpdGVyYXRpb25zIHRoYW4gbWF0Y2hlcycpO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICBXaHkgbWlnaHQgYmUgZmluZCBvdXJzZWx2ZXMgaGVyZT8gIEFuIHBvdGVudGlhbCBlbmQgbWF0Y2ggdGhhdCB3YXNcbiAgICAgIHRyaWdnZXJlZCBidXQgY291bGQgbm90IGJlIGNvbXBsZXRlZC4gIElFLCBgZG9FbmRNYXRjaGAgcmV0dXJuZWQgTk9fTUFUQ0guXG4gICAgICAodGhpcyBjb3VsZCBiZSBiZWNhdXNlIGEgY2FsbGJhY2sgcmVxdWVzdHMgdGhlIG1hdGNoIGJlIGlnbm9yZWQsIGV0YylcblxuICAgICAgVGhpcyBjYXVzZXMgbm8gcmVhbCBoYXJtIG90aGVyIHRoYW4gc3RvcHBpbmcgYSBmZXcgdGltZXMgdG9vIG1hbnkuXG4gICAgICAqL1xuXG4gICAgICBtb2RlQnVmZmVyICs9IGxleGVtZTtcbiAgICAgIHJldHVybiBsZXhlbWUubGVuZ3RoO1xuICAgIH1cblxuICAgIGNvbnN0IGxhbmd1YWdlID0gZ2V0TGFuZ3VhZ2UobGFuZ3VhZ2VOYW1lKTtcbiAgICBpZiAoIWxhbmd1YWdlKSB7XG4gICAgICBlcnJvcihMQU5HVUFHRV9OT1RfRk9VTkQucmVwbGFjZShcInt9XCIsIGxhbmd1YWdlTmFtZSkpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGxhbmd1YWdlOiBcIicgKyBsYW5ndWFnZU5hbWUgKyAnXCInKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZCA9IGNvbXBpbGVMYW5ndWFnZShsYW5ndWFnZSk7XG4gICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgIC8qKiBAdHlwZSB7Q29tcGlsZWRNb2RlfSAqL1xuICAgIGxldCB0b3AgPSBjb250aW51YXRpb24gfHwgbWQ7XG4gICAgLyoqIEB0eXBlIFJlY29yZDxzdHJpbmcsQ29tcGlsZWRNb2RlPiAqL1xuICAgIGNvbnN0IGNvbnRpbnVhdGlvbnMgPSB7fTsgLy8ga2VlcCBjb250aW51YXRpb25zIGZvciBzdWItbGFuZ3VhZ2VzXG4gICAgY29uc3QgZW1pdHRlciA9IG5ldyBvcHRpb25zLl9fZW1pdHRlcihvcHRpb25zKTtcbiAgICBwcm9jZXNzQ29udGludWF0aW9ucygpO1xuICAgIGxldCBtb2RlQnVmZmVyID0gJyc7XG4gICAgbGV0IHJlbGV2YW5jZSA9IDA7XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBsZXQgaXRlcmF0aW9ucyA9IDA7XG4gICAgbGV0IHJlc3VtZVNjYW5BdFNhbWVQb3NpdGlvbiA9IGZhbHNlO1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICghbGFuZ3VhZ2UuX19lbWl0VG9rZW5zKSB7XG4gICAgICAgIHRvcC5tYXRjaGVyLmNvbnNpZGVyQWxsKCk7XG5cbiAgICAgICAgZm9yICg7Oykge1xuICAgICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgICBpZiAocmVzdW1lU2NhbkF0U2FtZVBvc2l0aW9uKSB7XG4gICAgICAgICAgICAvLyBvbmx5IHJlZ2V4ZXMgbm90IG1hdGNoZWQgcHJldmlvdXNseSB3aWxsIG5vdyBiZVxuICAgICAgICAgICAgLy8gY29uc2lkZXJlZCBmb3IgYSBwb3RlbnRpYWwgbWF0Y2hcbiAgICAgICAgICAgIHJlc3VtZVNjYW5BdFNhbWVQb3NpdGlvbiA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b3AubWF0Y2hlci5jb25zaWRlckFsbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0b3AubWF0Y2hlci5sYXN0SW5kZXggPSBpbmRleDtcblxuICAgICAgICAgIGNvbnN0IG1hdGNoID0gdG9wLm1hdGNoZXIuZXhlYyhjb2RlVG9IaWdobGlnaHQpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibWF0Y2hcIiwgbWF0Y2hbMF0sIG1hdGNoLnJ1bGUgJiYgbWF0Y2gucnVsZS5iZWdpbilcblxuICAgICAgICAgIGlmICghbWF0Y2gpIGJyZWFrO1xuXG4gICAgICAgICAgY29uc3QgYmVmb3JlTWF0Y2ggPSBjb2RlVG9IaWdobGlnaHQuc3Vic3RyaW5nKGluZGV4LCBtYXRjaC5pbmRleCk7XG4gICAgICAgICAgY29uc3QgcHJvY2Vzc2VkQ291bnQgPSBwcm9jZXNzTGV4ZW1lKGJlZm9yZU1hdGNoLCBtYXRjaCk7XG4gICAgICAgICAgaW5kZXggPSBtYXRjaC5pbmRleCArIHByb2Nlc3NlZENvdW50O1xuICAgICAgICB9XG4gICAgICAgIHByb2Nlc3NMZXhlbWUoY29kZVRvSGlnaGxpZ2h0LnN1YnN0cmluZyhpbmRleCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGFuZ3VhZ2UuX19lbWl0VG9rZW5zKGNvZGVUb0hpZ2hsaWdodCwgZW1pdHRlcik7XG4gICAgICB9XG5cbiAgICAgIGVtaXR0ZXIuZmluYWxpemUoKTtcbiAgICAgIHJlc3VsdCA9IGVtaXR0ZXIudG9IVE1MKCk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxhbmd1YWdlOiBsYW5ndWFnZU5hbWUsXG4gICAgICAgIHZhbHVlOiByZXN1bHQsXG4gICAgICAgIHJlbGV2YW5jZSxcbiAgICAgICAgaWxsZWdhbDogZmFsc2UsXG4gICAgICAgIF9lbWl0dGVyOiBlbWl0dGVyLFxuICAgICAgICBfdG9wOiB0b3BcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoZXJyLm1lc3NhZ2UgJiYgZXJyLm1lc3NhZ2UuaW5jbHVkZXMoJ0lsbGVnYWwnKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxhbmd1YWdlOiBsYW5ndWFnZU5hbWUsXG4gICAgICAgICAgdmFsdWU6IGVzY2FwZShjb2RlVG9IaWdobGlnaHQpLFxuICAgICAgICAgIGlsbGVnYWw6IHRydWUsXG4gICAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICAgIF9pbGxlZ2FsQnk6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVyci5tZXNzYWdlLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBjb250ZXh0OiBjb2RlVG9IaWdobGlnaHQuc2xpY2UoaW5kZXggLSAxMDAsIGluZGV4ICsgMTAwKSxcbiAgICAgICAgICAgIG1vZGU6IGVyci5tb2RlLFxuICAgICAgICAgICAgcmVzdWx0U29GYXI6IHJlc3VsdFxuICAgICAgICAgIH0sXG4gICAgICAgICAgX2VtaXR0ZXI6IGVtaXR0ZXJcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoU0FGRV9NT0RFKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlTmFtZSxcbiAgICAgICAgICB2YWx1ZTogZXNjYXBlKGNvZGVUb0hpZ2hsaWdodCksXG4gICAgICAgICAgaWxsZWdhbDogZmFsc2UsXG4gICAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICAgIGVycm9yUmFpc2VkOiBlcnIsXG4gICAgICAgICAgX2VtaXR0ZXI6IGVtaXR0ZXIsXG4gICAgICAgICAgX3RvcDogdG9wXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYSB2YWxpZCBoaWdobGlnaHQgcmVzdWx0LCB3aXRob3V0IGFjdHVhbGx5IGRvaW5nIGFueSBhY3R1YWwgd29yayxcbiAgICogYXV0byBoaWdobGlnaHQgc3RhcnRzIHdpdGggdGhpcyBhbmQgaXQncyBwb3NzaWJsZSBmb3Igc21hbGwgc25pcHBldHMgdGhhdFxuICAgKiBhdXRvLWRldGVjdGlvbiBtYXkgbm90IGZpbmQgYSBiZXR0ZXIgbWF0Y2hcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvZGVcbiAgICogQHJldHVybnMge0hpZ2hsaWdodFJlc3VsdH1cbiAgICovXG4gIGZ1bmN0aW9uIGp1c3RUZXh0SGlnaGxpZ2h0UmVzdWx0KGNvZGUpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICB2YWx1ZTogZXNjYXBlKGNvZGUpLFxuICAgICAgaWxsZWdhbDogZmFsc2UsXG4gICAgICByZWxldmFuY2U6IDAsXG4gICAgICBfdG9wOiBQTEFJTlRFWFRfTEFOR1VBR0UsXG4gICAgICBfZW1pdHRlcjogbmV3IG9wdGlvbnMuX19lbWl0dGVyKG9wdGlvbnMpXG4gICAgfTtcbiAgICByZXN1bHQuX2VtaXR0ZXIuYWRkVGV4dChjb2RlKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gIEhpZ2hsaWdodGluZyB3aXRoIGxhbmd1YWdlIGRldGVjdGlvbi4gQWNjZXB0cyBhIHN0cmluZyB3aXRoIHRoZSBjb2RlIHRvXG4gIGhpZ2hsaWdodC4gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG5cbiAgLSBsYW5ndWFnZSAoZGV0ZWN0ZWQgbGFuZ3VhZ2UpXG4gIC0gcmVsZXZhbmNlIChpbnQpXG4gIC0gdmFsdWUgKGFuIEhUTUwgc3RyaW5nIHdpdGggaGlnaGxpZ2h0aW5nIG1hcmt1cClcbiAgLSBzZWNvbmRCZXN0IChvYmplY3Qgd2l0aCB0aGUgc2FtZSBzdHJ1Y3R1cmUgZm9yIHNlY29uZC1iZXN0IGhldXJpc3RpY2FsbHlcbiAgICBkZXRlY3RlZCBsYW5ndWFnZSwgbWF5IGJlIGFic2VudClcblxuICAgIEBwYXJhbSB7c3RyaW5nfSBjb2RlXG4gICAgQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBbbGFuZ3VhZ2VTdWJzZXRdXG4gICAgQHJldHVybnMge0F1dG9IaWdobGlnaHRSZXN1bHR9XG4gICovXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodEF1dG8oY29kZSwgbGFuZ3VhZ2VTdWJzZXQpIHtcbiAgICBsYW5ndWFnZVN1YnNldCA9IGxhbmd1YWdlU3Vic2V0IHx8IG9wdGlvbnMubGFuZ3VhZ2VzIHx8IE9iamVjdC5rZXlzKGxhbmd1YWdlcyk7XG4gICAgY29uc3QgcGxhaW50ZXh0ID0ganVzdFRleHRIaWdobGlnaHRSZXN1bHQoY29kZSk7XG5cbiAgICBjb25zdCByZXN1bHRzID0gbGFuZ3VhZ2VTdWJzZXQuZmlsdGVyKGdldExhbmd1YWdlKS5maWx0ZXIoYXV0b0RldGVjdGlvbikubWFwKG5hbWUgPT5cbiAgICAgIF9oaWdobGlnaHQobmFtZSwgY29kZSwgZmFsc2UpXG4gICAgKTtcbiAgICByZXN1bHRzLnVuc2hpZnQocGxhaW50ZXh0KTsgLy8gcGxhaW50ZXh0IGlzIGFsd2F5cyBhbiBvcHRpb25cblxuICAgIGNvbnN0IHNvcnRlZCA9IHJlc3VsdHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgLy8gc29ydCBiYXNlIG9uIHJlbGV2YW5jZVxuICAgICAgaWYgKGEucmVsZXZhbmNlICE9PSBiLnJlbGV2YW5jZSkgcmV0dXJuIGIucmVsZXZhbmNlIC0gYS5yZWxldmFuY2U7XG5cbiAgICAgIC8vIGFsd2F5cyBhd2FyZCB0aGUgdGllIHRvIHRoZSBiYXNlIGxhbmd1YWdlXG4gICAgICAvLyBpZSBpZiBDKysgYW5kIEFyZHVpbm8gYXJlIHRpZWQsIGl0J3MgbW9yZSBsaWtlbHkgdG8gYmUgQysrXG4gICAgICBpZiAoYS5sYW5ndWFnZSAmJiBiLmxhbmd1YWdlKSB7XG4gICAgICAgIGlmIChnZXRMYW5ndWFnZShhLmxhbmd1YWdlKS5zdXBlcnNldE9mID09PSBiLmxhbmd1YWdlKSB7XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSBpZiAoZ2V0TGFuZ3VhZ2UoYi5sYW5ndWFnZSkuc3VwZXJzZXRPZiA9PT0gYS5sYW5ndWFnZSkge1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBvdGhlcndpc2Ugc2F5IHRoZXkgYXJlIGVxdWFsLCB3aGljaCBoYXMgdGhlIGVmZmVjdCBvZiBzb3J0aW5nIG9uXG4gICAgICAvLyByZWxldmFuY2Ugd2hpbGUgcHJlc2VydmluZyB0aGUgb3JpZ2luYWwgb3JkZXJpbmcgLSB3aGljaCBpcyBob3cgdGllc1xuICAgICAgLy8gaGF2ZSBoaXN0b3JpY2FsbHkgYmVlbiBzZXR0bGVkLCBpZSB0aGUgbGFuZ3VhZ2UgdGhhdCBjb21lcyBmaXJzdCBhbHdheXNcbiAgICAgIC8vIHdpbnMgaW4gdGhlIGNhc2Ugb2YgYSB0aWVcbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuXG4gICAgY29uc3QgW2Jlc3QsIHNlY29uZEJlc3RdID0gc29ydGVkO1xuXG4gICAgLyoqIEB0eXBlIHtBdXRvSGlnaGxpZ2h0UmVzdWx0fSAqL1xuICAgIGNvbnN0IHJlc3VsdCA9IGJlc3Q7XG4gICAgcmVzdWx0LnNlY29uZEJlc3QgPSBzZWNvbmRCZXN0O1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZHMgbmV3IGNsYXNzIG5hbWUgZm9yIGJsb2NrIGdpdmVuIHRoZSBsYW5ndWFnZSBuYW1lXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtjdXJyZW50TGFuZ11cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtyZXN1bHRMYW5nXVxuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlQ2xhc3NOYW1lKGVsZW1lbnQsIGN1cnJlbnRMYW5nLCByZXN1bHRMYW5nKSB7XG4gICAgY29uc3QgbGFuZ3VhZ2UgPSAoY3VycmVudExhbmcgJiYgYWxpYXNlc1tjdXJyZW50TGFuZ10pIHx8IHJlc3VsdExhbmc7XG5cbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJobGpzXCIpO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbGFuZ3VhZ2UtJHtsYW5ndWFnZX1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIGhpZ2hsaWdodGluZyB0byBhIERPTSBub2RlIGNvbnRhaW5pbmcgY29kZS5cbiAgICpcbiAgICogQHBhcmFtIHtIaWdobGlnaHRlZEhUTUxFbGVtZW50fSBlbGVtZW50IC0gdGhlIEhUTUwgZWxlbWVudCB0byBoaWdobGlnaHRcbiAgKi9cbiAgZnVuY3Rpb24gaGlnaGxpZ2h0RWxlbWVudChlbGVtZW50KSB7XG4gICAgLyoqIEB0eXBlIEhUTUxFbGVtZW50ICovXG4gICAgbGV0IG5vZGUgPSBudWxsO1xuICAgIGNvbnN0IGxhbmd1YWdlID0gYmxvY2tMYW5ndWFnZShlbGVtZW50KTtcblxuICAgIGlmIChzaG91bGROb3RIaWdobGlnaHQobGFuZ3VhZ2UpKSByZXR1cm47XG5cbiAgICBmaXJlKFwiYmVmb3JlOmhpZ2hsaWdodEVsZW1lbnRcIixcbiAgICAgIHsgZWw6IGVsZW1lbnQsIGxhbmd1YWdlIH0pO1xuXG4gICAgaWYgKGVsZW1lbnQuZGF0YXNldC5oaWdobGlnaHRlZCkge1xuICAgICAgY29uc29sZS5sb2coXCJFbGVtZW50IHByZXZpb3VzbHkgaGlnaGxpZ2h0ZWQuIFRvIGhpZ2hsaWdodCBhZ2FpbiwgZmlyc3QgdW5zZXQgYGRhdGFzZXQuaGlnaGxpZ2h0ZWRgLlwiLCBlbGVtZW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB3ZSBzaG91bGQgYmUgYWxsIHRleHQsIG5vIGNoaWxkIG5vZGVzICh1bmVzY2FwZWQgSFRNTCkgLSB0aGlzIGlzIHBvc3NpYmx5XG4gICAgLy8gYW4gSFRNTCBpbmplY3Rpb24gYXR0YWNrIC0gaXQncyBsaWtlbHkgdG9vIGxhdGUgaWYgdGhpcyBpcyBhbHJlYWR5IGluXG4gICAgLy8gcHJvZHVjdGlvbiAodGhlIGNvZGUgaGFzIGxpa2VseSBhbHJlYWR5IGRvbmUgaXRzIGRhbWFnZSBieSB0aGUgdGltZVxuICAgIC8vIHdlJ3JlIHNlZWluZyBpdCkuLi4gYnV0IHdlIHllbGwgbG91ZGx5IGFib3V0IHRoaXMgc28gdGhhdCBob3BlZnVsbHkgaXQnc1xuICAgIC8vIG1vcmUgbGlrZWx5IHRvIGJlIGNhdWdodCBpbiBkZXZlbG9wbWVudCBiZWZvcmUgbWFraW5nIGl0IHRvIHByb2R1Y3Rpb25cbiAgICBpZiAoZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAoIW9wdGlvbnMuaWdub3JlVW5lc2NhcGVkSFRNTCkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJPbmUgb2YgeW91ciBjb2RlIGJsb2NrcyBpbmNsdWRlcyB1bmVzY2FwZWQgSFRNTC4gVGhpcyBpcyBhIHBvdGVudGlhbGx5IHNlcmlvdXMgc2VjdXJpdHkgcmlzay5cIik7XG4gICAgICAgIGNvbnNvbGUud2FybihcImh0dHBzOi8vZ2l0aHViLmNvbS9oaWdobGlnaHRqcy9oaWdobGlnaHQuanMvd2lraS9zZWN1cml0eVwiKTtcbiAgICAgICAgY29uc29sZS53YXJuKFwiVGhlIGVsZW1lbnQgd2l0aCB1bmVzY2FwZWQgSFRNTDpcIik7XG4gICAgICAgIGNvbnNvbGUud2FybihlbGVtZW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLnRocm93VW5lc2NhcGVkSFRNTCkge1xuICAgICAgICBjb25zdCBlcnIgPSBuZXcgSFRNTEluamVjdGlvbkVycm9yKFxuICAgICAgICAgIFwiT25lIG9mIHlvdXIgY29kZSBibG9ja3MgaW5jbHVkZXMgdW5lc2NhcGVkIEhUTUwuXCIsXG4gICAgICAgICAgZWxlbWVudC5pbm5lckhUTUxcbiAgICAgICAgKTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUgPSBlbGVtZW50O1xuICAgIGNvbnN0IHRleHQgPSBub2RlLnRleHRDb250ZW50O1xuICAgIGNvbnN0IHJlc3VsdCA9IGxhbmd1YWdlID8gaGlnaGxpZ2h0KHRleHQsIHsgbGFuZ3VhZ2UsIGlnbm9yZUlsbGVnYWxzOiB0cnVlIH0pIDogaGlnaGxpZ2h0QXV0byh0ZXh0KTtcblxuICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gcmVzdWx0LnZhbHVlO1xuICAgIGVsZW1lbnQuZGF0YXNldC5oaWdobGlnaHRlZCA9IFwieWVzXCI7XG4gICAgdXBkYXRlQ2xhc3NOYW1lKGVsZW1lbnQsIGxhbmd1YWdlLCByZXN1bHQubGFuZ3VhZ2UpO1xuICAgIGVsZW1lbnQucmVzdWx0ID0ge1xuICAgICAgbGFuZ3VhZ2U6IHJlc3VsdC5sYW5ndWFnZSxcbiAgICAgIC8vIFRPRE86IHJlbW92ZSB3aXRoIHZlcnNpb24gMTEuMFxuICAgICAgcmU6IHJlc3VsdC5yZWxldmFuY2UsXG4gICAgICByZWxldmFuY2U6IHJlc3VsdC5yZWxldmFuY2VcbiAgICB9O1xuICAgIGlmIChyZXN1bHQuc2Vjb25kQmVzdCkge1xuICAgICAgZWxlbWVudC5zZWNvbmRCZXN0ID0ge1xuICAgICAgICBsYW5ndWFnZTogcmVzdWx0LnNlY29uZEJlc3QubGFuZ3VhZ2UsXG4gICAgICAgIHJlbGV2YW5jZTogcmVzdWx0LnNlY29uZEJlc3QucmVsZXZhbmNlXG4gICAgICB9O1xuICAgIH1cblxuICAgIGZpcmUoXCJhZnRlcjpoaWdobGlnaHRFbGVtZW50XCIsIHsgZWw6IGVsZW1lbnQsIHJlc3VsdCwgdGV4dCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGhpZ2hsaWdodC5qcyBnbG9iYWwgb3B0aW9ucyB3aXRoIHRoZSBwYXNzZWQgb3B0aW9uc1xuICAgKlxuICAgKiBAcGFyYW0ge1BhcnRpYWw8SExKU09wdGlvbnM+fSB1c2VyT3B0aW9uc1xuICAgKi9cbiAgZnVuY3Rpb24gY29uZmlndXJlKHVzZXJPcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IGluaGVyaXQob3B0aW9ucywgdXNlck9wdGlvbnMpO1xuICB9XG5cbiAgLy8gVE9ETzogcmVtb3ZlIHYxMiwgZGVwcmVjYXRlZFxuICBjb25zdCBpbml0SGlnaGxpZ2h0aW5nID0gKCkgPT4ge1xuICAgIGhpZ2hsaWdodEFsbCgpO1xuICAgIGRlcHJlY2F0ZWQoXCIxMC42LjBcIiwgXCJpbml0SGlnaGxpZ2h0aW5nKCkgZGVwcmVjYXRlZC4gIFVzZSBoaWdobGlnaHRBbGwoKSBub3cuXCIpO1xuICB9O1xuXG4gIC8vIFRPRE86IHJlbW92ZSB2MTIsIGRlcHJlY2F0ZWRcbiAgZnVuY3Rpb24gaW5pdEhpZ2hsaWdodGluZ09uTG9hZCgpIHtcbiAgICBoaWdobGlnaHRBbGwoKTtcbiAgICBkZXByZWNhdGVkKFwiMTAuNi4wXCIsIFwiaW5pdEhpZ2hsaWdodGluZ09uTG9hZCgpIGRlcHJlY2F0ZWQuICBVc2UgaGlnaGxpZ2h0QWxsKCkgbm93LlwiKTtcbiAgfVxuXG4gIGxldCB3YW50c0hpZ2hsaWdodCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBhdXRvLWhpZ2hsaWdodHMgYWxsIHByZT5jb2RlIGVsZW1lbnRzIG9uIHRoZSBwYWdlXG4gICAqL1xuICBmdW5jdGlvbiBoaWdobGlnaHRBbGwoKSB7XG4gICAgLy8gaWYgd2UgYXJlIGNhbGxlZCB0b28gZWFybHkgaW4gdGhlIGxvYWRpbmcgcHJvY2Vzc1xuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImxvYWRpbmdcIikge1xuICAgICAgd2FudHNIaWdobGlnaHQgPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5jc3NTZWxlY3Rvcik7XG4gICAgYmxvY2tzLmZvckVhY2goaGlnaGxpZ2h0RWxlbWVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBib290KCkge1xuICAgIC8vIGlmIGEgaGlnaGxpZ2h0IHdhcyByZXF1ZXN0ZWQgYmVmb3JlIERPTSB3YXMgbG9hZGVkLCBkbyBub3dcbiAgICBpZiAod2FudHNIaWdobGlnaHQpIGhpZ2hsaWdodEFsbCgpO1xuICB9XG5cbiAgLy8gbWFrZSBzdXJlIHdlIGFyZSBpbiB0aGUgYnJvd3NlciBlbnZpcm9ubWVudFxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGJvb3QsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGxhbmd1YWdlIGdyYW1tYXIgbW9kdWxlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZU5hbWVcbiAgICogQHBhcmFtIHtMYW5ndWFnZUZufSBsYW5ndWFnZURlZmluaXRpb25cbiAgICovXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyTGFuZ3VhZ2UobGFuZ3VhZ2VOYW1lLCBsYW5ndWFnZURlZmluaXRpb24pIHtcbiAgICBsZXQgbGFuZyA9IG51bGw7XG4gICAgdHJ5IHtcbiAgICAgIGxhbmcgPSBsYW5ndWFnZURlZmluaXRpb24oaGxqcyk7XG4gICAgfSBjYXRjaCAoZXJyb3IkMSkge1xuICAgICAgZXJyb3IoXCJMYW5ndWFnZSBkZWZpbml0aW9uIGZvciAne30nIGNvdWxkIG5vdCBiZSByZWdpc3RlcmVkLlwiLnJlcGxhY2UoXCJ7fVwiLCBsYW5ndWFnZU5hbWUpKTtcbiAgICAgIC8vIGhhcmQgb3Igc29mdCBlcnJvclxuICAgICAgaWYgKCFTQUZFX01PREUpIHsgdGhyb3cgZXJyb3IkMTsgfSBlbHNlIHsgZXJyb3IoZXJyb3IkMSk7IH1cbiAgICAgIC8vIGxhbmd1YWdlcyB0aGF0IGhhdmUgc2VyaW91cyBlcnJvcnMgYXJlIHJlcGxhY2VkIHdpdGggZXNzZW50aWFsbHkgYVxuICAgICAgLy8gXCJwbGFpbnRleHRcIiBzdGFuZC1pbiBzbyB0aGF0IHRoZSBjb2RlIGJsb2NrcyB3aWxsIHN0aWxsIGdldCBub3JtYWxcbiAgICAgIC8vIGNzcyBjbGFzc2VzIGFwcGxpZWQgdG8gdGhlbSAtIGFuZCBvbmUgYmFkIGxhbmd1YWdlIHdvbid0IGJyZWFrIHRoZVxuICAgICAgLy8gZW50aXJlIGhpZ2hsaWdodGVyXG4gICAgICBsYW5nID0gUExBSU5URVhUX0xBTkdVQUdFO1xuICAgIH1cbiAgICAvLyBnaXZlIGl0IGEgdGVtcG9yYXJ5IG5hbWUgaWYgaXQgZG9lc24ndCBoYXZlIG9uZSBpbiB0aGUgbWV0YS1kYXRhXG4gICAgaWYgKCFsYW5nLm5hbWUpIGxhbmcubmFtZSA9IGxhbmd1YWdlTmFtZTtcbiAgICBsYW5ndWFnZXNbbGFuZ3VhZ2VOYW1lXSA9IGxhbmc7XG4gICAgbGFuZy5yYXdEZWZpbml0aW9uID0gbGFuZ3VhZ2VEZWZpbml0aW9uLmJpbmQobnVsbCwgaGxqcyk7XG5cbiAgICBpZiAobGFuZy5hbGlhc2VzKSB7XG4gICAgICByZWdpc3RlckFsaWFzZXMobGFuZy5hbGlhc2VzLCB7IGxhbmd1YWdlTmFtZSB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGFuZ3VhZ2UgZ3JhbW1hciBtb2R1bGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlTmFtZVxuICAgKi9cbiAgZnVuY3Rpb24gdW5yZWdpc3Rlckxhbmd1YWdlKGxhbmd1YWdlTmFtZSkge1xuICAgIGRlbGV0ZSBsYW5ndWFnZXNbbGFuZ3VhZ2VOYW1lXTtcbiAgICBmb3IgKGNvbnN0IGFsaWFzIG9mIE9iamVjdC5rZXlzKGFsaWFzZXMpKSB7XG4gICAgICBpZiAoYWxpYXNlc1thbGlhc10gPT09IGxhbmd1YWdlTmFtZSkge1xuICAgICAgICBkZWxldGUgYWxpYXNlc1thbGlhc107XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtzdHJpbmdbXX0gTGlzdCBvZiBsYW5ndWFnZSBpbnRlcm5hbCBuYW1lc1xuICAgKi9cbiAgZnVuY3Rpb24gbGlzdExhbmd1YWdlcygpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMobGFuZ3VhZ2VzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIG5hbWUgb2YgdGhlIGxhbmd1YWdlIHRvIHJldHJpZXZlXG4gICAqIEByZXR1cm5zIHtMYW5ndWFnZSB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGZ1bmN0aW9uIGdldExhbmd1YWdlKG5hbWUpIHtcbiAgICBuYW1lID0gKG5hbWUgfHwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIGxhbmd1YWdlc1tuYW1lXSB8fCBsYW5ndWFnZXNbYWxpYXNlc1tuYW1lXV07XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IGFsaWFzTGlzdCAtIHNpbmdsZSBhbGlhcyBvciBsaXN0IG9mIGFsaWFzZXNcbiAgICogQHBhcmFtIHt7bGFuZ3VhZ2VOYW1lOiBzdHJpbmd9fSBvcHRzXG4gICAqL1xuICBmdW5jdGlvbiByZWdpc3RlckFsaWFzZXMoYWxpYXNMaXN0LCB7IGxhbmd1YWdlTmFtZSB9KSB7XG4gICAgaWYgKHR5cGVvZiBhbGlhc0xpc3QgPT09ICdzdHJpbmcnKSB7XG4gICAgICBhbGlhc0xpc3QgPSBbYWxpYXNMaXN0XTtcbiAgICB9XG4gICAgYWxpYXNMaXN0LmZvckVhY2goYWxpYXMgPT4geyBhbGlhc2VzW2FsaWFzLnRvTG93ZXJDYXNlKCldID0gbGFuZ3VhZ2VOYW1lOyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIGEgZ2l2ZW4gbGFuZ3VhZ2UgaGFzIGF1dG8tZGV0ZWN0aW9uIGVuYWJsZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBuYW1lIG9mIHRoZSBsYW5ndWFnZVxuICAgKi9cbiAgZnVuY3Rpb24gYXV0b0RldGVjdGlvbihuYW1lKSB7XG4gICAgY29uc3QgbGFuZyA9IGdldExhbmd1YWdlKG5hbWUpO1xuICAgIHJldHVybiBsYW5nICYmICFsYW5nLmRpc2FibGVBdXRvZGV0ZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZ3JhZGVzIHRoZSBvbGQgaGlnaGxpZ2h0QmxvY2sgcGx1Z2lucyB0byB0aGUgbmV3XG4gICAqIGhpZ2hsaWdodEVsZW1lbnQgQVBJXG4gICAqIEBwYXJhbSB7SExKU1BsdWdpbn0gcGx1Z2luXG4gICAqL1xuICBmdW5jdGlvbiB1cGdyYWRlUGx1Z2luQVBJKHBsdWdpbikge1xuICAgIC8vIFRPRE86IHJlbW92ZSB3aXRoIHYxMlxuICAgIGlmIChwbHVnaW5bXCJiZWZvcmU6aGlnaGxpZ2h0QmxvY2tcIl0gJiYgIXBsdWdpbltcImJlZm9yZTpoaWdobGlnaHRFbGVtZW50XCJdKSB7XG4gICAgICBwbHVnaW5bXCJiZWZvcmU6aGlnaGxpZ2h0RWxlbWVudFwiXSA9IChkYXRhKSA9PiB7XG4gICAgICAgIHBsdWdpbltcImJlZm9yZTpoaWdobGlnaHRCbG9ja1wiXShcbiAgICAgICAgICBPYmplY3QuYXNzaWduKHsgYmxvY2s6IGRhdGEuZWwgfSwgZGF0YSlcbiAgICAgICAgKTtcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChwbHVnaW5bXCJhZnRlcjpoaWdobGlnaHRCbG9ja1wiXSAmJiAhcGx1Z2luW1wiYWZ0ZXI6aGlnaGxpZ2h0RWxlbWVudFwiXSkge1xuICAgICAgcGx1Z2luW1wiYWZ0ZXI6aGlnaGxpZ2h0RWxlbWVudFwiXSA9IChkYXRhKSA9PiB7XG4gICAgICAgIHBsdWdpbltcImFmdGVyOmhpZ2hsaWdodEJsb2NrXCJdKFxuICAgICAgICAgIE9iamVjdC5hc3NpZ24oeyBibG9jazogZGF0YS5lbCB9LCBkYXRhKVxuICAgICAgICApO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtITEpTUGx1Z2lufSBwbHVnaW5cbiAgICovXG4gIGZ1bmN0aW9uIGFkZFBsdWdpbihwbHVnaW4pIHtcbiAgICB1cGdyYWRlUGx1Z2luQVBJKHBsdWdpbik7XG4gICAgcGx1Z2lucy5wdXNoKHBsdWdpbik7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtITEpTUGx1Z2lufSBwbHVnaW5cbiAgICovXG4gIGZ1bmN0aW9uIHJlbW92ZVBsdWdpbihwbHVnaW4pIHtcbiAgICBjb25zdCBpbmRleCA9IHBsdWdpbnMuaW5kZXhPZihwbHVnaW4pO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHBsdWdpbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtQbHVnaW5FdmVudH0gZXZlbnRcbiAgICogQHBhcmFtIHthbnl9IGFyZ3NcbiAgICovXG4gIGZ1bmN0aW9uIGZpcmUoZXZlbnQsIGFyZ3MpIHtcbiAgICBjb25zdCBjYiA9IGV2ZW50O1xuICAgIHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgIGlmIChwbHVnaW5bY2JdKSB7XG4gICAgICAgIHBsdWdpbltjYl0oYXJncyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogREVQUkVDQVRFRFxuICAgKiBAcGFyYW0ge0hpZ2hsaWdodGVkSFRNTEVsZW1lbnR9IGVsXG4gICAqL1xuICBmdW5jdGlvbiBkZXByZWNhdGVIaWdobGlnaHRCbG9jayhlbCkge1xuICAgIGRlcHJlY2F0ZWQoXCIxMC43LjBcIiwgXCJoaWdobGlnaHRCbG9jayB3aWxsIGJlIHJlbW92ZWQgZW50aXJlbHkgaW4gdjEyLjBcIik7XG4gICAgZGVwcmVjYXRlZChcIjEwLjcuMFwiLCBcIlBsZWFzZSB1c2UgaGlnaGxpZ2h0RWxlbWVudCBub3cuXCIpO1xuXG4gICAgcmV0dXJuIGhpZ2hsaWdodEVsZW1lbnQoZWwpO1xuICB9XG5cbiAgLyogSW50ZXJmYWNlIGRlZmluaXRpb24gKi9cbiAgT2JqZWN0LmFzc2lnbihobGpzLCB7XG4gICAgaGlnaGxpZ2h0LFxuICAgIGhpZ2hsaWdodEF1dG8sXG4gICAgaGlnaGxpZ2h0QWxsLFxuICAgIGhpZ2hsaWdodEVsZW1lbnQsXG4gICAgLy8gVE9ETzogUmVtb3ZlIHdpdGggdjEyIEFQSVxuICAgIGhpZ2hsaWdodEJsb2NrOiBkZXByZWNhdGVIaWdobGlnaHRCbG9jayxcbiAgICBjb25maWd1cmUsXG4gICAgaW5pdEhpZ2hsaWdodGluZyxcbiAgICBpbml0SGlnaGxpZ2h0aW5nT25Mb2FkLFxuICAgIHJlZ2lzdGVyTGFuZ3VhZ2UsXG4gICAgdW5yZWdpc3Rlckxhbmd1YWdlLFxuICAgIGxpc3RMYW5ndWFnZXMsXG4gICAgZ2V0TGFuZ3VhZ2UsXG4gICAgcmVnaXN0ZXJBbGlhc2VzLFxuICAgIGF1dG9EZXRlY3Rpb24sXG4gICAgaW5oZXJpdCxcbiAgICBhZGRQbHVnaW4sXG4gICAgcmVtb3ZlUGx1Z2luXG4gIH0pO1xuXG4gIGhsanMuZGVidWdNb2RlID0gZnVuY3Rpb24oKSB7IFNBRkVfTU9ERSA9IGZhbHNlOyB9O1xuICBobGpzLnNhZmVNb2RlID0gZnVuY3Rpb24oKSB7IFNBRkVfTU9ERSA9IHRydWU7IH07XG4gIGhsanMudmVyc2lvblN0cmluZyA9IHZlcnNpb247XG5cbiAgaGxqcy5yZWdleCA9IHtcbiAgICBjb25jYXQ6IGNvbmNhdCxcbiAgICBsb29rYWhlYWQ6IGxvb2thaGVhZCxcbiAgICBlaXRoZXI6IGVpdGhlcixcbiAgICBvcHRpb25hbDogb3B0aW9uYWwsXG4gICAgYW55TnVtYmVyT2ZUaW1lczogYW55TnVtYmVyT2ZUaW1lc1xuICB9O1xuXG4gIGZvciAoY29uc3Qga2V5IGluIE1PREVTKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmICh0eXBlb2YgTU9ERVNba2V5XSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgZGVlcEZyZWV6ZShNT0RFU1trZXldKTtcbiAgICB9XG4gIH1cblxuICAvLyBtZXJnZSBhbGwgdGhlIG1vZGVzL3JlZ2V4ZXMgaW50byBvdXIgbWFpbiBvYmplY3RcbiAgT2JqZWN0LmFzc2lnbihobGpzLCBNT0RFUyk7XG5cbiAgcmV0dXJuIGhsanM7XG59O1xuXG4vLyBPdGhlciBuYW1lcyBmb3IgdGhlIHZhcmlhYmxlIG1heSBicmVhayBidWlsZCBzY3JpcHRcbmNvbnN0IGhpZ2hsaWdodCA9IEhMSlMoe30pO1xuXG4vLyByZXR1cm5zIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBoaWdobGlnaHRlciB0byBiZSB1c2VkIGZvciBleHRlbnNpb25zXG4vLyBjaGVjayBodHRwczovL2dpdGh1Yi5jb20vd29vb3JtL2xvd2xpZ2h0L2lzc3Vlcy80N1xuaGlnaGxpZ2h0Lm5ld0luc3RhbmNlID0gKCkgPT4gSExKUyh7fSk7XG5cbm1vZHVsZS5leHBvcnRzID0gaGlnaGxpZ2h0O1xuaGlnaGxpZ2h0LkhpZ2hsaWdodEpTID0gaGlnaGxpZ2h0O1xuaGlnaGxpZ2h0LmRlZmF1bHQgPSBoaWdobGlnaHQ7XG4iLCIvLyBodHRwczovL25vZGVqcy5vcmcvYXBpL3BhY2thZ2VzLmh0bWwjcGFja2FnZXNfd3JpdGluZ19kdWFsX3BhY2thZ2VzX3doaWxlX2F2b2lkaW5nX29yX21pbmltaXppbmdfaGF6YXJkc1xuaW1wb3J0IEhpZ2hsaWdodEpTIGZyb20gJy4uL2xpYi9jb3JlLmpzJztcbmV4cG9ydCB7IEhpZ2hsaWdodEpTIH07XG5leHBvcnQgZGVmYXVsdCBIaWdobGlnaHRKUztcbiIsIi8qXG5MYW5ndWFnZTogUlxuRGVzY3JpcHRpb246IFIgaXMgYSBmcmVlIHNvZnR3YXJlIGVudmlyb25tZW50IGZvciBzdGF0aXN0aWNhbCBjb21wdXRpbmcgYW5kIGdyYXBoaWNzLlxuQXV0aG9yOiBKb2UgQ2hlbmcgPGpvZUByc3R1ZGlvLm9yZz5cbkNvbnRyaWJ1dG9yczogS29ucmFkIFJ1ZG9scGggPGtvbnJhZC5ydWRvbHBoQGdtYWlsLmNvbT5cbldlYnNpdGU6IGh0dHBzOi8vd3d3LnItcHJvamVjdC5vcmdcbkNhdGVnb3J5OiBjb21tb24sc2NpZW50aWZpY1xuKi9cblxuLyoqIEB0eXBlIExhbmd1YWdlRm4gKi9cbmZ1bmN0aW9uIHIoaGxqcykge1xuICBjb25zdCByZWdleCA9IGhsanMucmVnZXg7XG4gIC8vIElkZW50aWZpZXJzIGluIFIgY2Fubm90IHN0YXJ0IHdpdGggYF9gLCBidXQgdGhleSBjYW4gc3RhcnQgd2l0aCBgLmAgaWYgaXRcbiAgLy8gaXMgbm90IGltbWVkaWF0ZWx5IGZvbGxvd2VkIGJ5IGEgZGlnaXQuXG4gIC8vIFIgYWxzbyBzdXBwb3J0cyBxdW90ZWQgaWRlbnRpZmllcnMsIHdoaWNoIGFyZSBuZWFyLWFyYml0cmFyeSBzZXF1ZW5jZXNcbiAgLy8gZGVsaW1pdGVkIGJ5IGJhY2t0aWNrcyAoYOKApmApLCB3aGljaCBtYXkgY29udGFpbiBlc2NhcGUgc2VxdWVuY2VzLiBUaGVzZSBhcmVcbiAgLy8gaGFuZGxlZCBpbiBhIHNlcGFyYXRlIG1vZGUuIFNlZSBgdGVzdC9tYXJrdXAvci9uYW1lcy50eHRgIGZvciBleGFtcGxlcy5cbiAgLy8gRklYTUU6IFN1cHBvcnQgVW5pY29kZSBpZGVudGlmaWVycy5cbiAgY29uc3QgSURFTlRfUkUgPSAvKD86KD86W2EtekEtWl18XFwuWy5fYS16QS1aXSlbLl9hLXpBLVowLTldKil8XFwuKD8hXFxkKS87XG4gIGNvbnN0IE5VTUJFUl9UWVBFU19SRSA9IHJlZ2V4LmVpdGhlcihcbiAgICAvLyBTcGVjaWFsIGNhc2U6IG9ubHkgaGV4YWRlY2ltYWwgYmluYXJ5IHBvd2VycyBjYW4gY29udGFpbiBmcmFjdGlvbnNcbiAgICAvMFt4WF1bMC05YS1mQS1GXStcXC5bMC05YS1mQS1GXSpbcFBdWystXT9cXGQraT8vLFxuICAgIC8vIEhleGFkZWNpbWFsIG51bWJlcnMgd2l0aG91dCBmcmFjdGlvbiBhbmQgb3B0aW9uYWwgYmluYXJ5IHBvd2VyXG4gICAgLzBbeFhdWzAtOWEtZkEtRl0rKD86W3BQXVsrLV0/XFxkKyk/W0xpXT8vLFxuICAgIC8vIERlY2ltYWwgbnVtYmVyc1xuICAgIC8oPzpcXGQrKD86XFwuXFxkKik/fFxcLlxcZCspKD86W2VFXVsrLV0/XFxkKyk/W0xpXT8vXG4gICk7XG4gIGNvbnN0IE9QRVJBVE9SU19SRSA9IC9bPSE8PjpdPXxcXHxcXHx8JiZ8Ojo6P3w8LXw8PC18LT4+fC0+fFxcfD58Wy0rKlxcLz8hJCZ8Ojw9PkBefl18XFwqXFwqLztcbiAgY29uc3QgUFVOQ1RVQVRJT05fUkUgPSByZWdleC5laXRoZXIoXG4gICAgL1soKV0vLFxuICAgIC9be31dLyxcbiAgICAvXFxbXFxbLyxcbiAgICAvW1tcXF1dLyxcbiAgICAvXFxcXC8sXG4gICAgLywvXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnUicsXG5cbiAgICBrZXl3b3Jkczoge1xuICAgICAgJHBhdHRlcm46IElERU5UX1JFLFxuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2Z1bmN0aW9uIGlmIGluIGJyZWFrIG5leHQgcmVwZWF0IGVsc2UgZm9yIHdoaWxlJyxcbiAgICAgIGxpdGVyYWw6XG4gICAgICAgICdOVUxMIE5BIFRSVUUgRkFMU0UgSW5mIE5hTiBOQV9pbnRlZ2VyX3wxMCBOQV9yZWFsX3wxMCAnXG4gICAgICAgICsgJ05BX2NoYXJhY3Rlcl98MTAgTkFfY29tcGxleF98MTAnLFxuICAgICAgYnVpbHRfaW46XG4gICAgICAgIC8vIEJ1aWx0aW4gY29uc3RhbnRzXG4gICAgICAgICdMRVRURVJTIGxldHRlcnMgbW9udGguYWJiIG1vbnRoLm5hbWUgcGkgVCBGICdcbiAgICAgICAgLy8gUHJpbWl0aXZlIGZ1bmN0aW9uc1xuICAgICAgICAvLyBUaGVzZSBhcmUgYWxsIHRoZSBmdW5jdGlvbnMgaW4gYGJhc2VgIHRoYXQgYXJlIGltcGxlbWVudGVkIGFzIGFcbiAgICAgICAgLy8gYC5QcmltaXRpdmVgLCBtaW51cyB0aG9zZSBmdW5jdGlvbnMgdGhhdCBhcmUgYWxzbyBrZXl3b3Jkcy5cbiAgICAgICAgKyAnYWJzIGFjb3MgYWNvc2ggYWxsIGFueSBhbnlOQSBBcmcgYXMuY2FsbCBhcy5jaGFyYWN0ZXIgJ1xuICAgICAgICArICdhcy5jb21wbGV4IGFzLmRvdWJsZSBhcy5lbnZpcm9ubWVudCBhcy5pbnRlZ2VyIGFzLmxvZ2ljYWwgJ1xuICAgICAgICArICdhcy5udWxsLmRlZmF1bHQgYXMubnVtZXJpYyBhcy5yYXcgYXNpbiBhc2luaCBhdGFuIGF0YW5oIGF0dHIgJ1xuICAgICAgICArICdhdHRyaWJ1dGVzIGJhc2VlbnYgYnJvd3NlciBjIGNhbGwgY2VpbGluZyBjbGFzcyBDb25qIGNvcyBjb3NoICdcbiAgICAgICAgKyAnY29zcGkgY3VtbWF4IGN1bW1pbiBjdW1wcm9kIGN1bXN1bSBkaWdhbW1hIGRpbSBkaW1uYW1lcyAnXG4gICAgICAgICsgJ2VtcHR5ZW52IGV4cCBleHByZXNzaW9uIGZsb29yIGZvcmNlQW5kQ2FsbCBnYW1tYSBnYy50aW1lICdcbiAgICAgICAgKyAnZ2xvYmFsZW52IEltIGludGVyYWN0aXZlIGludmlzaWJsZSBpcy5hcnJheSBpcy5hdG9taWMgaXMuY2FsbCAnXG4gICAgICAgICsgJ2lzLmNoYXJhY3RlciBpcy5jb21wbGV4IGlzLmRvdWJsZSBpcy5lbnZpcm9ubWVudCBpcy5leHByZXNzaW9uICdcbiAgICAgICAgKyAnaXMuZmluaXRlIGlzLmZ1bmN0aW9uIGlzLmluZmluaXRlIGlzLmludGVnZXIgaXMubGFuZ3VhZ2UgJ1xuICAgICAgICArICdpcy5saXN0IGlzLmxvZ2ljYWwgaXMubWF0cml4IGlzLm5hIGlzLm5hbWUgaXMubmFuIGlzLm51bGwgJ1xuICAgICAgICArICdpcy5udW1lcmljIGlzLm9iamVjdCBpcy5wYWlybGlzdCBpcy5yYXcgaXMucmVjdXJzaXZlIGlzLnNpbmdsZSAnXG4gICAgICAgICsgJ2lzLnN5bWJvbCBsYXp5TG9hZERCZmV0Y2ggbGVuZ3RoIGxnYW1tYSBsaXN0IGxvZyBtYXggbWluICdcbiAgICAgICAgKyAnbWlzc2luZyBNb2QgbmFtZXMgbmFyZ3MgbnpjaGFyIG9sZENsYXNzIG9uLmV4aXQgcG9zLnRvLmVudiAnXG4gICAgICAgICsgJ3Byb2MudGltZSBwcm9kIHF1b3RlIHJhbmdlIFJlIHJlcCByZXRyYWNlbWVtIHJldHVybiByb3VuZCAnXG4gICAgICAgICsgJ3NlcV9hbG9uZyBzZXFfbGVuIHNlcS5pbnQgc2lnbiBzaWduaWYgc2luIHNpbmggc2lucGkgc3FydCAnXG4gICAgICAgICsgJ3N0YW5kYXJkR2VuZXJpYyBzdWJzdGl0dXRlIHN1bSBzd2l0Y2ggdGFuIHRhbmggdGFucGkgdHJhY2VtZW0gJ1xuICAgICAgICArICd0cmlnYW1tYSB0cnVuYyB1bmNsYXNzIHVudHJhY2VtZW0gVXNlTWV0aG9kIHh0ZnJtJyxcbiAgICB9LFxuXG4gICAgY29udGFpbnM6IFtcbiAgICAgIC8vIFJveHlnZW4gY29tbWVudHNcbiAgICAgIGhsanMuQ09NTUVOVChcbiAgICAgICAgLyMnLyxcbiAgICAgICAgLyQvLFxuICAgICAgICB7IGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gSGFuZGxlIGBAZXhhbXBsZXNgIHNlcGFyYXRlbHkgdG8gY2F1c2UgYWxsIHN1YnNlcXVlbnQgY29kZVxuICAgICAgICAgICAgLy8gdW50aWwgdGhlIG5leHQgYEBgLXRhZyBvbiBpdHMgb3duIGxpbmUgdG8gYmUga2VwdCBhcy1pcyxcbiAgICAgICAgICAgIC8vIHByZXZlbnRpbmcgaGlnaGxpZ2h0aW5nLiBUaGlzIGNvZGUgaXMgZXhhbXBsZSBSIGNvZGUsIHNvIG5lc3RlZFxuICAgICAgICAgICAgLy8gZG9jdGFncyBzaG91bGRu4oCZdCBiZSB0cmVhdGVkIGFzIHN1Y2guIFNlZVxuICAgICAgICAgICAgLy8gYHRlc3QvbWFya3VwL3Ivcm94eWdlbi50eHRgIGZvciBhbiBleGFtcGxlLlxuICAgICAgICAgICAgc2NvcGU6ICdkb2N0YWcnLFxuICAgICAgICAgICAgbWF0Y2g6IC9AZXhhbXBsZXMvLFxuICAgICAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgICAgIGVuZDogcmVnZXgubG9va2FoZWFkKHJlZ2V4LmVpdGhlcihcbiAgICAgICAgICAgICAgICAvLyBlbmQgaWYgYW5vdGhlciBkb2MgY29tbWVudFxuICAgICAgICAgICAgICAgIC9cXG5eIydcXHMqKD89QFthLXpBLVpdKykvLFxuICAgICAgICAgICAgICAgIC8vIG9yIGEgbGluZSB3aXRoIG5vIGNvbW1lbnRcbiAgICAgICAgICAgICAgICAvXFxuXig/ISMnKS9cbiAgICAgICAgICAgICAgKSksXG4gICAgICAgICAgICAgIGVuZHNQYXJlbnQ6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vIEhhbmRsZSBgQHBhcmFtYCB0byBoaWdobGlnaHQgdGhlIHBhcmFtZXRlciBuYW1lIGZvbGxvd2luZ1xuICAgICAgICAgICAgLy8gYWZ0ZXIuXG4gICAgICAgICAgICBzY29wZTogJ2RvY3RhZycsXG4gICAgICAgICAgICBiZWdpbjogJ0BwYXJhbScsXG4gICAgICAgICAgICBlbmQ6IC8kLyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzY29wZTogJ3ZhcmlhYmxlJyxcbiAgICAgICAgICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgICAgICAgICAgeyBtYXRjaDogSURFTlRfUkUgfSxcbiAgICAgICAgICAgICAgICAgIHsgbWF0Y2g6IC9gKD86XFxcXC58W15gXFxcXF0pK2AvIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGVuZHNQYXJlbnQ6IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2NvcGU6ICdkb2N0YWcnLFxuICAgICAgICAgICAgbWF0Y2g6IC9AW2EtekEtWl0rL1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2NvcGU6ICdrZXl3b3JkJyxcbiAgICAgICAgICAgIG1hdGNoOiAvXFxcXFthLXpBLVpdKy9cbiAgICAgICAgICB9XG4gICAgICAgIF0gfVxuICAgICAgKSxcblxuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcblxuICAgICAge1xuICAgICAgICBzY29wZTogJ3N0cmluZycsXG4gICAgICAgIGNvbnRhaW5zOiBbIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSBdLFxuICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgIGhsanMuRU5EX1NBTUVfQVNfQkVHSU4oe1xuICAgICAgICAgICAgYmVnaW46IC9bclJdXCIoLSopXFwoLyxcbiAgICAgICAgICAgIGVuZDogL1xcKSgtKilcIi9cbiAgICAgICAgICB9KSxcbiAgICAgICAgICBobGpzLkVORF9TQU1FX0FTX0JFR0lOKHtcbiAgICAgICAgICAgIGJlZ2luOiAvW3JSXVwiKC0qKVxcey8sXG4gICAgICAgICAgICBlbmQ6IC9cXH0oLSopXCIvXG4gICAgICAgICAgfSksXG4gICAgICAgICAgaGxqcy5FTkRfU0FNRV9BU19CRUdJTih7XG4gICAgICAgICAgICBiZWdpbjogL1tyUl1cIigtKilcXFsvLFxuICAgICAgICAgICAgZW5kOiAvXFxdKC0qKVwiL1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIGhsanMuRU5EX1NBTUVfQVNfQkVHSU4oe1xuICAgICAgICAgICAgYmVnaW46IC9bclJdJygtKilcXCgvLFxuICAgICAgICAgICAgZW5kOiAvXFwpKC0qKScvXG4gICAgICAgICAgfSksXG4gICAgICAgICAgaGxqcy5FTkRfU0FNRV9BU19CRUdJTih7XG4gICAgICAgICAgICBiZWdpbjogL1tyUl0nKC0qKVxcey8sXG4gICAgICAgICAgICBlbmQ6IC9cXH0oLSopJy9cbiAgICAgICAgICB9KSxcbiAgICAgICAgICBobGpzLkVORF9TQU1FX0FTX0JFR0lOKHtcbiAgICAgICAgICAgIGJlZ2luOiAvW3JSXScoLSopXFxbLyxcbiAgICAgICAgICAgIGVuZDogL1xcXSgtKiknL1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAnXCInLFxuICAgICAgICAgICAgZW5kOiAnXCInLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogXCInXCIsXG4gICAgICAgICAgICBlbmQ6IFwiJ1wiLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgfSxcblxuICAgICAgLy8gTWF0Y2hpbmcgbnVtYmVycyBpbW1lZGlhdGVseSBmb2xsb3dpbmcgcHVuY3R1YXRpb24gYW5kIG9wZXJhdG9ycyBpc1xuICAgICAgLy8gdHJpY2t5IHNpbmNlIHdlIG5lZWQgdG8gbG9vayBhdCB0aGUgY2hhcmFjdGVyIGFoZWFkIG9mIGEgbnVtYmVyIHRvXG4gICAgICAvLyBlbnN1cmUgdGhlIG51bWJlciBpcyBub3QgcGFydCBvZiBhbiBpZGVudGlmaWVyLCBhbmQgd2UgY2Fubm90IHVzZVxuICAgICAgLy8gbmVnYXRpdmUgbG9vay1iZWhpbmQgYXNzZXJ0aW9ucy4gU28gaW5zdGVhZCB3ZSBleHBsaWNpdGx5IGhhbmRsZSBhbGxcbiAgICAgIC8vIHBvc3NpYmxlIGNvbWJpbmF0aW9ucyBvZiAob3BlcmF0b3J8cHVuY3R1YXRpb24pLCBudW1iZXIuXG4gICAgICAvLyBUT0RPOiByZXBsYWNlIHdpdGggbmVnYXRpdmUgbG9vay1iZWhpbmQgd2hlbiBhdmFpbGFibGVcbiAgICAgIC8vIHsgYmVnaW46IC8oPzwhW2EtekEtWjAtOS5fXSkwW3hYXVswLTlhLWZBLUZdK1xcLlswLTlhLWZBLUZdKltwUF1bKy1dP1xcZCtpPy8gfSxcbiAgICAgIC8vIHsgYmVnaW46IC8oPzwhW2EtekEtWjAtOS5fXSkwW3hYXVswLTlhLWZBLUZdKyhbcFBdWystXT9cXGQrKT9bTGldPy8gfSxcbiAgICAgIC8vIHsgYmVnaW46IC8oPzwhW2EtekEtWjAtOS5fXSkoXFxkKyhcXC5cXGQqKT98XFwuXFxkKykoW2VFXVsrLV0/XFxkKyk/W0xpXT8vIH1cbiAgICAgIHtcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgIDE6ICdvcGVyYXRvcicsXG4gICAgICAgICAgICAgIDI6ICdudW1iZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF0Y2g6IFtcbiAgICAgICAgICAgICAgT1BFUkFUT1JTX1JFLFxuICAgICAgICAgICAgICBOVU1CRVJfVFlQRVNfUkVcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgIDE6ICdvcGVyYXRvcicsXG4gICAgICAgICAgICAgIDI6ICdudW1iZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF0Y2g6IFtcbiAgICAgICAgICAgICAgLyVbXiVdKiUvLFxuICAgICAgICAgICAgICBOVU1CRVJfVFlQRVNfUkVcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgIDE6ICdwdW5jdHVhdGlvbicsXG4gICAgICAgICAgICAgIDI6ICdudW1iZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF0Y2g6IFtcbiAgICAgICAgICAgICAgUFVOQ1RVQVRJT05fUkUsXG4gICAgICAgICAgICAgIE5VTUJFUl9UWVBFU19SRVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2NvcGU6IHsgMjogJ251bWJlcicgfSxcbiAgICAgICAgICAgIG1hdGNoOiBbXG4gICAgICAgICAgICAgIC9bXmEtekEtWjAtOS5fXXxeLywgLy8gbm90IHBhcnQgb2YgYW4gaWRlbnRpZmllciwgb3Igc3RhcnQgb2YgZG9jdW1lbnRcbiAgICAgICAgICAgICAgTlVNQkVSX1RZUEVTX1JFXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuXG4gICAgICAvLyBPcGVyYXRvcnMvcHVuY3R1YXRpb24gd2hlbiB0aGV5J3JlIG5vdCBkaXJlY3RseSBmb2xsb3dlZCBieSBudW1iZXJzXG4gICAgICB7XG4gICAgICAgIC8vIFJlbGV2YW5jZSBib29zdCBmb3IgdGhlIG1vc3QgY29tbW9uIGFzc2lnbm1lbnQgZm9ybS5cbiAgICAgICAgc2NvcGU6IHsgMzogJ29wZXJhdG9yJyB9LFxuICAgICAgICBtYXRjaDogW1xuICAgICAgICAgIElERU5UX1JFLFxuICAgICAgICAgIC9cXHMrLyxcbiAgICAgICAgICAvPC0vLFxuICAgICAgICAgIC9cXHMrL1xuICAgICAgICBdXG4gICAgICB9LFxuXG4gICAgICB7XG4gICAgICAgIHNjb3BlOiAnb3BlcmF0b3InLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyBtYXRjaDogT1BFUkFUT1JTX1JFIH0sXG4gICAgICAgICAgeyBtYXRjaDogLyVbXiVdKiUvIH1cbiAgICAgICAgXVxuICAgICAgfSxcblxuICAgICAge1xuICAgICAgICBzY29wZTogJ3B1bmN0dWF0aW9uJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBtYXRjaDogUFVOQ1RVQVRJT05fUkVcbiAgICAgIH0sXG5cbiAgICAgIHtcbiAgICAgICAgLy8gRXNjYXBlZCBpZGVudGlmaWVyXG4gICAgICAgIGJlZ2luOiAnYCcsXG4gICAgICAgIGVuZDogJ2AnLFxuICAgICAgICBjb250YWluczogWyB7IGJlZ2luOiAvXFxcXC4vIH0gXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZXhwb3J0IHsgciBhcyBkZWZhdWx0IH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwic2hpbnlcIjtcbmltcG9ydCBcIi4vY29weS5qc1wiO1xuaW1wb3J0IFwiLi9obC5qc1wiO1xuaW1wb3J0IFwiLi9zaGlueS5qc1wiO1xuaW1wb3J0IFwiLi9zdGFjay10aXRsZS5qc1wiO1xuaW1wb3J0IFwiLi90b29sdGlwcy5qc1wiO1xuaW1wb3J0IFwiLi9sb2NrLmpzXCI7XG5pbXBvcnQgeyBpc0xvY2tlZCB9IGZyb20gXCIuL2xvY2suanNcIjtcblxuZXhwb3J0IHsgaXNMb2NrZWQgfTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==