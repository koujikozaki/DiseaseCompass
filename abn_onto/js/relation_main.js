

// 疾患コンパスのURL
var dcviewer_url = 'http://lod.hozo.jp/DiseaseChainViewer/';
// 疾患データエンドポイント
var endpoint = 'http://lod.hozo.jp/endpoint/disease_multi';
//var endpoint = 'http://localhost:8890/sparql';
// 異常状態ツリーURL
var tree_url = 'http://diseasecompass.hozo.jp/abn_onto/';
//var tree_url = 'http://www.ei.sanken.osaka-u.ac.jp/med-ontology/abn_onto/';
// 異常状態－疾患データリンクエンドポイント
var link_endpoint = 'http://lod.hozo.jp/endpoint/disease_multi';

var view;
/**
 * 初期化
 */
$(window).load(function() {
	var sparql = new SparqlAccessor(endpoint);
	var link_sparql = new SparqlAccessor(link_endpoint);

	var relation = new Relation(sparql);
	var def_depth = 2;

	disease = new FindDisease(sparql);

	view = new RelationView('container',
		function(d, obj){
			var e = window.event;
			init_popup(d.id, d.label, function(popup){
				popup.bind(obj);
				popup.show(e);
			});
		}
	);


	function init_popup(id, label, cb){

		var popup = new PopupMenu();
		popup.add(label);
		popup.addSeparator();

		var e = window.event;

		disease.findDisease(id, function(data){
			// TODO
			init_diseasepopup('Core', data, label, disease.lang, popup);
			disease.findDisease(id, function(data){
				init_diseasepopup('Derived', data, label, disease.lang, popup);
				if (cb != null){
					popup.add('View State in Tree', function(obj, d){
//					window.open(tree_url + '?stateid=' +id);
						findLink(id, label);
					});


					cb(popup);
				}
				
			}, 'derived');
		}, 'core');


	}

	function init_diseasepopup(type, data, label, lang, popup){

		for (var i=0; i<data.length; i++){
			popup.add(data[i].label.value + '('+type + ' Chain)', function(obj, d, datum){
				var id = datum.disease.value;
				id = id.substring(id.lastIndexOf('#')+1);
				window.open(dcviewer_url + '?id=' +id + '&word=' + label + '&lang='+lang);
			}, data[i]);
		}
		popup.addSeparator();
	}

	var args = get_args();

	if (args.id != null){
		var id = args.id;
		if (id.indexOf('http') < 0){
			id = 'http://www.hozo.jp/ontology/DiseaseOntology#' + id;
		}

		var lang = args.lang;
		if (lang == null){
			lang = 'ja';
		}
		relation.lang = lang;
		disease.lang = lang;

		var depth = args.depth;
		if (depth != null){
			def_depth = depth;
		}


		var direction = args.direction;
		/*
		relation.find(id, function(data){
			view.view(data, function(id){
				// 右クリックコールバック
			});
		}, direction);
		*/
		findRelation(id);

	}

	function findRelation(id, type){
		relation.find(id, function(data){
			view.view(data, function(){
				// 右クリックコールバック
				findRelation(id, 4);
			});
		}, direction, type);
	}



	function findLink(diseaseState, label){
		if (diseaseState.indexOf('http') < 0){
			diseaseState = 'http://www.hozo.jp/ontology/DiseaseOntology#' + diseaseState;
		}
		var query =
			'prefix medo:<http://www.hozo.jp/owl/MedicalOntologyWithYAMATO.owl#>\n' +
			'select ?yamato {\n' +
			'  ?yamato medo:abn-id <' + diseaseState + '>\n' +
			'}\n';

		var me = this;

		link_sparql.find(query, function(data){
			var exists = false;
			for (var i=0; i<data.length; i++){
				var res = data[i].yamato;

				if (res != null){
					// 複数hitする場合（ありえないはず）は複数ウインドウ表示
					window.open(tree_url + '?stateid='+res.value + '&lang=' + me.lang);
					exists = true;
				}

			}
			if (!exists){
				alert('['+label+"]に該当する異常状態データが見つかりません");
			}

		});
	};

	var me = this;

	$('#view_depth').on('input', function(event){
		set_depth(event.currentTarget.value);
	});

	function set_depth(depth){
		if (depth == $('#view_depth')[0].max){
			view.view_depth = 10000;
			$('#depth_num').html('MAX');
		} else {
			view.view_depth = depth;
			$('#depth_num').html(depth);
		}
			$('#view_depth').val(depth);
		view.refresh();
	}
	set_depth(def_depth);


});

