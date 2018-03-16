function createTableArrWithObj(length) { // 得到表格头部 第一行的 大写字母
	let arr = []

	for(let i = 0; i < length; i++) {
		let value = String.fromCharCode((65 + i)) // 得到所有字母
		let obj = {
			value: value,
			id: (i + 1),
			active: false,
			rowData: new Array(length)     // 每一行对应的数据
		}
		arr.push(obj)
	}
	return arr
}

// 阻止冒泡
function clearEventBubble(evt) {

	if(evt.stopPropagation)

		evt.stopPropagation();

	else

		evt.cancelBubble = true;

	if(evt.preventDefault)

		evt.preventDefault();

	else

		evt.returnValue = false;

}



// tool 工具绑定事件
$(document).on('click', function(e) {
	$('.tool-list').hide()
})
$(document).on('click', '.tool-item.font-family .inp i', function(e) {
	e.stopPropagation()
	$('.tool-item.font-family .tool-list').toggle()
})

$(function() {
	
//	colPickInit($('#font-color'))
	
	
//	$('.asd').tab();

	
	// 按下鼠标 滑动 选择多个元素
	function selectDomByDrag() {

		// 鼠标开始和结束时所在的单元格
		var startRow, startCol, endRow, endCol
		
		// 鼠标开始位置
		var startX,startY
		
		var startRow,startCol // 开始单元格坐标（行、列数）
		var moveRow,moveCol   // 移动是鼠标所在单元格坐标（行、列数）

		$('#table-body').on('mousedown', function(evt) {
			var isSelect = true; // 正在选择中

			if($(evt.target).data('row') && $(evt.target).data('col')) {
				startRow = $(evt.target).data('row') * 1
				startCol = $(evt.target).data('col') * 1
			}

			// 选择框 左上角坐标
			startX = (evt.x || evt.clientX);
			startY = (evt.y || evt.clientY);

			var selDiv = document.getElementById('selectDiv');

			selDiv.style.left = startX + "px";
			selDiv.style.top = startY + "px";

			

			// 选择框的大小和位置
			var selDiv_l, selDiv_t, selDiv_w, selDiv_h
//			clearEventBubble(evt)

			$(document).on('mousemove','#table-body', function() {
				evt = window.event || arguments[0]
				
				moveRow = $(evt.target).data('row') * 1
				moveCol = $(evt.target).data('col') * 1
				
				if(moveRow!==startRow||moveCol!==startCol){
					// 获取鼠标当前位置
					var _x = (evt.x || evt.clientX);
					var _y = (evt.y || evt.clientY);
					
					if(isSelect&&Math.abs(_x - startX)>5&&Math.abs(_x - startX)>5) {
						$('#selectDiv').show()
	
						// 改变选择框的大小
						if(_x >= startX && _y >= startY) {
							selDiv.style.left = Math.min(_x, startX) + "px";
							selDiv.style.top = Math.min(_y, startY) + "px";
							selDiv.style.width = Math.abs(_x - startX) - 5 + "px";
							selDiv.style.height = Math.abs(_y - startY) - 5 + "px";
						} else {
							selDiv.style.left = Math.min(_x, startX) + 5 + "px";
							selDiv.style.top = Math.min(_y, startY) + 5 + "px";
							selDiv.style.width = Math.abs(_x - startX) - 5 + "px";
							selDiv.style.height = Math.abs(_y - startY) - 5 + "px";
						}
					}
					clearEventBubble(evt)
				}
				
				
			})

			$(document).on('mouseup', '#table-body',function(evt) {
				
				// 获取鼠标当前位置
				var _x = (evt.x || evt.clientX);
				var _y = (evt.y || evt.clientY);
				
				

				if($(evt.target).data('row') && $(evt.target).data('col')) {
					var endRow = $(evt.target).data('row') * 1
					var endCol = $(evt.target).data('col') * 1
				}

				$('#selectDiv').hide()
				isSelect = false

				// 对选中的单元格添加active
				var minRow = Math.min(startRow, endRow)
				var maxRow = Math.max(startRow, endRow)
				var minCol = Math.min(startCol, endCol)
				var maxCol = Math.max(startCol, endCol)
				
				if(Math.abs(_x-startX)>5&&Math.abs(_y-startY)>5){
					vm.rowHead.map((item,index)=>{
						item.active = false
						if(item.id<=maxRow&&item.id>=minRow){
							item.active = true
						}
					})
					vm.colHead.map((item,index)=>{
						item.active = false
						if(item.id<=maxCol&&item.id>=minCol){
							item.active = true
						}
					})
//					let temDom = $('.active')
					var temDom
					vm.$nextTick(function(){
						temDom = $('.cell.active')
						temDom = Array.from(temDom)
						vm.currentDom = temDom
					})
				}
				clearEventBubble(evt)
			})
		})
	}

	var vm = new Vue({
		el: '#vm',
		data() {
			return {
				rowHead: [], // 表格头部 行
				colHead: [], // 表格头部列

				currentDom: [], // 当前选中的dom
				
				
			}
		},
		created() {
			var _this = this
			this.rowHead = createTableArrWithObj(30)
			this.colHead = createTableArrWithObj(30)
			
			
		},
		mounted(){
			
			let _this = this
			
			$.getJSON('../static/json/test.json').then(res=>{
				var row1col1 = $('td#row1-col1')
				_this.currentDom = []
				
				for (let row=1;row<=2;row++){
					for (let col=1;col<=14;col++){
						_this.currentDom.push($(`td#row${row}-col${col} .cell`))
						
					}
				}
//							_this.currentDom.push($('td#row1-col1 input'))
//							_this.currentDom.push($('td#row2-col13 input'))
				_this.mergeCell()
//							row1col1.attr('colspan',13)
//							row1col1.attr('rowspan',2)
				row1col1.find('.cell').css({
					'text-align':'center',
					'font-size': '18px'
				})
				for (let i=3;i<=10;i++){
					$(`td#row${i}-col1 .cell`).css('background-color','#BCBEC6')
				}
				for (let i=1;i<=14;i++){
					$(`td#row3-col${i} .cell`).css('background-color','#BCBEC6')
				}
				var img = new Image()
				img.src = '../static/img/xiexian.png'
				img.style.width = '100px'
				img.style.height = '30px'
				
				$('td#row3-col1').find('.cell').hide()
				$('td#row3-col1').append(img)
				
				
				_this.rowHead[0].rowData[0] = '福建电网主要水库单库蓄能计算表'
				
				res.test.map((item,index)=>{
//                  	_this.rowHead[index].rowData = [1,2,3,4]
                	let _index = 0
					for (let key in item) {
						if(index === 0) {
//							_this.rowHead[index+2].rowData[_index] = key
							_this.rowHead[index+2].rowData.splice(_index,1,key)
						}
//						_this.rowHead[index+3].rowData[_index] = item[key]
						_this.rowHead[index+3].rowData.splice(_index,1,item[key])
						_index++
					}
                })
			})
			
		},
		methods: {
			
			
			
			
			
			// 合并单元格
			mergeCell(event) {
				var maxCol = $(this.currentDom[0]).data('col')*1
				var minCol = $(this.currentDom[0]).data('col')*1
				var maxRow = $(this.currentDom[0]).data('row')*1
				var minRow = $(this.currentDom[0]).data('row')*1
				var areaCol = 0
				var areaRow = 0
				// 获取选中单元格索引最大与最小值
				this.currentDom.map((item)=>{
					maxCol = maxCol>$(item).data('col')*1 ? maxCol : $(item).data('col')*1
					minCol = minCol<$(item).data('col')*1 ? minCol : $(item).data('col')*1
					maxRow = maxRow>$(item).data('row')*1 ? maxRow : $(item).data('row')*1
					minRow = minRow<$(item).data('row')*1 ? minRow : $(item).data('row')*1
				})
				
				areaCol = maxCol - minCol + 1
				areaRow = maxRow - minRow + 1
				
				// 最小的单元格跨行与跨列处理    当前选中单元格保存处理过得元素
				let currentDom_tem = []
				this.currentDom.map((item,index)=>{
					if($(item).data('col') === minCol && $(item).data('row') === minRow){
						$(item).parents('.cell-td').attr('colspan',areaCol)
						$(item).parents('.cell-td').attr('rowspan',areaRow)
						currentDom_tem.push(item)
					} else {
						$(item).parent().hide()
						console.log(index)
					}
				})
				this.currentDom = currentDom_tem
			},
			
			
			
			
			
			
			

			// 表格滚动  head和left随之滚动
			tableScroll(event) {
				let top = event.target.scrollTop;
				let left = event.target.scrollLeft;
				document.getElementById("table-left").scrollTop = top;
				document.getElementById("table-head").scrollLeft = left;
			},

			// 点击单元格
			cellClick(event) {
				var _this = this
				var row = $(event.target).data('row')*1
				var col = $(event.target).data('col')*1
				this.rowHead.map((item,index)=>{
					if(item.id === row){
						return item.active = true
					}
					item.active = false
				})
				this.colHead.map((item,index)=>{
					if(item.id === col){
						return item.active = true
					}
					item.active = false
				})
				this.currentDom = []
				this.currentDom.push(event.target)
				
				if(_this.isFormat){
					// 格式刷模式
					_this.currentDom.map((item)=>{
						for (let key in _this.formatList){
							if(key==='fontFamily'){
								item.style[key] = _this.formatList[key]['value']
							} else {
								item.style[key] = _this.formatList[key]
							}
						}
					})
				}
			}
		}
	})
	var content = document.getElementById('table-body')

	selectDomByDrag()
	//	$.selectDomByDrag(content,'cell')
})