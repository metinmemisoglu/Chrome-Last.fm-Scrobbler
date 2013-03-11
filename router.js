/**
 * I do nothing.
 * 
 * I am here to be active on all websites, so once the users confirm 
 * extension's permissions, they don't have to re-confirm on every update
 * that adds a new website connector.
 */

 alert("12345");
 chrome.extension.sendRequest({method: "siteOpen", site: "hebele"}, function(response) {
	console.log(response.data);
});

chrome.tabs.getCurrent(function(tab){
	var patt = /https?://www\.youtube\.com*/;
	if(tab.url.match(patt)){
		alert("ahahaha");
		//chrome.tabs.executeScript(null, {file: "youtube.js"});
	}
});



 //var sites;
 chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "setSites"){
		var sites = request.sites;
		prepareSites(sites);
		sendResponse({data: 'sites got'});
	}
	else if(request.method == "setSite" && sites != undefined){
		sites[request.site] = request.status;
		sendResponse({data: "site: " + request.site + " - site status: " + request.status});
	}
    else
      sendResponse({}); // snub them.
});

var prepareSites = function(sites) {
/*for(var site in sites){
	
}*/
	alert(sites["youtube"]);
}
