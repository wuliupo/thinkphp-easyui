/**
 * 公共方法
 */
;(function($){
	$.extend({
		/*Oa模块Js开始*/
		Oa: {
			dialog_1: '#oa-dialog-1',//模态框1
			dialog_2: '#oa-dialog-2',//模态框2

			tip: function(title, msg, icon, timeout, showType){//右下角提示框
				$.messager.progress('close');
				$.messager.show({
					title: title || '提示信息',
					msg: '<div class="messager-icon messager-' + (icon || 'info') + '"></div><div>' + msg + '</div>',
					timeout: timeout || 2000,
					showType: showType || 'slide'
				});
			},
			//切换主题
			theme: function(t){
				var theme = $('#theme').attr('href');
				if(!t || !theme){
					return;
				}
				$('#theme').attr('href', theme.substring(0, theme.indexOf('/themes/')) + '/themes/'+t+'/easyui.css');
				$.cookie('theme', t, {path:'/', expires:3650});
			},
			confirm: function(dofunction, info){
				$.messager.confirm('确认对话框', info || '确定是否要进行此操作吗？', function(r){
					r && eval(dofunction);
				});
			},
			ajax: function(type, url, data, beforeSend, success, error){
				$.ajax({
					type: type || 'post',
					url: url,
					data: data,
					dataType: 'json',
					beforeSend: beforeSend || function(){
						$.messager.progress({text:'处理中，请稍候...'});
					},
					success: success || function(data){
						$.messager.progress('close');
						if(!data.status){
							$.Oa.tip('提示信息', data.info,'error');
						} else {
							$.Oa.tip('提示信息', data.info,'info');
							$($.Oa.dialog_1).dialog('close');
							$.Oa.refresh();
						}
					},
					error: error || function(data){
						$.messager.progress('close');
						$.Oa.tip('提示信息', data.responseText, 'error');
					}
				});
			},

			doForm: function(dom){//添加||编辑数据库信息
				var isValid = $(dom).form('validate');
				if (!isValid){
					return isValid;	// 返回false，终止表单提交
				}
				$.Oa.ajax($(dom).attr('method'), $(dom).attr('action'), $(dom).serialize());
			},

			delData: function(id, url, type){//删除数据库信息
				$.Oa.ajax(type, url, 'id=' + id);
			},

			sess_verify: function(url, jumpurl){//登录过期校验
		        $.post(url, '', function(data) {
		            if(!data.status){
		            	$.messager.progress({text:'登录超时，正在跳转登录页面...'});
		                setTimeout("location.href = '"+jumpurl+"';",1000);
		            }
		        }, 'json');
			},

			loading: function(msg){//正在努力加载中
				return "<div class='oa-loading'>" + (msg || '正在努力加载中...') + '</span>';
			},

			removeLeftMenu: function(stop, titles){//移除左侧菜单
				//加个判断，防止多次点击重复加载
				if(titles === $('body').layout('panel', 'west').panel('options').title){
					return;
				}
				$.each($('#left').accordion('panels'), function(i,n) {
					if(n){
						var t = n.panel('options').title;
						if(titles && titles.length){
							for(var k = 0; k < titles.length; k++){
								if(titles[k] === t) $('#left').accordion('remove', t);
							}
						}else{
							$('#left').accordion('remove', t);
						}
					}
				});
				var pp = $('#left').accordion('getSelected');
				if(pp) {
					var t = pp.panel('options').title;
					if(titles && titles.length){
						for(var k = 0; k < titles.length; k++){
							if(titles[k] === t) $('#left').accordion('remove', t);
						}
					}else{
						$('#left').accordion('remove', t);
					}
				}
				if(!stop){
					this.removeLeftMenu(true, titles);
				}
			},

			openUrl: function(node){//在新tabs窗口打开页面
				if(node.type){
					var tab = $('#oa-tabs');
					if(tab.tabs('exists', node.text)){
						tab.tabs('select', node.text);
					}else{
						tab.tabs('add',{
							title: node.text,
							href: node.url,
							closable: true,
							cache: true,
							tools:[{
						        iconCls:'icon-mini-refresh',
						        handler: $.Oa.refresh
						    }]
						});
					}
				}
			},

			refresh: function(){//刷新当前已选择的Tabs
				var tab = $('#oa-tabs').tabs('getSelected');
				tab.panel('refresh', tab[0]['baseUrl']);
			}
		},
	});
})(jQuery);
