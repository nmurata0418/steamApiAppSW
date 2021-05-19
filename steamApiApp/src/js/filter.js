'use strict'

const $ = require('jQuery')

$(function(){
	$('#button').on("click",function(){
		const re = new RegExp($('#search').val())
		$('#table tbody tr').each(function(){
			const tr = $(this)
			tr.hide()
			$('td', this).each(function(){
				const txt = $(this).html()
				if(txt.match(re) != null){
					tr.show()
				}
			})
		})
	})
})