

module.exports = function(response, showError, that) {

	if(response.status == 401){
		location.href = "#login";				// TODO: 加入重定向 获取当前路径
		return false;
	}

	var errors = response.responseJSON
	for(var i in errors){
		if(typeof(errors[i]) != "function" && showError){
			showError.call(that, errors[i]);
		}
	}
};

