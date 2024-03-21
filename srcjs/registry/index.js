import { description } from "./description";
import { bindSearch } from "./search";
import { bindScroll } from "./scroll";
import { fetchFactory } from "./fetch";

$(() => {
  window.Shiny.addCustomMessageHandler("blockr-registry-endpoints", (msg) => {
    const endpoints = fetchFactory(msg);
    setTimeout(() => {
      bindSearch(msg);
      bindScroll(msg, endpoints);
      description();
    }, msg.delay);
  });
});
