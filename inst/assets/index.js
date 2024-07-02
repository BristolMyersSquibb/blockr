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

    const addStack = $(event.target).closest(".stack").find(".stack-add-block");

    if (!editable) {
      addStack.addClass("d-none");
    } else {
      addStack.removeClass("d-none");
    }

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

/***/ "./srcjs/registry/description.js":
/*!***************************************!*\
  !*** ./srcjs/registry/description.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   description: () => (/* binding */ description)
/* harmony export */ });
const defaultIcon = `<i class="fas fa-cube"></i>`;

const description = () => {
  $(".add-block").off("mouseenter");
  $(".add-block").off("mouseleave");

  let timeoutLeave;
  $(".add-block").on("mouseenter", (e) => {
    clearTimeout(timeoutLeave);
    const $el = $(e.currentTarget);

    $el
      .closest(".blockr-registry")
      .find(".blockr-description")
      .html(
        `<p class="p-0">
        ${$el.data("icon") || defaultIcon}
        <strong>${$el.data("name") || ""}</strong><br/>
        <small>${$el.data("description") || ""}</small></p>`,
      );

    highlight($el.closest(".blockr-registry").find(".blockr-description"));
  });

  $(".add-block").on("mouseleave", (e) => {
    const el = $(e.currentTarget)
      .closest(".blockr-registry")
      .find(".blockr-description");
    clearTimeout(timeoutLeave);

    timeoutLeave = setTimeout(() => {
      downlight(el);
      $(el).text("");
    }, 250);
  });
};

const highlight = (el) => {
  $(el).addClass("rounded border border-dark-subtle p-1 my-1");
};

const downlight = (el) => {
  $(el).removeClass("rounded border border-dark-subtle p-1 my-1");
};


/***/ }),

/***/ "./srcjs/registry/fetch.js":
/*!*********************************!*\
  !*** ./srcjs/registry/fetch.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchFactory: () => (/* binding */ fetchFactory)
/* harmony export */ });
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage */ "./srcjs/registry/storage.js");

// this is so we only ping the hash once per session
// this should be switched off soon when we have a reactive registry
let pinged_hash = false;

const fetchFactory = (params) => {
  async function fetchHash() {
    if (pinged_hash) {
      return new Promise((resolve) => resolve((0,_storage__WEBPACK_IMPORTED_MODULE_0__.getHash)()));
    }

    return fetch(params.hash)
      .then((response) => response.json())
      .then((data) => {
        pinged_hash = true;
        return data.hash;
      });
  }

  async function fetchRegistry() {
    return fetch(params.registry)
      .then((response) => response.json())
      .then((data) => {
        (0,_storage__WEBPACK_IMPORTED_MODULE_0__.setRegistry)(data.registry);
        (0,_storage__WEBPACK_IMPORTED_MODULE_0__.setHash)(data.hash);
        return data.registry;
      });
  }

  async function fetchLeast() {
    return fetchHash().then((hash) => {
      if ((0,_storage__WEBPACK_IMPORTED_MODULE_0__.getHash)() === hash) {
        return new Promise((resolve) => resolve((0,_storage__WEBPACK_IMPORTED_MODULE_0__.getRegistry)()));
      }

      return fetchRegistry();
    });
  }

  return {
    fetchHash: fetchHash,
    fetchRegistry: fetchRegistry,
    fetchLeast: fetchLeast,
  };
};


/***/ }),

/***/ "./srcjs/registry/index.js":
/*!*********************************!*\
  !*** ./srcjs/registry/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _description__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./description */ "./srcjs/registry/description.js");
/* harmony import */ var _scroll__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scroll */ "./srcjs/registry/scroll.js");
/* harmony import */ var _fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fetch */ "./srcjs/registry/fetch.js");
/* harmony import */ var _search__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./search */ "./srcjs/registry/search.js");
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./render */ "./srcjs/registry/render.js");






$(() => {
  (0,_render__WEBPACK_IMPORTED_MODULE_4__.handleClick)();
  window.Shiny.addCustomMessageHandler("blockr-registry-endpoints", (msg) => {
    const endpoints = (0,_fetch__WEBPACK_IMPORTED_MODULE_2__.fetchFactory)(msg);
    setTimeout(() => {
      (0,_scroll__WEBPACK_IMPORTED_MODULE_1__.bindScroll)(msg, endpoints);
      (0,_search__WEBPACK_IMPORTED_MODULE_3__.handleSearch)(msg, endpoints);
      (0,_description__WEBPACK_IMPORTED_MODULE_0__.description)();
    }, msg.delay);
  });
});


/***/ }),

/***/ "./srcjs/registry/render.js":
/*!**********************************!*\
  !*** ./srcjs/registry/render.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleClick: () => (/* binding */ handleClick),
/* harmony export */   renderPills: () => (/* binding */ renderPills)
/* harmony export */ });
/* harmony import */ var _description__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./description */ "./srcjs/registry/description.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./srcjs/utils.js");



const createPills = (blocks, all) => {
  let pills = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    let previous_block_index = 0;
    all.map((d, index) => {
      if (d.name !== block.name) return;
      previous_block_index = index - 1;
    });
    const previous_block = all[previous_block_index];

    if (!previous_block) {
      pills += `<h3>${(0,_utils__WEBPACK_IMPORTED_MODULE_1__.capitalise)(blockType(block))}</h3>`;
    }

    if (previous_block && blockType(block) !== blockType(previous_block)) {
      pills += `<h3 class='mt-3'>${(0,_utils__WEBPACK_IMPORTED_MODULE_1__.capitalise)(blockType(block))}</h3>`;
    }

    pills += createPill(block);
  }
  return pills;
};

const createPill = (block) => {
  const name = block.name.replace("block$", "");
  return `<p class="cursor-pointer mb-1 badge add-block bg-${blockColor(
    block,
  )} me-1"
    data-icon='${block.icon}'
    data-index="${block.index}"
    data-name="${block.name}"
    data-description="${block.description}"
    draggable="true">
    ${name.replace("block$", "")}
  </p>`;
};

const renderPills = (params, data, all) => {
  if (data.length === 0) {
    $(`#${params.ns}-scrollable-child`).html(
      "<p class='text-muted'>No blocks found</p>",
    );
    return;
  }

  const pills = createPills(data, all);
  $(`#${params.ns}-scrollable-child`).append(pills);
  (0,_description__WEBPACK_IMPORTED_MODULE_0__.description)();
};

const blockType = (block) => {
  if (block.classes.includes("parser_block")) return "parser";
  if (block.classes.includes("data_block")) return "data";
  if (block.classes.includes("transform_block")) return "transform";

  return "visualise";
};

const blockColor = (block) => {
  const type = blockType(block);

  if (type == "parser") return "info";
  if (type == "data") return "primary";
  if (type == "transform") return "secondary";

  return "info";
};

const handleClick = () => {
  $("body").on("click", ".add-block", (e) => {
    const ns = $(e.target).closest(".blockr-registry").attr("id").split("-");
    ns.pop();

    window.Shiny.setInputValue(
      `${ns.join("-")}-add`,
      parseInt($(e.target).data("index")),
      { priority: "event" },
    );

    const id = $(e.target).closest(".offcanvas").offcanvas("hide").attr("id");
    window.bootstrap.Offcanvas.getOrCreateInstance(`#${id}`).hide();
  });
};


/***/ }),

/***/ "./srcjs/registry/scroll.js":
/*!**********************************!*\
  !*** ./srcjs/registry/scroll.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindScroll: () => (/* binding */ bindScroll),
/* harmony export */   unbindScroll: () => (/* binding */ unbindScroll)
/* harmony export */ });
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render */ "./srcjs/registry/render.js");


const BATCH = 20;

const unbindScroll = (params) => {
  $(`#${params.ns}-scrollable`).off("scroll");
};

const bindScroll = (params, endpoints) => {
  fetchUntilScrollable(params, endpoints);

  unbindScroll(params);

  $(`#${params.ns}-scrollable`).on("scroll", () => {
    unbindScroll(params);
    const n = getNBlocks(params.ns);
    endpoints.fetchLeast().then((data) => {
      let to = n + BATCH;
      if (to > data.length) to = data.length;
      if (n == to) return;

      (0,_render__WEBPACK_IMPORTED_MODULE_0__.renderPills)(params, data.slice(n, to), data);
      bindScroll(params, endpoints);
    });
  });
};

async function fetchUntilScrollable(params, endpoints) {
  const n = getNBlocks(params.ns);

  return endpoints.fetchLeast().then((data) => {
    if (!data.length) return;

    let to = n + BATCH;
    if (to > data.length) to = data.length;
    if (n == to) return;

    (0,_render__WEBPACK_IMPORTED_MODULE_0__.renderPills)(params, data.slice(n, to), data);
    if (
      $(`#${params.ns}-scrollable-child`).height() <=
      $(`#${params.ns}-scrollable`).height()
    ) {
      fetchUntilScrollable(params, endpoints);
    }
  });
}

const getNBlocks = (ns) => {
  return $(`#${ns}-scrollable`).find(".add-block").length;
};


/***/ }),

/***/ "./srcjs/registry/search.js":
/*!**********************************!*\
  !*** ./srcjs/registry/search.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleSearch: () => (/* binding */ handleSearch)
/* harmony export */ });
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render */ "./srcjs/registry/render.js");


const handleSearch = (params, endpoints) => {
  $(`#${params.ns}-query`).off("keyup");
  $(`#${params.ns}-query`).on("keyup", search(params, endpoints));
};

const search = (params, endpoints) => {
  let debounce;

  return (event) => {
    const query = $(event.target).val();

    clearTimeout(debounce);

    debounce = setTimeout(() => {
      $(event.target)
        .closest(".offcanvas-body")
        .find(".scrollable-child")
        .html("");

      if (query == "") {
        endpoints.fetchLeast().then((data) => {
          (0,_render__WEBPACK_IMPORTED_MODULE_0__.renderPills)(params, data, data);
        });
        return;
      }

      endpoints.fetchLeast().then((data) => {
        data = data.filter((block) => {
          return block.name.toLowerCase().includes(query.toLowerCase());
        });

        if (data.length > 100)
          window.Shiny.notifications.show({
            html: "Showing only the first 100 results.",
          });

        (0,_render__WEBPACK_IMPORTED_MODULE_0__.renderPills)(params, data.slice(0, 100), data);
      });
    }, 500);
  };
};


/***/ }),

/***/ "./srcjs/registry/storage.js":
/*!***********************************!*\
  !*** ./srcjs/registry/storage.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getHash: () => (/* binding */ getHash),
/* harmony export */   getRegistry: () => (/* binding */ getRegistry),
/* harmony export */   setHash: () => (/* binding */ setHash),
/* harmony export */   setRegistry: () => (/* binding */ setRegistry)
/* harmony export */ });
const HASH = "BLOCKR.HASH";
const REGISTRY = "BLOCKR.REGISTRY";

const setRegistry = (registry) => {
  if (registry === undefined) throw new Error("Registry is undefined");

  localStorage.setItem(REGISTRY, JSON.stringify(registry));
};

const setHash = (hash) => {
  if (hash === undefined) throw new Error("Hash is undefined");

  localStorage.setItem(HASH, hash);
};

const getRegistry = () => {
  return JSON.parse(localStorage.getItem(REGISTRY));
};

const getHash = () => {
  return localStorage.getItem(HASH);
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
window.Shiny.addCustomMessageHandler("validate-block", (_msg) => {});

window.Shiny.addCustomMessageHandler("validate-input", (_msg) => {});

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

/***/ "./srcjs/utils.js":
/*!************************!*\
  !*** ./srcjs/utils.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   capitalise: () => (/* binding */ capitalise)
