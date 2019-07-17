

var RelationView = function(div_name, rightclick_event){
	this.div_name = div_name;
	this.rightclick_event = rightclick_event;

	this.view_depth = 3;

};

RelationView.prototype.refresh = function(){
	if (this.force != null){
		this.force.start();
	}
}

RelationView.prototype.view = function(data, rightclick_cb){
	var vbox_x = 500;
	var vbox_y = 500;





    var w = 1000;
    var h = 800;
    var nodes = data.nodes;
    var links = data.links;
   this.force = d3.layout.force()
                 .nodes(nodes)
                 .links(links)
                 .size([w, h])
                 .linkStrength(0.1)
                 .friction(0.6)
                 .distance(200)
                 .charge(-30)
                 .gravity(0.04)
                 .theta(0.1)
                 .alpha(0.1)
                 .start();
//    var svg = d3.select('#'+this.div_name).append("svg").attr({width:w, height:h});

	var svg;

	if (d3.select('#'+this.div_name).select("svg")) {
		d3.select('#'+this.div_name).select("svg").remove();
	}
	svg = d3.select('#'+this.div_name).append("svg").attr({width:w, height:h});

/*
	if ($('#'+this.div_name + ' svg').length > 0) {
		svg = d3.select('#'+this.div_name).select("svg");
	} else {
		svg = d3.select('#'+this.div_name).append("svg").attr({width:w, height:h});
	}
*/
	nodes[0].w = 500;
	nodes[0].h = 400;

    var link = svg.selectAll("line")
                  .data(links)
                  .enter()
                  .append("line")
                  .style({stroke: "#333",
                          "stroke-width": 1.5});
    var node = svg.selectAll("circle")
                  .data(nodes)
                  .enter()
                  .append("circle")
                  .attr({r: 20,
                         opacity: 1})
                  .style('fill', function(d) {
                	  var color = "lightgray";
                	  if (d.index == 0){ color = "red"; /*d.fixed = true;*/}
                	  else if (d.direction == "cause") {color = "lightgreen";}
                	  else if (d.direction == "result") {color = "purple";}
                	  return color;
                	  })
                  .call(this.force.drag);


    var arrows = [];

	var arrowname = ['adr', 'adl'];

	for (var i=0; i<arrowname.length; i++){
		arrows[arrowname[i]] = svg.selectAll("arrow.link")
		.data(links)
		.enter().append("line")
		.attr("class", "link")
		.style({stroke: "#333",
            "stroke-width": 1.5});

	}


    var label = svg.selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr({"text-anchor":"middle",
           "fill":"white"})
    .style({"font-size":11})
	.style({"stroke":'#000'})
	.text(function(d) { return d.label; });

	label = svg.selectAll('text');


    this.force.on("tick", function() {
      link.attr({visibility: function(d) {return isView_link(d);},
				x1: function(d) { return d.source.x; },
                 y1: function(d) { return d.source.y; },
                 x2: function(d) { return d.target.x; },
                 y2: function(d) { return d.target.y; }
                 });
      node.attr({visibility: function(d) {return isView_node(d);},
				 cx: function(d) { return d.x; },
                 cy: function(d) { return d.y; }});
      label.attr({visibility: function(d) {return isView_node(d);},
				x: function(d) { return d.x; },
          y: function(d) { return d.y; }});


      arrows['adr']
		.attr({visibility: function(d) {return isView_link(d);},
		x1: function(d) {
			var sn = d.source;
			var tn = d.target;
			var r = getR(tn);
			return (tn.x - vec(sn.x, sn.y, tn.x, tn.y).x * (r + 20));
		},
		y1: function(d) {
			var sn = d.source;
			var tn = d.target;

			var r = getR(tn);
			return (tn.y - vec(sn.x, sn.y, tn.x, tn.y).y * (r + 20));
		},
		x2: function(d) {
			var sn = d.source;
			var tn = d.target;
			var r = getR(tn);
			return (tn.x - vec(sn.x, sn.y, tn.x, tn.y).x * r);
		},
		y2: function(d) {
			var sn = d.source;
			var tn = d.target;
			var r = getR(tn);
			return (tn.y - vec(sn.x, sn.y, tn.x, tn.y).y * r);
		},
		transform: function(d) {
			var sn = d.source;
			var tn = d.target;
			var r = getR(tn);
			return 'rotate(25, '
			+ (tn.x - vec(sn.x, sn.y, tn.x, tn.y).x * r) + ', '
			+ (tn.y - vec(sn.x, sn.y, tn.x, tn.y).y * r) + ')';
		}});

      arrows['adl']
		.attr({visibility: function(d) {return isView_link(d);},
		x1: function(d) {
			var sn = d.source;
			var tn = d.target;
			var r = getR(tn);
			return (tn.x - vec(sn.x, sn.y, tn.x, tn.y).x * (r + 20));
		},
		y1: function(d) {
			var sn = d.source;
			var tn = d.target;
			var r = getR(tn);
			return (tn.y - vec(sn.x, sn.y, tn.x, tn.y).y * (r + 20));
		},
		x2: function(d) {
			var sn = d.source;
			var tn = d.target;
			var r = getR(tn);
			return (tn.x - vec(sn.x, sn.y, tn.x, tn.y).x * r);
		},
		y2: function(d) {
			var sn = d.source;
			var tn = d.target;
			var r = getR(tn);
			return (tn.y - vec(sn.x, sn.y, tn.x, tn.y).y * r);
		},
		transform: function(d) {
			var sn = d.source;
			var tn = d.target;
			var r = getR(tn);
			return 'rotate(-25, '
				+ (tn.x - vec(sn.x, sn.y, tn.x, tn.y).x * r) + ', '
				+ (tn.y - vec(sn.x, sn.y, tn.x, tn.y).y * r) + ')';
		}});

    });


	node.on("dblclick", function(d){
		if (d.fixed == null){
			d.fixed = false;
		}
		d.fixed = !d.fixed;
	});

	var me = this;

	// 基本ベクトル算出
	function vec(sx, sy, dx, dy){
		var vx = (dx - sx);
		var vy = (dy - sy);
		var dist = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
		var ret = [];
		if (dist != 0){
			ret.x = vx / dist;
			ret.y = vy / dist;
		} else {
			ret.x = vx;
			ret.y = vy;
		}

		return ret;
	};

	function isView_node(d){
		if (d.depth <= me.view_depth){
			return 'visible';
		}
		return 'hidden';
	}

	function isView_link(l){

		if (l.source.depth <= me.view_depth && l.target.depth <= me.view_depth){
			return 'visible';
		}

		return 'hidden';
	}


	// ノード半径を算出
	function getR(d){
		/*
		var r = 15;

		if (d.blink != null){
			if (d.blink % 2 == 1){
				r = 25;
			} else {
				r = 30;
			}
		} else
		if (d.selected >=2){
			r = 30;
		} else if (d.selected == 1){
			r = 15;
		} else if (d.viewText == false){
			r = 10;
		} else {
			r = 15;
		}

		return r;
		*/
		return 20;

	};

	function nodeRightClick(d, obj, me){
		if (typeof me.rightclick_event == "function"){
			me.rightclick_event(d, obj);
//			node_rightclick_event(d, me);
		}
	};


	function addRightClickEvent(objs, func){
		for (var i=0; i<objs[0].length; i++){
			var obj = objs[0][i];
			if (obj.oncontextmenu == undefined){
				$(obj).bind('contextmenu', function(evnt){
					window.event = evnt;
					func(evnt.target.__data__, evnt.target);
					return false;
				});
			} else {
				obj.oncontextmenu = function(evnt){
					func(evnt.srcElement.__data__, evnt.srcElement);
					return false;
				};
			}
		}
	};

	if ($('#' + this.div_name).oncontextmenu == undefined){
		$('#' + this.div_name).bind('contextmenu', function(event){
//			alert('popup');
			if (rightclick_cb != null){
				rightclick_cb();
			}
/*
			var event;
			nodes[0].x = event.offsetX;
			nodes[0].y = event.offsetY;
*/
			return false;
		});
	}


	// 右クリックイベント
	addRightClickEvent(node, function(d, obj){
		nodeRightClick(d, obj, me);
	});

	// 右クリックイベント
	addRightClickEvent(label, function(d, obj){
//		nodeRightClick(d, obj);
		nodeRightClick(d, node[0][d.index], me);
	});

	var timer = false;
	$(window).resize(function(event) {
		resize();
/*
	    if (timer !== false) {
	        clearTimeout(timer);
	    }
	    timer = setTimeout(function() {
	        var w =event.target.innerWidth;
	        var h =event.target.innerHeight;

	        $('svg').attr({width:w, height:h});

	        console.log('resized');
	        // 何らかの処理
	    }, 200);
*/
	});

	function resize(){
	    if (timer !== false) {
	        clearTimeout(timer);
	    }
	    timer = setTimeout(function() {
//	        var w =event.target.innerWidth;
//	        var h =event.target.innerHeight;
	        var w =window.innerWidth;
	        var h =window.innerHeight;

	        $('svg').attr({width:w, height:h});

	        console.log('resized');
	        // 何らかの処理
	    }, 200);
	}

	resize();

};