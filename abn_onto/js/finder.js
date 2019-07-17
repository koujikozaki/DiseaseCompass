/**
 *
 */

var sparql;

$(window).load(function() {
	sparql = new Sparql();
	sparql.server = "http://lod.hozo.jp";
	sparql.endpoint = {"endpoint": "http://lod.hozo.jp/endpoint/disease_multi"};
//	sparql.endpoint = {"endpoint": "http://133.1.32.98:8890/sparql"};

	sparql.result_func = finder_result;
/*
	$('#test_button').click(function(){
		finder_query('select ?s ?l { ?s  ?p <http://www.hozo.jp/ontology/DiseaseOntology#Abnormal_State>; <http://www.w3.org/2000/01/rdf-schema#label> ?l. FILTER (lang(?l) = "ja") } LIMIT 100');
	});
*/
});

function finder_query(query){
	sparql.findByQuery(query);
}

function finder_result(data){

	var derived_array = [];
	var core_array = [];

	if (data instanceof Array) {
		for (var d=0; d<data.length; d++) {

			var i=0;
			// ID
			var label = data[d].label;
			var derived_subject = data[d].s1;
			var derived_label = data[d].dsl;

			var core_subject = data[d].s2;
			var core_label = data[d].csl;

			if (derived_subject != null && derived_subject != '' && derived_array.indexOf(derived_subject) < 0){
				$('#disease_derived').append($('<li><a href="http://lod.hozo.jp//DiseaseChainViewer/?id='+get_id_from_subject(derived_subject) + '&word='+label + '&lang=' + lang +'" target="_blank">' + derived_label + '</li>'));
//				$('#disease_derived').append($('<li><a href="http://localhost:8080/DiseaseChainViewer/?id='+get_id_from_subject(derived_subject) + '&word='+label + '&lang=' + lang +'" target="_blank">' + derived_label + '</li>'));
				derived_array.push(derived_subject);
			}

			if (core_subject != null && core_subject != '' && core_array.indexOf(core_subject) < 0){
				$('#disease_core').append($('<li><a href="http://lod.hozo.jp/DiseaseChainViewer/?id='+get_id_from_subject(core_subject)  + '&word=' + label + '&lang=' + lang +'" target="_blank">' + core_label + '</li>'));
//				$('#disease_core').append($('<li><a href="http://localhost:8080/DiseaseChainViewer/?id='+get_id_from_subject(core_subject)  + '&word=' + label + '&lang=' + lang +'" target="_blank">' + core_label + '</li>'));
				core_array.push(core_subject);
			}
		}
	}
}

function get_id_from_subject(subject){
	var ret = subject.substring(subject.indexOf('#')+1);

	return ret;
}