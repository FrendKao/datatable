# datatable

###基于jquery的表格操作控件

1. HTML基本结构：
`
  <div class="datatable-container" id="example-datatable">
  	<table class="datatable label-table"></table>
  	<div class="pfooter"></div>
  	<div class="clear"></div>
  </div>
`
2. 引入文件：
  <link href="datatable/css/datatable.css" type="text/css" rel="stylesheet">
  <script type="text/javascript" src="datatable/js/datatable.js"></script>
  
3. 调用方式：
  var dt = new DataTable($("#cdLabelDataTable"),{
	url: 'data.json',
	check: false,
	ajaxOptions: { type: 'get' },
	pullComplete: function(){
		
	}
  })
	
4. 参数/方法说明：
>
`new DataTable(target, opts)
  target：jquery object,表格容器
  opts：object,设置参数
	url：string,请求数据的URL接口
	searchKeys：object,默认检索条件, {}
	check：boolean,是否添加复选框，默认加上(true)
	pagination：object,分页对象
	  pageSize：number,分页大小，默认10
	  currentPage：number,当前页，初始值1
	  pageGroup：array,可选择的分页大小分组，默认[5,10,25,50]
	  template: string,分页模板
	  complete：function,分页模板载入完成之后的回调
	  bindEvent：function,自定义分页模板事件绑定接口
	ajaxOptions：object,jquery ajax配置，默认请求方式post
	pullSuccess：function,数据请求成功后回调，参数(response, this)
	pullComplete：function,渲染完成后回调，参数(jsonObj)`
5. 方法：
  *resfresh：重新加载表格，参数：isFirst(默认false):是否从第一页开始加载*
  *search：根据关键字重新加载表格，参数：extra:附加查询条件,isSetAsSearchKey:是否设为默认查询条件(默认flase)*
  *emptySearchKeys：清空查询条件*
6. 接口格式：
`{
	"successful: "true",
	"total": 1,
	"data": "html_string"
}`
>备注：我们的后台接口与DataTable.js的要求的接口可能不一致，需要添加：
`var dt = new DataTable($('#cdDataTable'),{
	url: '/assets/json/cd_data.json',
	check: false,
	ajaxOptions: { type: 'get' },
	format: function(resp){
		return {
			successful: resp.code == 0,
			total: resp.data.total,
			data: resp.data.content
		}
	},
	pullComplete: function(){
		
	}
})`

