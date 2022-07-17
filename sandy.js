var doc = document;
var head = doc.head || doc.getElementsByTagName('head')[0];
var main ={}
var data=[]
var currentHtml,currentCss,currentJs;

document.addEventListener('DOMContentLoaded', function () {
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
  	app.innerHTML = txt
  	parseHtml(txt,main.html)
  	console.log(currentHtml)
  	 
  })
  
  var style = document.createElement('style');
  head.appendChild(style);
  main.css.getSession().on('change', function(){
  	var txt = main.css.getSession().getValue();
  	head.removeChild(style)
    style = document.createElement('style');
    head.appendChild(style);
		
		var n = document.createTextNode(txt)
		style.appendChild(n);
  	currentCss.data = txt
  	 
  })
  
	main.jsEdi.getSession().on('change', function(){
  	var txt = main.jsEdi.getSession().getValue();
  	currentJs.data = txt
  	
  	console.log(currentData.js)
  	var arr = currentData.js
  	var s =''
  	for(var x =0; x < arr.length; x++){
  	  s += arr[x].data;
  	}
  	createScript(s);
  	
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

var timer = new Date().getTime() / 1000
function parseHtml(txt,edi){
	var t = new Date().getTime() / 1000
  if(timer + 1 > t) return
  timer = new Date().getTime() / 1000
	var arr = findSubstrings(txt,"script");
  var arr2 =[];
  if(arr.length > 0){
  	for(var x =0; x < arr.length; x++){
  		var str = txt.substring(arr[x]-6,arr[x+1]+6)
      arr2.push(str)
      x++
  	}
  }
  for(var x =0; x < arr2.length; x++){
  	console.log(arr2[x])
  	if(arr2[x].includes("src")){
  		getSrc(arr2[x],edi)
  	}else{
  	  console.log("do not put inline script in html")
  		
  	}
  }
}

function getSrc(str,edi){
  
	var src = str.split("<script")
	src = src[1].split("></script")
	src = src[0].split("src=")
	
	src = src[1].split("\"");
	
	
	if(edi.scripts.indexOf(src[1]) === -1){
		edi.scripts.push(src[1])
		loadJS(src[1],head)
	}
	//console.log(head)
}

//loads js scripts with src in html area.
var loadJS = function(url, location, implementationCode){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;
	scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;
	location.appendChild(scriptTag);
};

//https://stackoverflow.com/questions/56446308/get-all-occurrences-of-a-substring-in-a-very-big-string
function findSubstrings(str,searchKeyword){

  var startingIndices = [];

  var indexOccurence = str.indexOf(searchKeyword, 0);

  while(indexOccurence >= 0) {
      startingIndices.push(indexOccurence);
			indexOccurence = str.indexOf(searchKeyword, indexOccurence + 1);
  }
	console.log(startingIndices)
  return startingIndices;
}

