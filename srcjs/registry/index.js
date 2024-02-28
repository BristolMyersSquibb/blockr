import { description } from "./description";
import { bindSearch } from "./search";
import { bindScroll } from "./scroll";

$(() => {
  window.Shiny.addCustomMessageHandler("blockr-registry-endpoints", (msg) => {
    setTimeout(() => {
      bindSearch(msg);
      bindScroll(msg);
      description();
    }, msg.delay);
  });
});
