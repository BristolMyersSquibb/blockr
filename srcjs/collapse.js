$(() => {
  editor();
  toggleOutputInput();
  handleIcons();
});

// handles icons collapse state
export const handleIcons = () => {
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

export const showLastOutput = (el) => {
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

export const collapseOtherBlocks = (stack, block) => {
  const btns = $(stack).find(".block-output-toggle");

  $(btns).each((_index, btn) => {
    if ($(btn).closest(".block").data("value") == `${block}-block`) return;

    const isCollapsed = $(btn).find("i").hasClass("fa-chevron-down");
    if (isCollapsed) return;

    $(btn).trigger("click");
  });
};
