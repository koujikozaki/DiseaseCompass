/**
 *
 */

String.prototype.replaceAll = function (org, dest){
  return this.split(org).join(dest);
};

var treeData;

var endpoint = 'http://lod.hozo.jp/repositories/abn_test20141006';
var queryHead = 'prefix rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n'+
				'prefix rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n'+
				'prefix owl:<http://www.w3.org/2002/07/owl#>\n'+
				'prefix medo:<http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#>\n';

var concepts = [];

var lang = 'ja';

var leftCount = 0;

$(window).load(function() {
	treeData = new TreeData('tree');
	/*
	$('#btn1').click(function(event){
		findFromAny('medo:構造関連異常');
	});
	$('#btn2').click(function(event){
		findToLeaf('http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#汎用異常状態');
	});
	$('#btn3').click(function(event){
		clearTree();
	});

	$('#btn4').click(function(event){
		treeData.highlight('tree_40');
		updateTree();
	});
*/
	initConceptList();

	for (var i=0; i<concepts.length; i++){
		findFromStop(concepts[i].resource, 'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#1249288935863_n335');
		findToLeaf(concepts[i].resource);

	}
//	findFromStop('http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#機能関連異常【機能障害】', 'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#汎用異常状態');

//	findToLeaf('http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#汎用異常状態');

	$('#find_do').click(function(event){
//		find_propertyResource('medo:構造関連異常', 'medo:has_属性', '属性');
		find();
	});

	show_progress();

});


function initConceptList(){
	/*
	concepts.push({name:'Structural Abnormality', resource:'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#構造関連異常'});
	concepts.push({name:'Functional Abnormality', resource:'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#機能関連異常【機能障害】'});
	concepts.push({name:'Other Abnormality', resource:'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#その他汎用異常'});
	concepts.push({name:'　Parametric Abnormality', resource:'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#属性値関連異常【パラメーター異常】'});
	concepts.push({name:'　Behavior / Motion', resource:'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#行為_動作関連異常'});
	concepts.push({name:'　Phenomenal Abnormality', resource:'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#現象関連異常'});
	*/
	concepts.push({name:'Structural Abnormality', resource:'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#1313557707517_n5758'});
	concepts.push({name:'Functional Abnormality', resource:'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#1249288935863_n568'});
	concepts.push({name:'Other Abnormality', resource:'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#1249288935863_n365'});
	concepts.push({name:'　Parametric Abnormality', resource:'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#1249288935863_n574', parent:'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#1249288935863_n365'});
	concepts.push({name:'　Behavior / Motion', resource:'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#1326858178837_n6560', parent:'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#1249288935863_n365'});
	concepts.push({name:'　Phenomenal Abnormality', resource:'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#1365063079974_n22529', parent:'http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#1249288935863_n365'});


	for (var i=0; i<concepts.length; i++){
		if (concepts[i].name.indexOf('　') == 0){
			$('#find_states').append('　');
			concepts[i].name = concepts[i].name.substring(1,concepts[i].name.length);
		}
		$('#find_states').append($('<input>')
		.attr({
			type : 'checkbox',
			name : 'find_states_check',
			id : 'checkbox_'+i,
			checked : 'checked',
			value : concepts[i].resource
		}));
		$('#find_states').append(concepts[i].name + '<br>');
	}
	$('#find_states').change(function(event){
		var srcElement;
		if (document.all){
			srcElement = event.srcElement;
		} else {
			srcElement = event.target;
		}

		var isChecked = $(srcElement).is(':checked');
		var value = $(srcElement).val();

		// このへんの処理はもっと簡単にできるはず

		/*
		・下位レベルの３つのすべてをONすると，Other Abnormalityも
		  連動してONにする
		・下位レベルの３つのいずれがOFFになると，Other Abnormalityも
		  連動してOFFにする


		  ・Other Abnormalityのチェックを「ON/OFF」したら，それに連動して，
		    その下位レベルにある
		    －Parametric Abnormality
		    －Behavior / Motion
		    －Phenomenal Abnormality
		    も連動して，「ON/OFF」されるようにする．
		 */


		if (isChecked){
			// チェック対象をparentに持つconceptをすべて確認する
			var chk = true;

			var hitId = find_resource_by_value(value);
			if (hitId != null){
				var concept = concepts[hitId];
				if (concept.parent != null){
					var parent = concepts[find_resource_by_value(concept.parent)]; // nullはありえない前提
					for (var i=0; i<concepts.length; i++){
						if (concepts[i].parent == parent.resource){
							var p = find_input_by_value(concepts[i].parent);
							if (p != null){
								p = find_input_by_value(concepts[i].resource);
								if (p != null){
									if (!p.is(':checked')){
										// 対象外
										chk = false;
										break;
									}
								}
							}
						}
					}
				}
			}


			if (chk){
				var hitId = find_resource_by_value(value);
				if (hitId != null){
					var concept = concepts[hitId];

					if (concept.parent != null){
						var p = find_input_by_value(concept.parent);
						if (p != null){
							p.attr('checked', (isChecked ? 'checked' : false));
						}
					}
				}
			}

		} else {
		// チェック対象のparentをチェックする
			var hitId = find_resource_by_value(value);
			if (hitId != null){
				var concept = concepts[hitId];

				if (concept.parent != null){
					var p = find_input_by_value(concept.parent);
					if (p != null){
						p.attr('checked', (isChecked ? 'checked' : false));
					}
				}
			}
		}
		// チェック対象をparentに持つconceptをすべてチェックする
		for (var i=0; i<concepts.length; i++){
			if (concepts[i].parent != null){
				var p = find_input_by_value(concepts[i].parent);
				if (p != null){
					if (p.val() == value){
						p = find_input_by_value(concepts[i].resource);
						if (p != null){
							p.attr('checked', (isChecked ? 'checked' : false));
						}
					}
				}
			}
		}

	});

	function find_resource_by_value(val){
		for (var i=0; i<concepts.length; i++){
			if (concepts[i].resource == val){
				return i;
			}
		}
		return null;

	}

	function find_input_by_value(val){
		for (var i=0; i<concepts.length; i++){
			if ($('#checkbox_'+i) != null){
				if (val == $('#checkbox_'+i).val()){
					return $('#checkbox_'+i);
				}
			}
		}
		return null;

	}

}


