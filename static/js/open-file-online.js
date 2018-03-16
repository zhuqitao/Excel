

$(function(){
	$('.content tbody tr').on('click',function(event){
		$('.content tbody tr').removeClass('active')
		$(this).toggleClass('active')
	})
})
