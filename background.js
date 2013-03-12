var sites = {
	"youtube"		:	true,
	"ttnet"			:	true,
	"fizy"			:	true,
	"thesixtyone"	:	true
};
/*chrome.extension.sendRequest({method: "setSites", sites: sites}, function(response) {
	console.log(response.data);
});
*/

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "siteOpen"){
		var site = request.site;
		//alert(site);
		sendResponse({data: 'site got: ' + site});
	}
    else
      sendResponse({}); // snub them.
});