function findFromStop(res, stop){

	find_upperclasses(escapeResource(res), stop);


}

function findToLeaf(res){

	find_subclasses(escapeResource(res));
}

function clearTree(){
	treeData.clean();
	cleanTree('tree'); // データクリア

}

function escapeResource(url){
	/*
	var index = url.lastIndexOf('#');

	if (index < 0 && url.indexOf('http') != 0 ){
		index = url.lastIndexOf(':');
	}

	if (index < 0){
		index = url.lastIndexOf('/');
	}

	if (index > 0){
		var head = url.substring(0, index+1);
		var res = url.substring(index+1);
		res = escape(res);
		res = res.replaceAll('%', '\\');
	} else {
		return url;
	}

	return head + res;
	*/
	return url;
}

function unescapeResource(url){
/*
	var index = url.lastIndexOf('#');

	if (index > 0){
		var head = url.substring(0, index+1);
		var res = url.substring(index+1);
		res = res.replaceAll('\\', '%');
		res = unescape(res);
	} else {
		return url;
	}

	return head + res;
*/
	return url;

}




function find_subclasses(resource){
	var query =
		queryHead +
		'select ?o ?olabel ?rlabel'+
		'{\n' +
		makeResourceFormat(resource) + ' rdfs:label ?rlabel. \n' +
		' FILTER (lang(?rlabel) = "' + lang + '")\n'+
		'?o rdfs:subClassOf ' + makeResourceFormat(resource) + '; \n' +
		' rdfs:label ?olabel.\n'+
		' FILTER (lang(?olabel) = "' + lang + '")\n}';



	increaseCount();
	qr = sendQuery(endpoint,query);
	qr.fail(
		function (xhr, textStatus, thrownError) {
			leftCount --;
			if (leftCount == 0){
				updateTree();
			}
			alert("Error: A '" + textStatus+ "' occurred.");
		}
	);
	qr.done(
		function (d) {
			var left = decreaseCount();

			var data = d.results.bindings;

			if (data.length == 0){
//				updateTree();
			}

			for (var i=0; i<data.length; i++){
				var type = data[i].o.type;
				var child = data[i].o.value;
				var clabel = data[i].olabel.value;
				var rlabel = data[i].rlabel.value;
				/*
				if (clabel.indexOf('<') == 0){
					clabel = clabel.substring(1, clabel.length-1);
				}*/


				if (child == resource){
					// 自分自身が親になっている場合は異常なので無視
					return;
				}

				if (type == 'bnode'){
					// 無名ノードはツリーの関連を探す場合に利用しない
					return;
				}

				if (clabel.substr(clabel.length - '_RH'.length) == '_RH'){
					// "_RH"で終わるリソースは無視。下位もチェックしない。
					return;
				}

				if (rlabel == '管内容物の漏れ'){
					var a;
				}


				treeData.addSubClass(treeData.getNodeID(rlabel, resource, true), treeData.getNodeID(clabel, child, true));


				find_subclasses(child);

			}

			if (left == 0){
				updateTree();
			}

		}
	);
/*
//	qr = sparqlQueryJson('http://133.1.32.54:10035/repositories/abn_test',query, function(data){
	qr = sparqlQueryJson('http://lod.hozo.jp/repositories/abn_test',query, function(d){
		var data = d.values;
		for (var i=0; i<data.length; i++){
			var child = data[i][0];

			if (child.indexOf('<') == 0){
				child = child.substring(1, child.length-1);
			}

			treeData.addSubClass(treeData.getNodeID(resource, true), treeData.getNodeID(child, true));

			updateTree();

			find_subclasses(child);
		}
	});
*/
}


