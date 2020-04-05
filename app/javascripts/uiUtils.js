function isFormValid(systemName) {
	return document.querySelector("#" + systemName + "_form").reportValidity();
}

function getParamFromForm(systemName, paramName, paramType, convertToWei) {
	if(paramType == "number") {
	  if(convertToWei) {
	    try {
	      return web3.utils.toWei(document.getElementById(systemName + "_" + paramName).value, 'ether');
	    } catch(error) {
	      console.log(error.message);
	    }
	  } else {
	    return document.getElementById(systemName + "_" + paramName).value;
	  }
	} else if (paramType == "text") {
	  return $("#" + systemName + "_" + paramName).val();
	} else if (paramType == "select") {
	  let element = $("#" + systemName + "_" + paramName);
	  let selectedValue = element.children("option:selected").val();
	  return selectedValue;
	} else {
	  return 'undefined';
	}
}

function disableButton(systemName) {
	$("#" + systemName + "_button").attr("disabled", true);
	$("#" + systemName + "_form").attr('onsubmit', 'return false;');
}

function enableButton(systemName) {
	$("#" + systemName + "_button").attr("disabled", false);
	$("#" + systemName + "_form").attr('onsubmit', 'App.' + systemName + '(); return false;');
}

function showButtonLoader(systemName) {
	$("#" + systemName + "_button").hide();
	$("#" + systemName + "_mini_loader").show();
}

function hideButtonLoader(systemName) {
	$("#" + systemName + "_button").show();
	$("#" + systemName + "_mini_loader").hide();
}

module.exports = {
	isFormValid,
	getParamFromForm,
	disableButton,
	enableButton,
	showButtonLoader,
	hideButtonLoader
}