export const collapse = (stack) => {
  editor(stack);
  showLastOutputs(stack);
};

const editor = (stack) => {
  const editBtn = $(stack).find(".stack-edit-toggle");

  // already has a listener
  if (editBtn[0].getAttribute("listener")) {
    return;
  }

  $(editBtn).on("click", (event) => {
    const $stack = $(event.target).closest(".stack");
    const $blocks = $stack.find(".block");

    $(event.currentTarget).toggleClass("etidable");
    const editable = $(event.currentTarget).hasClass("etidable");

    $blocks.each((index, block) => {
      const $block = $(block);

      if (editable) {
        $block.removeClass("d-none");
        $block.find(".block-inputs").removeClass("d-none");

        if (index == ($blocks.length - 1)) {
          $block.find(".block-inputs").removeClass("d-none");
          $block.find(".block-inputs").trigger("shown");
          $block.find(".block-output").removeClass("d-none");
          $block.find(".block-output").trigger("shown");
        }
        return;
      }

      $block.addClass("d-none");
      $block.find(".block-inputs").addClass("d-none");

      if (index == ($blocks.length - 1)) {
        $block.removeClass("d-none");
        $block.find(".block-inputs").addClass("d-none");
        $block.find(".block-inputs").trigger("hidden");
        $block.find(".block-output").removeClass("d-none");
        $block.find(".block-output").removeClass("collapse");
        $block.find(".block-output").trigger("shown");
      }
    });
  });
};

export const showLastOutput = (el) => {
  const $block = $(el).find(".block").last();

  $block.removeClass("d-none");
  const lastOutput = $block.find(".block-output");

  bootstrap.Collapse.getOrCreateInstance(lastOutput, { toggle: false }).show();
  $(lastOutput).trigger("shown");
};

const showLastOutputs = (stack) => {
  $(stack).each((_, el) => {
    showLastOutput(el);
  });
};