function find_upperclasses(resource, stop){
	var query =
		queryHead +
		'select ?o ?olabel ?rlabel '+
		'{ \n' +
		makeResourceFormat(resource) + ' rdfs:label ?rlabel. \n' +
		' FILTER (lang(?rlabel) = "' + lang + '")\n'+
		makeResourceFormat(resource) + ' rdfs:subClassOf ?o.\n'+
		' ?o rdfs:label ?olabel.\n'+
		' FILTER (lang(?olabel) = "' + lang + '")}';


	increaseCount();
	qr = sendQuery(endpoint,query);
//	qr = sendQuery('http://133.1.32.54:10035/repositories/abn_test',query);
	qr.fail(
		function (xhr, textStatus, thrownError) {
			leftCount --;
			if (leftCount == 0){
				updateTree();
			}
			alert("Error: A '" + textStatus+ "' occurred.");
		}
	);
	qr.done(
		function (d) {
			var left = decreaseCount();

			var data = d.results.bindings;

			if (data.length == 0){
//				updateTree();
			}

			for (var i=0; i<data.length; i++){
				var type = data[i].o.type;
				var parent = data[i].o.value;
				var plabel = data[i].olabel.value;
				var rlabel = data[i].rlabel.value;
				/*
				if (plabel.indexOf('<') == 0){
					plabel = plabel.substring(1, plabel.length-1);
				}*/

				if (type == 'bnode'){
					// 無名ノードはツリーの親を探す場合に利用しない
					return;
				}

				treeData.setSuperClass(treeData.getNodeID(rlabel, resource, true), treeData.getNodeID(plabel, parent, true));
				if (parent == stop){
					// stop終了
					updateTree();
					return;
				}


				find_upperclasses(parent, stop);

			}

			if (left == 0){
				var a;
				updateTree();
			}

		}
	);

}

function find(){

	var checks=[];
	$('[name="find_states_check"]:checked').each(function(){
		checks.push($(this).val());
	});
	if (checks.length == 0){
		return;
	}

	var type = $('#find_type').val();

	var word = $('#find_word').val();
	if (word == ''){
		return;
	}

	treeData.highlightClear();
	updateTree();

	find_propertyResource(checks, type, word);

}



