!function(e){var t={};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=1)}([,function(e,t){const o=null;!function(){const e=document.querySelector("#buttonSave");e.onclick=()=>{const t=document.querySelector("#identity").value,n=document.querySelector("#password").value,r=document.querySelector("#identity").value;t&&n&&r&&o&&(function(){const e=document.querySelector("#identity").value,t=document.querySelector("#password").value,n=document.querySelector("#identity").value;try{const r=new URL("ALEX PLACE THE ENPOINT HERE e.g. azurehost../posts/create");fetch(r,{method:"POST",body:JSON.stringify({identity:e,password:t,content:n,image:o}),headers:{"Content-Type":"application/json"}}).then(e=>e.json()).then(e=>{e.error?console.error("errorrrr"):(console.log("success"),window.location.href="/")}).catch(e=>{throw console.error("catch"),new Error(e)}).finally(()=>{document.querySelector("#buttonSave").dataset.active=!0})}catch(e){console.error(e)}finally{document.querySelector("#buttonSave").dataset.active=!0}}((text,address,coordinates)),e.dataset.active=!1,null!=text&&""!=text||console.log("no text or no address"))},document.querySelector("#imageSearch").onclick=async()=>{const e=document.querySelector("#imageQuery").value,t=new URL("https://socialnetworkbing.cognitiveservices.azure.com/bing/v7.0/images/search"),n={q:e,count:1};Object.keys(n).forEach(e=>t.searchParams.append(e,n[e]));const r=await fetch(t,{method:"GET",headers:{"Ocp-Apim-Subscription-Key":"dced72a542724ce3bce2bdfe9e126c2e"}}),c=await r.json(),u=document.querySelector("#imagePreview");u.src="",console.log(c),c&&c.value&&c.value[0]&&c.value[0].contentUrl&&(u.src=c.value[0].contentUrl,o=c.value[0].contentUrl),console.log(c)}}()}]);