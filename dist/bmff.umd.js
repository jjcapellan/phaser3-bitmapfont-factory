!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e||self).BMFFactory=t()}(this,function(){var e=0;function t(t){return"__private_"+e+++"_"+t}function n(e,t){if(!Object.prototype.hasOwnProperty.call(e,t))throw new TypeError("attempted to use private field on non-instance");return e}var r=[" A"," T"," Y","11","A ","AT","AV","AW","AY","Av","Aw","Ay","F,","F.","FA","L ","LT","LV","LW","LY","Ly","P ","P,","P.","PA","RT","RV","RW","RY","T ","T,","T-","T.","T:","T;","TA","TO","Ta","Tc","Te","Ti","To","Tr","Ts","Tu","Tw","Ty","V,","V-","V.","V:","V;","VA","Va","Ve","Vi","Vo","Vr","Vu","Vy","W,","W-","W.","W:","W;","WA","Wa","We","Wi","Wo","Wr","Wu","Wy","Y ","Y,","Y-","Y.","Y:","Y;","YA","Ya","Ye","Yi","Yo","Yp","Yq","Yu","Yv","ff","r,","r.","v,","v.","w,","w.","y,","y."],i=["Arial","Calibri","Helvetica","Roboto","Trebuchet MS","Verdana"],o=["Garamond","Georgia","serif","Times","Times New Roman"],a=["Consolas","Courier","Courier New","monospace"];function s(e,t){return parseInt(e.getAttribute(t),10)}var l=function(e,t,n,r,i){void 0===n&&(n=0),void 0===r&&(r=0);var o=t.cutX,a=t.cutY,l=t.source.width,c=t.source.height,u=t.sourceIndex,f={},h=e.getElementsByTagName("info")[0],d=e.getElementsByTagName("common")[0];f.font=h.getAttribute("face"),f.size=s(h,"size"),f.lineHeight=s(d,"lineHeight")+r,f.chars={};var v=e.getElementsByTagName("char"),g=void 0!==t&&t.trimmed;if(g)var m=t.height,x=t.width;for(var p=0;p<v.length;p++){var y=v[p],P=s(y,"id"),b=String.fromCharCode(P),w=s(y,"x"),B=s(y,"y"),T=s(y,"width"),O=s(y,"height");g&&(w<x&&(x=w),B<m&&(m=B)),g&&0!==m&&0!==x&&(w-=t.x,B-=t.y);var Y=(o+w)/l,j=(a+B)/c,A=(o+w+T)/l,W=(a+B+O)/c;if(f.chars[P]={x:w,y:B,width:T,height:O,centerX:Math.floor(T/2),centerY:Math.floor(O/2),xOffset:s(y,"xoffset"),yOffset:s(y,"yoffset"),xAdvance:s(y,"xadvance")+n,data:{},kerning:{},u0:Y,v0:j,u1:A,v1:W},i&&0!==T&&0!==O){var k=i.add(b,u,w,B,T,O);k&&k.setUVs(T,O,Y,j,A,W)}}var X=e.getElementsByTagName("kerning");for(p=0;p<X.length;p++){var L=X[p],V=s(L,"first"),H=s(L,"second"),F=s(L,"amount");f.chars[H].kerning[V]=F}return f};function c(e,t,n){if(!e.s){if(n instanceof f){if(!n.s)return void(n.o=c.bind(null,e,t));1&t&&(t=n.s),n=n.v}if(n&&n.then)return void n.then(c.bind(null,e,t),c.bind(null,e,2));e.s=t,e.v=n;var r=e.o;r&&r(e)}}var u=/*#__PURE__*/t("ctx"),f=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(t,n){var r=new e,i=this.s;if(i){var o=1&i?t:n;if(o){try{c(r,1,o(this.v))}catch(e){c(r,2,e)}return r}return this}return this.o=function(e){try{var i=e.v;1&e.s?c(r,1,t?t(i):i):n?c(r,1,n(i)):c(r,2,i)}catch(e){c(r,2,e)}},r},e}();function h(e,t,n){var r,i,o=-1;return function a(s){try{for(;++o<e.length&&(!n||!n());)if((s=t(o))&&s.then){if(!((l=s)instanceof f&&1&l.s))return void s.then(a,i||(i=c.bind(null,r=new f,2)));s=s.v}r?c(r,1,s):r=s}catch(e){c(r||(r=new f),2,e)}var l}(),r}var d=/*#__PURE__*/t("currentPendingSteps"),v=/*#__PURE__*/t("currentTexture"),g=/*#__PURE__*/t("currentXMLs"),m=/*#__PURE__*/t("onComplete"),x=/*#__PURE__*/t("padding"),p=/*#__PURE__*/t("tasks"),y=/*#__PURE__*/t("textureWidth"),P=/*#__PURE__*/t("textureHeight"),b=/*#__PURE__*/t("totalGlyphs"),w=/*#__PURE__*/t("totalHeight"),B=/*#__PURE__*/t("totalProgress"),T=/*#__PURE__*/t("totalWidth"),O=/*#__PURE__*/t("calcBounds"),Y=/*#__PURE__*/t("calcKernings"),j=/*#__PURE__*/t("finish"),A=/*#__PURE__*/t("getKerningPairs"),W=/*#__PURE__*/t("getTextureWidth"),k=/*#__PURE__*/t("getValidFont"),X=/*#__PURE__*/t("makeGlyphs"),L=/*#__PURE__*/t("makeTexture"),V=/*#__PURE__*/t("makeXMLs"),H=/*#__PURE__*/t("step");/*#__PURE__*/
return function(){function e(e,t,s){var c=this,f=this,F=this,R=this,M=this;void 0===s&&(s={PoT:!1}),this.onProgress=void 0,this.PoT=!1,this.scene=void 0,this.defaultFonts={sansSerif:i,serif:o,monospace:a},Object.defineProperty(this,u,{writable:!0,value:void 0}),Object.defineProperty(this,d,{writable:!0,value:0}),Object.defineProperty(this,v,{writable:!0,value:null}),Object.defineProperty(this,g,{writable:!0,value:[]}),Object.defineProperty(this,m,{writable:!0,value:function(){}}),Object.defineProperty(this,x,{writable:!0,value:1}),Object.defineProperty(this,p,{writable:!0,value:[]}),Object.defineProperty(this,y,{writable:!0,value:0}),Object.defineProperty(this,P,{writable:!0,value:0}),Object.defineProperty(this,b,{writable:!0,value:0}),Object.defineProperty(this,w,{writable:!0,value:0}),Object.defineProperty(this,B,{writable:!0,value:0}),Object.defineProperty(this,T,{writable:!0,value:0}),Object.defineProperty(this,O,{writable:!0,value:function(){var e,t=n(M,p)[p],r=0,i=n(M,x)[x],o=n(M,x)[x];e=n(M,W)[W](n(M,b)[b],n(M,w)[w],n(M,T)[T]);for(var a=[],s=0;s<t.length;s++)a.push.apply(a,t[s].glyphs);a.sort(function(e,t){return t.xmlHeight-e.xmlHeight});var l=a[0],c=l.xmlHeight+n(M,x)[x];a.forEach(function(t){t.xmlX=o,t.xmlY=i,(o=t.xmlX+t.xmlWidth+n(M,x)[x])>e&&(t.xmlX=n(M,x)[x],t.xmlY=c+i,l=t,o=t.xmlX+t.xmlWidth+n(M,x)[x],i+=c,c=t.xmlHeight+n(M,x)[x]),t.printX=t.xmlX+t.actualBoundingBoxLeft,t.printY=t.xmlY+t.actualBoundingBoxAscent}),r=l.xmlY+l.xmlHeight+n(M,x)[x],M.PoT&&(r=Phaser.Math.Pow2.GetNext(r)),n(M,y)[y]=e,n(M,P)[P]=r}}),Object.defineProperty(this,Y,{writable:!0,value:function(){try{var e=n(c,p)[p],t=n(c,u)[u];return Promise.resolve(h(e,function(r){var i=e[r];if(i.getKernings){var o=i.kernings,a=i.chars,s=i.glyphs,l=n(c,A)[A](i);t.font=i.font;for(var u=0;u<l.length;u++){var f=l[u].split(""),h=s[a.indexOf(f[0])],d=s[a.indexOf(f[1])],v=h.xmlWidth+d.xmlWidth,g=t.measureText(l[u]),m=Math.ceil(g.actualBoundingBoxRight+g.actualBoundingBoxLeft-v);0!=m&&o.push({first:h.id,second:d.id,amount:m})}var x=function(){if(c.onProgress){n(c,B)[B]+=1/n(c,p)[p].length*.5;var e=c;return Promise.resolve(new Promise(function(t){e.onProgress(n(e,B)[B]),e.scene.events.once("preupdate",t)})).then(function(){})}}();return x&&x.then?x.then(function(){}):void 0}}))}catch(e){return Promise.reject(e)}}}),Object.defineProperty(this,j,{writable:!0,value:function(){for(var e=n(M,v)[v],t=n(M,g)[g],r=n(M,p)[p][0].key,i=M.scene.textures.getFrame(r),o=0;o<t.length;o++){var a=l(t[o],i,0,0,e);M.scene.cache.bitmapFont.add(n(M,p)[p][o].key,{data:a,texture:r,frame:null})}n(M,v)[v]=null,n(M,g)[g]=[],n(M,p)[p]=[],n(M,m)[m]()}}),Object.defineProperty(this,A,{writable:!0,value:function(e){for(var t=[],n=0;n<r.length;n++){var i=r[n].split("");-1!=e.chars.indexOf(i[0])&&-1!=e.chars.indexOf(i[1])&&t.push(r[n])}return t}}),Object.defineProperty(this,W,{writable:!0,value:function(e,t,r){var i=Math.max(t/e,r/e),o=Math.ceil(Math.sqrt(i*i*e));return M.PoT?Phaser.Math.Pow2.GetNext(o):o+2*n(M,x)[x]}}),Object.defineProperty(this,k,{writable:!0,value:function(e){for(var t="",n=0;n<e.length;n++)if(M.check(e[n])){t=e[n];break}return t}}),Object.defineProperty(this,X,{writable:!0,value:function(){try{var e=n(f,p)[p],t=n(f,u)[u];return Promise.resolve(h(e,function(r){var i=e[r],o=i.chars,a=o.length;n(f,b)[b]+=a,t.font=i.font;for(var s=0;s<a;s++){var l=o[s],c={actualBoundingBoxAscent:0,actualBoundingBoxLeft:0,id:l.charCodeAt(0),letter:l,printX:0,printY:0,xmlX:0,xmlY:0,xmlXoffset:0,xmlYoffset:0,xmlHeight:0,xmlWidth:0,xmlXadvance:0},u=t.measureText(l);c.xmlXoffset=-u.actualBoundingBoxLeft,c.xmlYoffset=u.actualBoundingBoxDescent,c.xmlWidth=u.actualBoundingBoxRight+u.actualBoundingBoxLeft,c.xmlHeight=u.actualBoundingBoxDescent+u.actualBoundingBoxAscent,c.xmlXadvance=u.width,c.actualBoundingBoxAscent=u.actualBoundingBoxAscent,c.actualBoundingBoxLeft=u.actualBoundingBoxLeft,i.glyphs.push(c),n(f,w)[w]+=c.xmlHeight+n(f,x)[x],n(f,T)[T]+=c.xmlWidth+n(f,x)[x]}var h=function(){if(f.onProgress){n(f,B)[B]+=1/n(f,p)[p].length*.5;var e=f;return Promise.resolve(new Promise(function(t){e.onProgress(n(e,B)[B]),e.scene.events.once("preupdate",t)})).then(function(){})}}();if(h&&h.then)return h.then(function(){})}))}catch(e){return Promise.reject(e)}}}),Object.defineProperty(this,L,{writable:!0,value:function(){try{return Promise.resolve(function(e,t,n,r){try{var i=t[0].key,o=document.createElement("canvas"),a=o.getContext("2d");o.width=n,o.height=r;for(var s=0;s<t.length;s++){var l=t[s],c=l.glyphs;a.font=l.font,a.fillStyle=l.style.color?l.style.color:"white";for(var u=0;u<c.length;u++){var f=c[u];a.fillText(f.letter,f.printX,f.printY)}}return Promise.resolve(new Promise(function(t){o.toBlob(function(n){var r=document.createElement("img"),o=URL.createObjectURL(n);r.onload=function(){e.textures.addImage(i,r);var n=e.textures.get(i);URL.revokeObjectURL(o),t(n)},r.src=o},"image/png")}))}catch(e){return Promise.reject(e)}}(F.scene,n(F,p)[p],n(F,y)[y],n(F,P)[P])).then(function(e){n(F,v)[v]=e,n(F,H)[H](null)})}catch(e){return Promise.reject(e)}}}),Object.defineProperty(this,V,{writable:!0,value:function(){try{return n(R,g)[g]=function(e){for(var t=[],n=0;n<e.length;n++){for(var r=e[n],i=r.chars.length,o=r.fontFamily,a=r.style.fontSize.replace("px",""),s=r.glyphs,l=Number.parseInt(a),c='<?xml version="1.0"?><font><info face="'+o+'" size="'+a+'"></info><common lineHeight="'+a+'"></common><chars count="'+i+'">',u="",f=0;f<i;f++){var h=s[f];u+='<char id="'+h.id+'" x="'+h.xmlX+'" y="'+h.xmlY+'" width="'+h.xmlWidth+'" height="'+h.xmlHeight+'" xoffset="'+h.xmlXoffset+'" yoffset="'+(l-(h.printY-h.xmlY))+'" xadvance="'+h.xmlXadvance+'"/>'}u+="</chars>";var d="";if(r.getKernings){var v=r.kernings.length,g=r.kernings;d+='<kernings count="'+v+'">';for(var m=0;m<v;m++){var x=g[m];d+='<kerning first="'+x.first+'" second="'+x.second+'" amount="'+x.amount+'" />'}d+="</kernings>"}var p=c+u+d+"</font>",y=(new DOMParser).parseFromString(p,"application/xml");t.push(y)}return t}(n(R,p)[p]),n(R,H)[H](null),Promise.resolve()}catch(e){return Promise.reject(e)}}}),Object.defineProperty(this,H,{writable:!0,value:function(e){n(M,d)[d]-=1,0==n(M,d)[d]&&n(M,j)[j]()}}),this.scene=e,this.PoT=s.PoT,this.onProgress=s.onProgress,n(this,m)[m]=t,n(this,u)[u]=document.createElement("canvas").getContext("2d")}var t=e.prototype;return t.check=function(e){var t=n(this,u)[u];t.font="12px default";var r=t.measureText("0");t.font="12px "+e;var i=t.measureText("0");return r.actualBoundingBoxAscent!=i.actualBoundingBoxAscent&&r.actualBoundingBoxRight!=i.actualBoundingBoxRight},t.exec=function(){try{var e=this;return n(e,b)[b]=0,n(e,w)[w]=0,n(e,T)[T]=0,Promise.resolve(n(e,X)[X]()).then(function(){return n(e,O)[O](),Promise.resolve(n(e,Y)[Y]()).then(function(){n(e,d)[d]=2,n(e,L)[L](),n(e,V)[V]()})})}catch(e){return Promise.reject(e)}},t.make=function(e,t,r,i,o){var a;void 0===i&&(i={}),void 0===o&&(o=!0),null==i.fontSize&&(i.fontSize="32px"),a="string"==typeof t?t:n(this,k)[k](t);var s="";s+=i.fontStyle?i.fontStyle+" ":"",s+=i.fontSize+" ";var l={chars:r,font:s+='"'+a+'"',fontFamily:a,glyphs:[],getKernings:o,kernings:[],key:e,style:i};l.style.fontFamily=l.fontFamily,n(this,p)[p].push(l)},e}()});
