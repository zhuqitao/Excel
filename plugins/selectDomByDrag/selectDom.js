




$.selectDomByDrag = function(content,itemClass) {
	
  content.onmousedown = function(event) {
  	
//	event.preventDefault()

    var selList = []; 

    var fileNodes = document.getElementsByClassName(itemClass); 

    for ( var i = 0; i < fileNodes.length; i++) { 
      if (fileNodes[i].className.indexOf(itemClass) != -1) { 
        selList.push(fileNodes[i]); 
      } 

    } 

    var isSelect = true; 

    var evt = window.event || arguments[0]; 

    var startX = (evt.x || evt.clientX); 

    var startY = (evt.y || evt.clientY); 

    var selDiv = document.createElement("div"); 

    selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;"; 

    selDiv.id = "selectDiv"; 

    document.body.appendChild(selDiv); 

    selDiv.style.left = startX + "px"; 

    selDiv.style.top = startY + "px"; 

    var _x = null; 

    var _y = null; 

//  clearEventBubble(evt); 
    
    
    
	var selDiv_l,selDiv_t,selDiv_w,selDiv_h
    content.onmousemove = function() { 

      evt = window.event || arguments[0]; 

      if (isSelect) { 

        if (selDiv.style.display == "none") { 

          selDiv.style.display = ""; 

        } 

        _x = (evt.x || evt.clientX); 

        _y = (evt.y || evt.clientY); 

        selDiv.style.left = Math.min(_x, startX) + "px"; 

        selDiv.style.top = Math.min(_y, startY) + "px"; 

        selDiv.style.width = Math.abs(_x - startX) + "px"; 

        selDiv.style.height = Math.abs(_y - startY) + "px"; 

        // ---------------- ¹Ø¼üËã·¨ ---------------------  

        selDiv_l = selDiv.offsetLeft
        selDiv_t = selDiv.offsetTop;

        selDiv_w = selDiv.offsetWidth
        selDiv_h = selDiv.offsetHeight;
//      var timer = setTimeout(function(){
//      	
//      },500)

        

      } 

      clearEventBubble(evt); 

    } 
//	content.addEventListener('onmouseup',function(){})
    document.onmouseup = function() { 
    	
    	for ( var i = 0; i < selList.length; i++) {
//	          var sl = selList[i].offsetWidth + selList[i].offsetLeft; 
	          var sl = selList[i].offsetWidth + $(selList[i]).offset().left; 
	
//	          var st = selList[i].offsetHeight + selList[i].offsetTop; 
			  var st = selList[i].offsetHeight + $(selList[i]).offset().top
	
	          if (sl > selDiv_l && st > selDiv_t && $(selList[i]).offset().left < selDiv_l + selDiv_w && $(selList[i]).offset().top < selDiv_t + selDiv_h) { 

	
	            if (selList[i].className.indexOf("active") == -1) { 
	
	//            selList[i].className = selList[i].className + " active"; 
	              $(selList[i]).addClass('active')
	
	            } 
	
	          } else { 
	
	            if (selList[i].className.indexOf("active") != -1) { 
	
	              $(selList[i]).removeClass('active')
	
	            } 
	
	          } 
	
	        } 

      isSelect = false; 

      if (selDiv) { 

        document.body.removeChild(selDiv); 

        //showSelDiv(selList); 

      } 

      selList = null, _x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null; 

    } 

  } 

}; 

function clearEventBubble(evt) { 

  if (evt.stopPropagation) 

    evt.stopPropagation(); 

  else 

    evt.cancelBubble = true; 

  if (evt.preventDefault) 

    evt.preventDefault(); 

  else 

    evt.returnValue = false; 

} 