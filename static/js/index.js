function createTableArrWithObj(length) { // 得到表格头部 第一行的 大写字母
	let arr = []

	for(let i = 0; i < length; i++) {
		let value = String.fromCharCode((65 + i)) // 得到所有字母
		let obj = {
			value: value,
			id: (i + 1),
			active: false,
			rowData: new Array(length),     // 每一行对应的数据
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
				
				isFormat: false, // 是否启用格式刷
				formatList:{},   // 格式刷 包含的格式
				
				// 从弹窗中获取的函数信息
				functionFromIframe:{
					name:'',
					result:''
				},
				
				// 从弹窗中获取的属性绑定信息
				attrFromIframe:{
					name:''
				},
				//从弹窗中获取的值绑定信息
				valueFromIframe:{
					name: ''
				},
				//从弹窗中获取的时间绑定信息
				timeFromIframe:{
					name: ''
				},
				
				// 本地xls文件读取为json数据
				xlsJson: '',
				
				// 样式集合
				tool: {
					fontSize: 14, // 字号
					fontFamily: {
						name: '宋体',
						value: 'SimSun'
					}, // 字体
					bold: 300, // 字体加粗
					fontStyle: 'normal', // 斜体
					textDecoration: 'none', // 下划线
					color: '', // 字体颜色
					backgroundColor: '', // 背景色
					border: '', // 边框
					borderLeft: '', // 左边框
					borderRight: '', // 又边框
					borderTop: '', // 上边框
					borderBottom: '', // 下边框
					alignItems: 'center', // 垂直布局（垂直居中）
					justifyContent: 'flex-start', // 水平布局（水平居中）
					textAlign:'center', // 水平布局
				}
			}
		},
		created() {
			var _this = this
			this.rowHead = createTableArrWithObj(30)
			this.colHead = createTableArrWithObj(30)
		},
		mounted(){
			
			$('.tab-null a').tab();
			$.addTabFixed('pages/index.html', '首页');
			$.addTab('pages/index.html', '新建文件');
			
//			$('#font-color').colpick({
//				layout:'rgbhex',
//				color:'000000', // 默认颜色
//				onSubmit:(hsb,hex,rgb,el)=> {
//					$(el).colpickHide();
//					this.tool.color = `#${$(el).find('.colpick_hex_field input').val()}`
//					this.setCurrentDomWithAttr('color', this.tool.color)
//				}
//			})

			$("#font-color").colorpicker({
	            fillcolor:true,
	            success:(o,color)=>{
	                this.tool.color = color
	                this.setCurrentDomWithAttr('color', this.tool.color)
	            }
	        });

			
//			$('#bg-color').colpick({
//				layout:'rgbhex',
//				color:'ffffff', // 默认颜色
//				onSubmit:(hsb,hex,rgb,el)=> {
//					$(el).colpickHide();
//					this.tool.backgroundColor = `#${$(el).find('.colpick_hex_field input').val()}`
//					this.setCurrentDomWithAttr('backgroundColor', this.tool.backgroundColor)
//				}
//			})

			$("#bg-color").colorpicker({
	            fillcolor:true,
	            success:(o,color)=>{
	                this.tool.backgroundColor = color
	                this.setCurrentDomWithAttr('backgroundColor', this.tool.backgroundColor)
	            }
	        });
	        
		},
		watch: {
			functionFromIframe:{
				handler: function(val,oldVal){
					this.currentDom.map((item)=>{
						$(item).val(val.name)
					})
				},
				deep: true
			},
			attrFromIframe:{
				handler: function(val,oldVal){
					this.currentDom.map((item)=>{
						let row = $(item).data('row') - 1
						let col = $(item).data('col') - 1
						this.rowHead[row].rowData[col] = val.name
						
//						$(item).html(val.name)
					})
				},
				deep: true
			},
			valueFromIframe:{
				handler: function(val,oldVal){
					this.currentDom.map((item)=>{
						$(item).html(val.name)
					})
				},
				deep: true
			},
			timeFromIframe:{
				handler: function(val,oldVal){
					this.currentDom.map((item)=>{
						$(item).html(val.name)
					})
				},
				deep: true
			}
		},
		methods: {
			// 切换头部菜单
			switchMenu(event) {
				let toolID = $(event.target).data('con')

				$(event.target).siblings().removeClass('active')
				$(event.target).addClass('active')

				$(`.head .tool .tool-box`).hide()
				$(`.head .tool .tool-box[id=${toolID}]`).css('display','flex')
			},

			// 打开所有工具的tool-list 下拉年代单
			openToolList(event) {
				event.stopPropagation()
				$(event.target).parents('.tool-item').find('.tool-list').toggle()
			},

			// 给当前选中dom赋值属性  （字体  字号  布局等。。。）
			setCurrentDomWithAttr(attrName, attrValue) {
				this.currentDom.map((item, index) => {
					item.style[attrName] = attrValue
				})
			},
			
			// 保存文件
			saveFile(event){
				var urlObject = window.URL || window.webkitURL || window;

			    var export_blob = new Blob(['test']);
			
			    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
			    
			    var ev = document.createEvent("MouseEvents");
			    ev.initMouseEvent(
		        "click", true, false, window, 0, 0, 0, 0, 0
		        , false, false, false, false, 0, null
		        );
			        
			    save_link.href = urlObject.createObjectURL(export_blob);
			    save_link.download = 'test.xls';
			    save_link.dispatchEvent(ev);
			},
			
			//在线保存文件
			saveFileOnline(event){
				setTimeout(function(){
					layer.msg('保存成功')
				},300)
			},
			
			// 打开本地文件
			openFile(event){
				$('#openFile').click()
			},
			// 读取本地文件
			readFile(event){
				var _this = this
				var wb;//读取完成的数据
            	var rABS = false; //是否将文件读取为二进制字符串
            	var obj = event.target
				
				function fixdata(data) { //文件流转BinaryString
	                var o = "",
	                    l = 0,
	                    w = 10240;
	                for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
	                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
	                return o;
	            }
				
                if(!obj.files) {
                    return;
                }
                var f = obj.files[0];
                var reader = new FileReader();
                reader.onload = function(e) {
                    var data = e.target.result;
                    if(rABS) {
                        wb = XLSX.read(btoa(fixdata(data)), {//手动转化
                            type: 'base64'
                        });
                    } else {
                        wb = XLSX.read(data, {
                            type: 'binary'
                        });
                    }
                    //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
                    //wb.Sheets[Sheet名]获取第一个Sheet的数据
                    
                    // 把转化的json数据绑定到表格的rowHead中
                    _this.xlsJson = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])


                    _this.xlsJson.map((item,index)=>{
//                  	_this.rowHead[index].rowData = [1,2,3,4]
                    	let _index = 0
						for (let key in item) {
							_this.rowHead[index].rowData[_index] = item[key]
							_index++
						}
                    })
                   
                };
                if(rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }
			},
			// 预览
			preview(event){
				var _this = this
//				layer.open({
//					type: 2,
//					title: '在线打开',
//					shadeClose: true,
//					shade: 0,
//					area: ['600px', '500px'],
//					content: 'pages/choose-time.html', //iframe的url
//					btn:['确认','取消'],
//					yes: (index,layero) => {
//						layer.close(index)
//						
//						var body = layer.getChildFrame('body', index)
//						
//					}
//				}); 
				
				layer.open({
					type:2,
					area: ['90%', '90%'],
					content: 'pages/preview.html',
					btn:['确认','取消'],
					yes: (index, layero) => {
						layer.close(index)
					}
					
				})
			},
			
			// 打开 在线
			openFileOnline(event){
				var _this = this
				layer.open({
					type: 2,
					title: '在线打开',
					shadeClose: true,
					shade: 0,
					area: ['600px', '500px'],
					content: 'pages/open-file-online.html', //iframe的url
					btn:['确认','取消'],
					yes: (index,layero) => {
						layer.close(index)
						var body = layer.getChildFrame('body', index)
						$.getJSON('static/json/new-report.json').then(res=>{
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
							for (let i=3;i<=4;i++){
								$(`td#row${i}-col1 .cell`).css('background-color','#BCBEC6')
							}
							for (let i=1;i<=14;i++){
								$(`td#row3-col${i} .cell`).css('background-color','#BCBEC6')
							}
							var img = new Image()
							img.src = 'static/img/xiexian.png'
							img.style.width = '100px'
							img.style.height = '30px'
							
							$('td#row3-col1').find('.cell').hide()
							$('td#row3-col1').append(img)
							
							
							_this.rowHead[0].rowData[0] = '福建电网主要水库单库蓄能计算表'
							
							res.data.map((item,index)=>{
		//                  	_this.rowHead[index].rowData = [1,2,3,4]
		                    	let _index = 0
								for (let key in item) {
									if(index === 0) {
//										_this.rowHead[index+2].rowData[_index] = key
										_this.rowHead[index+2].rowData.splice(_index,1,key)
									}
//									_this.rowHead[index+3].rowData[_index] = item[key]
									_this.rowHead[index+3].rowData.splice(_index,1,item[key])
									_index++
								}
		                    })
							console.log(_this.rowHead)
							this.$nextTick(()=>{
							})
						})
					}
				}); 
//				_this.rowHead[0].rowData[0] = '1'
			},
			
			// 复制操作
			copy(event){
				document.execCommand("copy")
			},
			// 剪切
			cut(event){
				document.execCommand("cut")
			},
			// 粘贴
			paste(event){
				document.execCommand('Paste','false',null)
			},
			
			// 格式刷
			formatBrush(event){
				if (!this.isFormat) {
					this.isFormat = true
					$('#table-body').css('cursor','pointer')
					this.formatList = this.tool
				} else {
					this.isFormat = false
					$('#table-body').css('cursor','auto')
				}
				
			},
			
			// 打开选择字体
			openFamilyList(event) {
				event.stopPropagation()
				$(event.target).parents('.family').find('.tool-list').toggle()
			},
			// 打开字号选择器
			openSizeList(event) {
				event.stopPropagation()
				$(event.target).parents('.size').find('.tool-list').toggle()
			},
			// 打开选择边框
			openBorder(event) {
				event.stopPropagation()
				$(event.target).parents('.border').find('.tool-list').toggle()
			},

			// 选择字体
			choseFontFamily(event) {
				this.tool.fontFamily.name = $(event.target).text()
				this.tool.fontFamily.value = $(event.target).data('family')
				this.setCurrentDomWithAttr('font-family', this.tool.fontFamily.value)
			},
			// 选择字号
			choseFontSize(event) {
				this.tool.fontSize = $(event.target).text() + 'px'
				this.setCurrentDomWithAttr('fontSize', this.tool.fontSize)
			},
			// 快捷键 增加字号
			addFontSize(event) {
				this.tool.fontSize = this.tool.fontSize*1+1
				this.setCurrentDomWithAttr('fontSize', this.tool.fontSize + 'px')
			},
			// 快捷键 减小字号
			minusFontSize(event) {
				this.tool.fontSize -= 1
				this.setCurrentDomWithAttr('fontSize', this.tool.fontSize + 'px')
			},
			// 加粗
			choseBold(event) {
				event.stopPropagation()
				if($(event.target).hasClass('active')) {
					this.tool.fontWeight = 300
				} else {
					this.tool.fontWeight = 600
				}
				this.setCurrentDomWithAttr('fontWeight', this.tool.fontWeight)
				$(event.target).toggleClass('active')
			},
			// 斜体
			choseItalic(event) {
				if($(event.target).hasClass('active')) {
					this.tool.fontStyle = 'normal'
				} else {
					this.tool.fontStyle = 'italic'
				}
				this.setCurrentDomWithAttr('font-style', this.tool.fontStyle)
				$(event.target).toggleClass('active')
			},
			// 下划线
			choseUnderline(event) {
				if($(event.target).hasClass('active')) {
					this.tool.textDecoration = 'none'
				} else {
					this.tool.textDecoration = 'underline '
				}
				this.setCurrentDomWithAttr('textDecoration', this.tool.textDecoration)
				$(event.target).toggleClass('active')
			},
			// 取消边框
			cancelBorder(event) {
				this.tool.border = 'none'
				this.setCurrentDomWithAttr('border', this.tool.border)
			},
			// 添加四周边框
			addBorder(event) {
				this.tool.border = 'solid 1px #333'
				this.setCurrentDomWithAttr('border', this.tool.border)
			},
			// 添加左边框
			leftBorder(event) {
				this.tool.borderLeft = 'solid 1px #333'
				this.setCurrentDomWithAttr('borderLeft', this.tool.borderLeft)
			},
			// 添加右边框
			rightlBorder(event) {
				this.tool.borderRight = 'solid 1px #333'
				this.setCurrentDomWithAttr('borderRight', this.tool.borderRight)
			},
			// 添加上边框
			topBorder(event) {
				this.tool.borderTop = 'solid 1px #333'
				this.setCurrentDomWithAttr('borderTop', this.tool.borderTop)
			},
			// 添加下边框
			bottomBorder(event) {
				this.tool.borderBottom = 'solid 1px #333'
				this.setCurrentDomWithAttr('borderBottom', this.tool.borderBottom)
			},

			// 布局
			// 上居中
			flexTop(event) {
				this.tool.alignItems = 'flex-start'
				this.setCurrentDomWithAttr('alignItems', this.tool.alignItems)
			},
			// 垂直居中
			flexMiddle(event) {
				this.tool.alignItems = 'center'
				this.setCurrentDomWithAttr('alignItems', this.tool.alignItems)
			},
			// 下居中
			flexBottom(event) {
				this.tool.alignItems = 'flex-end'
				this.setCurrentDomWithAttr('alignItems', this.tool.alignItems)
			},
			// 左居中
			flexLeft(event) {
				this.tool.textAlign = 'left'
				this.setCurrentDomWithAttr('textAlign', this.tool.textAlign)
			},
			// 水平居中
			flexCenter(event) {
				this.tool.textAlign = 'center'
				this.setCurrentDomWithAttr('textAlign', this.tool.textAlign)
			},
			// 右居中
			flexRight(event) {
				this.tool.textAlign = 'right'
				this.setCurrentDomWithAttr('textAlign', this.tool.textAlign)
			},
			// 两边布局
			flexBetween(event) {
				this.tool.textAlign = 'justify'
				this.setCurrentDomWithAttr('textAlign', this.tool.textAlign)
			},
			
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
					}
				})
				this.currentDom = currentDom_tem
			},
			// 拆分单元格
			splitCell(event){
				var cols,rows
				if(this.currentDom.length===1){
					cols = $(this.currentDom[0]).attr('colspan')
					rows = $(this.currentDom[0]).attr('rowspan')
					$(this.currentDom[0]).parent().attr('colspan',1)
					$(this.currentDom[0]).parent().attr('rowspan',1)
					$('td').show()
				}
			},
			
			// 选择函数
			choseFunction(event){
				layer.open({
					type: 2,
					title: '选择公式',
					shadeClose: true,
					shade: 0,
					area: ['600px', '500px'],
					content: 'pages/function.html', //iframe的url
					btn:['确认','取消'],
					yes: (index,layero) => {
						var body = layer.getChildFrame('body', index)
						this.currentDom.map((item)=>{
							let row = $(item).data('row') - 1
							let col = $(item).data('col') - 1
							console.log(this.rowHead[row].rowData)
							this.rowHead[row].rowData.splice(col,1,body.find('.functionName').val())
						})
//						this.functionFromIframe.name = body.find('.functionName').val()
						layer.close(index)
					}
				}); 
			},
			
			// 绑定属性
			attrBind(event,name){
				var url = ''
				if(name){
					url = `pages/attr-bind.html?name=${name}`
				} else {
					url = `pages/attr-bind.html`
				}
				layer.open({
					type: 2,
					title: '绑定属性',
					shadeClose: true,
					shade: 0,
					area: ['500px', '500px'],
					content: url, //iframe的url
					btn:['确认','取消'],
					success: function (layero, index){
						var body = layer.getChildFrame('body', index)
						body.find("#name").val(name)
						
					},
					yes: (index,layero) => {
						var body = layer.getChildFrame('body', index)
						this.currentDom.map((item)=>{
							let row = $(item).data('row') - 1
							let col = $(item).data('col') - 1
							this.rowHead[row].rowData.splice(col,1,body.find('.attrName').val())
//							this.rowHead[row].rowData[col] = body.find('.attrName').val()
						})
//						this.attrFromIframe.name = body.find('.attrName').val()
                        layer.close(index)
					}
				}); 
			},
			
			// 绑定值
			valueBind(event,name){
				var url = ''
				if(name){
					url = `pages/value-bind.html?name=${name}`
				} else {
					url = `pages/value-bind.html`
				}
				layer.open({
					type: 2,
					title: '绑定值',
					shadeClose: true,
					shade: 0,
					area: ['490px', '500px'],
					content: url, //iframe的url
					btn:['确认','取消'],
					success: function (layero, index){
						var body = layer.getChildFrame('body', index)
						body.find("#name").val(name)
						
					},
					yes: (index,layero) => {
						var body = layer.getChildFrame('body', index)
						this.currentDom.map((item)=>{
							let row = $(item).data('row') - 1
							let col = $(item).data('col') - 1
							this.rowHead[row].rowData.splice(col,1,body.find('.valueName').val())
//							this.rowHead[row].rowData[col] = body.find('.valueName').val()
						})
//						this.valueFromIframe.name = body.find('.valueName').val()
						layer.close(index)
					}
				}); 
			},
			
			// 时间绑定
			timeBind(event,name){
				var url = ''
				if(name){
					url = `pages/time-bind.html?name=${name}`
				} else {
					url = `pages/time-bind.html`
				}
				layer.open({
					type: 2,
					title: '绑定时间',
					shadeClose: true,
					shade: 0,
					area: ['490px', '500px'],
					content: url, //iframe的url
					btn:['确认','取消'],
					success: function (layero, index){
						var body = layer.getChildFrame('body', index)
						body.find("#name").val(name)
					},
					yes: (index,layero) => {
						var body = layer.getChildFrame('body', index)
						this.currentDom.map((item)=>{
							let row = $(item).data('row') - 1
							let col = $(item).data('col') - 1
							this.rowHead[row].rowData.splice(col,1,body.find('.timeName').val())
//							this.rowHead[row].rowData[col] = body.find('.timeName').val()
						})
//						this.timeFromIframe.name = body.find('.timeName').val()
                       layer.close(index)
					}
				});
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