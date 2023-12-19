/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * Updates for {pkgdown} by the {bslib} authors, also licensed under CC-BY-3.0.
 */

const getStoredTheme = () => localStorage.getItem('theme')
const setStoredTheme = theme => localStorage.setItem('theme', theme)

const getPreferredTheme = () => {
  const storedTheme = getStoredTheme()
  if (storedTheme) {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const setTheme = theme => {
  if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-bs-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }
}

setTheme(getPreferredTheme())

function bsSetupThemeToggle () {
  'use strict'

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector('#bd-theme')

    if (!themeSwitcher) {
      return
    }

    const themeSwitcherText = document.querySelector('#bd-theme-text')
    const activeThemeIcon = document.querySelector('.theme-icon-active')
    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
    const svgOfActiveBtn = btnToActive.querySelector('.theme-icon').innerHTML

    document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active')
      element.setAttribute('aria-pressed', 'false')
    })

    btnToActive.classList.add('active')
    btnToActive.setAttribute('aria-pressed', 'true')
    activeThemeIcon.innerHTML = svgOfActiveBtn
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

    if (focus) {
      themeSwitcher.focus()
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme()
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    showActiveTheme(getPreferredTheme())

    document.querySelectorAll('[data-bs-theme-value]')
      .forEach(toggle => {
        toggle.addEventListener('click', () => {
          const theme = toggle.getAttribute('data-bs-theme-value')
          setStoredTheme(theme)
          setTheme(theme)
          showActiveTheme(theme, true)
        })
      })
  })
}

function colorPickerMarkup () {
  const svgs = {
    "sun-fill": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="bi bi-sun-fill" style="height:1em;width:1em;fill:currentColor;" aria-hidden="true" role="img" ><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"></path></svg>`,
    "moon-stars-fill": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="bi bi-moon-stars-fill" style="height:1em;width:1em;fill:currentColor;" aria-hidden="true" role="img" ><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path>
    <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path></svg>`,
    "circle-half": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="bi bi-circle-half" style="height:1em;width:1em;fill:currentColor;" aria-hidden="true" role="img" ><path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"></path></svg>`
  }

  const icons = {
    "sun-fill": `<i class="bi bi-sun-fill"></i>`,
    "moon-stars-fill": `<i class="bi bi-moon-stars-fill"></i>`,
    "circle-half": `<i class="bi bi-circle-half"></i>`
  }

  return `<button class="btn btn-link nav-link py-2 px-0 px-lg-2 dropdown-toggle d-flex align-items-center" id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown" data-bs-display="static" aria-label="Toggle theme (light)">
    <span class="theme-icon-active">${icons['sun-fill']}</span>
    <span class="d-lg-none ms-2" id="bd-theme-text">Toggle theme</span>
  </button>
  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme-text">
    <li>
      <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="light" aria-pressed="true">
        <span class="me-2 opacity-50 theme-icon">${icons['sun-fill']}</span>
        Light
        <svg class="bi ms-auto d-none"><use href="#check2"></use></svg>
      </button>
    </li>
    <li>
      <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark" aria-pressed="false">
        <span class="me-2 opacity-50 theme-icon">${svgs['moon-stars-fill']}</span>
        Dark
        <svg class="bi ms-auto d-none"><use href="#check2"></use></svg>
      </button>
    </li>
    <li>
      <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="auto" aria-pressed="false">
        <span class="me-2 opacity-50 theme-icon">${icons['circle-half']}</span>
        Auto
        <svg class="bi ms-auto d-none"><use href="#check2"></use></svg>
      </button>
    </li>
  </ul>`
}

document.addEventListener('DOMContentLoaded', () => {
  const switcher = document.querySelector('.navbar [href$="#dark-mode"]')
  if (!switcher) return

  switcher.parentElement.classList.add('dropdown')
  switcher.parentElement.innerHTML = colorPickerMarkup()
  bsSetupThemeToggle()
})

