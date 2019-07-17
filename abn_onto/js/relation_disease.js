/**
 * ある基準の異常状態から、原因・結果を探索してd3.jsのForce型データを生成する
 */

/**
 *
 */
var FindDisease = function(accessor){
	this.accessor = accessor;
	this.lang = 'ja';
};

/**
 *
 * @param base	基準となる異常状態Subjectから、原因と結果を探索する
 * @param cb	コールバック
 */
FindDisease.prototype.findDisease = function(id, cb, type){
	var me = this;
	var predicate = 'hasDerivedState';

	var cb = cb;

	if (type == 'core'){
		predicate = 'hasCoreState';
	}

	var query =
		'prefix hzdo:<http://www.hozo.jp/ontology/DiseaseOntology#>\n'+
		'select ?disease ?label {'+
		' ?disease hzdo:' + predicate +  ' <'+ id + '>;\n'+
		' rdfs:label ?label.\n'+
		' FILTER (lang(?label) = "' + this.lang + '").\n'+
		'}';

	this.accessor.find(query, function(data){
		cb(data);
	});
};


