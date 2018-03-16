function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); 
    return null; 
} 

$(function() {
	var attrList = []
	var name = getQueryString('name')
	if(name){
		switch (name) {
			case 'rukuliuiang':
				name = '入库流量'
				break
			case 'chukuliuliang':
				name = '出库流量'
				break
			case 'qishuiliuliang':
				name = '弃水流量'
				break
		}
	}
	$.getJSON('../static/json/value-bind.json').then(res => {
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
				onClick: function(event, treeId, treeNode) {
					if(treeNode.level === 2) {
						console.log(treeNode)
						var a = $("input[name='radio']:checked").val();
						var time=$("#test1").val()
						$('.valueName').val(attrList[0].children[0].name+"."+treeNode.name+"."+a+"."+"时间"+time)
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
	})

	laydate.render({
		elem: '#test1', //指定元素
		range:true,
		value: '2018-03-09 - 2018-04-09'
	});
	laydate.render({
		elem: '#test2', //指定元素
		value: '2018-04-14 '
	});
	
})