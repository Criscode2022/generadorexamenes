"use strict";(self.webpackChunkexamenes=self.webpackChunkexamenes||[]).push([[592],{328:(m,h,s)=>{s.d(h,{s:()=>c});var _=s(5861),l=s(1135),a=s(4650),u=s(529);let c=(()=>{class t{constructor(e){this.http=e,this.preguntasSubject=new l.X([]),this.temasSubject=new l.X([]),this.temas$=this.temasSubject.asObservable(),this.preguntas$=this.preguntasSubject.asObservable(),this.loadPreguntas(),this.loadTemas()}getPreguntas(){return this.preguntasSubject.asObservable()}getTemas(){return this.temasSubject.asObservable()}loadPreguntas(){this.http.get("https://api-examenes.onrender.com/preguntas").subscribe(e=>{this.preguntasSubject.next(e)})}loadTemas(){this.http.get("https://api-examenes.onrender.com/temas").subscribe(e=>{console.log("Temas recibidos:",e),this.temasSubject.next(e)},e=>{console.error("Error al cargar los temas:",e)})}actualizarPreguntas(){var e=this;return(0,_.Z)(function*(){try{const r=yield e.http.get("https://api-examenes.onrender.com/preguntas/").toPromise();r?e.preguntasSubject.next(r):console.error("Error: la respuesta de la API es undefined")}catch(r){console.error("Error al obtener las preguntas: ",r)}})()}}return t.\u0275fac=function(e){return new(e||t)(a.LFG(u.eN))},t.\u0275prov=a.Yz7({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()},5861:(m,h,s)=>{function _(a,u,c,t,n,e,r){try{var i=a[e](r),o=i.value}catch(p){return void c(p)}i.done?u(o):Promise.resolve(o).then(t,n)}function l(a){return function(){var u=this,c=arguments;return new Promise(function(t,n){var e=a.apply(u,c);function r(o){_(e,t,n,r,i,"next",o)}function i(o){_(e,t,n,r,i,"throw",o)}r(void 0)})}}s.d(h,{Z:()=>l})}}]);