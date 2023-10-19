$(() => {
  toggler("code");
  toggler("output");
  editor();
  showLastOutputs();
});

const toggler = (item) => {
  $(`.stack-${item}-toggle`).each((_, btn) => {
    // already has a listener
    if (btn.getAttribute("listener") == "true") {
      return;
    }

    $(btn).on("click", (event) => {
      $(btn).toggleClass("showing");

      $(event.target).closest(".stack").find(`.block-${item}`).each(
        (_, code) => {
          const collapse = bootstrap.Collapse.getOrCreateInstance(code);

          if (!$(btn).hasClass("showing")) {
            collapse.hide();
            return;
          }

          collapse.show();
        },
      );
    });
  });
};

const collapseAll = (stack) => {
  collapseStackItem(stack, "code");
  collapseStackItem(stack, "output");
};

const collapseStackItem = (stack, item) => {
  const blocks = $(stack).find(`.block-${item}`);
  blocks.each(
    (j, code) => {
      if (j == (blocks.length - 1) && item == "output") {
        bootstrap.Collapse.getOrCreateInstance(code, { toggle: false }).show();
        return;
      }
      bootstrap.Collapse.getOrCreateInstance(code, { toggle: false }).hide();
    },
  );
};

const editor = () => {
  $(".stack-edit-toggle").on("click", (event) => {
    const $stack = $(event.target).closest(".stack");

    const editable = $(event.currentTarget).hasClass("etidable");
    $(event.currentTarget).toggleClass("etidable");

    if (editable) {
      $stack.find(".block").find(".card").hide();
      $stack.find(`.stack-code-toggle`).hide();
      $stack.find(`.stack-output-toggle`).hide();
      $stack.find(".card-body").toggleClass("p-1");
      $stack.find(".block").toggleClass("mb-2");
      collapseAll($stack);
      return;
    }

    $stack.find(".block").find(".card").show();
    $stack.find(`.stack-code-toggle`).show();
    $stack.find(`.stack-output-toggle`).show();
    $stack.find(".card-body").toggleClass("p-1");
    $stack.find(".block").toggleClass("mb-2");
  });
};

const showLastOutput = (el) => {
  const lastOutput = $(el).find(".block-output")
    .last();

  bootstrap.Collapse.getOrCreateInstance(lastOutput, { toggle: false })
    .show();
};

const showLastOutputs = () => {
  $(".stack").each((i, el) => {
    showLastOutput(el);
  });
};
