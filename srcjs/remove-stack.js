export const remove = (stack) => {
  $(stack).find(".stack-remove").each((_, btn) => {
    // already has a listener
    if (btn.getAttribute("listener") == "true") {
      return;
    }

    $(btn).on("click", (event) => {
      const $stack = $(event.target).closest(".stack");
      const $masonry = $stack.closest(".masonry-item");
      const $workspace = $stack.closest(".workspace");

      if ($workspace.length) {
        $stack.closest(".col").remove();
        return;
      }

      $stack.remove();

      if ($masonry.length === 0) {
        return;
      }

      $masonry.remove();
    });
  });
};
