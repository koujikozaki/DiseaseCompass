/**
 * ある基準の異常状態から、原因・結果を探索してd3.jsのForce型データを生成する
 */

/**
 *
 */
var Relation = function(accessor){
	this.accessor = accessor;
	this.lang = null;

	/**
	 * type 1: 「hasCause/hasResult」のみを辿る＋灰色ノードも辿る
	 * type 2: 「hasProbableCause/hasProbableResult」も辿る＋灰色ノードを辿らない
	 * type 3: 「hasProbableCause/hasProbableResult」のみを辿る＋灰色ノードも辿る
	 * type 4: 「hasProbableCause/hasProbableResult」も辿る＋灰色ノードを辿る
	 */
	this.type = 2;

};

/**
 * データをクリア
 */
Relation.prototype.clean = function(){
	if (this.data != null){
		// TODO データクリア
	}


	this.data = {nodes:[], links:[]};
	this.count = 0;
};

/**
 * 名前文字列から、それに該当する異常状態Subject（複数の可能性アリ）を取得する
 * @param base	基準となる異常状態Subjectから、原因と結果を探索する
 * @param cb	コールバック
 */
Relation.prototype.findIdByName = function(base, cb){

};


/**
 *
 * @param base	基準となる異常状態Subjectから、原因と結果を探索する
 * @param cb	コールバック
 * @param direction	探索方向	(cause/result/both 未指定の場合both)
 * @param type_	検索種別	(this.typeの検索種別に順ずる 未指定の場合this.type)
 */
Relation.prototype.find = function(base, cb, direction, type_){
	this.clean();

	var me = this;

	if (type_ == null){
		type_ = this.type;
	}

	me.addNodes(base); // 自分は無条件に追加

	if (direction == 'cause'){
		this.findCause(base, type_, function(data){

			cb(me.data);
		});
	} else if (direction == 'result'){
		this.findResult(base, type_, function(data){

			cb(me.data);
		});
	} else {
		this.findCause(base, type_, function(data){

			me.findResult(base, type_, function(data){
				cb(me.data);
			});

		});
	}
};

Relation.prototype.findResult = function(base, type_, cb, direction, depth){
	var dir_ = direction;
	if (dir_ == null){
		dir_ = 'result';
	}
	if (depth == null){
		depth = 0;
	}

	var query =
		'prefix hzdo:<http://www.hozo.jp/ontology/DiseaseOntology#>\n'+
		'select (<'+ base + '> as ?rsn) ?lrsn ?rslt ?lrslt {'+
		' <'+ base + '> rdfs:label ?lrsn.\n'+
		' FILTER (lang(?lrsn) = "' + this.lang +'").\n';


	if (type_ == 1){
		query += ' <'+ base + '> hzdo:hasResult ?rslt.\n';
	} else
	if (type_ == 3){
		query += ' <'+ base + '> hzdo:hasProbableResult ?rslt.\n';
	} else {
		query +=
			' {\n' +
			'	 <'+ base + '> hzdo:hasResult ?rslt.\n'+
			' } union {\n' +
			'	 <'+ base + '> hzdo:hasProbableResult ?rslt.\n'+
			' }';
	}

	query +=
		' ?rslt rdfs:label ?lrslt.\n'+
		' FILTER (lang(?lrslt) = "' + this.lang +'").\n'+
		'}';

	var me = this;

	me.count++;

	me.accessor.find(query, function(data, args){
		me.result(data, cb, me, args[0], args[1], args[2]);
	}, [dir_, type_, depth]);
};


Relation.prototype.findCause = function(base, type_, cb, direction, depth){
	var dir_ = direction;
	if (dir_ == null){
		dir_ = 'cause';
	}
	if (depth == null){
		depth = 0;
	}

	var query =
		'prefix hzdo:<http://www.hozo.jp/ontology/DiseaseOntology#>\n'+
		'select ?rsn ?lrsn (<'+ base + '> as ?rslt) ?lrslt {'+
		' <'+ base + '> rdfs:label ?lrslt.\n'+
		' FILTER (lang(?lrslt) = "' + this.lang +'").\n';

	if (type_ == 1){
		query += ' <'+ base + '> hzdo:hasCause ?rsn.\n';
	} else
	if (type_ == 3){
		query += ' <'+ base + '> hzdo:hasProbableCause ?rsn.\n';
	} else {
		query +=
			' {\n' +
			'	 <'+ base + '> hzdo:hasCause ?rsn.\n'+
			' } union {\n' +
			'	 <'+ base + '> hzdo:hasProbableCause ?rsn.\n'+
			' }';
	}

	query +=
		' ?rsn rdfs:label ?lrsn.\n'+
		' FILTER (lang(?lrsn) = "' + this.lang +'").\n'+
		'}';

	var me = this;

	me.count++;

	me.accessor.find(query, function(data, args){
		me.result(data, cb, me, args[0], args[1], args[2]);
	}, [dir_, type_, depth]);
};

