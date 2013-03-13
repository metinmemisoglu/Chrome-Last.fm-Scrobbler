var sites = [
    {
        name     : "youtube",
        label    : "YouTube.com",
        active   : true,
        wildcard : ["*://www.youtube.com/watch*", "*://www.youtube.com/user/*"],
        js       : ["youtube.js"],
        css      : ["youtube.css"]
    },
    {
        name     : "ttnet",
        label    : "TTNetMüzik",
        active   : true,
        wildcard : ["*://www.ttnetmuzik.com.tr/*"],
        js       : ["ttnet.js"]
    },
    {
        name     : "fizy",
        label    : "Fizy.org / Fizy.com",
        active   : true,
        wildcard : ["*://fizy.com/*", "*://fizy.org/*"],
        js       : ["fizy.js"]
    }
];

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSites"){
        sendResponse({sites:sites});
    } 
    else if(request.method == "setSite"){
        var name = request.site;
        var status = request.active;

        //TODO localStorage[name] = status;

        console.log("request.site geldi hanıııımmmm: ");
        console.log(request.site);
    }
});

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
            if (result[1]) {         // Subdomain wildcard exists
                match_pattern += '(?:[^/]+\.)?';
            }
            // Append host (escape special regex characters)
            match_pattern += regEscape(result[2]);// + '/';
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



chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        var url = tab.url.split('#')[0]; // Exclude URL fragments
        if (getPattern(youtube).test(url)) {
            chrome.tabs.executeScript(tabId, {file: 'youtube.js',runAt:'document_end'});
            chrome.tabs.insertCSS(tabId, {file: 'youtube.css',runAt:'document_end'});
        }
        else if(getPattern(ttnet).test(url)) {
			chrome.tabs.executeScript(tabId, {file: 'ttnet.js'});
		}

        else if(getPattern(fizy).test(url)) {
			chrome.tabs.executeScript(tabId, {file: 'fizy.js',runAt:'document_end'});
		}
    }
});