/* harmony export */ });
const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);


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
/* harmony import */ var _registry_index_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./registry/index.js */ "./srcjs/registry/index.js");












})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOZTtBQUNJO0FBQ0Y7QUFDRztBQUNNO0FBQ0g7QUFDSjtBQUNVO0FBQ1E7O0FBRWpCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmxvY2tyL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9ibG9ja3IvLi9zcmNqcy9jb2xsYXBzZS5qcyIsIndlYnBhY2s6Ly9ibG9ja3IvLi9zcmNqcy9jb3B5LmpzIiwid2VicGFjazovL2Jsb2Nrci8uL3NyY2pzL2hsLmpzIiwid2VicGFjazovL2Jsb2Nrci8uL3NyY2pzL2xvYWRpbmcuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLy4vc3JjanMvbG9jay5qcyIsIndlYnBhY2s6Ly9ibG9ja3IvLi9zcmNqcy9yZWdpc3RyeS9kZXNjcmlwdGlvbi5qcyIsIndlYnBhY2s6Ly9ibG9ja3IvLi9zcmNqcy9yZWdpc3RyeS9mZXRjaC5qcyIsIndlYnBhY2s6Ly9ibG9ja3IvLi9zcmNqcy9yZWdpc3RyeS9pbmRleC5qcyIsIndlYnBhY2s6Ly9ibG9ja3IvLi9zcmNqcy9yZWdpc3RyeS9yZW5kZXIuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLy4vc3JjanMvcmVnaXN0cnkvc2Nyb2xsLmpzIiwid2VicGFjazovL2Jsb2Nrci8uL3NyY2pzL3JlZ2lzdHJ5L3NlYXJjaC5qcyIsIndlYnBhY2s6Ly9ibG9ja3IvLi9zcmNqcy9yZWdpc3RyeS9zdG9yYWdlLmpzIiwid2VicGFjazovL2Jsb2Nrci8uL3NyY2pzL3NoaW55LmpzIiwid2VicGFjazovL2Jsb2Nrci8uL3NyY2pzL3N0YWNrLXRpdGxlLmpzIiwid2VicGFjazovL2Jsb2Nrci8uL3NyY2pzL3Rvb2x0aXBzLmpzIiwid2VicGFjazovL2Jsb2Nrci8uL3NyY2pzL3V0aWxzLmpzIiwid2VicGFjazovL2Jsb2Nrci9leHRlcm5hbCB1bWQgXCJTaGlueVwiIiwid2VicGFjazovL2Jsb2Nrci8uL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvbGliL2NvcmUuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLy4vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9lcy9jb3JlLmpzIiwid2VicGFjazovL2Jsb2Nrci8uL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZXMvbGFuZ3VhZ2VzL3IuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Jsb2Nrci93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9ibG9ja3Ivd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Jsb2Nrci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Jsb2Nrci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Jsb2Nrci8uL3NyY2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcIlNoaW55XCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcIlNoaW55XCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImJsb2NrclwiXSA9IGZhY3RvcnkocmVxdWlyZShcIlNoaW55XCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJibG9ja3JcIl0gPSBmYWN0b3J5KHJvb3RbXCJTaGlueVwiXSk7XG59KShzZWxmLCAoX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9zaGlueV9fKSA9PiB7XG5yZXR1cm4gIiwiJCgoKSA9PiB7XG4gIGVkaXRvcigpO1xuICB0b2dnbGVPdXRwdXRJbnB1dCgpO1xuICBoYW5kbGVJY29ucygpO1xufSk7XG5cbi8vIGhhbmRsZXMgaWNvbnMgY29sbGFwc2Ugc3RhdGVcbmV4cG9ydCBjb25zdCBoYW5kbGVJY29ucyA9ICgpID0+IHtcbiAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5zdGFjay1lZGl0LXRvZ2dsZVwiLCAoZXZlbnQpID0+IHtcbiAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpXG4gICAgICAuZmluZChcImlcIilcbiAgICAgIC50b2dnbGVDbGFzcyhcImZhLWNoZXZyb24tdXAgZmEtY2hldnJvbi1kb3duXCIpO1xuICB9KTtcblxuICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLmJsb2NrLW91dHB1dC10b2dnbGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgJChldmVudC5jdXJyZW50VGFyZ2V0KVxuICAgICAgLmZpbmQoXCJpXCIpXG4gICAgICAudG9nZ2xlQ2xhc3MoXCJmYS1jaGV2cm9uLXVwIGZhLWNoZXZyb24tZG93blwiKTtcbiAgfSk7XG59O1xuXG4vLyBoYW5kbGVzIHRoZSB0b2dnbGluZyBvZiBpbnB1dCBhbmQgb3V0cHV0XG5jb25zdCB0b2dnbGVPdXRwdXRJbnB1dCA9ICgpID0+IHtcbiAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5ibG9jay1vdXRwdXQtdG9nZ2xlXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0ICRibG9jayA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KFwiLmJsb2NrXCIpO1xuXG4gICAgY29uc3QgaW5wdXRWaXNpYmxlID0gJGJsb2NrLmZpbmQoXCIuYmxvY2staW5wdXRzXCIpLmlzKFwiOnZpc2libGVcIik7XG5cbiAgICBsZXQgdG9nZ2xlID0gaW5wdXRWaXNpYmxlO1xuXG4gICAgaWYgKHRvZ2dsZSkge1xuICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2staW5wdXRzXCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stb3V0cHV0XCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkYmxvY2suZmluZChcIi5ibG9jay1pbnB1dHNcIikucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgICAkYmxvY2suZmluZChcIi5ibG9jay1vdXRwdXRcIikucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgfVxuXG4gICAgbGV0IGV2ID0gXCJzaG93blwiO1xuICAgIGlmICgkYmxvY2suZmluZChcIi5ibG9jay1vdXRwdXRcIikuaGFzQ2xhc3MoXCJkLW5vbmVcIikpIHtcbiAgICAgIGV2ID0gXCJoaWRkZW5cIjtcbiAgICB9XG5cbiAgICAkYmxvY2suZmluZChcIi5ibG9jay1pbnB1dHNcIikudHJpZ2dlcihldik7XG4gICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stb3V0cHV0XCIpLnRyaWdnZXIoZXYpO1xuICB9KTtcbn07XG5cbi8vIGhhbmRsZXMgdGhlIHRvZ2dsaW5nIG9mIGVkaXRpbmcgbW9kZSBvbiBzdGFja3NcbmNvbnN0IGVkaXRvciA9ICgpID0+IHtcbiAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5zdGFjay1lZGl0LXRvZ2dsZVwiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCAkc3RhY2sgPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdChcIi5zdGFja1wiKTtcbiAgICBjb25zdCAkYmxvY2tzID0gJHN0YWNrLmZpbmQoXCIuYmxvY2tcIik7XG5cbiAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnRvZ2dsZUNsYXNzKFwiZWRpdGFibGVcIik7XG4gICAgY29uc3QgZWRpdGFibGUgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmhhc0NsYXNzKFwiZWRpdGFibGVcIik7XG5cbiAgICBjb25zdCBhZGRTdGFjayA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KFwiLnN0YWNrXCIpLmZpbmQoXCIuc3RhY2stYWRkLWJsb2NrXCIpO1xuXG4gICAgaWYgKCFlZGl0YWJsZSkge1xuICAgICAgYWRkU3RhY2suYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZFN0YWNrLnJlbW92ZUNsYXNzKFwiZC1ub25lXCIpO1xuICAgIH1cblxuICAgICRibG9ja3MuZWFjaCgoaW5kZXgsIGJsb2NrKSA9PiB7XG4gICAgICBjb25zdCAkYmxvY2sgPSAkKGJsb2NrKTtcblxuICAgICAgaWYgKGVkaXRhYmxlKSB7XG4gICAgICAgICRibG9jay5yZW1vdmVDbGFzcyhcImQtbm9uZVwiKTtcbiAgICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stdGl0bGVcIikucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG5cbiAgICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stZG93bmxvYWRcIikucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgICAgICRibG9jay5maW5kKFwiLmJsb2NrLWNvZGUtdG9nZ2xlXCIpLnJlbW92ZUNsYXNzKFwiZC1ub25lXCIpO1xuICAgICAgICAkYmxvY2suZmluZChcIi5ibG9jay1vdXRwdXQtdG9nZ2xlXCIpLnJlbW92ZUNsYXNzKFwiZC1ub25lXCIpO1xuXG4gICAgICAgIGlmIChpbmRleCA9PSAkYmxvY2tzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAkYmxvY2suZmluZChcIi5ibG9jay1vdXRwdXRcIikuYWRkQ2xhc3MoXCJzaG93XCIpO1xuICAgICAgICAgICRibG9jay5maW5kKFwiLmJsb2NrLW91dHB1dFwiKS5yZW1vdmVDbGFzcyhcImQtbm9uZVwiKTtcbiAgICAgICAgICAkYmxvY2suZmluZChcIi5ibG9jay1vdXRwdXRcIikudHJpZ2dlcihcInNob3duXCIpO1xuXG4gICAgICAgICAgY29uc3QgY29kZSA9IHdpbmRvdy5ib290c3RyYXAuQ29sbGFwc2UuZ2V0T3JDcmVhdGVJbnN0YW5jZShcbiAgICAgICAgICAgICRibG9jay5maW5kKFwiLmJsb2NrLWNvZGVcIilbMF0sXG4gICAgICAgICAgICB7IHRvZ2dsZTogZmFsc2UgfSxcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvZGUuaGlkZSgpO1xuXG4gICAgICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2staW5wdXRzXCIpLnJlbW92ZUNsYXNzKFwiZC1ub25lXCIpO1xuICAgICAgICAgICRibG9jay5maW5kKFwiLmJsb2NrLWlucHV0c1wiKS50cmlnZ2VyKFwic2hvd25cIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stbG9hZGluZ1wiKS5hZGRDbGFzcyhcImQtbm9uZVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAkYmxvY2suZmluZChcIi5ibG9jay1kb3dubG9hZFwiKS5hZGRDbGFzcyhcImQtbm9uZVwiKTtcbiAgICAgICRibG9jay5maW5kKFwiLmJsb2NrLWNvZGUtdG9nZ2xlXCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stb3V0cHV0LXRvZ2dsZVwiKS5hZGRDbGFzcyhcImQtbm9uZVwiKTtcbiAgICAgICRibG9jay5maW5kKFwiLmJsb2NrLW91dHB1dC10b2dnbGVcIikuZmluZChcImlcIikuYWRkQ2xhc3MoXCJmYS1jaGV2cm9uLXVwXCIpO1xuICAgICAgJGJsb2NrXG4gICAgICAgIC5maW5kKFwiLmJsb2NrLW91dHB1dC10b2dnbGVcIilcbiAgICAgICAgLmZpbmQoXCJpXCIpXG4gICAgICAgIC5yZW1vdmVDbGFzcyhcImZhLWNoZXZyb24tZG93blwiKTtcblxuICAgICAgJGJsb2NrLmZpbmQoXCIuYmxvY2stdGl0bGVcIikuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgICBpZiAoaW5kZXggPT0gJGJsb2Nrcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICRibG9jay5yZW1vdmVDbGFzcyhcImQtbm9uZVwiKTtcblxuICAgICAgICAkYmxvY2suZmluZChcIi5ibG9jay1vdXRwdXRcIikuYWRkQ2xhc3MoXCJzaG93XCIpO1xuICAgICAgICAkYmxvY2suZmluZChcIi5ibG9jay1vdXRwdXRcIikucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgICAgICRibG9jay5maW5kKFwiLmJsb2NrLW91dHB1dFwiKS50cmlnZ2VyKFwic2hvd25cIik7XG5cbiAgICAgICAgY29uc3QgY29kZSA9IHdpbmRvdy5ib290c3RyYXAuQ29sbGFwc2UuZ2V0T3JDcmVhdGVJbnN0YW5jZShcbiAgICAgICAgICAkYmxvY2suZmluZChcIi5ibG9jay1jb2RlXCIpWzBdLFxuICAgICAgICAgIHsgdG9nZ2xlOiBmYWxzZSB9LFxuICAgICAgICApO1xuICAgICAgICBjb2RlLmhpZGUoKTtcblxuICAgICAgICAkYmxvY2suZmluZChcIi5ibG9jay1pbnB1dHNcIikuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgICAgICRibG9jay5maW5kKFwiLmJsb2NrLWlucHV0c1wiKS50cmlnZ2VyKFwiaGlkZGVuXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgICRibG9jay5hZGRDbGFzcyhcImQtbm9uZVwiKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2hvd0xhc3RPdXRwdXQgPSAoZWwpID0+IHtcbiAgY29uc3QgJGJsb2NrID0gJChlbCkuZmluZChcIi5ibG9ja1wiKS5sYXN0KCk7XG5cbiAgY29uc3QgJGxhc3RPdXRwdXQgPSAkYmxvY2suZmluZChcIi5ibG9jay1vdXRwdXRcIik7XG4gIGNvbnN0ICRsYXN0VGl0bGUgPSAkYmxvY2suZmluZChcIi5ibG9jay10aXRsZVwiKTtcbiAgY29uc3QgJGxhc3RJbnB1dHMgPSAkYmxvY2suZmluZChcIi5ibG9jay1pbnB1dHNcIik7XG5cbiAgJGxhc3RUaXRsZS5hZGRDbGFzcyhcImQtbm9uZVwiKTtcbiAgJGxhc3RJbnB1dHMuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG5cbiAgLy8gaGlkZSB0b2dnbGVyc1xuICAkYmxvY2suZmluZChcIi5ibG9jay1kb3dubG9hZFwiKS5hZGRDbGFzcyhcImQtbm9uZVwiKTtcbiAgJGJsb2NrLmZpbmQoXCIuYmxvY2stY29kZS10b2dnbGVcIikuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICRibG9jay5maW5kKFwiLmJsb2NrLW91dHB1dC10b2dnbGVcIikuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG5cbiAgLy8gd2UgaGF2ZSBhIGxvYWRpbmcgc3RhdGVcbiAgLy8gYmVjYXVzZSBzb21lIGJsb2NrIHZhbGlkYXRpb25zIGhhdmUgbm8gbGFzdCBvdXRwdXRcbiAgY29uc3QgdGFibGVJZCA9ICRsYXN0T3V0cHV0LmZpbmQoXCIuc2hpbnktYm91bmQtb3V0cHV0XCIpLmZpcnN0KCkuYXR0cihcImlkXCIpO1xuXG4gICQoZG9jdW1lbnQpLm9uKFwic2hpbnk6dmFsdWVcIiwgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50Lm5hbWUgIT09IHRhYmxlSWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkbGFzdE91dHB1dC5maW5kKFwiLmJsb2NrLWxvYWRpbmdcIikuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbGxhcHNlT3RoZXJCbG9ja3MgPSAoc3RhY2ssIGJsb2NrKSA9PiB7XG4gIGNvbnN0IGJ0bnMgPSAkKHN0YWNrKS5maW5kKFwiLmJsb2NrLW91dHB1dC10b2dnbGVcIik7XG5cbiAgJChidG5zKS5lYWNoKChfaW5kZXgsIGJ0bikgPT4ge1xuICAgIGlmICgkKGJ0bikuY2xvc2VzdChcIi5ibG9ja1wiKS5kYXRhKFwidmFsdWVcIikgPT0gYCR7YmxvY2t9LWJsb2NrYCkgcmV0dXJuO1xuXG4gICAgY29uc3QgaXNDb2xsYXBzZWQgPSAkKGJ0bikuZmluZChcImlcIikuaGFzQ2xhc3MoXCJmYS1jaGV2cm9uLWRvd25cIik7XG4gICAgaWYgKGlzQ29sbGFwc2VkKSByZXR1cm47XG5cbiAgICAkKGJ0bikudHJpZ2dlcihcImNsaWNrXCIpO1xuICB9KTtcbn07XG4iLCJjb25zdCBjb3B5VGV4dCA9ICh0eHQpID0+IHtcbiAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodHh0KTtcbn07XG5cbndpbmRvdy5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcImJsb2Nrci1jb3B5LWNvZGVcIiwgKG1zZykgPT4ge1xuICAvLyB0b2RvIG5vdGlmeSB1c2VyXG4gIGlmICghbXNnLmNvZGUpIHtcbiAgICB3aW5kb3cuU2hpbnkubm90aWZpY2F0aW9ucy5zaG93KHtcbiAgICAgIGh0bWw6IFwiPHNwYW4+RmFpbGVkIHRvIGNvcHkgY29kZSB0byBjbGlwYm9hcmQ8L3NwYW4+XCIsXG4gICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvcHlUZXh0KG1zZy5jb2RlLm1hcCgoY29kZSkgPT4gY29kZS50cmltKCkpLmpvaW4oXCJcXG5cXHRcIikpO1xuICB3aW5kb3cuU2hpbnkubm90aWZpY2F0aW9ucy5zaG93KHtcbiAgICBodG1sOiBcIjxzcGFuPkNvZGUgY29waWVkIHRvIGNsaXBib2FyZDwvc3Bhbj5cIixcbiAgICB0eXBlOiBcIm1lc3NhZ2VcIixcbiAgfSk7XG59KTtcbiIsImltcG9ydCBobGpzIGZyb20gXCJoaWdobGlnaHQuanMvbGliL2NvcmVcIjtcbmltcG9ydCByIGZyb20gXCJoaWdobGlnaHQuanMvbGliL2xhbmd1YWdlcy9yXCI7XG5cbmhsanMucmVnaXN0ZXJMYW5ndWFnZShcInJcIiwgcik7XG5cbiQoKCkgPT4ge1xuICAkKGRvY3VtZW50KS5vbihcInNoaW55OnZhbHVlXCIsIChlKSA9PiB7XG4gICAgaWYgKCFlLm5hbWUubWF0Y2goLy1jb2RlJC8pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJChgIyR7ZS5uYW1lfWApLmFkZENsYXNzKFwibGFuZ3VhZ2UtclwiKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGRlbGV0ZSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlLm5hbWUpLmRhdGFzZXQuaGlnaGxpZ2h0ZWQ7XG4gICAgICBobGpzLmhpZ2hsaWdodEVsZW1lbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZS5uYW1lKSk7XG4gICAgfSwgMjUwKTtcbiAgfSk7XG59KTtcbiIsImV4cG9ydCBjb25zdCBsb2FkaW5nID0gKHN0YWNrKSA9PiB7XG4gICQoZG9jdW1lbnQpLm9uKFwic2hpbnk6b3V0cHV0aW52YWxpZGF0ZWRcIiwgKGV2ZW50KSA9PiB7XG4gICAgaWYgKCFldmVudC5uYW1lLm1hdGNoKGBeJHtzdGFja31gKSkgcmV0dXJuO1xuICAgIGlmICghZXZlbnQubmFtZS5tYXRjaChcInJlcyR8cGxvdCRcIikpIHJldHVybjtcblxuICAgICQoYCMke2V2ZW50Lm5hbWV9YCkuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgJChgIyR7ZXZlbnQubmFtZX1gKVxuICAgICAgLmNsb3Nlc3QoXCIuYmxvY2tcIilcbiAgICAgIC5maW5kKFwiLmJsb2NrLWxvYWRpbmdcIilcbiAgICAgIC5yZW1vdmVDbGFzcyhcImQtbm9uZVwiKTtcbiAgfSk7XG5cbiAgJChkb2N1bWVudCkub24oXCJzaGlueTp2YWx1ZSBzaGlueTplcnJvclwiLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoIWV2ZW50Lm5hbWUubWF0Y2goYF4ke3N0YWNrfWApKSByZXR1cm47XG4gICAgaWYgKCFldmVudC5uYW1lLm1hdGNoKFwicmVzJHxwbG90JFwiKSkgcmV0dXJuO1xuXG4gICAgJChgIyR7ZXZlbnQubmFtZX1gKS5yZW1vdmVDbGFzcyhcImQtbm9uZVwiKTtcbiAgICAkKGAjJHtldmVudC5uYW1lfWApXG4gICAgICAuY2xvc2VzdChcIi5ibG9ja1wiKVxuICAgICAgLmZpbmQoXCIuYmxvY2stbG9hZGluZ1wiKVxuICAgICAgLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuICB9KTtcbn07XG4iLCJsZXQgbG9ja2VkID0gZmFsc2U7XG53aW5kb3cuU2hpbnkuYWRkQ3VzdG9tTWVzc2FnZUhhbmRsZXIoXCJsb2NrXCIsIChtc2cpID0+IHtcbiAgbG9ja2VkID0gbXNnLmxvY2tlZDtcbiAgaGFuZGxlTG9jaygpO1xuICBlbWl0RXZlbnQobXNnLmxvY2tlZCk7XG59KTtcblxuZXhwb3J0IGNvbnN0IGlzTG9ja2VkID0gKCkgPT4ge1xuICByZXR1cm4gbG9ja2VkO1xufTtcblxuY29uc3QgZW1pdEV2ZW50ID0gKGxvY2tlZCkgPT4ge1xuICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImJsb2Nrcjpsb2NrXCIsIHtcbiAgICBkZXRhaWw6IHtcbiAgICAgIGxvY2tlZDogbG9ja2VkLFxuICAgIH0sXG4gIH0pO1xuICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn07XG5cbmNvbnN0IGhhbmRsZUxvY2sgPSAoKSA9PiB7XG4gIGlmICghbG9ja2VkKSByZXR1cm47XG5cbiAgJChcIi5ibG9jay1jb2RlLXRvZ2dsZVwiKS5oaWRlKCk7XG4gICQoXCIuYmxvY2stb3V0cHV0LXRvZ2dsZVwiKS5oaWRlKCk7XG4gICQoXCIuc3RhY2stcmVtb3ZlXCIpLmhpZGUoKTtcbiAgJChcIi5zdGFjay1hZGQtYmxvY2tcIikuaGlkZSgpO1xuICAkKFwiLnN0YWNrLWVkaXQtdG9nZ2xlXCIpLmhpZGUoKTtcbiAgJChcIi5ibG9jay1yZW1vdmVcIikuaGlkZSgpO1xuXG4gICQoXCIuc3RhY2stdGl0bGVcIikub2ZmKCk7XG5cbiAgJChcIi5zdGFja1wiKS5lYWNoKChfaW5kZXgsIGVsKSA9PiB7XG4gICAgY29uc3QgJGVkaXRvciA9ICQoZWwpLmZpbmQoXCIuc3RhY2stZWRpdC10b2dnbGVcIik7XG4gICAgY29uc3QgaXNDbG9zZWQgPSAkZWRpdG9yLmZpbmQoXCJpXCIpLmhhc0NsYXNzKFwiZmEtY2hldnJvbi11cFwiKTtcblxuICAgIGlmIChpc0Nsb3NlZCkgcmV0dXJuO1xuXG4gICAgJGVkaXRvci50cmlnZ2VyKFwiY2xpY2tcIik7XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbmRlckxvY2tlZCA9IChzdGFjaywgc3RhdGUpID0+IHtcbiAgbG9ja2VkID0gc3RhdGU7XG4gIGlmICghbG9ja2VkKSByZXR1cm47XG5cbiAgbG9jayhzdGFjayk7XG59O1xuXG5jb25zdCBsb2NrID0gKHN0YWNrKSA9PiB7XG4gIGlmICghbG9ja2VkKSByZXR1cm47XG4gIGxldCAkc3RhY2sgPSAkKHN0YWNrKTtcblxuICAkc3RhY2suZmluZChcIi5ibG9jay1jb2RlLXRvZ2dsZVwiKS5oaWRlKCk7XG4gICRzdGFjay5maW5kKFwiLmJsb2NrLW91dHB1dC10b2dnbGVcIikuaGlkZSgpO1xuICAkc3RhY2suZmluZChcIi5zdGFjay1yZW1vdmVcIikuaGlkZSgpO1xuICAkc3RhY2suZmluZChcIi5zdGFjay1hZGQtYmxvY2tcIikuaGlkZSgpO1xuICAkc3RhY2suZmluZChcIi5zdGFjay1lZGl0LXRvZ2dsZVwiKS5oaWRlKCk7XG4gICRzdGFjay5maW5kKFwiLmJsb2NrLXJlbW92ZVwiKS5oaWRlKCk7XG4gICRzdGFjay5maW5kKFwiLnN0YWNrLXRpdGxlXCIpLm9mZigpO1xuXG4gIGNvbnN0ICRlZGl0b3IgPSAkc3RhY2suZmluZChcIi5zdGFjay1lZGl0LXRvZ2dsZVwiKTtcbiAgY29uc3QgaXNDbG9zZWQgPSAkZWRpdG9yLmZpbmQoXCJpXCIpLmhhc0NsYXNzKFwiZmEtY2hldnJvbi11cFwiKTtcblxuICBpZiAoaXNDbG9zZWQpIHJldHVybjtcblxuICAkZWRpdG9yLnRyaWdnZXIoXCJjbGlja1wiKTtcbn07XG4iLCJjb25zdCBkZWZhdWx0SWNvbiA9IGA8aSBjbGFzcz1cImZhcyBmYS1jdWJlXCI+PC9pPmA7XG5cbmV4cG9ydCBjb25zdCBkZXNjcmlwdGlvbiA9ICgpID0+IHtcbiAgJChcIi5hZGQtYmxvY2tcIikub2ZmKFwibW91c2VlbnRlclwiKTtcbiAgJChcIi5hZGQtYmxvY2tcIikub2ZmKFwibW91c2VsZWF2ZVwiKTtcblxuICBsZXQgdGltZW91dExlYXZlO1xuICAkKFwiLmFkZC1ibG9ja1wiKS5vbihcIm1vdXNlZW50ZXJcIiwgKGUpID0+IHtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dExlYXZlKTtcbiAgICBjb25zdCAkZWwgPSAkKGUuY3VycmVudFRhcmdldCk7XG5cbiAgICAkZWxcbiAgICAgIC5jbG9zZXN0KFwiLmJsb2Nrci1yZWdpc3RyeVwiKVxuICAgICAgLmZpbmQoXCIuYmxvY2tyLWRlc2NyaXB0aW9uXCIpXG4gICAgICAuaHRtbChcbiAgICAgICAgYDxwIGNsYXNzPVwicC0wXCI+XG4gICAgICAgICR7JGVsLmRhdGEoXCJpY29uXCIpIHx8IGRlZmF1bHRJY29ufVxuICAgICAgICA8c3Ryb25nPiR7JGVsLmRhdGEoXCJuYW1lXCIpIHx8IFwiXCJ9PC9zdHJvbmc+PGJyLz5cbiAgICAgICAgPHNtYWxsPiR7JGVsLmRhdGEoXCJkZXNjcmlwdGlvblwiKSB8fCBcIlwifTwvc21hbGw+PC9wPmAsXG4gICAgICApO1xuXG4gICAgaGlnaGxpZ2h0KCRlbC5jbG9zZXN0KFwiLmJsb2Nrci1yZWdpc3RyeVwiKS5maW5kKFwiLmJsb2Nrci1kZXNjcmlwdGlvblwiKSk7XG4gIH0pO1xuXG4gICQoXCIuYWRkLWJsb2NrXCIpLm9uKFwibW91c2VsZWF2ZVwiLCAoZSkgPT4ge1xuICAgIGNvbnN0IGVsID0gJChlLmN1cnJlbnRUYXJnZXQpXG4gICAgICAuY2xvc2VzdChcIi5ibG9ja3ItcmVnaXN0cnlcIilcbiAgICAgIC5maW5kKFwiLmJsb2Nrci1kZXNjcmlwdGlvblwiKTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dExlYXZlKTtcblxuICAgIHRpbWVvdXRMZWF2ZSA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZG93bmxpZ2h0KGVsKTtcbiAgICAgICQoZWwpLnRleHQoXCJcIik7XG4gICAgfSwgMjUwKTtcbiAgfSk7XG59O1xuXG5jb25zdCBoaWdobGlnaHQgPSAoZWwpID0+IHtcbiAgJChlbCkuYWRkQ2xhc3MoXCJyb3VuZGVkIGJvcmRlciBib3JkZXItZGFyay1zdWJ0bGUgcC0xIG15LTFcIik7XG59O1xuXG5jb25zdCBkb3dubGlnaHQgPSAoZWwpID0+IHtcbiAgJChlbCkucmVtb3ZlQ2xhc3MoXCJyb3VuZGVkIGJvcmRlciBib3JkZXItZGFyay1zdWJ0bGUgcC0xIG15LTFcIik7XG59O1xuIiwiaW1wb3J0IHsgZ2V0SGFzaCwgZ2V0UmVnaXN0cnksIHNldEhhc2gsIHNldFJlZ2lzdHJ5IH0gZnJvbSBcIi4vc3RvcmFnZVwiO1xuLy8gdGhpcyBpcyBzbyB3ZSBvbmx5IHBpbmcgdGhlIGhhc2ggb25jZSBwZXIgc2Vzc2lvblxuLy8gdGhpcyBzaG91bGQgYmUgc3dpdGNoZWQgb2ZmIHNvb24gd2hlbiB3ZSBoYXZlIGEgcmVhY3RpdmUgcmVnaXN0cnlcbmxldCBwaW5nZWRfaGFzaCA9IGZhbHNlO1xuXG5leHBvcnQgY29uc3QgZmV0Y2hGYWN0b3J5ID0gKHBhcmFtcykgPT4ge1xuICBhc3luYyBmdW5jdGlvbiBmZXRjaEhhc2goKSB7XG4gICAgaWYgKHBpbmdlZF9oYXNoKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHJlc29sdmUoZ2V0SGFzaCgpKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZldGNoKHBhcmFtcy5oYXNoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBwaW5nZWRfaGFzaCA9IHRydWU7XG4gICAgICAgIHJldHVybiBkYXRhLmhhc2g7XG4gICAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGZldGNoUmVnaXN0cnkoKSB7XG4gICAgcmV0dXJuIGZldGNoKHBhcmFtcy5yZWdpc3RyeSlcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgc2V0UmVnaXN0cnkoZGF0YS5yZWdpc3RyeSk7XG4gICAgICAgIHNldEhhc2goZGF0YS5oYXNoKTtcbiAgICAgICAgcmV0dXJuIGRhdGEucmVnaXN0cnk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGZldGNoTGVhc3QoKSB7XG4gICAgcmV0dXJuIGZldGNoSGFzaCgpLnRoZW4oKGhhc2gpID0+IHtcbiAgICAgIGlmIChnZXRIYXNoKCkgPT09IGhhc2gpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiByZXNvbHZlKGdldFJlZ2lzdHJ5KCkpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZldGNoUmVnaXN0cnkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZmV0Y2hIYXNoOiBmZXRjaEhhc2gsXG4gICAgZmV0Y2hSZWdpc3RyeTogZmV0Y2hSZWdpc3RyeSxcbiAgICBmZXRjaExlYXN0OiBmZXRjaExlYXN0LFxuICB9O1xufTtcbiIsImltcG9ydCB7IGRlc2NyaXB0aW9uIH0gZnJvbSBcIi4vZGVzY3JpcHRpb25cIjtcbmltcG9ydCB7IGJpbmRTY3JvbGwgfSBmcm9tIFwiLi9zY3JvbGxcIjtcbmltcG9ydCB7IGZldGNoRmFjdG9yeSB9IGZyb20gXCIuL2ZldGNoXCI7XG5pbXBvcnQgeyBoYW5kbGVTZWFyY2ggfSBmcm9tIFwiLi9zZWFyY2hcIjtcbmltcG9ydCB7IGhhbmRsZUNsaWNrIH0gZnJvbSBcIi4vcmVuZGVyXCI7XG5cbiQoKCkgPT4ge1xuICBoYW5kbGVDbGljaygpO1xuICB3aW5kb3cuU2hpbnkuYWRkQ3VzdG9tTWVzc2FnZUhhbmRsZXIoXCJibG9ja3ItcmVnaXN0cnktZW5kcG9pbnRzXCIsIChtc2cpID0+IHtcbiAgICBjb25zdCBlbmRwb2ludHMgPSBmZXRjaEZhY3RvcnkobXNnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGJpbmRTY3JvbGwobXNnLCBlbmRwb2ludHMpO1xuICAgICAgaGFuZGxlU2VhcmNoKG1zZywgZW5kcG9pbnRzKTtcbiAgICAgIGRlc2NyaXB0aW9uKCk7XG4gICAgfSwgbXNnLmRlbGF5KTtcbiAgfSk7XG59KTtcbiIsImltcG9ydCB7IGRlc2NyaXB0aW9uIH0gZnJvbSBcIi4vZGVzY3JpcHRpb25cIjtcbmltcG9ydCB7IGNhcGl0YWxpc2UgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuY29uc3QgY3JlYXRlUGlsbHMgPSAoYmxvY2tzLCBhbGwpID0+IHtcbiAgbGV0IHBpbGxzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgbGV0IHByZXZpb3VzX2Jsb2NrX2luZGV4ID0gMDtcbiAgICBhbGwubWFwKChkLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGQubmFtZSAhPT0gYmxvY2submFtZSkgcmV0dXJuO1xuICAgICAgcHJldmlvdXNfYmxvY2tfaW5kZXggPSBpbmRleCAtIDE7XG4gICAgfSk7XG4gICAgY29uc3QgcHJldmlvdXNfYmxvY2sgPSBhbGxbcHJldmlvdXNfYmxvY2tfaW5kZXhdO1xuXG4gICAgaWYgKCFwcmV2aW91c19ibG9jaykge1xuICAgICAgcGlsbHMgKz0gYDxoMz4ke2NhcGl0YWxpc2UoYmxvY2tUeXBlKGJsb2NrKSl9PC9oMz5gO1xuICAgIH1cblxuICAgIGlmIChwcmV2aW91c19ibG9jayAmJiBibG9ja1R5cGUoYmxvY2spICE9PSBibG9ja1R5cGUocHJldmlvdXNfYmxvY2spKSB7XG4gICAgICBwaWxscyArPSBgPGgzIGNsYXNzPSdtdC0zJz4ke2NhcGl0YWxpc2UoYmxvY2tUeXBlKGJsb2NrKSl9PC9oMz5gO1xuICAgIH1cblxuICAgIHBpbGxzICs9IGNyZWF0ZVBpbGwoYmxvY2spO1xuICB9XG4gIHJldHVybiBwaWxscztcbn07XG5cbmNvbnN0IGNyZWF0ZVBpbGwgPSAoYmxvY2spID0+IHtcbiAgY29uc3QgbmFtZSA9IGJsb2NrLm5hbWUucmVwbGFjZShcImJsb2NrJFwiLCBcIlwiKTtcbiAgcmV0dXJuIGA8cCBjbGFzcz1cImN1cnNvci1wb2ludGVyIG1iLTEgYmFkZ2UgYWRkLWJsb2NrIGJnLSR7YmxvY2tDb2xvcihcbiAgICBibG9jayxcbiAgKX0gbWUtMVwiXG4gICAgZGF0YS1pY29uPScke2Jsb2NrLmljb259J1xuICAgIGRhdGEtaW5kZXg9XCIke2Jsb2NrLmluZGV4fVwiXG4gICAgZGF0YS1uYW1lPVwiJHtibG9jay5uYW1lfVwiXG4gICAgZGF0YS1kZXNjcmlwdGlvbj1cIiR7YmxvY2suZGVzY3JpcHRpb259XCJcbiAgICBkcmFnZ2FibGU9XCJ0cnVlXCI+XG4gICAgJHtuYW1lLnJlcGxhY2UoXCJibG9jayRcIiwgXCJcIil9XG4gIDwvcD5gO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbmRlclBpbGxzID0gKHBhcmFtcywgZGF0YSwgYWxsKSA9PiB7XG4gIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICQoYCMke3BhcmFtcy5uc30tc2Nyb2xsYWJsZS1jaGlsZGApLmh0bWwoXG4gICAgICBcIjxwIGNsYXNzPSd0ZXh0LW11dGVkJz5ObyBibG9ja3MgZm91bmQ8L3A+XCIsXG4gICAgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwaWxscyA9IGNyZWF0ZVBpbGxzKGRhdGEsIGFsbCk7XG4gICQoYCMke3BhcmFtcy5uc30tc2Nyb2xsYWJsZS1jaGlsZGApLmFwcGVuZChwaWxscyk7XG4gIGRlc2NyaXB0aW9uKCk7XG59O1xuXG5jb25zdCBibG9ja1R5cGUgPSAoYmxvY2spID0+IHtcbiAgaWYgKGJsb2NrLmNsYXNzZXMuaW5jbHVkZXMoXCJwYXJzZXJfYmxvY2tcIikpIHJldHVybiBcInBhcnNlclwiO1xuICBpZiAoYmxvY2suY2xhc3Nlcy5pbmNsdWRlcyhcImRhdGFfYmxvY2tcIikpIHJldHVybiBcImRhdGFcIjtcbiAgaWYgKGJsb2NrLmNsYXNzZXMuaW5jbHVkZXMoXCJ0cmFuc2Zvcm1fYmxvY2tcIikpIHJldHVybiBcInRyYW5zZm9ybVwiO1xuXG4gIHJldHVybiBcInZpc3VhbGlzZVwiO1xufTtcblxuY29uc3QgYmxvY2tDb2xvciA9IChibG9jaykgPT4ge1xuICBjb25zdCB0eXBlID0gYmxvY2tUeXBlKGJsb2NrKTtcblxuICBpZiAodHlwZSA9PSBcInBhcnNlclwiKSByZXR1cm4gXCJpbmZvXCI7XG4gIGlmICh0eXBlID09IFwiZGF0YVwiKSByZXR1cm4gXCJwcmltYXJ5XCI7XG4gIGlmICh0eXBlID09IFwidHJhbnNmb3JtXCIpIHJldHVybiBcInNlY29uZGFyeVwiO1xuXG4gIHJldHVybiBcImluZm9cIjtcbn07XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVDbGljayA9ICgpID0+IHtcbiAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5hZGQtYmxvY2tcIiwgKGUpID0+IHtcbiAgICBjb25zdCBucyA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoXCIuYmxvY2tyLXJlZ2lzdHJ5XCIpLmF0dHIoXCJpZFwiKS5zcGxpdChcIi1cIik7XG4gICAgbnMucG9wKCk7XG5cbiAgICB3aW5kb3cuU2hpbnkuc2V0SW5wdXRWYWx1ZShcbiAgICAgIGAke25zLmpvaW4oXCItXCIpfS1hZGRgLFxuICAgICAgcGFyc2VJbnQoJChlLnRhcmdldCkuZGF0YShcImluZGV4XCIpKSxcbiAgICAgIHsgcHJpb3JpdHk6IFwiZXZlbnRcIiB9LFxuICAgICk7XG5cbiAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoXCIub2ZmY2FudmFzXCIpLm9mZmNhbnZhcyhcImhpZGVcIikuYXR0cihcImlkXCIpO1xuICAgIHdpbmRvdy5ib290c3RyYXAuT2ZmY2FudmFzLmdldE9yQ3JlYXRlSW5zdGFuY2UoYCMke2lkfWApLmhpZGUoKTtcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgcmVuZGVyUGlsbHMgfSBmcm9tIFwiLi9yZW5kZXJcIjtcblxuY29uc3QgQkFUQ0ggPSAyMDtcblxuZXhwb3J0IGNvbnN0IHVuYmluZFNjcm9sbCA9IChwYXJhbXMpID0+IHtcbiAgJChgIyR7cGFyYW1zLm5zfS1zY3JvbGxhYmxlYCkub2ZmKFwic2Nyb2xsXCIpO1xufTtcblxuZXhwb3J0IGNvbnN0IGJpbmRTY3JvbGwgPSAocGFyYW1zLCBlbmRwb2ludHMpID0+IHtcbiAgZmV0Y2hVbnRpbFNjcm9sbGFibGUocGFyYW1zLCBlbmRwb2ludHMpO1xuXG4gIHVuYmluZFNjcm9sbChwYXJhbXMpO1xuXG4gICQoYCMke3BhcmFtcy5uc30tc2Nyb2xsYWJsZWApLm9uKFwic2Nyb2xsXCIsICgpID0+IHtcbiAgICB1bmJpbmRTY3JvbGwocGFyYW1zKTtcbiAgICBjb25zdCBuID0gZ2V0TkJsb2NrcyhwYXJhbXMubnMpO1xuICAgIGVuZHBvaW50cy5mZXRjaExlYXN0KCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgbGV0IHRvID0gbiArIEJBVENIO1xuICAgICAgaWYgKHRvID4gZGF0YS5sZW5ndGgpIHRvID0gZGF0YS5sZW5ndGg7XG4gICAgICBpZiAobiA9PSB0bykgcmV0dXJuO1xuXG4gICAgICByZW5kZXJQaWxscyhwYXJhbXMsIGRhdGEuc2xpY2UobiwgdG8pLCBkYXRhKTtcbiAgICAgIGJpbmRTY3JvbGwocGFyYW1zLCBlbmRwb2ludHMpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVW50aWxTY3JvbGxhYmxlKHBhcmFtcywgZW5kcG9pbnRzKSB7XG4gIGNvbnN0IG4gPSBnZXROQmxvY2tzKHBhcmFtcy5ucyk7XG5cbiAgcmV0dXJuIGVuZHBvaW50cy5mZXRjaExlYXN0KCkudGhlbigoZGF0YSkgPT4ge1xuICAgIGlmICghZGF0YS5sZW5ndGgpIHJldHVybjtcblxuICAgIGxldCB0byA9IG4gKyBCQVRDSDtcbiAgICBpZiAodG8gPiBkYXRhLmxlbmd0aCkgdG8gPSBkYXRhLmxlbmd0aDtcbiAgICBpZiAobiA9PSB0bykgcmV0dXJuO1xuXG4gICAgcmVuZGVyUGlsbHMocGFyYW1zLCBkYXRhLnNsaWNlKG4sIHRvKSwgZGF0YSk7XG4gICAgaWYgKFxuICAgICAgJChgIyR7cGFyYW1zLm5zfS1zY3JvbGxhYmxlLWNoaWxkYCkuaGVpZ2h0KCkgPD1cbiAgICAgICQoYCMke3BhcmFtcy5uc30tc2Nyb2xsYWJsZWApLmhlaWdodCgpXG4gICAgKSB7XG4gICAgICBmZXRjaFVudGlsU2Nyb2xsYWJsZShwYXJhbXMsIGVuZHBvaW50cyk7XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgZ2V0TkJsb2NrcyA9IChucykgPT4ge1xuICByZXR1cm4gJChgIyR7bnN9LXNjcm9sbGFibGVgKS5maW5kKFwiLmFkZC1ibG9ja1wiKS5sZW5ndGg7XG59O1xuIiwiaW1wb3J0IHsgcmVuZGVyUGlsbHMgfSBmcm9tIFwiLi9yZW5kZXJcIjtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZVNlYXJjaCA9IChwYXJhbXMsIGVuZHBvaW50cykgPT4ge1xuICAkKGAjJHtwYXJhbXMubnN9LXF1ZXJ5YCkub2ZmKFwia2V5dXBcIik7XG4gICQoYCMke3BhcmFtcy5uc30tcXVlcnlgKS5vbihcImtleXVwXCIsIHNlYXJjaChwYXJhbXMsIGVuZHBvaW50cykpO1xufTtcblxuY29uc3Qgc2VhcmNoID0gKHBhcmFtcywgZW5kcG9pbnRzKSA9PiB7XG4gIGxldCBkZWJvdW5jZTtcblxuICByZXR1cm4gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgcXVlcnkgPSAkKGV2ZW50LnRhcmdldCkudmFsKCk7XG5cbiAgICBjbGVhclRpbWVvdXQoZGVib3VuY2UpO1xuXG4gICAgZGVib3VuY2UgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICQoZXZlbnQudGFyZ2V0KVxuICAgICAgICAuY2xvc2VzdChcIi5vZmZjYW52YXMtYm9keVwiKVxuICAgICAgICAuZmluZChcIi5zY3JvbGxhYmxlLWNoaWxkXCIpXG4gICAgICAgIC5odG1sKFwiXCIpO1xuXG4gICAgICBpZiAocXVlcnkgPT0gXCJcIikge1xuICAgICAgICBlbmRwb2ludHMuZmV0Y2hMZWFzdCgpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICByZW5kZXJQaWxscyhwYXJhbXMsIGRhdGEsIGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBlbmRwb2ludHMuZmV0Y2hMZWFzdCgpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyKChibG9jaykgPT4ge1xuICAgICAgICAgIHJldHVybiBibG9jay5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnkudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA+IDEwMClcbiAgICAgICAgICB3aW5kb3cuU2hpbnkubm90aWZpY2F0aW9ucy5zaG93KHtcbiAgICAgICAgICAgIGh0bWw6IFwiU2hvd2luZyBvbmx5IHRoZSBmaXJzdCAxMDAgcmVzdWx0cy5cIixcbiAgICAgICAgICB9KTtcblxuICAgICAgICByZW5kZXJQaWxscyhwYXJhbXMsIGRhdGEuc2xpY2UoMCwgMTAwKSwgZGF0YSk7XG4gICAgICB9KTtcbiAgICB9LCA1MDApO1xuICB9O1xufTtcbiIsImNvbnN0IEhBU0ggPSBcIkJMT0NLUi5IQVNIXCI7XG5jb25zdCBSRUdJU1RSWSA9IFwiQkxPQ0tSLlJFR0lTVFJZXCI7XG5cbmV4cG9ydCBjb25zdCBzZXRSZWdpc3RyeSA9IChyZWdpc3RyeSkgPT4ge1xuICBpZiAocmVnaXN0cnkgPT09IHVuZGVmaW5lZCkgdGhyb3cgbmV3IEVycm9yKFwiUmVnaXN0cnkgaXMgdW5kZWZpbmVkXCIpO1xuXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFJFR0lTVFJZLCBKU09OLnN0cmluZ2lmeShyZWdpc3RyeSkpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNldEhhc2ggPSAoaGFzaCkgPT4ge1xuICBpZiAoaGFzaCA9PT0gdW5kZWZpbmVkKSB0aHJvdyBuZXcgRXJyb3IoXCJIYXNoIGlzIHVuZGVmaW5lZFwiKTtcblxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShIQVNILCBoYXNoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRSZWdpc3RyeSA9ICgpID0+IHtcbiAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oUkVHSVNUUlkpKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRIYXNoID0gKCkgPT4ge1xuICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oSEFTSCk7XG59O1xuIiwiaW1wb3J0IHsgY29sbGFwc2VPdGhlckJsb2Nrcywgc2hvd0xhc3RPdXRwdXQgfSBmcm9tIFwiLi9jb2xsYXBzZS5qc1wiO1xuaW1wb3J0IFwiLi9zdGFjay10aXRsZS5qc1wiO1xuaW1wb3J0IHsgcmVuZGVyTG9ja2VkIH0gZnJvbSBcIi4vbG9jay5qc1wiO1xuaW1wb3J0IHsgbG9hZGluZyB9IGZyb20gXCIuL2xvYWRpbmcuanNcIjtcblxud2luZG93LlNoaW55LmFkZEN1c3RvbU1lc3NhZ2VIYW5kbGVyKFwiYmxvY2tyLXJlbmRlci1zdGFja1wiLCAobXNnKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gYCMke21zZy5zdGFja31gO1xuICBzaG93TGFzdE91dHB1dChzdGFjayk7XG4gIHJlbmRlckxvY2tlZChzdGFjaywgbXNnLmxvY2tlZCk7XG4gIGxvYWRpbmcobXNnLnN0YWNrKTtcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJibG9ja3I6c3RhY2stcmVuZGVyXCIsIHsgZGV0YWlsOiBtc2cgfSk7XG4gIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufSk7XG5cbndpbmRvdy5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcImJsb2Nrci1hZGQtYmxvY2tcIiwgKG1zZykgPT4ge1xuICBjb25zdCBzdGFjayA9IGAjJHttc2cuc3RhY2t9YDtcbiAgJChzdGFjaykucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgY29sbGFwc2VPdGhlckJsb2NrcyhzdGFjaywgbXNnLmJsb2NrKTtcbiAgfSwgMzUwKTtcbn0pO1xuXG4vLyBCbG9jayBjb2xvciBmZWVkYmFjayAodmFsaWRhdGlvbilcbndpbmRvdy5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcInZhbGlkYXRlLWJsb2NrXCIsIChfbXNnKSA9PiB7fSk7XG5cbndpbmRvdy5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcInZhbGlkYXRlLWlucHV0XCIsIChfbXNnKSA9PiB7fSk7XG5cbndpbmRvdy5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcInRvZ2dsZS1zdWJtaXRcIiwgKG1zZykgPT4ge1xuICAkKGAjJHttc2cuaWR9YCkucHJvcChcImRpc2FibGVkXCIsICFtc2cuc3RhdGUpO1xufSk7XG4iLCIkKCgpID0+IHtcbiAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5zdGFjay10aXRsZS1kaXNwbGF5XCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0ICRncm91cCA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KFwiLnN0YWNrLXRpdGxlXCIpO1xuXG4gICAgJGdyb3VwLmZpbmQoXCIuc3RhY2stdGl0bGUtZGlzcGxheVwiKS5hZGRDbGFzcyhcImQtbm9uZVwiKTtcbiAgICAkZ3JvdXAuZmluZChcIi5zdGFjay10aXRsZS1pbnB1dFwiKS5yZW1vdmVDbGFzcyhcImQtbm9uZVwiKTtcbiAgICAkZ3JvdXAuZmluZChcIi5zdGFjay10aXRsZS1pbnB1dFwiKS5maW5kKFwiaW5wdXRcIikuZm9jdXMoKTtcbiAgfSk7XG5cbiAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5zdGFjay10aXRsZS1zYXZlXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0ICRncm91cCA9ICQoZXZlbnQudGFyZ2V0KVxuICAgICAgLmNsb3Nlc3QoXCIuaW5wdXQtZ3JvdXBcIilcbiAgICAgIC5jbG9zZXN0KFwiLnN0YWNrLXRpdGxlXCIpO1xuXG4gICAgY29uc3QgdiA9ICRncm91cC5maW5kKFwiLnN0YWNrLXRpdGxlLWlucHV0XCIpLmZpbmQoXCJpbnB1dFwiKS52YWwoKTtcbiAgICBpZiAodiA9PT0gXCJcIikge1xuICAgICAgd2luZG93LlNoaW55Lm5vdGlmaWNhdGlvbnMuc2hvdyh7XG4gICAgICAgIGh0bWw6IFwiTXVzdCBzZXQgYSB0aXRsZVwiLFxuICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJGdyb3VwLmZpbmQoXCIuc3RhY2stdGl0bGUtZGlzcGxheVwiKS50ZXh0KHYpO1xuXG4gICAgJGdyb3VwLmZpbmQoXCIuc3RhY2stdGl0bGUtaW5wdXRcIikuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgJGdyb3VwLmZpbmQoXCIuc3RhY2stdGl0bGUtZGlzcGxheVwiKS5yZW1vdmVDbGFzcyhcImQtbm9uZVwiKTtcbiAgfSk7XG5cbiAgJChcImJvZHlcIikub24oXCJrZXlkb3duXCIsIFwiLnN0YWNrLXRpdGxlLWlucHV0XCIsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC5rZXkgIT09IFwiRW50ZXJcIikgcmV0dXJuO1xuXG4gICAgY29uc3QgJGdyb3VwID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoXCIuc3RhY2stdGl0bGVcIik7XG5cbiAgICBjb25zdCB2ID0gJChldmVudC50YXJnZXQpLnZhbCgpO1xuICAgIGlmICh2ID09PSBcIlwiKSB7XG4gICAgICB3aW5kb3cuU2hpbnkubm90aWZpY2F0aW9ucy5zaG93KHtcbiAgICAgICAgaHRtbDogXCJNdXN0IHNldCBhIHRpdGxlXCIsXG4gICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAkZ3JvdXAuZmluZChcIi5zdGFjay10aXRsZS1kaXNwbGF5XCIpLnRleHQodik7XG5cbiAgICAkZ3JvdXAuZmluZChcIi5zdGFjay10aXRsZS1kaXNwbGF5XCIpLnJlbW92ZUNsYXNzKFwiZC1ub25lXCIpO1xuICAgICRncm91cC5maW5kKFwiLnN0YWNrLXRpdGxlLWlucHV0XCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuICB9KTtcbn0pO1xuIiwiJCgoKSA9PiB7XG4gIHRvb2x0aXAoKTtcbn0pO1xuXG5jb25zdCB0b29sdGlwID0gKCkgPT4ge1xuICBjb25zdCB0b29sdGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWJzLXRvZ2dsZT1cInRvb2x0aXBcIl0nKTtcbiAgWy4uLnRvb2x0aXBzXS5tYXAoKGVsKSA9PiBuZXcgd2luZG93LmJvb3RzdHJhcC5Ub29sdGlwKGVsKSk7XG59O1xuIiwiZXhwb3J0IGNvbnN0IGNhcGl0YWxpc2UgPSAoc3RyKSA9PiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfc2hpbnlfXzsiLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1tdWx0aS1hc3NpZ24gKi9cblxuZnVuY3Rpb24gZGVlcEZyZWV6ZShvYmopIHtcbiAgaWYgKG9iaiBpbnN0YW5jZW9mIE1hcCkge1xuICAgIG9iai5jbGVhciA9XG4gICAgICBvYmouZGVsZXRlID1cbiAgICAgIG9iai5zZXQgPVxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXAgaXMgcmVhZC1vbmx5Jyk7XG4gICAgICAgIH07XG4gIH0gZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgb2JqLmFkZCA9XG4gICAgICBvYmouY2xlYXIgPVxuICAgICAgb2JqLmRlbGV0ZSA9XG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldCBpcyByZWFkLW9ubHknKTtcbiAgICAgICAgfTtcbiAgfVxuXG4gIC8vIEZyZWV6ZSBzZWxmXG4gIE9iamVjdC5mcmVlemUob2JqKTtcblxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICBjb25zdCBwcm9wID0gb2JqW25hbWVdO1xuICAgIGNvbnN0IHR5cGUgPSB0eXBlb2YgcHJvcDtcblxuICAgIC8vIEZyZWV6ZSBwcm9wIGlmIGl0IGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiBhbmQgYWxzbyBub3QgYWxyZWFkeSBmcm96ZW5cbiAgICBpZiAoKHR5cGUgPT09ICdvYmplY3QnIHx8IHR5cGUgPT09ICdmdW5jdGlvbicpICYmICFPYmplY3QuaXNGcm96ZW4ocHJvcCkpIHtcbiAgICAgIGRlZXBGcmVlemUocHJvcCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gb2JqO1xufVxuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuQ2FsbGJhY2tSZXNwb25zZX0gQ2FsbGJhY2tSZXNwb25zZSAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkNvbXBpbGVkTW9kZX0gQ29tcGlsZWRNb2RlICovXG4vKiogQGltcGxlbWVudHMgQ2FsbGJhY2tSZXNwb25zZSAqL1xuXG5jbGFzcyBSZXNwb25zZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0NvbXBpbGVkTW9kZX0gbW9kZVxuICAgKi9cbiAgY29uc3RydWN0b3IobW9kZSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZmluZWRcbiAgICBpZiAobW9kZS5kYXRhID09PSB1bmRlZmluZWQpIG1vZGUuZGF0YSA9IHt9O1xuXG4gICAgdGhpcy5kYXRhID0gbW9kZS5kYXRhO1xuICAgIHRoaXMuaXNNYXRjaElnbm9yZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGlnbm9yZU1hdGNoKCkge1xuICAgIHRoaXMuaXNNYXRjaElnbm9yZWQgPSB0cnVlO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBlc2NhcGVIVE1MKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZVxuICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXG4gICAgLnJlcGxhY2UoLycvZywgJyYjeDI3OycpO1xufVxuXG4vKipcbiAqIHBlcmZvcm1zIGEgc2hhbGxvdyBtZXJnZSBvZiBtdWx0aXBsZSBvYmplY3RzIGludG8gb25lXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSB7VH0gb3JpZ2luYWxcbiAqIEBwYXJhbSB7UmVjb3JkPHN0cmluZyxhbnk+W119IG9iamVjdHNcbiAqIEByZXR1cm5zIHtUfSBhIHNpbmdsZSBuZXcgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGluaGVyaXQkMShvcmlnaW5hbCwgLi4ub2JqZWN0cykge1xuICAvKiogQHR5cGUgUmVjb3JkPHN0cmluZyxhbnk+ICovXG4gIGNvbnN0IHJlc3VsdCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgZm9yIChjb25zdCBrZXkgaW4gb3JpZ2luYWwpIHtcbiAgICByZXN1bHRba2V5XSA9IG9yaWdpbmFsW2tleV07XG4gIH1cbiAgb2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKG9iaikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgICAgcmVzdWx0W2tleV0gPSBvYmpba2V5XTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gLyoqIEB0eXBlIHtUfSAqLyAocmVzdWx0KTtcbn1cblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBSZW5kZXJlclxuICogQHByb3BlcnR5IHsodGV4dDogc3RyaW5nKSA9PiB2b2lkfSBhZGRUZXh0XG4gKiBAcHJvcGVydHkgeyhub2RlOiBOb2RlKSA9PiB2b2lkfSBvcGVuTm9kZVxuICogQHByb3BlcnR5IHsobm9kZTogTm9kZSkgPT4gdm9pZH0gY2xvc2VOb2RlXG4gKiBAcHJvcGVydHkgeygpID0+IHN0cmluZ30gdmFsdWVcbiAqL1xuXG4vKiogQHR5cGVkZWYge3tzY29wZT86IHN0cmluZywgbGFuZ3VhZ2U/OiBzdHJpbmcsIHN1Ymxhbmd1YWdlPzogYm9vbGVhbn19IE5vZGUgKi9cbi8qKiBAdHlwZWRlZiB7e3dhbGs6IChyOiBSZW5kZXJlcikgPT4gdm9pZH19IFRyZWUgKi9cbi8qKiAqL1xuXG5jb25zdCBTUEFOX0NMT1NFID0gJzwvc3Bhbj4nO1xuXG4vKipcbiAqIERldGVybWluZXMgaWYgYSBub2RlIG5lZWRzIHRvIGJlIHdyYXBwZWQgaW4gPHNwYW4+XG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlICovXG5jb25zdCBlbWl0c1dyYXBwaW5nVGFncyA9IChub2RlKSA9PiB7XG4gIC8vIHJhcmVseSB3ZSBjYW4gaGF2ZSBhIHN1Ymxhbmd1YWdlIHdoZXJlIGxhbmd1YWdlIGlzIHVuZGVmaW5lZFxuICAvLyBUT0RPOiB0cmFjayBkb3duIHdoeVxuICByZXR1cm4gISFub2RlLnNjb3BlO1xufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7e3ByZWZpeDpzdHJpbmd9fSBvcHRpb25zXG4gKi9cbmNvbnN0IHNjb3BlVG9DU1NDbGFzcyA9IChuYW1lLCB7IHByZWZpeCB9KSA9PiB7XG4gIC8vIHN1Yi1sYW5ndWFnZVxuICBpZiAobmFtZS5zdGFydHNXaXRoKFwibGFuZ3VhZ2U6XCIpKSB7XG4gICAgcmV0dXJuIG5hbWUucmVwbGFjZShcImxhbmd1YWdlOlwiLCBcImxhbmd1YWdlLVwiKTtcbiAgfVxuICAvLyB0aWVyZWQgc2NvcGU6IGNvbW1lbnQubGluZVxuICBpZiAobmFtZS5pbmNsdWRlcyhcIi5cIikpIHtcbiAgICBjb25zdCBwaWVjZXMgPSBuYW1lLnNwbGl0KFwiLlwiKTtcbiAgICByZXR1cm4gW1xuICAgICAgYCR7cHJlZml4fSR7cGllY2VzLnNoaWZ0KCl9YCxcbiAgICAgIC4uLihwaWVjZXMubWFwKCh4LCBpKSA9PiBgJHt4fSR7XCJfXCIucmVwZWF0KGkgKyAxKX1gKSlcbiAgICBdLmpvaW4oXCIgXCIpO1xuICB9XG4gIC8vIHNpbXBsZSBzY29wZVxuICByZXR1cm4gYCR7cHJlZml4fSR7bmFtZX1gO1xufTtcblxuLyoqIEB0eXBlIHtSZW5kZXJlcn0gKi9cbmNsYXNzIEhUTUxSZW5kZXJlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IEhUTUxSZW5kZXJlclxuICAgKlxuICAgKiBAcGFyYW0ge1RyZWV9IHBhcnNlVHJlZSAtIHRoZSBwYXJzZSB0cmVlIChtdXN0IHN1cHBvcnQgYHdhbGtgIEFQSSlcbiAgICogQHBhcmFtIHt7Y2xhc3NQcmVmaXg6IHN0cmluZ319IG9wdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcnNlVHJlZSwgb3B0aW9ucykge1xuICAgIHRoaXMuYnVmZmVyID0gXCJcIjtcbiAgICB0aGlzLmNsYXNzUHJlZml4ID0gb3B0aW9ucy5jbGFzc1ByZWZpeDtcbiAgICBwYXJzZVRyZWUud2Fsayh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRleHRzIHRvIHRoZSBvdXRwdXQgc3RyZWFtXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0ICovXG4gIGFkZFRleHQodGV4dCkge1xuICAgIHRoaXMuYnVmZmVyICs9IGVzY2FwZUhUTUwodGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5vZGUgb3BlbiB0byB0aGUgb3V0cHV0IHN0cmVhbSAoaWYgbmVlZGVkKVxuICAgKlxuICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgKi9cbiAgb3Blbk5vZGUobm9kZSkge1xuICAgIGlmICghZW1pdHNXcmFwcGluZ1RhZ3Mobm9kZSkpIHJldHVybjtcblxuICAgIGNvbnN0IGNsYXNzTmFtZSA9IHNjb3BlVG9DU1NDbGFzcyhub2RlLnNjb3BlLFxuICAgICAgeyBwcmVmaXg6IHRoaXMuY2xhc3NQcmVmaXggfSk7XG4gICAgdGhpcy5zcGFuKGNsYXNzTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5vZGUgY2xvc2UgdG8gdGhlIG91dHB1dCBzdHJlYW0gKGlmIG5lZWRlZClcbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlICovXG4gIGNsb3NlTm9kZShub2RlKSB7XG4gICAgaWYgKCFlbWl0c1dyYXBwaW5nVGFncyhub2RlKSkgcmV0dXJuO1xuXG4gICAgdGhpcy5idWZmZXIgKz0gU1BBTl9DTE9TRTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIHRoZSBhY2N1bXVsYXRlZCBidWZmZXJcbiAgKi9cbiAgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyO1xuICB9XG5cbiAgLy8gaGVscGVyc1xuXG4gIC8qKlxuICAgKiBCdWlsZHMgYSBzcGFuIGVsZW1lbnRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSAqL1xuICBzcGFuKGNsYXNzTmFtZSkge1xuICAgIHRoaXMuYnVmZmVyICs9IGA8c3BhbiBjbGFzcz1cIiR7Y2xhc3NOYW1lfVwiPmA7XG4gIH1cbn1cblxuLyoqIEB0eXBlZGVmIHt7c2NvcGU/OiBzdHJpbmcsIGxhbmd1YWdlPzogc3RyaW5nLCBjaGlsZHJlbjogTm9kZVtdfSB8IHN0cmluZ30gTm9kZSAqL1xuLyoqIEB0eXBlZGVmIHt7c2NvcGU/OiBzdHJpbmcsIGxhbmd1YWdlPzogc3RyaW5nLCBjaGlsZHJlbjogTm9kZVtdfSB9IERhdGFOb2RlICovXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuRW1pdHRlcn0gRW1pdHRlciAqL1xuLyoqICAqL1xuXG4vKiogQHJldHVybnMge0RhdGFOb2RlfSAqL1xuY29uc3QgbmV3Tm9kZSA9IChvcHRzID0ge30pID0+IHtcbiAgLyoqIEB0eXBlIERhdGFOb2RlICovXG4gIGNvbnN0IHJlc3VsdCA9IHsgY2hpbGRyZW46IFtdIH07XG4gIE9iamVjdC5hc3NpZ24ocmVzdWx0LCBvcHRzKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmNsYXNzIFRva2VuVHJlZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qKiBAdHlwZSBEYXRhTm9kZSAqL1xuICAgIHRoaXMucm9vdE5vZGUgPSBuZXdOb2RlKCk7XG4gICAgdGhpcy5zdGFjayA9IFt0aGlzLnJvb3ROb2RlXTtcbiAgfVxuXG4gIGdldCB0b3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhY2tbdGhpcy5zdGFjay5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIGdldCByb290KCkgeyByZXR1cm4gdGhpcy5yb290Tm9kZTsgfVxuXG4gIC8qKiBAcGFyYW0ge05vZGV9IG5vZGUgKi9cbiAgYWRkKG5vZGUpIHtcbiAgICB0aGlzLnRvcC5jaGlsZHJlbi5wdXNoKG5vZGUpO1xuICB9XG5cbiAgLyoqIEBwYXJhbSB7c3RyaW5nfSBzY29wZSAqL1xuICBvcGVuTm9kZShzY29wZSkge1xuICAgIC8qKiBAdHlwZSBOb2RlICovXG4gICAgY29uc3Qgbm9kZSA9IG5ld05vZGUoeyBzY29wZSB9KTtcbiAgICB0aGlzLmFkZChub2RlKTtcbiAgICB0aGlzLnN0YWNrLnB1c2gobm9kZSk7XG4gIH1cblxuICBjbG9zZU5vZGUoKSB7XG4gICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoID4gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhY2sucG9wKCk7XG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZmluZWRcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY2xvc2VBbGxOb2RlcygpIHtcbiAgICB3aGlsZSAodGhpcy5jbG9zZU5vZGUoKSk7XG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMucm9vdE5vZGUsIG51bGwsIDQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHsgaW1wb3J0KFwiLi9odG1sX3JlbmRlcmVyXCIpLlJlbmRlcmVyIH0gUmVuZGVyZXJcbiAgICogQHBhcmFtIHtSZW5kZXJlcn0gYnVpbGRlclxuICAgKi9cbiAgd2FsayhidWlsZGVyKSB7XG4gICAgLy8gdGhpcyBkb2VzIG5vdFxuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLl93YWxrKGJ1aWxkZXIsIHRoaXMucm9vdE5vZGUpO1xuICAgIC8vIHRoaXMgd29ya3NcbiAgICAvLyByZXR1cm4gVG9rZW5UcmVlLl93YWxrKGJ1aWxkZXIsIHRoaXMucm9vdE5vZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7UmVuZGVyZXJ9IGJ1aWxkZXJcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAqL1xuICBzdGF0aWMgX3dhbGsoYnVpbGRlciwgbm9kZSkge1xuICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgYnVpbGRlci5hZGRUZXh0KG5vZGUpO1xuICAgIH0gZWxzZSBpZiAobm9kZS5jaGlsZHJlbikge1xuICAgICAgYnVpbGRlci5vcGVuTm9kZShub2RlKTtcbiAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHRoaXMuX3dhbGsoYnVpbGRlciwgY2hpbGQpKTtcbiAgICAgIGJ1aWxkZXIuY2xvc2VOb2RlKG5vZGUpO1xuICAgIH1cbiAgICByZXR1cm4gYnVpbGRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAgICovXG4gIHN0YXRpYyBfY29sbGFwc2Uobm9kZSkge1xuICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gXCJzdHJpbmdcIikgcmV0dXJuO1xuICAgIGlmICghbm9kZS5jaGlsZHJlbikgcmV0dXJuO1xuXG4gICAgaWYgKG5vZGUuY2hpbGRyZW4uZXZlcnkoZWwgPT4gdHlwZW9mIGVsID09PSBcInN0cmluZ1wiKSkge1xuICAgICAgLy8gbm9kZS50ZXh0ID0gbm9kZS5jaGlsZHJlbi5qb2luKFwiXCIpO1xuICAgICAgLy8gZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgICBub2RlLmNoaWxkcmVuID0gW25vZGUuY2hpbGRyZW4uam9pbihcIlwiKV07XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgVG9rZW5UcmVlLl9jb2xsYXBzZShjaGlsZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gIEN1cnJlbnRseSB0aGlzIGlzIGFsbCBwcml2YXRlIEFQSSwgYnV0IHRoaXMgaXMgdGhlIG1pbmltYWwgQVBJIG5lY2Vzc2FyeVxuICB0aGF0IGFuIEVtaXR0ZXIgbXVzdCBpbXBsZW1lbnQgdG8gZnVsbHkgc3VwcG9ydCB0aGUgcGFyc2VyLlxuXG4gIE1pbmltYWwgaW50ZXJmYWNlOlxuXG4gIC0gYWRkVGV4dCh0ZXh0KVxuICAtIF9fYWRkU3VibGFuZ3VhZ2UoZW1pdHRlciwgc3ViTGFuZ3VhZ2VOYW1lKVxuICAtIHN0YXJ0U2NvcGUoc2NvcGUpXG4gIC0gZW5kU2NvcGUoKVxuICAtIGZpbmFsaXplKClcbiAgLSB0b0hUTUwoKVxuXG4qL1xuXG4vKipcbiAqIEBpbXBsZW1lbnRzIHtFbWl0dGVyfVxuICovXG5jbGFzcyBUb2tlblRyZWVFbWl0dGVyIGV4dGVuZHMgVG9rZW5UcmVlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7Kn0gb3B0aW9uc1xuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuICAgKi9cbiAgYWRkVGV4dCh0ZXh0KSB7XG4gICAgaWYgKHRleHQgPT09IFwiXCIpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLmFkZCh0ZXh0KTtcbiAgfVxuXG4gIC8qKiBAcGFyYW0ge3N0cmluZ30gc2NvcGUgKi9cbiAgc3RhcnRTY29wZShzY29wZSkge1xuICAgIHRoaXMub3Blbk5vZGUoc2NvcGUpO1xuICB9XG5cbiAgZW5kU2NvcGUoKSB7XG4gICAgdGhpcy5jbG9zZU5vZGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VtaXR0ZXIgJiB7cm9vdDogRGF0YU5vZGV9fSBlbWl0dGVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqL1xuICBfX2FkZFN1Ymxhbmd1YWdlKGVtaXR0ZXIsIG5hbWUpIHtcbiAgICAvKiogQHR5cGUgRGF0YU5vZGUgKi9cbiAgICBjb25zdCBub2RlID0gZW1pdHRlci5yb290O1xuICAgIGlmIChuYW1lKSBub2RlLnNjb3BlID0gYGxhbmd1YWdlOiR7bmFtZX1gO1xuXG4gICAgdGhpcy5hZGQobm9kZSk7XG4gIH1cblxuICB0b0hUTUwoKSB7XG4gICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgSFRNTFJlbmRlcmVyKHRoaXMsIHRoaXMub3B0aW9ucyk7XG4gICAgcmV0dXJuIHJlbmRlcmVyLnZhbHVlKCk7XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICB0aGlzLmNsb3NlQWxsTm9kZXMoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICogQHJldHVybnMge1JlZ0V4cH1cbiAqICovXG5cbi8qKlxuICogQHBhcmFtIHtSZWdFeHAgfCBzdHJpbmcgfSByZVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gc291cmNlKHJlKSB7XG4gIGlmICghcmUpIHJldHVybiBudWxsO1xuICBpZiAodHlwZW9mIHJlID09PSBcInN0cmluZ1wiKSByZXR1cm4gcmU7XG5cbiAgcmV0dXJuIHJlLnNvdXJjZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1JlZ0V4cCB8IHN0cmluZyB9IHJlXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBsb29rYWhlYWQocmUpIHtcbiAgcmV0dXJuIGNvbmNhdCgnKD89JywgcmUsICcpJyk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtSZWdFeHAgfCBzdHJpbmcgfSByZVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gYW55TnVtYmVyT2ZUaW1lcyhyZSkge1xuICByZXR1cm4gY29uY2F0KCcoPzonLCByZSwgJykqJyk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtSZWdFeHAgfCBzdHJpbmcgfSByZVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gb3B0aW9uYWwocmUpIHtcbiAgcmV0dXJuIGNvbmNhdCgnKD86JywgcmUsICcpPycpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Li4uKFJlZ0V4cCB8IHN0cmluZykgfSBhcmdzXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBjb25jYXQoLi4uYXJncykge1xuICBjb25zdCBqb2luZWQgPSBhcmdzLm1hcCgoeCkgPT4gc291cmNlKHgpKS5qb2luKFwiXCIpO1xuICByZXR1cm4gam9pbmVkO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7IEFycmF5PHN0cmluZyB8IFJlZ0V4cCB8IE9iamVjdD4gfSBhcmdzXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5mdW5jdGlvbiBzdHJpcE9wdGlvbnNGcm9tQXJncyhhcmdzKSB7XG4gIGNvbnN0IG9wdHMgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV07XG5cbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnb2JqZWN0JyAmJiBvcHRzLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgICBhcmdzLnNwbGljZShhcmdzLmxlbmd0aCAtIDEsIDEpO1xuICAgIHJldHVybiBvcHRzO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7fTtcbiAgfVxufVxuXG4vKiogQHR5cGVkZWYgeyB7Y2FwdHVyZT86IGJvb2xlYW59IH0gUmVnZXhFaXRoZXJPcHRpb25zICovXG5cbi8qKlxuICogQW55IG9mIHRoZSBwYXNzZWQgZXhwcmVzc3Npb25zIG1heSBtYXRjaFxuICpcbiAqIENyZWF0ZXMgYSBodWdlIHRoaXMgfCB0aGlzIHwgdGhhdCB8IHRoYXQgbWF0Y2hcbiAqIEBwYXJhbSB7KFJlZ0V4cCB8IHN0cmluZylbXSB8IFsuLi4oUmVnRXhwIHwgc3RyaW5nKVtdLCBSZWdleEVpdGhlck9wdGlvbnNdfSBhcmdzXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBlaXRoZXIoLi4uYXJncykge1xuICAvKiogQHR5cGUgeyBvYmplY3QgJiB7Y2FwdHVyZT86IGJvb2xlYW59IH0gICovXG4gIGNvbnN0IG9wdHMgPSBzdHJpcE9wdGlvbnNGcm9tQXJncyhhcmdzKTtcbiAgY29uc3Qgam9pbmVkID0gJygnXG4gICAgKyAob3B0cy5jYXB0dXJlID8gXCJcIiA6IFwiPzpcIilcbiAgICArIGFyZ3MubWFwKCh4KSA9PiBzb3VyY2UoeCkpLmpvaW4oXCJ8XCIpICsgXCIpXCI7XG4gIHJldHVybiBqb2luZWQ7XG59XG5cbi8qKlxuICogQHBhcmFtIHtSZWdFeHAgfCBzdHJpbmd9IHJlXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBjb3VudE1hdGNoR3JvdXBzKHJlKSB7XG4gIHJldHVybiAobmV3IFJlZ0V4cChyZS50b1N0cmluZygpICsgJ3wnKSkuZXhlYygnJykubGVuZ3RoIC0gMTtcbn1cblxuLyoqXG4gKiBEb2VzIGxleGVtZSBzdGFydCB3aXRoIGEgcmVndWxhciBleHByZXNzaW9uIG1hdGNoIGF0IHRoZSBiZWdpbm5pbmdcbiAqIEBwYXJhbSB7UmVnRXhwfSByZVxuICogQHBhcmFtIHtzdHJpbmd9IGxleGVtZVxuICovXG5mdW5jdGlvbiBzdGFydHNXaXRoKHJlLCBsZXhlbWUpIHtcbiAgY29uc3QgbWF0Y2ggPSByZSAmJiByZS5leGVjKGxleGVtZSk7XG4gIHJldHVybiBtYXRjaCAmJiBtYXRjaC5pbmRleCA9PT0gMDtcbn1cblxuLy8gQkFDS1JFRl9SRSBtYXRjaGVzIGFuIG9wZW4gcGFyZW50aGVzaXMgb3IgYmFja3JlZmVyZW5jZS4gVG8gYXZvaWRcbi8vIGFuIGluY29ycmVjdCBwYXJzZSwgaXQgYWRkaXRpb25hbGx5IG1hdGNoZXMgdGhlIGZvbGxvd2luZzpcbi8vIC0gWy4uLl0gZWxlbWVudHMsIHdoZXJlIHRoZSBtZWFuaW5nIG9mIHBhcmVudGhlc2VzIGFuZCBlc2NhcGVzIGNoYW5nZVxuLy8gLSBvdGhlciBlc2NhcGUgc2VxdWVuY2VzLCBzbyB3ZSBkbyBub3QgbWlzcGFyc2UgZXNjYXBlIHNlcXVlbmNlcyBhc1xuLy8gICBpbnRlcmVzdGluZyBlbGVtZW50c1xuLy8gLSBub24tbWF0Y2hpbmcgb3IgbG9va2FoZWFkIHBhcmVudGhlc2VzLCB3aGljaCBkbyBub3QgY2FwdHVyZS4gVGhlc2Vcbi8vICAgZm9sbG93IHRoZSAnKCcgd2l0aCBhICc/Jy5cbmNvbnN0IEJBQ0tSRUZfUkUgPSAvXFxbKD86W15cXFxcXFxdXXxcXFxcLikqXFxdfFxcKFxcPz98XFxcXChbMS05XVswLTldKil8XFxcXC4vO1xuXG4vLyAqKklOVEVSTkFMKiogTm90IGludGVuZGVkIGZvciBvdXRzaWRlIHVzYWdlXG4vLyBqb2luIGxvZ2ljYWxseSBjb21wdXRlcyByZWdleHBzLmpvaW4oc2VwYXJhdG9yKSwgYnV0IGZpeGVzIHRoZVxuLy8gYmFja3JlZmVyZW5jZXMgc28gdGhleSBjb250aW51ZSB0byBtYXRjaC5cbi8vIGl0IGFsc28gcGxhY2VzIGVhY2ggaW5kaXZpZHVhbCByZWd1bGFyIGV4cHJlc3Npb24gaW50byBpdCdzIG93blxuLy8gbWF0Y2ggZ3JvdXAsIGtlZXBpbmcgdHJhY2sgb2YgdGhlIHNlcXVlbmNpbmcgb2YgdGhvc2UgbWF0Y2ggZ3JvdXBzXG4vLyBpcyBjdXJyZW50bHkgYW4gZXhlcmNpc2UgZm9yIHRoZSBjYWxsZXIuIDotKVxuLyoqXG4gKiBAcGFyYW0geyhzdHJpbmcgfCBSZWdFeHApW119IHJlZ2V4cHNcbiAqIEBwYXJhbSB7e2pvaW5XaXRoOiBzdHJpbmd9fSBvcHRzXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBfcmV3cml0ZUJhY2tyZWZlcmVuY2VzKHJlZ2V4cHMsIHsgam9pbldpdGggfSkge1xuICBsZXQgbnVtQ2FwdHVyZXMgPSAwO1xuXG4gIHJldHVybiByZWdleHBzLm1hcCgocmVnZXgpID0+IHtcbiAgICBudW1DYXB0dXJlcyArPSAxO1xuICAgIGNvbnN0IG9mZnNldCA9IG51bUNhcHR1cmVzO1xuICAgIGxldCByZSA9IHNvdXJjZShyZWdleCk7XG4gICAgbGV0IG91dCA9ICcnO1xuXG4gICAgd2hpbGUgKHJlLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gQkFDS1JFRl9SRS5leGVjKHJlKTtcbiAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgb3V0ICs9IHJlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG91dCArPSByZS5zdWJzdHJpbmcoMCwgbWF0Y2guaW5kZXgpO1xuICAgICAgcmUgPSByZS5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgaWYgKG1hdGNoWzBdWzBdID09PSAnXFxcXCcgJiYgbWF0Y2hbMV0pIHtcbiAgICAgICAgLy8gQWRqdXN0IHRoZSBiYWNrcmVmZXJlbmNlLlxuICAgICAgICBvdXQgKz0gJ1xcXFwnICsgU3RyaW5nKE51bWJlcihtYXRjaFsxXSkgKyBvZmZzZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9IG1hdGNoWzBdO1xuICAgICAgICBpZiAobWF0Y2hbMF0gPT09ICcoJykge1xuICAgICAgICAgIG51bUNhcHR1cmVzKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfSkubWFwKHJlID0+IGAoJHtyZX0pYCkuam9pbihqb2luV2l0aCk7XG59XG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Nb2RlfSBNb2RlICovXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuTW9kZUNhbGxiYWNrfSBNb2RlQ2FsbGJhY2sgKi9cblxuLy8gQ29tbW9uIHJlZ2V4cHNcbmNvbnN0IE1BVENIX05PVEhJTkdfUkUgPSAvXFxiXFxCLztcbmNvbnN0IElERU5UX1JFID0gJ1thLXpBLVpdXFxcXHcqJztcbmNvbnN0IFVOREVSU0NPUkVfSURFTlRfUkUgPSAnW2EtekEtWl9dXFxcXHcqJztcbmNvbnN0IE5VTUJFUl9SRSA9ICdcXFxcYlxcXFxkKyhcXFxcLlxcXFxkKyk/JztcbmNvbnN0IENfTlVNQkVSX1JFID0gJygtPykoXFxcXGIwW3hYXVthLWZBLUYwLTldK3woXFxcXGJcXFxcZCsoXFxcXC5cXFxcZCopP3xcXFxcLlxcXFxkKykoW2VFXVstK10/XFxcXGQrKT8pJzsgLy8gMHguLi4sIDAuLi4sIGRlY2ltYWwsIGZsb2F0XG5jb25zdCBCSU5BUllfTlVNQkVSX1JFID0gJ1xcXFxiKDBiWzAxXSspJzsgLy8gMGIuLi5cbmNvbnN0IFJFX1NUQVJURVJTX1JFID0gJyF8IT18IT09fCV8JT18JnwmJnwmPXxcXFxcKnxcXFxcKj18XFxcXCt8XFxcXCs9fCx8LXwtPXwvPXwvfDp8O3w8PHw8PD18PD18PHw9PT18PT18PXw+Pj49fD4+PXw+PXw+Pj58Pj58PnxcXFxcP3xcXFxcW3xcXFxce3xcXFxcKHxcXFxcXnxcXFxcXj18XFxcXHx8XFxcXHw9fFxcXFx8XFxcXHx8fic7XG5cbi8qKlxuKiBAcGFyYW0geyBQYXJ0aWFsPE1vZGU+ICYge2JpbmFyeT86IHN0cmluZyB8IFJlZ0V4cH0gfSBvcHRzXG4qL1xuY29uc3QgU0hFQkFORyA9IChvcHRzID0ge30pID0+IHtcbiAgY29uc3QgYmVnaW5TaGViYW5nID0gL14jIVsgXSpcXC8vO1xuICBpZiAob3B0cy5iaW5hcnkpIHtcbiAgICBvcHRzLmJlZ2luID0gY29uY2F0KFxuICAgICAgYmVnaW5TaGViYW5nLFxuICAgICAgLy4qXFxiLyxcbiAgICAgIG9wdHMuYmluYXJ5LFxuICAgICAgL1xcYi4qLyk7XG4gIH1cbiAgcmV0dXJuIGluaGVyaXQkMSh7XG4gICAgc2NvcGU6ICdtZXRhJyxcbiAgICBiZWdpbjogYmVnaW5TaGViYW5nLFxuICAgIGVuZDogLyQvLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICAvKiogQHR5cGUge01vZGVDYWxsYmFja30gKi9cbiAgICBcIm9uOmJlZ2luXCI6IChtLCByZXNwKSA9PiB7XG4gICAgICBpZiAobS5pbmRleCAhPT0gMCkgcmVzcC5pZ25vcmVNYXRjaCgpO1xuICAgIH1cbiAgfSwgb3B0cyk7XG59O1xuXG4vLyBDb21tb24gbW9kZXNcbmNvbnN0IEJBQ0tTTEFTSF9FU0NBUEUgPSB7XG4gIGJlZ2luOiAnXFxcXFxcXFxbXFxcXHNcXFxcU10nLCByZWxldmFuY2U6IDBcbn07XG5jb25zdCBBUE9TX1NUUklOR19NT0RFID0ge1xuICBzY29wZTogJ3N0cmluZycsXG4gIGJlZ2luOiAnXFwnJyxcbiAgZW5kOiAnXFwnJyxcbiAgaWxsZWdhbDogJ1xcXFxuJyxcbiAgY29udGFpbnM6IFtCQUNLU0xBU0hfRVNDQVBFXVxufTtcbmNvbnN0IFFVT1RFX1NUUklOR19NT0RFID0ge1xuICBzY29wZTogJ3N0cmluZycsXG4gIGJlZ2luOiAnXCInLFxuICBlbmQ6ICdcIicsXG4gIGlsbGVnYWw6ICdcXFxcbicsXG4gIGNvbnRhaW5zOiBbQkFDS1NMQVNIX0VTQ0FQRV1cbn07XG5jb25zdCBQSFJBU0FMX1dPUkRTX01PREUgPSB7XG4gIGJlZ2luOiAvXFxiKGF8YW58dGhlfGFyZXxJJ218aXNuJ3R8ZG9uJ3R8ZG9lc24ndHx3b24ndHxidXR8anVzdHxzaG91bGR8cHJldHR5fHNpbXBseXxlbm91Z2h8Z29ubmF8Z29pbmd8d3RmfHNvfHN1Y2h8d2lsbHx5b3V8eW91cnx0aGV5fGxpa2V8bW9yZSlcXGIvXG59O1xuLyoqXG4gKiBDcmVhdGVzIGEgY29tbWVudCBtb2RlXG4gKlxuICogQHBhcmFtIHtzdHJpbmcgfCBSZWdFeHB9IGJlZ2luXG4gKiBAcGFyYW0ge3N0cmluZyB8IFJlZ0V4cH0gZW5kXG4gKiBAcGFyYW0ge01vZGUgfCB7fX0gW21vZGVPcHRpb25zXVxuICogQHJldHVybnMge1BhcnRpYWw8TW9kZT59XG4gKi9cbmNvbnN0IENPTU1FTlQgPSBmdW5jdGlvbihiZWdpbiwgZW5kLCBtb2RlT3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IG1vZGUgPSBpbmhlcml0JDEoXG4gICAge1xuICAgICAgc2NvcGU6ICdjb21tZW50JyxcbiAgICAgIGJlZ2luLFxuICAgICAgZW5kLFxuICAgICAgY29udGFpbnM6IFtdXG4gICAgfSxcbiAgICBtb2RlT3B0aW9uc1xuICApO1xuICBtb2RlLmNvbnRhaW5zLnB1c2goe1xuICAgIHNjb3BlOiAnZG9jdGFnJyxcbiAgICAvLyBoYWNrIHRvIGF2b2lkIHRoZSBzcGFjZSBmcm9tIGJlaW5nIGluY2x1ZGVkLiB0aGUgc3BhY2UgaXMgbmVjZXNzYXJ5IHRvXG4gICAgLy8gbWF0Y2ggaGVyZSB0byBwcmV2ZW50IHRoZSBwbGFpbiB0ZXh0IHJ1bGUgYmVsb3cgZnJvbSBnb2JibGluZyB1cCBkb2N0YWdzXG4gICAgYmVnaW46ICdbIF0qKD89KFRPRE98RklYTUV8Tk9URXxCVUd8T1BUSU1JWkV8SEFDS3xYWFgpOiknLFxuICAgIGVuZDogLyhUT0RPfEZJWE1FfE5PVEV8QlVHfE9QVElNSVpFfEhBQ0t8WFhYKTovLFxuICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICByZWxldmFuY2U6IDBcbiAgfSk7XG4gIGNvbnN0IEVOR0xJU0hfV09SRCA9IGVpdGhlcihcbiAgICAvLyBsaXN0IG9mIGNvbW1vbiAxIGFuZCAyIGxldHRlciB3b3JkcyBpbiBFbmdsaXNoXG4gICAgXCJJXCIsXG4gICAgXCJhXCIsXG4gICAgXCJpc1wiLFxuICAgIFwic29cIixcbiAgICBcInVzXCIsXG4gICAgXCJ0b1wiLFxuICAgIFwiYXRcIixcbiAgICBcImlmXCIsXG4gICAgXCJpblwiLFxuICAgIFwiaXRcIixcbiAgICBcIm9uXCIsXG4gICAgLy8gbm90ZTogdGhpcyBpcyBub3QgYW4gZXhoYXVzdGl2ZSBsaXN0IG9mIGNvbnRyYWN0aW9ucywganVzdCBwb3B1bGFyIG9uZXNcbiAgICAvW0EtWmEtel0rWyddKGR8dmV8cmV8bGx8dHxzfG4pLywgLy8gY29udHJhY3Rpb25zIC0gY2FuJ3Qgd2UnZCB0aGV5J3JlIGxldCdzLCBldGNcbiAgICAvW0EtWmEtel0rWy1dW2Etel0rLywgLy8gYG5vLXdheWAsIGV0Yy5cbiAgICAvW0EtWmEtel1bYS16XXsyLH0vIC8vIGFsbG93IGNhcGl0YWxpemVkIHdvcmRzIGF0IGJlZ2lubmluZyBvZiBzZW50ZW5jZXNcbiAgKTtcbiAgLy8gbG9va2luZyBsaWtlIHBsYWluIHRleHQsIG1vcmUgbGlrZWx5IHRvIGJlIGEgY29tbWVudFxuICBtb2RlLmNvbnRhaW5zLnB1c2goXG4gICAge1xuICAgICAgLy8gVE9ETzogaG93IHRvIGluY2x1ZGUgXCIsICgsICkgd2l0aG91dCBicmVha2luZyBncmFtbWFycyB0aGF0IHVzZSB0aGVzZSBmb3JcbiAgICAgIC8vIGNvbW1lbnQgZGVsaW1pdGVycz9cbiAgICAgIC8vIGJlZ2luOiAvWyBdKyhbKClcIl0/KFtBLVphLXonLV17Myx9fGlzfGF8SXxzb3x1c3xbdFRdW29PXXxhdHxpZnxpbnxpdHxvbilbLl0/WygpXCI6XT8oWy5dWyBdfFsgXXxcXCkpKXszfS9cbiAgICAgIC8vIC0tLVxuXG4gICAgICAvLyB0aGlzIHRyaWVzIHRvIGZpbmQgc2VxdWVuY2VzIG9mIDMgZW5nbGlzaCB3b3JkcyBpbiBhIHJvdyAod2l0aG91dCBhbnlcbiAgICAgIC8vIFwicHJvZ3JhbW1pbmdcIiB0eXBlIHN5bnRheCkgdGhpcyBnaXZlcyB1cyBhIHN0cm9uZyBzaWduYWwgdGhhdCB3ZSd2ZVxuICAgICAgLy8gVFJVTFkgZm91bmQgYSBjb21tZW50IC0gdnMgcGVyaGFwcyBzY2FubmluZyB3aXRoIHRoZSB3cm9uZyBsYW5ndWFnZS5cbiAgICAgIC8vIEl0J3MgcG9zc2libGUgdG8gZmluZCBzb21ldGhpbmcgdGhhdCBMT09LUyBsaWtlIHRoZSBzdGFydCBvZiB0aGVcbiAgICAgIC8vIGNvbW1lbnQgLSBidXQgdGhlbiBpZiB0aGVyZSBpcyBubyByZWFkYWJsZSB0ZXh0IC0gZ29vZCBjaGFuY2UgaXQgaXMgYVxuICAgICAgLy8gZmFsc2UgbWF0Y2ggYW5kIG5vdCBhIGNvbW1lbnQuXG4gICAgICAvL1xuICAgICAgLy8gZm9yIGEgdmlzdWFsIGV4YW1wbGUgcGxlYXNlIHNlZTpcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9oaWdobGlnaHRqcy9oaWdobGlnaHQuanMvaXNzdWVzLzI4MjdcblxuICAgICAgYmVnaW46IGNvbmNhdChcbiAgICAgICAgL1sgXSsvLCAvLyBuZWNlc3NhcnkgdG8gcHJldmVudCB1cyBnb2JibGluZyB1cCBkb2N0YWdzIGxpa2UgLyogQGF1dGhvciBCb2IgTWNnaWxsICovXG4gICAgICAgICcoJyxcbiAgICAgICAgRU5HTElTSF9XT1JELFxuICAgICAgICAvWy5dP1s6XT8oWy5dWyBdfFsgXSkvLFxuICAgICAgICAnKXszfScpIC8vIGxvb2sgZm9yIDMgd29yZHMgaW4gYSByb3dcbiAgICB9XG4gICk7XG4gIHJldHVybiBtb2RlO1xufTtcbmNvbnN0IENfTElORV9DT01NRU5UX01PREUgPSBDT01NRU5UKCcvLycsICckJyk7XG5jb25zdCBDX0JMT0NLX0NPTU1FTlRfTU9ERSA9IENPTU1FTlQoJy9cXFxcKicsICdcXFxcKi8nKTtcbmNvbnN0IEhBU0hfQ09NTUVOVF9NT0RFID0gQ09NTUVOVCgnIycsICckJyk7XG5jb25zdCBOVU1CRVJfTU9ERSA9IHtcbiAgc2NvcGU6ICdudW1iZXInLFxuICBiZWdpbjogTlVNQkVSX1JFLFxuICByZWxldmFuY2U6IDBcbn07XG5jb25zdCBDX05VTUJFUl9NT0RFID0ge1xuICBzY29wZTogJ251bWJlcicsXG4gIGJlZ2luOiBDX05VTUJFUl9SRSxcbiAgcmVsZXZhbmNlOiAwXG59O1xuY29uc3QgQklOQVJZX05VTUJFUl9NT0RFID0ge1xuICBzY29wZTogJ251bWJlcicsXG4gIGJlZ2luOiBCSU5BUllfTlVNQkVSX1JFLFxuICByZWxldmFuY2U6IDBcbn07XG5jb25zdCBSRUdFWFBfTU9ERSA9IHtcbiAgc2NvcGU6IFwicmVnZXhwXCIsXG4gIGJlZ2luOiAvXFwvKD89W14vXFxuXSpcXC8pLyxcbiAgZW5kOiAvXFwvW2dpbXV5XSovLFxuICBjb250YWluczogW1xuICAgIEJBQ0tTTEFTSF9FU0NBUEUsXG4gICAge1xuICAgICAgYmVnaW46IC9cXFsvLFxuICAgICAgZW5kOiAvXFxdLyxcbiAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgIGNvbnRhaW5zOiBbQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICB9XG4gIF1cbn07XG5jb25zdCBUSVRMRV9NT0RFID0ge1xuICBzY29wZTogJ3RpdGxlJyxcbiAgYmVnaW46IElERU5UX1JFLFxuICByZWxldmFuY2U6IDBcbn07XG5jb25zdCBVTkRFUlNDT1JFX1RJVExFX01PREUgPSB7XG4gIHNjb3BlOiAndGl0bGUnLFxuICBiZWdpbjogVU5ERVJTQ09SRV9JREVOVF9SRSxcbiAgcmVsZXZhbmNlOiAwXG59O1xuY29uc3QgTUVUSE9EX0dVQVJEID0ge1xuICAvLyBleGNsdWRlcyBtZXRob2QgbmFtZXMgZnJvbSBrZXl3b3JkIHByb2Nlc3NpbmdcbiAgYmVnaW46ICdcXFxcLlxcXFxzKicgKyBVTkRFUlNDT1JFX0lERU5UX1JFLFxuICByZWxldmFuY2U6IDBcbn07XG5cbi8qKlxuICogQWRkcyBlbmQgc2FtZSBhcyBiZWdpbiBtZWNoYW5pY3MgdG8gYSBtb2RlXG4gKlxuICogWW91ciBtb2RlIG11c3QgaW5jbHVkZSBhdCBsZWFzdCBhIHNpbmdsZSAoKSBtYXRjaCBncm91cCBhcyB0aGF0IGZpcnN0IG1hdGNoXG4gKiBncm91cCBpcyB3aGF0IGlzIHVzZWQgZm9yIGNvbXBhcmlzb25cbiAqIEBwYXJhbSB7UGFydGlhbDxNb2RlPn0gbW9kZVxuICovXG5jb25zdCBFTkRfU0FNRV9BU19CRUdJTiA9IGZ1bmN0aW9uKG1vZGUpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24obW9kZSxcbiAgICB7XG4gICAgICAvKiogQHR5cGUge01vZGVDYWxsYmFja30gKi9cbiAgICAgICdvbjpiZWdpbic6IChtLCByZXNwKSA9PiB7IHJlc3AuZGF0YS5fYmVnaW5NYXRjaCA9IG1bMV07IH0sXG4gICAgICAvKiogQHR5cGUge01vZGVDYWxsYmFja30gKi9cbiAgICAgICdvbjplbmQnOiAobSwgcmVzcCkgPT4geyBpZiAocmVzcC5kYXRhLl9iZWdpbk1hdGNoICE9PSBtWzFdKSByZXNwLmlnbm9yZU1hdGNoKCk7IH1cbiAgICB9KTtcbn07XG5cbnZhciBNT0RFUyA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgX19wcm90b19fOiBudWxsLFxuICBBUE9TX1NUUklOR19NT0RFOiBBUE9TX1NUUklOR19NT0RFLFxuICBCQUNLU0xBU0hfRVNDQVBFOiBCQUNLU0xBU0hfRVNDQVBFLFxuICBCSU5BUllfTlVNQkVSX01PREU6IEJJTkFSWV9OVU1CRVJfTU9ERSxcbiAgQklOQVJZX05VTUJFUl9SRTogQklOQVJZX05VTUJFUl9SRSxcbiAgQ09NTUVOVDogQ09NTUVOVCxcbiAgQ19CTE9DS19DT01NRU5UX01PREU6IENfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICBDX0xJTkVfQ09NTUVOVF9NT0RFOiBDX0xJTkVfQ09NTUVOVF9NT0RFLFxuICBDX05VTUJFUl9NT0RFOiBDX05VTUJFUl9NT0RFLFxuICBDX05VTUJFUl9SRTogQ19OVU1CRVJfUkUsXG4gIEVORF9TQU1FX0FTX0JFR0lOOiBFTkRfU0FNRV9BU19CRUdJTixcbiAgSEFTSF9DT01NRU5UX01PREU6IEhBU0hfQ09NTUVOVF9NT0RFLFxuICBJREVOVF9SRTogSURFTlRfUkUsXG4gIE1BVENIX05PVEhJTkdfUkU6IE1BVENIX05PVEhJTkdfUkUsXG4gIE1FVEhPRF9HVUFSRDogTUVUSE9EX0dVQVJELFxuICBOVU1CRVJfTU9ERTogTlVNQkVSX01PREUsXG4gIE5VTUJFUl9SRTogTlVNQkVSX1JFLFxuICBQSFJBU0FMX1dPUkRTX01PREU6IFBIUkFTQUxfV09SRFNfTU9ERSxcbiAgUVVPVEVfU1RSSU5HX01PREU6IFFVT1RFX1NUUklOR19NT0RFLFxuICBSRUdFWFBfTU9ERTogUkVHRVhQX01PREUsXG4gIFJFX1NUQVJURVJTX1JFOiBSRV9TVEFSVEVSU19SRSxcbiAgU0hFQkFORzogU0hFQkFORyxcbiAgVElUTEVfTU9ERTogVElUTEVfTU9ERSxcbiAgVU5ERVJTQ09SRV9JREVOVF9SRTogVU5ERVJTQ09SRV9JREVOVF9SRSxcbiAgVU5ERVJTQ09SRV9USVRMRV9NT0RFOiBVTkRFUlNDT1JFX1RJVExFX01PREVcbn0pO1xuXG4vKipcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkNhbGxiYWNrUmVzcG9uc2V9IENhbGxiYWNrUmVzcG9uc2VcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkNvbXBpbGVyRXh0fSBDb21waWxlckV4dFxuKi9cblxuLy8gR3JhbW1hciBleHRlbnNpb25zIC8gcGx1Z2luc1xuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vaGlnaGxpZ2h0anMvaGlnaGxpZ2h0LmpzL2lzc3Vlcy8yODMzXG5cbi8vIEdyYW1tYXIgZXh0ZW5zaW9ucyBhbGxvdyBcInN5bnRhY3RpYyBzdWdhclwiIHRvIGJlIGFkZGVkIHRvIHRoZSBncmFtbWFyIG1vZGVzXG4vLyB3aXRob3V0IHJlcXVpcmluZyBhbnkgdW5kZXJseWluZyBjaGFuZ2VzIHRvIHRoZSBjb21waWxlciBpbnRlcm5hbHMuXG5cbi8vIGBjb21waWxlTWF0Y2hgIGJlaW5nIHRoZSBwZXJmZWN0IHNtYWxsIGV4YW1wbGUgb2Ygbm93IGFsbG93aW5nIGEgZ3JhbW1hclxuLy8gYXV0aG9yIHRvIHdyaXRlIGBtYXRjaGAgd2hlbiB0aGV5IGRlc2lyZSB0byBtYXRjaCBhIHNpbmdsZSBleHByZXNzaW9uIHJhdGhlclxuLy8gdGhhbiBiZWluZyBmb3JjZWQgdG8gdXNlIGBiZWdpbmAuICBUaGUgZXh0ZW5zaW9uIHRoZW4ganVzdCBtb3ZlcyBgbWF0Y2hgIGludG9cbi8vIGBiZWdpbmAgd2hlbiBpdCBydW5zLiAgSWUsIG5vIGZlYXR1cmVzIGhhdmUgYmVlbiBhZGRlZCwgYnV0IHdlJ3ZlIGp1c3QgbWFkZVxuLy8gdGhlIGV4cGVyaWVuY2Ugb2Ygd3JpdGluZyAoYW5kIHJlYWRpbmcgZ3JhbW1hcnMpIGEgbGl0dGxlIGJpdCBuaWNlci5cblxuLy8gLS0tLS0tXG5cbi8vIFRPRE86IFdlIG5lZWQgbmVnYXRpdmUgbG9vay1iZWhpbmQgc3VwcG9ydCB0byBkbyB0aGlzIHByb3Blcmx5XG4vKipcbiAqIFNraXAgYSBtYXRjaCBpZiBpdCBoYXMgYSBwcmVjZWRpbmcgZG90XG4gKlxuICogVGhpcyBpcyB1c2VkIGZvciBgYmVnaW5LZXl3b3Jkc2AgdG8gcHJldmVudCBtYXRjaGluZyBleHByZXNzaW9ucyBzdWNoIGFzXG4gKiBgYm9iLmtleXdvcmQuZG8oKWAuIFRoZSBtb2RlIGNvbXBpbGVyIGF1dG9tYXRpY2FsbHkgd2lyZXMgdGhpcyB1cCBhcyBhXG4gKiBzcGVjaWFsIF9pbnRlcm5hbF8gJ29uOmJlZ2luJyBjYWxsYmFjayBmb3IgbW9kZXMgd2l0aCBgYmVnaW5LZXl3b3Jkc2BcbiAqIEBwYXJhbSB7UmVnRXhwTWF0Y2hBcnJheX0gbWF0Y2hcbiAqIEBwYXJhbSB7Q2FsbGJhY2tSZXNwb25zZX0gcmVzcG9uc2VcbiAqL1xuZnVuY3Rpb24gc2tpcElmSGFzUHJlY2VkaW5nRG90KG1hdGNoLCByZXNwb25zZSkge1xuICBjb25zdCBiZWZvcmUgPSBtYXRjaC5pbnB1dFttYXRjaC5pbmRleCAtIDFdO1xuICBpZiAoYmVmb3JlID09PSBcIi5cIikge1xuICAgIHJlc3BvbnNlLmlnbm9yZU1hdGNoKCk7XG4gIH1cbn1cblxuLyoqXG4gKlxuICogQHR5cGUge0NvbXBpbGVyRXh0fVxuICovXG5mdW5jdGlvbiBzY29wZUNsYXNzTmFtZShtb2RlLCBfcGFyZW50KSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZmluZWRcbiAgaWYgKG1vZGUuY2xhc3NOYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICBtb2RlLnNjb3BlID0gbW9kZS5jbGFzc05hbWU7XG4gICAgZGVsZXRlIG1vZGUuY2xhc3NOYW1lO1xuICB9XG59XG5cbi8qKlxuICogYGJlZ2luS2V5d29yZHNgIHN5bnRhY3RpYyBzdWdhclxuICogQHR5cGUge0NvbXBpbGVyRXh0fVxuICovXG5mdW5jdGlvbiBiZWdpbktleXdvcmRzKG1vZGUsIHBhcmVudCkge1xuICBpZiAoIXBhcmVudCkgcmV0dXJuO1xuICBpZiAoIW1vZGUuYmVnaW5LZXl3b3JkcykgcmV0dXJuO1xuXG4gIC8vIGZvciBsYW5ndWFnZXMgd2l0aCBrZXl3b3JkcyB0aGF0IGluY2x1ZGUgbm9uLXdvcmQgY2hhcmFjdGVycyBjaGVja2luZyBmb3JcbiAgLy8gYSB3b3JkIGJvdW5kYXJ5IGlzIG5vdCBzdWZmaWNpZW50LCBzbyBpbnN0ZWFkIHdlIGNoZWNrIGZvciBhIHdvcmQgYm91bmRhcnlcbiAgLy8gb3Igd2hpdGVzcGFjZSAtIHRoaXMgZG9lcyBubyBoYXJtIGluIGFueSBjYXNlIHNpbmNlIG91ciBrZXl3b3JkIGVuZ2luZVxuICAvLyBkb2Vzbid0IGFsbG93IHNwYWNlcyBpbiBrZXl3b3JkcyBhbnl3YXlzIGFuZCB3ZSBzdGlsbCBjaGVjayBmb3IgdGhlIGJvdW5kYXJ5XG4gIC8vIGZpcnN0XG4gIG1vZGUuYmVnaW4gPSAnXFxcXGIoJyArIG1vZGUuYmVnaW5LZXl3b3Jkcy5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcpKD8hXFxcXC4pKD89XFxcXGJ8XFxcXHMpJztcbiAgbW9kZS5fX2JlZm9yZUJlZ2luID0gc2tpcElmSGFzUHJlY2VkaW5nRG90O1xuICBtb2RlLmtleXdvcmRzID0gbW9kZS5rZXl3b3JkcyB8fCBtb2RlLmJlZ2luS2V5d29yZHM7XG4gIGRlbGV0ZSBtb2RlLmJlZ2luS2V5d29yZHM7XG5cbiAgLy8gcHJldmVudHMgZG91YmxlIHJlbGV2YW5jZSwgdGhlIGtleXdvcmRzIHRoZW1zZWx2ZXMgcHJvdmlkZVxuICAvLyByZWxldmFuY2UsIHRoZSBtb2RlIGRvZXNuJ3QgbmVlZCB0byBkb3VibGUgaXRcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmaW5lZFxuICBpZiAobW9kZS5yZWxldmFuY2UgPT09IHVuZGVmaW5lZCkgbW9kZS5yZWxldmFuY2UgPSAwO1xufVxuXG4vKipcbiAqIEFsbG93IGBpbGxlZ2FsYCB0byBjb250YWluIGFuIGFycmF5IG9mIGlsbGVnYWwgdmFsdWVzXG4gKiBAdHlwZSB7Q29tcGlsZXJFeHR9XG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGVJbGxlZ2FsKG1vZGUsIF9wYXJlbnQpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KG1vZGUuaWxsZWdhbCkpIHJldHVybjtcblxuICBtb2RlLmlsbGVnYWwgPSBlaXRoZXIoLi4ubW9kZS5pbGxlZ2FsKTtcbn1cblxuLyoqXG4gKiBgbWF0Y2hgIHRvIG1hdGNoIGEgc2luZ2xlIGV4cHJlc3Npb24gZm9yIHJlYWRhYmlsaXR5XG4gKiBAdHlwZSB7Q29tcGlsZXJFeHR9XG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGVNYXRjaChtb2RlLCBfcGFyZW50KSB7XG4gIGlmICghbW9kZS5tYXRjaCkgcmV0dXJuO1xuICBpZiAobW9kZS5iZWdpbiB8fCBtb2RlLmVuZCkgdGhyb3cgbmV3IEVycm9yKFwiYmVnaW4gJiBlbmQgYXJlIG5vdCBzdXBwb3J0ZWQgd2l0aCBtYXRjaFwiKTtcblxuICBtb2RlLmJlZ2luID0gbW9kZS5tYXRjaDtcbiAgZGVsZXRlIG1vZGUubWF0Y2g7XG59XG5cbi8qKlxuICogcHJvdmlkZXMgdGhlIGRlZmF1bHQgMSByZWxldmFuY2UgdG8gYWxsIG1vZGVzXG4gKiBAdHlwZSB7Q29tcGlsZXJFeHR9XG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGVSZWxldmFuY2UobW9kZSwgX3BhcmVudCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gIGlmIChtb2RlLnJlbGV2YW5jZSA9PT0gdW5kZWZpbmVkKSBtb2RlLnJlbGV2YW5jZSA9IDE7XG59XG5cbi8vIGFsbG93IGJlZm9yZU1hdGNoIHRvIGFjdCBhcyBhIFwicXVhbGlmaWVyXCIgZm9yIHRoZSBtYXRjaFxuLy8gdGhlIGZ1bGwgbWF0Y2ggYmVnaW4gbXVzdCBiZSBbYmVmb3JlTWF0Y2hdW2JlZ2luXVxuY29uc3QgYmVmb3JlTWF0Y2hFeHQgPSAobW9kZSwgcGFyZW50KSA9PiB7XG4gIGlmICghbW9kZS5iZWZvcmVNYXRjaCkgcmV0dXJuO1xuICAvLyBzdGFydHMgY29uZmxpY3RzIHdpdGggZW5kc1BhcmVudCB3aGljaCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGUgY2hpbGRcbiAgLy8gcnVsZSBpcyBub3QgbWF0Y2hlZCBtdWx0aXBsZSB0aW1lc1xuICBpZiAobW9kZS5zdGFydHMpIHRocm93IG5ldyBFcnJvcihcImJlZm9yZU1hdGNoIGNhbm5vdCBiZSB1c2VkIHdpdGggc3RhcnRzXCIpO1xuXG4gIGNvbnN0IG9yaWdpbmFsTW9kZSA9IE9iamVjdC5hc3NpZ24oe30sIG1vZGUpO1xuICBPYmplY3Qua2V5cyhtb2RlKS5mb3JFYWNoKChrZXkpID0+IHsgZGVsZXRlIG1vZGVba2V5XTsgfSk7XG5cbiAgbW9kZS5rZXl3b3JkcyA9IG9yaWdpbmFsTW9kZS5rZXl3b3JkcztcbiAgbW9kZS5iZWdpbiA9IGNvbmNhdChvcmlnaW5hbE1vZGUuYmVmb3JlTWF0Y2gsIGxvb2thaGVhZChvcmlnaW5hbE1vZGUuYmVnaW4pKTtcbiAgbW9kZS5zdGFydHMgPSB7XG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBPYmplY3QuYXNzaWduKG9yaWdpbmFsTW9kZSwgeyBlbmRzUGFyZW50OiB0cnVlIH0pXG4gICAgXVxuICB9O1xuICBtb2RlLnJlbGV2YW5jZSA9IDA7XG5cbiAgZGVsZXRlIG9yaWdpbmFsTW9kZS5iZWZvcmVNYXRjaDtcbn07XG5cbi8vIGtleXdvcmRzIHRoYXQgc2hvdWxkIGhhdmUgbm8gZGVmYXVsdCByZWxldmFuY2UgdmFsdWVcbmNvbnN0IENPTU1PTl9LRVlXT1JEUyA9IFtcbiAgJ29mJyxcbiAgJ2FuZCcsXG4gICdmb3InLFxuICAnaW4nLFxuICAnbm90JyxcbiAgJ29yJyxcbiAgJ2lmJyxcbiAgJ3RoZW4nLFxuICAncGFyZW50JywgLy8gY29tbW9uIHZhcmlhYmxlIG5hbWVcbiAgJ2xpc3QnLCAvLyBjb21tb24gdmFyaWFibGUgbmFtZVxuICAndmFsdWUnIC8vIGNvbW1vbiB2YXJpYWJsZSBuYW1lXG5dO1xuXG5jb25zdCBERUZBVUxUX0tFWVdPUkRfU0NPUEUgPSBcImtleXdvcmRcIjtcblxuLyoqXG4gKiBHaXZlbiByYXcga2V5d29yZHMgZnJvbSBhIGxhbmd1YWdlIGRlZmluaXRpb24sIGNvbXBpbGUgdGhlbS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB8IFJlY29yZDxzdHJpbmcsc3RyaW5nfHN0cmluZ1tdPiB8IEFycmF5PHN0cmluZz59IHJhd0tleXdvcmRzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNhc2VJbnNlbnNpdGl2ZVxuICovXG5mdW5jdGlvbiBjb21waWxlS2V5d29yZHMocmF3S2V5d29yZHMsIGNhc2VJbnNlbnNpdGl2ZSwgc2NvcGVOYW1lID0gREVGQVVMVF9LRVlXT1JEX1NDT1BFKSB7XG4gIC8qKiBAdHlwZSB7aW1wb3J0KFwiaGlnaGxpZ2h0LmpzL3ByaXZhdGVcIikuS2V5d29yZERpY3R9ICovXG4gIGNvbnN0IGNvbXBpbGVkS2V5d29yZHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIC8vIGlucHV0IGNhbiBiZSBhIHN0cmluZyBvZiBrZXl3b3JkcywgYW4gYXJyYXkgb2Yga2V5d29yZHMsIG9yIGEgb2JqZWN0IHdpdGhcbiAgLy8gbmFtZWQga2V5cyByZXByZXNlbnRpbmcgc2NvcGVOYW1lICh3aGljaCBjYW4gdGhlbiBwb2ludCB0byBhIHN0cmluZyBvciBhcnJheSlcbiAgaWYgKHR5cGVvZiByYXdLZXl3b3JkcyA9PT0gJ3N0cmluZycpIHtcbiAgICBjb21waWxlTGlzdChzY29wZU5hbWUsIHJhd0tleXdvcmRzLnNwbGl0KFwiIFwiKSk7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyYXdLZXl3b3JkcykpIHtcbiAgICBjb21waWxlTGlzdChzY29wZU5hbWUsIHJhd0tleXdvcmRzKTtcbiAgfSBlbHNlIHtcbiAgICBPYmplY3Qua2V5cyhyYXdLZXl3b3JkcykuZm9yRWFjaChmdW5jdGlvbihzY29wZU5hbWUpIHtcbiAgICAgIC8vIGNvbGxhcHNlIGFsbCBvdXIgb2JqZWN0cyBiYWNrIGludG8gdGhlIHBhcmVudCBvYmplY3RcbiAgICAgIE9iamVjdC5hc3NpZ24oXG4gICAgICAgIGNvbXBpbGVkS2V5d29yZHMsXG4gICAgICAgIGNvbXBpbGVLZXl3b3JkcyhyYXdLZXl3b3Jkc1tzY29wZU5hbWVdLCBjYXNlSW5zZW5zaXRpdmUsIHNjb3BlTmFtZSlcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGNvbXBpbGVkS2V5d29yZHM7XG5cbiAgLy8gLS0tXG5cbiAgLyoqXG4gICAqIENvbXBpbGVzIGFuIGluZGl2aWR1YWwgbGlzdCBvZiBrZXl3b3Jkc1xuICAgKlxuICAgKiBFeDogXCJmb3IgaWYgd2hlbiB3aGlsZXw1XCJcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjb3BlTmFtZVxuICAgKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IGtleXdvcmRMaXN0XG4gICAqL1xuICBmdW5jdGlvbiBjb21waWxlTGlzdChzY29wZU5hbWUsIGtleXdvcmRMaXN0KSB7XG4gICAgaWYgKGNhc2VJbnNlbnNpdGl2ZSkge1xuICAgICAga2V5d29yZExpc3QgPSBrZXl3b3JkTGlzdC5tYXAoeCA9PiB4LnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cbiAgICBrZXl3b3JkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGtleXdvcmQpIHtcbiAgICAgIGNvbnN0IHBhaXIgPSBrZXl3b3JkLnNwbGl0KCd8Jyk7XG4gICAgICBjb21waWxlZEtleXdvcmRzW3BhaXJbMF1dID0gW3Njb3BlTmFtZSwgc2NvcmVGb3JLZXl3b3JkKHBhaXJbMF0sIHBhaXJbMV0pXTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHByb3BlciBzY29yZSBmb3IgYSBnaXZlbiBrZXl3b3JkXG4gKlxuICogQWxzbyB0YWtlcyBpbnRvIGFjY291bnQgY29tbWVudCBrZXl3b3Jkcywgd2hpY2ggd2lsbCBiZSBzY29yZWQgMCBVTkxFU1NcbiAqIGFub3RoZXIgc2NvcmUgaGFzIGJlZW4gbWFudWFsbHkgYXNzaWduZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5d29yZFxuICogQHBhcmFtIHtzdHJpbmd9IFtwcm92aWRlZFNjb3JlXVxuICovXG5mdW5jdGlvbiBzY29yZUZvcktleXdvcmQoa2V5d29yZCwgcHJvdmlkZWRTY29yZSkge1xuICAvLyBtYW51YWwgc2NvcmVzIGFsd2F5cyB3aW4gb3ZlciBjb21tb24ga2V5d29yZHNcbiAgLy8gc28geW91IGNhbiBmb3JjZSBhIHNjb3JlIG9mIDEgaWYgeW91IHJlYWxseSBpbnNpc3RcbiAgaWYgKHByb3ZpZGVkU2NvcmUpIHtcbiAgICByZXR1cm4gTnVtYmVyKHByb3ZpZGVkU2NvcmUpO1xuICB9XG5cbiAgcmV0dXJuIGNvbW1vbktleXdvcmQoa2V5d29yZCkgPyAwIDogMTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIGEgZ2l2ZW4ga2V5d29yZCBpcyBjb21tb24gb3Igbm90XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleXdvcmQgKi9cbmZ1bmN0aW9uIGNvbW1vbktleXdvcmQoa2V5d29yZCkge1xuICByZXR1cm4gQ09NTU9OX0tFWVdPUkRTLmluY2x1ZGVzKGtleXdvcmQudG9Mb3dlckNhc2UoKSk7XG59XG5cbi8qXG5cbkZvciB0aGUgcmVhc29uaW5nIGJlaGluZCB0aGlzIHBsZWFzZSBzZWU6XG5odHRwczovL2dpdGh1Yi5jb20vaGlnaGxpZ2h0anMvaGlnaGxpZ2h0LmpzL2lzc3Vlcy8yODgwI2lzc3VlY29tbWVudC03NDcyNzU0MTlcblxuKi9cblxuLyoqXG4gKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgYm9vbGVhbj59XG4gKi9cbmNvbnN0IHNlZW5EZXByZWNhdGlvbnMgPSB7fTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICovXG5jb25zdCBlcnJvciA9IChtZXNzYWdlKSA9PiB7XG4gIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gKiBAcGFyYW0ge2FueX0gYXJnc1xuICovXG5jb25zdCB3YXJuID0gKG1lc3NhZ2UsIC4uLmFyZ3MpID0+IHtcbiAgY29uc29sZS5sb2coYFdBUk46ICR7bWVzc2FnZX1gLCAuLi5hcmdzKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHZlcnNpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gKi9cbmNvbnN0IGRlcHJlY2F0ZWQgPSAodmVyc2lvbiwgbWVzc2FnZSkgPT4ge1xuICBpZiAoc2VlbkRlcHJlY2F0aW9uc1tgJHt2ZXJzaW9ufS8ke21lc3NhZ2V9YF0pIHJldHVybjtcblxuICBjb25zb2xlLmxvZyhgRGVwcmVjYXRlZCBhcyBvZiAke3ZlcnNpb259LiAke21lc3NhZ2V9YCk7XG4gIHNlZW5EZXByZWNhdGlvbnNbYCR7dmVyc2lvbn0vJHttZXNzYWdlfWBdID0gdHJ1ZTtcbn07XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXRocm93LWxpdGVyYWwgKi9cblxuLyoqXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Db21waWxlZE1vZGV9IENvbXBpbGVkTW9kZVxuKi9cblxuY29uc3QgTXVsdGlDbGFzc0Vycm9yID0gbmV3IEVycm9yKCk7XG5cbi8qKlxuICogUmVudW1iZXJzIGxhYmVsZWQgc2NvcGUgbmFtZXMgdG8gYWNjb3VudCBmb3IgYWRkaXRpb25hbCBpbm5lciBtYXRjaFxuICogZ3JvdXBzIHRoYXQgb3RoZXJ3aXNlIHdvdWxkIGJyZWFrIGV2ZXJ5dGhpbmcuXG4gKlxuICogTGV0cyBzYXkgd2UgMyBtYXRjaCBzY29wZXM6XG4gKlxuICogICB7IDEgPT4gLi4uLCAyID0+IC4uLiwgMyA9PiAuLi4gfVxuICpcbiAqIFNvIHdoYXQgd2UgbmVlZCBpcyBhIGNsZWFuIG1hdGNoIGxpa2UgdGhpczpcbiAqXG4gKiAgIChhKShiKShjKSA9PiBbIFwiYVwiLCBcImJcIiwgXCJjXCIgXVxuICpcbiAqIEJ1dCB0aGlzIGZhbGxzIGFwYXJ0IHdpdGggaW5uZXIgbWF0Y2ggZ3JvdXBzOlxuICpcbiAqIChhKSgoKGIpKSkoYykgPT4gW1wiYVwiLCBcImJcIiwgXCJiXCIsIFwiYlwiLCBcImNcIiBdXG4gKlxuICogT3VyIHNjb3BlcyBhcmUgbm93IFwib3V0IG9mIGFsaWdubWVudFwiIGFuZCB3ZSdyZSByZXBlYXRpbmcgYGJgIDMgdGltZXMuXG4gKiBXaGF0IG5lZWRzIHRvIGhhcHBlbiBpcyB0aGUgbnVtYmVycyBhcmUgcmVtYXBwZWQ6XG4gKlxuICogICB7IDEgPT4gLi4uLCAyID0+IC4uLiwgNSA9PiAuLi4gfVxuICpcbiAqIFdlIGFsc28gbmVlZCB0byBrbm93IHRoYXQgdGhlIE9OTFkgZ3JvdXBzIHRoYXQgc2hvdWxkIGJlIG91dHB1dFxuICogYXJlIDEsIDIsIGFuZCA1LiAgVGhpcyBmdW5jdGlvbiBoYW5kbGVzIHRoaXMgYmVoYXZpb3IuXG4gKlxuICogQHBhcmFtIHtDb21waWxlZE1vZGV9IG1vZGVcbiAqIEBwYXJhbSB7QXJyYXk8UmVnRXhwIHwgc3RyaW5nPn0gcmVnZXhlc1xuICogQHBhcmFtIHt7a2V5OiBcImJlZ2luU2NvcGVcInxcImVuZFNjb3BlXCJ9fSBvcHRzXG4gKi9cbmZ1bmN0aW9uIHJlbWFwU2NvcGVOYW1lcyhtb2RlLCByZWdleGVzLCB7IGtleSB9KSB7XG4gIGxldCBvZmZzZXQgPSAwO1xuICBjb25zdCBzY29wZU5hbWVzID0gbW9kZVtrZXldO1xuICAvKiogQHR5cGUgUmVjb3JkPG51bWJlcixib29sZWFuPiAqL1xuICBjb25zdCBlbWl0ID0ge307XG4gIC8qKiBAdHlwZSBSZWNvcmQ8bnVtYmVyLHN0cmluZz4gKi9cbiAgY29uc3QgcG9zaXRpb25zID0ge307XG5cbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcmVnZXhlcy5sZW5ndGg7IGkrKykge1xuICAgIHBvc2l0aW9uc1tpICsgb2Zmc2V0XSA9IHNjb3BlTmFtZXNbaV07XG4gICAgZW1pdFtpICsgb2Zmc2V0XSA9IHRydWU7XG4gICAgb2Zmc2V0ICs9IGNvdW50TWF0Y2hHcm91cHMocmVnZXhlc1tpIC0gMV0pO1xuICB9XG4gIC8vIHdlIHVzZSBfZW1pdCB0byBrZWVwIHRyYWNrIG9mIHdoaWNoIG1hdGNoIGdyb3VwcyBhcmUgXCJ0b3AtbGV2ZWxcIiB0byBhdm9pZCBkb3VibGVcbiAgLy8gb3V0cHV0IGZyb20gaW5zaWRlIG1hdGNoIGdyb3Vwc1xuICBtb2RlW2tleV0gPSBwb3NpdGlvbnM7XG4gIG1vZGVba2V5XS5fZW1pdCA9IGVtaXQ7XG4gIG1vZGVba2V5XS5fbXVsdGkgPSB0cnVlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlfSBtb2RlXG4gKi9cbmZ1bmN0aW9uIGJlZ2luTXVsdGlDbGFzcyhtb2RlKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShtb2RlLmJlZ2luKSkgcmV0dXJuO1xuXG4gIGlmIChtb2RlLnNraXAgfHwgbW9kZS5leGNsdWRlQmVnaW4gfHwgbW9kZS5yZXR1cm5CZWdpbikge1xuICAgIGVycm9yKFwic2tpcCwgZXhjbHVkZUJlZ2luLCByZXR1cm5CZWdpbiBub3QgY29tcGF0aWJsZSB3aXRoIGJlZ2luU2NvcGU6IHt9XCIpO1xuICAgIHRocm93IE11bHRpQ2xhc3NFcnJvcjtcbiAgfVxuXG4gIGlmICh0eXBlb2YgbW9kZS5iZWdpblNjb3BlICE9PSBcIm9iamVjdFwiIHx8IG1vZGUuYmVnaW5TY29wZSA9PT0gbnVsbCkge1xuICAgIGVycm9yKFwiYmVnaW5TY29wZSBtdXN0IGJlIG9iamVjdFwiKTtcbiAgICB0aHJvdyBNdWx0aUNsYXNzRXJyb3I7XG4gIH1cblxuICByZW1hcFNjb3BlTmFtZXMobW9kZSwgbW9kZS5iZWdpbiwgeyBrZXk6IFwiYmVnaW5TY29wZVwiIH0pO1xuICBtb2RlLmJlZ2luID0gX3Jld3JpdGVCYWNrcmVmZXJlbmNlcyhtb2RlLmJlZ2luLCB7IGpvaW5XaXRoOiBcIlwiIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlfSBtb2RlXG4gKi9cbmZ1bmN0aW9uIGVuZE11bHRpQ2xhc3MobW9kZSkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobW9kZS5lbmQpKSByZXR1cm47XG5cbiAgaWYgKG1vZGUuc2tpcCB8fCBtb2RlLmV4Y2x1ZGVFbmQgfHwgbW9kZS5yZXR1cm5FbmQpIHtcbiAgICBlcnJvcihcInNraXAsIGV4Y2x1ZGVFbmQsIHJldHVybkVuZCBub3QgY29tcGF0aWJsZSB3aXRoIGVuZFNjb3BlOiB7fVwiKTtcbiAgICB0aHJvdyBNdWx0aUNsYXNzRXJyb3I7XG4gIH1cblxuICBpZiAodHlwZW9mIG1vZGUuZW5kU2NvcGUgIT09IFwib2JqZWN0XCIgfHwgbW9kZS5lbmRTY29wZSA9PT0gbnVsbCkge1xuICAgIGVycm9yKFwiZW5kU2NvcGUgbXVzdCBiZSBvYmplY3RcIik7XG4gICAgdGhyb3cgTXVsdGlDbGFzc0Vycm9yO1xuICB9XG5cbiAgcmVtYXBTY29wZU5hbWVzKG1vZGUsIG1vZGUuZW5kLCB7IGtleTogXCJlbmRTY29wZVwiIH0pO1xuICBtb2RlLmVuZCA9IF9yZXdyaXRlQmFja3JlZmVyZW5jZXMobW9kZS5lbmQsIHsgam9pbldpdGg6IFwiXCIgfSk7XG59XG5cbi8qKlxuICogdGhpcyBleGlzdHMgb25seSB0byBhbGxvdyBgc2NvcGU6IHt9YCB0byBiZSB1c2VkIGJlc2lkZSBgbWF0Y2g6YFxuICogT3RoZXJ3aXNlIGBiZWdpblNjb3BlYCB3b3VsZCBuZWNlc3NhcnkgYW5kIHRoYXQgd291bGQgbG9vayB3ZWlyZFxuXG4gIHtcbiAgICBtYXRjaDogWyAvZGVmLywgL1xcdysvIF1cbiAgICBzY29wZTogeyAxOiBcImtleXdvcmRcIiAsIDI6IFwidGl0bGVcIiB9XG4gIH1cblxuICogQHBhcmFtIHtDb21waWxlZE1vZGV9IG1vZGVcbiAqL1xuZnVuY3Rpb24gc2NvcGVTdWdhcihtb2RlKSB7XG4gIGlmIChtb2RlLnNjb3BlICYmIHR5cGVvZiBtb2RlLnNjb3BlID09PSBcIm9iamVjdFwiICYmIG1vZGUuc2NvcGUgIT09IG51bGwpIHtcbiAgICBtb2RlLmJlZ2luU2NvcGUgPSBtb2RlLnNjb3BlO1xuICAgIGRlbGV0ZSBtb2RlLnNjb3BlO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHtDb21waWxlZE1vZGV9IG1vZGVcbiAqL1xuZnVuY3Rpb24gTXVsdGlDbGFzcyhtb2RlKSB7XG4gIHNjb3BlU3VnYXIobW9kZSk7XG5cbiAgaWYgKHR5cGVvZiBtb2RlLmJlZ2luU2NvcGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICBtb2RlLmJlZ2luU2NvcGUgPSB7IF93cmFwOiBtb2RlLmJlZ2luU2NvcGUgfTtcbiAgfVxuICBpZiAodHlwZW9mIG1vZGUuZW5kU2NvcGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICBtb2RlLmVuZFNjb3BlID0geyBfd3JhcDogbW9kZS5lbmRTY29wZSB9O1xuICB9XG5cbiAgYmVnaW5NdWx0aUNsYXNzKG1vZGUpO1xuICBlbmRNdWx0aUNsYXNzKG1vZGUpO1xufVxuXG4vKipcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLk1vZGV9IE1vZGVcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkNvbXBpbGVkTW9kZX0gQ29tcGlsZWRNb2RlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5MYW5ndWFnZX0gTGFuZ3VhZ2VcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkhMSlNQbHVnaW59IEhMSlNQbHVnaW5cbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkNvbXBpbGVkTGFuZ3VhZ2V9IENvbXBpbGVkTGFuZ3VhZ2VcbiovXG5cbi8vIGNvbXBpbGF0aW9uXG5cbi8qKlxuICogQ29tcGlsZXMgYSBsYW5ndWFnZSBkZWZpbml0aW9uIHJlc3VsdFxuICpcbiAqIEdpdmVuIHRoZSByYXcgcmVzdWx0IG9mIGEgbGFuZ3VhZ2UgZGVmaW5pdGlvbiAoTGFuZ3VhZ2UpLCBjb21waWxlcyB0aGlzIHNvXG4gKiB0aGF0IGl0IGlzIHJlYWR5IGZvciBoaWdobGlnaHRpbmcgY29kZS5cbiAqIEBwYXJhbSB7TGFuZ3VhZ2V9IGxhbmd1YWdlXG4gKiBAcmV0dXJucyB7Q29tcGlsZWRMYW5ndWFnZX1cbiAqL1xuZnVuY3Rpb24gY29tcGlsZUxhbmd1YWdlKGxhbmd1YWdlKSB7XG4gIC8qKlxuICAgKiBCdWlsZHMgYSByZWdleCB3aXRoIHRoZSBjYXNlIHNlbnNpdGl2aXR5IG9mIHRoZSBjdXJyZW50IGxhbmd1YWdlXG4gICAqXG4gICAqIEBwYXJhbSB7UmVnRXhwIHwgc3RyaW5nfSB2YWx1ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtnbG9iYWxdXG4gICAqL1xuICBmdW5jdGlvbiBsYW5nUmUodmFsdWUsIGdsb2JhbCkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKFxuICAgICAgc291cmNlKHZhbHVlKSxcbiAgICAgICdtJ1xuICAgICAgKyAobGFuZ3VhZ2UuY2FzZV9pbnNlbnNpdGl2ZSA/ICdpJyA6ICcnKVxuICAgICAgKyAobGFuZ3VhZ2UudW5pY29kZVJlZ2V4ID8gJ3UnIDogJycpXG4gICAgICArIChnbG9iYWwgPyAnZycgOiAnJylcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAgU3RvcmVzIG11bHRpcGxlIHJlZ3VsYXIgZXhwcmVzc2lvbnMgYW5kIGFsbG93cyB5b3UgdG8gcXVpY2tseSBzZWFyY2ggZm9yXG4gICAgdGhlbSBhbGwgaW4gYSBzdHJpbmcgc2ltdWx0YW5lb3VzbHkgLSByZXR1cm5pbmcgdGhlIGZpcnN0IG1hdGNoLiAgSXQgZG9lc1xuICAgIHRoaXMgYnkgY3JlYXRpbmcgYSBodWdlIChhfGJ8YykgcmVnZXggLSBlYWNoIGluZGl2aWR1YWwgaXRlbSB3cmFwcGVkIHdpdGggKClcbiAgICBhbmQgam9pbmVkIGJ5IGB8YCAtIHVzaW5nIG1hdGNoIGdyb3VwcyB0byB0cmFjayBwb3NpdGlvbi4gIFdoZW4gYSBtYXRjaCBpc1xuICAgIGZvdW5kIGNoZWNraW5nIHdoaWNoIHBvc2l0aW9uIGluIHRoZSBhcnJheSBoYXMgY29udGVudCBhbGxvd3MgdXMgdG8gZmlndXJlXG4gICAgb3V0IHdoaWNoIG9mIHRoZSBvcmlnaW5hbCByZWdleGVzIC8gbWF0Y2ggZ3JvdXBzIHRyaWdnZXJlZCB0aGUgbWF0Y2guXG5cbiAgICBUaGUgbWF0Y2ggb2JqZWN0IGl0c2VsZiAodGhlIHJlc3VsdCBvZiBgUmVnZXguZXhlY2ApIGlzIHJldHVybmVkIGJ1dCBhbHNvXG4gICAgZW5oYW5jZWQgYnkgbWVyZ2luZyBpbiBhbnkgbWV0YS1kYXRhIHRoYXQgd2FzIHJlZ2lzdGVyZWQgd2l0aCB0aGUgcmVnZXguXG4gICAgVGhpcyBpcyBob3cgd2Uga2VlcCB0cmFjayBvZiB3aGljaCBtb2RlIG1hdGNoZWQsIGFuZCB3aGF0IHR5cGUgb2YgcnVsZVxuICAgIChgaWxsZWdhbGAsIGBiZWdpbmAsIGVuZCwgZXRjKS5cbiAgKi9cbiAgY2xhc3MgTXVsdGlSZWdleCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICB0aGlzLm1hdGNoSW5kZXhlcyA9IHt9O1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpcy5yZWdleGVzID0gW107XG4gICAgICB0aGlzLm1hdGNoQXQgPSAxO1xuICAgICAgdGhpcy5wb3NpdGlvbiA9IDA7XG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGFkZFJ1bGUocmUsIG9wdHMpIHtcbiAgICAgIG9wdHMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uKys7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0aGlzLm1hdGNoSW5kZXhlc1t0aGlzLm1hdGNoQXRdID0gb3B0cztcbiAgICAgIHRoaXMucmVnZXhlcy5wdXNoKFtvcHRzLCByZV0pO1xuICAgICAgdGhpcy5tYXRjaEF0ICs9IGNvdW50TWF0Y2hHcm91cHMocmUpICsgMTtcbiAgICB9XG5cbiAgICBjb21waWxlKCkge1xuICAgICAgaWYgKHRoaXMucmVnZXhlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgLy8gYXZvaWRzIHRoZSBuZWVkIHRvIGNoZWNrIGxlbmd0aCBldmVyeSB0aW1lIGV4ZWMgaXMgY2FsbGVkXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5leGVjID0gKCkgPT4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRlcm1pbmF0b3JzID0gdGhpcy5yZWdleGVzLm1hcChlbCA9PiBlbFsxXSk7XG4gICAgICB0aGlzLm1hdGNoZXJSZSA9IGxhbmdSZShfcmV3cml0ZUJhY2tyZWZlcmVuY2VzKHRlcm1pbmF0b3JzLCB7IGpvaW5XaXRoOiAnfCcgfSksIHRydWUpO1xuICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xuICAgIH1cblxuICAgIC8qKiBAcGFyYW0ge3N0cmluZ30gcyAqL1xuICAgIGV4ZWMocykge1xuICAgICAgdGhpcy5tYXRjaGVyUmUubGFzdEluZGV4ID0gdGhpcy5sYXN0SW5kZXg7XG4gICAgICBjb25zdCBtYXRjaCA9IHRoaXMubWF0Y2hlclJlLmV4ZWMocyk7XG4gICAgICBpZiAoIW1hdGNoKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZmluZWRcbiAgICAgIGNvbnN0IGkgPSBtYXRjaC5maW5kSW5kZXgoKGVsLCBpKSA9PiBpID4gMCAmJiBlbCAhPT0gdW5kZWZpbmVkKTtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvbnN0IG1hdGNoRGF0YSA9IHRoaXMubWF0Y2hJbmRleGVzW2ldO1xuICAgICAgLy8gdHJpbSBvZmYgYW55IGVhcmxpZXIgbm9uLXJlbGV2YW50IG1hdGNoIGdyb3VwcyAoaWUsIHRoZSBvdGhlciByZWdleFxuICAgICAgLy8gbWF0Y2ggZ3JvdXBzIHRoYXQgbWFrZSB1cCB0aGUgbXVsdGktbWF0Y2hlcilcbiAgICAgIG1hdGNoLnNwbGljZSgwLCBpKTtcblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obWF0Y2gsIG1hdGNoRGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICBDcmVhdGVkIHRvIHNvbHZlIHRoZSBrZXkgZGVmaWNpZW50bHkgd2l0aCBNdWx0aVJlZ2V4IC0gdGhlcmUgaXMgbm8gd2F5IHRvXG4gICAgdGVzdCBmb3IgbXVsdGlwbGUgbWF0Y2hlcyBhdCBhIHNpbmdsZSBsb2NhdGlvbi4gIFdoeSB3b3VsZCB3ZSBuZWVkIHRvIGRvXG4gICAgdGhhdD8gIEluIHRoZSBmdXR1cmUgYSBtb3JlIGR5bmFtaWMgZW5naW5lIHdpbGwgYWxsb3cgY2VydGFpbiBtYXRjaGVzIHRvIGJlXG4gICAgaWdub3JlZC4gIEFuIGV4YW1wbGU6IGlmIHdlIG1hdGNoZWQgc2F5IHRoZSAzcmQgcmVnZXggaW4gYSBsYXJnZSBncm91cCBidXRcbiAgICBkZWNpZGVkIHRvIGlnbm9yZSBpdCAtIHdlJ2QgbmVlZCB0byBzdGFydGVkIHRlc3RpbmcgYWdhaW4gYXQgdGhlIDR0aFxuICAgIHJlZ2V4Li4uIGJ1dCBNdWx0aVJlZ2V4IGl0c2VsZiBnaXZlcyB1cyBubyByZWFsIHdheSB0byBkbyB0aGF0LlxuXG4gICAgU28gd2hhdCB0aGlzIGNsYXNzIGNyZWF0ZXMgTXVsdGlSZWdleHMgb24gdGhlIGZseSBmb3Igd2hhdGV2ZXIgc2VhcmNoXG4gICAgcG9zaXRpb24gdGhleSBhcmUgbmVlZGVkLlxuXG4gICAgTk9URTogVGhlc2UgYWRkaXRpb25hbCBNdWx0aVJlZ2V4IG9iamVjdHMgYXJlIGNyZWF0ZWQgZHluYW1pY2FsbHkuICBGb3IgbW9zdFxuICAgIGdyYW1tYXJzIG1vc3Qgb2YgdGhlIHRpbWUgd2Ugd2lsbCBuZXZlciBhY3R1YWxseSBuZWVkIGFueXRoaW5nIG1vcmUgdGhhbiB0aGVcbiAgICBmaXJzdCBNdWx0aVJlZ2V4IC0gc28gdGhpcyBzaG91bGRuJ3QgaGF2ZSB0b28gbXVjaCBvdmVyaGVhZC5cblxuICAgIFNheSB0aGlzIGlzIG91ciBzZWFyY2ggZ3JvdXAsIGFuZCB3ZSBtYXRjaCByZWdleDMsIGJ1dCB3aXNoIHRvIGlnbm9yZSBpdC5cblxuICAgICAgcmVnZXgxIHwgcmVnZXgyIHwgcmVnZXgzIHwgcmVnZXg0IHwgcmVnZXg1ICAgICcgaWUsIHN0YXJ0QXQgPSAwXG5cbiAgICBXaGF0IHdlIG5lZWQgaXMgYSBuZXcgTXVsdGlSZWdleCB0aGF0IG9ubHkgaW5jbHVkZXMgdGhlIHJlbWFpbmluZ1xuICAgIHBvc3NpYmlsaXRpZXM6XG5cbiAgICAgIHJlZ2V4NCB8IHJlZ2V4NSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnIGllLCBzdGFydEF0ID0gM1xuXG4gICAgVGhpcyBjbGFzcyB3cmFwcyBhbGwgdGhhdCBjb21wbGV4aXR5IHVwIGluIGEgc2ltcGxlIEFQSS4uLiBgc3RhcnRBdGAgZGVjaWRlc1xuICAgIHdoZXJlIGluIHRoZSBhcnJheSBvZiBleHByZXNzaW9ucyB0byBzdGFydCBkb2luZyB0aGUgbWF0Y2hpbmcuIEl0XG4gICAgYXV0by1pbmNyZW1lbnRzLCBzbyBpZiBhIG1hdGNoIGlzIGZvdW5kIGF0IHBvc2l0aW9uIDIsIHRoZW4gc3RhcnRBdCB3aWxsIGJlXG4gICAgc2V0IHRvIDMuICBJZiB0aGUgZW5kIGlzIHJlYWNoZWQgc3RhcnRBdCB3aWxsIHJldHVybiB0byAwLlxuXG4gICAgTU9TVCBvZiB0aGUgdGltZSB0aGUgcGFyc2VyIHdpbGwgYmUgc2V0dGluZyBzdGFydEF0IG1hbnVhbGx5IHRvIDAuXG4gICovXG4gIGNsYXNzIFJlc3VtYWJsZU11bHRpUmVnZXgge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpcy5ydWxlcyA9IFtdO1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpcy5tdWx0aVJlZ2V4ZXMgPSBbXTtcbiAgICAgIHRoaXMuY291bnQgPSAwO1xuXG4gICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XG4gICAgICB0aGlzLnJlZ2V4SW5kZXggPSAwO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBnZXRNYXRjaGVyKGluZGV4KSB7XG4gICAgICBpZiAodGhpcy5tdWx0aVJlZ2V4ZXNbaW5kZXhdKSByZXR1cm4gdGhpcy5tdWx0aVJlZ2V4ZXNbaW5kZXhdO1xuXG4gICAgICBjb25zdCBtYXRjaGVyID0gbmV3IE11bHRpUmVnZXgoKTtcbiAgICAgIHRoaXMucnVsZXMuc2xpY2UoaW5kZXgpLmZvckVhY2goKFtyZSwgb3B0c10pID0+IG1hdGNoZXIuYWRkUnVsZShyZSwgb3B0cykpO1xuICAgICAgbWF0Y2hlci5jb21waWxlKCk7XG4gICAgICB0aGlzLm11bHRpUmVnZXhlc1tpbmRleF0gPSBtYXRjaGVyO1xuICAgICAgcmV0dXJuIG1hdGNoZXI7XG4gICAgfVxuXG4gICAgcmVzdW1pbmdTY2FuQXRTYW1lUG9zaXRpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWdleEluZGV4ICE9PSAwO1xuICAgIH1cblxuICAgIGNvbnNpZGVyQWxsKCkge1xuICAgICAgdGhpcy5yZWdleEluZGV4ID0gMDtcbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgYWRkUnVsZShyZSwgb3B0cykge1xuICAgICAgdGhpcy5ydWxlcy5wdXNoKFtyZSwgb3B0c10pO1xuICAgICAgaWYgKG9wdHMudHlwZSA9PT0gXCJiZWdpblwiKSB0aGlzLmNvdW50Kys7XG4gICAgfVxuXG4gICAgLyoqIEBwYXJhbSB7c3RyaW5nfSBzICovXG4gICAgZXhlYyhzKSB7XG4gICAgICBjb25zdCBtID0gdGhpcy5nZXRNYXRjaGVyKHRoaXMucmVnZXhJbmRleCk7XG4gICAgICBtLmxhc3RJbmRleCA9IHRoaXMubGFzdEluZGV4O1xuICAgICAgbGV0IHJlc3VsdCA9IG0uZXhlYyhzKTtcblxuICAgICAgLy8gVGhlIGZvbGxvd2luZyBpcyBiZWNhdXNlIHdlIGhhdmUgbm8gZWFzeSB3YXkgdG8gc2F5IFwicmVzdW1lIHNjYW5uaW5nIGF0IHRoZVxuICAgICAgLy8gZXhpc3RpbmcgcG9zaXRpb24gYnV0IGFsc28gc2tpcCB0aGUgY3VycmVudCBydWxlIE9OTFlcIi4gV2hhdCBoYXBwZW5zIGlzXG4gICAgICAvLyBhbGwgcHJpb3IgcnVsZXMgYXJlIGFsc28gc2tpcHBlZCB3aGljaCBjYW4gcmVzdWx0IGluIG1hdGNoaW5nIHRoZSB3cm9uZ1xuICAgICAgLy8gdGhpbmcuIEV4YW1wbGUgb2YgbWF0Y2hpbmcgXCJib29nZXJcIjpcblxuICAgICAgLy8gb3VyIG1hdGNoZXIgaXMgW3N0cmluZywgXCJib29nZXJcIiwgbnVtYmVyXVxuICAgICAgLy9cbiAgICAgIC8vIC4uLi5ib29nZXIuLi4uXG5cbiAgICAgIC8vIGlmIFwiYm9vZ2VyXCIgaXMgaWdub3JlZCB0aGVuIHdlJ2QgcmVhbGx5IG5lZWQgYSByZWdleCB0byBzY2FuIGZyb20gdGhlXG4gICAgICAvLyBTQU1FIHBvc2l0aW9uIGZvciBvbmx5OiBbc3RyaW5nLCBudW1iZXJdIGJ1dCBpZ25vcmluZyBcImJvb2dlclwiIChpZiBpdFxuICAgICAgLy8gd2FzIHRoZSBmaXJzdCBtYXRjaCksIGEgc2ltcGxlIHJlc3VtZSB3b3VsZCBzY2FuIGFoZWFkIHdobyBrbm93cyBob3dcbiAgICAgIC8vIGZhciBsb29raW5nIG9ubHkgZm9yIFwibnVtYmVyXCIsIGlnbm9yaW5nIHBvdGVudGlhbCBzdHJpbmcgbWF0Y2hlcyAob3JcbiAgICAgIC8vIGZ1dHVyZSBcImJvb2dlclwiIG1hdGNoZXMgdGhhdCBtaWdodCBiZSB2YWxpZC4pXG5cbiAgICAgIC8vIFNvIHdoYXQgd2UgZG86IFdlIGV4ZWN1dGUgdHdvIG1hdGNoZXJzLCBvbmUgcmVzdW1pbmcgYXQgdGhlIHNhbWVcbiAgICAgIC8vIHBvc2l0aW9uLCBidXQgdGhlIHNlY29uZCBmdWxsIG1hdGNoZXIgc3RhcnRpbmcgYXQgdGhlIHBvc2l0aW9uIGFmdGVyOlxuXG4gICAgICAvLyAgICAgLy0tLSByZXN1bWUgZmlyc3QgcmVnZXggbWF0Y2ggaGVyZSAoZm9yIFtudW1iZXJdKVxuICAgICAgLy8gICAgIHwvLS0tLSBmdWxsIG1hdGNoIGhlcmUgZm9yIFtzdHJpbmcsIFwiYm9vZ2VyXCIsIG51bWJlcl1cbiAgICAgIC8vICAgICB2dlxuICAgICAgLy8gLi4uLmJvb2dlci4uLi5cblxuICAgICAgLy8gV2hpY2ggZXZlciByZXN1bHRzIGluIGEgbWF0Y2ggZmlyc3QgaXMgdGhlbiB1c2VkLiBTbyB0aGlzIDMtNCBzdGVwXG4gICAgICAvLyBwcm9jZXNzIGVzc2VudGlhbGx5IGFsbG93cyB1cyB0byBzYXkgXCJtYXRjaCBhdCB0aGlzIHBvc2l0aW9uLCBleGNsdWRpbmdcbiAgICAgIC8vIGEgcHJpb3IgcnVsZSB0aGF0IHdhcyBpZ25vcmVkXCIuXG4gICAgICAvL1xuICAgICAgLy8gMS4gTWF0Y2ggXCJib29nZXJcIiBmaXJzdCwgaWdub3JlLiBBbHNvIHByb3ZlcyB0aGF0IFtzdHJpbmddIGRvZXMgbm9uIG1hdGNoLlxuICAgICAgLy8gMi4gUmVzdW1lIG1hdGNoaW5nIGZvciBbbnVtYmVyXVxuICAgICAgLy8gMy4gTWF0Y2ggYXQgaW5kZXggKyAxIGZvciBbc3RyaW5nLCBcImJvb2dlclwiLCBudW1iZXJdXG4gICAgICAvLyA0LiBJZiAjMiBhbmQgIzMgcmVzdWx0IGluIG1hdGNoZXMsIHdoaWNoIGNhbWUgZmlyc3Q/XG4gICAgICBpZiAodGhpcy5yZXN1bWluZ1NjYW5BdFNhbWVQb3NpdGlvbigpKSB7XG4gICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LmluZGV4ID09PSB0aGlzLmxhc3RJbmRleCkgOyBlbHNlIHsgLy8gdXNlIHRoZSBzZWNvbmQgbWF0Y2hlciByZXN1bHRcbiAgICAgICAgICBjb25zdCBtMiA9IHRoaXMuZ2V0TWF0Y2hlcigwKTtcbiAgICAgICAgICBtMi5sYXN0SW5kZXggPSB0aGlzLmxhc3RJbmRleCArIDE7XG4gICAgICAgICAgcmVzdWx0ID0gbTIuZXhlYyhzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHRoaXMucmVnZXhJbmRleCArPSByZXN1bHQucG9zaXRpb24gKyAxO1xuICAgICAgICBpZiAodGhpcy5yZWdleEluZGV4ID09PSB0aGlzLmNvdW50KSB7XG4gICAgICAgICAgLy8gd3JhcC1hcm91bmQgdG8gY29uc2lkZXJpbmcgYWxsIG1hdGNoZXMgYWdhaW5cbiAgICAgICAgICB0aGlzLmNvbnNpZGVyQWxsKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gYSBtb2RlLCBidWlsZHMgYSBodWdlIFJlc3VtYWJsZU11bHRpUmVnZXggdGhhdCBjYW4gYmUgdXNlZCB0byB3YWxrXG4gICAqIHRoZSBjb250ZW50IGFuZCBmaW5kIG1hdGNoZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlfSBtb2RlXG4gICAqIEByZXR1cm5zIHtSZXN1bWFibGVNdWx0aVJlZ2V4fVxuICAgKi9cbiAgZnVuY3Rpb24gYnVpbGRNb2RlUmVnZXgobW9kZSkge1xuICAgIGNvbnN0IG1tID0gbmV3IFJlc3VtYWJsZU11bHRpUmVnZXgoKTtcblxuICAgIG1vZGUuY29udGFpbnMuZm9yRWFjaCh0ZXJtID0+IG1tLmFkZFJ1bGUodGVybS5iZWdpbiwgeyBydWxlOiB0ZXJtLCB0eXBlOiBcImJlZ2luXCIgfSkpO1xuXG4gICAgaWYgKG1vZGUudGVybWluYXRvckVuZCkge1xuICAgICAgbW0uYWRkUnVsZShtb2RlLnRlcm1pbmF0b3JFbmQsIHsgdHlwZTogXCJlbmRcIiB9KTtcbiAgICB9XG4gICAgaWYgKG1vZGUuaWxsZWdhbCkge1xuICAgICAgbW0uYWRkUnVsZShtb2RlLmlsbGVnYWwsIHsgdHlwZTogXCJpbGxlZ2FsXCIgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1tO1xuICB9XG5cbiAgLyoqIHNraXAgdnMgYWJvcnQgdnMgaWdub3JlXG4gICAqXG4gICAqIEBza2lwICAgLSBUaGUgbW9kZSBpcyBzdGlsbCBlbnRlcmVkIGFuZCBleGl0ZWQgbm9ybWFsbHkgKGFuZCBjb250YWlucyBydWxlcyBhcHBseSksXG4gICAqICAgICAgICAgICBidXQgYWxsIGNvbnRlbnQgaXMgaGVsZCBhbmQgYWRkZWQgdG8gdGhlIHBhcmVudCBidWZmZXIgcmF0aGVyIHRoYW4gYmVpbmdcbiAgICogICAgICAgICAgIG91dHB1dCB3aGVuIHRoZSBtb2RlIGVuZHMuICBNb3N0bHkgdXNlZCB3aXRoIGBzdWJsYW5ndWFnZWAgdG8gYnVpbGQgdXBcbiAgICogICAgICAgICAgIGEgc2luZ2xlIGxhcmdlIGJ1ZmZlciB0aGFuIGNhbiBiZSBwYXJzZWQgYnkgc3VibGFuZ3VhZ2UuXG4gICAqXG4gICAqICAgICAgICAgICAgIC0gVGhlIG1vZGUgYmVnaW4gYW5kcyBlbmRzIG5vcm1hbGx5LlxuICAgKiAgICAgICAgICAgICAtIENvbnRlbnQgbWF0Y2hlZCBpcyBhZGRlZCB0byB0aGUgcGFyZW50IG1vZGUgYnVmZmVyLlxuICAgKiAgICAgICAgICAgICAtIFRoZSBwYXJzZXIgY3Vyc29yIGlzIG1vdmVkIGZvcndhcmQgbm9ybWFsbHkuXG4gICAqXG4gICAqIEBhYm9ydCAgLSBBIGhhY2sgcGxhY2Vob2xkZXIgdW50aWwgd2UgaGF2ZSBpZ25vcmUuICBBYm9ydHMgdGhlIG1vZGUgKGFzIGlmIGl0XG4gICAqICAgICAgICAgICBuZXZlciBtYXRjaGVkKSBidXQgRE9FUyBOT1QgY29udGludWUgdG8gbWF0Y2ggc3Vic2VxdWVudCBgY29udGFpbnNgXG4gICAqICAgICAgICAgICBtb2Rlcy4gIEFib3J0IGlzIGJhZC9zdWJvcHRpbWFsIGJlY2F1c2UgaXQgY2FuIHJlc3VsdCBpbiBtb2Rlc1xuICAgKiAgICAgICAgICAgZmFydGhlciBkb3duIG5vdCBnZXR0aW5nIGFwcGxpZWQgYmVjYXVzZSBhbiBlYXJsaWVyIHJ1bGUgZWF0cyB0aGVcbiAgICogICAgICAgICAgIGNvbnRlbnQgYnV0IHRoZW4gYWJvcnRzLlxuICAgKlxuICAgKiAgICAgICAgICAgICAtIFRoZSBtb2RlIGRvZXMgbm90IGJlZ2luLlxuICAgKiAgICAgICAgICAgICAtIENvbnRlbnQgbWF0Y2hlZCBieSBgYmVnaW5gIGlzIGFkZGVkIHRvIHRoZSBtb2RlIGJ1ZmZlci5cbiAgICogICAgICAgICAgICAgLSBUaGUgcGFyc2VyIGN1cnNvciBpcyBtb3ZlZCBmb3J3YXJkIGFjY29yZGluZ2x5LlxuICAgKlxuICAgKiBAaWdub3JlIC0gSWdub3JlcyB0aGUgbW9kZSAoYXMgaWYgaXQgbmV2ZXIgbWF0Y2hlZCkgYW5kIGNvbnRpbnVlcyB0byBtYXRjaCBhbnlcbiAgICogICAgICAgICAgIHN1YnNlcXVlbnQgYGNvbnRhaW5zYCBtb2Rlcy4gIElnbm9yZSBpc24ndCB0ZWNobmljYWxseSBwb3NzaWJsZSB3aXRoXG4gICAqICAgICAgICAgICB0aGUgY3VycmVudCBwYXJzZXIgaW1wbGVtZW50YXRpb24uXG4gICAqXG4gICAqICAgICAgICAgICAgIC0gVGhlIG1vZGUgZG9lcyBub3QgYmVnaW4uXG4gICAqICAgICAgICAgICAgIC0gQ29udGVudCBtYXRjaGVkIGJ5IGBiZWdpbmAgaXMgaWdub3JlZC5cbiAgICogICAgICAgICAgICAgLSBUaGUgcGFyc2VyIGN1cnNvciBpcyBub3QgbW92ZWQgZm9yd2FyZC5cbiAgICovXG5cbiAgLyoqXG4gICAqIENvbXBpbGVzIGFuIGluZGl2aWR1YWwgbW9kZVxuICAgKlxuICAgKiBUaGlzIGNhbiByYWlzZSBhbiBlcnJvciBpZiB0aGUgbW9kZSBjb250YWlucyBjZXJ0YWluIGRldGVjdGFibGUga25vd24gbG9naWNcbiAgICogaXNzdWVzLlxuICAgKiBAcGFyYW0ge01vZGV9IG1vZGVcbiAgICogQHBhcmFtIHtDb21waWxlZE1vZGUgfCBudWxsfSBbcGFyZW50XVxuICAgKiBAcmV0dXJucyB7Q29tcGlsZWRNb2RlIHwgbmV2ZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBjb21waWxlTW9kZShtb2RlLCBwYXJlbnQpIHtcbiAgICBjb25zdCBjbW9kZSA9IC8qKiBAdHlwZSBDb21waWxlZE1vZGUgKi8gKG1vZGUpO1xuICAgIGlmIChtb2RlLmlzQ29tcGlsZWQpIHJldHVybiBjbW9kZTtcblxuICAgIFtcbiAgICAgIHNjb3BlQ2xhc3NOYW1lLFxuICAgICAgLy8gZG8gdGhpcyBlYXJseSBzbyBjb21waWxlciBleHRlbnNpb25zIGdlbmVyYWxseSBkb24ndCBoYXZlIHRvIHdvcnJ5IGFib3V0XG4gICAgICAvLyB0aGUgZGlzdGluY3Rpb24gYmV0d2VlbiBtYXRjaC9iZWdpblxuICAgICAgY29tcGlsZU1hdGNoLFxuICAgICAgTXVsdGlDbGFzcyxcbiAgICAgIGJlZm9yZU1hdGNoRXh0XG4gICAgXS5mb3JFYWNoKGV4dCA9PiBleHQobW9kZSwgcGFyZW50KSk7XG5cbiAgICBsYW5ndWFnZS5jb21waWxlckV4dGVuc2lvbnMuZm9yRWFjaChleHQgPT4gZXh0KG1vZGUsIHBhcmVudCkpO1xuXG4gICAgLy8gX19iZWZvcmVCZWdpbiBpcyBjb25zaWRlcmVkIHByaXZhdGUgQVBJLCBpbnRlcm5hbCB1c2Ugb25seVxuICAgIG1vZGUuX19iZWZvcmVCZWdpbiA9IG51bGw7XG5cbiAgICBbXG4gICAgICBiZWdpbktleXdvcmRzLFxuICAgICAgLy8gZG8gdGhpcyBsYXRlciBzbyBjb21waWxlciBleHRlbnNpb25zIHRoYXQgY29tZSBlYXJsaWVyIGhhdmUgYWNjZXNzIHRvIHRoZVxuICAgICAgLy8gcmF3IGFycmF5IGlmIHRoZXkgd2FudGVkIHRvIHBlcmhhcHMgbWFuaXB1bGF0ZSBpdCwgZXRjLlxuICAgICAgY29tcGlsZUlsbGVnYWwsXG4gICAgICAvLyBkZWZhdWx0IHRvIDEgcmVsZXZhbmNlIGlmIG5vdCBzcGVjaWZpZWRcbiAgICAgIGNvbXBpbGVSZWxldmFuY2VcbiAgICBdLmZvckVhY2goZXh0ID0+IGV4dChtb2RlLCBwYXJlbnQpKTtcblxuICAgIG1vZGUuaXNDb21waWxlZCA9IHRydWU7XG5cbiAgICBsZXQga2V5d29yZFBhdHRlcm4gPSBudWxsO1xuICAgIGlmICh0eXBlb2YgbW9kZS5rZXl3b3JkcyA9PT0gXCJvYmplY3RcIiAmJiBtb2RlLmtleXdvcmRzLiRwYXR0ZXJuKSB7XG4gICAgICAvLyB3ZSBuZWVkIGEgY29weSBiZWNhdXNlIGtleXdvcmRzIG1pZ2h0IGJlIGNvbXBpbGVkIG11bHRpcGxlIHRpbWVzXG4gICAgICAvLyBzbyB3ZSBjYW4ndCBnbyBkZWxldGluZyAkcGF0dGVybiBmcm9tIHRoZSBvcmlnaW5hbCBvbiB0aGUgZmlyc3RcbiAgICAgIC8vIHBhc3NcbiAgICAgIG1vZGUua2V5d29yZHMgPSBPYmplY3QuYXNzaWduKHt9LCBtb2RlLmtleXdvcmRzKTtcbiAgICAgIGtleXdvcmRQYXR0ZXJuID0gbW9kZS5rZXl3b3Jkcy4kcGF0dGVybjtcbiAgICAgIGRlbGV0ZSBtb2RlLmtleXdvcmRzLiRwYXR0ZXJuO1xuICAgIH1cbiAgICBrZXl3b3JkUGF0dGVybiA9IGtleXdvcmRQYXR0ZXJuIHx8IC9cXHcrLztcblxuICAgIGlmIChtb2RlLmtleXdvcmRzKSB7XG4gICAgICBtb2RlLmtleXdvcmRzID0gY29tcGlsZUtleXdvcmRzKG1vZGUua2V5d29yZHMsIGxhbmd1YWdlLmNhc2VfaW5zZW5zaXRpdmUpO1xuICAgIH1cblxuICAgIGNtb2RlLmtleXdvcmRQYXR0ZXJuUmUgPSBsYW5nUmUoa2V5d29yZFBhdHRlcm4sIHRydWUpO1xuXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgaWYgKCFtb2RlLmJlZ2luKSBtb2RlLmJlZ2luID0gL1xcQnxcXGIvO1xuICAgICAgY21vZGUuYmVnaW5SZSA9IGxhbmdSZShjbW9kZS5iZWdpbik7XG4gICAgICBpZiAoIW1vZGUuZW5kICYmICFtb2RlLmVuZHNXaXRoUGFyZW50KSBtb2RlLmVuZCA9IC9cXEJ8XFxiLztcbiAgICAgIGlmIChtb2RlLmVuZCkgY21vZGUuZW5kUmUgPSBsYW5nUmUoY21vZGUuZW5kKTtcbiAgICAgIGNtb2RlLnRlcm1pbmF0b3JFbmQgPSBzb3VyY2UoY21vZGUuZW5kKSB8fCAnJztcbiAgICAgIGlmIChtb2RlLmVuZHNXaXRoUGFyZW50ICYmIHBhcmVudC50ZXJtaW5hdG9yRW5kKSB7XG4gICAgICAgIGNtb2RlLnRlcm1pbmF0b3JFbmQgKz0gKG1vZGUuZW5kID8gJ3wnIDogJycpICsgcGFyZW50LnRlcm1pbmF0b3JFbmQ7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChtb2RlLmlsbGVnYWwpIGNtb2RlLmlsbGVnYWxSZSA9IGxhbmdSZSgvKiogQHR5cGUge1JlZ0V4cCB8IHN0cmluZ30gKi8gKG1vZGUuaWxsZWdhbCkpO1xuICAgIGlmICghbW9kZS5jb250YWlucykgbW9kZS5jb250YWlucyA9IFtdO1xuXG4gICAgbW9kZS5jb250YWlucyA9IFtdLmNvbmNhdCguLi5tb2RlLmNvbnRhaW5zLm1hcChmdW5jdGlvbihjKSB7XG4gICAgICByZXR1cm4gZXhwYW5kT3JDbG9uZU1vZGUoYyA9PT0gJ3NlbGYnID8gbW9kZSA6IGMpO1xuICAgIH0pKTtcbiAgICBtb2RlLmNvbnRhaW5zLmZvckVhY2goZnVuY3Rpb24oYykgeyBjb21waWxlTW9kZSgvKiogQHR5cGUgTW9kZSAqLyAoYyksIGNtb2RlKTsgfSk7XG5cbiAgICBpZiAobW9kZS5zdGFydHMpIHtcbiAgICAgIGNvbXBpbGVNb2RlKG1vZGUuc3RhcnRzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIGNtb2RlLm1hdGNoZXIgPSBidWlsZE1vZGVSZWdleChjbW9kZSk7XG4gICAgcmV0dXJuIGNtb2RlO1xuICB9XG5cbiAgaWYgKCFsYW5ndWFnZS5jb21waWxlckV4dGVuc2lvbnMpIGxhbmd1YWdlLmNvbXBpbGVyRXh0ZW5zaW9ucyA9IFtdO1xuXG4gIC8vIHNlbGYgaXMgbm90IHZhbGlkIGF0IHRoZSB0b3AtbGV2ZWxcbiAgaWYgKGxhbmd1YWdlLmNvbnRhaW5zICYmIGxhbmd1YWdlLmNvbnRhaW5zLmluY2x1ZGVzKCdzZWxmJykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFUlI6IGNvbnRhaW5zIGBzZWxmYCBpcyBub3Qgc3VwcG9ydGVkIGF0IHRoZSB0b3AtbGV2ZWwgb2YgYSBsYW5ndWFnZS4gIFNlZSBkb2N1bWVudGF0aW9uLlwiKTtcbiAgfVxuXG4gIC8vIHdlIG5lZWQgYSBudWxsIG9iamVjdCwgd2hpY2ggaW5oZXJpdCB3aWxsIGd1YXJhbnRlZVxuICBsYW5ndWFnZS5jbGFzc05hbWVBbGlhc2VzID0gaW5oZXJpdCQxKGxhbmd1YWdlLmNsYXNzTmFtZUFsaWFzZXMgfHwge30pO1xuXG4gIHJldHVybiBjb21waWxlTW9kZSgvKiogQHR5cGUgTW9kZSAqLyAobGFuZ3VhZ2UpKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIGEgbW9kZSBoYXMgYSBkZXBlbmRlbmN5IG9uIGl0J3MgcGFyZW50IG9yIG5vdFxuICpcbiAqIElmIGEgbW9kZSBkb2VzIGhhdmUgYSBwYXJlbnQgZGVwZW5kZW5jeSB0aGVuIG9mdGVuIHdlIG5lZWQgdG8gY2xvbmUgaXQgaWZcbiAqIGl0J3MgdXNlZCBpbiBtdWx0aXBsZSBwbGFjZXMgc28gdGhhdCBlYWNoIGNvcHkgcG9pbnRzIHRvIHRoZSBjb3JyZWN0IHBhcmVudCxcbiAqIHdoZXJlLWFzIG1vZGVzIHdpdGhvdXQgYSBwYXJlbnQgY2FuIG9mdGVuIHNhZmVseSBiZSByZS11c2VkIGF0IHRoZSBib3R0b20gb2ZcbiAqIGEgbW9kZSBjaGFpbi5cbiAqXG4gKiBAcGFyYW0ge01vZGUgfCBudWxsfSBtb2RlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSBpcyB0aGVyZSBhIGRlcGVuZGVuY3kgb24gdGhlIHBhcmVudD9cbiAqICovXG5mdW5jdGlvbiBkZXBlbmRlbmN5T25QYXJlbnQobW9kZSkge1xuICBpZiAoIW1vZGUpIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gbW9kZS5lbmRzV2l0aFBhcmVudCB8fCBkZXBlbmRlbmN5T25QYXJlbnQobW9kZS5zdGFydHMpO1xufVxuXG4vKipcbiAqIEV4cGFuZHMgYSBtb2RlIG9yIGNsb25lcyBpdCBpZiBuZWNlc3NhcnlcbiAqXG4gKiBUaGlzIGlzIG5lY2Vzc2FyeSBmb3IgbW9kZXMgd2l0aCBwYXJlbnRhbCBkZXBlbmRlbmNlaXMgKHNlZSBub3RlcyBvblxuICogYGRlcGVuZGVuY3lPblBhcmVudGApIGFuZCBmb3Igbm9kZXMgdGhhdCBoYXZlIGB2YXJpYW50c2AgLSB3aGljaCBtdXN0IHRoZW4gYmVcbiAqIGV4cGxvZGVkIGludG8gdGhlaXIgb3duIGluZGl2aWR1YWwgbW9kZXMgYXQgY29tcGlsZSB0aW1lLlxuICpcbiAqIEBwYXJhbSB7TW9kZX0gbW9kZVxuICogQHJldHVybnMge01vZGUgfCBNb2RlW119XG4gKiAqL1xuZnVuY3Rpb24gZXhwYW5kT3JDbG9uZU1vZGUobW9kZSkge1xuICBpZiAobW9kZS52YXJpYW50cyAmJiAhbW9kZS5jYWNoZWRWYXJpYW50cykge1xuICAgIG1vZGUuY2FjaGVkVmFyaWFudHMgPSBtb2RlLnZhcmlhbnRzLm1hcChmdW5jdGlvbih2YXJpYW50KSB7XG4gICAgICByZXR1cm4gaW5oZXJpdCQxKG1vZGUsIHsgdmFyaWFudHM6IG51bGwgfSwgdmFyaWFudCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBFWFBBTkRcbiAgLy8gaWYgd2UgaGF2ZSB2YXJpYW50cyB0aGVuIGVzc2VudGlhbGx5IFwicmVwbGFjZVwiIHRoZSBtb2RlIHdpdGggdGhlIHZhcmlhbnRzXG4gIC8vIHRoaXMgaGFwcGVucyBpbiBjb21waWxlTW9kZSwgd2hlcmUgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgZnJvbVxuICBpZiAobW9kZS5jYWNoZWRWYXJpYW50cykge1xuICAgIHJldHVybiBtb2RlLmNhY2hlZFZhcmlhbnRzO1xuICB9XG5cbiAgLy8gQ0xPTkVcbiAgLy8gaWYgd2UgaGF2ZSBkZXBlbmRlbmNpZXMgb24gcGFyZW50cyB0aGVuIHdlIG5lZWQgYSB1bmlxdWVcbiAgLy8gaW5zdGFuY2Ugb2Ygb3Vyc2VsdmVzLCBzbyB3ZSBjYW4gYmUgcmV1c2VkIHdpdGggbWFueVxuICAvLyBkaWZmZXJlbnQgcGFyZW50cyB3aXRob3V0IGlzc3VlXG4gIGlmIChkZXBlbmRlbmN5T25QYXJlbnQobW9kZSkpIHtcbiAgICByZXR1cm4gaW5oZXJpdCQxKG1vZGUsIHsgc3RhcnRzOiBtb2RlLnN0YXJ0cyA/IGluaGVyaXQkMShtb2RlLnN0YXJ0cykgOiBudWxsIH0pO1xuICB9XG5cbiAgaWYgKE9iamVjdC5pc0Zyb3plbihtb2RlKSkge1xuICAgIHJldHVybiBpbmhlcml0JDEobW9kZSk7XG4gIH1cblxuICAvLyBubyBzcGVjaWFsIGRlcGVuZGVuY3kgaXNzdWVzLCBqdXN0IHJldHVybiBvdXJzZWx2ZXNcbiAgcmV0dXJuIG1vZGU7XG59XG5cbnZhciB2ZXJzaW9uID0gXCIxMS45LjBcIjtcblxuY2xhc3MgSFRNTEluamVjdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihyZWFzb24sIGh0bWwpIHtcbiAgICBzdXBlcihyZWFzb24pO1xuICAgIHRoaXMubmFtZSA9IFwiSFRNTEluamVjdGlvbkVycm9yXCI7XG4gICAgdGhpcy5odG1sID0gaHRtbDtcbiAgfVxufVxuXG4vKlxuU3ludGF4IGhpZ2hsaWdodGluZyB3aXRoIGxhbmd1YWdlIGF1dG9kZXRlY3Rpb24uXG5odHRwczovL2hpZ2hsaWdodGpzLm9yZy9cbiovXG5cblxuXG4vKipcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLk1vZGV9IE1vZGVcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkNvbXBpbGVkTW9kZX0gQ29tcGlsZWRNb2RlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5Db21waWxlZFNjb3BlfSBDb21waWxlZFNjb3BlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5MYW5ndWFnZX0gTGFuZ3VhZ2VcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkhMSlNBcGl9IEhMSlNBcGlcbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLkhMSlNQbHVnaW59IEhMSlNQbHVnaW5cbkB0eXBlZGVmIHtpbXBvcnQoJ2hpZ2hsaWdodC5qcycpLlBsdWdpbkV2ZW50fSBQbHVnaW5FdmVudFxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuSExKU09wdGlvbnN9IEhMSlNPcHRpb25zXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5MYW5ndWFnZUZufSBMYW5ndWFnZUZuXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5IaWdobGlnaHRlZEhUTUxFbGVtZW50fSBIaWdobGlnaHRlZEhUTUxFbGVtZW50XG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMnKS5CZWZvcmVIaWdobGlnaHRDb250ZXh0fSBCZWZvcmVIaWdobGlnaHRDb250ZXh0XG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMvcHJpdmF0ZScpLk1hdGNoVHlwZX0gTWF0Y2hUeXBlXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMvcHJpdmF0ZScpLktleXdvcmREYXRhfSBLZXl3b3JkRGF0YVxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzL3ByaXZhdGUnKS5FbmhhbmNlZE1hdGNofSBFbmhhbmNlZE1hdGNoXG5AdHlwZWRlZiB7aW1wb3J0KCdoaWdobGlnaHQuanMvcHJpdmF0ZScpLkFubm90YXRlZEVycm9yfSBBbm5vdGF0ZWRFcnJvclxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuQXV0b0hpZ2hsaWdodFJlc3VsdH0gQXV0b0hpZ2hsaWdodFJlc3VsdFxuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuSGlnaGxpZ2h0T3B0aW9uc30gSGlnaGxpZ2h0T3B0aW9uc1xuQHR5cGVkZWYge2ltcG9ydCgnaGlnaGxpZ2h0LmpzJykuSGlnaGxpZ2h0UmVzdWx0fSBIaWdobGlnaHRSZXN1bHRcbiovXG5cblxuY29uc3QgZXNjYXBlID0gZXNjYXBlSFRNTDtcbmNvbnN0IGluaGVyaXQgPSBpbmhlcml0JDE7XG5jb25zdCBOT19NQVRDSCA9IFN5bWJvbChcIm5vbWF0Y2hcIik7XG5jb25zdCBNQVhfS0VZV09SRF9ISVRTID0gNztcblxuLyoqXG4gKiBAcGFyYW0ge2FueX0gaGxqcyAtIG9iamVjdCB0aGF0IGlzIGV4dGVuZGVkIChsZWdhY3kpXG4gKiBAcmV0dXJucyB7SExKU0FwaX1cbiAqL1xuY29uc3QgSExKUyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgLy8gR2xvYmFsIGludGVybmFsIHZhcmlhYmxlcyB1c2VkIHdpdGhpbiB0aGUgaGlnaGxpZ2h0LmpzIGxpYnJhcnkuXG4gIC8qKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgTGFuZ3VhZ2U+fSAqL1xuICBjb25zdCBsYW5ndWFnZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAvKiogQHR5cGUge1JlY29yZDxzdHJpbmcsIHN0cmluZz59ICovXG4gIGNvbnN0IGFsaWFzZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAvKiogQHR5cGUge0hMSlNQbHVnaW5bXX0gKi9cbiAgY29uc3QgcGx1Z2lucyA9IFtdO1xuXG4gIC8vIHNhZmUvcHJvZHVjdGlvbiBtb2RlIC0gc3dhbGxvd3MgbW9yZSBlcnJvcnMsIHRyaWVzIHRvIGtlZXAgcnVubmluZ1xuICAvLyBldmVuIGlmIGEgc2luZ2xlIHN5bnRheCBvciBwYXJzZSBoaXRzIGEgZmF0YWwgZXJyb3JcbiAgbGV0IFNBRkVfTU9ERSA9IHRydWU7XG4gIGNvbnN0IExBTkdVQUdFX05PVF9GT1VORCA9IFwiQ291bGQgbm90IGZpbmQgdGhlIGxhbmd1YWdlICd7fScsIGRpZCB5b3UgZm9yZ2V0IHRvIGxvYWQvaW5jbHVkZSBhIGxhbmd1YWdlIG1vZHVsZT9cIjtcbiAgLyoqIEB0eXBlIHtMYW5ndWFnZX0gKi9cbiAgY29uc3QgUExBSU5URVhUX0xBTkdVQUdFID0geyBkaXNhYmxlQXV0b2RldGVjdDogdHJ1ZSwgbmFtZTogJ1BsYWluIHRleHQnLCBjb250YWluczogW10gfTtcblxuICAvLyBHbG9iYWwgb3B0aW9ucyB1c2VkIHdoZW4gd2l0aGluIGV4dGVybmFsIEFQSXMuIFRoaXMgaXMgbW9kaWZpZWQgd2hlblxuICAvLyBjYWxsaW5nIHRoZSBgaGxqcy5jb25maWd1cmVgIGZ1bmN0aW9uLlxuICAvKiogQHR5cGUgSExKU09wdGlvbnMgKi9cbiAgbGV0IG9wdGlvbnMgPSB7XG4gICAgaWdub3JlVW5lc2NhcGVkSFRNTDogZmFsc2UsXG4gICAgdGhyb3dVbmVzY2FwZWRIVE1MOiBmYWxzZSxcbiAgICBub0hpZ2hsaWdodFJlOiAvXihuby0/aGlnaGxpZ2h0KSQvaSxcbiAgICBsYW5ndWFnZURldGVjdFJlOiAvXFxibGFuZyg/OnVhZ2UpPy0oW1xcdy1dKylcXGIvaSxcbiAgICBjbGFzc1ByZWZpeDogJ2hsanMtJyxcbiAgICBjc3NTZWxlY3RvcjogJ3ByZSBjb2RlJyxcbiAgICBsYW5ndWFnZXM6IG51bGwsXG4gICAgLy8gYmV0YSBjb25maWd1cmF0aW9uIG9wdGlvbnMsIHN1YmplY3QgdG8gY2hhbmdlLCB3ZWxjb21lIHRvIGRpc2N1c3NcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaGlnaGxpZ2h0anMvaGlnaGxpZ2h0LmpzL2lzc3Vlcy8xMDg2XG4gICAgX19lbWl0dGVyOiBUb2tlblRyZWVFbWl0dGVyXG4gIH07XG5cbiAgLyogVXRpbGl0eSBmdW5jdGlvbnMgKi9cblxuICAvKipcbiAgICogVGVzdHMgYSBsYW5ndWFnZSBuYW1lIHRvIHNlZSBpZiBoaWdobGlnaHRpbmcgc2hvdWxkIGJlIHNraXBwZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlTmFtZVxuICAgKi9cbiAgZnVuY3Rpb24gc2hvdWxkTm90SGlnaGxpZ2h0KGxhbmd1YWdlTmFtZSkge1xuICAgIHJldHVybiBvcHRpb25zLm5vSGlnaGxpZ2h0UmUudGVzdChsYW5ndWFnZU5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SGlnaGxpZ2h0ZWRIVE1MRWxlbWVudH0gYmxvY2sgLSB0aGUgSFRNTCBlbGVtZW50IHRvIGRldGVybWluZSBsYW5ndWFnZSBmb3JcbiAgICovXG4gIGZ1bmN0aW9uIGJsb2NrTGFuZ3VhZ2UoYmxvY2spIHtcbiAgICBsZXQgY2xhc3NlcyA9IGJsb2NrLmNsYXNzTmFtZSArICcgJztcblxuICAgIGNsYXNzZXMgKz0gYmxvY2sucGFyZW50Tm9kZSA/IGJsb2NrLnBhcmVudE5vZGUuY2xhc3NOYW1lIDogJyc7XG5cbiAgICAvLyBsYW5ndWFnZS0qIHRha2VzIHByZWNlZGVuY2Ugb3ZlciBub24tcHJlZml4ZWQgY2xhc3MgbmFtZXMuXG4gICAgY29uc3QgbWF0Y2ggPSBvcHRpb25zLmxhbmd1YWdlRGV0ZWN0UmUuZXhlYyhjbGFzc2VzKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IGxhbmd1YWdlID0gZ2V0TGFuZ3VhZ2UobWF0Y2hbMV0pO1xuICAgICAgaWYgKCFsYW5ndWFnZSkge1xuICAgICAgICB3YXJuKExBTkdVQUdFX05PVF9GT1VORC5yZXBsYWNlKFwie31cIiwgbWF0Y2hbMV0pKTtcbiAgICAgICAgd2FybihcIkZhbGxpbmcgYmFjayB0byBuby1oaWdobGlnaHQgbW9kZSBmb3IgdGhpcyBibG9jay5cIiwgYmxvY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxhbmd1YWdlID8gbWF0Y2hbMV0gOiAnbm8taGlnaGxpZ2h0JztcbiAgICB9XG5cbiAgICByZXR1cm4gY2xhc3Nlc1xuICAgICAgLnNwbGl0KC9cXHMrLylcbiAgICAgIC5maW5kKChfY2xhc3MpID0+IHNob3VsZE5vdEhpZ2hsaWdodChfY2xhc3MpIHx8IGdldExhbmd1YWdlKF9jbGFzcykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcmUgaGlnaGxpZ2h0aW5nIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBPTEQgQVBJXG4gICAqIGhpZ2hsaWdodChsYW5nLCBjb2RlLCBpZ25vcmVJbGxlZ2FscywgY29udGludWF0aW9uKVxuICAgKlxuICAgKiBORVcgQVBJXG4gICAqIGhpZ2hsaWdodChjb2RlLCB7bGFuZywgaWdub3JlSWxsZWdhbHN9KVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZU9yTGFuZ3VhZ2VOYW1lIC0gdGhlIGxhbmd1YWdlIHRvIHVzZSBmb3IgaGlnaGxpZ2h0aW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgSGlnaGxpZ2h0T3B0aW9uc30gb3B0aW9uc09yQ29kZSAtIHRoZSBjb2RlIHRvIGhpZ2hsaWdodFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpZ25vcmVJbGxlZ2Fsc10gLSB3aGV0aGVyIHRvIGlnbm9yZSBpbGxlZ2FsIG1hdGNoZXMsIGRlZmF1bHQgaXMgdG8gYmFpbFxuICAgKlxuICAgKiBAcmV0dXJucyB7SGlnaGxpZ2h0UmVzdWx0fSBSZXN1bHQgLSBhbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSByZXN1bHRcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGxhbmd1YWdlIC0gdGhlIGxhbmd1YWdlIG5hbWVcbiAgICogQHByb3BlcnR5IHtudW1iZXJ9IHJlbGV2YW5jZSAtIHRoZSByZWxldmFuY2Ugc2NvcmVcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZhbHVlIC0gdGhlIGhpZ2hsaWdodGVkIEhUTUwgY29kZVxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gY29kZSAtIHRoZSBvcmlnaW5hbCByYXcgY29kZVxuICAgKiBAcHJvcGVydHkge0NvbXBpbGVkTW9kZX0gdG9wIC0gdG9wIG9mIHRoZSBjdXJyZW50IG1vZGUgc3RhY2tcbiAgICogQHByb3BlcnR5IHtib29sZWFufSBpbGxlZ2FsIC0gaW5kaWNhdGVzIHdoZXRoZXIgYW55IGlsbGVnYWwgbWF0Y2hlcyB3ZXJlIGZvdW5kXG4gICovXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodChjb2RlT3JMYW5ndWFnZU5hbWUsIG9wdGlvbnNPckNvZGUsIGlnbm9yZUlsbGVnYWxzKSB7XG4gICAgbGV0IGNvZGUgPSBcIlwiO1xuICAgIGxldCBsYW5ndWFnZU5hbWUgPSBcIlwiO1xuICAgIGlmICh0eXBlb2Ygb3B0aW9uc09yQ29kZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgY29kZSA9IGNvZGVPckxhbmd1YWdlTmFtZTtcbiAgICAgIGlnbm9yZUlsbGVnYWxzID0gb3B0aW9uc09yQ29kZS5pZ25vcmVJbGxlZ2FscztcbiAgICAgIGxhbmd1YWdlTmFtZSA9IG9wdGlvbnNPckNvZGUubGFuZ3VhZ2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG9sZCBBUElcbiAgICAgIGRlcHJlY2F0ZWQoXCIxMC43LjBcIiwgXCJoaWdobGlnaHQobGFuZywgY29kZSwgLi4uYXJncykgaGFzIGJlZW4gZGVwcmVjYXRlZC5cIik7XG4gICAgICBkZXByZWNhdGVkKFwiMTAuNy4wXCIsIFwiUGxlYXNlIHVzZSBoaWdobGlnaHQoY29kZSwgb3B0aW9ucykgaW5zdGVhZC5cXG5odHRwczovL2dpdGh1Yi5jb20vaGlnaGxpZ2h0anMvaGlnaGxpZ2h0LmpzL2lzc3Vlcy8yMjc3XCIpO1xuICAgICAgbGFuZ3VhZ2VOYW1lID0gY29kZU9yTGFuZ3VhZ2VOYW1lO1xuICAgICAgY29kZSA9IG9wdGlvbnNPckNvZGU7XG4gICAgfVxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy9pc3N1ZXMvMzE0OVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZmluZWRcbiAgICBpZiAoaWdub3JlSWxsZWdhbHMgPT09IHVuZGVmaW5lZCkgeyBpZ25vcmVJbGxlZ2FscyA9IHRydWU7IH1cblxuICAgIC8qKiBAdHlwZSB7QmVmb3JlSGlnaGxpZ2h0Q29udGV4dH0gKi9cbiAgICBjb25zdCBjb250ZXh0ID0ge1xuICAgICAgY29kZSxcbiAgICAgIGxhbmd1YWdlOiBsYW5ndWFnZU5hbWVcbiAgICB9O1xuICAgIC8vIHRoZSBwbHVnaW4gY2FuIGNoYW5nZSB0aGUgZGVzaXJlZCBsYW5ndWFnZSBvciB0aGUgY29kZSB0byBiZSBoaWdobGlnaHRlZFxuICAgIC8vIGp1c3QgYmUgY2hhbmdpbmcgdGhlIG9iamVjdCBpdCB3YXMgcGFzc2VkXG4gICAgZmlyZShcImJlZm9yZTpoaWdobGlnaHRcIiwgY29udGV4dCk7XG5cbiAgICAvLyBhIGJlZm9yZSBwbHVnaW4gY2FuIHVzdXJwIHRoZSByZXN1bHQgY29tcGxldGVseSBieSBwcm92aWRpbmcgaXQncyBvd25cbiAgICAvLyBpbiB3aGljaCBjYXNlIHdlIGRvbid0IGV2ZW4gbmVlZCB0byBjYWxsIGhpZ2hsaWdodFxuICAgIGNvbnN0IHJlc3VsdCA9IGNvbnRleHQucmVzdWx0XG4gICAgICA/IGNvbnRleHQucmVzdWx0XG4gICAgICA6IF9oaWdobGlnaHQoY29udGV4dC5sYW5ndWFnZSwgY29udGV4dC5jb2RlLCBpZ25vcmVJbGxlZ2Fscyk7XG5cbiAgICByZXN1bHQuY29kZSA9IGNvbnRleHQuY29kZTtcbiAgICAvLyB0aGUgcGx1Z2luIGNhbiBjaGFuZ2UgYW55dGhpbmcgaW4gcmVzdWx0IHRvIHN1aXRlIGl0XG4gICAgZmlyZShcImFmdGVyOmhpZ2hsaWdodFwiLCByZXN1bHQpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBwcml2YXRlIGhpZ2hsaWdodCB0aGF0J3MgdXNlZCBpbnRlcm5hbGx5IGFuZCBkb2VzIG5vdCBmaXJlIGNhbGxiYWNrc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2VOYW1lIC0gdGhlIGxhbmd1YWdlIHRvIHVzZSBmb3IgaGlnaGxpZ2h0aW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlVG9IaWdobGlnaHQgLSB0aGUgY29kZSB0byBoaWdobGlnaHRcbiAgICogQHBhcmFtIHtib29sZWFuP30gW2lnbm9yZUlsbGVnYWxzXSAtIHdoZXRoZXIgdG8gaWdub3JlIGlsbGVnYWwgbWF0Y2hlcywgZGVmYXVsdCBpcyB0byBiYWlsXG4gICAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlP30gW2NvbnRpbnVhdGlvbl0gLSBjdXJyZW50IGNvbnRpbnVhdGlvbiBtb2RlLCBpZiBhbnlcbiAgICogQHJldHVybnMge0hpZ2hsaWdodFJlc3VsdH0gLSByZXN1bHQgb2YgdGhlIGhpZ2hsaWdodCBvcGVyYXRpb25cbiAgKi9cbiAgZnVuY3Rpb24gX2hpZ2hsaWdodChsYW5ndWFnZU5hbWUsIGNvZGVUb0hpZ2hsaWdodCwgaWdub3JlSWxsZWdhbHMsIGNvbnRpbnVhdGlvbikge1xuICAgIGNvbnN0IGtleXdvcmRIaXRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybiBrZXl3b3JkIGRhdGEgaWYgYSBtYXRjaCBpcyBhIGtleXdvcmRcbiAgICAgKiBAcGFyYW0ge0NvbXBpbGVkTW9kZX0gbW9kZSAtIGN1cnJlbnQgbW9kZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtYXRjaFRleHQgLSB0aGUgdGV4dHVhbCBtYXRjaFxuICAgICAqIEByZXR1cm5zIHtLZXl3b3JkRGF0YSB8IGZhbHNlfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGtleXdvcmREYXRhKG1vZGUsIG1hdGNoVGV4dCkge1xuICAgICAgcmV0dXJuIG1vZGUua2V5d29yZHNbbWF0Y2hUZXh0XTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzS2V5d29yZHMoKSB7XG4gICAgICBpZiAoIXRvcC5rZXl3b3Jkcykge1xuICAgICAgICBlbWl0dGVyLmFkZFRleHQobW9kZUJ1ZmZlcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IGxhc3RJbmRleCA9IDA7XG4gICAgICB0b3Aua2V5d29yZFBhdHRlcm5SZS5sYXN0SW5kZXggPSAwO1xuICAgICAgbGV0IG1hdGNoID0gdG9wLmtleXdvcmRQYXR0ZXJuUmUuZXhlYyhtb2RlQnVmZmVyKTtcbiAgICAgIGxldCBidWYgPSBcIlwiO1xuXG4gICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgYnVmICs9IG1vZGVCdWZmZXIuc3Vic3RyaW5nKGxhc3RJbmRleCwgbWF0Y2guaW5kZXgpO1xuICAgICAgICBjb25zdCB3b3JkID0gbGFuZ3VhZ2UuY2FzZV9pbnNlbnNpdGl2ZSA/IG1hdGNoWzBdLnRvTG93ZXJDYXNlKCkgOiBtYXRjaFswXTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGtleXdvcmREYXRhKHRvcCwgd29yZCk7XG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgY29uc3QgW2tpbmQsIGtleXdvcmRSZWxldmFuY2VdID0gZGF0YTtcbiAgICAgICAgICBlbWl0dGVyLmFkZFRleHQoYnVmKTtcbiAgICAgICAgICBidWYgPSBcIlwiO1xuXG4gICAgICAgICAga2V5d29yZEhpdHNbd29yZF0gPSAoa2V5d29yZEhpdHNbd29yZF0gfHwgMCkgKyAxO1xuICAgICAgICAgIGlmIChrZXl3b3JkSGl0c1t3b3JkXSA8PSBNQVhfS0VZV09SRF9ISVRTKSByZWxldmFuY2UgKz0ga2V5d29yZFJlbGV2YW5jZTtcbiAgICAgICAgICBpZiAoa2luZC5zdGFydHNXaXRoKFwiX1wiKSkge1xuICAgICAgICAgICAgLy8gXyBpbXBsaWVkIGZvciByZWxldmFuY2Ugb25seSwgZG8gbm90IGhpZ2hsaWdodFxuICAgICAgICAgICAgLy8gYnkgYXBwbHlpbmcgYSBjbGFzcyBuYW1lXG4gICAgICAgICAgICBidWYgKz0gbWF0Y2hbMF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGNzc0NsYXNzID0gbGFuZ3VhZ2UuY2xhc3NOYW1lQWxpYXNlc1traW5kXSB8fCBraW5kO1xuICAgICAgICAgICAgZW1pdEtleXdvcmQobWF0Y2hbMF0sIGNzc0NsYXNzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnVmICs9IG1hdGNoWzBdO1xuICAgICAgICB9XG4gICAgICAgIGxhc3RJbmRleCA9IHRvcC5rZXl3b3JkUGF0dGVyblJlLmxhc3RJbmRleDtcbiAgICAgICAgbWF0Y2ggPSB0b3Aua2V5d29yZFBhdHRlcm5SZS5leGVjKG1vZGVCdWZmZXIpO1xuICAgICAgfVxuICAgICAgYnVmICs9IG1vZGVCdWZmZXIuc3Vic3RyaW5nKGxhc3RJbmRleCk7XG4gICAgICBlbWl0dGVyLmFkZFRleHQoYnVmKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzU3ViTGFuZ3VhZ2UoKSB7XG4gICAgICBpZiAobW9kZUJ1ZmZlciA9PT0gXCJcIikgcmV0dXJuO1xuICAgICAgLyoqIEB0eXBlIEhpZ2hsaWdodFJlc3VsdCAqL1xuICAgICAgbGV0IHJlc3VsdCA9IG51bGw7XG5cbiAgICAgIGlmICh0eXBlb2YgdG9wLnN1Ykxhbmd1YWdlID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoIWxhbmd1YWdlc1t0b3Auc3ViTGFuZ3VhZ2VdKSB7XG4gICAgICAgICAgZW1pdHRlci5hZGRUZXh0KG1vZGVCdWZmZXIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSBfaGlnaGxpZ2h0KHRvcC5zdWJMYW5ndWFnZSwgbW9kZUJ1ZmZlciwgdHJ1ZSwgY29udGludWF0aW9uc1t0b3Auc3ViTGFuZ3VhZ2VdKTtcbiAgICAgICAgY29udGludWF0aW9uc1t0b3Auc3ViTGFuZ3VhZ2VdID0gLyoqIEB0eXBlIHtDb21waWxlZE1vZGV9ICovIChyZXN1bHQuX3RvcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBoaWdobGlnaHRBdXRvKG1vZGVCdWZmZXIsIHRvcC5zdWJMYW5ndWFnZS5sZW5ndGggPyB0b3Auc3ViTGFuZ3VhZ2UgOiBudWxsKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ291bnRpbmcgZW1iZWRkZWQgbGFuZ3VhZ2Ugc2NvcmUgdG93YXJkcyB0aGUgaG9zdCBsYW5ndWFnZSBtYXkgYmUgZGlzYWJsZWRcbiAgICAgIC8vIHdpdGggemVyb2luZyB0aGUgY29udGFpbmluZyBtb2RlIHJlbGV2YW5jZS4gVXNlIGNhc2UgaW4gcG9pbnQgaXMgTWFya2Rvd24gdGhhdFxuICAgICAgLy8gYWxsb3dzIFhNTCBldmVyeXdoZXJlIGFuZCBtYWtlcyBldmVyeSBYTUwgc25pcHBldCB0byBoYXZlIGEgbXVjaCBsYXJnZXIgTWFya2Rvd25cbiAgICAgIC8vIHNjb3JlLlxuICAgICAgaWYgKHRvcC5yZWxldmFuY2UgPiAwKSB7XG4gICAgICAgIHJlbGV2YW5jZSArPSByZXN1bHQucmVsZXZhbmNlO1xuICAgICAgfVxuICAgICAgZW1pdHRlci5fX2FkZFN1Ymxhbmd1YWdlKHJlc3VsdC5fZW1pdHRlciwgcmVzdWx0Lmxhbmd1YWdlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzQnVmZmVyKCkge1xuICAgICAgaWYgKHRvcC5zdWJMYW5ndWFnZSAhPSBudWxsKSB7XG4gICAgICAgIHByb2Nlc3NTdWJMYW5ndWFnZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvY2Vzc0tleXdvcmRzKCk7XG4gICAgICB9XG4gICAgICBtb2RlQnVmZmVyID0gJyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2NvcGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlbWl0S2V5d29yZChrZXl3b3JkLCBzY29wZSkge1xuICAgICAgaWYgKGtleXdvcmQgPT09IFwiXCIpIHJldHVybjtcblxuICAgICAgZW1pdHRlci5zdGFydFNjb3BlKHNjb3BlKTtcbiAgICAgIGVtaXR0ZXIuYWRkVGV4dChrZXl3b3JkKTtcbiAgICAgIGVtaXR0ZXIuZW5kU2NvcGUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0NvbXBpbGVkU2NvcGV9IHNjb3BlXG4gICAgICogQHBhcmFtIHtSZWdFeHBNYXRjaEFycmF5fSBtYXRjaFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVtaXRNdWx0aUNsYXNzKHNjb3BlLCBtYXRjaCkge1xuICAgICAgbGV0IGkgPSAxO1xuICAgICAgY29uc3QgbWF4ID0gbWF0Y2gubGVuZ3RoIC0gMTtcbiAgICAgIHdoaWxlIChpIDw9IG1heCkge1xuICAgICAgICBpZiAoIXNjb3BlLl9lbWl0W2ldKSB7IGkrKzsgY29udGludWU7IH1cbiAgICAgICAgY29uc3Qga2xhc3MgPSBsYW5ndWFnZS5jbGFzc05hbWVBbGlhc2VzW3Njb3BlW2ldXSB8fCBzY29wZVtpXTtcbiAgICAgICAgY29uc3QgdGV4dCA9IG1hdGNoW2ldO1xuICAgICAgICBpZiAoa2xhc3MpIHtcbiAgICAgICAgICBlbWl0S2V5d29yZCh0ZXh0LCBrbGFzcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9kZUJ1ZmZlciA9IHRleHQ7XG4gICAgICAgICAgcHJvY2Vzc0tleXdvcmRzKCk7XG4gICAgICAgICAgbW9kZUJ1ZmZlciA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlfSBtb2RlIC0gbmV3IG1vZGUgdG8gc3RhcnRcbiAgICAgKiBAcGFyYW0ge1JlZ0V4cE1hdGNoQXJyYXl9IG1hdGNoXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3RhcnROZXdNb2RlKG1vZGUsIG1hdGNoKSB7XG4gICAgICBpZiAobW9kZS5zY29wZSAmJiB0eXBlb2YgbW9kZS5zY29wZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBlbWl0dGVyLm9wZW5Ob2RlKGxhbmd1YWdlLmNsYXNzTmFtZUFsaWFzZXNbbW9kZS5zY29wZV0gfHwgbW9kZS5zY29wZSk7XG4gICAgICB9XG4gICAgICBpZiAobW9kZS5iZWdpblNjb3BlKSB7XG4gICAgICAgIC8vIGJlZ2luU2NvcGUganVzdCB3cmFwcyB0aGUgYmVnaW4gbWF0Y2ggaXRzZWxmIGluIGEgc2NvcGVcbiAgICAgICAgaWYgKG1vZGUuYmVnaW5TY29wZS5fd3JhcCkge1xuICAgICAgICAgIGVtaXRLZXl3b3JkKG1vZGVCdWZmZXIsIGxhbmd1YWdlLmNsYXNzTmFtZUFsaWFzZXNbbW9kZS5iZWdpblNjb3BlLl93cmFwXSB8fCBtb2RlLmJlZ2luU2NvcGUuX3dyYXApO1xuICAgICAgICAgIG1vZGVCdWZmZXIgPSBcIlwiO1xuICAgICAgICB9IGVsc2UgaWYgKG1vZGUuYmVnaW5TY29wZS5fbXVsdGkpIHtcbiAgICAgICAgICAvLyBhdCB0aGlzIHBvaW50IG1vZGVCdWZmZXIgc2hvdWxkIGp1c3QgYmUgdGhlIG1hdGNoXG4gICAgICAgICAgZW1pdE11bHRpQ2xhc3MobW9kZS5iZWdpblNjb3BlLCBtYXRjaCk7XG4gICAgICAgICAgbW9kZUJ1ZmZlciA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdG9wID0gT2JqZWN0LmNyZWF0ZShtb2RlLCB7IHBhcmVudDogeyB2YWx1ZTogdG9wIH0gfSk7XG4gICAgICByZXR1cm4gdG9wO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Q29tcGlsZWRNb2RlIH0gbW9kZSAtIHRoZSBtb2RlIHRvIHBvdGVudGlhbGx5IGVuZFxuICAgICAqIEBwYXJhbSB7UmVnRXhwTWF0Y2hBcnJheX0gbWF0Y2ggLSB0aGUgbGF0ZXN0IG1hdGNoXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1hdGNoUGx1c1JlbWFpbmRlciAtIG1hdGNoIHBsdXMgcmVtYWluZGVyIG9mIGNvbnRlbnRcbiAgICAgKiBAcmV0dXJucyB7Q29tcGlsZWRNb2RlIHwgdm9pZH0gLSB0aGUgbmV4dCBtb2RlLCBvciBpZiB2b2lkIGNvbnRpbnVlIG9uIGluIGN1cnJlbnQgbW9kZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVuZE9mTW9kZShtb2RlLCBtYXRjaCwgbWF0Y2hQbHVzUmVtYWluZGVyKSB7XG4gICAgICBsZXQgbWF0Y2hlZCA9IHN0YXJ0c1dpdGgobW9kZS5lbmRSZSwgbWF0Y2hQbHVzUmVtYWluZGVyKTtcblxuICAgICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgICAgaWYgKG1vZGVbXCJvbjplbmRcIl0pIHtcbiAgICAgICAgICBjb25zdCByZXNwID0gbmV3IFJlc3BvbnNlKG1vZGUpO1xuICAgICAgICAgIG1vZGVbXCJvbjplbmRcIl0obWF0Y2gsIHJlc3ApO1xuICAgICAgICAgIGlmIChyZXNwLmlzTWF0Y2hJZ25vcmVkKSBtYXRjaGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWF0Y2hlZCkge1xuICAgICAgICAgIHdoaWxlIChtb2RlLmVuZHNQYXJlbnQgJiYgbW9kZS5wYXJlbnQpIHtcbiAgICAgICAgICAgIG1vZGUgPSBtb2RlLnBhcmVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG1vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGV2ZW4gaWYgb246ZW5kIGZpcmVzIGFuIGBpZ25vcmVgIGl0J3Mgc3RpbGwgcG9zc2libGVcbiAgICAgIC8vIHRoYXQgd2UgbWlnaHQgdHJpZ2dlciB0aGUgZW5kIG5vZGUgYmVjYXVzZSBvZiBhIHBhcmVudCBtb2RlXG4gICAgICBpZiAobW9kZS5lbmRzV2l0aFBhcmVudCkge1xuICAgICAgICByZXR1cm4gZW5kT2ZNb2RlKG1vZGUucGFyZW50LCBtYXRjaCwgbWF0Y2hQbHVzUmVtYWluZGVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgbWF0Y2hpbmcgYnV0IHRoZW4gaWdub3JpbmcgYSBzZXF1ZW5jZSBvZiB0ZXh0XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGV4ZW1lIC0gc3RyaW5nIGNvbnRhaW5pbmcgZnVsbCBtYXRjaCB0ZXh0XG4gICAgICovXG4gICAgZnVuY3Rpb24gZG9JZ25vcmUobGV4ZW1lKSB7XG4gICAgICBpZiAodG9wLm1hdGNoZXIucmVnZXhJbmRleCA9PT0gMCkge1xuICAgICAgICAvLyBubyBtb3JlIHJlZ2V4ZXMgdG8gcG90ZW50aWFsbHkgbWF0Y2ggaGVyZSwgc28gd2UgbW92ZSB0aGUgY3Vyc29yIGZvcndhcmQgb25lXG4gICAgICAgIC8vIHNwYWNlXG4gICAgICAgIG1vZGVCdWZmZXIgKz0gbGV4ZW1lWzBdO1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gbW92ZSB0aGUgY3Vyc29yLCB3ZSBzdGlsbCBoYXZlIGFkZGl0aW9uYWwgcmVnZXhlcyB0byB0cnkgYW5kXG4gICAgICAgIC8vIG1hdGNoIGF0IHRoaXMgdmVyeSBzcG90XG4gICAgICAgIHJlc3VtZVNjYW5BdFNhbWVQb3NpdGlvbiA9IHRydWU7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgc3RhcnQgb2YgYSBuZXcgcG90ZW50aWFsIG1vZGUgbWF0Y2hcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RW5oYW5jZWRNYXRjaH0gbWF0Y2ggLSB0aGUgY3VycmVudCBtYXRjaFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IGhvdyBmYXIgdG8gYWR2YW5jZSB0aGUgcGFyc2UgY3Vyc29yXG4gICAgICovXG4gICAgZnVuY3Rpb24gZG9CZWdpbk1hdGNoKG1hdGNoKSB7XG4gICAgICBjb25zdCBsZXhlbWUgPSBtYXRjaFswXTtcbiAgICAgIGNvbnN0IG5ld01vZGUgPSBtYXRjaC5ydWxlO1xuXG4gICAgICBjb25zdCByZXNwID0gbmV3IFJlc3BvbnNlKG5ld01vZGUpO1xuICAgICAgLy8gZmlyc3QgaW50ZXJuYWwgYmVmb3JlIGNhbGxiYWNrcywgdGhlbiB0aGUgcHVibGljIG9uZXNcbiAgICAgIGNvbnN0IGJlZm9yZUNhbGxiYWNrcyA9IFtuZXdNb2RlLl9fYmVmb3JlQmVnaW4sIG5ld01vZGVbXCJvbjpiZWdpblwiXV07XG4gICAgICBmb3IgKGNvbnN0IGNiIG9mIGJlZm9yZUNhbGxiYWNrcykge1xuICAgICAgICBpZiAoIWNiKSBjb250aW51ZTtcbiAgICAgICAgY2IobWF0Y2gsIHJlc3ApO1xuICAgICAgICBpZiAocmVzcC5pc01hdGNoSWdub3JlZCkgcmV0dXJuIGRvSWdub3JlKGxleGVtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXdNb2RlLnNraXApIHtcbiAgICAgICAgbW9kZUJ1ZmZlciArPSBsZXhlbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobmV3TW9kZS5leGNsdWRlQmVnaW4pIHtcbiAgICAgICAgICBtb2RlQnVmZmVyICs9IGxleGVtZTtcbiAgICAgICAgfVxuICAgICAgICBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIGlmICghbmV3TW9kZS5yZXR1cm5CZWdpbiAmJiAhbmV3TW9kZS5leGNsdWRlQmVnaW4pIHtcbiAgICAgICAgICBtb2RlQnVmZmVyID0gbGV4ZW1lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdGFydE5ld01vZGUobmV3TW9kZSwgbWF0Y2gpO1xuICAgICAgcmV0dXJuIG5ld01vZGUucmV0dXJuQmVnaW4gPyAwIDogbGV4ZW1lLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIHBvdGVudGlhbCBlbmQgb2YgbW9kZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWdFeHBNYXRjaEFycmF5fSBtYXRjaCAtIHRoZSBjdXJyZW50IG1hdGNoXG4gICAgICovXG4gICAgZnVuY3Rpb24gZG9FbmRNYXRjaChtYXRjaCkge1xuICAgICAgY29uc3QgbGV4ZW1lID0gbWF0Y2hbMF07XG4gICAgICBjb25zdCBtYXRjaFBsdXNSZW1haW5kZXIgPSBjb2RlVG9IaWdobGlnaHQuc3Vic3RyaW5nKG1hdGNoLmluZGV4KTtcblxuICAgICAgY29uc3QgZW5kTW9kZSA9IGVuZE9mTW9kZSh0b3AsIG1hdGNoLCBtYXRjaFBsdXNSZW1haW5kZXIpO1xuICAgICAgaWYgKCFlbmRNb2RlKSB7IHJldHVybiBOT19NQVRDSDsgfVxuXG4gICAgICBjb25zdCBvcmlnaW4gPSB0b3A7XG4gICAgICBpZiAodG9wLmVuZFNjb3BlICYmIHRvcC5lbmRTY29wZS5fd3JhcCkge1xuICAgICAgICBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIGVtaXRLZXl3b3JkKGxleGVtZSwgdG9wLmVuZFNjb3BlLl93cmFwKTtcbiAgICAgIH0gZWxzZSBpZiAodG9wLmVuZFNjb3BlICYmIHRvcC5lbmRTY29wZS5fbXVsdGkpIHtcbiAgICAgICAgcHJvY2Vzc0J1ZmZlcigpO1xuICAgICAgICBlbWl0TXVsdGlDbGFzcyh0b3AuZW5kU2NvcGUsIG1hdGNoKTtcbiAgICAgIH0gZWxzZSBpZiAob3JpZ2luLnNraXApIHtcbiAgICAgICAgbW9kZUJ1ZmZlciArPSBsZXhlbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIShvcmlnaW4ucmV0dXJuRW5kIHx8IG9yaWdpbi5leGNsdWRlRW5kKSkge1xuICAgICAgICAgIG1vZGVCdWZmZXIgKz0gbGV4ZW1lO1xuICAgICAgICB9XG4gICAgICAgIHByb2Nlc3NCdWZmZXIoKTtcbiAgICAgICAgaWYgKG9yaWdpbi5leGNsdWRlRW5kKSB7XG4gICAgICAgICAgbW9kZUJ1ZmZlciA9IGxleGVtZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZG8ge1xuICAgICAgICBpZiAodG9wLnNjb3BlKSB7XG4gICAgICAgICAgZW1pdHRlci5jbG9zZU5vZGUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRvcC5za2lwICYmICF0b3Auc3ViTGFuZ3VhZ2UpIHtcbiAgICAgICAgICByZWxldmFuY2UgKz0gdG9wLnJlbGV2YW5jZTtcbiAgICAgICAgfVxuICAgICAgICB0b3AgPSB0b3AucGFyZW50O1xuICAgICAgfSB3aGlsZSAodG9wICE9PSBlbmRNb2RlLnBhcmVudCk7XG4gICAgICBpZiAoZW5kTW9kZS5zdGFydHMpIHtcbiAgICAgICAgc3RhcnROZXdNb2RlKGVuZE1vZGUuc3RhcnRzLCBtYXRjaCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3JpZ2luLnJldHVybkVuZCA/IDAgOiBsZXhlbWUubGVuZ3RoO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NDb250aW51YXRpb25zKCkge1xuICAgICAgY29uc3QgbGlzdCA9IFtdO1xuICAgICAgZm9yIChsZXQgY3VycmVudCA9IHRvcDsgY3VycmVudCAhPT0gbGFuZ3VhZ2U7IGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudCkge1xuICAgICAgICBpZiAoY3VycmVudC5zY29wZSkge1xuICAgICAgICAgIGxpc3QudW5zaGlmdChjdXJyZW50LnNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5mb3JFYWNoKGl0ZW0gPT4gZW1pdHRlci5vcGVuTm9kZShpdGVtKSk7XG4gICAgfVxuXG4gICAgLyoqIEB0eXBlIHt7dHlwZT86IE1hdGNoVHlwZSwgaW5kZXg/OiBudW1iZXIsIHJ1bGU/OiBNb2RlfX19ICovXG4gICAgbGV0IGxhc3RNYXRjaCA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogIFByb2Nlc3MgYW4gaW5kaXZpZHVhbCBtYXRjaFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRCZWZvcmVNYXRjaCAtIHRleHQgcHJlY2VkaW5nIHRoZSBtYXRjaCAoc2luY2UgdGhlIGxhc3QgbWF0Y2gpXG4gICAgICogQHBhcmFtIHtFbmhhbmNlZE1hdGNofSBbbWF0Y2hdIC0gdGhlIG1hdGNoIGl0c2VsZlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHByb2Nlc3NMZXhlbWUodGV4dEJlZm9yZU1hdGNoLCBtYXRjaCkge1xuICAgICAgY29uc3QgbGV4ZW1lID0gbWF0Y2ggJiYgbWF0Y2hbMF07XG5cbiAgICAgIC8vIGFkZCBub24tbWF0Y2hlZCB0ZXh0IHRvIHRoZSBjdXJyZW50IG1vZGUgYnVmZmVyXG4gICAgICBtb2RlQnVmZmVyICs9IHRleHRCZWZvcmVNYXRjaDtcblxuICAgICAgaWYgKGxleGVtZSA9PSBudWxsKSB7XG4gICAgICAgIHByb2Nlc3NCdWZmZXIoKTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG5cbiAgICAgIC8vIHdlJ3ZlIGZvdW5kIGEgMCB3aWR0aCBtYXRjaCBhbmQgd2UncmUgc3R1Y2ssIHNvIHdlIG5lZWQgdG8gYWR2YW5jZVxuICAgICAgLy8gdGhpcyBoYXBwZW5zIHdoZW4gd2UgaGF2ZSBiYWRseSBiZWhhdmVkIHJ1bGVzIHRoYXQgaGF2ZSBvcHRpb25hbCBtYXRjaGVycyB0byB0aGUgZGVncmVlIHRoYXRcbiAgICAgIC8vIHNvbWV0aW1lcyB0aGV5IGNhbiBlbmQgdXAgbWF0Y2hpbmcgbm90aGluZyBhdCBhbGxcbiAgICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy9pc3N1ZXMvMjE0MFxuICAgICAgaWYgKGxhc3RNYXRjaC50eXBlID09PSBcImJlZ2luXCIgJiYgbWF0Y2gudHlwZSA9PT0gXCJlbmRcIiAmJiBsYXN0TWF0Y2guaW5kZXggPT09IG1hdGNoLmluZGV4ICYmIGxleGVtZSA9PT0gXCJcIikge1xuICAgICAgICAvLyBzcGl0IHRoZSBcInNraXBwZWRcIiBjaGFyYWN0ZXIgdGhhdCBvdXIgcmVnZXggY2hva2VkIG9uIGJhY2sgaW50byB0aGUgb3V0cHV0IHNlcXVlbmNlXG4gICAgICAgIG1vZGVCdWZmZXIgKz0gY29kZVRvSGlnaGxpZ2h0LnNsaWNlKG1hdGNoLmluZGV4LCBtYXRjaC5pbmRleCArIDEpO1xuICAgICAgICBpZiAoIVNBRkVfTU9ERSkge1xuICAgICAgICAgIC8qKiBAdHlwZSB7QW5ub3RhdGVkRXJyb3J9ICovXG4gICAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKGAwIHdpZHRoIG1hdGNoIHJlZ2V4ICgke2xhbmd1YWdlTmFtZX0pYCk7XG4gICAgICAgICAgZXJyLmxhbmd1YWdlTmFtZSA9IGxhbmd1YWdlTmFtZTtcbiAgICAgICAgICBlcnIuYmFkUnVsZSA9IGxhc3RNYXRjaC5ydWxlO1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIGxhc3RNYXRjaCA9IG1hdGNoO1xuXG4gICAgICBpZiAobWF0Y2gudHlwZSA9PT0gXCJiZWdpblwiKSB7XG4gICAgICAgIHJldHVybiBkb0JlZ2luTWF0Y2gobWF0Y2gpO1xuICAgICAgfSBlbHNlIGlmIChtYXRjaC50eXBlID09PSBcImlsbGVnYWxcIiAmJiAhaWdub3JlSWxsZWdhbHMpIHtcbiAgICAgICAgLy8gaWxsZWdhbCBtYXRjaCwgd2UgZG8gbm90IGNvbnRpbnVlIHByb2Nlc3NpbmdcbiAgICAgICAgLyoqIEB0eXBlIHtBbm5vdGF0ZWRFcnJvcn0gKi9cbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKCdJbGxlZ2FsIGxleGVtZSBcIicgKyBsZXhlbWUgKyAnXCIgZm9yIG1vZGUgXCInICsgKHRvcC5zY29wZSB8fCAnPHVubmFtZWQ+JykgKyAnXCInKTtcbiAgICAgICAgZXJyLm1vZGUgPSB0b3A7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0gZWxzZSBpZiAobWF0Y2gudHlwZSA9PT0gXCJlbmRcIikge1xuICAgICAgICBjb25zdCBwcm9jZXNzZWQgPSBkb0VuZE1hdGNoKG1hdGNoKTtcbiAgICAgICAgaWYgKHByb2Nlc3NlZCAhPT0gTk9fTUFUQ0gpIHtcbiAgICAgICAgICByZXR1cm4gcHJvY2Vzc2VkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGVkZ2UgY2FzZSBmb3Igd2hlbiBpbGxlZ2FsIG1hdGNoZXMgJCAoZW5kIG9mIGxpbmUpIHdoaWNoIGlzIHRlY2huaWNhbGx5XG4gICAgICAvLyBhIDAgd2lkdGggbWF0Y2ggYnV0IG5vdCBhIGJlZ2luL2VuZCBtYXRjaCBzbyBpdCdzIG5vdCBjYXVnaHQgYnkgdGhlXG4gICAgICAvLyBmaXJzdCBoYW5kbGVyICh3aGVuIGlnbm9yZUlsbGVnYWxzIGlzIHRydWUpXG4gICAgICBpZiAobWF0Y2gudHlwZSA9PT0gXCJpbGxlZ2FsXCIgJiYgbGV4ZW1lID09PSBcIlwiKSB7XG4gICAgICAgIC8vIGFkdmFuY2Ugc28gd2UgYXJlbid0IHN0dWNrIGluIGFuIGluZmluaXRlIGxvb3BcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG5cbiAgICAgIC8vIGluZmluaXRlIGxvb3BzIGFyZSBCQUQsIHRoaXMgaXMgYSBsYXN0IGRpdGNoIGNhdGNoIGFsbC4gaWYgd2UgaGF2ZSBhXG4gICAgICAvLyBkZWNlbnQgbnVtYmVyIG9mIGl0ZXJhdGlvbnMgeWV0IG91ciBpbmRleCAoY3Vyc29yIHBvc2l0aW9uIGluIG91clxuICAgICAgLy8gcGFyc2luZykgc3RpbGwgM3ggYmVoaW5kIG91ciBpbmRleCB0aGVuIHNvbWV0aGluZyBpcyB2ZXJ5IHdyb25nXG4gICAgICAvLyBzbyB3ZSBiYWlsXG4gICAgICBpZiAoaXRlcmF0aW9ucyA+IDEwMDAwMCAmJiBpdGVyYXRpb25zID4gbWF0Y2guaW5kZXggKiAzKSB7XG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcigncG90ZW50aWFsIGluZmluaXRlIGxvb3AsIHdheSBtb3JlIGl0ZXJhdGlvbnMgdGhhbiBtYXRjaGVzJyk7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgIFdoeSBtaWdodCBiZSBmaW5kIG91cnNlbHZlcyBoZXJlPyAgQW4gcG90ZW50aWFsIGVuZCBtYXRjaCB0aGF0IHdhc1xuICAgICAgdHJpZ2dlcmVkIGJ1dCBjb3VsZCBub3QgYmUgY29tcGxldGVkLiAgSUUsIGBkb0VuZE1hdGNoYCByZXR1cm5lZCBOT19NQVRDSC5cbiAgICAgICh0aGlzIGNvdWxkIGJlIGJlY2F1c2UgYSBjYWxsYmFjayByZXF1ZXN0cyB0aGUgbWF0Y2ggYmUgaWdub3JlZCwgZXRjKVxuXG4gICAgICBUaGlzIGNhdXNlcyBubyByZWFsIGhhcm0gb3RoZXIgdGhhbiBzdG9wcGluZyBhIGZldyB0aW1lcyB0b28gbWFueS5cbiAgICAgICovXG5cbiAgICAgIG1vZGVCdWZmZXIgKz0gbGV4ZW1lO1xuICAgICAgcmV0dXJuIGxleGVtZS5sZW5ndGg7XG4gICAgfVxuXG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBnZXRMYW5ndWFnZShsYW5ndWFnZU5hbWUpO1xuICAgIGlmICghbGFuZ3VhZ2UpIHtcbiAgICAgIGVycm9yKExBTkdVQUdFX05PVF9GT1VORC5yZXBsYWNlKFwie31cIiwgbGFuZ3VhZ2VOYW1lKSk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbGFuZ3VhZ2U6IFwiJyArIGxhbmd1YWdlTmFtZSArICdcIicpO1xuICAgIH1cblxuICAgIGNvbnN0IG1kID0gY29tcGlsZUxhbmd1YWdlKGxhbmd1YWdlKTtcbiAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgLyoqIEB0eXBlIHtDb21waWxlZE1vZGV9ICovXG4gICAgbGV0IHRvcCA9IGNvbnRpbnVhdGlvbiB8fCBtZDtcbiAgICAvKiogQHR5cGUgUmVjb3JkPHN0cmluZyxDb21waWxlZE1vZGU+ICovXG4gICAgY29uc3QgY29udGludWF0aW9ucyA9IHt9OyAvLyBrZWVwIGNvbnRpbnVhdGlvbnMgZm9yIHN1Yi1sYW5ndWFnZXNcbiAgICBjb25zdCBlbWl0dGVyID0gbmV3IG9wdGlvbnMuX19lbWl0dGVyKG9wdGlvbnMpO1xuICAgIHByb2Nlc3NDb250aW51YXRpb25zKCk7XG4gICAgbGV0IG1vZGVCdWZmZXIgPSAnJztcbiAgICBsZXQgcmVsZXZhbmNlID0gMDtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGxldCBpdGVyYXRpb25zID0gMDtcbiAgICBsZXQgcmVzdW1lU2NhbkF0U2FtZVBvc2l0aW9uID0gZmFsc2U7XG5cbiAgICB0cnkge1xuICAgICAgaWYgKCFsYW5ndWFnZS5fX2VtaXRUb2tlbnMpIHtcbiAgICAgICAgdG9wLm1hdGNoZXIuY29uc2lkZXJBbGwoKTtcblxuICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICAgIGlmIChyZXN1bWVTY2FuQXRTYW1lUG9zaXRpb24pIHtcbiAgICAgICAgICAgIC8vIG9ubHkgcmVnZXhlcyBub3QgbWF0Y2hlZCBwcmV2aW91c2x5IHdpbGwgbm93IGJlXG4gICAgICAgICAgICAvLyBjb25zaWRlcmVkIGZvciBhIHBvdGVudGlhbCBtYXRjaFxuICAgICAgICAgICAgcmVzdW1lU2NhbkF0U2FtZVBvc2l0aW9uID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvcC5tYXRjaGVyLmNvbnNpZGVyQWxsKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRvcC5tYXRjaGVyLmxhc3RJbmRleCA9IGluZGV4O1xuXG4gICAgICAgICAgY29uc3QgbWF0Y2ggPSB0b3AubWF0Y2hlci5leGVjKGNvZGVUb0hpZ2hsaWdodCk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJtYXRjaFwiLCBtYXRjaFswXSwgbWF0Y2gucnVsZSAmJiBtYXRjaC5ydWxlLmJlZ2luKVxuXG4gICAgICAgICAgaWYgKCFtYXRjaCkgYnJlYWs7XG5cbiAgICAgICAgICBjb25zdCBiZWZvcmVNYXRjaCA9IGNvZGVUb0hpZ2hsaWdodC5zdWJzdHJpbmcoaW5kZXgsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICBjb25zdCBwcm9jZXNzZWRDb3VudCA9IHByb2Nlc3NMZXhlbWUoYmVmb3JlTWF0Y2gsIG1hdGNoKTtcbiAgICAgICAgICBpbmRleCA9IG1hdGNoLmluZGV4ICsgcHJvY2Vzc2VkQ291bnQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvY2Vzc0xleGVtZShjb2RlVG9IaWdobGlnaHQuc3Vic3RyaW5nKGluZGV4KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYW5ndWFnZS5fX2VtaXRUb2tlbnMoY29kZVRvSGlnaGxpZ2h0LCBlbWl0dGVyKTtcbiAgICAgIH1cblxuICAgICAgZW1pdHRlci5maW5hbGl6ZSgpO1xuICAgICAgcmVzdWx0ID0gZW1pdHRlci50b0hUTUwoKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlTmFtZSxcbiAgICAgICAgdmFsdWU6IHJlc3VsdCxcbiAgICAgICAgcmVsZXZhbmNlLFxuICAgICAgICBpbGxlZ2FsOiBmYWxzZSxcbiAgICAgICAgX2VtaXR0ZXI6IGVtaXR0ZXIsXG4gICAgICAgIF90b3A6IHRvcFxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChlcnIubWVzc2FnZSAmJiBlcnIubWVzc2FnZS5pbmNsdWRlcygnSWxsZWdhbCcpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlTmFtZSxcbiAgICAgICAgICB2YWx1ZTogZXNjYXBlKGNvZGVUb0hpZ2hsaWdodCksXG4gICAgICAgICAgaWxsZWdhbDogdHJ1ZSxcbiAgICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgICAgX2lsbGVnYWxCeToge1xuICAgICAgICAgICAgbWVzc2FnZTogZXJyLm1lc3NhZ2UsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIGNvbnRleHQ6IGNvZGVUb0hpZ2hsaWdodC5zbGljZShpbmRleCAtIDEwMCwgaW5kZXggKyAxMDApLFxuICAgICAgICAgICAgbW9kZTogZXJyLm1vZGUsXG4gICAgICAgICAgICByZXN1bHRTb0ZhcjogcmVzdWx0XG4gICAgICAgICAgfSxcbiAgICAgICAgICBfZW1pdHRlcjogZW1pdHRlclxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChTQUZFX01PREUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsYW5ndWFnZTogbGFuZ3VhZ2VOYW1lLFxuICAgICAgICAgIHZhbHVlOiBlc2NhcGUoY29kZVRvSGlnaGxpZ2h0KSxcbiAgICAgICAgICBpbGxlZ2FsOiBmYWxzZSxcbiAgICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgICAgZXJyb3JSYWlzZWQ6IGVycixcbiAgICAgICAgICBfZW1pdHRlcjogZW1pdHRlcixcbiAgICAgICAgICBfdG9wOiB0b3BcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyBhIHZhbGlkIGhpZ2hsaWdodCByZXN1bHQsIHdpdGhvdXQgYWN0dWFsbHkgZG9pbmcgYW55IGFjdHVhbCB3b3JrLFxuICAgKiBhdXRvIGhpZ2hsaWdodCBzdGFydHMgd2l0aCB0aGlzIGFuZCBpdCdzIHBvc3NpYmxlIGZvciBzbWFsbCBzbmlwcGV0cyB0aGF0XG4gICAqIGF1dG8tZGV0ZWN0aW9uIG1heSBub3QgZmluZCBhIGJldHRlciBtYXRjaFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZVxuICAgKiBAcmV0dXJucyB7SGlnaGxpZ2h0UmVzdWx0fVxuICAgKi9cbiAgZnVuY3Rpb24ganVzdFRleHRIaWdobGlnaHRSZXN1bHQoY29kZSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgIHZhbHVlOiBlc2NhcGUoY29kZSksXG4gICAgICBpbGxlZ2FsOiBmYWxzZSxcbiAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgIF90b3A6IFBMQUlOVEVYVF9MQU5HVUFHRSxcbiAgICAgIF9lbWl0dGVyOiBuZXcgb3B0aW9ucy5fX2VtaXR0ZXIob3B0aW9ucylcbiAgICB9O1xuICAgIHJlc3VsdC5fZW1pdHRlci5hZGRUZXh0KGNvZGUpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgSGlnaGxpZ2h0aW5nIHdpdGggbGFuZ3VhZ2UgZGV0ZWN0aW9uLiBBY2NlcHRzIGEgc3RyaW5nIHdpdGggdGhlIGNvZGUgdG9cbiAgaGlnaGxpZ2h0LiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcblxuICAtIGxhbmd1YWdlIChkZXRlY3RlZCBsYW5ndWFnZSlcbiAgLSByZWxldmFuY2UgKGludClcbiAgLSB2YWx1ZSAoYW4gSFRNTCBzdHJpbmcgd2l0aCBoaWdobGlnaHRpbmcgbWFya3VwKVxuICAtIHNlY29uZEJlc3QgKG9iamVjdCB3aXRoIHRoZSBzYW1lIHN0cnVjdHVyZSBmb3Igc2Vjb25kLWJlc3QgaGV1cmlzdGljYWxseVxuICAgIGRldGVjdGVkIGxhbmd1YWdlLCBtYXkgYmUgYWJzZW50KVxuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGNvZGVcbiAgICBAcGFyYW0ge0FycmF5PHN0cmluZz59IFtsYW5ndWFnZVN1YnNldF1cbiAgICBAcmV0dXJucyB7QXV0b0hpZ2hsaWdodFJlc3VsdH1cbiAgKi9cbiAgZnVuY3Rpb24gaGlnaGxpZ2h0QXV0byhjb2RlLCBsYW5ndWFnZVN1YnNldCkge1xuICAgIGxhbmd1YWdlU3Vic2V0ID0gbGFuZ3VhZ2VTdWJzZXQgfHwgb3B0aW9ucy5sYW5ndWFnZXMgfHwgT2JqZWN0LmtleXMobGFuZ3VhZ2VzKTtcbiAgICBjb25zdCBwbGFpbnRleHQgPSBqdXN0VGV4dEhpZ2hsaWdodFJlc3VsdChjb2RlKTtcblxuICAgIGNvbnN0IHJlc3VsdHMgPSBsYW5ndWFnZVN1YnNldC5maWx0ZXIoZ2V0TGFuZ3VhZ2UpLmZpbHRlcihhdXRvRGV0ZWN0aW9uKS5tYXAobmFtZSA9PlxuICAgICAgX2hpZ2hsaWdodChuYW1lLCBjb2RlLCBmYWxzZSlcbiAgICApO1xuICAgIHJlc3VsdHMudW5zaGlmdChwbGFpbnRleHQpOyAvLyBwbGFpbnRleHQgaXMgYWx3YXlzIGFuIG9wdGlvblxuXG4gICAgY29uc3Qgc29ydGVkID0gcmVzdWx0cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAvLyBzb3J0IGJhc2Ugb24gcmVsZXZhbmNlXG4gICAgICBpZiAoYS5yZWxldmFuY2UgIT09IGIucmVsZXZhbmNlKSByZXR1cm4gYi5yZWxldmFuY2UgLSBhLnJlbGV2YW5jZTtcblxuICAgICAgLy8gYWx3YXlzIGF3YXJkIHRoZSB0aWUgdG8gdGhlIGJhc2UgbGFuZ3VhZ2VcbiAgICAgIC8vIGllIGlmIEMrKyBhbmQgQXJkdWlubyBhcmUgdGllZCwgaXQncyBtb3JlIGxpa2VseSB0byBiZSBDKytcbiAgICAgIGlmIChhLmxhbmd1YWdlICYmIGIubGFuZ3VhZ2UpIHtcbiAgICAgICAgaWYgKGdldExhbmd1YWdlKGEubGFuZ3VhZ2UpLnN1cGVyc2V0T2YgPT09IGIubGFuZ3VhZ2UpIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIGlmIChnZXRMYW5ndWFnZShiLmxhbmd1YWdlKS5zdXBlcnNldE9mID09PSBhLmxhbmd1YWdlKSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIG90aGVyd2lzZSBzYXkgdGhleSBhcmUgZXF1YWwsIHdoaWNoIGhhcyB0aGUgZWZmZWN0IG9mIHNvcnRpbmcgb25cbiAgICAgIC8vIHJlbGV2YW5jZSB3aGlsZSBwcmVzZXJ2aW5nIHRoZSBvcmlnaW5hbCBvcmRlcmluZyAtIHdoaWNoIGlzIGhvdyB0aWVzXG4gICAgICAvLyBoYXZlIGhpc3RvcmljYWxseSBiZWVuIHNldHRsZWQsIGllIHRoZSBsYW5ndWFnZSB0aGF0IGNvbWVzIGZpcnN0IGFsd2F5c1xuICAgICAgLy8gd2lucyBpbiB0aGUgY2FzZSBvZiBhIHRpZVxuICAgICAgcmV0dXJuIDA7XG4gICAgfSk7XG5cbiAgICBjb25zdCBbYmVzdCwgc2Vjb25kQmVzdF0gPSBzb3J0ZWQ7XG5cbiAgICAvKiogQHR5cGUge0F1dG9IaWdobGlnaHRSZXN1bHR9ICovXG4gICAgY29uc3QgcmVzdWx0ID0gYmVzdDtcbiAgICByZXN1bHQuc2Vjb25kQmVzdCA9IHNlY29uZEJlc3Q7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyBuZXcgY2xhc3MgbmFtZSBmb3IgYmxvY2sgZ2l2ZW4gdGhlIGxhbmd1YWdlIG5hbWVcbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2N1cnJlbnRMYW5nXVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3Jlc3VsdExhbmddXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGVDbGFzc05hbWUoZWxlbWVudCwgY3VycmVudExhbmcsIHJlc3VsdExhbmcpIHtcbiAgICBjb25zdCBsYW5ndWFnZSA9IChjdXJyZW50TGFuZyAmJiBhbGlhc2VzW2N1cnJlbnRMYW5nXSkgfHwgcmVzdWx0TGFuZztcblxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImhsanNcIik7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGBsYW5ndWFnZS0ke2xhbmd1YWdlfWApO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgaGlnaGxpZ2h0aW5nIHRvIGEgRE9NIG5vZGUgY29udGFpbmluZyBjb2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge0hpZ2hsaWdodGVkSFRNTEVsZW1lbnR9IGVsZW1lbnQgLSB0aGUgSFRNTCBlbGVtZW50IHRvIGhpZ2hsaWdodFxuICAqL1xuICBmdW5jdGlvbiBoaWdobGlnaHRFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAvKiogQHR5cGUgSFRNTEVsZW1lbnQgKi9cbiAgICBsZXQgbm9kZSA9IG51bGw7XG4gICAgY29uc3QgbGFuZ3VhZ2UgPSBibG9ja0xhbmd1YWdlKGVsZW1lbnQpO1xuXG4gICAgaWYgKHNob3VsZE5vdEhpZ2hsaWdodChsYW5ndWFnZSkpIHJldHVybjtcblxuICAgIGZpcmUoXCJiZWZvcmU6aGlnaGxpZ2h0RWxlbWVudFwiLFxuICAgICAgeyBlbDogZWxlbWVudCwgbGFuZ3VhZ2UgfSk7XG5cbiAgICBpZiAoZWxlbWVudC5kYXRhc2V0LmhpZ2hsaWdodGVkKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkVsZW1lbnQgcHJldmlvdXNseSBoaWdobGlnaHRlZC4gVG8gaGlnaGxpZ2h0IGFnYWluLCBmaXJzdCB1bnNldCBgZGF0YXNldC5oaWdobGlnaHRlZGAuXCIsIGVsZW1lbnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHdlIHNob3VsZCBiZSBhbGwgdGV4dCwgbm8gY2hpbGQgbm9kZXMgKHVuZXNjYXBlZCBIVE1MKSAtIHRoaXMgaXMgcG9zc2libHlcbiAgICAvLyBhbiBIVE1MIGluamVjdGlvbiBhdHRhY2sgLSBpdCdzIGxpa2VseSB0b28gbGF0ZSBpZiB0aGlzIGlzIGFscmVhZHkgaW5cbiAgICAvLyBwcm9kdWN0aW9uICh0aGUgY29kZSBoYXMgbGlrZWx5IGFscmVhZHkgZG9uZSBpdHMgZGFtYWdlIGJ5IHRoZSB0aW1lXG4gICAgLy8gd2UncmUgc2VlaW5nIGl0KS4uLiBidXQgd2UgeWVsbCBsb3VkbHkgYWJvdXQgdGhpcyBzbyB0aGF0IGhvcGVmdWxseSBpdCdzXG4gICAgLy8gbW9yZSBsaWtlbHkgdG8gYmUgY2F1Z2h0IGluIGRldmVsb3BtZW50IGJlZm9yZSBtYWtpbmcgaXQgdG8gcHJvZHVjdGlvblxuICAgIGlmIChlbGVtZW50LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICghb3B0aW9ucy5pZ25vcmVVbmVzY2FwZWRIVE1MKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIk9uZSBvZiB5b3VyIGNvZGUgYmxvY2tzIGluY2x1ZGVzIHVuZXNjYXBlZCBIVE1MLiBUaGlzIGlzIGEgcG90ZW50aWFsbHkgc2VyaW91cyBzZWN1cml0eSByaXNrLlwiKTtcbiAgICAgICAgY29uc29sZS53YXJuKFwiaHR0cHM6Ly9naXRodWIuY29tL2hpZ2hsaWdodGpzL2hpZ2hsaWdodC5qcy93aWtpL3NlY3VyaXR5XCIpO1xuICAgICAgICBjb25zb2xlLndhcm4oXCJUaGUgZWxlbWVudCB3aXRoIHVuZXNjYXBlZCBIVE1MOlwiKTtcbiAgICAgICAgY29uc29sZS53YXJuKGVsZW1lbnQpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMudGhyb3dVbmVzY2FwZWRIVE1MKSB7XG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBIVE1MSW5qZWN0aW9uRXJyb3IoXG4gICAgICAgICAgXCJPbmUgb2YgeW91ciBjb2RlIGJsb2NrcyBpbmNsdWRlcyB1bmVzY2FwZWQgSFRNTC5cIixcbiAgICAgICAgICBlbGVtZW50LmlubmVySFRNTFxuICAgICAgICApO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbm9kZSA9IGVsZW1lbnQ7XG4gICAgY29uc3QgdGV4dCA9IG5vZGUudGV4dENvbnRlbnQ7XG4gICAgY29uc3QgcmVzdWx0ID0gbGFuZ3VhZ2UgPyBoaWdobGlnaHQodGV4dCwgeyBsYW5ndWFnZSwgaWdub3JlSWxsZWdhbHM6IHRydWUgfSkgOiBoaWdobGlnaHRBdXRvKHRleHQpO1xuXG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSByZXN1bHQudmFsdWU7XG4gICAgZWxlbWVudC5kYXRhc2V0LmhpZ2hsaWdodGVkID0gXCJ5ZXNcIjtcbiAgICB1cGRhdGVDbGFzc05hbWUoZWxlbWVudCwgbGFuZ3VhZ2UsIHJlc3VsdC5sYW5ndWFnZSk7XG4gICAgZWxlbWVudC5yZXN1bHQgPSB7XG4gICAgICBsYW5ndWFnZTogcmVzdWx0Lmxhbmd1YWdlLFxuICAgICAgLy8gVE9ETzogcmVtb3ZlIHdpdGggdmVyc2lvbiAxMS4wXG4gICAgICByZTogcmVzdWx0LnJlbGV2YW5jZSxcbiAgICAgIHJlbGV2YW5jZTogcmVzdWx0LnJlbGV2YW5jZVxuICAgIH07XG4gICAgaWYgKHJlc3VsdC5zZWNvbmRCZXN0KSB7XG4gICAgICBlbGVtZW50LnNlY29uZEJlc3QgPSB7XG4gICAgICAgIGxhbmd1YWdlOiByZXN1bHQuc2Vjb25kQmVzdC5sYW5ndWFnZSxcbiAgICAgICAgcmVsZXZhbmNlOiByZXN1bHQuc2Vjb25kQmVzdC5yZWxldmFuY2VcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZmlyZShcImFmdGVyOmhpZ2hsaWdodEVsZW1lbnRcIiwgeyBlbDogZWxlbWVudCwgcmVzdWx0LCB0ZXh0IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgaGlnaGxpZ2h0LmpzIGdsb2JhbCBvcHRpb25zIHdpdGggdGhlIHBhc3NlZCBvcHRpb25zXG4gICAqXG4gICAqIEBwYXJhbSB7UGFydGlhbDxITEpTT3B0aW9ucz59IHVzZXJPcHRpb25zXG4gICAqL1xuICBmdW5jdGlvbiBjb25maWd1cmUodXNlck9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gaW5oZXJpdChvcHRpb25zLCB1c2VyT3B0aW9ucyk7XG4gIH1cblxuICAvLyBUT0RPOiByZW1vdmUgdjEyLCBkZXByZWNhdGVkXG4gIGNvbnN0IGluaXRIaWdobGlnaHRpbmcgPSAoKSA9PiB7XG4gICAgaGlnaGxpZ2h0QWxsKCk7XG4gICAgZGVwcmVjYXRlZChcIjEwLjYuMFwiLCBcImluaXRIaWdobGlnaHRpbmcoKSBkZXByZWNhdGVkLiAgVXNlIGhpZ2hsaWdodEFsbCgpIG5vdy5cIik7XG4gIH07XG5cbiAgLy8gVE9ETzogcmVtb3ZlIHYxMiwgZGVwcmVjYXRlZFxuICBmdW5jdGlvbiBpbml0SGlnaGxpZ2h0aW5nT25Mb2FkKCkge1xuICAgIGhpZ2hsaWdodEFsbCgpO1xuICAgIGRlcHJlY2F0ZWQoXCIxMC42LjBcIiwgXCJpbml0SGlnaGxpZ2h0aW5nT25Mb2FkKCkgZGVwcmVjYXRlZC4gIFVzZSBoaWdobGlnaHRBbGwoKSBub3cuXCIpO1xuICB9XG5cbiAgbGV0IHdhbnRzSGlnaGxpZ2h0ID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIGF1dG8taGlnaGxpZ2h0cyBhbGwgcHJlPmNvZGUgZWxlbWVudHMgb24gdGhlIHBhZ2VcbiAgICovXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodEFsbCgpIHtcbiAgICAvLyBpZiB3ZSBhcmUgY2FsbGVkIHRvbyBlYXJseSBpbiB0aGUgbG9hZGluZyBwcm9jZXNzXG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwibG9hZGluZ1wiKSB7XG4gICAgICB3YW50c0hpZ2hsaWdodCA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLmNzc1NlbGVjdG9yKTtcbiAgICBibG9ja3MuZm9yRWFjaChoaWdobGlnaHRFbGVtZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJvb3QoKSB7XG4gICAgLy8gaWYgYSBoaWdobGlnaHQgd2FzIHJlcXVlc3RlZCBiZWZvcmUgRE9NIHdhcyBsb2FkZWQsIGRvIG5vd1xuICAgIGlmICh3YW50c0hpZ2hsaWdodCkgaGlnaGxpZ2h0QWxsKCk7XG4gIH1cblxuICAvLyBtYWtlIHN1cmUgd2UgYXJlIGluIHRoZSBicm93c2VyIGVudmlyb25tZW50XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgYm9vdCwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGFuZ3VhZ2UgZ3JhbW1hciBtb2R1bGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlTmFtZVxuICAgKiBAcGFyYW0ge0xhbmd1YWdlRm59IGxhbmd1YWdlRGVmaW5pdGlvblxuICAgKi9cbiAgZnVuY3Rpb24gcmVnaXN0ZXJMYW5ndWFnZShsYW5ndWFnZU5hbWUsIGxhbmd1YWdlRGVmaW5pdGlvbikge1xuICAgIGxldCBsYW5nID0gbnVsbDtcbiAgICB0cnkge1xuICAgICAgbGFuZyA9IGxhbmd1YWdlRGVmaW5pdGlvbihobGpzKTtcbiAgICB9IGNhdGNoIChlcnJvciQxKSB7XG4gICAgICBlcnJvcihcIkxhbmd1YWdlIGRlZmluaXRpb24gZm9yICd7fScgY291bGQgbm90IGJlIHJlZ2lzdGVyZWQuXCIucmVwbGFjZShcInt9XCIsIGxhbmd1YWdlTmFtZSkpO1xuICAgICAgLy8gaGFyZCBvciBzb2Z0IGVycm9yXG4gICAgICBpZiAoIVNBRkVfTU9ERSkgeyB0aHJvdyBlcnJvciQxOyB9IGVsc2UgeyBlcnJvcihlcnJvciQxKTsgfVxuICAgICAgLy8gbGFuZ3VhZ2VzIHRoYXQgaGF2ZSBzZXJpb3VzIGVycm9ycyBhcmUgcmVwbGFjZWQgd2l0aCBlc3NlbnRpYWxseSBhXG4gICAgICAvLyBcInBsYWludGV4dFwiIHN0YW5kLWluIHNvIHRoYXQgdGhlIGNvZGUgYmxvY2tzIHdpbGwgc3RpbGwgZ2V0IG5vcm1hbFxuICAgICAgLy8gY3NzIGNsYXNzZXMgYXBwbGllZCB0byB0aGVtIC0gYW5kIG9uZSBiYWQgbGFuZ3VhZ2Ugd29uJ3QgYnJlYWsgdGhlXG4gICAgICAvLyBlbnRpcmUgaGlnaGxpZ2h0ZXJcbiAgICAgIGxhbmcgPSBQTEFJTlRFWFRfTEFOR1VBR0U7XG4gICAgfVxuICAgIC8vIGdpdmUgaXQgYSB0ZW1wb3JhcnkgbmFtZSBpZiBpdCBkb2Vzbid0IGhhdmUgb25lIGluIHRoZSBtZXRhLWRhdGFcbiAgICBpZiAoIWxhbmcubmFtZSkgbGFuZy5uYW1lID0gbGFuZ3VhZ2VOYW1lO1xuICAgIGxhbmd1YWdlc1tsYW5ndWFnZU5hbWVdID0gbGFuZztcbiAgICBsYW5nLnJhd0RlZmluaXRpb24gPSBsYW5ndWFnZURlZmluaXRpb24uYmluZChudWxsLCBobGpzKTtcblxuICAgIGlmIChsYW5nLmFsaWFzZXMpIHtcbiAgICAgIHJlZ2lzdGVyQWxpYXNlcyhsYW5nLmFsaWFzZXMsIHsgbGFuZ3VhZ2VOYW1lIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBsYW5ndWFnZSBncmFtbWFyIG1vZHVsZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2VOYW1lXG4gICAqL1xuICBmdW5jdGlvbiB1bnJlZ2lzdGVyTGFuZ3VhZ2UobGFuZ3VhZ2VOYW1lKSB7XG4gICAgZGVsZXRlIGxhbmd1YWdlc1tsYW5ndWFnZU5hbWVdO1xuICAgIGZvciAoY29uc3QgYWxpYXMgb2YgT2JqZWN0LmtleXMoYWxpYXNlcykpIHtcbiAgICAgIGlmIChhbGlhc2VzW2FsaWFzXSA9PT0gbGFuZ3VhZ2VOYW1lKSB7XG4gICAgICAgIGRlbGV0ZSBhbGlhc2VzW2FsaWFzXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge3N0cmluZ1tdfSBMaXN0IG9mIGxhbmd1YWdlIGludGVybmFsIG5hbWVzXG4gICAqL1xuICBmdW5jdGlvbiBsaXN0TGFuZ3VhZ2VzKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhsYW5ndWFnZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbmFtZSBvZiB0aGUgbGFuZ3VhZ2UgdG8gcmV0cmlldmVcbiAgICogQHJldHVybnMge0xhbmd1YWdlIHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0TGFuZ3VhZ2UobmFtZSkge1xuICAgIG5hbWUgPSAobmFtZSB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gbGFuZ3VhZ2VzW25hbWVdIHx8IGxhbmd1YWdlc1thbGlhc2VzW25hbWVdXTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gYWxpYXNMaXN0IC0gc2luZ2xlIGFsaWFzIG9yIGxpc3Qgb2YgYWxpYXNlc1xuICAgKiBAcGFyYW0ge3tsYW5ndWFnZU5hbWU6IHN0cmluZ319IG9wdHNcbiAgICovXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyQWxpYXNlcyhhbGlhc0xpc3QsIHsgbGFuZ3VhZ2VOYW1lIH0pIHtcbiAgICBpZiAodHlwZW9mIGFsaWFzTGlzdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGFsaWFzTGlzdCA9IFthbGlhc0xpc3RdO1xuICAgIH1cbiAgICBhbGlhc0xpc3QuZm9yRWFjaChhbGlhcyA9PiB7IGFsaWFzZXNbYWxpYXMudG9Mb3dlckNhc2UoKV0gPSBsYW5ndWFnZU5hbWU7IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgYSBnaXZlbiBsYW5ndWFnZSBoYXMgYXV0by1kZXRlY3Rpb24gZW5hYmxlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIG5hbWUgb2YgdGhlIGxhbmd1YWdlXG4gICAqL1xuICBmdW5jdGlvbiBhdXRvRGV0ZWN0aW9uKG5hbWUpIHtcbiAgICBjb25zdCBsYW5nID0gZ2V0TGFuZ3VhZ2UobmFtZSk7XG4gICAgcmV0dXJuIGxhbmcgJiYgIWxhbmcuZGlzYWJsZUF1dG9kZXRlY3Q7XG4gIH1cblxuICAvKipcbiAgICogVXBncmFkZXMgdGhlIG9sZCBoaWdobGlnaHRCbG9jayBwbHVnaW5zIHRvIHRoZSBuZXdcbiAgICogaGlnaGxpZ2h0RWxlbWVudCBBUElcbiAgICogQHBhcmFtIHtITEpTUGx1Z2lufSBwbHVnaW5cbiAgICovXG4gIGZ1bmN0aW9uIHVwZ3JhZGVQbHVnaW5BUEkocGx1Z2luKSB7XG4gICAgLy8gVE9ETzogcmVtb3ZlIHdpdGggdjEyXG4gICAgaWYgKHBsdWdpbltcImJlZm9yZTpoaWdobGlnaHRCbG9ja1wiXSAmJiAhcGx1Z2luW1wiYmVmb3JlOmhpZ2hsaWdodEVsZW1lbnRcIl0pIHtcbiAgICAgIHBsdWdpbltcImJlZm9yZTpoaWdobGlnaHRFbGVtZW50XCJdID0gKGRhdGEpID0+IHtcbiAgICAgICAgcGx1Z2luW1wiYmVmb3JlOmhpZ2hsaWdodEJsb2NrXCJdKFxuICAgICAgICAgIE9iamVjdC5hc3NpZ24oeyBibG9jazogZGF0YS5lbCB9LCBkYXRhKVxuICAgICAgICApO1xuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHBsdWdpbltcImFmdGVyOmhpZ2hsaWdodEJsb2NrXCJdICYmICFwbHVnaW5bXCJhZnRlcjpoaWdobGlnaHRFbGVtZW50XCJdKSB7XG4gICAgICBwbHVnaW5bXCJhZnRlcjpoaWdobGlnaHRFbGVtZW50XCJdID0gKGRhdGEpID0+IHtcbiAgICAgICAgcGx1Z2luW1wiYWZ0ZXI6aGlnaGxpZ2h0QmxvY2tcIl0oXG4gICAgICAgICAgT2JqZWN0LmFzc2lnbih7IGJsb2NrOiBkYXRhLmVsIH0sIGRhdGEpXG4gICAgICAgICk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hMSlNQbHVnaW59IHBsdWdpblxuICAgKi9cbiAgZnVuY3Rpb24gYWRkUGx1Z2luKHBsdWdpbikge1xuICAgIHVwZ3JhZGVQbHVnaW5BUEkocGx1Z2luKTtcbiAgICBwbHVnaW5zLnB1c2gocGx1Z2luKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hMSlNQbHVnaW59IHBsdWdpblxuICAgKi9cbiAgZnVuY3Rpb24gcmVtb3ZlUGx1Z2luKHBsdWdpbikge1xuICAgIGNvbnN0IGluZGV4ID0gcGx1Z2lucy5pbmRleE9mKHBsdWdpbik7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgcGx1Z2lucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge1BsdWdpbkV2ZW50fSBldmVudFxuICAgKiBAcGFyYW0ge2FueX0gYXJnc1xuICAgKi9cbiAgZnVuY3Rpb24gZmlyZShldmVudCwgYXJncykge1xuICAgIGNvbnN0IGNiID0gZXZlbnQ7XG4gICAgcGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uKHBsdWdpbikge1xuICAgICAgaWYgKHBsdWdpbltjYl0pIHtcbiAgICAgICAgcGx1Z2luW2NiXShhcmdzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBERVBSRUNBVEVEXG4gICAqIEBwYXJhbSB7SGlnaGxpZ2h0ZWRIVE1MRWxlbWVudH0gZWxcbiAgICovXG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZUhpZ2hsaWdodEJsb2NrKGVsKSB7XG4gICAgZGVwcmVjYXRlZChcIjEwLjcuMFwiLCBcImhpZ2hsaWdodEJsb2NrIHdpbGwgYmUgcmVtb3ZlZCBlbnRpcmVseSBpbiB2MTIuMFwiKTtcbiAgICBkZXByZWNhdGVkKFwiMTAuNy4wXCIsIFwiUGxlYXNlIHVzZSBoaWdobGlnaHRFbGVtZW50IG5vdy5cIik7XG5cbiAgICByZXR1cm4gaGlnaGxpZ2h0RWxlbWVudChlbCk7XG4gIH1cblxuICAvKiBJbnRlcmZhY2UgZGVmaW5pdGlvbiAqL1xuICBPYmplY3QuYXNzaWduKGhsanMsIHtcbiAgICBoaWdobGlnaHQsXG4gICAgaGlnaGxpZ2h0QXV0byxcbiAgICBoaWdobGlnaHRBbGwsXG4gICAgaGlnaGxpZ2h0RWxlbWVudCxcbiAgICAvLyBUT0RPOiBSZW1vdmUgd2l0aCB2MTIgQVBJXG4gICAgaGlnaGxpZ2h0QmxvY2s6IGRlcHJlY2F0ZUhpZ2hsaWdodEJsb2NrLFxuICAgIGNvbmZpZ3VyZSxcbiAgICBpbml0SGlnaGxpZ2h0aW5nLFxuICAgIGluaXRIaWdobGlnaHRpbmdPbkxvYWQsXG4gICAgcmVnaXN0ZXJMYW5ndWFnZSxcbiAgICB1bnJlZ2lzdGVyTGFuZ3VhZ2UsXG4gICAgbGlzdExhbmd1YWdlcyxcbiAgICBnZXRMYW5ndWFnZSxcbiAgICByZWdpc3RlckFsaWFzZXMsXG4gICAgYXV0b0RldGVjdGlvbixcbiAgICBpbmhlcml0LFxuICAgIGFkZFBsdWdpbixcbiAgICByZW1vdmVQbHVnaW5cbiAgfSk7XG5cbiAgaGxqcy5kZWJ1Z01vZGUgPSBmdW5jdGlvbigpIHsgU0FGRV9NT0RFID0gZmFsc2U7IH07XG4gIGhsanMuc2FmZU1vZGUgPSBmdW5jdGlvbigpIHsgU0FGRV9NT0RFID0gdHJ1ZTsgfTtcbiAgaGxqcy52ZXJzaW9uU3RyaW5nID0gdmVyc2lvbjtcblxuICBobGpzLnJlZ2V4ID0ge1xuICAgIGNvbmNhdDogY29uY2F0LFxuICAgIGxvb2thaGVhZDogbG9va2FoZWFkLFxuICAgIGVpdGhlcjogZWl0aGVyLFxuICAgIG9wdGlvbmFsOiBvcHRpb25hbCxcbiAgICBhbnlOdW1iZXJPZlRpbWVzOiBhbnlOdW1iZXJPZlRpbWVzXG4gIH07XG5cbiAgZm9yIChjb25zdCBrZXkgaW4gTU9ERVMpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKHR5cGVvZiBNT0RFU1trZXldID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBkZWVwRnJlZXplKE1PREVTW2tleV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIG1lcmdlIGFsbCB0aGUgbW9kZXMvcmVnZXhlcyBpbnRvIG91ciBtYWluIG9iamVjdFxuICBPYmplY3QuYXNzaWduKGhsanMsIE1PREVTKTtcblxuICByZXR1cm4gaGxqcztcbn07XG5cbi8vIE90aGVyIG5hbWVzIGZvciB0aGUgdmFyaWFibGUgbWF5IGJyZWFrIGJ1aWxkIHNjcmlwdFxuY29uc3QgaGlnaGxpZ2h0ID0gSExKUyh7fSk7XG5cbi8vIHJldHVybnMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGhpZ2hsaWdodGVyIHRvIGJlIHVzZWQgZm9yIGV4dGVuc2lvbnNcbi8vIGNoZWNrIGh0dHBzOi8vZ2l0aHViLmNvbS93b29vcm0vbG93bGlnaHQvaXNzdWVzLzQ3XG5oaWdobGlnaHQubmV3SW5zdGFuY2UgPSAoKSA9PiBITEpTKHt9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBoaWdobGlnaHQ7XG5oaWdobGlnaHQuSGlnaGxpZ2h0SlMgPSBoaWdobGlnaHQ7XG5oaWdobGlnaHQuZGVmYXVsdCA9IGhpZ2hsaWdodDtcbiIsIi8vIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvcGFja2FnZXMuaHRtbCNwYWNrYWdlc193cml0aW5nX2R1YWxfcGFja2FnZXNfd2hpbGVfYXZvaWRpbmdfb3JfbWluaW1pemluZ19oYXphcmRzXG5pbXBvcnQgSGlnaGxpZ2h0SlMgZnJvbSAnLi4vbGliL2NvcmUuanMnO1xuZXhwb3J0IHsgSGlnaGxpZ2h0SlMgfTtcbmV4cG9ydCBkZWZhdWx0IEhpZ2hsaWdodEpTO1xuIiwiLypcbkxhbmd1YWdlOiBSXG5EZXNjcmlwdGlvbjogUiBpcyBhIGZyZWUgc29mdHdhcmUgZW52aXJvbm1lbnQgZm9yIHN0YXRpc3RpY2FsIGNvbXB1dGluZyBhbmQgZ3JhcGhpY3MuXG5BdXRob3I6IEpvZSBDaGVuZyA8am9lQHJzdHVkaW8ub3JnPlxuQ29udHJpYnV0b3JzOiBLb25yYWQgUnVkb2xwaCA8a29ucmFkLnJ1ZG9scGhAZ21haWwuY29tPlxuV2Vic2l0ZTogaHR0cHM6Ly93d3cuci1wcm9qZWN0Lm9yZ1xuQ2F0ZWdvcnk6IGNvbW1vbixzY2llbnRpZmljXG4qL1xuXG4vKiogQHR5cGUgTGFuZ3VhZ2VGbiAqL1xuZnVuY3Rpb24gcihobGpzKSB7XG4gIGNvbnN0IHJlZ2V4ID0gaGxqcy5yZWdleDtcbiAgLy8gSWRlbnRpZmllcnMgaW4gUiBjYW5ub3Qgc3RhcnQgd2l0aCBgX2AsIGJ1dCB0aGV5IGNhbiBzdGFydCB3aXRoIGAuYCBpZiBpdFxuICAvLyBpcyBub3QgaW1tZWRpYXRlbHkgZm9sbG93ZWQgYnkgYSBkaWdpdC5cbiAgLy8gUiBhbHNvIHN1cHBvcnRzIHF1b3RlZCBpZGVudGlmaWVycywgd2hpY2ggYXJlIG5lYXItYXJiaXRyYXJ5IHNlcXVlbmNlc1xuICAvLyBkZWxpbWl0ZWQgYnkgYmFja3RpY2tzIChg4oCmYCksIHdoaWNoIG1heSBjb250YWluIGVzY2FwZSBzZXF1ZW5jZXMuIFRoZXNlIGFyZVxuICAvLyBoYW5kbGVkIGluIGEgc2VwYXJhdGUgbW9kZS4gU2VlIGB0ZXN0L21hcmt1cC9yL25hbWVzLnR4dGAgZm9yIGV4YW1wbGVzLlxuICAvLyBGSVhNRTogU3VwcG9ydCBVbmljb2RlIGlkZW50aWZpZXJzLlxuICBjb25zdCBJREVOVF9SRSA9IC8oPzooPzpbYS16QS1aXXxcXC5bLl9hLXpBLVpdKVsuX2EtekEtWjAtOV0qKXxcXC4oPyFcXGQpLztcbiAgY29uc3QgTlVNQkVSX1RZUEVTX1JFID0gcmVnZXguZWl0aGVyKFxuICAgIC8vIFNwZWNpYWwgY2FzZTogb25seSBoZXhhZGVjaW1hbCBiaW5hcnkgcG93ZXJzIGNhbiBjb250YWluIGZyYWN0aW9uc1xuICAgIC8wW3hYXVswLTlhLWZBLUZdK1xcLlswLTlhLWZBLUZdKltwUF1bKy1dP1xcZCtpPy8sXG4gICAgLy8gSGV4YWRlY2ltYWwgbnVtYmVycyB3aXRob3V0IGZyYWN0aW9uIGFuZCBvcHRpb25hbCBiaW5hcnkgcG93ZXJcbiAgICAvMFt4WF1bMC05YS1mQS1GXSsoPzpbcFBdWystXT9cXGQrKT9bTGldPy8sXG4gICAgLy8gRGVjaW1hbCBudW1iZXJzXG4gICAgLyg/OlxcZCsoPzpcXC5cXGQqKT98XFwuXFxkKykoPzpbZUVdWystXT9cXGQrKT9bTGldPy9cbiAgKTtcbiAgY29uc3QgT1BFUkFUT1JTX1JFID0gL1s9ITw+Ol09fFxcfFxcfHwmJnw6Ojo/fDwtfDw8LXwtPj58LT58XFx8PnxbLSsqXFwvPyEkJnw6PD0+QF5+XXxcXCpcXCovO1xuICBjb25zdCBQVU5DVFVBVElPTl9SRSA9IHJlZ2V4LmVpdGhlcihcbiAgICAvWygpXS8sXG4gICAgL1t7fV0vLFxuICAgIC9cXFtcXFsvLFxuICAgIC9bW1xcXV0vLFxuICAgIC9cXFxcLyxcbiAgICAvLC9cbiAgKTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdSJyxcblxuICAgIGtleXdvcmRzOiB7XG4gICAgICAkcGF0dGVybjogSURFTlRfUkUsXG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnZnVuY3Rpb24gaWYgaW4gYnJlYWsgbmV4dCByZXBlYXQgZWxzZSBmb3Igd2hpbGUnLFxuICAgICAgbGl0ZXJhbDpcbiAgICAgICAgJ05VTEwgTkEgVFJVRSBGQUxTRSBJbmYgTmFOIE5BX2ludGVnZXJffDEwIE5BX3JlYWxffDEwICdcbiAgICAgICAgKyAnTkFfY2hhcmFjdGVyX3wxMCBOQV9jb21wbGV4X3wxMCcsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgLy8gQnVpbHRpbiBjb25zdGFudHNcbiAgICAgICAgJ0xFVFRFUlMgbGV0dGVycyBtb250aC5hYmIgbW9udGgubmFtZSBwaSBUIEYgJ1xuICAgICAgICAvLyBQcmltaXRpdmUgZnVuY3Rpb25zXG4gICAgICAgIC8vIFRoZXNlIGFyZSBhbGwgdGhlIGZ1bmN0aW9ucyBpbiBgYmFzZWAgdGhhdCBhcmUgaW1wbGVtZW50ZWQgYXMgYVxuICAgICAgICAvLyBgLlByaW1pdGl2ZWAsIG1pbnVzIHRob3NlIGZ1bmN0aW9ucyB0aGF0IGFyZSBhbHNvIGtleXdvcmRzLlxuICAgICAgICArICdhYnMgYWNvcyBhY29zaCBhbGwgYW55IGFueU5BIEFyZyBhcy5jYWxsIGFzLmNoYXJhY3RlciAnXG4gICAgICAgICsgJ2FzLmNvbXBsZXggYXMuZG91YmxlIGFzLmVudmlyb25tZW50IGFzLmludGVnZXIgYXMubG9naWNhbCAnXG4gICAgICAgICsgJ2FzLm51bGwuZGVmYXVsdCBhcy5udW1lcmljIGFzLnJhdyBhc2luIGFzaW5oIGF0YW4gYXRhbmggYXR0ciAnXG4gICAgICAgICsgJ2F0dHJpYnV0ZXMgYmFzZWVudiBicm93c2VyIGMgY2FsbCBjZWlsaW5nIGNsYXNzIENvbmogY29zIGNvc2ggJ1xuICAgICAgICArICdjb3NwaSBjdW1tYXggY3VtbWluIGN1bXByb2QgY3Vtc3VtIGRpZ2FtbWEgZGltIGRpbW5hbWVzICdcbiAgICAgICAgKyAnZW1wdHllbnYgZXhwIGV4cHJlc3Npb24gZmxvb3IgZm9yY2VBbmRDYWxsIGdhbW1hIGdjLnRpbWUgJ1xuICAgICAgICArICdnbG9iYWxlbnYgSW0gaW50ZXJhY3RpdmUgaW52aXNpYmxlIGlzLmFycmF5IGlzLmF0b21pYyBpcy5jYWxsICdcbiAgICAgICAgKyAnaXMuY2hhcmFjdGVyIGlzLmNvbXBsZXggaXMuZG91YmxlIGlzLmVudmlyb25tZW50IGlzLmV4cHJlc3Npb24gJ1xuICAgICAgICArICdpcy5maW5pdGUgaXMuZnVuY3Rpb24gaXMuaW5maW5pdGUgaXMuaW50ZWdlciBpcy5sYW5ndWFnZSAnXG4gICAgICAgICsgJ2lzLmxpc3QgaXMubG9naWNhbCBpcy5tYXRyaXggaXMubmEgaXMubmFtZSBpcy5uYW4gaXMubnVsbCAnXG4gICAgICAgICsgJ2lzLm51bWVyaWMgaXMub2JqZWN0IGlzLnBhaXJsaXN0IGlzLnJhdyBpcy5yZWN1cnNpdmUgaXMuc2luZ2xlICdcbiAgICAgICAgKyAnaXMuc3ltYm9sIGxhenlMb2FkREJmZXRjaCBsZW5ndGggbGdhbW1hIGxpc3QgbG9nIG1heCBtaW4gJ1xuICAgICAgICArICdtaXNzaW5nIE1vZCBuYW1lcyBuYXJncyBuemNoYXIgb2xkQ2xhc3Mgb24uZXhpdCBwb3MudG8uZW52ICdcbiAgICAgICAgKyAncHJvYy50aW1lIHByb2QgcXVvdGUgcmFuZ2UgUmUgcmVwIHJldHJhY2VtZW0gcmV0dXJuIHJvdW5kICdcbiAgICAgICAgKyAnc2VxX2Fsb25nIHNlcV9sZW4gc2VxLmludCBzaWduIHNpZ25pZiBzaW4gc2luaCBzaW5waSBzcXJ0ICdcbiAgICAgICAgKyAnc3RhbmRhcmRHZW5lcmljIHN1YnN0aXR1dGUgc3VtIHN3aXRjaCB0YW4gdGFuaCB0YW5waSB0cmFjZW1lbSAnXG4gICAgICAgICsgJ3RyaWdhbW1hIHRydW5jIHVuY2xhc3MgdW50cmFjZW1lbSBVc2VNZXRob2QgeHRmcm0nLFxuICAgIH0sXG5cbiAgICBjb250YWluczogW1xuICAgICAgLy8gUm94eWdlbiBjb21tZW50c1xuICAgICAgaGxqcy5DT01NRU5UKFxuICAgICAgICAvIycvLFxuICAgICAgICAvJC8sXG4gICAgICAgIHsgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyBIYW5kbGUgYEBleGFtcGxlc2Agc2VwYXJhdGVseSB0byBjYXVzZSBhbGwgc3Vic2VxdWVudCBjb2RlXG4gICAgICAgICAgICAvLyB1bnRpbCB0aGUgbmV4dCBgQGAtdGFnIG9uIGl0cyBvd24gbGluZSB0byBiZSBrZXB0IGFzLWlzLFxuICAgICAgICAgICAgLy8gcHJldmVudGluZyBoaWdobGlnaHRpbmcuIFRoaXMgY29kZSBpcyBleGFtcGxlIFIgY29kZSwgc28gbmVzdGVkXG4gICAgICAgICAgICAvLyBkb2N0YWdzIHNob3VsZG7igJl0IGJlIHRyZWF0ZWQgYXMgc3VjaC4gU2VlXG4gICAgICAgICAgICAvLyBgdGVzdC9tYXJrdXAvci9yb3h5Z2VuLnR4dGAgZm9yIGFuIGV4YW1wbGUuXG4gICAgICAgICAgICBzY29wZTogJ2RvY3RhZycsXG4gICAgICAgICAgICBtYXRjaDogL0BleGFtcGxlcy8sXG4gICAgICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICAgICAgZW5kOiByZWdleC5sb29rYWhlYWQocmVnZXguZWl0aGVyKFxuICAgICAgICAgICAgICAgIC8vIGVuZCBpZiBhbm90aGVyIGRvYyBjb21tZW50XG4gICAgICAgICAgICAgICAgL1xcbl4jJ1xccyooPz1AW2EtekEtWl0rKS8sXG4gICAgICAgICAgICAgICAgLy8gb3IgYSBsaW5lIHdpdGggbm8gY29tbWVudFxuICAgICAgICAgICAgICAgIC9cXG5eKD8hIycpL1xuICAgICAgICAgICAgICApKSxcbiAgICAgICAgICAgICAgZW5kc1BhcmVudDogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gSGFuZGxlIGBAcGFyYW1gIHRvIGhpZ2hsaWdodCB0aGUgcGFyYW1ldGVyIG5hbWUgZm9sbG93aW5nXG4gICAgICAgICAgICAvLyBhZnRlci5cbiAgICAgICAgICAgIHNjb3BlOiAnZG9jdGFnJyxcbiAgICAgICAgICAgIGJlZ2luOiAnQHBhcmFtJyxcbiAgICAgICAgICAgIGVuZDogLyQvLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNjb3BlOiAndmFyaWFibGUnLFxuICAgICAgICAgICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgICAgICAgICB7IG1hdGNoOiBJREVOVF9SRSB9LFxuICAgICAgICAgICAgICAgICAgeyBtYXRjaDogL2AoPzpcXFxcLnxbXmBcXFxcXSkrYC8gfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgZW5kc1BhcmVudDogdHJ1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzY29wZTogJ2RvY3RhZycsXG4gICAgICAgICAgICBtYXRjaDogL0BbYS16QS1aXSsvXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzY29wZTogJ2tleXdvcmQnLFxuICAgICAgICAgICAgbWF0Y2g6IC9cXFxcW2EtekEtWl0rL1xuICAgICAgICAgIH1cbiAgICAgICAgXSB9XG4gICAgICApLFxuXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuXG4gICAgICB7XG4gICAgICAgIHNjb3BlOiAnc3RyaW5nJyxcbiAgICAgICAgY29udGFpbnM6IFsgaGxqcy5CQUNLU0xBU0hfRVNDQVBFIF0sXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgaGxqcy5FTkRfU0FNRV9BU19CRUdJTih7XG4gICAgICAgICAgICBiZWdpbjogL1tyUl1cIigtKilcXCgvLFxuICAgICAgICAgICAgZW5kOiAvXFwpKC0qKVwiL1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIGhsanMuRU5EX1NBTUVfQVNfQkVHSU4oe1xuICAgICAgICAgICAgYmVnaW46IC9bclJdXCIoLSopXFx7LyxcbiAgICAgICAgICAgIGVuZDogL1xcfSgtKilcIi9cbiAgICAgICAgICB9KSxcbiAgICAgICAgICBobGpzLkVORF9TQU1FX0FTX0JFR0lOKHtcbiAgICAgICAgICAgIGJlZ2luOiAvW3JSXVwiKC0qKVxcWy8sXG4gICAgICAgICAgICBlbmQ6IC9cXF0oLSopXCIvXG4gICAgICAgICAgfSksXG4gICAgICAgICAgaGxqcy5FTkRfU0FNRV9BU19CRUdJTih7XG4gICAgICAgICAgICBiZWdpbjogL1tyUl0nKC0qKVxcKC8sXG4gICAgICAgICAgICBlbmQ6IC9cXCkoLSopJy9cbiAgICAgICAgICB9KSxcbiAgICAgICAgICBobGpzLkVORF9TQU1FX0FTX0JFR0lOKHtcbiAgICAgICAgICAgIGJlZ2luOiAvW3JSXScoLSopXFx7LyxcbiAgICAgICAgICAgIGVuZDogL1xcfSgtKiknL1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIGhsanMuRU5EX1NBTUVfQVNfQkVHSU4oe1xuICAgICAgICAgICAgYmVnaW46IC9bclJdJygtKilcXFsvLFxuICAgICAgICAgICAgZW5kOiAvXFxdKC0qKScvXG4gICAgICAgICAgfSksXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46ICdcIicsXG4gICAgICAgICAgICBlbmQ6ICdcIicsXG4gICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiBcIidcIixcbiAgICAgICAgICAgIGVuZDogXCInXCIsXG4gICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICB9LFxuXG4gICAgICAvLyBNYXRjaGluZyBudW1iZXJzIGltbWVkaWF0ZWx5IGZvbGxvd2luZyBwdW5jdHVhdGlvbiBhbmQgb3BlcmF0b3JzIGlzXG4gICAgICAvLyB0cmlja3kgc2luY2Ugd2UgbmVlZCB0byBsb29rIGF0IHRoZSBjaGFyYWN0ZXIgYWhlYWQgb2YgYSBudW1iZXIgdG9cbiAgICAgIC8vIGVuc3VyZSB0aGUgbnVtYmVyIGlzIG5vdCBwYXJ0IG9mIGFuIGlkZW50aWZpZXIsIGFuZCB3ZSBjYW5ub3QgdXNlXG4gICAgICAvLyBuZWdhdGl2ZSBsb29rLWJlaGluZCBhc3NlcnRpb25zLiBTbyBpbnN0ZWFkIHdlIGV4cGxpY2l0bHkgaGFuZGxlIGFsbFxuICAgICAgLy8gcG9zc2libGUgY29tYmluYXRpb25zIG9mIChvcGVyYXRvcnxwdW5jdHVhdGlvbiksIG51bWJlci5cbiAgICAgIC8vIFRPRE86IHJlcGxhY2Ugd2l0aCBuZWdhdGl2ZSBsb29rLWJlaGluZCB3aGVuIGF2YWlsYWJsZVxuICAgICAgLy8geyBiZWdpbjogLyg/PCFbYS16QS1aMC05Ll9dKTBbeFhdWzAtOWEtZkEtRl0rXFwuWzAtOWEtZkEtRl0qW3BQXVsrLV0/XFxkK2k/LyB9LFxuICAgICAgLy8geyBiZWdpbjogLyg/PCFbYS16QS1aMC05Ll9dKTBbeFhdWzAtOWEtZkEtRl0rKFtwUF1bKy1dP1xcZCspP1tMaV0/LyB9LFxuICAgICAgLy8geyBiZWdpbjogLyg/PCFbYS16QS1aMC05Ll9dKShcXGQrKFxcLlxcZCopP3xcXC5cXGQrKShbZUVdWystXT9cXGQrKT9bTGldPy8gfVxuICAgICAge1xuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgMTogJ29wZXJhdG9yJyxcbiAgICAgICAgICAgICAgMjogJ251bWJlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXRjaDogW1xuICAgICAgICAgICAgICBPUEVSQVRPUlNfUkUsXG4gICAgICAgICAgICAgIE5VTUJFUl9UWVBFU19SRVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgMTogJ29wZXJhdG9yJyxcbiAgICAgICAgICAgICAgMjogJ251bWJlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXRjaDogW1xuICAgICAgICAgICAgICAvJVteJV0qJS8sXG4gICAgICAgICAgICAgIE5VTUJFUl9UWVBFU19SRVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgMTogJ3B1bmN0dWF0aW9uJyxcbiAgICAgICAgICAgICAgMjogJ251bWJlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXRjaDogW1xuICAgICAgICAgICAgICBQVU5DVFVBVElPTl9SRSxcbiAgICAgICAgICAgICAgTlVNQkVSX1RZUEVTX1JFXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzY29wZTogeyAyOiAnbnVtYmVyJyB9LFxuICAgICAgICAgICAgbWF0Y2g6IFtcbiAgICAgICAgICAgICAgL1teYS16QS1aMC05Ll9dfF4vLCAvLyBub3QgcGFydCBvZiBhbiBpZGVudGlmaWVyLCBvciBzdGFydCBvZiBkb2N1bWVudFxuICAgICAgICAgICAgICBOVU1CRVJfVFlQRVNfUkVcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG5cbiAgICAgIC8vIE9wZXJhdG9ycy9wdW5jdHVhdGlvbiB3aGVuIHRoZXkncmUgbm90IGRpcmVjdGx5IGZvbGxvd2VkIGJ5IG51bWJlcnNcbiAgICAgIHtcbiAgICAgICAgLy8gUmVsZXZhbmNlIGJvb3N0IGZvciB0aGUgbW9zdCBjb21tb24gYXNzaWdubWVudCBmb3JtLlxuICAgICAgICBzY29wZTogeyAzOiAnb3BlcmF0b3InIH0sXG4gICAgICAgIG1hdGNoOiBbXG4gICAgICAgICAgSURFTlRfUkUsXG4gICAgICAgICAgL1xccysvLFxuICAgICAgICAgIC88LS8sXG4gICAgICAgICAgL1xccysvXG4gICAgICAgIF1cbiAgICAgIH0sXG5cbiAgICAgIHtcbiAgICAgICAgc2NvcGU6ICdvcGVyYXRvcicsXG4gICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICB7IG1hdGNoOiBPUEVSQVRPUlNfUkUgfSxcbiAgICAgICAgICB7IG1hdGNoOiAvJVteJV0qJS8gfVxuICAgICAgICBdXG4gICAgICB9LFxuXG4gICAgICB7XG4gICAgICAgIHNjb3BlOiAncHVuY3R1YXRpb24nLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIG1hdGNoOiBQVU5DVFVBVElPTl9SRVxuICAgICAgfSxcblxuICAgICAge1xuICAgICAgICAvLyBFc2NhcGVkIGlkZW50aWZpZXJcbiAgICAgICAgYmVnaW46ICdgJyxcbiAgICAgICAgZW5kOiAnYCcsXG4gICAgICAgIGNvbnRhaW5zOiBbIHsgYmVnaW46IC9cXFxcLi8gfSBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgeyByIGFzIGRlZmF1bHQgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCJzaGlueVwiO1xuaW1wb3J0IFwiLi9jb3B5LmpzXCI7XG5pbXBvcnQgXCIuL2hsLmpzXCI7XG5pbXBvcnQgXCIuL3NoaW55LmpzXCI7XG5pbXBvcnQgXCIuL3N0YWNrLXRpdGxlLmpzXCI7XG5pbXBvcnQgXCIuL3Rvb2x0aXBzLmpzXCI7XG5pbXBvcnQgXCIuL2xvY2suanNcIjtcbmltcG9ydCBcIi4vcmVnaXN0cnkvaW5kZXguanNcIjtcbmltcG9ydCB7IGlzTG9ja2VkIH0gZnJvbSBcIi4vbG9jay5qc1wiO1xuXG5leHBvcnQgeyBpc0xvY2tlZCB9O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9