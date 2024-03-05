$(() => {
  $(document).on("blockr:remove-stack", (e) => {
    const col = $(`#${e.detail.stack}`).closest(".stack-col");

    if (!col) return;

    $(col).remove();
  });
});
