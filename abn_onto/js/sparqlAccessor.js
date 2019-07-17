

function SparqlAccessor(endpoint){
	this.endpoint = endpoint;
}


SparqlAccessor.prototype.find = function(query, cbFunc, args, errFunc, errArgs){

	var qr = sendQuery(this.endpoint, query);

	qr.fail(
		function (xhr, textStatus, thrownError) {
			if (errFunc != null){
				errFunc(errArgs);
			}
//			alert("Error: A '" + textStatus+ "' occurred.");
		}
			);
	qr.done(
		function (d) {
			var data = d.results.bindings;

			if (cbFunc != null){
				cbFunc(data, args);
			}
		}
	);


	function sendQuery(e,q,f,t) {
		if (typeof f==="undefined") f="json";
		if (typeof t==="undefined") t=f;
	    var promise;

	    if (window.XDomainRequest) {
	        // special query function for IE. Hiding variables in inner function.
	        // TODO See: https://gist.github.com/1114981 for inspiration.
	        promise = (
				function () {
	    			/*global XDomainRequest */
	    			var qx = $.Deferred(),
	        		xdr = new XDomainRequest(),
	        		url = e +
					"?query=" + q +
					"&output=" + t;
	    			xdr.open("GET", url);
					xdr.onload = function () {
						var data;
	        			if (myEndpointOutput === qfXML) {
							data = $.parseXML(xdr.responseText);
	        			} else {
							data = $.parseJSON(xdr.responseText);
	        			}
	        			qx.resolve(data);
					};
	    			xdr.send();
	    			return qx.promise();
				}()
	        );
	    } else {
	        promise = $.ajax({
				url: e,
				headers: {
					"Accept": "application/sparql-results+json"
				},
				data: {
					query: q,
					output: f
				},
				dataType: t
	        });
	    }
	    return promise;
	}

};