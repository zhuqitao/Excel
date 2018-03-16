
function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); 
    return null; 
} 
$(function(){
	var attrList = [] 
//	var name = $('#name').val()
	var name = getQueryString('name')
	if(name){
		switch (name) {
			case 'sishuiwei':
				name = '死水位'
				break
			case 'xunxianshuiwei':
				name = '汛限水位'
				break
			case 'shejishuiwei':
				name = '设计水位'
				break
		}
	}
	
	
	$.getJSON('../static/json/attr-bind.json').then(res=>{
		attrList = res['attr']
		
		if(name){
			attrList.map(function (item1,index1){
				item1.children.map(function (item2,index2){
					var arr=[];
					item2.children.map(function(item3,index3){
						if (item3.name === name){
							arr.push(item3)
							
						}
						item2.children=arr
					})
				})
			})
		}
		$.fn.zTree.init($("#treeDemo"), {
			callback: {
				onClick: function(event,treeId,treeNode){
					if(treeNode.level === 2){
						$('.attrName').val(attrList[0].children[0].name+"."+treeNode.name)
					}
				}
			}
		}, attrList);
		var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
		//treeObj.expandAll(true);
		var nodes = treeObj.getNodes();
		if (nodes.length>0) {
		    for(var i=0;i<nodes.length;i++){
		    treeObj.expandNode(nodes[i], true, false , false);
		    }
		}
		console.log(attrList)
		
		
	})
})
