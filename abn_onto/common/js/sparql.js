/**
 JavascriptのみでSPARQLクエリを検索可能なライブラリ
 sgvizler.js より抜粋・改変
 2014.04.14
*/

// from sgvizler.js version 0.6
var sendQuery = function (e,q,f,t) {
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
        	type: "POST",
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
};

/*
function sparqlQueryJson(endpoint, queryStr, callback, isDebug) {
	var querypart = "query=" + escape(queryStr);

	// Get our HTTP request object.
	var xmlhttp = null;
	if(window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else if(window.ActiveXObject) {
		// Code for older versions of IE, like IE6 and before.
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	} else {
		alert('Perhaps your browser does not support XMLHttpRequests?');
	}

//	alert (endpoint);
	// Set up a POST with JSON result format.
	xmlhttp.open('POST', endpoint, true); // GET can have caching probs, so POST
//	alert ('opened');
	xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//	alert('set Content');
	xmlhttp.setRequestHeader("Accept", "application/json");

//	alert ('set accept');

	// Set up callback to get the response asynchronously.

	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4) {
			if(xmlhttp.status == 200) {
				// Do something with the results
//				if(isDebug) alert(xmlhttp.responseText);
//				callback(xmlhttp.responseText);
				data = $.parseJSON(xmlhttp.responseText);
				callback(data);

			} else {
				// Some kind of error occurred.
				alert("Sparql query error: " + xmlhttp.status + " "
						+ xmlhttp.responseText);
			}
		}
	};
	// Send the query to the endpoint
//	alert(querypart);
	xmlhttp.send(querypart);

	// Done; now just wait for the callback to be called.


};
*/
function sendQueryAllegro(endpoint, queryStr) {

    var promise;

    if (window.XDomainRequest) {
    	promise = (
    			function () {
    				// Set up callback to get the response asynchronously.
    				var qx = $.Deferred();

    				var querypart = "query=" + escape(queryStr);

    				// Get our HTTP request object.
    				var xmlhttp = null;
    				if(window.XMLHttpRequest) {
    					xmlhttp = new XMLHttpRequest();
    				} else if(window.ActiveXObject) {
    					// Code for older versions of IE, like IE6 and before.
    					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    				} else {
    					alert('Perhaps your browser does not support XMLHttpRequests?');
    				}

    				// Set up a POST with JSON result format.
    				xmlhttp.open('POST', endpoint, true); // GET can have caching probs, so POST
    				xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    				xmlhttp.setRequestHeader("Accept", "application/json");

    				xmlhttp.onreadystatechange = function() {
    					if(xmlhttp.readyState == 4) {
    						if(xmlhttp.status == 200) {
    							// Do something with the results
    							data = $.parseJSON(xmlhttp.responseText);
    							qx.resolve(data);

    						} else {
    							// Some kind of error occurred.
    							alert("Sparql query error: " + xmlhttp.status + " "
    									+ xmlhttp.responseText);
    						}
    					}
    				};
    				// Send the query to the endpoint
    				xmlhttp.send(querypart);
        			return qx.promise();

    			}());
    } else {
        promise = $.ajax({
			url: endpoint,
			headers: {
				"Accept": "application/sparql-results+json"
			},
			data: {
				query: queryStr,
				output: 'json'
			},
			dataType: 'json'
        });
    }

    return promise;

	// Done; now just wait for the callback to be called.


};
