//https://stackoverflow.com/questions/41060958/edit-the-css-of-a-cross-domain-iframe-that-is-inside-an-internal-iframe
console.log("sandy!")

window.onload = function () {
  //var iframe = document.getElementById("myIframe").contentWindow
  //iframe.postMessage(["html","balls"], "*");
};

var doc = document;
var head = doc.head || doc.getElementsByTagName('head')[0];
var main ={}
var data=[]
var currentHtml,currentCss,currentJs,iframe;

document.addEventListener('DOMContentLoaded', function () {
  iframe = document.getElementById("myIframe").contentWindow
	main.html = createEditor("htmlEdi","html")
	main.css = createEditor("cssEdi","css")
	main.jsEdi = createEditor("jsEdi","javascript")
	setupMainTabs()
	ediSetup()
	jsTabSetup()
});




function setupMainTabs(){
	var t = document.getElementById('addTab')
	var tabs = document.getElementById('htmlTabs')
	addMainTab(tabs)
	t.addEventListener('click', event => {
		console.log("ad tab")
		addMainTab(tabs)
		
	});
}
function addMainTab(tabs){
  
  var jsTabs = document.getElementById('jsTabs')
  hideAllTabs(jsTabs)
  var tab = addDiv(tabs)
  tab.data = createDataObj()
	tab.textContent = "html"+data.length
	removeClassFromDivKids(tabs,'bgEd')
    addMultiClassToDiv(['flexMe','shadowHover','hoverPink','pad8','padT4','padB4','borRad4','borBotRad0','bgEd','tab'],tab)
  addExitToTab(tab,tabs)
  mainTabSetup(tab,tabs)
  
  currentHtml = tab.data.html
  currentCss = tab.data.css
  main.html.setValue("")
	main.css.setValue("")
	main.jsEdi.setValue("")
}

function mainTabSetup(tab,tabs){
  tab.addEventListener('click', event => {
    console.log(tab.data)
    removeClassFromDivKids(tabs,'bgEd')
    addMultiClassToDiv(['bgEd'],tab)
    currentHtml = tab.data.html
    currentCss = tab.data.css
    currentData = tab.data
    currentJs = tab.data.js[0]
    
    main.html.setValue(currentHtml.data)
	  main.css.setValue(currentCss.data)
    main.jsEdi.setValue(currentJs.data)
    
    showJsTabs(tab)
    
  })
}


function showJsTabs(tab){
  var jsTabs = document.getElementById('jsTabs')
  hideAllTabs(jsTabs)
  var arr = tab.data.js
  for(var x =0; x < arr.length; x++){
    arr[x].style.display ='flex'
  }
  
}

function createDataObj(){
  var obj ={html:{data:""},css:{data:""},js:[]}
  currentData = obj;
  data.push(obj)
  addJsTab()
  return obj;
}

function jsTabSetup(){
  var plus = document.getElementById('addJs')
  var tabs = document.getElementById('jsTabs')
  tabsMouseOver(tabs)
  plus.addEventListener('click', function() {
    addJsTab(tabs)
  });
}

function addJsTab(){
  var tabs = document.getElementById('jsTabs')
  var tab = addDiv(tabs)
  currentData.js.push(tab)
  tab.textContent = "script"+currentData.js.length
  removeClassFromDivKids(tabs,'bgEd')
  addMultiClassToDiv(['flexMe','shadowHover','hoverPink','pad8','padT4','padB4','borRad4','borBotRad0','bgEd','tab'],tab)
  currentJs = tab
  tab.data=''
  main.jsEdi.setValue("")
  clickOnJsTab(tab,tabs)
}

function clickOnJsTab(tab,tabs){
  tab.addEventListener('click', function() {
    removeClassFromDivKids(tabs,'bgEd')
    addMultiClassToDiv(['bgEd'],tab)
    console.log(tab.data)
    currentJs = tab
    main.jsEdi.setValue(tab.data)
    
  })
  
}

function ediSetup(){
  main.html.scripts =[]
  main.html.getSession().on('change', function(){
  	var txt = main.html.getSession().getValue();
  	currentHtml.data = txt
  	iframe.postMessage(["html",txt], "*");
  	 
  })
  
  var style = document.createElement('style');
  head.appendChild(style);
  main.css.getSession().on('change', function(){
  	var txt = main.css.getSession().getValue();
  	iframe.postMessage(["css",txt], "*");
  	currentCss.data = txt
  	 
  })
  
	main.jsEdi.getSession().on('change', function(){
  	var txt = main.jsEdi.getSession().getValue();
  	currentJs.data = txt
  	var arr = currentData.js
  	var data =[]
  	for(var x =0; x < arr.length; x++){
  	  data.push(arr[x].data)
  	}
  	
  	iframe.postMessage(["js",data], "*");
  	console.log(currentData.js)
  	//createScript(s);
  	
  })
}


