/**
 * 基于jQuery的表格控件
 */

(function($){
	var DataTable = function(target, opts){
		$.extend(true, this, {
			target: target || undefined,	// 表格容器
			url: 'undefined',				// URL接口
			searchKeys: {},					// 默认检索条件
			check: true,					// 是否添加复选框
			thead: true,					// 是否使用后台thead
			pagination: {					// 分页配置
				pageSize: 10,
				currentPage: 1,
				pageGroup: [5,10,25,50],
				pageTemplate: '<div class="footer-left"><span>每页显示：</span><div class="down-group"><button type="button" class="selected"><span></span><i class="to-down"></i></button><ul class="dropdown"></ul></div></div><div class="footer-right pagination"><span>总共<i></i>条</span><ul><li class="prev">上一页</li><li class="next">下一页</li></ul></div>',
				complete: function(){},
				bindEvent: function(){}
			},
			ajaxOptions: {					// ajax请求配置
				timeout: 6000,
				async: true,
				type: 'post',
				dataType: 'json',
				data: {}
			},
			pullSuccess: function(){},		// 数据请求成功后回调
			pullComplete: function(){}		// 渲染完成后回调
		}, opts)
		
		this.init()
	}
	
	/**
	 * 初始化
	 */
	DataTable.prototype.init = function(){
		var _opts = $.extend(true, this.ajaxOptions, {
			data: {
				page: this.pagination.currentPage,
				pageSize: this.pagination.pageSize
			}
		})
		$.extend(true, _opts, this.searchKeys)
		
		this.pull(this.url, _opts)
	}
	
	/**
	 * 远程请求数据
	 */
	DataTable.prototype.pull = function(url, opts){
		$.ajax({
			url: url,
			timeout: opts.timeout,
			async: opts.async,
			type: opts.type,
			dataType: opts.dataType,
			data: opts.data,
			context: this,
			beforeSend: function(xhr){
				this.target.find('.cover').remove()
				this.target.append('<div class="cover"></div>')
			},
			success: function(response, status){
				this.fill(response)
				
				this.pullSuccess && this.pullSuccess(response, this)
			},
			error: function(xhr, errorMsg, errObj){
				if(errorMsg === 'timeout'){
					alert('请求超时！')
				} else if(errorMsg === 'parsererror'){
					alert('解析异常！\n' + errObj.message)
				} else {
					alert('未知错误！')
				}
			},
			complete: function(xhr, status){
				this.pullComplete && this.pullComplete(xhr.responseJSON)
				
				this.target.find('.cover').remove()
			}
		})
	}
	
	/**
	 * 填充內容
	 */
	DataTable.prototype.fill = function(data){
		var _table = this.target.find('.datatable'),
			content = data.data
		
		if(!content || !content.thead || !content.tbody){
			table.find('tbody').html('<tr><td>暂无数据！</td></tr>')
			return false
		}
		
		if(this.thead){
			_table.find('thead').html(content.thead)
		}
		_table.find('tbody').html(content.tbody)
		
		if(this.check){
			_table.find('thead > tr').prepend('<th style="width:50px;text-align:center"><span class="checkbox" id="selectAll"></span></th>')
			_table.find('tbody tr').prepend('<td style="text-align:center"><span class="checkbox" name="DTCheckbox"></span></td>')
			
			$("#selectAll").off().on('click', function(){
				if($(this).hasClass('checked')){
					_table.find('.checkbox').removeClass('checked')
					_table.find('.checkbox').parents('tr').removeClass('selected')
				} else {
					_table.find('.checkbox').addClass('checked')
					_table.find('.checkbox').parents('tr').addClass('selected')
				}
			})
			_table.find('tbody .checkbox').off().on('click', function(){
				var $this = $(this)
				if($this.hasClass('checked')){
					$this.removeClass('checked')
					$this.parents('tr').removeClass('selected')
				} else {
					$this.addClass('checked')
					$this.parents('tr').addClass('selected')
				}
			})
		}
		
		this.paginate(data)
	}
	
	/**
	 * 重新加载表格
	 */
	DataTable.prototype.refresh = function(isFirst){
		if(isFirst){
			this.pagination.currentPage = 1
		}
		var _opts = $.extend(true, this.ajaxOptions, {
			data: {
				page: this.pagination.currentPage,
				pageSize: this.pagination.pageSize
			}
		})
		$.extend(true, _opts.data, this.searchKeys)
		
		this.pull(this.url, _opts)
	}
	
	/**
	 * 根据关键字重新加载表格
	 */
	DataTable.prototype.search = function(extra, isSetAsSearchKey){
		var _opts = $.extend(true, this.ajaxOptions, {
			data: {
				page: 1,
				pageSize: this.pagination.pageSize
			}
		})
		$.extend(true, _opts.data, extra)
		
		if(isSetAsSearchKey){		// 为true，则把检索key替换
			this.emptySearchKeys()
			$.extend(true, this.searchKeys, extra)
		}
		
		this.pull(this.url, _opts)
	}
	
	/**
	 * 配置分页
	 */
	DataTable.prototype.paginate = function(data){
		var footer = this.target.find('.pfooter')
		
		footer.html(this.pagination.pageTemplate)
		
		// 默认分页事件
		renderPagination(footer, this, data)
		
		this.pagination.complete && this.pagination.complete(this, data)
		this.pagination.bindEvent && this.pagination.bindEvent(this, data)
	}
	
	/**
	 * 清空查询条件
	 */
	DataTable.prototype.emptySearchKeys = function(){
		this.searchKeys = {}
	}
	
	/**
	 * 分页显示
	 */
	function renderPagination(footer, table, data){
		var pagination = table.pagination,
			htmlString = [],
			totalPage = Math.ceil(data.total / pagination.pageSize),
			pageString = [],
			currPage = pagination.currentPage,
			group,
			i
			
		for(i=0;i<pagination.pageGroup.length;i++){
			group = pagination.pageGroup[i]
			if(group === pagination.pageSize){
				footer.find('.down-group .selected > span').text(group + '条')
				htmlString.push('<li data-page="'+ group +'" class="active">' + group + '条</li>')
			} else {
				htmlString.push('<li data-page="'+ group +'">' + group + '条</li>')
			}
		}
		footer.find('.dropdown').html(htmlString.join(''))
		
		footer.find('.pagination > span > i').text(data.total)
		
		if(currPage === 1){
			footer.find('.pagination .prev').addClass('disabled')
		}
		if(currPage === totalPage){
			footer.find('.pagination .next').addClass('disabled')
		}
		for(i=currPage-1;;i--){
			if(i <= 0){
				break
			}
			if(currPage-i >= 3 && i >= 3){
				pageString.unshift('<li class="leaveout">...</li>')
				pageString.unshift('<li>2</li>')
				pageString.unshift('<li>1</li>')
				break
			}
			pageString.unshift('<li>'+ i + '</li>')
		}
		pageString.push('<li class="active">' + currPage + '</li>')
		for(i=currPage+1;;i++){
			if(i > totalPage){
				break
			}
			if(i-currPage >= 3 && i <= (totalPage-3)){
				pageString.push('<li class="leaveout">...</li>')
				pageString.push('<li>' + (totalPage-1) + '</li>')
				pageString.push('<li>' + totalPage + '</li>')
				break
			}
			pageString.push('<li>'+ i + '</li>')
		}
		
		footer.find('.pagination .prev').after(pageString.join(''))
		
		bindPaginationEvent(footer, table)
	}
	
	
	/**
	 * 绑定事件
	 */
	function bindPaginationEvent(footer, table){
		footer.find('.down-group .selected').off().on('click', function(){
			$(this).parent().find('.dropdown').show()
		})
		footer.find('.down-group .dropdown > li').off().on('click', function(){
			var page = $(this).data('page')
			
			table.pagination.pageSize = page
			
			$(this).parent().hide()
			
			table.refresh(true)
		})
		
		table.target.find('.pagination > ul > li').not('.disabled,.active,.leaveout').off().click('click', function(){
			var $this = $(this)
			if($this.hasClass('prev')){
				--table.pagination.currentPage
			} else if($this.hasClass('next')){
				++table.pagination.currentPage
			} else {
				table.pagination.currentPage = parseInt($.trim($this.text()))
			}
			table.refresh(false)
		})
	}
	
	window.DataTable = DataTable
})(jQuery)