/*! bslib cards 0.5.1.9000 | (c) 2012-2023 RStudio, PBC. | License: MIT + file LICENSE */
"use strict";(()=>{var p=window.Shiny?Shiny.InputBinding:class{};function h(u){let e=["a[href]","area[href]","button","details summary","input","iframe","select","textarea",'[contentEditable=""]','[contentEditable="true"]','[contentEditable="TRUE"]',"[tabindex]"],t=[':not([tabindex="-1"])',":not([disabled])"],s=e.map(i=>i+t.join("")),r=u.querySelectorAll(s.join(", "));return Array.from(r)}var d=class{constructor(){this.resizeObserverEntries=[],this.resizeObserver=new ResizeObserver(e=>{let t=new Event("resize");if(window.dispatchEvent(t),!window.Shiny)return;let s=[];for(let r of e)r.target instanceof HTMLElement&&r.target.querySelector(".shiny-bound-output")&&r.target.querySelectorAll(".shiny-bound-output").forEach(i=>{if(s.includes(i))return;let{binding:o,onResize:E}=$(i).data("shinyOutputBinding");if(!o||!o.resize)return;let c=i.shinyResizeObserver;if(c&&c!==this||(c||(i.shinyResizeObserver=this),E(i),s.push(i),!i.classList.contains("shiny-plot-output")))return;let l=i.querySelector('img:not([width="100%"])');l&&l.setAttribute("width","100%")})})}observe(e){this.resizeObserver.observe(e),this.resizeObserverEntries.push(e)}unobserve(e){let t=this.resizeObserverEntries.indexOf(e);t<0||(this.resizeObserver.unobserve(e),this.resizeObserverEntries.splice(t,1))}flush(){this.resizeObserverEntries.forEach(e=>{document.body.contains(e)||this.unobserve(e)})}};var n=class{constructor(e){var t;e.removeAttribute(n.attr.ATTR_INIT),(t=e.querySelector(`script[${n.attr.ATTR_INIT}]`))==null||t.remove(),this.card=e,n.instanceMap.set(e,this),n.shinyResizeObserver.observe(this.card),this._addEventListeners(),this.overlay=this._createOverlay(),this._exitFullScreenOnEscape=this._exitFullScreenOnEscape.bind(this),this._trapFocusExit=this._trapFocusExit.bind(this)}enterFullScreen(e){var t;e&&e.preventDefault(),document.addEventListener("keydown",this._exitFullScreenOnEscape,!1),document.addEventListener("keydown",this._trapFocusExit,!0),this.card.setAttribute(n.attr.ATTR_FULL_SCREEN,"true"),document.body.classList.add(n.attr.CLASS_HAS_FULL_SCREEN),this.card.insertAdjacentElement("beforebegin",this.overlay.container),(!this.card.contains(document.activeElement)||(t=document.activeElement)!=null&&t.classList.contains(n.attr.CLASS_FULL_SCREEN_ENTER))&&(this.card.setAttribute("tabindex","-1"),this.card.focus())}exitFullScreen(){document.removeEventListener("keydown",this._exitFullScreenOnEscape,!1),document.removeEventListener("keydown",this._trapFocusExit,!0),this.overlay.container.remove(),this.card.setAttribute(n.attr.ATTR_FULL_SCREEN,"false"),this.card.removeAttribute("tabindex"),document.body.classList.remove(n.attr.CLASS_HAS_FULL_SCREEN)}_addEventListeners(){let e=this.card.querySelector(`:scope > * > .${n.attr.CLASS_FULL_SCREEN_ENTER}`);e&&e.addEventListener("click",t=>this.enterFullScreen(t))}_exitFullScreenOnEscape(e){if(!(e.target instanceof HTMLElement))return;let t=["select[open]","input[aria-expanded='true']"];e.target.matches(t.join(", "))||e.key==="Escape"&&this.exitFullScreen()}_trapFocusExit(e){if(!(e instanceof KeyboardEvent)||e.key!=="Tab")return;let t=e.target===this.card,s=e.target===this.overlay.anchor,r=this.card.contains(e.target),i=()=>{e.preventDefault(),e.stopImmediatePropagation()};if(!(r||t||s)){i(),this.card.focus();return}let o=h(this.card).filter(b=>!b.classList.contains(n.attr.CLASS_FULL_SCREEN_ENTER));if(!(o.length>0)){i(),this.overlay.anchor.focus();return}if(t)return;let c=o[o.length-1],l=e.target===c;if(s&&e.shiftKey){i(),c.focus();return}if(l&&!e.shiftKey){i(),this.overlay.anchor.focus();return}}_createOverlay(){let e=document.createElement("div");e.id=n.attr.ID_FULL_SCREEN_OVERLAY,e.onclick=this.exitFullScreen.bind(this);let t=this._createOverlayCloseAnchor();return e.appendChild(t),{container:e,anchor:t}}_createOverlayCloseAnchor(){let e=document.createElement("a");return e.classList.add(n.attr.CLASS_FULL_SCREEN_EXIT),e.tabIndex=0,e.onclick=()=>this.exitFullScreen(),e.onkeydown=t=>{(t.key==="Enter"||t.key===" ")&&this.exitFullScreen()},e.innerHTML=this._overlayCloseHtml(),e}_overlayCloseHtml(){return"Close <svg width='20' height='20' fill='currentColor' class='bi bi-x-lg' viewBox='0 0 16 16'><path d='M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z'/></svg>"}static getInstance(e){return n.instanceMap.get(e)}static initializeAllCards(e=!0){if(document.readyState==="loading"){n.onReadyScheduled||(n.onReadyScheduled=!0,document.addEventListener("DOMContentLoaded",()=>{n.initializeAllCards(!1)}));return}e&&n.shinyResizeObserver.flush();let t=`.${n.attr.CLASS_CARD}[${n.attr.ATTR_INIT}]`;if(!document.querySelector(t))return;document.querySelectorAll(t).forEach(r=>new n(r))}},a=n;a.attr={ATTR_INIT:"data-bslib-card-init",CLASS_CARD:"bslib-card",ATTR_FULL_SCREEN:"data-full-screen",CLASS_HAS_FULL_SCREEN:"bslib-has-full-screen",CLASS_FULL_SCREEN_ENTER:"bslib-full-screen-enter",CLASS_FULL_SCREEN_EXIT:"bslib-full-screen-exit",ID_FULL_SCREEN_OVERLAY:"bslib-full-screen-overlay"},a.shinyResizeObserver=new d,a.instanceMap=new WeakMap,a.onReadyScheduled=!1;window.bslib=window.bslib||{};window.bslib.Card=a;})();
//# sourceMappingURL=card.min.js.map