function createEditor(id,mode){
	var edi = ace.edit(id);
	//edi.setTheme("ace/theme/monokai");
	edi.session.setMode("ace/mode/"+mode);
	setupEdiCursor(edi,id)
	return edi
}

function setupEdiCursor(edi,id){
  var d = document.getElementById(id)
  var cursor;
  var start = true;
  edi.renderer.on('afterRender', function() {
    if(start){
      cursor = d.querySelector('.ace_cursor')
      cursor.style.display = 'none';
    }
    
  })
  edi.setOptions({
    highlightGutterLine:false,
    highlightActiveLine:false
  });
  
  edi.on('focus',function(){
    console.log("focus")
    start = false;
    hideAllEdiHl()
    cursor.style.display = 'block';
    edi.setOptions({
      highlightGutterLine:true,
      highlightActiveLine:true
    });
  
  })
}

function hideAllEdiHl(){
  
	var arr = [main.html,main.css,main.jsEdi]
	
	
	arr.forEach(function(ele){
	  ele.setOptions({
      highlightGutterLine:false,
      highlightActiveLine:false
    });
	})
	
	var arr = document.querySelectorAll('.ace_cursor')
	
	arr.forEach(function(ele){
	  ele.style.display = 'none';
	})
}

function addDiv(d){
	var div = document.createElement('div')
	div.textContent=" "
	d.appendChild(div)
	return div;
}

function tabsMouseOver(tabs){
  tabs.addEventListener("mouseenter", function( event ) {
    
    if(isOverflown(tabs)){
      tabs.classList.add('h40')
    }
  });
  
  tabs.addEventListener("mouseleave",function(){
    tabs.classList.remove('h40')
  })
}

function hideAllTabs(tabs){
  var arr = tabs.children
  console.log(arr)
  for(var x =0; x < arr.length; x++){
	  arr[x].style.display = 'none';
	}
}

function removeClassFromDivKids(div,cl){
  var eles = div.querySelectorAll("."+cl)
  eles.forEach(function(ele){
    ele.classList.remove(cl);
  })
}

function addMultiClassToDiv(arr,div){
  for(var x =0; x < arr.length; x++){
    div.classList.add(arr[x])
  }
}

//https://stackoverflow.com/questions/9333379/check-if-an-elements-content-is-overflowing
function isOverflown(element) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

function addExitToTab(tab,tabs){
  var x = addDiv(tab)
  addMultiClassToDiv(['flexMe','w16','h16','hoverGray','circle','mL10'],x)
  x.insertAdjacentHTML('afterbegin', '&#x00d7');
  
  x.addEventListener("mouseenter", function( event ) {
    tab.dontload = true;
  })
  
  x.addEventListener("mouseleave",function(){
    tab.dontload = false;
  })
  
  x.addEventListener('click', function() {
    tab.style.display = 'none';
    
    var i = main.tabs.indexOf(tab)
    console.log(i)
    var arr = main.tabs
    var found = false;
    
    if(currentJsTab !== tab) return
    
    for(var x =0; x < arr.length; x++){
      i--
      if(i < 0) {
        break;
      }
      if(arr[i].style.display !=='none'){
        found = true;
        currentJsTab = arr[i]
        loadJsTab(arr[i],tabs)
        break;
      }
    }
    
    if(!found){
      i = main.tabs.indexOf(tab)
      for(var x =i; x < arr.length; x++){
        if(arr[x].style.display !=='none'){
          found = true;
          currentJsTab = arr[x]
          loadJsTab(arr[x],tabs)
          break;
        }
      }
      
    }
  })
}

function createScript(src){
	emptyNamedEle(head,"stuff");
	var s = document.createElement("script");
	s.name ="stuff"
	s.innerHTML = src;
	head.appendChild(s)
	console.log(head.children.length)
}

function emptyNamedEle(div,name){
	console.log(div.children)
	var list = div.children;
	for (let item of list) {
		console.log(item.name);
		if(item.name === name){
			item.remove()
		}
	}
}
