/** name as an id
  * label for options page text
  * wildcard for the url pattern of the site
  * js = contentscript js file name
  * css = style sheet file name
  */  
var sites = [
    {
        name     : "youtube",
        label    : "YouTube.com",
        wildcard : ["*://www.youtube.com/watch*", "*://www.youtube.com/user/*"],
        js       : "youtube.js"
    },
    {
        name     : "thesixtyone",
        label    : "The Sixty One",
        wildcard : ["*://www.thesixtyone.com/*"],
        js       : '61.js'
    },
    {
        name     : 'soundcloud',
        label    : 'SoundCloud.com',
        wildcard : ["*://soundcloud.com/*"],
        js       : "soundcloud.js"
    },
    {
        name     : "ttnet",
        label    : "TTNetMüzik",
        wildcard : ["*://www.ttnetmuzik.com.tr/*"],
        js       : "ttnet.js"
    },
    {
        name     : "fizy",
        label    : "Fizy.org / Fizy.com",
        wildcard : ["*://fizy.com/*", "*://fizy.org/*"],
        js       : "fizy.js"
    }
];

var siteStatus = {};

// set true for all status
for(var i = 0; i<sites.length; i++){
    siteStatus[sites[i].name] = true;
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSites"){
        sendResponse({sites:sites});
    } 
    else if(request.method == "setSite"){
        var name = request.site;
        var status = request.active;

        siteStatus[name] = status;
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

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        var url = tab.url.split('#')[0]; // Exclude URL fragments

        //check urls one by one if site is active for scrobble and matches the pattern
        for(var i = 0; i<sites.length; i++){
            var site = sites[i];
            var name = site.name;
            var wildcard = site.wildcard;
            if(siteStatus[name] && getPattern(wildcard).test(url)){
                //site.js is not the js file name. it is site object's "js" property; site['js']
                chrome.tabs.executeScript(tabId, {file: site.js ,runAt:'document_end'});
            }
        }

    }
});