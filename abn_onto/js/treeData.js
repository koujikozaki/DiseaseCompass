/**
 *
 */

var TreeData = function(idhead){
	this.idhead = idhead;
	this.clean();
};

TreeData.prototype.clean = function(){
	this.treeData = {};
	this.rootNode = undefined;
	this.labelList = {};
	this.resourceList = {};
	this.currentid = 0;

};

/**
 * 自ノードデータに子ノードデータを追加する
 * @param myID
 * @param childID
 */
TreeData.prototype.addSubClass = function(myID, childID){
	var myNode = this.getNodeJson(myID);

	if (this.rootNode == null){
		this.rootNode = myNode;
	}

	var childNode = this.getNodeJson(childID);
	this.addChildren(myNode, childNode);
};

/**
 * 自ノードデータに子ノードデータ配列を追加する
 * @param myID		自ノードID
 * @param childrenID	子ノードID配列
 */
TreeData.prototype.addSubClasses = function(myID, childrenID){
	var myNode = this.getNodeJson(myID);

	if (this.rootNode == null){
		this.rootNode = myNode;
	}

	for (var i=0; i<childrenID.length; i++){
		var childNode = this.getNodeJson(childrenID[i]);
		this.addChildren(myNode, childNode);
	}
};

/**
 * 自ノードデータの親を設定する
 * @param myID		自ノードID
 * @param parentID	親ノードID
 */
TreeData.prototype.setSuperClass = function(myID, parentID){
	var myNode = this.getNodeJson(myID);

	var parentNode = this.getNodeJson(parentID);

	if (this.rootNode == null){
		this.rootNode = parentNode;
	}


	if (this.rootNode == myNode){
		this.rootNode = parentNode;
	}

	this.addChildren(parentNode, myNode);


};

/**
 * ノードIDからノードを取得・生成する。
 * @param node
 * @returns {___anonymous1517_1574}
 */
TreeData.prototype.getNodeJson = function(id){

	var ret = this.treeData[id];
	if (ret == undefined){
		ret = {'name' : this.labelList[id], 'id' : id, 'resource' : this.resourceList[id], 'open' : false, 'children' : []}; // データ形式はどうにかする
		this.treeData[id] = ret;
	}

	return ret;
};

/**
 *
 * @param label
 * @returns {String}
 */
TreeData.prototype.createNodeID = function(label, res){
	var ret = this.idhead + '_' + (++this.currentid);
	this.labelList[ret] = label;
	this.resourceList[ret] = res;

	return ret;
};

/**
 * ラベルから、それに該当するノードIDを返す
 * @param label
 * @param create
 * @returns
 */
TreeData.prototype.getNodeID = function(label, res, create){
	var ret = null;
	for (var key in this.labelList){
		/*
		if ((label != null && this.labelList[key] == label) &&
				(res != null && this.resourceList[key] == res)){
				*/
		if (res != null && this.resourceList[key] == res){
			if (ret == null){
				ret = key;
			} else {
				if (!(ret instanceof Array)){
					var tmp = [];
					tmp.push(ret);
					ret = tmp;
				}
				ret.push(key);
			}
		}
	}

	if (ret == null && create){
		ret = this.createNodeID(label, res);
	}

	return ret;
};

TreeData.prototype.addChildren = function(parent, child){

	child.parent = parent;
	if (parent.children.indexOf(child) < 0){
		// 親に子が追加済みでなければ追加
		parent.children.push(child);
	}
};


/**
 * 指定ノードをオープン/クローズする
 * 親が閉じている場合は再帰的に開く
 * @param node
 * @param isOpen
 */
TreeData.prototype.open = function(id, isOpen){
	if (isOpen == undefined){
		isOpen = true;
	}
	this.treeData[id].open = isOpen;

	if (isOpen){
		// 開く場合のみ再帰的に開く
		var parent = this.treeData[id].parent;

		if (parent != null){
			this.open(parent.id, isOpen);
		}
	}

};

/**
 * 指定したノードをハイライト/ハイライト解除する
 * @param node
 * @param isHighlight
 */
TreeData.prototype.highlight = function(id, isHighlight){
	if (isHighlight == undefined){
		isHighlight = true;
	}
	this.treeData[id].highlight = isHighlight;

	if (isHighlight){
		this.open(id);
	}

};

/**
 * ハイライトを全解除する
 */
TreeData.prototype.highlightClear = function(){
	for (var id in this.treeData){
		this.treeData[id].highlight = false;
	}
};


