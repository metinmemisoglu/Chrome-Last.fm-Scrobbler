/**
 * Routing the scripts
 */

/**
  * @param String input  A match pattern
  * @returns  null if input is invalid
  * @returns  String to be passed to the RegExp constructor */
function parse_match_pattern(input) {
    if (typeof input !== 'string') return null;
    var match_pattern = '(?:^'
      , regEscape = function(s) {return s.replace(/[[^$.|?*+(){}\\]/g, '\\$&');}
      , result = /^(\*|https?|file|ftp|chrome-extension):\/\//.exec(input);

    // Parse scheme
    if (!result) return null;
    input = input.substr(result[0].length);
    match_pattern += result[1] === '*' ? 'https?://' : result[1] + '://';

    // Parse host if scheme is not `file`
    if (result[1] !== 'file') {
        if (!(result = /^(?:\*|(\*\.)?([^\/*]+))/.exec(input))) return null;
        input = input.substr(result[0].length);
        if (result[0] === '*') {    // host is '*'
            match_pattern += '[^/]+';
        } else {
            if (match[1]) {         // Subdomain wildcard exists
                match_pattern += '(?:[^/]+\.)?';
            }
            // Append host (escape special regex characters)
            match_pattern += regEscape(match[2]) + '/';
        }
    }
    // Add remainder (path)
    match_pattern += input.split('*').map(regEscape).join('.*');
    match_pattern += '$)';
    return match_pattern;
}

function getPattern(wildcardArr){
	// Parse list and filter(exclude) invalid match patterns
	var parsed = wildcardArr.map(parse_match_pattern).filter(function(pattern){return pattern !== null});
	// Create pattern for validation:
	var pattern = new RegExp(parsed.join('|'));
	return pattern;
}
// arrays of wildcards
var youtube = ["*://www.youtube.com/watch*", "*://www.youtube.com/user/*"];
var ttnet = ["*://www.ttnetmuzik.com.tr/*"];
var fizy = ["*://fizy.com/*", "*://fizy.org/*"];


// Example of filtering:
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        var url = tab.url.split('#')[0]; // Exclude URL fragments
        if (getPattern(youtube).test(url)) {
            chrome.tabs.executeScript(tabId, {
                file: 'youtube.js'
                // or: code: '<JavaScript code here>'
                // Other valid options: allFrames, runAt
            });
        }
        else if(getPattern(ttnet).test(url))) {
			chrome.tabs.executeScript(tabId, {
                file: 'ttnet.js'
            });
		}

        else if(getPattern(fizy).test(url))) {
			chrome.tabs.executeScript(tabId, {
                file: 'ttnet.js'
            });
		}
    }
});
 
 /*
chrome.extension.sendRequest({method: "siteOpen", site: "hebele"}, function(response) {
	console.log(response.data);
});


chrome.windows.getCurrent(null, function(win){
	console.log(win);
});

/*
chrome.tabs.query({ url: "*://*.youtube.com", currentWindow: true }, function (tabs) {
	console.log(tabs[0]);
});

/*chrome.tabs.getSelected(null,function(tab){
	var patt = /\.youtube\.com/;
	if(tab.url.match(patt)){
		alert("ahahaha");
		//chrome.tabs.executeScript(null, {file: "youtube.js"});
	}
	else{
		alert("olmadi");
	}
});



 //var sites;
 /*
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
	
}
	alert(sites["youtube"]);
}
*/