Relation.prototype.result = function(data, cb, me, direction, type_, depth){

	depth ++;

	for (var i=0; i<data.length; i++){
		// データにnullはありえない前提
		var cause = data[i].rsn.value;
		var lcause = data[i].lrsn.value;
		var result = data[i].rslt.value;
		var lresult = data[i].lrslt.value;

		var causeIndex = me.getNodeIndex(cause, lcause, direction);
		var resultIndex = me.getNodeIndex(result, lresult, direction);
		var dir;


//		console.log(lcause + '->' + lresult + ":" + direction);
		if (causeIndex < 0){
			// 新規
			// reason をnodesのIDとして追加
			causeIndex = me.addNodes(cause, lcause, direction, depth);
			// IDに該当する原因と結果を検索継続
			dir = (direction == 'cause' ? direction : '');
			if (dir != '' || type_ != 2){
				me.findCause(cause, type_, cb, dir, depth);
			}
			dir = (direction == 'result' ? direction : '');
			if (dir != '' || type_ != 2){
				me.findResult(cause, type_, cb, dir, depth);
			}
			/* cause方向は最初に探索されるので不要
		} else {
			// 一方向探索だけは種類の上書きの可能性があるので既出でも探索を続ける
			if (direction == 'cause'){
				me.findCause(cause, cb, direction == 'cause' ? direction : '');
			}
			*/
		}


		if (resultIndex < 0){
			// 新規
			// result をnodesのIDとして追加
			resultIndex = me.addNodes(result, lresult, direction, depth);
			// IDに該当する原因と結果を検索継続
			dir = (direction == 'result' ? direction : '');
			if (dir != '' || type_ != 2){
				me.findResult(result, type_, cb, dir, depth);
			}
			dir = (direction == 'cause' ? direction : '');
			if (dir != '' || type_ != 2){
				me.findCause(result, type_, cb, dir, depth);
			}
		} else {
			// 一方向探索だけは種類の上書きの可能性があるので既出でも探索を続ける
			if (direction == 'result'){
				me.findResult(result, type_, cb, direction == 'result' ? direction : '', depth);
			}
		}
		me.addLink(causeIndex, resultIndex);

	}

	me.count--;
	if (me.count == 0){
		// データをすべて探索完了したのでcbをコール
		cb(me.data);
	}


};

/**
 * 指定IDデータのノードIndexを取得する
 * 該当がなければ-1を返す
 * @param id
 * @returns {Number}
 */
Relation.prototype.getNodeIndex = function(id, label, direction){
	var ret = -1;
	for (var i=0; i<this.data.nodes.length; i++){
		if (this.data.nodes[i].id == id){
			ret = i;
			this.data.nodes[i].label = label;
			if (direction != null && direction != ''){
				this.data.nodes[i].direction = direction;
			}
			break;
		}
	}

	return ret;

};

/**
 * 指定ID、ラベルのデータをノードに追加する
 * @param id
 * @param label
 */
Relation.prototype.addNodes = function(id, label, direction, depth){
	if (depth == null){
		depth = 0;
	}

	this.data.nodes.push({'id':id, 'label':label, 'direction':direction, 'index':this.data.nodes.length, 'depth':depth});

	return (this.data.nodes.length-1); // IDは0オリジン
};

Relation.prototype.addLink = function(s, t){

	for (var i=0; i<this.data.links.length; i++){
		var datum = this.data.links[i];
		if (datum.source == s && datum.target == t){
			// 同一リンク既存なのでスルー
			return;
		}
	}

	this.data.links.push({'source':s, 'target':t});

};

