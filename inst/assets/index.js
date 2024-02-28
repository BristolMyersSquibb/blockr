!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n(require("Shiny")):"function"==typeof define&&define.amd?define(["Shiny"],n):"object"==typeof exports?exports.blockr=n(require("Shiny")):e.blockr=n(e.Shiny)}(self,(e=>(()=>{var n={826:()=>{window.Shiny.addCustomMessageHandler("blockr-copy-code",(e=>{var n;e.code?(n=e.code.map((e=>e.trim())).join("\n\t"),navigator.clipboard.writeText(n),window.Shiny.notifications.show({html:"<span>Code copied to clipboard</span>",type:"message"})):window.Shiny.notifications.show({html:"<span>Failed to copy code to clipboard</span>",type:"error"})}))},305:(e,n,t)=>{"use strict";t.d(n,{isLocked:()=>i,renderLocked:()=>r});let o=!1;window.Shiny.addCustomMessageHandler("lock",(e=>{o=e.locked,a(),s(e.locked)}));const i=()=>o,s=e=>{const n=new CustomEvent("blockr:lock",{detail:{locked:e}});document.dispatchEvent(n)},a=()=>{o&&($(".stack-remove").toggle(),$(".stack-edit-toggle").toggle(),$(".stack-copy-code").toggle(),$(".block-code-toggle").toggle(),$(".block-output-toggle").toggle(),$(".stack-tools").toggle(),$(".block-remove").toggle(),$(".stack-title").off(),$(".stack").each(((e,n)=>{const t=$(n).find(".stack-edit-toggle");t.find("i").hasClass("fa-chevron-up")||t.trigger("click")})))},r=(e,n)=>{o=n,o&&c(e)},c=e=>{if(!o)return;let n=$(e);n.find(".stack-remove").hide(),n.find(".stack-edit-toggle").hide(),n.find(".stack-copy-code").hide(),n.find(".block-code-toggle").hide(),n.find(".block-output-toggle").hide(),n.find(".block-remove").hide(),$(".stack-title").off();const t=n.find(".stack-edit-toggle");t.find("i").hasClass("fa-chevron-up")||t.trigger("click")}},230:n=>{"use strict";n.exports=e},390:e=>{function n(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach((t=>{const o=e[t],i=typeof o;"object"!==i&&"function"!==i||Object.isFrozen(o)||n(o)})),e}class t{constructor(e){void 0===e.data&&(e.data={}),this.data=e.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function o(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function i(e,...n){const t=Object.create(null);for(const n in e)t[n]=e[n];return n.forEach((function(e){for(const n in e)t[n]=e[n]})),t}const s=e=>!!e.scope;class a{constructor(e,n){this.buffer="",this.classPrefix=n.classPrefix,e.walk(this)}addText(e){this.buffer+=o(e)}openNode(e){if(!s(e))return;const n=((e,{prefix:n})=>{if(e.startsWith("language:"))return e.replace("language:","language-");if(e.includes(".")){const t=e.split(".");return[`${n}${t.shift()}`,...t.map(((e,n)=>`${e}${"_".repeat(n+1)}`))].join(" ")}return`${n}${e}`})(e.scope,{prefix:this.classPrefix});this.span(n)}closeNode(e){s(e)&&(this.buffer+="</span>")}value(){return this.buffer}span(e){this.buffer+=`<span class="${e}">`}}const r=(e={})=>{const n={children:[]};return Object.assign(n,e),n};class c{constructor(){this.rootNode=r(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){this.top.children.push(e)}openNode(e){const n=r({scope:e});this.add(n),this.stack.push(n)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,n){return"string"==typeof n?e.addText(n):n.children&&(e.openNode(n),n.children.forEach((n=>this._walk(e,n))),e.closeNode(n)),e}static _collapse(e){"string"!=typeof e&&e.children&&(e.children.every((e=>"string"==typeof e))?e.children=[e.children.join("")]:e.children.forEach((e=>{c._collapse(e)})))}}class l extends c{constructor(e){super(),this.options=e}addText(e){""!==e&&this.add(e)}startScope(e){this.openNode(e)}endScope(){this.closeNode()}__addSublanguage(e,n){const t=e.root;n&&(t.scope=`language:${n}`),this.add(t)}toHTML(){return new a(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function d(e){return e?"string"==typeof e?e:e.source:null}function u(e){return f("(?=",e,")")}function g(e){return f("(?:",e,")*")}function h(e){return f("(?:",e,")?")}function f(...e){return e.map((e=>d(e))).join("")}function p(...e){const n=function(e){const n=e[e.length-1];return"object"==typeof n&&n.constructor===Object?(e.splice(e.length-1,1),n):{}}(e);return"("+(n.capture?"":"?:")+e.map((e=>d(e))).join("|")+")"}function b(e){return new RegExp(e.toString()+"|").exec("").length-1}const m=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function k(e,{joinWith:n}){let t=0;return e.map((e=>{t+=1;const n=t;let o=d(e),i="";for(;o.length>0;){const e=m.exec(o);if(!e){i+=o;break}i+=o.substring(0,e.index),o=o.substring(e.index+e[0].length),"\\"===e[0][0]&&e[1]?i+="\\"+String(Number(e[1])+n):(i+=e[0],"("===e[0]&&t++)}return i})).map((e=>`(${e})`)).join(n)}const y="[a-zA-Z]\\w*",w="[a-zA-Z_]\\w*",$="\\b\\d+(\\.\\d+)?",E="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",v="\\b(0b[01]+)",x={begin:"\\\\[\\s\\S]",relevance:0},_={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[x]},S={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[x]},C=function(e,n,t={}){const o=i({scope:"comment",begin:e,end:n,contains:[]},t);o.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const s=p("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return o.contains.push({begin:f(/[ ]+/,"(",s,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),o},A=C("//","$"),N=C("/\\*","\\*/"),M=C("#","$"),O={scope:"number",begin:$,relevance:0},T={scope:"number",begin:E,relevance:0},R={scope:"number",begin:v,relevance:0},j={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[x,{begin:/\[/,end:/\]/,relevance:0,contains:[x]}]},I={scope:"title",begin:y,relevance:0},L={scope:"title",begin:w,relevance:0},B={begin:"\\.\\s*"+w,relevance:0};var H=Object.freeze({__proto__:null,APOS_STRING_MODE:_,BACKSLASH_ESCAPE:x,BINARY_NUMBER_MODE:R,BINARY_NUMBER_RE:v,COMMENT:C,C_BLOCK_COMMENT_MODE:N,C_LINE_COMMENT_MODE:A,C_NUMBER_MODE:T,C_NUMBER_RE:E,END_SAME_AS_BEGIN:function(e){return Object.assign(e,{"on:begin":(e,n)=>{n.data._beginMatch=e[1]},"on:end":(e,n)=>{n.data._beginMatch!==e[1]&&n.ignoreMatch()}})},HASH_COMMENT_MODE:M,IDENT_RE:y,MATCH_NOTHING_RE:/\b\B/,METHOD_GUARD:B,NUMBER_MODE:O,NUMBER_RE:$,PHRASAL_WORDS_MODE:{begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},QUOTE_STRING_MODE:S,REGEXP_MODE:j,RE_STARTERS_RE:"!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",SHEBANG:(e={})=>{const n=/^#![ ]*\//;return e.binary&&(e.begin=f(n,/.*\b/,e.binary,/\b.*/)),i({scope:"meta",begin:n,end:/$/,relevance:0,"on:begin":(e,n)=>{0!==e.index&&n.ignoreMatch()}},e)},TITLE_MODE:I,UNDERSCORE_IDENT_RE:w,UNDERSCORE_TITLE_MODE:L});function P(e,n){"."===e.input[e.index-1]&&n.ignoreMatch()}function D(e,n){void 0!==e.className&&(e.scope=e.className,delete e.className)}function z(e,n){n&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=P,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,void 0===e.relevance&&(e.relevance=0))}function U(e,n){Array.isArray(e.illegal)&&(e.illegal=p(...e.illegal))}function G(e,n){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function q(e,n){void 0===e.relevance&&(e.relevance=1)}const W=(e,n)=>{if(!e.beforeMatch)return;if(e.starts)throw new Error("beforeMatch cannot be used with starts");const t=Object.assign({},e);Object.keys(e).forEach((n=>{delete e[n]})),e.keywords=t.keywords,e.begin=f(t.beforeMatch,u(t.begin)),e.starts={relevance:0,contains:[Object.assign(t,{endsParent:!0})]},e.relevance=0,delete t.beforeMatch},Z=["of","and","for","in","not","or","if","then","parent","list","value"],F="keyword";function X(e,n,t=F){const o=Object.create(null);return"string"==typeof e?i(t,e.split(" ")):Array.isArray(e)?i(t,e):Object.keys(e).forEach((function(t){Object.assign(o,X(e[t],n,t))})),o;function i(e,t){n&&(t=t.map((e=>e.toLowerCase()))),t.forEach((function(n){const t=n.split("|");o[t[0]]=[e,K(t[0],t[1])]}))}}function K(e,n){return n?Number(n):function(e){return Z.includes(e.toLowerCase())}(e)?0:1}const V={},J=e=>{console.error(e)},Y=(e,...n)=>{console.log(`WARN: ${e}`,...n)},Q=(e,n)=>{V[`${e}/${n}`]||(console.log(`Deprecated as of ${e}. ${n}`),V[`${e}/${n}`]=!0)},ee=new Error;function ne(e,n,{key:t}){let o=0;const i=e[t],s={},a={};for(let e=1;e<=n.length;e++)a[e+o]=i[e],s[e+o]=!0,o+=b(n[e-1]);e[t]=a,e[t]._emit=s,e[t]._multi=!0}function te(e){!function(e){e.scope&&"object"==typeof e.scope&&null!==e.scope&&(e.beginScope=e.scope,delete e.scope)}(e),"string"==typeof e.beginScope&&(e.beginScope={_wrap:e.beginScope}),"string"==typeof e.endScope&&(e.endScope={_wrap:e.endScope}),function(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw J("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),ee;if("object"!=typeof e.beginScope||null===e.beginScope)throw J("beginScope must be object"),ee;ne(e,e.begin,{key:"beginScope"}),e.begin=k(e.begin,{joinWith:""})}}(e),function(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw J("skip, excludeEnd, returnEnd not compatible with endScope: {}"),ee;if("object"!=typeof e.endScope||null===e.endScope)throw J("endScope must be object"),ee;ne(e,e.end,{key:"endScope"}),e.end=k(e.end,{joinWith:""})}}(e)}function oe(e){function n(n,t){return new RegExp(d(n),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(t?"g":""))}class t{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(e,n){n.position=this.position++,this.matchIndexes[this.matchAt]=n,this.regexes.push([n,e]),this.matchAt+=b(e)+1}compile(){0===this.regexes.length&&(this.exec=()=>null);const e=this.regexes.map((e=>e[1]));this.matcherRe=n(k(e,{joinWith:"|"}),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex;const n=this.matcherRe.exec(e);if(!n)return null;const t=n.findIndex(((e,n)=>n>0&&void 0!==e)),o=this.matchIndexes[t];return n.splice(0,t),Object.assign(n,o)}}class o{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){if(this.multiRegexes[e])return this.multiRegexes[e];const n=new t;return this.rules.slice(e).forEach((([e,t])=>n.addRule(e,t))),n.compile(),this.multiRegexes[e]=n,n}resumingScanAtSamePosition(){return 0!==this.regexIndex}considerAll(){this.regexIndex=0}addRule(e,n){this.rules.push([e,n]),"begin"===n.type&&this.count++}exec(e){const n=this.getMatcher(this.regexIndex);n.lastIndex=this.lastIndex;let t=n.exec(e);if(this.resumingScanAtSamePosition())if(t&&t.index===this.lastIndex);else{const n=this.getMatcher(0);n.lastIndex=this.lastIndex+1,t=n.exec(e)}return t&&(this.regexIndex+=t.position+1,this.regexIndex===this.count&&this.considerAll()),t}}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=i(e.classNameAliases||{}),function t(s,a){const r=s;if(s.isCompiled)return r;[D,G,te,W].forEach((e=>e(s,a))),e.compilerExtensions.forEach((e=>e(s,a))),s.__beforeBegin=null,[z,U,q].forEach((e=>e(s,a))),s.isCompiled=!0;let c=null;return"object"==typeof s.keywords&&s.keywords.$pattern&&(s.keywords=Object.assign({},s.keywords),c=s.keywords.$pattern,delete s.keywords.$pattern),c=c||/\w+/,s.keywords&&(s.keywords=X(s.keywords,e.case_insensitive)),r.keywordPatternRe=n(c,!0),a&&(s.begin||(s.begin=/\B|\b/),r.beginRe=n(r.begin),s.end||s.endsWithParent||(s.end=/\B|\b/),s.end&&(r.endRe=n(r.end)),r.terminatorEnd=d(r.end)||"",s.endsWithParent&&a.terminatorEnd&&(r.terminatorEnd+=(s.end?"|":"")+a.terminatorEnd)),s.illegal&&(r.illegalRe=n(s.illegal)),s.contains||(s.contains=[]),s.contains=[].concat(...s.contains.map((function(e){return function(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map((function(n){return i(e,{variants:null},n)}))),e.cachedVariants?e.cachedVariants:ie(e)?i(e,{starts:e.starts?i(e.starts):null}):Object.isFrozen(e)?i(e):e}("self"===e?s:e)}))),s.contains.forEach((function(e){t(e,r)})),s.starts&&t(s.starts,a),r.matcher=function(e){const n=new o;return e.contains.forEach((e=>n.addRule(e.begin,{rule:e,type:"begin"}))),e.terminatorEnd&&n.addRule(e.terminatorEnd,{type:"end"}),e.illegal&&n.addRule(e.illegal,{type:"illegal"}),n}(r),r}(e)}function ie(e){return!!e&&(e.endsWithParent||ie(e.starts))}class se extends Error{constructor(e,n){super(e),this.name="HTMLInjectionError",this.html=n}}const ae=o,re=i,ce=Symbol("nomatch"),le=function(e){const o=Object.create(null),i=Object.create(null),s=[];let a=!0;const r="Could not find the language '{}', did you forget to load/include a language module?",c={disableAutodetect:!0,name:"Plain text",contains:[]};let d={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:l};function b(e){return d.noHighlightRe.test(e)}function m(e,n,t){let o="",i="";"object"==typeof n?(o=e,t=n.ignoreIllegals,i=n.language):(Q("10.7.0","highlight(lang, code, ...args) has been deprecated."),Q("10.7.0","Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"),i=e,o=n),void 0===t&&(t=!0);const s={code:o,language:i};S("before:highlight",s);const a=s.result?s.result:k(s.language,s.code,t);return a.code=s.code,S("after:highlight",a),a}function k(e,n,i,s){const c=Object.create(null);function l(){if(!S.keywords)return void A.addText(N);let e=0;S.keywordPatternRe.lastIndex=0;let n=S.keywordPatternRe.exec(N),t="";for(;n;){t+=N.substring(e,n.index);const i=E.case_insensitive?n[0].toLowerCase():n[0],s=(o=i,S.keywords[o]);if(s){const[e,o]=s;if(A.addText(t),t="",c[i]=(c[i]||0)+1,c[i]<=7&&(M+=o),e.startsWith("_"))t+=n[0];else{const t=E.classNameAliases[e]||e;g(n[0],t)}}else t+=n[0];e=S.keywordPatternRe.lastIndex,n=S.keywordPatternRe.exec(N)}var o;t+=N.substring(e),A.addText(t)}function u(){null!=S.subLanguage?function(){if(""===N)return;let e=null;if("string"==typeof S.subLanguage){if(!o[S.subLanguage])return void A.addText(N);e=k(S.subLanguage,N,!0,C[S.subLanguage]),C[S.subLanguage]=e._top}else e=y(N,S.subLanguage.length?S.subLanguage:null);S.relevance>0&&(M+=e.relevance),A.__addSublanguage(e._emitter,e.language)}():l(),N=""}function g(e,n){""!==e&&(A.startScope(n),A.addText(e),A.endScope())}function h(e,n){let t=1;const o=n.length-1;for(;t<=o;){if(!e._emit[t]){t++;continue}const o=E.classNameAliases[e[t]]||e[t],i=n[t];o?g(i,o):(N=i,l(),N=""),t++}}function f(e,n){return e.scope&&"string"==typeof e.scope&&A.openNode(E.classNameAliases[e.scope]||e.scope),e.beginScope&&(e.beginScope._wrap?(g(N,E.classNameAliases[e.beginScope._wrap]||e.beginScope._wrap),N=""):e.beginScope._multi&&(h(e.beginScope,n),N="")),S=Object.create(e,{parent:{value:S}}),S}function p(e,n,o){let i=function(e,n){const t=e&&e.exec(n);return t&&0===t.index}(e.endRe,o);if(i){if(e["on:end"]){const o=new t(e);e["on:end"](n,o),o.isMatchIgnored&&(i=!1)}if(i){for(;e.endsParent&&e.parent;)e=e.parent;return e}}if(e.endsWithParent)return p(e.parent,n,o)}function b(e){return 0===S.matcher.regexIndex?(N+=e[0],1):(R=!0,0)}function m(e){const t=e[0],o=n.substring(e.index),i=p(S,e,o);if(!i)return ce;const s=S;S.endScope&&S.endScope._wrap?(u(),g(t,S.endScope._wrap)):S.endScope&&S.endScope._multi?(u(),h(S.endScope,e)):s.skip?N+=t:(s.returnEnd||s.excludeEnd||(N+=t),u(),s.excludeEnd&&(N=t));do{S.scope&&A.closeNode(),S.skip||S.subLanguage||(M+=S.relevance),S=S.parent}while(S!==i.parent);return i.starts&&f(i.starts,e),s.returnEnd?0:t.length}let w={};function $(o,s){const r=s&&s[0];if(N+=o,null==r)return u(),0;if("begin"===w.type&&"end"===s.type&&w.index===s.index&&""===r){if(N+=n.slice(s.index,s.index+1),!a){const n=new Error(`0 width match regex (${e})`);throw n.languageName=e,n.badRule=w.rule,n}return 1}if(w=s,"begin"===s.type)return function(e){const n=e[0],o=e.rule,i=new t(o),s=[o.__beforeBegin,o["on:begin"]];for(const t of s)if(t&&(t(e,i),i.isMatchIgnored))return b(n);return o.skip?N+=n:(o.excludeBegin&&(N+=n),u(),o.returnBegin||o.excludeBegin||(N=n)),f(o,e),o.returnBegin?0:n.length}(s);if("illegal"===s.type&&!i){const e=new Error('Illegal lexeme "'+r+'" for mode "'+(S.scope||"<unnamed>")+'"');throw e.mode=S,e}if("end"===s.type){const e=m(s);if(e!==ce)return e}if("illegal"===s.type&&""===r)return 1;if(T>1e5&&T>3*s.index)throw new Error("potential infinite loop, way more iterations than matches");return N+=r,r.length}const E=v(e);if(!E)throw J(r.replace("{}",e)),new Error('Unknown language: "'+e+'"');const x=oe(E);let _="",S=s||x;const C={},A=new d.__emitter(d);!function(){const e=[];for(let n=S;n!==E;n=n.parent)n.scope&&e.unshift(n.scope);e.forEach((e=>A.openNode(e)))}();let N="",M=0,O=0,T=0,R=!1;try{if(E.__emitTokens)E.__emitTokens(n,A);else{for(S.matcher.considerAll();;){T++,R?R=!1:S.matcher.considerAll(),S.matcher.lastIndex=O;const e=S.matcher.exec(n);if(!e)break;const t=$(n.substring(O,e.index),e);O=e.index+t}$(n.substring(O))}return A.finalize(),_=A.toHTML(),{language:e,value:_,relevance:M,illegal:!1,_emitter:A,_top:S}}catch(t){if(t.message&&t.message.includes("Illegal"))return{language:e,value:ae(n),illegal:!0,relevance:0,_illegalBy:{message:t.message,index:O,context:n.slice(O-100,O+100),mode:t.mode,resultSoFar:_},_emitter:A};if(a)return{language:e,value:ae(n),illegal:!1,relevance:0,errorRaised:t,_emitter:A,_top:S};throw t}}function y(e,n){n=n||d.languages||Object.keys(o);const t=function(e){const n={value:ae(e),illegal:!1,relevance:0,_top:c,_emitter:new d.__emitter(d)};return n._emitter.addText(e),n}(e),i=n.filter(v).filter(_).map((n=>k(n,e,!1)));i.unshift(t);const s=i.sort(((e,n)=>{if(e.relevance!==n.relevance)return n.relevance-e.relevance;if(e.language&&n.language){if(v(e.language).supersetOf===n.language)return 1;if(v(n.language).supersetOf===e.language)return-1}return 0})),[a,r]=s,l=a;return l.secondBest=r,l}function w(e){let n=null;const t=function(e){let n=e.className+" ";n+=e.parentNode?e.parentNode.className:"";const t=d.languageDetectRe.exec(n);if(t){const n=v(t[1]);return n||(Y(r.replace("{}",t[1])),Y("Falling back to no-highlight mode for this block.",e)),n?t[1]:"no-highlight"}return n.split(/\s+/).find((e=>b(e)||v(e)))}(e);if(b(t))return;if(S("before:highlightElement",{el:e,language:t}),e.dataset.highlighted)return void console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",e);if(e.children.length>0&&(d.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(e)),d.throwUnescapedHTML))throw new se("One of your code blocks includes unescaped HTML.",e.innerHTML);n=e;const o=n.textContent,s=t?m(o,{language:t,ignoreIllegals:!0}):y(o);e.innerHTML=s.value,e.dataset.highlighted="yes",function(e,n,t){const o=n&&i[n]||t;e.classList.add("hljs"),e.classList.add(`language-${o}`)}(e,t,s.language),e.result={language:s.language,re:s.relevance,relevance:s.relevance},s.secondBest&&(e.secondBest={language:s.secondBest.language,relevance:s.secondBest.relevance}),S("after:highlightElement",{el:e,result:s,text:o})}let $=!1;function E(){"loading"!==document.readyState?document.querySelectorAll(d.cssSelector).forEach(w):$=!0}function v(e){return e=(e||"").toLowerCase(),o[e]||o[i[e]]}function x(e,{languageName:n}){"string"==typeof e&&(e=[e]),e.forEach((e=>{i[e.toLowerCase()]=n}))}function _(e){const n=v(e);return n&&!n.disableAutodetect}function S(e,n){const t=e;s.forEach((function(e){e[t]&&e[t](n)}))}"undefined"!=typeof window&&window.addEventListener&&window.addEventListener("DOMContentLoaded",(function(){$&&E()}),!1),Object.assign(e,{highlight:m,highlightAuto:y,highlightAll:E,highlightElement:w,highlightBlock:function(e){return Q("10.7.0","highlightBlock will be removed entirely in v12.0"),Q("10.7.0","Please use highlightElement now."),w(e)},configure:function(e){d=re(d,e)},initHighlighting:()=>{E(),Q("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")},initHighlightingOnLoad:function(){E(),Q("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")},registerLanguage:function(n,t){let i=null;try{i=t(e)}catch(e){if(J("Language definition for '{}' could not be registered.".replace("{}",n)),!a)throw e;J(e),i=c}i.name||(i.name=n),o[n]=i,i.rawDefinition=t.bind(null,e),i.aliases&&x(i.aliases,{languageName:n})},unregisterLanguage:function(e){delete o[e];for(const n of Object.keys(i))i[n]===e&&delete i[n]},listLanguages:function(){return Object.keys(o)},getLanguage:v,registerAliases:x,autoDetection:_,inherit:re,addPlugin:function(e){!function(e){e["before:highlightBlock"]&&!e["before:highlightElement"]&&(e["before:highlightElement"]=n=>{e["before:highlightBlock"](Object.assign({block:n.el},n))}),e["after:highlightBlock"]&&!e["after:highlightElement"]&&(e["after:highlightElement"]=n=>{e["after:highlightBlock"](Object.assign({block:n.el},n))})}(e),s.push(e)},removePlugin:function(e){const n=s.indexOf(e);-1!==n&&s.splice(n,1)}}),e.debugMode=function(){a=!1},e.safeMode=function(){a=!0},e.versionString="11.9.0",e.regex={concat:f,lookahead:u,either:p,optional:h,anyNumberOfTimes:g};for(const e in H)"object"==typeof H[e]&&n(H[e]);return Object.assign(e,H),e},de=le({});de.newInstance=()=>le({}),e.exports=de,de.HighlightJS=de,de.default=de}},t={};function o(e){var i=t[e];if(void 0!==i)return i.exports;var s=t[e]={exports:{}};return n[e](s,s.exports,o),s.exports}o.d=(e,n)=>{for(var t in n)o.o(n,t)&&!o.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},o.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var i={};return(()=>{"use strict";o.r(i),o.d(i,{isLocked:()=>r.isLocked}),o(230),o(826);const e=o(390);e.registerLanguage("r",(function(e){const n=e.regex,t=/(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/,o=n.either(/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/,/0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/,/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/),i=/[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/,s=n.either(/[()]/,/[{}]/,/\[\[/,/[[\]]/,/\\/,/,/);return{name:"R",keywords:{$pattern:t,keyword:"function if in break next repeat else for while",literal:"NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",built_in:"LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm"},contains:[e.COMMENT(/#'/,/$/,{contains:[{scope:"doctag",match:/@examples/,starts:{end:n.lookahead(n.either(/\n^#'\s*(?=@[a-zA-Z]+)/,/\n^(?!#')/)),endsParent:!0}},{scope:"doctag",begin:"@param",end:/$/,contains:[{scope:"variable",variants:[{match:t},{match:/`(?:\\.|[^`\\])+`/}],endsParent:!0}]},{scope:"doctag",match:/@[a-zA-Z]+/},{scope:"keyword",match:/\\[a-zA-Z]+/}]}),e.HASH_COMMENT_MODE,{scope:"string",contains:[e.BACKSLASH_ESCAPE],variants:[e.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\(/,end:/\)(-*)"/}),e.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\{/,end:/\}(-*)"/}),e.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\[/,end:/\](-*)"/}),e.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\(/,end:/\)(-*)'/}),e.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\{/,end:/\}(-*)'/}),e.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\[/,end:/\](-*)'/}),{begin:'"',end:'"',relevance:0},{begin:"'",end:"'",relevance:0}]},{relevance:0,variants:[{scope:{1:"operator",2:"number"},match:[i,o]},{scope:{1:"operator",2:"number"},match:[/%[^%]*%/,o]},{scope:{1:"punctuation",2:"number"},match:[s,o]},{scope:{2:"number"},match:[/[^a-zA-Z0-9._]|^/,o]}]},{scope:{3:"operator"},match:[t,/\s+/,/<-/,/\s+/]},{scope:"operator",relevance:0,variants:[{match:i},{match:/%[^%]*%/}]},{scope:"punctuation",relevance:0,match:s},{begin:"`",end:"`",contains:[{begin:/\\./}]}]}})),$((()=>{$(document).on("shiny:value",(n=>{n.name.match(/-code$/)&&($(`#${n.name}`).addClass("language-r"),setTimeout((()=>{delete document.getElementById(n.name).dataset.highlighted,e.highlightElement(document.getElementById(n.name))}),250))}))}));const n=e=>{$(e).find(".stack-edit-toggle:not(.blockr-bound)").on("click",(e=>{$(e.currentTarget).find("i").toggleClass("fa-chevron-up fa-chevron-down")})),$(e).find(".block-output-toggle:not(.blockr-bound)").on("click",(e=>{$(e.currentTarget).find("i").toggleClass("fa-chevron-up fa-chevron-down")})),$(e).find(".stack-edit-toggle:not(.blockr-bound)").addClass("blockr-bound"),$(e).find(".block-output-toggle:not(.blockr-bound)").addClass("blockr-bound")},t=e=>{$(e).find(".block-output-toggle").each(((e,n)=>{$(n).hasClass("block-bound")||($(n).addClass("block-bound"),$(n).on("click",(e=>{const n=$(e.target).closest(".block");n.find(".block-inputs").is(":visible")?(n.find(".block-inputs").addClass("d-none"),n.find(".block-output").addClass("d-none")):(n.find(".block-inputs").removeClass("d-none"),n.find(".block-output").removeClass("d-none"));let t="shown";n.find(".block-output").hasClass("d-none")&&(t="hidden"),n.find(".block-inputs").trigger(t),n.find(".block-output").trigger(t)})))}))},s=(e,n)=>{const t=$(e).find(".stack-title");t.on("click",(()=>{t.replaceWith(`<input type="text" class="stack-title-input form-control form-control-sm mx-1" value="${t.text()}">`),a(e,n)}))},a=(e,n)=>{$(e).find(".stack-title-input").off("keydown"),$(e).find(".stack-title-input").on("keydown",(t=>{if("Enter"!==t.key)return;const o=$(t.target).val();$(t.target).replaceWith(`<span class="stack-title cursor-pointer">${o}</span>`),s(e),window.Shiny.setInputValue(`${n}-newTitle`,o)}))};var r=o(305);$((()=>{c()}));const c=()=>{[...document.querySelectorAll('[data-bs-toggle="tooltip"]')].map((e=>new window.bootstrap.Tooltip(e)))};window.Shiny.addCustomMessageHandler("blockr-bind-stack",(e=>{const o=`#${e.stack}`;setTimeout((()=>{(e=>{(e=>{const n=$(e).find(".stack-edit-toggle");$(n).hasClass("block-bound")||($(n).addClass("block-bound"),$(n).on("click",(e=>{const n=$(e.target).closest(".stack").find(".block");$(e.currentTarget).toggleClass("editable");const t=$(e.currentTarget).hasClass("editable");n.each(((e,o)=>{const i=$(o);if(t){if(i.removeClass("d-none"),i.find(".block-title").removeClass("d-none"),i.find(".block-code-toggle").removeClass("d-none"),i.find(".block-output-toggle").removeClass("d-none"),e==n.length-1)return i.find(".block-output").addClass("show"),i.find(".block-output").removeClass("d-none"),i.find(".block-output").trigger("shown"),window.bootstrap.Collapse.getOrCreateInstance(i.find(".block-code")[0],{toggle:!1}).hide(),i.find(".block-inputs").addClass("d-none"),void i.find(".block-inputs").trigger("hidden");i.find(".block-loading").addClass("d-none")}else{if(i.find(".block-code-toggle").addClass("d-none"),i.find(".block-output-toggle").addClass("d-none"),i.find(".block-output-toggle").find("i").addClass("fa-chevron-up"),i.find(".block-output-toggle").find("i").removeClass("fa-chevron-down"),i.find(".block-title").addClass("d-none"),e==n.length-1)return i.removeClass("d-none"),i.find(".block-output").addClass("show"),i.find(".block-output").removeClass("d-none"),i.find(".block-output").trigger("shown"),window.bootstrap.Collapse.getOrCreateInstance(i.find(".block-code")[0],{toggle:!1}).hide(),i.find(".block-inputs").addClass("d-none"),void i.find(".block-inputs").trigger("hidden");i.addClass("d-none")}}))})))})(e),(e=>{$(e).each(((e,n)=>{(e=>{const n=$(e).find(".block").last(),t=n.find(".block-output"),o=n.find(".block-title"),i=n.find(".block-inputs");o.addClass("d-none"),i.addClass("d-none"),n.find(".block-code-toggle").addClass("d-none"),n.find(".block-output-toggle").addClass("d-none");const s=t.find(".shiny-bound-output").first().attr("id");$(document).on("shiny:value",(e=>{e.name===s&&t.find(".block-loading").addClass("d-none")}))})(n)}))})(e),t(e),n(e),(e=>{let n=!1;$(e).find(".block>.card").each(((e,t)=>{$(t).hasClass("border-danger")&&(n=!0)})),n&&$(e).find(".stack-edit-toggle").trigger("click")})(e)})(o),s(o,e.stack),(0,r.renderLocked)(o,e.locked),c(),(e=>{$(e).find(".stack-remove").on("click",(()=>{$(e).find("[data-bs-toggle='tooltip']").each(((e,n)=>{window.bootstrap.Tooltip.getOrCreateInstance(n).dispose()}));const n=new CustomEvent("blockr:remove-stack",{detail:{stack:e.replace("#","")}});document.dispatchEvent(n)}))})(o);const i=new CustomEvent("blockr:stack-render",{detail:e});document.dispatchEvent(i)}),750)})),window.Shiny.addCustomMessageHandler("blockr-add-block",(e=>{const o=`#${e.stack}`;$(o).removeClass("d-none"),setTimeout((()=>{t(o),n(o)}),500)})),window.Shiny.addCustomMessageHandler("validate-block",(e=>{e.state?$(`[data-value="${e.id}"] .card`).removeClass("border-danger"):$(`[data-value="${e.id}"] .card`).addClass("border-danger")})),window.Shiny.addCustomMessageHandler("validate-input",(e=>{var n;(n=e).state||$(`#${n.id}`).closest(".block-inputs").removeClass("d-none"),(e=>{let n;n=$(`#${e.id}`).hasClass("shiny-input-select")?$(`#${e.id}-selectized`).parent(".selectize-input").closest("div"):`#${e.id}`,setTimeout((()=>{e.state?$(n).addClass("is-valid"):$(n).addClass("is-invalid")}),500)})(e)})),window.Shiny.addCustomMessageHandler("toggle-submit",(e=>{$(`#${e.id}`).prop("disabled",!e.state)}));const l=()=>{let e;$(".add-block").off("mouseenter"),$(".add-block").off("mouseleave"),$(".add-block").on("mouseenter",(n=>{clearTimeout(e);const t=$(n.currentTarget);t.closest(".blockr-registry").find(".blockr-description").html(`<p class="p-0">\n        ${t.data("icon")||'<i class="fas fa-cube"></i>'}\n        <strong>${t.data("name")||""}</strong><br/>\n        <small>${t.data("description")||""}</small></p>`),d(t.closest(".blockr-registry").find(".blockr-description"))})),$(".add-block").on("mouseleave",(n=>{const t=$(n.currentTarget).closest(".blockr-registry").find(".blockr-description");clearTimeout(e),e=setTimeout((()=>{u(t),$(t).text("")}),250)}))},d=e=>{$(e).addClass("rounded border border-primary p-1 my-1")},u=e=>{$(e).removeClass("rounded border border-primary p-1 my-1")},g=(e,n)=>{const t=n.map((e=>{return`<p class="cursor-pointer mb-1 badge add-block bg-${h(n=e)} me-1"\n    data-icon='${n.icon}'\n    data-index="${n.index}"\n    data-name="${n.name}"\n    data-description="${n.description}"\n    draggable="true">\n    ${n.name}\n  </p>`;var n})).join("");$(`#${e.ns}-scrollable-child`).append(t),l(),y(e),f()},h=e=>e.classes.includes("data_block")?"primary":e.classes.includes("transform_block")?"secondary":"info",f=()=>{$(".add-block").off("click"),$(".add-block").on("click",(e=>{const n=$(e.target).closest(".blockr-registry").attr("id").split("-");n.pop(),window.Shiny.setInputValue(`${n.join("-")}-add`,parseInt($(e.target).data("index")));const t=$(e.target).closest(".offcanvas").offcanvas("hide").attr("id");window.bootstrap.Offcanvas.getOrCreateInstance(`#${t}`).hide()}))},p=e=>{$(`#${e.ns}-scrollable`).off("scroll")},b=e=>{m(e),p(e),$(`#${e.ns}-scrollable`).on("scroll",(n=>{$(`#${e.ns}-scrollable-child`).height()-$(`#${e.ns}-scrollable`).height()-$(n.target).scrollTop()>10||(p(e),async function(e){const n=k(e.ns);return fetch(`${e.scroll}&min=${n+1}`).then((e=>e.json())).then((n=>{n.length&&g(e,n)}))}(e).then((()=>b(e))))}))};async function m(e){const n=k(e.ns);return fetch(`${e.scroll}&min=${n+1}`).then((e=>e.json())).then((n=>{n.length&&(g(e,n),$(`#${e.ns}-scrollable-child`).height()<=$(`#${e.ns}-scrollable`).height()&&m(e))}))}const k=e=>$(`#${e}-scrollable`).find(".add-block").length,y=e=>{$(`#${e.ns}-search`).off("click"),$(`#${e.ns}-query`).off("keyup"),$(`#${e.ns}-search`).on("click",w(e)),$(`#${e.ns}-query`).on("keyup",w(e))},w=e=>n=>{if(n.key&&"Enter"!=n.key)return;const{target:t}=n,o=$(`#${e.ns}-query`),i=String(o?.val());$(t).closest(".blockr-registry").find(".block-list-wrapper").html(""),""!=i?fetch(`${e.search}&query=${encodeURIComponent(i)}`).then((e=>e.json())).then((n=>{g(e,n),p(e)})):fetch(`${e.scroll}&min=1&max=10`).then((e=>e.json())).then((n=>{g(e,n),b(e)}))};$((()=>{window.Shiny.addCustomMessageHandler("blockr-registry-endpoints",(e=>{setTimeout((()=>{y(e),b(e),l()}),e.delay)}))}))})(),i})()));