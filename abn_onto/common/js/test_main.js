/**
 *
 */

String.prototype.replaceAll = function (org, dest){
  return this.split(org).join(dest);
};

var treeData;


$(window).load(function() {
	treeData = new TreeData('tree');
	$('#btn1').click(function(event){
		findFromAny('http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#汎用異常状態');
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

});


function findFromAny(res){

	find_upperclasses(escapeResource(res));


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
		'select ?o '+
//		'{ <' + resource + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> ?o. }';
		'{ ?o <http://www.w3.org/2000/01/rdf-schema#subClassOf> <' + resource + '>. }';
//		'{ ?s <http://www.w3.org/2000/01/rdf-schema#subClassOf> ?o. }';


	qr = sendQuery('http://lod.hozo.jp/repositories/abn_test',query);
//	qr = sendQuery('http://133.1.32.54:10035/repositories/abn_test',query);
	qr.fail(
		function (xhr, textStatus, thrownError) {
			alert("Error: A '" + textStatus+ "' occurred.");
		}
	);
	qr.done(
		function (d) {
			var data = d.results.bindings;

			var propStr = '';
			var prop = '';

			for (var i=0; i<data.length; i++){
				var child = data[i].o.value;
				/*
				treeData.addSubClasses(resource, child);

//				viewTree();
				updateTree();

				find_subclasses(child);
				*/
				if (child.indexOf('<') == 0){
					child = child.substring(1, child.length-1);
				}

				treeData.addSubClass(treeData.getNodeID(resource, true), treeData.getNodeID(child, true));

				updateTree();

				find_subclasses(child);

			}

		}
	);

}


function find_upperclasses(resource){
	var query =
		'select ?o '+
		'{ <' + resource + '> <http://www.w3.org/2000/01/rdf-schema#subClassOf> ?o. }';


	qr = sendQuery('http://lod.hozo.jp/repositories/abn_test',query);
//	qr = sendQuery('http://133.1.32.54:10035/repositories/abn_test',query);
	qr.fail(
		function (xhr, textStatus, thrownError) {
			alert("Error: A '" + textStatus+ "' occurred.");
		}
	);
	qr.done(
		function (d) {
			var data = d.results.bindings;

			for (var i=0; i<data.length; i++){
				var parent = data[i].o.value;
				if (parent.indexOf('<') == 0){
					parent = parent.substring(1, parent.length-1);
				}

				treeData.setSuperClass(treeData.getNodeID(resource, true), treeData.getNodeID(parent, true));

				updateTree();

				find_upperclasses(parent);
			}

		}
	);
/*
//	qr = sparqlQueryJson('http://133.1.32.54:10035/repositories/abn_test',query, function(data){
	qr = sparqlQueryJson('http://lod.hozo.jp/repositories/abn_test',query, function(d){
		var data = d.values;
		for (var i=0; i<data.length; i++){
			var parent = data[i][0];

			if (parent.indexOf('<') == 0){
				parent = parent.substring(1, parent.length-1);
			}

			treeData.setSuperClass(treeData.getNodeID(resource, true), treeData.getNodeID(parent, true));

			updateTree();

			find_upperclasses(parent);
		}
	});
*/
}

function updateTree(){
	viewTree('tree', treeData, function(id){
		// ノードクリック時イベント
	});
}