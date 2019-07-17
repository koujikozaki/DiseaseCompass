

function get_args(){
	var data = location.href.split("?")[1];
	var args = [];
	if (data != undefined){
		data = data.split("&");

		for(var i=0; i<data.length; i++){
			var args_ = data[i].split("=");
			if (args_.length == 2){
				args[args_[0]] = args_[1];
			}
		}
	}

	return args;
}