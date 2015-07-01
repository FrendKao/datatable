# datatable

基于jquery的表格操作控件

HTML基本结构：

  <div class="datatable-container" id="example-datatable">
  	<table class="datatable label-table"></table>
  	<div class="pfooter"></div>
  	<div class="clear"></div>
  </div>

引入文件：
  <link href="datatable/css/datatable.css" type="text/css" rel="stylesheet">
  <script type="text/javascript" src="datatable/js/datatable.js"></script>
  
调用方式：
  var dt = new DataTable($("#cdLabelDataTable"),{
		url: 'data.json',
		check: false,
		ajaxOptions: { type: 'get' },
		pullComplete: function(){
			
		}
	})
	
参数/方法说明：
