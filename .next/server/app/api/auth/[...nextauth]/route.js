(()=>{var e={};e.id=14,e.ids=[14],e.modules={96330:e=>{"use strict";e.exports=require("@prisma/client")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},12412:e=>{"use strict";e.exports=require("assert")},79428:e=>{"use strict";e.exports=require("buffer")},55511:e=>{"use strict";e.exports=require("crypto")},94735:e=>{"use strict";e.exports=require("events")},81630:e=>{"use strict";e.exports=require("http")},55591:e=>{"use strict";e.exports=require("https")},11723:e=>{"use strict";e.exports=require("querystring")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},74075:e=>{"use strict";e.exports=require("zlib")},85191:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>c,routeModule:()=>u,serverHooks:()=>p,workAsyncStorage:()=>n,workUnitAsyncStorage:()=>l});var s=t(42706),o=t(28203),i=t(45994),a=t(15106);let u=new s.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/auth/[...nextauth]/route",pathname:"/api/auth/[...nextauth]",filename:"route",bundlePath:"app/api/auth/[...nextauth]/route"},resolvedPagePath:"C:\\Users\\Yasir\\OneDrive\\Desktop\\b2r-yjsaas\\app\\api\\auth\\[...nextauth]\\route.ts",nextConfigOutput:"",userland:a}),{workAsyncStorage:n,workUnitAsyncStorage:l,serverHooks:p}=u;function c(){return(0,i.patchFetch)({workAsyncStorage:n,workUnitAsyncStorage:l})}},96487:()=>{},78335:()=>{},15106:(e,r,t)=>{"use strict";t.r(r),t.d(r,{GET:()=>p,POST:()=>p,authOptions:()=>l});var s=t(51825),o=t.n(s),i=t(86259),a=t(91642);let u=require("bcrypt");var n=t(11587);let l={adapter:(0,i.y)(n.A),providers:[(0,a.A)({name:"Credentials",credentials:{email:{label:"Email",type:"text"},password:{label:"Password",type:"password"}},async authorize(e){if(console.log("Authorize function called with credentials:",e?.email),!e?.email||!e?.password)return console.log("Missing credentials"),null;try{let r=await n.A.user.findUnique({where:{email:e.email}});if(console.log("User lookup result:",r?"User found":"User not found"),!r)return console.log("User not found:",e.email),null;let t=await (0,u.compare)(e.password,r.password);if(console.log("Password validation result:",t),!t)return console.log("Invalid password for user:",e.email),null;return console.log("Authentication successful for user:",e.email),{id:r.id,email:r.email,name:r.name,role:r.role}}catch(e){return console.error("Auth error:",e),null}}})],callbacks:{jwt:async({token:e,user:r})=>(r&&(e.role=r.role),console.log("JWT callback. Token:",e),e),session:async({session:e,token:r})=>(e?.user&&(e.user.role=r.role),console.log("Session callback. Session:",e),e)},pages:{signIn:"/auth/signin"},session:{strategy:"jwt",maxAge:2592e3},debug:!0},p=o()(l)},11587:(e,r,t)=>{"use strict";t.d(r,{A:()=>o});var s=t(96330);let o=global.prisma||new s.PrismaClient({log:["query","info","warn","error"]})},42706:(e,r,t)=>{"use strict";e.exports=t(44870)}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[638,728],()=>t(85191));module.exports=s})();