function find_propertyResource(concepts, propType, propName){
	var query =
		queryHead +
//		'select distinct ?x ?xlabel {\n';
		'select distinct ?x ?label (?' + propType + ' as ?xlabel) { \n';

		if (!(concepts instanceof Array)){
		query += '?x rdfs:subClassOf+ ' + makeResourceFormat(concepts) + '.\n';
	} else {

		if (concepts.length == 1){
			query += '?x rdfs:subClassOf+ ' + makeResourceFormat(concepts[0]) + '.\n';
		} else {
			for (var i=0; i<concepts.length; i++){
				query += '{?x rdfs:subClassOf+ ' + makeResourceFormat(concepts[i]) + '.}\n';
				if (i != concepts.length-1){
					query += 'union ';
				}
			}
		}
	}


	query +=
'  ?x rdfs:label ?label; \n' +
'     owl:subClassOf ?b1 . \n' +
'  ?b1 rdf:type owl:Restriction; \n' +
'      owl:allValuesFrom ?b2 . \n' +
'  ?b2 owl:intersectionOf ?b3 . \n' +
'  ?b3 rdf:first ?a; \n' +
'      rdf:rest ?b4 . \n' +
'  ?a  rdfs:label ?alabel. \n' +
'  ?b4 rdf:rest   ?b5; \n' +
'      rdf:first  ?bv . \n' +
'  ?bv rdf:type owl:Restriction; \n' +
'      owl:onProperty medo:has_属性値; \n' +
'      owl:allValuesFrom ?v . \n' +
'  ?v  rdfs:label ?vlabel. \n' +
'  ?b5 rdf:first  ?bo. \n' +
'  ?bo rdf:type owl:Restriction; \n' +
'     owl:onProperty medo:has_対象物; \n' +
'     owl:allValuesFrom ?o . \n' +
'  ?o  rdfs:label ?olabel. \n' +
'  FILTER regex (?' + propType + ', "' + propName + '") \n' +
'  FILTER (lang(?' + propType + ') = "' + lang + '") \n' +
'  FILTER (lang(?label) = "' + lang + '") \n' +
'}';


	qr = sendQuery(endpoint,query);
//	qr = sendQuery('http://133.1.32.54:10035/repositories/abn_test',query);
	qr.fail(
		function (xhr, textStatus, thrownError) {
			alert("Error: A '" + textStatus+ "' occurred.");
		}
	);
	qr.done(
		function (d) {
			var subjects = [];
			var data = d.results.bindings;

			$('ul#find_result_list li').remove(); // 一旦クリア
			$('ul#find_result_list li').unbind('click');


			if (data.length == 0){
				$('ul#find_result_list').append($('<li>Not found.</li>'));
				return;
			}

			for (var i=0; i<data.length; i++){
				var subject = data[i].x.value;
				var slabel;
				if (data[i].xlabel != null){
					slabel = data[i].xlabel.value;
				} else {
					slabel = getLabelFromResource(subject);
				}
				var label = '';
				if (data[i].label != null){
					label = data[i].label.value;
				}

				if (label == '' || slabel == label){
					label = slabel;
				} else {
					label = label + " : " + slabel;
				}

				subjects.push(subject);

				$('ul#find_result_list').append($('<li>' + label + '</li>')
						.attr({
//							value : subject
							value : i
						})
						);

			}

			$('ul#find_result_list li').click(function(event){
				// イベント拾える？
				var isSelected = true;

				var srcElement;

				if (document.all){
					srcElement = event.srcElement;
				} else {
					srcElement = event.target;
				}

				$('ul#find_result_list li').removeClass('selected'); // 選択以外クリア（リスト）

				if (!$(srcElement).hasClass('selected')){
					$(srcElement).addClass('selected');
				} else {
					$(srcElement).removeClass('selected');
					isSelected = false;
				}

				var subject = subjects[srcElement.value];

				var id = treeData.getNodeID(null, subject, false);

				if (id == null){
					return;
				}
				treeData.highlightClear(); // 選択以外クリア（ツリー）
				treeData.highlight(id, isSelected);
				updateTree();

				// treeのスクロール
				/*
				$('#' + treeData.rootNode.id).animate({
					 scrollTop : $('#' + treeData.rootNode.id).scrollTop() + $('#' + id).offset().top - $('#' + treeData.rootNode.id).offset().top
					 }, "fast");
*/
				if (isSelected){
					$('#tree').animate({
						scrollTop:$('#tree').scrollTop() + ($('#' + id).offset().top - 200)
					});
				}


				if (isSelected){
					// 指定データの情報表示
					viewResourceData(id);
				}

			});

		}
	);
}

function updateTree(){
	viewTree('tree', treeData, function(id){
		// ノードクリック時イベント
		viewResourceData(id);


	});
}

function viewResourceData(res){

	var resource = treeData.treeData[res];
	if (resource == null){
		return;
	}
//	resource = resource.name;
	resource = resource.resource;


	treeData.highlightClear(); // 選択以外クリア（ツリー）
	treeData.highlight(res, true);
	updateTree();

	var query =
		queryHead +
		'select distinct (' + makeResourceFormat(resource) + ' as ?s) ?p ?o ?p2 ?o2 ?p3 ?o3 {\n'+
		'{ ' + makeResourceFormat(resource) + ' ?p ?o.}\n' +
		'optional { ?o rdf:type owl:Restriction.\n' +
		'?o ?p2 ?o2}\n' +
		'optional { ?o2 rdf:type owl:Restriction.\n' +
		'?o2 ?p3 ?o3}\n' +
		'}\n';


	qr = sendQuery(endpoint,query);
	qr.fail(
		function (xhr, textStatus, thrownError) {
			alert("Error: A '" + textStatus+ "' occurred.");
		}
	);
	qr.done(
		function (d) {
			var data = d.results.bindings;

			makeTables(d.head.vars, data);

		}
	);
}

