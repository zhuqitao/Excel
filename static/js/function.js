$(function(){

	
	var vm = new Vue({
		el: "#vm",
		data() {
			return {
				functionList:{},       // 函数列表
				functionJuniorList:[], // 二级函数列表
				paramesList:[]         // 参数列表
			}
		},
		created(){
			$.getJSON('../static/json/function.json').then(res=>{
				this.functionList = res
				this.functionJuniorList = res['count']['list']
				this.paramesList = res['count']['list'][0]['parames']
			})
		},
		methods:{
			changeFunctionSeniorType(event){
				var functionType = $(event.target).val()
				this.functionJuniorList = this.functionList[functionType]['list']
			},
			changeFunctionJuniorType(event){
				var functionEngName = $(event.target).val()
				$('.functionName').val(functionEngName)
				this.functionJuniorList.map((item)=>{
					if(item.engName === functionEngName) {
						this.paramesList = item['parames']
					}
				})
			}
		}
	})
})
