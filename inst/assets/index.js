!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("Shiny")):"function"==typeof define&&define.amd?define(["Shiny"],t):"object"==typeof exports?exports.blockr=t(require("Shiny")):e.blockr=t(e.Shiny)}(self,(e=>(()=>{var t={826:()=>{window.Shiny.addCustomMessageHandler("blockr-copy-code",(e=>{var t;e.code?(t=e.code.map((e=>e.trim())).join("\n\t"),navigator.clipboard.writeText(t),window.Shiny.notifications.show({html:"<span>Code copied to clipboard</span>",type:"message"})):window.Shiny.notifications.show({html:"<span>Failed to copy code to clipboard</span>",type:"error"})}))},305:(e,t,n)=>{"use strict";n.d(t,{isLocked:()=>i,renderLocked:()=>r});let o=!1;window.Shiny.addCustomMessageHandler("lock",(e=>{o=e.locked,a(),s(e.locked)}));const i=()=>o,s=e=>{const t=new CustomEvent("blockr:lock",{detail:{locked:e}});document.dispatchEvent(t)},a=()=>{o&&($(".stack-remove").toggle(),$(".stack-edit-toggle").toggle(),$(".stack-copy-code").toggle(),$(".block-code-toggle").toggle(),$(".block-output-toggle").toggle(),$(".block-remove").toggle(),$(".stack-title").off(),$(".stack").each(((e,t)=>{const n=$(t).find(".stack-edit-toggle");n.find("i").hasClass("fa-chevron-up")||n.trigger("click")})))},r=(e,t)=>{o=t,o&&c(e)},c=e=>{if(!o)return;let t=$(e);t.find(".stack-remove").hide(),t.find(".stack-edit-toggle").hide(),t.find(".stack-copy-code").hide(),t.find(".block-code-toggle").hide(),t.find(".block-output-toggle").hide(),t.find(".block-remove").hide(),$(".stack-title").off();const n=t.find(".stack-edit-toggle");n.find("i").hasClass("fa-chevron-up")||n.trigger("click")}},230:t=>{"use strict";t.exports=e},390:e=>{function t(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach((n=>{const o=e[n],i=typeof o;"object"!==i&&"function"!==i||Object.isFrozen(o)||t(o)})),e}class n{constructor(e){void 0===e.data&&(e.data={}),this.data=e.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function o(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function i(e,...t){const n=Object.create(null);for(const t in e)n[t]=e[t];return t.forEach((function(e){for(const t in e)n[t]=e[t]})),n}const s=e=>!!e.scope;class a{constructor(e,t){this.buffer="",this.classPrefix=t.classPrefix,e.walk(this)}addText(e){this.buffer+=o(e)}openNode(e){if(!s(e))return;const t=((e,{prefix:t})=>{if(e.startsWith("language:"))return e.replace("language:","language-");if(e.includes(".")){const n=e.split(".");return[`${t}${n.shift()}`,...n.map(((e,t)=>`${e}${"_".repeat(t+1)}`))].join(" ")}return`${t}${e}`})(e.scope,{prefix:this.classPrefix});this.span(t)}closeNode(e){s(e)&&(this.buffer+="</span>")}value(){return this.buffer}span(e){this.buffer+=`<span class="${e}">`}}const r=(e={})=>{const t={children:[]};return Object.assign(t,e),t};class c{constructor(){this.rootNode=r(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){this.top.children.push(e)}openNode(e){const t=r({scope:e});this.add(t),this.stack.push(t)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,t){return"string"==typeof t?e.addText(t):t.children&&(e.openNode(t),t.children.forEach((t=>this._walk(e,t))),e.closeNode(t)),e}static _collapse(e){"string"!=typeof e&&e.children&&(e.children.every((e=>"string"==typeof e))?e.children=[e.children.join("")]:e.children.forEach((e=>{c._collapse(e)})))}}class l extends c{constructor(e){super(),this.options=e}addText(e){""!==e&&this.add(e)}startScope(e){this.openNode(e)}endScope(){this.closeNode()}__addSublanguage(e,t){const n=e.root;t&&(n.scope=`language:${t}`),this.add(n)}toHTML(){return new a(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function d(e){return e?"string"==typeof e?e:e.source:null}function u(e){return f("(?=",e,")")}function g(e){return f("(?:",e,")*")}function h(e){return f("(?:",e,")?")}function f(...e){return e.map((e=>d(e))).join("")}function p(...e){const t=function(e){const t=e[e.length-1];return"object"==typeof t&&t.constructor===Object?(e.splice(e.length-1,1),t):{}}(e);return"("+(t.capture?"":"?:")+e.map((e=>d(e))).join("|")+")"}function b(e){return new RegExp(e.toString()+"|").exec("").length-1}const m=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function k(e,{joinWith:t}){let n=0;return e.map((e=>{n+=1;const t=n;let o=d(e),i="";for(;o.length>0;){const e=m.exec(o);if(!e){i+=o;break}i+=o.substring(0,e.index),o=o.substring(e.index+e[0].length),"\\"===e[0][0]&&e[1]?i+="\\"+String(Number(e[1])+t):(i+=e[0],"("===e[0]&&n++)}return i})).map((e=>`(${e})`)).join(t)}const w="[a-zA-Z]\\w*",y="[a-zA-Z_]\\w*",E="\\b\\d+(\\.\\d+)?",v="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",x="\\b(0b[01]+)",_={begin:"\\\\[\\s\\S]",relevance:0},S={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[_]},$={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[_]},A=function(e,t,n={}){const o=i({scope:"comment",begin:e,end:t,contains:[]},n);o.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const s=p("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return o.contains.push({begin:f(/[ ]+/,"(",s,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),o},N=A("//","$"),C=A("/\\*","\\*/"),M=A("#","$"),O={scope:"number",begin:E,relevance:0},R={scope:"number",begin:v,relevance:0},T={scope:"number",begin:x,relevance:0},j={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[_,{begin:/\[/,end:/\]/,relevance:0,contains:[_]}]},I={scope:"title",begin:w,relevance:0},L={scope:"title",begin:y,relevance:0},B={begin:"\\.\\s*"+y,relevance:0};var H=Object.freeze({__proto__:null,APOS_STRING_MODE:S,BACKSLASH_ESCAPE:_,BINARY_NUMBER_MODE:T,BINARY_NUMBER_RE:x,COMMENT:A,C_BLOCK_COMMENT_MODE:C,C_LINE_COMMENT_MODE:N,C_NUMBER_MODE:R,C_NUMBER_RE:v,END_SAME_AS_BEGIN:function(e){return Object.assign(e,{"on:begin":(e,t)=>{t.data._beginMatch=e[1]},"on:end":(e,t)=>{t.data._beginMatch!==e[1]&&t.ignoreMatch()}})},HASH_COMMENT_MODE:M,IDENT_RE:w,MATCH_NOTHING_RE:/\b\B/,METHOD_GUARD:B,NUMBER_MODE:O,NUMBER_RE:E,PHRASAL_WORDS_MODE:{begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},QUOTE_STRING_MODE:$,REGEXP_MODE:j,RE_STARTERS_RE:"!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",SHEBANG:(e={})=>{const t=/^#![ ]*\//;return e.binary&&(e.begin=f(t,/.*\b/,e.binary,/\b.*/)),i({scope:"meta",begin:t,end:/$/,relevance:0,"on:begin":(e,t)=>{0!==e.index&&t.ignoreMatch()}},e)},TITLE_MODE:I,UNDERSCORE_IDENT_RE:y,UNDERSCORE_TITLE_MODE:L});function P(e,t){"."===e.input[e.index-1]&&t.ignoreMatch()}function D(e,t){void 0!==e.className&&(e.scope=e.className,delete e.className)}function z(e,t){t&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=P,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,void 0===e.relevance&&(e.relevance=0))}function U(e,t){Array.isArray(e.illegal)&&(e.illegal=p(...e.illegal))}function G(e,t){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function W(e,t){void 0===e.relevance&&(e.relevance=1)}const Z=(e,t)=>{if(!e.beforeMatch)return;if(e.starts)throw new Error("beforeMatch cannot be used with starts");const n=Object.assign({},e);Object.keys(e).forEach((t=>{delete e[t]})),e.keywords=n.keywords,e.begin=f(n.beforeMatch,u(n.begin)),e.starts={relevance:0,contains:[Object.assign(n,{endsParent:!0})]},e.relevance=0,delete n.beforeMatch},F=["of","and","for","in","not","or","if","then","parent","list","value"],X="keyword";function q(e,t,n=X){const o=Object.create(null);return"string"==typeof e?i(n,e.split(" ")):Array.isArray(e)?i(n,e):Object.keys(e).forEach((function(n){Object.assign(o,q(e[n],t,n))})),o;function i(e,n){t&&(n=n.map((e=>e.toLowerCase()))),n.forEach((function(t){const n=t.split("|");o[n[0]]=[e,K(n[0],n[1])]}))}}function K(e,t){return t?Number(t):function(e){return F.includes(e.toLowerCase())}(e)?0:1}const V={},J=e=>{console.error(e)},Y=(e,...t)=>{console.log(`WARN: ${e}`,...t)},Q=(e,t)=>{V[`${e}/${t}`]||(console.log(`Deprecated as of ${e}. ${t}`),V[`${e}/${t}`]=!0)},ee=new Error;function te(e,t,{key:n}){let o=0;const i=e[n],s={},a={};for(let e=1;e<=t.length;e++)a[e+o]=i[e],s[e+o]=!0,o+=b(t[e-1]);e[n]=a,e[n]._emit=s,e[n]._multi=!0}function ne(e){!function(e){e.scope&&"object"==typeof e.scope&&null!==e.scope&&(e.beginScope=e.scope,delete e.scope)}(e),"string"==typeof e.beginScope&&(e.beginScope={_wrap:e.beginScope}),"string"==typeof e.endScope&&(e.endScope={_wrap:e.endScope}),function(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw J("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),ee;if("object"!=typeof e.beginScope||null===e.beginScope)throw J("beginScope must be object"),ee;te(e,e.begin,{key:"beginScope"}),e.begin=k(e.begin,{joinWith:""})}}(e),function(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw J("skip, excludeEnd, returnEnd not compatible with endScope: {}"),ee;if("object"!=typeof e.endScope||null===e.endScope)throw J("endScope must be object"),ee;te(e,e.end,{key:"endScope"}),e.end=k(e.end,{joinWith:""})}}(e)}function oe(e){function t(t,n){return new RegExp(d(t),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(n?"g":""))}class n{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(e,t){t.position=this.position++,this.matchIndexes[this.matchAt]=t,this.regexes.push([t,e]),this.matchAt+=b(e)+1}compile(){0===this.regexes.length&&(this.exec=()=>null);const e=this.regexes.map((e=>e[1]));this.matcherRe=t(k(e,{joinWith:"|"}),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex;const t=this.matcherRe.exec(e);if(!t)return null;const n=t.findIndex(((e,t)=>t>0&&void 0!==e)),o=this.matchIndexes[n];return t.splice(0,n),Object.assign(t,o)}}class o{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){if(this.multiRegexes[e])return this.multiRegexes[e];const t=new n;return this.rules.slice(e).forEach((([e,n])=>t.addRule(e,n))),t.compile(),this.multiRegexes[e]=t,t}resumingScanAtSamePosition(){return 0!==this.regexIndex}considerAll(){this.regexIndex=0}addRule(e,t){this.rules.push([e,t]),"begin"===t.type&&this.count++}exec(e){const t=this.getMatcher(this.regexIndex);t.lastIndex=this.lastIndex;let n=t.exec(e);if(this.resumingScanAtSamePosition())if(n&&n.index===this.lastIndex);else{const t=this.getMatcher(0);t.lastIndex=this.lastIndex+1,n=t.exec(e)}return n&&(this.regexIndex+=n.position+1,this.regexIndex===this.count&&this.considerAll()),n}}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=i(e.classNameAliases||{}),function n(s,a){const r=s;if(s.isCompiled)return r;[D,G,ne,Z].forEach((e=>e(s,a))),e.compilerExtensions.forEach((e=>e(s,a))),s.__beforeBegin=null,[z,U,W].forEach((e=>e(s,a))),s.isCompiled=!0;let c=null;return"object"==typeof s.keywords&&s.keywords.$pattern&&(s.keywords=Object.assign({},s.keywords),c=s.keywords.$pattern,delete s.keywords.$pattern),c=c||/\w+/,s.keywords&&(s.keywords=q(s.keywords,e.case_insensitive)),r.keywordPatternRe=t(c,!0),a&&(s.begin||(s.begin=/\B|\b/),r.beginRe=t(r.begin),s.end||s.endsWithParent||(s.end=/\B|\b/),s.end&&(r.endRe=t(r.end)),r.terminatorEnd=d(r.end)||"",s.endsWithParent&&a.terminatorEnd&&(r.terminatorEnd+=(s.end?"|":"")+a.terminatorEnd)),s.illegal&&(r.illegalRe=t(s.illegal)),s.contains||(s.contains=[]),s.contains=[].concat(...s.contains.map((function(e){return function(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map((function(t){return i(e,{variants:null},t)}))),e.cachedVariants?e.cachedVariants:ie(e)?i(e,{starts:e.starts?i(e.starts):null}):Object.isFrozen(e)?i(e):e}("self"===e?s:e)}))),s.contains.forEach((function(e){n(e,r)})),s.starts&&n(s.starts,a),r.matcher=function(e){const t=new o;return e.contains.forEach((e=>t.addRule(e.begin,{rule:e,type:"begin"}))),e.terminatorEnd&&t.addRule(e.terminatorEnd,{type:"end"}),e.illegal&&t.addRule(e.illegal,{type:"illegal"}),t}(r),r}(e)}function ie(e){return!!e&&(e.endsWithParent||ie(e.starts))}class se extends Error{constructor(e,t){super(e),this.name="HTMLInjectionError",this.html=t}}const ae=o,re=i,ce=Symbol("nomatch"),le=function(e){const o=Object.create(null),i=Object.create(null),s=[];let a=!0;const r="Could not find the language '{}', did you forget to load/include a language module?",c={disableAutodetect:!0,name:"Plain text",contains:[]};let d={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:l};function b(e){return d.noHighlightRe.test(e)}function m(e,t,n){let o="",i="";"object"==typeof t?(o=e,n=t.ignoreIllegals,i=t.language):(Q("10.7.0","highlight(lang, code, ...args) has been deprecated."),Q("10.7.0","Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"),i=e,o=t),void 0===n&&(n=!0);const s={code:o,language:i};$("before:highlight",s);const a=s.result?s.result:k(s.language,s.code,n);return a.code=s.code,$("after:highlight",a),a}function k(e,t,i,s){const c=Object.create(null);function l(){if(!$.keywords)return void N.addText(C);let e=0;$.keywordPatternRe.lastIndex=0;let t=$.keywordPatternRe.exec(C),n="";for(;t;){n+=C.substring(e,t.index);const i=v.case_insensitive?t[0].toLowerCase():t[0],s=(o=i,$.keywords[o]);if(s){const[e,o]=s;if(N.addText(n),n="",c[i]=(c[i]||0)+1,c[i]<=7&&(M+=o),e.startsWith("_"))n+=t[0];else{const n=v.classNameAliases[e]||e;g(t[0],n)}}else n+=t[0];e=$.keywordPatternRe.lastIndex,t=$.keywordPatternRe.exec(C)}var o;n+=C.substring(e),N.addText(n)}function u(){null!=$.subLanguage?function(){if(""===C)return;let e=null;if("string"==typeof $.subLanguage){if(!o[$.subLanguage])return void N.addText(C);e=k($.subLanguage,C,!0,A[$.subLanguage]),A[$.subLanguage]=e._top}else e=w(C,$.subLanguage.length?$.subLanguage:null);$.relevance>0&&(M+=e.relevance),N.__addSublanguage(e._emitter,e.language)}():l(),C=""}function g(e,t){""!==e&&(N.startScope(t),N.addText(e),N.endScope())}function h(e,t){let n=1;const o=t.length-1;for(;n<=o;){if(!e._emit[n]){n++;continue}const o=v.classNameAliases[e[n]]||e[n],i=t[n];o?g(i,o):(C=i,l(),C=""),n++}}function f(e,t){return e.scope&&"string"==typeof e.scope&&N.openNode(v.classNameAliases[e.scope]||e.scope),e.beginScope&&(e.beginScope._wrap?(g(C,v.classNameAliases[e.beginScope._wrap]||e.beginScope._wrap),C=""):e.beginScope._multi&&(h(e.beginScope,t),C="")),$=Object.create(e,{parent:{value:$}}),$}function p(e,t,o){let i=function(e,t){const n=e&&e.exec(t);return n&&0===n.index}(e.endRe,o);if(i){if(e["on:end"]){const o=new n(e);e["on:end"](t,o),o.isMatchIgnored&&(i=!1)}if(i){for(;e.endsParent&&e.parent;)e=e.parent;return e}}if(e.endsWithParent)return p(e.parent,t,o)}function b(e){return 0===$.matcher.regexIndex?(C+=e[0],1):(T=!0,0)}function m(e){const n=e[0],o=t.substring(e.index),i=p($,e,o);if(!i)return ce;const s=$;$.endScope&&$.endScope._wrap?(u(),g(n,$.endScope._wrap)):$.endScope&&$.endScope._multi?(u(),h($.endScope,e)):s.skip?C+=n:(s.returnEnd||s.excludeEnd||(C+=n),u(),s.excludeEnd&&(C=n));do{$.scope&&N.closeNode(),$.skip||$.subLanguage||(M+=$.relevance),$=$.parent}while($!==i.parent);return i.starts&&f(i.starts,e),s.returnEnd?0:n.length}let y={};function E(o,s){const r=s&&s[0];if(C+=o,null==r)return u(),0;if("begin"===y.type&&"end"===s.type&&y.index===s.index&&""===r){if(C+=t.slice(s.index,s.index+1),!a){const t=new Error(`0 width match regex (${e})`);throw t.languageName=e,t.badRule=y.rule,t}return 1}if(y=s,"begin"===s.type)return function(e){const t=e[0],o=e.rule,i=new n(o),s=[o.__beforeBegin,o["on:begin"]];for(const n of s)if(n&&(n(e,i),i.isMatchIgnored))return b(t);return o.skip?C+=t:(o.excludeBegin&&(C+=t),u(),o.returnBegin||o.excludeBegin||(C=t)),f(o,e),o.returnBegin?0:t.length}(s);if("illegal"===s.type&&!i){const e=new Error('Illegal lexeme "'+r+'" for mode "'+($.scope||"<unnamed>")+'"');throw e.mode=$,e}if("end"===s.type){const e=m(s);if(e!==ce)return e}if("illegal"===s.type&&""===r)return 1;if(R>1e5&&R>3*s.index)throw new Error("potential infinite loop, way more iterations than matches");return C+=r,r.length}const v=x(e);if(!v)throw J(r.replace("{}",e)),new Error('Unknown language: "'+e+'"');const _=oe(v);let S="",$=s||_;const A={},N=new d.__emitter(d);!function(){const e=[];for(let t=$;t!==v;t=t.parent)t.scope&&e.unshift(t.scope);e.forEach((e=>N.openNode(e)))}();let C="",M=0,O=0,R=0,T=!1;try{if(v.__emitTokens)v.__emitTokens(t,N);else{for($.matcher.considerAll();;){R++,T?T=!1:$.matcher.considerAll(),$.matcher.lastIndex=O;const e=$.matcher.exec(t);if(!e)break;const n=E(t.substring(O,e.index),e);O=e.index+n}E(t.substring(O))}return N.finalize(),S=N.toHTML(),{language:e,value:S,relevance:M,illegal:!1,_emitter:N,_top:$}}catch(n){if(n.message&&n.message.includes("Illegal"))return{language:e,value:ae(t),illegal:!0,relevance:0,_illegalBy:{message:n.message,index:O,context:t.slice(O-100,O+100),mode:n.mode,resultSoFar:S},_emitter:N};if(a)return{language:e,value:ae(t),illegal:!1,relevance:0,errorRaised:n,_emitter:N,_top:$};throw n}}function w(e,t){t=t||d.languages||Object.keys(o);const n=function(e){const t={value:ae(e),illegal:!1,relevance:0,_top:c,_emitter:new d.__emitter(d)};return t._emitter.addText(e),t}(e),i=t.filter(x).filter(S).map((t=>k(t,e,!1)));i.unshift(n);const s=i.sort(((e,t)=>{if(e.relevance!==t.relevance)return t.relevance-e.relevance;if(e.language&&t.language){if(x(e.language).supersetOf===t.language)return 1;if(x(t.language).supersetOf===e.language)return-1}return 0})),[a,r]=s,l=a;return l.secondBest=r,l}function y(e){let t=null;const n=function(e){let t=e.className+" ";t+=e.parentNode?e.parentNode.className:"";const n=d.languageDetectRe.exec(t);if(n){const t=x(n[1]);return t||(Y(r.replace("{}",n[1])),Y("Falling back to no-highlight mode for this block.",e)),t?n[1]:"no-highlight"}return t.split(/\s+/).find((e=>b(e)||x(e)))}(e);if(b(n))return;if($("before:highlightElement",{el:e,language:n}),e.dataset.highlighted)return void console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",e);if(e.children.length>0&&(d.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(e)),d.throwUnescapedHTML))throw new se("One of your code blocks includes unescaped HTML.",e.innerHTML);t=e;const o=t.textContent,s=n?m(o,{language:n,ignoreIllegals:!0}):w(o);e.innerHTML=s.value,e.dataset.highlighted="yes",function(e,t,n){const o=t&&i[t]||n;e.classList.add("hljs"),e.classList.add(`language-${o}`)}(e,n,s.language),e.result={language:s.language,re:s.relevance,relevance:s.relevance},s.secondBest&&(e.secondBest={language:s.secondBest.language,relevance:s.secondBest.relevance}),$("after:highlightElement",{el:e,result:s,text:o})}let E=!1;function v(){"loading"!==document.readyState?document.querySelectorAll(d.cssSelector).forEach(y):E=!0}function x(e){return e=(e||"").toLowerCase(),o[e]||o[i[e]]}function _(e,{languageName:t}){"string"==typeof e&&(e=[e]),e.forEach((e=>{i[e.toLowerCase()]=t}))}function S(e){const t=x(e);return t&&!t.disableAutodetect}function $(e,t){const n=e;s.forEach((function(e){e[n]&&e[n](t)}))}"undefined"!=typeof window&&window.addEventListener&&window.addEventListener("DOMContentLoaded",(function(){E&&v()}),!1),Object.assign(e,{highlight:m,highlightAuto:w,highlightAll:v,highlightElement:y,highlightBlock:function(e){return Q("10.7.0","highlightBlock will be removed entirely in v12.0"),Q("10.7.0","Please use highlightElement now."),y(e)},configure:function(e){d=re(d,e)},initHighlighting:()=>{v(),Q("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")},initHighlightingOnLoad:function(){v(),Q("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")},registerLanguage:function(t,n){let i=null;try{i=n(e)}catch(e){if(J("Language definition for '{}' could not be registered.".replace("{}",t)),!a)throw e;J(e),i=c}i.name||(i.name=t),o[t]=i,i.rawDefinition=n.bind(null,e),i.aliases&&_(i.aliases,{languageName:t})},unregisterLanguage:function(e){delete o[e];for(const t of Object.keys(i))i[t]===e&&delete i[t]},listLanguages:function(){return Object.keys(o)},getLanguage:x,registerAliases:_,autoDetection:S,inherit:re,addPlugin:function(e){!function(e){e["before:highlightBlock"]&&!e["before:highlightElement"]&&(e["before:highlightElement"]=t=>{e["before:highlightBlock"](Object.assign({block:t.el},t))}),e["after:highlightBlock"]&&!e["after:highlightElement"]&&(e["after:highlightElement"]=t=>{e["after:highlightBlock"](Object.assign({block:t.el},t))})}(e),s.push(e)},removePlugin:function(e){const t=s.indexOf(e);-1!==t&&s.splice(t,1)}}),e.debugMode=function(){a=!1},e.safeMode=function(){a=!0},e.versionString="11.9.0",e.regex={concat:f,lookahead:u,either:p,optional:h,anyNumberOfTimes:g};for(const e in H)"object"==typeof H[e]&&t(H[e]);return Object.assign(e,H),e},de=le({});de.newInstance=()=>le({}),e.exports=de,de.HighlightJS=de,de.default=de}},n={};function o(e){var i=n[e];if(void 0!==i)return i.exports;var s=n[e]={exports:{}};return t[e](s,s.exports,o),s.exports}o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var i={};return(()=>{"use strict";o.r(i),o.d(i,{isLocked:()=>r.isLocked}),o(230),o(826);const e=o(390);e.registerLanguage("r",(function(e){const t=e.regex,n=/(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/,o=t.either(/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/,/0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/,/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/),i=/[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/,s=t.either(/[()]/,/[{}]/,/\[\[/,/[[\]]/,/\\/,/,/);return{name:"R",keywords:{$pattern:n,keyword:"function if in break next repeat else for while",literal:"NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",built_in:"LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm"},contains:[e.COMMENT(/#'/,/$/,{contains:[{scope:"doctag",match:/@examples/,starts:{end:t.lookahead(t.either(/\n^#'\s*(?=@[a-zA-Z]+)/,/\n^(?!#')/)),endsParent:!0}},{scope:"doctag",begin:"@param",end:/$/,contains:[{scope:"variable",variants:[{match:n},{match:/`(?:\\.|[^`\\])+`/}],endsParent:!0}]},{scope:"doctag",match:/@[a-zA-Z]+/},{scope:"keyword",match:/\\[a-zA-Z]+/}]}),e.HASH_COMMENT_MODE,{scope:"string",contains:[e.BACKSLASH_ESCAPE],variants:[e.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\(/,end:/\)(-*)"/}),e.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\{/,end:/\}(-*)"/}),e.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\[/,end:/\](-*)"/}),e.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\(/,end:/\)(-*)'/}),e.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\{/,end:/\}(-*)'/}),e.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\[/,end:/\](-*)'/}),{begin:'"',end:'"',relevance:0},{begin:"'",end:"'",relevance:0}]},{relevance:0,variants:[{scope:{1:"operator",2:"number"},match:[i,o]},{scope:{1:"operator",2:"number"},match:[/%[^%]*%/,o]},{scope:{1:"punctuation",2:"number"},match:[s,o]},{scope:{2:"number"},match:[/[^a-zA-Z0-9._]|^/,o]}]},{scope:{3:"operator"},match:[n,/\s+/,/<-/,/\s+/]},{scope:"operator",relevance:0,variants:[{match:i},{match:/%[^%]*%/}]},{scope:"punctuation",relevance:0,match:s},{begin:"`",end:"`",contains:[{begin:/\\./}]}]}})),$((()=>{$(document).on("shiny:value",(t=>{t.name.match(/-code$/)&&($(`#${t.name}`).addClass("language-r"),setTimeout((()=>{delete document.getElementById(t.name).dataset.highlighted,e.highlightElement(document.getElementById(t.name))}),250))}))}));const t=e=>{$(e).find(".stack-edit-toggle:not(.blockr-bound)").on("click",(e=>{$(e.currentTarget).find("i").toggleClass("fa-chevron-up fa-chevron-down")})),$(e).find(".block-output-toggle:not(.blockr-bound)").on("click",(e=>{$(e.currentTarget).find("i").toggleClass("fa-chevron-up fa-chevron-down")})),$(e).find(".stack-edit-toggle").addClass("blockr-bound"),$(e).find(".block-output-toggle").addClass("blockr-bound")},n=e=>{$(e).find(".block-output-toggle").each(((e,t)=>{$(t).hasClass("block-bound")||($(t).addClass("block-bound"),$(t).on("click",(e=>{const t=$(e.target).closest(".block"),n=t.find(".block-output").is(":visible"),o=t.find(".block-input").is(":visible");n||o?(t.find(".block-inputs").addClass("d-none"),t.find(".block-output").addClass("d-none")):(t.find(".block-inputs").removeClass("d-none"),t.find(".block-output").removeClass("d-none"));let i="shown";t.find(".block-output").hasClass("d-none")&&(i="hidden"),t.find(".block-inputs").trigger(i),t.find(".block-output").trigger(i)})))}))},s=(e,t)=>{const n=$(e).find(".stack-title");n.on("click",(()=>{n.replaceWith(`<input type="text" class="stack-title-input form-control form-control-sm mx-1" value="${n.text()}">`),a(e,t)}))},a=(e,t)=>{$(e).find(".stack-title-input").off("keydown"),$(e).find(".stack-title-input").on("keydown",(n=>{if("Enter"!==n.key)return;const o=$(n.target).val();$(n.target).replaceWith(`<span class="stack-title cursor-pointer">${o}</span>`),s(e),window.Shiny.setInputValue(`${t}-newTitle`,o)}))};var r=o(305);$((()=>{c()}));const c=()=>{[...document.querySelectorAll('[data-bs-toggle="tooltip"]')].map((e=>new window.bootstrap.Tooltip(e)))};window.Shiny.addCustomMessageHandler("blockr-bind-stack",(e=>{const o=`#${e.stack}`;setTimeout((()=>{(e=>{$(e).find(".stack-remove").each(((e,t)=>{"true"!=t.getAttribute("listener")&&$(t).on("click",(e=>{const t=$(e.target).closest(".stack"),n=t.closest(".masonry-item");t.closest(".workspace").length?t.closest(".col").remove():(t.remove(),0!==n.length&&n.remove())}))}))})(o),(e=>{(e=>{const t=$(e).find(".stack-edit-toggle");$(t).hasClass("block-bound")||($(t).addClass("block-bound"),$(t).on("click",(e=>{const t=$(e.target).closest(".stack").find(".block");$(e.currentTarget).toggleClass("etidable");const n=$(e.currentTarget).hasClass("etidable");t.each(((e,o)=>{const i=$(o);if(n){if(i.removeClass("d-none"),i.find(".block-title").removeClass("d-none"),e==t.length-1)return i.find(".block-output").addClass("show"),i.find(".block-output").removeClass("d-none"),i.find(".block-output").trigger("shown"),window.bootstrap.Collapse.getOrCreateInstance(i.find(".block-code")[0],{toggle:!1}).hide(),i.find(".block-inputs").addClass("d-none"),void i.find(".block-inputs").trigger("hidden");i.find(".block-loading").addClass("d-none")}else{if(i.find(".block-title").addClass("d-none"),e==t.length-1)return i.removeClass("d-none"),i.find(".block-output").addClass("show"),i.find(".block-output").removeClass("d-none"),i.find(".block-output").trigger("shown"),window.bootstrap.Collapse.getOrCreateInstance(i.find(".block-code")[0],{toggle:!1}).hide(),i.find(".block-inputs").addClass("d-none"),void i.find(".block-inputs").trigger("hidden");i.addClass("d-none")}}))})))})(e),(e=>{$(e).each(((e,t)=>{(e=>{const t=$(e).find(".block").last();t.removeClass("d-none");const n=t.find(".block-output"),o=t.find(".block-title");t.find(".block-output-toggle i").toggleClass("fa-chevron-up fa-chevron-down"),o.addClass("d-none"),n.removeClass("d-none"),n.trigger("shown");const i=n.find(".datatables").first().attr("id");$(document).on("shiny:value",(e=>{e.name===i&&n.find(".block-loading").addClass("d-none")}))})(t)}))})(e),n(e),t(e)})(o),s(o,e.stack),(0,r.renderLocked)(o,e.locked),c();const i=new CustomEvent("blockr:stack-render",{detail:e});document.dispatchEvent(i)}),750)})),window.Shiny.addCustomMessageHandler("blockr-add-block",(e=>{const o=`#${e.stack}`;$(o).removeClass("d-none"),setTimeout((()=>{n(o),t(o)}),500)})),window.Shiny.addCustomMessageHandler("validate-block",(e=>{e.state?$(`[data-value="${e.id}"] .card`).removeClass("border-danger"):$(`[data-value="${e.id}"] .card`).addClass("border-danger")})),window.Shiny.addCustomMessageHandler("validate-input",(e=>{var t;(t=e).state||$(`#${t.id}`).closest(".block-inputs").removeClass("d-none"),(e=>{let t;t=$(`#${e.id}`).hasClass("shiny-input-select")?$(`#${e.id}-selectized`).parent(".selectize-input").closest("div"):`#${e.id}`,setTimeout((()=>{e.state?$(t).addClass("is-valid"):$(t).addClass("is-invalid")}),500)})(e)})),window.Shiny.addCustomMessageHandler("toggle-submit",(e=>{$(`#${e.id}`).prop("disabled",!e.state)}))})(),i})()));