var id_table;

function makeTable(headers, data){

	$('#description_panel').html('');

	$('#description_panel').append(
			$('<table></table>')
			.attr({
				'id': 'desc_list',
				'class': 'table'
			})
		);
	var table = $('#desc_list')[0];

	var r=1;

	var items = [];


	// ヘッダ
	var header = table.createTHead();	// 行を追加
	var headerRow = header.insertRow(0);

	for (var j=0; j<headers.length; j++){
		var th = document.createElement('th');
		th.innerHTML = headers[j];
		headerRow.appendChild(th);
	}


	for (var d=0; d<data.length; d++){
		var row = table.insertRow(r++);	// 行を追加

		var datum = data[d];
		for (var j=0; j<headers.length; j++){
			var header = headers[j];
			if (datum[header] != null){
				var cell = row.insertCell(j);	// 1つ目以降のセルを追加

				var item = datum[header];
				cell.innerHTML = item.value;

			}
		}
	}
}


function makeTables(headers, data){
	$('#description_panel').html('');

	id_table = {};
	id_table.head = new Array();
	id_table.elms = {};

	for (var d=0; d<data.length; d++){

		var datum = data[d];

		if (!(datum.o.value in id_table.elms)){
			makeCells(datum.s, datum.p, datum.o);
		}
		if (datum.o2 != null){
			makeCells(datum.o, datum.p2, datum.o2);
		}
		if (datum.o3 != null){
			makeCells(datum.o2, datum.p3, datum.o3);
		}
		function makeCells(s, p, o){

			var table;
			var contents = new Array();
			contents.push(s.value);
			contents.push(p.value);
			contents.push(o.value);
			table = makeATable(contents[0]);

			var row = table.insertRow(++id_table.elms[contents[0]]);	// 行を追加

			for (var j=0; j<contents.length; j++){
				var content = contents[j];
				var cell = row.insertCell(j);	// 1つ目以降のセルを追加

				cell.innerHTML = content;

			}

		}

	}
}


function makeATable(res){
	if (!(res in id_table.elms)){
		id_table.elms[res] = 0;
		id_table.head.push(res);

		$('#description_panel').append(
				$('<table></table>')
				.attr({
					'id': 'desc_list_'+(id_table.head.length),
					'class': 'table'
				})
			);

		var table = $('#desc_list_'+(id_table.head.length))[0];

		var headers = ['Subject', 'Predicate', 'Object'];
		// ヘッダ
		var header = table.createTHead();	// 行を追加
		var headerRow = header.insertRow(0);

		for (var j=0; j<headers.length; j++){
			var th = document.createElement('th');
			th.innerHTML = headers[j];
			headerRow.appendChild(th);
		}
	}

	return $('#desc_list_'+(id_table.head.indexOf(res)+1))[0];

}



function makeResourceFormat(res){
	if (res.indexOf('http') == 0){
		return '<' + res + '>';
	}
	return res;
}

var maxCount = 0;

function increaseCount(){
	++this.leftCount;

	if (this.maxCount < this.leftCount){
		this.maxCount = this.leftCount;
	}

	// TODO プログレス更新
	$('#progress')[0].value = this.maxCount - this.leftCount;
	$('#progress')[0].max = this.maxCount;
	$('#progress').text(Math.round(((this.maxCount - this.leftCount) / this.maxCount) * 100) +'%');


	return this.leftCount;
}

function decreaseCount(){
	--this.leftCount
	// TODO プログレス更新
	$('#progress')[0].value = (this.maxCount - this.leftCount);
	$('#progress')[0].max = this.maxCount;
	$('#progress').text(Math.round(((this.maxCount - this.leftCount) / this.maxCount) * 100) +'%');

	if (this.leftCount == 0){
		hide_progress();
	}

	return this.leftCount;
}

function show_progress(){

	sW = window.innerWidth;
	sH = window.innerHeight;

	$('#progress_div').css('top', ((sH - 100)/2));
	$('#progress_div').css('left', (sW - 300)/2);

	$('#progress_div').width(300 + 'px');
	$('#progress_div').height(100 + 'px');

	$('#bgwindow').show();
	$('#progress_div').show();

}

function hide_progress(){
	$('#bgwindow').hide();
	$('#progress_div').hide();

}
