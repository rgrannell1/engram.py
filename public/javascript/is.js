const a=function(t,e){if("[object String]"!==Object.prototype.toString.call(t))throw TypeError('a: the argument matching "str" must be a string.');return Object.prototype.toString.call(e).toLowerCase()==="[object "+t.toLowerCase()+"]"},what=function(t){return Object.prototype.toString.call(t).toLowerCase().slice(8,-1)},classes=["array","boolean","date","error","function","null","number","object","regexp","string","undefined"],is=function(){return classes.reduce(function(t,e){return t[e]=a.bind(null,e),t},a)}(),always=function(){const t=function(t,e){if(!is[t](e))throw"always."+t+": value was not a "+t+" (actual type was "+what(e)+")"};return classes.reduce(function(e,n){return e[n]=t.bind(null,n),e},t)}(),never=function(){const t=function(t,e){if(is[t](e))throw"always."+t+": value was not a "+t+" (actual type was "+what(e)+")"};return classes.reduce(function(e,n){return e[n]=t.bind(null,n),e},t)}();is.a=a,is.what=what,is.always=always,is.never=never,module.exports=is;