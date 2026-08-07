(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function n(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerPolicy&&(a.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?a.credentials="include":e.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function l(e){if(e.ep)return;e.ep=!0;const a=n(e);fetch(e.href,a)}})();const Ge="modulepreload",Ye=function(t){return"/"+t},be={},me=function(i,n,l){let e=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),d=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));e=Promise.allSettled(n.map(v=>{if(v=Ye(v),v in be)return;be[v]=!0;const o=v.endsWith(".css"),c=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${v}"]${c}`))return;const r=document.createElement("link");if(r.rel=o?"stylesheet":Ge,o||(r.as="script"),r.crossOrigin="",r.href=v,d&&r.setAttribute("nonce",d),document.head.appendChild(r),o)return new Promise((k,u)=>{r.addEventListener("load",k),r.addEventListener("error",()=>u(new Error(`Unable to preload CSS for ${v}`)))})}))}function a(s){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=s,window.dispatchEvent(d),!d.defaultPrevented)throw s}return e.then(s=>{for(const d of s||[])d.status==="rejected"&&a(d.reason);return i().catch(a)})},Ce="mydashboard_data",Ae="mydashboard_settings",We="mydashboard_last_sync",Ke="mydashboard_pending_changes",ae="mydashboard_server_url";function Qe(){try{const t=localStorage.getItem(ae);if(t){const{url:i}=JSON.parse(t);if(i){const n=String(i).trim().replace(/\/+$/,"");if(n)return n.endsWith("/api")?n:n+"/api"}}}catch{}return window.location.origin+"/api"}function et(t){const i=String(t||"").trim();i?localStorage.setItem(ae,JSON.stringify({url:i})):localStorage.removeItem(ae)}const pe={plans:[{id:"p1",name:"完成需求文档评审",detail:"与团队对齐PRD所有功能点",deadline:"2026-08-10",status:"未完成",note:"",createdAt:"2026-08-01",updatedAt:"2026-08-01"},{id:"p2",name:"搭建项目框架",detail:"初始化前端工程、配置构建工具",deadline:"2026-08-05",status:"已完成",note:"",createdAt:"2026-08-01",updatedAt:"2026-08-01"},{id:"p3",name:"学习React状态管理",detail:"深入学习Zustand和Jotai",deadline:"2026-07-20",status:"拖延中",note:"需重新安排时间",createdAt:"2026-07-10",updatedAt:"2026-07-10"}],autotasks:[{id:"at1",name:"工作日日志提醒",description:"每天记录工作日志",scheduleType:"weekday",scheduleTime:"17:00",scheduleDays:"",scheduleDate:"",status:"未完成",completedDates:[],createdAt:"2026-08-01",updatedAt:"2026-08-01"},{id:"at2",name:"工作日上班打卡",description:"确认到岗开始工作",scheduleType:"weekday",scheduleTime:"09:00",scheduleDays:"",scheduleDate:"",status:"未完成",completedDates:[],createdAt:"2026-08-01",updatedAt:"2026-08-01"},{id:"at3",name:"每日喝水提醒",description:"记得补充水分",scheduleType:"daily",scheduleTime:"10:00",scheduleDays:"",scheduleDate:"",status:"未完成",completedDates:[],createdAt:"2026-08-01",updatedAt:"2026-08-01"},{id:"at4",name:"三日浇花提醒",description:"给植物浇水",scheduleType:"interval",scheduleTime:"08:00",scheduleDays:"3",scheduleDate:"",status:"未完成",completedDates:[],createdAt:"2026-08-01",updatedAt:"2026-08-01"},{id:"at5",name:"每晚二胡练习",description:"练习二胡30分钟",scheduleType:"daily",scheduleTime:"20:00",scheduleDays:"",scheduleDate:"",status:"未完成",completedDates:[],createdAt:"2026-08-01",updatedAt:"2026-08-01"},{id:"at6",name:"每晚11点睡觉",description:"保持规律作息",scheduleType:"daily",scheduleTime:"23:00",scheduleDays:"",scheduleDate:"",status:"未完成",completedDates:[],createdAt:"2026-08-01",updatedAt:"2026-08-01"}],learning:[{id:"l1",topic:"Zustand状态管理",content:"学习了Zustand的基本用法，包括create、set、get等API",result:"完成了一个Todo应用的demo",studyTime:"2026-08-03",images:[],note:"需要继续深入",createdAt:"2026-08-03",updatedAt:"2026-08-03"}],habits:[{id:"h1",name:"每日阅读",type:"正向",rating:4,record:"坚持每天阅读30分钟",note:"继续保持",createdAt:"2026-08-01",updatedAt:"2026-08-01"},{id:"h2",name:"熬夜",type:"负面",rating:2,record:"最近有所改善，但偶尔还是会熬夜",note:"目标是完全戒掉",createdAt:"2026-08-01",updatedAt:"2026-08-01"}],finance:[]},we={notifications:!0,theme:"light",autoSync:!0,reminderVolume:70};function tt(){try{const t=localStorage.getItem(Ce);if(t)try{return JSON.parse(t)}catch{}return JSON.parse(JSON.stringify(pe))}catch{return JSON.parse(JSON.stringify(pe))}}function Y(t){localStorage.setItem(Ce,JSON.stringify(t))}function at(){try{const t=localStorage.getItem(Ae);return t?JSON.parse(t):{...we}}catch{return{...we}}}function it(t){localStorage.setItem(Ae,JSON.stringify(t))}function Ie(){localStorage.removeItem(Ke)}function se(){localStorage.setItem(We,new Date().toISOString())}async function G(t,i={}){const n=Qe()+t;try{const l=await fetch(n,{headers:{"Content-Type":"application/json"},...i});if(!l.ok)throw new Error(`HTTP ${l.status}`);return await l.json()}catch(l){return console.warn("API error:",l.message),null}}let g=tt(),ie=at();function U(t,i){const n={};for(const e of i)n[e.id]=e;const l=[];for(const e of t){const a=n[e.id];if(a){const s=e.updatedAt||e.createdAt||"",d=a.updatedAt||a.createdAt||"";l.push(d>s?a:e)}else l.push(e)}for(const e of i)l.find(a=>a.id===e.id)||l.push(e);return l}function ve(t){g.plans=U(g.plans,t.plans||[]),g.autotasks=U(g.autotasks,t.autotasks||[]),g.learning=U(g.learning,t.learning||[]),g.habits=U(g.habits,t.habits||[]),g.finance=U(g.finance,t.finance||[])}async function st(){const t=await G("/sync");if(t&&t.plans){ve(t);const i=await G("/sync",{method:"POST",body:JSON.stringify(g)});return i&&i.plans&&ve(i),Y(g),se(),Ie(),"synced"}return"offline"}function I(){Y(g),G("/sync",{method:"POST",body:JSON.stringify(g)}).then(t=>{t&&se()})}async function ze(){const t=await G("/sync",{method:"POST",body:JSON.stringify(g)});return t&&(se(),Ie()),t}async function _e(){const t=await G("/sync");return t&&t.plans?(ve(t),Y(g),se(),!0):!1}function W(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}function fe(t){if(!t)return"";const i=t instanceof Date?t.toISOString():String(t),n=new Date(i.includes("T")?i:i+"T00:00:00");return isNaN(n.getTime())?"":`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`}function _(){return fe(new Date)}function B(){return new Date().toISOString()}function P(t,i){return(t||"").startsWith(i)}function T(t){return t?t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function ne(t=12){const i=[],n=new Date;for(let l=0;l<t;l++){const e=new Date(n.getFullYear(),n.getMonth()-l,1);i.push(`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`)}return i}function le(t){const[i,n]=t.split("-");return`${i}年${parseInt(n)}月`}function Q(t){return t[Math.floor(Math.random()*t.length)]}function nt(t){return`<span class="tag ${{未完成:"tag-todo",已完成:"tag-done",拖延中:"tag-delay",已作废:"tag-cancel",即将开始:"tag-upcoming"}[t]||""}">${T(t)}</span>`}const xe=["太棒了！又完成了一项！🎉","坚持就是胜利，继续加油！💪","每一步都算数～🌟","做得真好，为自己骄傲！✨","今天的你很优秀！🔥","完成的感觉真不错吧～😊","又在成长的路上前进了一步 🌱","你就是效率达人！⚡"],lt=["别担心，慢慢来～调整一下状态 🍃","偶尔的拖延也是自我调节，重新出发吧 🌿","计划赶不上变化，灵活调整就好 😌","给自己一点时间，你已经在路上了 💛"],ct=["每一次学习都在塑造更好的自己 📚","知识的积累让你越来越强大 🌟","学无止境，你今天又进步了！🎓","保持好奇心，这是最珍贵的品质 💡"];function ot(t){return Q(t==="done"?xe:t==="remind"?lt:t==="learn"?ct:xe)}const Me={收入:["工资","奖金","兼职","投资","其他收入"],支出:["餐饮","交通","购物","住房","娱乐","医疗","教育","其他支出"]};function ce(t,{actionWidth:i=144,dragThreshold:n=6,onEdit:l=null,onDelete:e=null,onClick:a=null}={}){const s=Array.from(t.querySelectorAll(".swipe-wrap"));let d=null;function v(){s.forEach(o=>{const c=o.querySelector(".swipe-card");c&&c.classList.contains("swiped")&&(c.classList.remove("swiped"),c.style.transform="")}),d=null}s.forEach(o=>{const c=o.querySelector(".swipe-card");if(!c)return;const r=o.dataset.id,k=o.querySelector('.swipe-action-btn[data-action="edit"]'),u=o.querySelector('.swipe-action-btn[data-action="delete"]'),h=y=>y.closest("button, a, .toggle, .dropdown, .star-mini");k&&k.addEventListener("click",y=>{y.stopPropagation(),v(),l&&l(r,o,y)}),u&&u.addEventListener("click",y=>{y.stopPropagation(),v(),e&&e(r,o,y)});let m=0,E=0,w=!1,M=!1,C=!1;c.addEventListener("touchstart",y=>{h(y.target)||(m=y.touches[0].clientX,E=m,w=!1,c.style.transition="none")},{passive:!0}),c.addEventListener("touchmove",y=>{E=y.touches[0].clientX;const f=E-m;if(Math.abs(f)>n&&(w=!0,C=!0),w){if(d&&d!==o){const z=d.querySelector(".swipe-card");z.classList.remove("swiped"),z.style.transform=""}let L=f;c.classList.contains("swiped")&&(L=-i+f),L>0&&(L=0),L<-i-20&&(L=-i-20),c.style.transform=`translateX(${L}px)`}},{passive:!0}),c.addEventListener("touchend",()=>{if(c.style.transition="",!w)return;const y=E-m;let f=y;c.classList.contains("swiped")&&(f=-i+y),f<-i/3?(c.classList.add("swiped"),c.style.transform="",d=o):(c.classList.remove("swiped"),c.style.transform="",d===o&&(d=null)),w=!1,setTimeout(()=>{C=!1},300)});let x=0,A=0;c.addEventListener("mousedown",y=>{if(y.button!==0||h(y.target))return;x=y.clientX,A=x,M=!1,c.style.transition="none",c.style.cursor="grabbing";const f=z=>{A=z.clientX;const F=A-x;if(Math.abs(F)>n&&(M=!0,C=!0),M){if(d&&d!==o){const N=d.querySelector(".swipe-card");N.classList.remove("swiped"),N.style.transform=""}let D=F;c.classList.contains("swiped")&&(D=-i+F),D>0&&(D=0),D<-i-20&&(D=-i-20),c.style.transform=`translateX(${D}px)`}},L=()=>{if(c.style.transition="",c.style.cursor="",document.removeEventListener("mousemove",f),document.removeEventListener("mouseup",L),!M)return;const z=A-x;let F=z;c.classList.contains("swiped")&&(F=-i+z),F<-i/3?(c.classList.add("swiped"),c.style.transform="",d=o):(c.classList.remove("swiped"),c.style.transform="",d===o&&(d=null)),M=!1,setTimeout(()=>{C=!1},300)};document.addEventListener("mousemove",f),document.addEventListener("mouseup",L)}),c.addEventListener("click",y=>{if(C){y.preventDefault(),y.stopPropagation(),C=!1;return}c.classList.contains("swiped")?(y.preventDefault(),y.stopPropagation(),v()):a&&a(r,o,y)})}),document.addEventListener("touchstart",o=>{o.target.closest(".swipe-wrap")||v()},{passive:!0}),document.addEventListener("mousedown",o=>{o.target.closest(".swipe-wrap")||v()})}function p(t,i={}){const{size:n=18,className:l="",color:e="",strokeWidth:a=2}=i,s=[`width="${n}"`,`height="${n}"`,'viewBox="0 0 24 24"','fill="none"',`stroke="${e||"currentColor"}"`,`stroke-width="${a}"`,'stroke-linecap="round"','stroke-linejoin="round"',l?`class="${l}"`:""].filter(Boolean).join(" "),d=dt(t);return`<svg ${s}>${d}</svg>`}function dt(t){const i={dashboard:'<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="3" y="9" width="7" height="12"/><rect x="14" y="3" width="7" height="7"/>',"clipboard-list":'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',"book-open":'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',sprout:'<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.6"/><path d="M14.1 6a7 7 0 0 0-1.1 4c0 1 .2 1.9.5 2.8"/>',wallet:'<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',check:'<polyline points="20 6 9 17 4 12"/>',x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',"chevron-right":'<path d="m9 18 6-6-6-6"/>',"chevron-left":'<path d="m15 18-6-6 6-6"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',"chevron-up":'<path d="m18 15-6-6-6 6"/>',trash:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',"alert-circle":'<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',circle:'<circle cx="12" cy="12" r="10"/>',"check-circle":'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',"trending-up":'<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',"trending-down":'<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>',target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',award:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',"bar-chart":'<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',"pie-chart":'<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',"arrow-up-circle":'<circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/>',"arrow-down-circle":'<circle cx="12" cy="12" r="10"/><path d="m12 16-4-4"/><path d="m8 12 8 0"/><path d="M12 8v8"/>',refresh:'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',cloud:'<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',menu:'<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',filter:'<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',"more-horizontal":'<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',"more-vertical":'<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',play:'<polygon points="6 3 20 12 6 21 6 3"/>',pause:'<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',power:'<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>',coffee:'<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>',briefcase:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',droplets:'<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',"book-marked":'<path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',"graduation-cap":'<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',lightbulb:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',sparkles:'<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',"shopping-cart":'<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',utensils:'<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',car:'<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',bus:'<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 12h18"/><path d="M7 12v4"/><path d="M17 12v4"/>',gift:'<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',"file-text":'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',"list-todo":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 8h.01"/><path d="M12 8h3"/><path d="M9 12h.01"/><path d="M12 12h3"/><path d="M9 16h.01"/><path d="M12 16h3"/>',flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',activity:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',gauge:'<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',"building-2":'<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',store:'<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/>',warehouse:'<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect x="6" y="10" width="12" height="12"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',unlock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',"eye-off":'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>',copy:'<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',"map-pin":'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',info:'<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/>',"alert-triangle":'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>',"arrow-up":'<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',"arrow-down":'<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',"arrow-right":'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',"arrow-left":'<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',"external-link":'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>',bookmark:'<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',tag:'<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',dumbbell:'<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>',stethoscope:'<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>',scissors:'<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M20 20 8.12 8.12"/>',plane:'<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',bike:'<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h3"/>',"tree-pine":'<path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z"/><path d="M12 22v-3"/>',"flower-2":'<path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"/><circle cx="12" cy="11" r="3"/><path d="M12 14v8"/><path d="M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z"/><path d="M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z"/>',"moon-star":'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="m19.5 8.5-1-1"/><path d="m17.5 5.5 1-1"/>',sunrise:'<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M20 13h-2"/><path d="M4 13H2"/><path d="m6.34 17.66-1.41 1.41"/><path d="M18.36 6.64l1.41-1.41"/><path d="M22 17H2"/><path d="m8 6 4-4 4 4"/>',sunset:'<path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M20 13h2"/><path d="M4 13H2"/><path d="m6.34 5.34-1.41 1.41"/><path d="M18.36 17.36l1.41 1.41"/><path d="M22 17H2"/><path d="m16 6-4 4-4-4"/>',"cloud-rain":'<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/><path d="M20 16v6"/>',"cloud-snow":'<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 19h.01"/><path d="M8.5 16.5h.01"/><path d="M16 19h.01"/><path d="M16.5 16.5h.01"/><path d="M12 21h.01"/><path d="M12.5 18.5h.01"/>',wind:'<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',smartphone:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',laptop:'<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',server:'<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',database:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',battery:'<rect x="2" y="7" width="16" height="10" rx="2"/><line x1="22" x2="22" y1="11" y2="13"/>',wifi:'<path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" x2="12.01" y1="20" y2="20"/>',"toggle-left":'<rect x="1" y="5" width="22" height="14" rx="7" ry="7"/><circle cx="8" cy="12" r="3"/>',"toggle-right":'<rect x="1" y="5" width="22" height="14" rx="7" ry="7"/><circle cx="16" cy="12" r="3"/>',sliders:'<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/>',"check-square":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 12 2 2 4-4"/>',"x-circle":'<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',"play-circle":'<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',"pause-circle":'<circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/>',save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',archive:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M11 15h2"/><path d="M12 12v3"/><path d="M3 9h18"/>',inbox:'<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',"alarm-clock":'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M10 2h4"/><path d="m15.3 18.7 2.7 2.7"/>',hourglass:'<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>',send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',"phone-call":'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14.05 2a9 9 0 0 1 .8 3.35"/><path d="M2 14.05a9 9 0 0 1 3.35.8"/>',"shield-check":'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',"shield-alert":'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',crown:'<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',medal:'<path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/>',rocket:'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',compass:'<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',umbrella:'<path d="M22 12a10.06 10.06 0 0 0-20 0Z"/><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M12 2v1"/>',camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',video:'<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>',mic:'<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',headphones:'<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',radio:'<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>',terminal:'<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',code:'<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',"terminal-square":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m7 11 2 2-2 2"/><path d="M11 17h4"/>',layers:'<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.84l8.57 3.9a2 2 0 0 0 1.66 0l8.57-3.9a1 1 0 0 0 0-1.84Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',package:'<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',box:'<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',palette:'<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',brush:'<path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-1.07 2-2 2"/><path d="m2 22 7.5-7.5"/>',pencil:'<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',"folder-open":'<path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>',file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',paperclip:'<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',"rotate-cw":'<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',"rotate-ccw":'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',repeat:'<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',shuffle:'<path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="M4 4l5 5"/>',"volume-2":'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',"volume-x":'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>',maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',minimize:'<path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>',"zoom-in":'<circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/>',"zoom-out":'<circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/>',hash:'<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>',"at-sign":'<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>',"help-circle":'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/>',ban:'<circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/>',"stop-circle":'<circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6" rx="1"/>',"circle-dot":'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>',"circle-slash":'<circle cx="12" cy="12" r="10"/><path d="M4.93 4.93 19.07 19.07"/>',"minus-circle":'<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/>',"plus-circle":'<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',"move-right":'<path d="M18 8 22 12 18 16"/><path d="M2 12h20"/>',"move-left":'<path d="M6 8 2 12 6 16"/><path d="M2 12h20"/>',"move-up":'<path d="m8 6 4-4 4 4"/><path d="M12 2v20"/>',"move-down":'<path d="m8 18 4 4 4-4"/><path d="M12 2v20"/>',"corner-up-right":'<polyline points="15 14 15 8 9 8"/><polyline points="15 8 6 17 3 14"/>',"corner-up-left":'<polyline points="9 14 9 8 15 8"/><polyline points="9 8 18 17 15 14"/>',"corner-down-right":'<polyline points="15 10 15 16 9 16"/><polyline points="15 16 6 7 3 10"/>',"corner-down-left":'<polyline points="9 10 9 16 15 16"/><polyline points="9 16 18 7 15 10"/>',"skip-forward":'<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/>',"skip-back":'<polygon points="19 20 9 12 19 4 19 20"/><line x1="5" x2="5" y1="19" y2="5"/>',rewind:'<polygon points="11 19 2 12 11 5 11 19"/><path d="M22 19V5l-11 7z"/>',"fast-forward":'<polygon points="13 19 22 12 13 5 13 19"/><path d="M2 19V5l11 7z"/>',"thumbs-up":'<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',"thumbs-down":'<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>',laugh:'<circle cx="12" cy="12" r="10"/><path d="M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/>',"smile-icon":'<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',"frown-icon":'<circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',meh:'<circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="15" y2="15"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',"smile-plus":'<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/><path d="M2 12h4"/><path d="M4 10v4"/>',"sun-medium":'<circle cx="12" cy="12" r="4"/><path d="M12 3v2"/><path d="M12 19v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M3 12h2"/><path d="M19 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',eclipse:'<circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 1 0 10 10 10 10 0 0 1-10-10Z"/>',droplet:'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',"waves-icon":'<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',"align-center":'<line x1="21" x2="3" y1="6" y2="6"/><line x1="17" x2="7" y1="12" y2="12"/><line x1="19" x2="5" y1="18" y2="18"/>',"align-left":'<line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/>',"align-right":'<line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="9" y1="12" y2="12"/><line x1="21" x2="7" y1="18" y2="18"/>',bold:'<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>',italic:'<line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/>',underline:'<path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/>',"list-ordered":'<line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',"check-circle-2":'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',"calendar-days":'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',"calendar-check":'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>',"cloud-lightning":'<path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/>',tornado:'<path d="M21 4H3"/><path d="M13 20H3"/><path d="M21 8H3"/><path d="M17 16H3"/><path d="M11 12H3"/><path d="M19 12h2"/>',"cloud-fog":'<path d="M4 15h15"/><path d="M2 19h13"/><path d="M6.05 10a5 5 0 0 1 9.42-1.915 4.5 4.5 0 0 1 7.39 3.49"/>',"cloud-drizzle":'<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 19v1"/><path d="M12 19v1"/><path d="M16 19v1"/><path d="M10 22v1"/><path d="M14 22v1"/>',"cloud-hail":'<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m16 16 1 2"/><path d="m8 16 1 2"/><path d="m12 18 1 2"/><path d="m16 20 1 2"/>',snowflake:'<line x1="2" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>',thermometer:'<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>',"sun-dim":'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'};return i[t]||i.circle}function $(t,i="info",n=""){const e=n||{success:"check-circle",warning:"alert-triangle",info:"info"}[i]||"info",s={success:"var(--success)",warning:"var(--warning)",info:"var(--primary)",error:"var(--danger)"}[i]||"var(--text-secondary)",d=document.createElement("div");d.className=`toast ${i}`,d.innerHTML=`<span class="toast-icon">${p(e,{size:18,color:s})}</span>${t}`,document.getElementById("toastContainer").appendChild(d),setTimeout(()=>{d.style.opacity="0",d.style.transition="opacity 0.3s",setTimeout(()=>d.remove(),300)},2800)}function He(t,i,n=14){const l=document.getElementById("particlesContainer"),e=["✨","⭐","🌟","💫","🌸","🌺","🎉","💖","🔥","💪"];for(let a=0;a<n;a++){const s=document.createElement("span");s.className="particle",s.textContent=e[a%e.length],s.style.left=t+"px",s.style.top=i+"px",s.style.setProperty("--rot",Math.random()*60-30+"deg"),s.style.animationDuration=.8+Math.random()*.8+"s",s.style.animationDelay=Math.random()*.15+"s",l.appendChild(s),setTimeout(()=>s.remove(),1500)}}function oe(t){const i=ot(t);$(i,"success"),He(window.innerWidth/2,window.innerHeight*.4,16)}function j(t,i,n){const l=document.createElement("div");l.className="modal-overlay",l.innerHTML=`
    <div class="modal">
      <div class="modal-header"><div class="modal-title">${t}</div><button class="modal-close">&times;</button></div>
      <div class="modal-body">${i}</div>
    </div>`,document.body.appendChild(l);const e=()=>{l.style.opacity="0",l.style.transition="opacity 0.2s",setTimeout(()=>l.remove(),200)};return l.querySelector(".modal-close").onclick=e,l.addEventListener("click",a=>{a.target===l&&e()}),{overlay:l,close:e,getEl:a=>l.querySelector(a),getAll:a=>l.querySelectorAll(a)}}function Z(t,i,n){const l=j(t,`
    <p style="color:var(--text-secondary);font-size:14px">${i}</p>
    <div class="modal-footer">
      <button class="btn btn-ghost cancel-btn">取消</button>
      <button class="btn btn-danger confirm-btn">确认</button>
    </div>`);l.getEl(".cancel-btn").onclick=l.close,l.getEl(".confirm-btn").onclick=()=>{n(),l.close()}}function rt(){try{const t=new(window.AudioContext||window.webkitAudioContext);[0,.2,.4].forEach((n,l)=>{const e=t.createOscillator(),a=t.createGain();e.connect(a),a.connect(t.destination),e.frequency.value=l===1?880:660,e.type="sine",a.gain.setValueAtTime(.3,t.currentTime+n),a.gain.exponentialRampToValueAtTime(.01,t.currentTime+n+.15),e.start(t.currentTime+n),e.stop(t.currentTime+n+.15)})}catch{console.warn("Audio not supported")}}function pt(t){if(rt(),"Notification"in window&&Notification.permission==="granted")try{new Notification("⏰ 定时任务提醒",{body:`「${t.name}」该处理啦！`,icon:""})}catch{}const i=document.createElement("div");i.className="reminder-overlay",i.innerHTML=`
    <div class="reminder-modal">
      <div class="reminder-icon">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    </div>
    <div class="reminder-title">任务提醒</div>
    <div class="reminder-task-name">${t.name}</div>
    ${t.description?`<div class="reminder-task-desc">${t.description}</div>`:""}
    <div class="reminder-time">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      ${t.scheduleTime||""}
    </div>
    <div class="reminder-actions">
      <button class="reminder-btn reminder-btn-secondary">稍后提醒</button>
      <button class="reminder-btn reminder-btn-primary">知道了</button>
    </div>
  </div>`,document.body.appendChild(i);const n=()=>{i.style.opacity="0",i.style.transition="opacity 0.3s ease",setTimeout(()=>i.remove(),300)};return i.querySelector(".reminder-btn-primary").onclick=n,i.querySelector(".reminder-btn-secondary").onclick=n,i.addEventListener("click",l=>{l.target===i&&n()}),{overlay:i,close:n}}function vt(t){const i=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),n=URL.createObjectURL(i),l=document.createElement("a");l.href=n,l.download=`星河浅滩_数据备份_${new Date().toISOString().slice(0,10)}.json`,l.click(),URL.revokeObjectURL(n);const e=document.createElement("div");e.className="export-toast",e.innerHTML=`${p("check-circle",{size:16,color:"#10B981"})} 数据已导出备份！`,document.body.appendChild(e),setTimeout(()=>{e.style.opacity="0",e.style.transition="opacity 0.5s",setTimeout(()=>e.remove(),500)},2e3)}function ut(t,i,n,l){const e=new FileReader;e.onload=function(a){try{const s=JSON.parse(a.target.result);s.plans&&s.autotasks&&s.learning&&s.habits&&s.finance?(Object.assign(i,s),n(),l(),$("数据导入成功！","success")):$("文件格式不正确","warning")}catch{$("文件解析失败","warning")}},e.readAsText(t)}let X=null;document.addEventListener("click",t=>{X&&!t.target.closest(".custom-select")&&ee()});function ee(){X&&(X.classList.remove("open"),X=null)}function q(t){const{id:i="",value:n="",items:l=[],onChange:e=null,size:a="md",variant:s="default",placeholder:d="",className:v="",align:o="left"}=t,c=l.find(h=>h.value===n)||l[0]||{label:d||"请选择",value:""},r=document.createElement("div");r.className=`custom-select ${s} size-${a} ${v}`.trim(),i&&(r.id=i),r.dataset.value=c.value||"",r.innerHTML=`
    <div class="custom-select-trigger">
      <span class="custom-select-label">${c.label||d||"请选择"}</span>
      <span class="custom-select-arrow">${p("chevron-down",{size:14})}</span>
    </div>
    <div class="custom-select-menu align-${o}">
      ${l.map(h=>`
        <div class="custom-select-option ${h.value===c.value?"selected":""}" data-value="${h.value}">
          ${h.icon?`<span class="custom-select-option-icon">${p(h.icon,{size:14,color:h.color||""})}</span>`:""}
          <span class="custom-select-option-label">${h.label}</span>
          ${h.value===c.value?`<span class="custom-select-check">${p("check",{size:14})}</span>`:""}
        </div>
      `).join("")}
    </div>
  `;const k=r.querySelector(".custom-select-trigger");r.querySelector(".custom-select-menu");const u=r.querySelectorAll(".custom-select-option");return k.addEventListener("click",h=>{h.stopPropagation();const m=r.classList.contains("open");ee(),m||(r.classList.add("open"),X=r)}),u.forEach(h=>{h.addEventListener("click",m=>{m.stopPropagation();const E=h.dataset.value,w=l.find(C=>C.value===E);if(!w)return;r.dataset.value=E;const M=r.querySelector(".custom-select-label");M&&(M.textContent=w.label),u.forEach(C=>{C.classList.toggle("selected",C.dataset.value===E);const x=C.querySelector(".custom-select-check");C.dataset.value===E&&!x?C.insertAdjacentHTML("beforeend",`<span class="custom-select-check">${p("check",{size:14})}</span>`):C.dataset.value!==E&&x&&x.remove()}),ee(),e&&e(E,w)})}),{el:r,getValue:()=>r.dataset.value,setValue:h=>{const m=l.find(w=>w.value===h);if(!m)return;r.dataset.value=h;const E=r.querySelector(".custom-select-label");E&&(E.textContent=m.label),u.forEach(w=>{w.classList.toggle("selected",w.dataset.value===h);const M=w.querySelector(".custom-select-check");w.dataset.value===h&&!M?w.insertAdjacentHTML("beforeend",`<span class="custom-select-check">${p("check",{size:14})}</span>`):w.dataset.value!==h&&M&&M.remove()})},updateItems:h=>{l.length=0,l.push(...h);const m=r.dataset.value,E=h.find(M=>M.value===m)||h[0];if(E){r.dataset.value=E.value;const M=r.querySelector(".custom-select-label");M&&(M.textContent=E.label)}const w=r.querySelector(".custom-select-menu");w&&(w.innerHTML=h.map(M=>`
          <div class="custom-select-option ${M.value===r.dataset.value?"selected":""}" data-value="${M.value}">
            ${M.icon?`<span class="custom-select-option-icon">${p(M.icon,{size:14,color:M.color||""})}</span>`:""}
            <span class="custom-select-option-label">${M.label}</span>
            ${M.value===r.dataset.value?`<span class="custom-select-check">${p("check",{size:14})}</span>`:""}
          </div>
        `).join(""),w.querySelectorAll(".custom-select-option").forEach(M=>{M.addEventListener("click",C=>{C.stopPropagation();const x=M.dataset.value,A=h.find(f=>f.value===x);if(!A)return;r.dataset.value=x;const y=r.querySelector(".custom-select-label");y&&(y.textContent=A.label),w.querySelectorAll(".custom-select-option").forEach(f=>{f.classList.toggle("selected",f.dataset.value===x);const L=f.querySelector(".custom-select-check");f.dataset.value===x&&!L?f.insertAdjacentHTML("beforeend",`<span class="custom-select-check">${p("check",{size:14})}</span>`):f.dataset.value!==x&&L&&L.remove()}),ee(),e&&e(x,A)})}))}}}async function ht(t,i){const n=i.plans.filter(b=>!b.deleted),l=i.autotasks.filter(b=>!b.deleted),e=i.learning.filter(b=>!b.deleted),a=i.habits.filter(b=>!b.deleted),s=i.finance.filter(b=>!b.deleted),d=_().slice(0,7),v=new Date,o=v.getHours();let c="早上好";o>=12&&o<14?c="中午好":o>=14&&o<18?c="下午好":o>=18&&o<22?c="晚上好":(o>=22||o<5)&&(c="夜深了");const r=n.length,k=n.filter(b=>b.status==="已完成").length,u=n.filter(b=>b.status==="进行中").length,h=n.filter(b=>b.status==="待办").length,m=r?Math.round(k/r*100):0,w=l.filter(b=>(b.completedDates||[]).some(H=>P(H,d))).length,M=l.length,C=l.reduce((b,H)=>b+(H.completedDates||[]).filter(K=>P(K,d)).length,0),x=e.filter(b=>P(b.studyTime,d)).length,A=a.filter(b=>b.type==="正向"),y=a.filter(b=>b.type==="负面"),f=A.length?(A.reduce((b,H)=>b+(H.rating||0),0)/A.length).toFixed(1):"--",L=y.length?(y.reduce((b,H)=>b+(H.rating||0),0)/y.length).toFixed(1):"--",z=s.filter(b=>P(b.date,d)),F=z.filter(b=>b.type==="收入").reduce((b,H)=>b+(H.amount||0),0),D=z.filter(b=>b.type==="支出").reduce((b,H)=>b+(H.amount||0),0),N=F-D,Ue=["日","一","二","三","四","五","六"],Xe=`${v.getFullYear()}年${v.getMonth()+1}月${v.getDate()}日 星期${Ue[v.getDay()]}`;t.innerHTML=`
    <div class="welcome-section">
      <div class="welcome-info">
        <div class="welcome-greeting">${c} ${p("sparkles",{size:18,color:"#F59E0B"})}</div>
        <div class="welcome-subtitle">今天也要元气满满地生活哦～</div>
        <div class="welcome-date">${Xe}</div>
      </div>
      <div class="welcome-illustration">
        <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="100" y="10" width="90" height="70" rx="10" fill="url(#grad1)" opacity="0.9"/>
          <rect x="108" y="20" width="30" height="4" rx="2" fill="rgba(255,255,255,0.8)"/>
          <rect x="108" y="30" width="50" height="4" rx="2" fill="rgba(255,255,255,0.5)"/>
          <rect x="108" y="40" width="40" height="4" rx="2" fill="rgba(255,255,255,0.5)"/>
          <rect x="108" y="50" width="55" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
          <rect x="108" y="60" width="35" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
          <circle cx="170" cy="35" r="18" fill="rgba(255,255,255,0.25)"/>
          <path d="M160 35 L168 43 L180 31" stroke="rgba(255,255,255,0.9)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <rect x="60" y="0" width="35" height="50" rx="6" fill="#E0E7FF" opacity="0.6"/>
          <rect x="68" y="8" width="22" height="3" rx="1.5" fill="#A5B4FC"/>
          <rect x="68" y="16" width="18" height="3" rx="1.5" fill="#C7D2FE"/>
          <rect x="68" y="24" width="20" height="3" rx="1.5" fill="#C7D2FE"/>
          <rect x="68" y="32" width="16" height="3" rx="1.5" fill="#E0E7FF"/>
          <circle cx="78" cy="40" r="4" fill="#818CF8"/>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>

    <div class="stats-banner">
      <div class="stat-banner-item blue">
        <div class="stat-banner-icon">
          ${p("clipboard-list",{color:"#fff",size:22})}
        </div>
        <div class="stat-banner-value">${h}</div>
        <div class="stat-banner-label">待办</div>
        <div class="stat-banner-sub">待处理事项</div>
      </div>
      <div class="stat-banner-item purple">
        <div class="stat-banner-icon">
          ${p("clock",{color:"#fff",size:22})}
        </div>
        <div class="stat-banner-value">${u}</div>
        <div class="stat-banner-label">进行中</div>
        <div class="stat-banner-sub">进行中的任务</div>
      </div>
      <div class="stat-banner-item green">
        <div class="stat-banner-icon">
          ${p("check-circle",{color:"#fff",size:22})}
        </div>
        <div class="stat-banner-value">${k}</div>
        <div class="stat-banner-label">已完成</div>
        <div class="stat-banner-sub">已完成的任务</div>
      </div>
      <div class="stat-banner-item orange">
        <div class="stat-banner-icon">
          ${p("wallet",{color:"#fff",size:22})}
        </div>
        <div class="stat-banner-value">¥${N.toLocaleString()}</div>
        <div class="stat-banner-label">金额</div>
        <div class="stat-banner-sub">账户净收入</div>
      </div>
    </div>

    <div class="section-title">数据概览</div>
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-card-label">
          <span style="color:#8B5CF6">${p("clipboard-list",{size:18})}</span>
          计划完成率
        </div>
        <div class="stat-card-value">${m}%</div>
        <div class="progress-bar" style="margin-top:12px">
          <div class="progress-bar-fill" style="width:${m}%"></div>
        </div>
        <div class="stat-card-sub">${k}/${r} 已完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <span style="color:#F59E0B">${p("target",{size:18})}</span>
          本月打卡
        </div>
        <div class="stat-card-value">${C}</div>
        <div class="stat-card-sub">${w}/${M} 习惯打卡记录</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <span style="color:#3B82F6">${p("book-open",{size:18})}</span>
          本月学习
        </div>
        <div class="stat-card-value">${x}</div>
        <div class="stat-card-sub">本月学习记录次数</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <span style="color:#10B981">${p("sprout",{size:18})}</span>
          正向习惯得分
        </div>
        <div class="stat-card-value">${f}</div>
        <div class="stat-card-sub">共 ${A.length} 项正向习惯</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <span style="color:#10B981">${p("wallet",{size:18})}</span>
          本月净收支
        </div>
        <div class="stat-card-value" style="color:${N>=0?"var(--success-deep)":"var(--danger-deep)"}">${N>=0?"+":""}¥${N.toLocaleString()}</div>
        <div class="stat-card-sub">收入 ¥${F.toLocaleString()} · 支出 ¥${D.toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <span style="color:#F59E0B">${p("zap",{size:18})}</span>
          负面习惯扣分
        </div>
        <div class="stat-card-value">${L}</div>
        <div class="stat-card-sub">共 ${y.length} 项负面习惯（越低越好）</div>
      </div>
    </div>

    <div class="section-title">月度收支概览</div>
    <div class="chart-row">
      <div class="chart-card">
        <div class="chart-card-title">收支情况（单位：元）</div>
        <div class="chart-wrap"><canvas id="dashFinBar"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-card-title">收支占比（单位：元）</div>
        <div class="chart-wrap"><canvas id="dashFinPie"></canvas></div>
      </div>
    </div>
    <div style="margin-top:8px;text-align:center">
      <p style="font-size:13px;color:var(--text-secondary);font-weight:500;display:flex;align-items:center;justify-content:center;gap:6px">
        ${m>=80?`${p("trophy",{size:14,color:"#F59E0B"})} 计划执行得非常棒，继续保持！`:m>=50?`${p("trending-up",{size:14,color:"#10B981"})} 计划稳步推进中，加油！`:m>0?`${p("sprout",{size:14,color:"#10B981"})} 还有提升空间，慢慢来～`:`${p("clipboard-list",{size:14,color:"#8B5CF6"})} 新的一天，从制定计划开始吧！`}
      </p>
    </div>`,setTimeout(async()=>{const b=(await me(async()=>{const{default:V}=await import("./auto-BF0bpoqT.js");return{default:V}},[])).default;window._dashChartInstances&&Object.values(window._dashChartInstances).forEach(V=>V.destroy()),window._dashChartInstances={};const H={};z.filter(V=>V.type==="支出").forEach(V=>{H[V.category]=(H[V.category]||0)+(V.amount||0)});const K=Object.keys(H),Je=Object.values(H),ge=document.getElementById("dashFinBar");ge&&(window._dashChartInstances.bar=new b(ge,{type:"bar",data:{labels:["收入","支出","净收支"],datasets:[{label:"金额(元)",data:[F,D,N],backgroundColor:["#10B981","#EF4444",N>=0?"#3B82F6":"#F59E0B"],borderRadius:8,barThickness:36}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(15,23,42,0.04)"}},x:{grid:{display:!1}}}}}));const ye=document.getElementById("dashFinPie");ye&&K.length&&(window._dashChartInstances.pie=new b(ye,{type:"doughnut",data:{labels:K,datasets:[{data:Je,backgroundColor:["#3B82F6","#8B5CF6","#F59E0B","#10B981","#EF4444","#0EA5E9","#FBBF24"],borderWidth:0,hoverOffset:8}]},options:{responsive:!0,cutout:"70%",plugins:{legend:{position:"bottom",labels:{padding:16,usePointStyle:!0,pointStyle:"circle",font:{size:12}}}}}}))},200)}const $e=["purple","blue","green","orange","pink","red"],ke=["file-text","briefcase","book-open","target","code","lightbulb"];function mt(t){return $e[t%$e.length]}function ft(t){return ke[t%ke.length]}function gt(t){return t==="已完成"?100:t==="进行中"?60:30}function yt(t){return t==="已完成"?"done":t==="进行中"?"doing":"todo"}function bt(t){return!t||t==="中"?'<span class="plan-priority p2">P2</span>':t==="高"?'<span class="plan-priority p1">P1</span>':t==="低"?'<span class="plan-priority p3">P3</span>':'<span class="plan-priority p4">P4</span>'}function wt(t){const i={未完成:{cls:"todo",text:"未完成"},进行中:{cls:"doing",text:"进行中"},已完成:{cls:"done",text:"已完成"},拖延中:{cls:"delay",text:"拖延中"},已作废:{cls:"cancel",text:"已作废"}},n=i[t]||i.未完成;return`<span class="plan-status-small ${n.cls}">${n.text}</span>`}function xt(t,i){const a=2*Math.PI*7.5,s=a-t/100*a,d=i?"#10B981":"#3B82F6";return`
    <svg width="18" height="18" viewBox="0 0 18 18" class="plan-progress-ring">
      <circle cx="${18/2}" cy="${18/2}" r="${7.5}" fill="none" stroke="#E2E8F0" stroke-width="3"/>
      <circle cx="${18/2}" cy="${18/2}" r="${7.5}" fill="none" stroke="${d}" stroke-width="3"
        stroke-dasharray="${a}" stroke-dashoffset="${s}" stroke-linecap="round"
        transform="rotate(-90 ${18/2} ${18/2})"/>
    </svg>`}function Mt(t,i,n,l){const e=t.dataset.filterStatus||"全部";let a=i.plans.filter(c=>!c.deleted);e!=="全部"&&(a=a.filter(c=>c.status===e)),l&&(a=a.filter(c=>{var r,k;return P((r=c.createdAt)==null?void 0:r.slice(0,7),"")||P(c.deadline,l)||P((k=c.createdAt)==null?void 0:k.slice(0,7),l)})),a.sort((c,r)=>(r.createdAt||"").localeCompare(c.createdAt||"")),t.innerHTML=`
    <div class="plan-header">
      <div class="plan-header-left">
        <div class="plan-title">计划清单</div>
        <div class="plan-subtitle">管理你的待办计划 · 共 ${a.length} 条</div>
      </div>
      <div class="plan-header-illustration">
        <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="80" y="10" width="100" height="110" rx="10" fill="#EEF2FF" opacity="0.8"/>
          <rect x="80" y="10" width="100" height="20" rx="10" fill="#C7D2FE"/>
          <rect x="95" y="40" width="60" height="6" rx="3" fill="#A5B4FC"/>
          <rect x="95" y="55" width="75" height="6" rx="3" fill="#C7D2FE"/>
          <rect x="95" y="70" width="50" height="6" rx="3" fill="#C7D2FE"/>
          <rect x="95" y="85" width="65" height="6" rx="3" fill="#E0E7FF"/>
          <rect x="95" y="100" width="45" height="6" rx="3" fill="#E0E7FF"/>
          <circle cx="165" cy="75" r="18" fill="#818CF8"/>
          <path d="M157 75 L163 81 L173 71" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <rect x="60" y="20" width="35" height="50" rx="6" fill="#F3E8FF" opacity="0.7"/>
          <rect x="68" y="28" width="22" height="3" rx="1.5" fill="#C084FC"/>
          <rect x="68" y="36" width="18" height="3" rx="1.5" fill="#DDD6FE"/>
          <rect x="68" y="44" width="20" height="3" rx="1.5" fill="#DDD6FE"/>
          <rect x="68" y="52" width="16" height="3" rx="1.5" fill="#EDE9FE"/>
          <circle cx="78" cy="60" r="3" fill="#A855F7"/>
        </svg>
      </div>
    </div>
    <div class="plan-filters">
      <button class="btn btn-outline btn-sm" onclick="window._openPlanModal()">
        ${p("plus",{size:16})} 新增
      </button>
      <div style="flex:1"></div>
      <div id="planStatusFilter"></div>
      <div id="planMonthFilter"></div>
    </div>
    <div id="planList"></div>`,t.dataset.filterStatus=e;const d=q({id:"planStatusSelect",value:e,items:[{value:"全部",label:"全部状态"},{value:"未完成",label:"未完成"},{value:"进行中",label:"进行中"},{value:"已完成",label:"已完成"},{value:"拖延中",label:"拖延中"},{value:"已作废",label:"已作废"}],size:"sm",variant:"text",align:"right",onChange:c=>{window._filterPlans(c)}});document.getElementById("planStatusFilter").appendChild(d.el);const v=[{value:"",label:"全部时间"},...ne().map(c=>({value:c,label:le(c)}))],o=q({id:"planMonthSelect",value:l||"",items:v,size:"sm",variant:"text",align:"right",onChange:c=>{window._filterPlansMonth(c)}});document.getElementById("planMonthFilter").appendChild(o.el),$t(a)}function $t(t,i,n){const l=document.getElementById("planList");if(l){if(!t.length){l.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">${p("clipboard-list",{size:64})}</div>
        <div class="empty-state-text">暂无计划</div>
        <div class="empty-state-hint">点击右上角「新增」创建你的第一条计划吧</div>
      </div>`;return}l.innerHTML=t.map((e,a)=>{const s=gt(e.status);yt(e.status);const d=mt(a),v=ft(a),o=e.status==="已完成";return`
    <div class="swipe-wrap plan-swipe" data-id="${e.id}">
      <div class="swipe-actions">
        <div class="swipe-action-btn edit">
          ${p("edit",{color:"#fff",size:20})}
        </div>
        <div class="swipe-action-btn delete">
          ${p("trash",{color:"#fff",size:20})}
        </div>
      </div>
      <div class="swipe-card plan-card">
        <div class="plan-icon ${d}">
          ${p(v,{color:"#fff",size:26})}
        </div>
        <div class="plan-info">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">
            <span class="plan-name" style="${o?"color:var(--text-secondary);text-decoration:line-through;text-decoration-color:var(--text-tertiary)":""}">${T(e.name)}</span>
            ${bt(e.priority)}
            ${wt(e.status)}
          </div>
          ${e.detail?`<div class="plan-desc">${T(e.detail)}</div>`:""}
          <div class="plan-meta">
            ${e.deadline?`<span class="plan-meta-item">${p("calendar",{size:14,color:"currentColor"})} 截止: ${e.deadline}</span>`:""}
            <span class="plan-meta-item">${xt(s,o)} 进度: ${s}%</span>
          </div>
        </div>
        <div class="plan-actions">
          <div class="dropdown" data-plan-id="${e.id}">
            <button class="btn btn-ghost btn-icon plan-more-btn" onclick="window._togglePlanMenu('${e.id}')">
              ${p("more-horizontal",{size:18})}
            </button>
            <div class="dropdown-menu" id="planMenu_${e.id}">
              <div class="dropdown-item" onclick="window._updatePlanStatus('${e.id}', '未完成')">
                ${p("circle",{size:16,color:"#94A3B8"})} 未完成
              </div>
              <div class="dropdown-item" onclick="window._updatePlanStatus('${e.id}', '进行中')">
                ${p("play-circle",{size:16,color:"#3B82F6"})} 进行中
              </div>
              <div class="dropdown-item" onclick="window._updatePlanStatus('${e.id}', '已完成')">
                ${p("check-circle",{size:16,color:"#10B981"})} 已完成
              </div>
              <div class="dropdown-item" onclick="window._updatePlanStatus('${e.id}', '拖延中')">
                ${p("alert-circle",{size:16,color:"#F59E0B"})} 拖延中
              </div>
              <div class="dropdown-item" onclick="window._updatePlanStatus('${e.id}', '已作废')">
                ${p("x-circle",{size:16,color:"#EF4444"})} 已作废
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`}).join("")+'<div class="plan-empty-footer">已经全部加载完毕</div>',ce(l,{onEdit:e=>window._openPlanModal(e),onDelete:e=>window._deletePlan(e)})}}function Fe(t,i,n,l){const e=t?i.plans.find(d=>d.id===t):null,a=`
    <div class="form-group"><label class="form-label">计划名称 *</label><input id="planName" value="${e?T(e.name):""}" placeholder="输入计划名称"></div>
    <div class="form-group"><label class="form-label">计划详情</label><textarea id="planDetail" rows="3" placeholder="详细描述...">${e?T(e.detail||""):""}</textarea></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">截止时间</label><input type="date" id="planDeadline" value="${e&&e.deadline||""}"></div>
      <div class="form-group"><label class="form-label">状态</label>
        <select id="planStatus">
          <option value="未完成" ${e&&e.status==="未完成"?"selected":""}>未完成</option>
          <option value="进行中" ${e&&e.status==="进行中"?"selected":""}>进行中</option>
          <option value="已完成" ${e&&e.status==="已完成"?"selected":""}>已完成</option>
          <option value="拖延中" ${e&&e.status==="拖延中"?"selected":""}>拖延中</option>
          <option value="已作废" ${e&&e.status==="已作废"?"selected":""}>已作废</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">优先级</label>
        <select id="planPriority">
          <option value="高" ${e&&e.priority==="高"?"selected":""}>P1 - 高</option>
          <option value="中" ${!e||e.priority==="中"?"selected":""}>P2 - 中</option>
          <option value="低" ${e&&e.priority==="低"?"selected":""}>P3 - 低</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">备注</label><input id="planNote" value="${e?T(e.note||""):""}" placeholder="备注信息"></div>
    </div>
    ${e?`<div class="form-row">
      <div class="form-group"><label class="form-label">创建时间</label><div class="form-readonly">${fe(e.createdAt)}</div></div>
      <div class="form-group"></div>
    </div>`:""}`,s=j(e?"编辑计划":"新增计划",a+'<div class="modal-footer"><button class="btn btn-ghost cancel-btn">取消</button><button class="btn btn-primary save-btn">保存</button></div>');s.getEl(".cancel-btn").onclick=s.close,s.getEl(".save-btn").onclick=()=>{const d=s.getEl("#planName").value.trim();if(!d){$("请输入计划名称","warning");return}const v={id:e?e.id:W(),name:d,detail:s.getEl("#planDetail").value.trim(),deadline:s.getEl("#planDeadline").value,status:s.getEl("#planStatus").value,priority:s.getEl("#planPriority").value,note:s.getEl("#planNote").value.trim(),createdAt:e?e.createdAt:_(),updatedAt:B()};if(e){const o=i.plans.findIndex(c=>c.id===t);i.plans[o]=v}else i.plans.unshift(v);n(),s.close(),l(),v.status==="已完成"?oe("done"):$("计划已保存","success")}}function kt(t,i,n,l,e){const a=n.plans.find(s=>s.id===t);a&&(a.status=i,a.updatedAt=B(),i==="已完成"&&(a.deadline=a.deadline||_()),l(),e(),i==="已完成"?oe("done"):$(`状态已更新为：${i}`,"info"))}function Et(t,i,n,l){Z("删除计划","确定要删除这条计划吗？此操作不可撤销。",()=>{const e=i.plans.findIndex(a=>a.id===t);e>=0&&(i.plans[e].deleted=!0,i.plans[e].updatedAt=new Date().toISOString()),n(),l(),$("计划已删除","info")})}let O=null;function Lt(t){const i=document.getElementById(`planMenu_${t}`);if(!i)return;const n=i.closest(".plan-card"),l=n?n.closest(".swipe-card"):null;if(O&&O!==i){O.classList.remove("show");const a=O.closest(".plan-card");if(a){a.classList.remove("menu-open");const s=a.closest(".swipe-card");s&&s.classList.remove("menu-open")}}i.classList.toggle("show");const e=i.classList.contains("show");n&&n.classList.toggle("menu-open",e),l&&l.classList.toggle("menu-open",e),O=e?i:null}function re(){if(O){O.classList.remove("show");const t=O.closest(".plan-card");if(t){t.classList.remove("menu-open");const i=t.closest(".swipe-card");i&&i.classList.remove("menu-open")}O=null}}const Ee=["purple","green","blue","orange","red","pink"],Le=["users","briefcase","droplets","file-text","sprout","coffee"];function St(t){return Ee[t%Ee.length]}function Tt(t){return Le[t%Le.length]}function Ct(t){switch(t.scheduleType){case"daily":return"每天";case"weekday":return"工作日";case"interval":return`每${t.scheduleDays}天`;case"monthly":return`每月${t.scheduleDate}日`;case"once":return"一次性";default:return"每天"}}function At(t,i,n,l){const e=i.autotasks.filter(m=>!m.deleted),a=l,s=_(),d=e.filter(m=>{if((m.completedDates||[]).includes(s))return!1;if(m.scheduleType==="daily")return!0;if(m.scheduleType==="weekday"){const w=new Date().getDay();return w>=1&&w<=5}return m.scheduleType==="once"?m.scheduleDate===s:!0}).length,v=e.reduce((m,E)=>m+(E.completedDates||[]).filter(w=>P(w,a)).length,0),o=e.length,c=o?Math.round(e.filter(m=>m.status==="已完成").length/o*100):0;t.innerHTML=`
    <div class="task-page-header">
      <div class="task-header-left">
        <div class="task-title">定时任务</div>
        <div class="task-subtitle">自动化管理你的日常任务 · 共 ${o} 个</div>
      </div>
    </div>

    <div class="task-stats-row">
      <div class="task-stat-card">
        <div class="task-stat-icon primary">
          ${p("clock",{color:"#fff",size:24})}
        </div>
        <div class="task-stat-info">
          <div class="task-stat-label">今日待办</div>
          <div class="task-stat-value">${d}</div>
        </div>
      </div>
      <div class="task-stat-card">
        <div class="task-stat-icon success">
          ${p("check-circle",{color:"#fff",size:24})}
        </div>
        <div class="task-stat-info">
          <div class="task-stat-label">本月完成</div>
          <div class="task-stat-value">${v}</div>
        </div>
      </div>
      <div class="task-stat-card">
        <div class="task-stat-icon warning">
          ${p("target",{color:"#fff",size:24})}
        </div>
        <div class="task-stat-info">
          <div class="task-stat-label">完成率</div>
          <div class="task-stat-value">${c}%</div>
        </div>
        <div class="task-stat-progress">
          <div class="progress-bar-sm">
            <div class="progress-bar-fill success" style="width:${c}%"></div>
          </div>
        </div>
      </div>
      <div class="task-stat-card">
        <div class="task-stat-icon accent">
          ${p("list-todo",{color:"#fff",size:24})}
        </div>
        <div class="task-stat-info">
          <div class="task-stat-label">任务总数</div>
          <div class="task-stat-value">${o}</div>
        </div>
      </div>
    </div>

    <div class="task-toolbar">
      <button class="btn btn-outline btn-sm" onclick="window._openAutoTaskModal()">
        ${p("plus",{size:16})} 新增
      </button>
      <div style="flex:1"></div>
      <div class="task-filters">
        <div id="taskStatusFilter"></div>
        <div id="taskMonthFilter"></div>
      </div>
    </div>

    <div id="taskList"></div>`;const r=[{value:"全部",label:"全部状态"},{value:"未完成",label:"未完成"},{value:"已完成",label:"已完成"},{value:"即将开始",label:"即将开始"}],k=q({id:"taskStatusSelect",value:t.dataset.taskFilter||"全部",items:r,size:"sm",variant:"text",align:"right",onChange:m=>{t.dataset.taskFilter=m,window._renderCurrentView()}});document.getElementById("taskStatusFilter").appendChild(k.el);const u=[{value:"",label:"全部时间"},...ne().map(m=>({value:m,label:le(m)}))],h=q({id:"taskMonthSelect",value:a||"",items:u,size:"sm",variant:"text",align:"right",onChange:m=>{window._filterTasksMonth(m)}});document.getElementById("taskMonthFilter").appendChild(h.el),It(e,i,n,t)}function It(t,i,n,l,e){const a=document.getElementById("taskList");if(!a)return;const s=l.dataset.taskFilter||"全部";let d=s==="全部"?t:t.filter(o=>o.status===s);if(d=[...d].sort((o,c)=>(o.enabled===!1?1:0)-(c.enabled===!1?1:0)),!d.length){a.innerHTML='<div class="empty-state"><div class="empty-state-icon">⏰</div><div class="empty-state-text">暂无任务</div><div class="empty-state-hint">新增一个定时任务开始自动化管理吧</div></div>';return}const v=_();a.innerHTML=d.map((o,c)=>{const r=(o.completedDates||[]).includes(v),k=St(c),u=Tt(c);return`
    <div class="swipe-wrap" data-id="${o.id}">
      <div class="swipe-actions">
        <div class="swipe-action-btn edit">
          ${p("edit",{color:"#fff",size:20})}
        </div>
        <div class="swipe-action-btn delete">
          ${p("trash",{color:"#fff",size:20})}
        </div>
      </div>
      <div class="swipe-card task-card">
        <div class="task-icon ${k}">
          ${p(u,{color:"#fff",size:26})}
        </div>
        <div class="task-info">
          <div class="task-name">
            ${T(o.name)}
            ${nt(r?"已完成":o.status)}
          </div>
          <div class="task-meta">
            <span class="task-meta-item">
              ${p("clock",{size:14,color:"currentColor"})}
              时间: ${o.scheduleTime}
            </span>
            <span class="task-meta-item">
              ${p("repeat",{size:14,color:"currentColor"})}
              重复: ${Ct(o)}
            </span>
          </div>
        </div>
        <div class="task-actions">
          <div class="task-action-row">
            <button class="btn btn-ghost btn-icon task-execute-btn" onclick="window._checkinTask('${o.id}')">
              ${p("play",{size:16})}
              <span class="task-action-label">立即执行</span>
            </button>
            <div class="task-action-toggle">
              <span class="task-action-label">${o.enabled!==!1?"关闭任务":"开启任务"}</span>
              <div class="toggle ${o.enabled!==!1?"on":""}" onclick="window._toggleTaskEnabled('${o.id}')"></div>
            </div>
          </div>
        </div>
      </div>
    </div>`}).join(""),ce(a,{onEdit:o=>window._openAutoTaskModal(o),onDelete:o=>window._deleteAutoTask(o)})}function zt(t,i,n,l){const e=i.autotasks.find(s=>s.id===t);if(!e)return;e.completedDates||(e.completedDates=[]);const a=_();if(e.completedDates.includes(a)){$("今天已经打卡过了～","warning");return}e.completedDates.push(a),e.status="已完成",n(),l(),He(window.innerWidth/2,window.innerHeight*.4,12),oe("done")}function _t(t,i,n,l){const e=i.autotasks.find(a=>a.id===t);e&&(e.enabled=e.enabled===!1,n(),l(),$(e.enabled?"已开启提醒":"已关闭提醒","info"))}function De(t,i,n,l){const e=t?i.autotasks.find(v=>v.id===t):null,a=`
    <div class="form-group"><label class="form-label">任务名称 *</label><input id="atName" value="${e?T(e.name):""}" placeholder="输入任务名称"></div>
    <div class="form-group"><label class="form-label">任务描述</label><input id="atDesc" value="${e?T(e.description||""):""}" placeholder="描述这个任务"></div>
    <div class="form-row"><div class="form-group"><label class="form-label">执行周期</label><select id="atScheduleType"><option value="daily" ${e&&e.scheduleType==="daily"?"selected":""}>每日</option><option value="weekday" ${e&&e.scheduleType==="weekday"?"selected":""}>工作日</option><option value="interval" ${e&&e.scheduleType==="interval"?"selected":""}>固定间隔天数</option><option value="monthly" ${e&&e.scheduleType==="monthly"?"selected":""}>每月固定日期</option><option value="once" ${e&&e.scheduleType==="once"?"selected":""}>一次性定时</option></select></div>
    <div class="form-group"><label class="form-label">提醒时间</label><input type="time" id="atTime" value="${e?e.scheduleTime:"09:00"}"></div></div>
    <div id="scheduleExtraFields"></div>`,s=j(e?"编辑定时任务":"新增定时任务",a+'<div class="modal-footer"><button class="btn btn-ghost cancel-btn">取消</button><button class="btn btn-primary save-btn">保存</button></div>');function d(){const v=s.getEl("#atScheduleType").value,o=s.getEl("#scheduleExtraFields");v==="interval"?o.innerHTML=`<div class="form-group"><label class="form-label">间隔天数</label><input type="number" id="atDays" value="${e&&e.scheduleDays||"3"}" min="1" max="365"></div>`:v==="monthly"?o.innerHTML=`<div class="form-group"><label class="form-label">每月几号</label><input type="number" id="atDate" value="${e&&e.scheduleDate||"1"}" min="1" max="28"></div>`:v==="once"?o.innerHTML=`<div class="form-group"><label class="form-label">执行日期</label><input type="date" id="atOnceDate" value="${e&&e.scheduleDate||_()}"></div>`:o.innerHTML=""}d(),s.getEl("#atScheduleType").addEventListener("change",d),s.getEl(".cancel-btn").onclick=s.close,s.getEl(".save-btn").onclick=()=>{var r,k,u;const v=s.getEl("#atName").value.trim();if(!v){$("请输入任务名称","warning");return}const o=s.getEl("#atScheduleType").value,c={id:e?e.id:W(),name:v,description:s.getEl("#atDesc").value.trim(),scheduleType:o,scheduleTime:s.getEl("#atTime").value,scheduleDays:o==="interval"?((r=s.getEl("#atDays"))==null?void 0:r.value)||"3":"",scheduleDate:o==="monthly"?((k=s.getEl("#atDate"))==null?void 0:k.value)||"1":o==="once"?((u=s.getEl("#atOnceDate"))==null?void 0:u.value)||_():"",status:e?e.status:"未完成",completedDates:e?e.completedDates||[]:[],enabled:e?e.enabled!==!1:!0,createdAt:e?e.createdAt:B(),updatedAt:B()};e?i.autotasks[i.autotasks.findIndex(h=>h.id===t)]=c:i.autotasks.push(c),n(),s.close(),l(),$("定时任务已保存","success")}}function Ht(t,i,n,l){Z("删除任务","确定要删除这个定时任务吗？",()=>{const e=i.autotasks.findIndex(a=>a.id===t);e>=0&&(i.autotasks[e].deleted=!0,i.autotasks[e].updatedAt=new Date().toISOString()),n(),l(),$("任务已删除","info")})}function Se(t,i,n,l,e,a){if(!i.notifications)return[];const s=new Date,d=_(),v=String(s.getHours()).padStart(2,"0"),o=String(s.getMinutes()).padStart(2,"0"),c=v+":"+o,r=s.getDay(),k=[];return t.autotasks.forEach(u=>{if(u.enabled===!1||(u.completedDates||(u.completedDates=[]),u.completedDates.includes(d)))return;let h=!1;switch(u.scheduleType){case"daily":h=u.scheduleTime===c;break;case"weekday":h=r>=1&&r<=5&&u.scheduleTime===c;break;case"interval":{const m=parseInt(u.scheduleDays)||3,E=u.completedDates.length?u.completedDates[u.completedDates.length-1]:null;h=E?Math.floor((s-new Date(E))/(1e3*60*60*24))>=m&&u.scheduleTime===c:u.scheduleTime===c;break}case"monthly":h=s.getDate()===(parseInt(u.scheduleDate)||1)&&u.scheduleTime===c;break;case"once":h=u.scheduleDate===d&&u.scheduleTime===c;break}h&&u.status!=="已完成"&&(u.status="即将开始",k.push(u))}),k.length&&(n(),l&&l(),k.forEach(u=>{pt(u)}),a&&k.forEach(async(u,h)=>{try{await a.schedule({notifications:[{title:"⏰ 定时任务提醒",body:`「${u.name}」该处理啦！`,id:(parseInt(u.id.replace(/\D/g,"").slice(0,5))||Date.now()%1e5)+h,schedule:{at:new Date(Date.now()+1e3)},sound:"beep.wav",smallIcon:"ic_stat_notification",iconColor:"#9BB5A3",channelId:"task-reminders",channelName:"定时任务提醒",importance:4}]})}catch(m){console.warn("LocalNotification schedule error:",m)}})),k}function Ft(t,i,n,l){let e=i.learning.filter(o=>!o.deleted);l&&(e=e.filter(o=>P(o.studyTime,l))),e.sort((o,c)=>(c.studyTime||"").localeCompare(o.studyTime||"")||(c.createdAt||"").localeCompare(o.createdAt||""));const a=i.learning.filter(o=>!o.deleted).length,s=e.length;t.innerHTML=`
    <div class="learning-page-header">
      <div class="learning-title">学习记录</div>
      <div class="learning-subtitle">记录每一次成长 · 共 ${a} 条</div>
    </div>

    <div class="learning-stats-row">
      <div class="learning-stat-card blue">
        <div class="learning-stat-icon blue">
          ${p("book-open",{color:"#fff",size:24})}
        </div>
        <div class="learning-stat-info">
          <div class="learning-stat-label">本月学习</div>
          <div class="learning-stat-value">${s}<span class="learning-stat-sub">次学习记录</span></div>
        </div>
      </div>
      <div class="learning-stat-card purple">
        <div class="learning-stat-icon purple">
          ${p("graduation-cap",{color:"#fff",size:24})}
        </div>
        <div class="learning-stat-info">
          <div class="learning-stat-label">累计学习</div>
          <div class="learning-stat-value">${a}<span class="learning-stat-sub">条记录</span></div>
        </div>
      </div>
      <div class="learning-stat-card green">
        <div class="learning-stat-icon green">
          ${p("award",{color:"#fff",size:24})}
        </div>
        <div class="learning-stat-info">
          <div class="learning-stat-label">连续学习</div>
          <div class="learning-stat-value">${Math.min(s,7)} <span class="learning-stat-rate">天</span><span class="learning-stat-sub">继续加油</span></div>
        </div>
      </div>
    </div>

    <div class="learning-toolbar">
      <button class="btn btn-outline btn-sm" onclick="window._openLearningModal()">
        ${p("plus",{size:16})} 新增
      </button>
      <div style="flex:1"></div>
      <div class="learning-filter-bar">
        <div id="learnMonthFilter"></div>
      </div>
    </div>

    <div id="learnList"></div>`;const d=[{value:"",label:"全部时间"},...ne().map(o=>({value:o,label:le(o)}))],v=q({id:"learnMonthSelect",value:l||"",items:d,size:"sm",variant:"text",align:"right",onChange:o=>{window._filterLearnMonth(o)}});document.getElementById("learnMonthFilter").appendChild(v.el),Dt(e)}function Dt(t){const i=document.getElementById("learnList");if(i){if(!t.length){i.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">${p("book-open",{size:48})}</div>
        <div class="empty-state-text">暂无学习记录</div>
        <div class="empty-state-hint">记录你的学习过程，见证每一天的成长</div>
      </div>`;return}i.innerHTML=t.map(n=>`
    <div class="swipe-wrap" data-id="${n.id}">
      <div class="swipe-actions">
        <div class="swipe-action-btn edit">
          ${p("edit",{color:"#fff",size:20})}
        </div>
        <div class="swipe-action-btn delete">
          ${p("trash",{color:"#fff",size:20})}
        </div>
      </div>
      <div class="swipe-card learning-card">
        <div class="learning-card-icon">
          ${p("book-open",{color:"#fff",size:22})}
        </div>
        <div class="learning-card-content">
          <div class="learning-card-title">${T(n.topic)}</div>
          <div class="learning-card-desc">${T((n.content||"").slice(0,100))}</div>
          ${n.images&&n.images.length?`
          <div class="learning-card-images">
            ${n.images.slice(0,3).map(l=>`<img src="${l}" class="learning-card-img">`).join("")}
            ${n.images.length>3?`<span class="learning-card-more">+${n.images.length-3}</span>`:""}
          </div>`:""}
          <div class="learning-card-meta">
            <span class="learning-meta-item">
              ${p("calendar",{size:12})}
              ${n.studyTime}
            </span>
            ${n.result?`
            <span class="learning-meta-item">
              ${p("award",{size:12})}
              ${T(n.result)}
            </span>`:""}
          </div>
        </div>
        <div class="learning-card-arrow">
          ${p("chevron-right",{size:18,color:"var(--text-tertiary)"})}
        </div>
      </div>
    </div>`).join(""),ce(i,{onEdit:n=>window._openLearningModal(n),onDelete:n=>window._deleteLearning(n),onClick:n=>window._openLearningModal(n)})}}function Pe(t,i,n,l){const e=t?i.learning.find(o=>o.id===t):null;let a=e&&e.images?[...e.images]:[],s=`
    <div class="form-group">
      <label class="form-label">学习主题 *</label>
      <input id="lTopic" value="${e?T(e.topic):""}" placeholder="今天学了什么？">
    </div>
    <div class="form-group">
      <label class="form-label">学习内容</label>
      <textarea id="lContent" rows="4" placeholder="详细描述你的学习内容...">${e?T(e.content||""):""}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">学习成果</label>
      <input id="lResult" value="${e?T(e.result||""):""}" placeholder="有什么收获？">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">学习时间</label>
        <input type="date" id="lTime" value="${e?e.studyTime:_()}">
      </div>
      <div class="form-group">
        <label class="form-label">备注</label>
        <input id="lNote" value="${e?T(e.note||""):""}" placeholder="备注">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">配图</label>
      <div class="img-upload-area" id="imgUploadArea">
        ${p("image",{size:24})} 点击或拖拽上传图片
      </div>
      <input type="file" id="imgInput" accept="image/*" multiple style="display:none">
      <div class="img-preview" id="imgPreview"></div>
    </div>`;const d=j(e?"编辑学习记录":"新增学习记录",s+`
    <div class="modal-footer">
      <button class="btn btn-ghost cancel-btn">取消</button>
      <button class="btn btn-primary save-btn">保存</button>
    </div>`);function v(){d.getEl("#imgPreview").innerHTML=a.map((o,c)=>`
      <div class="img-preview-item">
        <img src="${o}">
        <button class="img-remove" onclick="event.stopPropagation();window._removeLearnImg(${c})">×</button>
      </div>`).join("")}v(),d.getEl("#imgUploadArea").onclick=()=>d.getEl("#imgInput").click(),d.getEl("#imgInput").onchange=function(){Array.from(this.files).forEach(o=>{const c=new FileReader;c.onload=r=>{a.push(r.target.result),v()},c.readAsDataURL(o)}),this.value=""},window._removeLearnImg=o=>{a.splice(o,1),v()},d.getEl(".cancel-btn").onclick=d.close,d.getEl(".save-btn").onclick=()=>{const o=d.getEl("#lTopic").value.trim();if(!o){$("请输入学习主题","warning");return}const c={id:e?e.id:W(),topic:o,content:d.getEl("#lContent").value.trim(),result:d.getEl("#lResult").value.trim(),studyTime:d.getEl("#lTime").value,note:d.getEl("#lNote").value.trim(),images:[...a],createdAt:e?e.createdAt:B(),updatedAt:B()};e?i.learning[i.learning.findIndex(r=>r.id===t)]=c:i.learning.unshift(c),n(),d.close(),l(),$("学习记录已保存","success"),oe()}}function Pt(t,i,n,l){Z("删除记录","确定要删除这条学习记录吗？此操作不可撤销。",()=>{const e=i.learning.findIndex(a=>a.id===t);e>=0&&(i.learning[e].deleted=!0,i.learning[e].updatedAt=new Date().toISOString()),n(),l(),$("学习记录已删除","info")})}const Bt=["heart","book-open","dumbbell","coffee","sprout","sun","book","flag","target","award"],Nt=["frown-icon","ban","cloud","moon","flame","alert-triangle","x-circle","skip-forward","pause","minus-circle"];function Vt(t){return t.type==="正向"?"primary":"danger"}function Ot(t,i){const n=t.type==="正向"?Bt:Nt;return n[i%n.length]}function Rt(t,i,n,l){let e=i.habits.filter(o=>!o.deleted);l!=="全部"&&(e=e.filter(o=>o.type===l));const a=i.habits.filter(o=>!o.deleted&&o.type==="正向").length,s=i.habits.filter(o=>!o.deleted&&o.type==="负面").length,d=a+s,v=d?Math.round(e.reduce((o,c)=>o+(c.rating||0),0)/d*10)/10:0;t.innerHTML=`
    <div class="habit-page-header">
      <div class="habit-header-left">
        <div class="habit-title">习惯追踪</div>
        <div class="habit-header-desc">研究表明，坚持21天可以初步养成一个习惯，坚持90天则会成为稳定的习惯。加油！</div>
      </div>
    </div>

    <div class="habit-stats-row">
      <div class="habit-stat-card">
        <div class="habit-stat-icon primary">
          ${p("heart",{color:"#fff",size:22})}
        </div>
        <div class="habit-stat-info">
          <div class="habit-stat-label">正向习惯</div>
          <div class="habit-stat-value">${a}</div>
        </div>
      </div>
      <div class="habit-stat-card">
        <div class="habit-stat-icon danger">
          ${p("alert-triangle",{color:"#fff",size:22})}
        </div>
        <div class="habit-stat-info">
          <div class="habit-stat-label">负面习惯</div>
          <div class="habit-stat-value">${s}</div>
        </div>
      </div>
      <div class="habit-stat-card">
        <div class="habit-stat-icon success">
          ${p("star",{color:"#fff",size:22})}
        </div>
        <div class="habit-stat-info">
          <div class="habit-stat-label">平均评分</div>
          <div class="habit-stat-value">${v}<span class="habit-stat-unit">/5.0</span></div>
        </div>
      </div>
    </div>

    <div class="habit-toolbar">
      <button class="btn btn-outline btn-sm" onclick="window._openHabitModal()">
        ${p("plus",{size:16})} 新增
      </button>
      <div style="flex:1"></div>
      <div class="habit-type-tabs">
        <button class="habit-type-tab ${l==="全部"?"active":""}" onclick="window._filterHabitType('全部')">
          全部
        </button>
        <button class="habit-type-tab ${l==="正向"?"active":""}" onclick="window._filterHabitType('正向')">
          正向
        </button>
        <button class="habit-type-tab ${l==="负面"?"active":""}" onclick="window._filterHabitType('负面')">
          负面
        </button>
      </div>
    </div>

    <div id="habitList"></div>`,qt(e)}function qt(t,i,n){const l=document.getElementById("habitList");if(l){if(!t.length){l.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">${p("sprout",{size:48})}</div>
        <div class="empty-state-text">暂无习惯记录</div>
        <div class="empty-state-hint">添加一个习惯开始追踪吧</div>
      </div>`;return}l.innerHTML=t.map((e,a)=>{const s=e.type==="正向",d=Vt(e),v=Ot(e,a);return`
    <div class="swipe-wrap habit-swipe" data-id="${e.id}">
      <div class="swipe-actions">
        <div class="swipe-action-btn edit">
          ${p("edit",{color:"#fff",size:20})}
        </div>
        <div class="swipe-action-btn delete">
          ${p("trash",{color:"#fff",size:20})}
        </div>
      </div>
      <div class="swipe-card habit-card">
        <div class="habit-card-icon ${d}">
          ${p(v,{color:"#fff",size:20})}
        </div>
        <div class="habit-card-info">
          <div class="habit-card-top">
            <div class="habit-card-name">${T(e.name)}</div>
            <span class="tag ${s?"tag-positive":"tag-negative"}">${T(e.type)}</span>
          </div>
          ${e.record?`<div class="habit-card-record">${T(e.record)}</div>`:""}
        </div>
        <div class="habit-card-bottom">
          <div class="habit-card-rating">
            <div class="star-rating-mini">
              ${[1,2,3,4,5].map(o=>`<span class="star-mini ${o<=e.rating?"active":""}" onclick="event.stopPropagation();window._updateHabitRating('${e.id}',${o})"></span>`).join("")}
            </div>
            <span class="habit-rating-text">${e.rating||0} 星</span>
          </div>
          <div class="habit-card-date">
            ${p("calendar",{size:12})} ${fe(e.createdAt)}
          </div>
        </div>
      </div>
    </div>`}).join(""),ce(l,{onEdit:e=>window._openHabitModal(e),onDelete:e=>window._deleteHabit(e)})}}function jt(t,i,n,l,e){const a=n.habits.find(s=>s.id===t);a&&(a.rating=i,l(),e(),$(`评分已更新为 ${i} 星`,"success","⭐"))}function Be(t,i,n,l){const e=t?i.habits.find(d=>d.id===t):null,a=`
    <div class="form-group">
      <label class="form-label">习惯名称 *</label>
      <input id="hName" value="${e?T(e.name):""}" placeholder="输入习惯名称">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">习惯类型</label>
        <select id="hType">
          <option value="正向" ${e&&e.type==="正向"?"selected":""}>正向习惯</option>
          <option value="负面" ${e&&e.type==="负面"?"selected":""}>负面习惯</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">星级评分</label>
        <div id="hRatingStars" class="star-rating" style="font-size:28px">
          ${[1,2,3,4,5].map(d=>`<span class="star ${(e?e.rating:3)>=d?"active":""}" data-r="${d}">★</span>`).join("")}
        </div>
        <input type="hidden" id="hRating" value="${e?e.rating:3}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">养成记录</label>
      <textarea id="hRecord" rows="3" placeholder="记录习惯养成过程...">${e?T(e.record||""):""}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">备注</label>
      <input id="hNote" value="${e?T(e.note||""):""}" placeholder="备注">
    </div>`,s=j(e?"编辑习惯":"新增习惯",a+`
    <div class="modal-footer">
      <button class="btn btn-ghost cancel-btn">取消</button>
      <button class="btn btn-primary save-btn">保存</button>
    </div>`);s.getAll("#hRatingStars .star").forEach(d=>{d.onclick=function(){const v=parseInt(this.dataset.r);s.getEl("#hRating").value=v,s.getAll("#hRatingStars .star").forEach((o,c)=>{o.classList.toggle("active",c<v)})}}),s.getEl(".cancel-btn").onclick=s.close,s.getEl(".save-btn").onclick=()=>{const d=s.getEl("#hName").value.trim();if(!d){$("请输入习惯名称","warning");return}const v={id:e?e.id:W(),name:d,type:s.getEl("#hType").value,rating:parseInt(s.getEl("#hRating").value),record:s.getEl("#hRecord").value.trim(),note:s.getEl("#hNote").value.trim(),createdAt:e?e.createdAt:B(),updatedAt:B()};e?i.habits[i.habits.findIndex(o=>o.id===t)]=v:i.habits.push(v),n(),s.close(),l(),$("习惯已保存","success")}}function Zt(t,i,n,l){Z("删除习惯","确定要删除这个习惯吗？",()=>{const e=i.habits.findIndex(a=>a.id===t);e>=0&&(i.habits[e].deleted=!0,i.habits[e].updatedAt=new Date().toISOString()),n(),l(),$("习惯已删除","info")})}let ue={records:[]};function Ut(){const t=document.getElementById("finChartSection");t&&(ue.records.length&&Ve(ue.records),t.scrollIntoView({behavior:"smooth",block:"start"}))}const Xt={餐饮:"utensils",交通:"car",购物:"shopping-cart",娱乐:"smile-icon",居住:"home",医疗:"stethoscope",教育:"graduation-cap",通讯:"phone-call",运动:"dumbbell",旅行:"plane",工资:"briefcase",奖金:"gift",投资:"trending-up",兼职:"briefcase",其他收入:"wallet",其他支出:"file-text"};function Jt(t){return Xt[t]||"wallet"}const Gt={餐饮:"orange",交通:"blue",购物:"pink",娱乐:"purple",居住:"green",医疗:"red",教育:"purple",通讯:"blue",运动:"green",旅行:"orange",工资:"green",奖金:"orange",投资:"blue",兼职:"purple",其他收入:"green",其他支出:"red"};function Yt(t){return Gt[t]||"purple"}function Ne(t,i,n,l){const e=l;let a=i.finance.filter(f=>!f.deleted&&P(f.date,e));a.sort((f,L)=>(L.date||"").localeCompare(f.date||"")||(L.createdAt||"").localeCompare(f.createdAt||""));const s=a.filter(f=>f.type==="收入").reduce((f,L)=>f+(L.amount||0),0),d=a.filter(f=>f.type==="支出").reduce((f,L)=>f+(L.amount||0),0),v=s-d,o=a.length;ue.records=a;const c=()=>Ne(t,i,n,e);t.innerHTML=`
    <div class="finance-page-header">
      <div class="finance-title">账本清单</div>
      <div class="finance-subtitle">每一笔收支都值得被记录 · 共 ${o} 条</div>
    </div>
    <div class="finance-top-bar">
      <div class="finance-top-info">
        <div class="finance-top-month">
          ${p("calendar",{size:16,color:"var(--text-secondary)"})}
          <div id="finMonthFilter" class="finance-top-select"></div>
        </div>
        <div class="finance-top-stats">
          <div class="finance-top-stat">
            <span class="finance-top-stat-label">收入</span>
            <span class="finance-top-stat-value income">¥${s.toLocaleString()}</span>
          </div>
          <div class="finance-top-divider"></div>
          <div class="finance-top-stat">
            <span class="finance-top-stat-label">支出</span>
            <span class="finance-top-stat-value expense">¥${d.toLocaleString()}</span>
          </div>
          <div class="finance-top-divider"></div>
          <div class="finance-top-stat">
            <span class="finance-top-stat-label">结余</span>
            <span class="finance-top-stat-value ${v>=0?"income":"expense"}">${v>=0?"+":""}¥${v.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <button class="btn btn-primary finance-add-btn" onclick="window._openFinanceModal()">
        ${p("plus",{size:18})} 记一笔
      </button>
    </div>

    <div class="finance-section-title" style="margin:20px 0 12px 0">
      <span>收支明细</span>
      <div class="finance-date-filter">
        <button class="btn btn-text btn-sm" id="finChartToggle" onclick="window._toggleFinanceCharts()">
          ${p("bar-chart",{size:16})} 数据分析
        </button>
        <div id="finDayFilter" class="finance-day-select"></div>
      </div>
    </div>
    <div id="finList"></div>

    <div class="finance-chart-section" id="finChartSection">
      <div class="finance-chart-row">
        <div class="chart-card">
          <div class="chart-card-title">
            ${p("pie-chart",{size:16,color:"var(--primary)"})}
            支出分类占比
          </div>
          <div class="chart-wrap"><canvas id="finPieChart" style="max-height:240px"></canvas></div>
        </div>
        <div class="chart-card">
          <div class="chart-card-title">
            ${p("bar-chart",{size:16,color:"var(--primary)"})}
            每日收支趋势
          </div>
          <div class="chart-wrap"><canvas id="finBarChart" style="max-height:240px"></canvas></div>
        </div>
      </div>
    </div>`;const r=ne().map(f=>({value:f,label:le(f)})),k=q({id:"finMonthSelect",value:e,items:r,variant:"text",onChange:f=>{window._filterFinMonth(f)}});document.getElementById("finMonthFilter").appendChild(k.el);const u=parseInt(e.slice(0,4)),h=parseInt(e.slice(5,7)),m=new Date(u,h,0).getDate(),E=_(),w=parseInt(E.slice(0,4)),M=parseInt(E.slice(5,7)),C=parseInt(E.slice(8,10));let x=m;u===w&&h===M?x=C:(u>w||u===w&&h>M)&&(x=0);const A=[{value:"",label:"全部"}];for(let f=1;f<=x;f++){const L=f.toString().padStart(2,"0"),z=`${e}-${L}`;A.push({value:z,label:`${f}号`})}const y=q({id:"finDaySelect",value:"",items:A,variant:"minimal",align:"right",onChange:f=>{let L=a;f&&(L=a.filter(z=>z.date===f)),Te(L,i,n,c)}});document.getElementById("finDayFilter").appendChild(y.el),Te(a,i,n,c),a.length&&Ve(a)}function Te(t,i,n,l){const e=document.getElementById("finList");if(!e)return;if(!t.length){e.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">${p("wallet",{size:48})}</div>
        <div class="empty-state-text">本月暂无收支记录</div>
        <div class="empty-state-hint">点击上方"记一笔"开始记录</div>
      </div>`;return}const a={};t.forEach(d=>{a[d.date]||(a[d.date]=[]),a[d.date].push(d)});const s=Object.keys(a).sort((d,v)=>v.localeCompare(d));e.innerHTML=s.map(d=>{const v=a[d];return`
      <div class="finance-day-group">
        <div class="finance-day-header">
          <span class="finance-day-date">${d===_()?"今天":d}（共${v.length}笔）</span>
        </div>
        <div class="finance-day-records">
          ${v.map(c=>{const r=c.type==="收入",k=Yt(c.category),u=Jt(c.category);return`
            <div class="finance-record-swipe" data-id="${c.id}">
              <div class="finance-record-actions">
                <div class="finance-record-edit-btn" data-edit-id="${c.id}">
                  ${p("edit",{color:"#fff",size:20})}
                </div>
                <div class="finance-record-delete-btn" data-delete-id="${c.id}">
                  ${p("trash",{color:"#fff",size:20})}
                </div>
              </div>
              <div class="finance-record-card" data-card-id="${c.id}">
                <div class="finance-record-icon ${k}">
                  ${p(u,{color:"#fff",size:20})}
                </div>
                <div class="finance-record-info">
                  <div class="finance-record-title">
                    ${T(c.scene||c.category)}
                    <span class="tag ${r?"tag-income":"tag-expense"}">${T(c.category)}</span>
                  </div>
                  ${c.note?`<div class="finance-record-meta"><span class="finance-record-meta-item">${p("file-text",{size:12})} ${T(c.note)}</span></div>`:""}
                </div>
                <div class="finance-record-amount ${r?"income":"expense"}">
                  ${r?"+":"-"}¥${(c.amount||0).toLocaleString()}
                </div>
              </div>
            </div>`}).join("")}
        </div>
      </div>`}).join(""),Wt(e,i,n,l)}function Wt(t,i,n,l){const e=t.querySelectorAll(".finance-record-swipe");let a=null,s=0,d=0;const v=6;function o(){t.querySelectorAll(".finance-record-card.swiped").forEach(c=>{c.classList.remove("swiped"),c.style.transform=""}),a=null}e.forEach(c=>{const r=c.querySelector(".finance-record-card"),k=c.querySelector(".finance-record-edit-btn"),u=c.querySelector(".finance-record-delete-btn"),h=c.dataset.id;k.addEventListener("click",x=>{x.stopPropagation(),o(),window._openFinanceModal(h)}),u.addEventListener("click",x=>{x.stopPropagation(),o(),qe(h,i,n,l)});let m=!1,E=!1,w=!1;r.addEventListener("touchstart",x=>{s=x.touches[0].clientX,d=s,m=!1,r.style.transition="none"},{passive:!0}),r.addEventListener("touchmove",x=>{d=x.touches[0].clientX;const A=d-s;if(Math.abs(A)>v&&(m=!0,w=!0),m){a&&a!==r&&(a.classList.remove("swiped"),a.style.transform="");let y=A;r.classList.contains("swiped")&&(y=-144+A),y>0&&(y=0),y<-164&&(y=-164),r.style.transform=`translateX(${y}px)`}},{passive:!0}),r.addEventListener("touchend",()=>{if(r.style.transition="",!m)return;const x=d-s;let A=x;r.classList.contains("swiped")&&(A=-144+x),A<-144/3?(r.classList.add("swiped"),r.style.transform="",a=r):(r.classList.remove("swiped"),r.style.transform="",a===r&&(a=null)),m=!1,setTimeout(()=>{w=!1},300)});let M=0,C=0;r.addEventListener("mousedown",x=>{if(x.button!==0)return;M=x.clientX,C=M,E=!1,r.style.transition="none",r.style.cursor="grabbing";const A=f=>{C=f.clientX;const L=C-M;if(Math.abs(L)>v&&(E=!0,w=!0),E){a&&a!==r&&(a.classList.remove("swiped"),a.style.transform="");let z=L;r.classList.contains("swiped")&&(z=-144+L),z>0&&(z=0),z<-164&&(z=-164),r.style.transform=`translateX(${z}px)`}},y=()=>{if(r.style.transition="",r.style.cursor="",document.removeEventListener("mousemove",A),document.removeEventListener("mouseup",y),!E)return;const f=C-M;let L=f;r.classList.contains("swiped")&&(L=-144+f),L<-144/3?(r.classList.add("swiped"),r.style.transform="",a=r):(r.classList.remove("swiped"),r.style.transform="",a===r&&(a=null)),E=!1,setTimeout(()=>{w=!1},300)};document.addEventListener("mousemove",A),document.addEventListener("mouseup",y)}),r.addEventListener("click",x=>{if(w){x.preventDefault(),x.stopPropagation(),w=!1;return}r.classList.contains("swiped")?(x.preventDefault(),x.stopPropagation(),o()):window._openFinanceModal(h)})}),document.addEventListener("touchstart",c=>{c.target.closest(".finance-record-swipe")||o()},{passive:!0}),document.addEventListener("mousedown",c=>{c.target.closest(".finance-record-swipe")||o()})}function Ve(t){setTimeout(async()=>{const i=(await me(async()=>{const{default:c}=await import("./auto-BF0bpoqT.js");return{default:c}},[])).default;window._finChartInstances&&Object.values(window._finChartInstances).forEach(c=>c.destroy()),window._finChartInstances={};const n=t.filter(c=>c.type==="支出"),l={};n.forEach(c=>{l[c.category]=(l[c.category]||0)+(c.amount||0)});const e=Object.keys(l),a=Object.values(l),s=document.getElementById("finPieChart");if(s&&e.length)window._finChartInstances.pie=new i(s,{type:"doughnut",data:{labels:e,datasets:[{data:a,backgroundColor:["#3B82F6","#8B5CF6","#F59E0B","#10B981","#EF4444","#06B6D4","#EC4899","#F97316"],borderWidth:0,hoverOffset:8}]},options:{responsive:!0,cutout:"65%",plugins:{legend:{position:"bottom",labels:{font:{size:11,weight:"500"},padding:12,usePointStyle:!0,pointStyle:"circle"}}}}});else if(s){const c=s.getContext("2d");c.font="14px -apple-system, BlinkMacSystemFont, sans-serif",c.fillStyle="#8C8C8C",c.textAlign="center",c.fillText("本月暂无支出数据",150,130)}const d={};t.forEach(c=>{d[c.date]||(d[c.date]={income:0,expense:0}),c.type==="收入"?d[c.date].income+=c.amount||0:d[c.date].expense+=c.amount||0});const v=Object.keys(d).sort(),o=document.getElementById("finBarChart");o&&v.length&&(window._finChartInstances.bar=new i(o,{type:"bar",data:{labels:v.map(c=>c.slice(8)+"日"),datasets:[{label:"收入",data:v.map(c=>d[c].income),backgroundColor:"#10B981",borderRadius:6,barThickness:16},{label:"支出",data:v.map(c=>d[c].expense),backgroundColor:"#EF4444",borderRadius:6,barThickness:16}]},options:{responsive:!0,plugins:{legend:{position:"bottom",labels:{font:{size:11,weight:"500"},boxWidth:12,padding:12,usePointStyle:!0,pointStyle:"circle"}}},scales:{x:{grid:{display:!1},ticks:{font:{size:10}}},y:{grid:{color:"rgba(0,0,0,0.05)"},ticks:{font:{size:10}}}}}}))},300)}function Oe(t,i,n,l){t&&i.finance.find(e=>e.id===t),Re(t,i,n,l,null,null)}function Kt(t,i,n,l,e){Re(null,n,l,e,t,i)}function Re(t,i,n,l,e,a){const s=t?i.finance.find(u=>u.id===t):null,d=e||(s?s.type:"支出"),v=a||(s?s.category:Me[d][0]);let o=s&&s.image?s.image:"",c=`
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">类型</label>
        <select id="fType">
          <option value="支出" ${d==="支出"?"selected":""}>支出</option>
          <option value="收入" ${d==="收入"?"selected":""}>收入</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">金额 *</label>
        <input type="number" id="fAmount" value="${s?s.amount:""}" placeholder="0.00" step="0.01" min="0">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">分类</label>
        <select id="fCategory"></select>
      </div>
      <div class="form-group">
        <label class="form-label">日期</label>
        <input type="date" id="fDate" value="${s?s.date:_()}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">消费场景</label>
      <input id="fScene" value="${s?T(s.scene||""):""}" placeholder="描述这笔收支">
    </div>
    <div class="form-group">
      <label class="form-label">备注</label>
      <input id="fNote" value="${s?T(s.note||""):""}" placeholder="备注信息">
    </div>
    <div class="form-group">
      <label class="form-label">图片凭证（可选）</label>
      <div class="img-upload-area" id="finImgUpload">
        ${p("image",{size:24})} 点击上传凭证
      </div>
      <input type="file" id="finImgInput" accept="image/*" style="display:none">
      <div class="img-preview" id="finImgPreview">
        ${o?`<div class="img-preview-item"><img src="${o}"><button class="img-remove" onclick="event.stopPropagation();window._clearFinImg()">×</button></div>`:""}
      </div>
    </div>`;const r=j(s?"编辑收支记录":"新增收支记录",c+`
    <div class="modal-footer">
      <button class="btn btn-ghost cancel-btn">取消</button>
      <button class="btn btn-primary save-btn">保存</button>
    </div>`);function k(){const u=r.getEl("#fType").value,h=r.getEl("#fCategory");h.innerHTML=Me[u].map(m=>`<option value="${m}" ${s&&s.category===m||!s&&m===v&&u===d?"selected":""}>${m}</option>`).join("")}k(),r.getEl("#fType").addEventListener("change",k),r.getEl("#finImgUpload").onclick=()=>r.getEl("#finImgInput").click(),r.getEl("#finImgInput").onchange=function(){const u=this.files[0];if(u){const h=new FileReader;h.onload=m=>{o=m.target.result,r.getEl("#finImgPreview").innerHTML=`<div class="img-preview-item"><img src="${o}"><button class="img-remove" onclick="event.stopPropagation();window._clearFinImg()">×</button></div>`,window._getFinImg=()=>o},h.readAsDataURL(u)}},window._clearFinImg=()=>{o="",r.getEl("#finImgPreview").innerHTML="",window._getFinImg=()=>""},window._getFinImg=()=>o,r.getEl(".cancel-btn").onclick=()=>{window._clearFinImg=null,window._getFinImg=null,r.close()},r.getEl(".save-btn").onclick=()=>{const u=parseFloat(r.getEl("#fAmount").value);if(!u||u<=0){$("请输入有效金额","warning");return}o=window._getFinImg?window._getFinImg():"";const h={id:s?s.id:W(),type:r.getEl("#fType").value,category:r.getEl("#fCategory").value,amount:u,date:r.getEl("#fDate").value,scene:r.getEl("#fScene").value.trim(),note:r.getEl("#fNote").value.trim(),image:o,createdAt:s?s.createdAt:B(),updatedAt:B()};s?i.finance[i.finance.findIndex(m=>m.id===t)]=h:i.finance.unshift(h),n(),r.close(),l(),$("收支记录已保存","success"),h.type==="支出"&&u>=1e3&&$(`大额支出 ¥${u.toLocaleString()}，记得合理消费哦～`,"warning","alert-circle"),h.type==="收入"&&u>=5e3&&$(`收入 ¥${u.toLocaleString()}！继续加油`,"success","trophy"),window._clearFinImg=null,window._getFinImg=null}}function qe(t,i,n,l){Z("删除记录","确定要删除这条收支记录吗？",()=>{const e=i.finance.findIndex(a=>a.id===t);e>=0&&(i.finance[e].deleted=!0,i.finance[e].updatedAt=new Date().toISOString()),n(),l(),$("记录已删除","info")})}function Qt(){try{const t=localStorage.getItem(ae);return t&&JSON.parse(t).url||""}catch{return""}}function ea(t,i,n,l,e,a){t.innerHTML=`
    <div class="settings-header">
      <div class="settings-title">设置中心</div>
      <div class="settings-subtitle">个性化配置你的工作台</div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">通用设置</div>
      <div class="settings-card">
        <div class="settings-item">
          <div class="settings-item-icon purple">
            ${p("bell",{color:"#fff",size:18})}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">消息提醒</div>
            <div class="settings-item-desc">定时任务到期自动弹窗提醒</div>
          </div>
          <div class="toggle ${n.notifications?"on":""}" id="toggleNotif"></div>
        </div>
        <div class="settings-item">
          <div class="settings-item-icon blue">
            ${p("volume-2",{color:"#fff",size:18})}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">提醒音量</div>
            <div class="settings-item-desc">当前：${n.reminderVolume}%</div>
          </div>
          <input type="range" min="0" max="100" value="${n.reminderVolume}" class="settings-slider" id="volumeSlider">
        </div>
        <div class="settings-item">
          <div class="settings-item-icon pink">
            ${p("palette",{color:"#fff",size:18})}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">当前主题</div>
            <div class="settings-item-desc">柔光治愈</div>
          </div>
          <span class="tag tag-done">已启用</span>
        </div>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">同步设置</div>
      <div class="settings-card">
        <div class="settings-item">
          <div class="settings-item-icon blue">
            ${p("link",{color:"#fff",size:18})}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">电脑服务器地址</div>
            <div class="settings-item-desc">手机与电脑连同一 WiFi，填写电脑 IP 后即可同步</div>
          </div>
        </div>
        <div class="settings-sync-box">
          <input type="text" class="settings-input" id="serverUrlInput" placeholder="例如 192.168.1.100:3001" value="${Qt()}">
          <div class="settings-sync-actions">
            <button class="btn btn-ghost btn-sm" id="btnTestServer">测试连接</button>
            <button class="btn btn-primary btn-sm" id="btnSaveServer">保存地址</button>
          </div>
        </div>
        <div class="settings-sync-hint" id="serverSyncHint">未填写地址时，数据仅保存在本机（App 内不会丢失）</div>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">数据管理</div>
      <div class="settings-card">
        <div class="settings-item">
          <div class="settings-item-icon green">
            ${p("cloud",{color:"#fff",size:18})}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">自动同步</div>
            <div class="settings-item-desc">数据实时保存到云端</div>
          </div>
          <div class="toggle ${n.autoSync?"on":""}" id="toggleSync"></div>
        </div>
        <div class="settings-item settings-item-clickable" id="btnExport">
          <div class="settings-item-icon blue">
            ${p("download",{color:"#fff",size:18})}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">导出数据备份</div>
          </div>
          <div class="settings-item-arrow">${p("chevron-right",{size:16,color:"#C7C7CC"})}</div>
        </div>
        <div class="settings-item settings-item-clickable" id="btnImport">
          <div class="settings-item-icon orange">
            ${p("upload",{color:"#fff",size:18})}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">导入数据恢复</div>
          </div>
          <div class="settings-item-arrow">${p("chevron-right",{size:16,color:"#C7C7CC"})}</div>
        </div>
        <input type="file" id="importFileInput" accept=".json" style="display:none">
      </div>
      <div class="settings-card settings-card-separated">
        <div class="settings-item settings-item-clickable" id="btnSyncPush">
          <div class="settings-item-icon purple">
            ${p("upload",{color:"#fff",size:18})}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">上传数据到云端</div>
          </div>
          <div class="settings-item-arrow">${p("chevron-right",{size:16,color:"#C7C7CC"})}</div>
        </div>
        <div class="settings-item settings-item-clickable" id="btnSyncPull">
          <div class="settings-item-icon pink">
            ${p("download",{color:"#fff",size:18})}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">从云端拉取数据</div>
          </div>
          <div class="settings-item-arrow">${p("chevron-right",{size:16,color:"#C7C7CC"})}</div>
        </div>
      </div>
      <div class="settings-card settings-card-separated">
        <div class="settings-item settings-item-clickable settings-item-danger" id="btnReset">
          <div class="settings-item-icon red">
            ${p("rotate-ccw",{color:"#fff",size:18})}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">重置所有数据</div>
          </div>
          <div class="settings-item-arrow">${p("chevron-right",{size:16,color:"#C7C7CC"})}</div>
        </div>
      </div>
    </div>

    <div class="settings-footer">星河浅滩 v1.0 · 用心管理每一天</div>`,document.getElementById("toggleNotif").onclick=s=>{s.stopPropagation(),n.notifications=!n.notifications,e(),a(),$(`消息提醒：${n.notifications?"已开启":"已关闭"}`,"info")},document.getElementById("toggleSync").onclick=s=>{s.stopPropagation(),n.autoSync=!n.autoSync,e(),a(),$(`自动同步：${n.autoSync?"已开启":"已关闭"}`,"info")},document.getElementById("volumeSlider").onchange=function(s){s.stopPropagation(),n.reminderVolume=parseInt(this.value),e()},document.getElementById("btnExport").onclick=()=>window._exportData(),document.getElementById("btnImport").onclick=()=>document.getElementById("importFileInput").click(),document.getElementById("importFileInput").onchange=function(){window._importDataFile(this.files[0])},document.getElementById("btnSyncPush").onclick=()=>window._syncPush(),document.getElementById("btnSyncPull").onclick=()=>window._syncPull(),document.getElementById("btnReset").onclick=()=>{Z("重置数据","确定要重置所有数据吗？此操作会清除所有计划和记录，不可撤销！",()=>{window._resetAllData()})},document.getElementById("btnSaveServer").onclick=()=>{const s=document.getElementById("serverUrlInput").value.trim();window._saveServerUrl(s),a(),$(s?"服务器地址已保存":"已清除服务器地址","success")},document.getElementById("btnTestServer").onclick=async()=>{const s=document.getElementById("serverUrlInput").value.trim();if(!s){$("请先填写服务器地址","warning");return}const d=await window._testServerConnection(s);$(d?"连接成功，电脑端服务正常":"连接失败，请检查地址和电脑端是否已启动",d?"success":"warning")}}let de="dashboard",R=_().slice(0,7),je="全部",he=null;const Ze=[{view:"dashboard",label:"看板",full:"数据看板",icon:"dashboard"},{view:"plans",label:"计划",full:"计划清单",icon:"clipboard-list"},{view:"autotasks",label:"任务",full:"定时任务",icon:"clock"},{view:"learning",label:"学习",full:"学习记录",icon:"book-open"},{view:"habits",label:"习惯",full:"习惯追踪",icon:"sprout"},{view:"finance",label:"记账",full:"记账账本",icon:"wallet"},{view:"settings",label:"设置",full:"设置中心",icon:"settings"}];function S(){const t=document.getElementById("mainContent");if(t)switch(t.innerHTML="",t.scrollTop=0,de){case"dashboard":ht(t,g);break;case"plans":Mt(t,g,I,R);break;case"autotasks":At(t,g,I,R);break;case"learning":Ft(t,g,I,R);break;case"habits":Rt(t,g,I,je);break;case"finance":Ne(t,g,I,R);break;case"settings":ea(t,g,ie,I,it,S);break}}function J(t){de=t,document.querySelectorAll(".sidebar-nav-item").forEach(d=>d.classList.toggle("active",d.dataset.view===t)),document.querySelectorAll(".mobile-nav-item").forEach(d=>d.classList.toggle("active",d.dataset.view===t)),te();const i=document.querySelector(`.mobile-nav-item[data-view="${t}"]`);i&&i.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"});const[n,l]={dashboard:["数据看板",""],plans:["计划清单","管理你的待办计划"],autotasks:["定时任务","自动化日常事务管控"],learning:["学习记录","记录每一次成长"],habits:["习惯追踪","培养好习惯，改善坏习惯"],finance:["记账账本","理性消费，心中有数"],settings:["设置中心","个性化配置"]}[t]||["",""];document.getElementById("headerTitle").textContent=n,document.getElementById("headerSub").textContent=l;const e=document.getElementById("headerAction"),a=document.getElementById("mainHeader");["dashboard","plans","autotasks","habits","finance","settings","learning"].includes(t)?a.style.display="none":a.style.display="flex",e.style.display="none",e.className="btn btn-primary btn-sm",S(),document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebarOverlay").classList.remove("show")}function ta(t){const i={plans:Fe,autotasks:De,learning:Pe,habits:Be,finance:Oe};i[t]&&i[t](null,g,I,S)}function aa(){var i;const t=document.getElementById("mobileBottomNav");t&&(t.innerHTML=`
    <div class="mobile-nav-scroll">
      ${Ze.map(n=>`
        <button class="mobile-nav-item" data-view="${n.view}">
          ${p(n.icon,{size:22})}
          <span>${n.label}</span>
        </button>`).join("")}
    </div>
    <button class="mobile-nav-item more-btn">
      ${p("more-horizontal",{size:22})}
      <span>更多</span>
    </button>`,t.querySelectorAll("[data-view]").forEach(n=>n.addEventListener("click",()=>J(n.dataset.view))),(i=t.querySelector(".more-btn"))==null||i.addEventListener("click",()=>ia()))}function ia(t){var l;const i=document.getElementById("moreSheetOverlay");if(!i){const e=document.createElement("div");e.id="moreSheetOverlay",e.className="more-sheet-overlay",e.innerHTML=`
      <div class="more-sheet">
        <div class="more-sheet-handle"></div>
        <div class="more-sheet-header">
          <div class="more-sheet-title">全部功能</div>
          <button class="more-sheet-close">${p("x",{size:18})}</button>
        </div>
        <div class="more-sheet-grid" id="moreSheetGrid"></div>
      </div>`,e.addEventListener("click",a=>{a.target===e&&te()}),e.querySelector(".more-sheet-close").addEventListener("click",te),document.body.appendChild(e)}const n=i.querySelector("#moreSheetGrid");n.innerHTML=Ze.map(e=>`
    <button class="more-sheet-cell ${de===e.view?"active":""}" data-view="${e.view}">
      <span class="more-sheet-icon">${p(e.icon,{size:22})}</span>
      <span class="more-sheet-label">${e.full}</span>
    </button>`).join(""),n.querySelectorAll("[data-view]").forEach(e=>{e.addEventListener("click",()=>{te(),J(e.dataset.view)})}),(l=document.querySelector(".more-btn"))==null||l.classList.toggle("active",!0),i.classList.toggle("show",!0)}function te(){var i;const t=document.getElementById("moreSheetOverlay");t&&t.classList.remove("show"),(i=document.querySelector(".more-btn"))==null||i.classList.remove("active")}function sa(){setInterval(async()=>{if(!ie.autoSync)return;await ze(),await _e()&&(Y(g),document.querySelector(".modal-overlay")||S())},3e4)}function na(){setInterval(()=>{Se(g,ie,I,de==="autotasks"?S:null,$,he)},3e4),Se(g,ie,I,null,$,he)}async function la(){console.log("INIT START"),document.querySelectorAll(".sidebar-nav-item").forEach(a=>a.addEventListener("click",()=>J(a.dataset.view))),aa();const t=document.getElementById("menuBtn"),i=document.getElementById("sidebar"),n=document.getElementById("sidebarOverlay"),l=()=>window.innerWidth<=768;t.style.display=l()?"flex":"none",window.addEventListener("resize",()=>{t.style.display=l()?"flex":"none"}),t.addEventListener("click",()=>{i.classList.add("open"),n.classList.add("show")}),n.addEventListener("click",()=>{i.classList.remove("open"),n.classList.remove("show")}),window._navigateTo=J,window._renderCurrentView=S,window._filterPlans=a=>{document.getElementById("mainContent").dataset.filterStatus=a,S()},window._filterPlansMonth=a=>{R=a||_().slice(0,7),S()},window._filterTasksMonth=a=>{R=a,S()},window._filterLearnMonth=a=>{R=a,S()},window._filterFinMonth=a=>{R=a,S()},window._filterHabitType=a=>{je=a,S()},window._openAddModal=ta,window._openPlanModal=a=>Fe(a,g,I,S),window._updatePlanStatus=(a,s)=>{re(),kt(a,s,g,I,S)},window._deletePlan=a=>{re(),Et(a,g,I,S)},window._togglePlanMenu=a=>Lt(a),window._checkinTask=a=>zt(a,g,I,S),window._openAutoTaskModal=a=>De(a,g,I,S),window._deleteAutoTask=a=>Ht(a,g,I,S),window._toggleTaskEnabled=a=>_t(a,g,I,S),window._openLearningModal=a=>Pe(a,g,I,S),window._deleteLearning=a=>Pt(a,g,I,S),window._updateHabitRating=(a,s)=>jt(a,s,g,I,S),window._openHabitModal=a=>Be(a,g,I,S),window._deleteHabit=a=>Zt(a,g,I,S),window._openFinanceModal=a=>Oe(a,g,I,S),window._openQuickFinanceModal=(a,s)=>Kt(a,s,g,I,S),window._deleteFinance=a=>qe(a,g,I,S),window._toggleFinanceCharts=()=>Ut(),window._exportData=()=>vt(g),window._importDataFile=a=>ut(a,g,I,S),window._syncPush=async()=>{const a=await ze();$(a?"本地数据已上传到服务器":"无法连接服务器，数据已保存在本地",a?"success":"warning","cloud")},window._syncPull=async()=>{await _e()?(Y(g),S(),$("数据已从服务器同步","success","cloud")):$("无法连接服务器","warning")},window._saveServerUrl=a=>et(a),window._testServerConnection=async a=>{try{const s=String(a).trim().replace(/\/+$/,""),d=s.endsWith("/api")?s:s+"/api",v=await fetch(d+"/health",{headers:{"Content-Type":"application/json"}});return v.ok?!!(await v.json()).ok:!1}catch{return!1}},window._resetAllData=()=>{Object.assign(g,JSON.parse(JSON.stringify(pe))),I(),S(),$("数据已重置为初始状态","warning")},console.log("Initiating data sync...");const e=await st();console.log("Sync result:",e),$(e==="synced"?"已从服务器同步数据":"离线模式 · 数据保存在本地","info",e==="synced"?"cloud":"smartphone"),setTimeout(()=>{me(()=>import("./index-DqSpHgrO.js").then(a=>a.i),[]).then(a=>{he=a.LocalNotifications,a.LocalNotifications.requestPermissions().catch(()=>{})}).catch(()=>{})},500),"Notification"in window&&Notification.permission==="default"&&setTimeout(()=>{Notification.requestPermission().catch(()=>{})},2e3),R=_().slice(0,7),J("dashboard"),console.log("INIT COMPLETE, mainContent length:",document.getElementById("mainContent").innerHTML.length),document.addEventListener("click",a=>{a.target.closest(".dropdown")||re()}),sa(),na()}console.log("main.js module loaded, registering DOMContentLoaded");document.addEventListener("DOMContentLoaded",la);export{me as _};
