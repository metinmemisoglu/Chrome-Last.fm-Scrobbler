var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-16968457-1']);
_gaq.push(['_trackPageview']);

(function() {
   var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
   ga.src = 'https://ssl.google-analytics.com/ga.js';
   (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
})();

var sites = {
	"youtube"		:	true,
	"ttnet"			:	true,
	"fizy"			:	true,
	"thesixtyone"	:	true
};
chrome.extension.sendRequest({method: "setSites", sites: sites}, function(response) {
	console.log(response.data);
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "siteOpen"){
		var site = request.site;
		alert(site);
		sendResponse({data: 'site got:' + site});
	}
    else
      sendResponse({}); // snub them.
});