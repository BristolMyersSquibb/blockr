import { handleClick, renderPills } from "./render";
import { handleSearch } from "./search";

$(() => {
    handleSearch();
})

$(() => {
    handleClick();
    window.Shiny.addCustomMessageHandler("blockr-registry-endpoints", (msg) => {
        console.log(msg);
        $(`#${msg.ns}-scrollable-child`).html("");
        setTimeout(() => {
        renderPills(msg);
    }, msg.delay);
  });
});
