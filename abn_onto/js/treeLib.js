/**
 *
 */

function viewTree(treeId, treeData, cb){
	var node;
	node = treeData.rootNode;

	cleanTree(treeId); // データクリア

	drawTree(node, null, node.id);

	ddtreemenu.createTree("tree_root", true, 5, cb, openCloseCB);


	function openCloseCB(id, isOpen){
		treeData.treeData[id].open = isOpen;
	}
};

function drawTree(node, pid, id, depth){
	if (depth == null){
		depth = 0;
	}

	if (pid == null){
		pid = 'tree_root';
	}

	var sid = id + '_span';
	$('#'+pid).append(
			$('<li><span id="' + sid + '">' + getLabelFromResource(node.name)+'</span></li>')
			.attr({
				'id': id
			})
			);
	if (node.highlight){
		$('#'+sid).addClass('highlight');
	}
	if (node.children.length > 0){
		$('#'+id).append(
				$('<ul></ul>')
				.attr({
					'id': id+'_ul',
					'rel': node.open ? 'open' : 'closed'
				})
				);
		for (var i=0; i<node.children.length; i++){
			drawTree(node.children[i], id+'_ul', node.children[i].id, depth+1);
		}

	}

}

function cleanTree(treeId){
	$('#' + treeId).html('<ul id="tree_root" class="treeview" rel="open"></ul>'); // データクリア
}

function getLabelFromResource(res){
	var index = res.indexOf('#');
	var ret = res;
	if (index >= 0){
		ret = res.substring(index+1);
	}
	return ret;
}