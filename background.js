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
    },
    {
        name: "google-music", 
        label: "Google Music",
        wildcard: ["*://play.google.com/music/*"],
        js: "googlemusic.js"
    },
    {
        name: "new-myspace",
        label: "New MySpace",
        wildcard: ["*://new.myspace.com/*"],
        js: "newmyspace.js"
    },
    {
        name: "pitchfork",
        label: "Pitchfork",
        wildcard: ["*://pitchfork.com/*", "*://www.pitchfork.com/*"],
        js: "pitchfork.js"
    },
    {
        name: "virginradiotr",
        label: "Virgin Radio Turkey (Radyo Eksen)",
        wildcard: ["*://*.virginradioturkiye.com/*","*://*.radioeksen.com/*"],
        js: "virginradiotr.js"
    },{
       name: "ghostly",
       js: "ghostly.js",
       wildcard: ["http://ghostly.com/discovery/play"]
    },
    {
        name: "bandcamp",
        js: "bandcamp.js",
        wildcard: ["*://*.bandcamp.com/*"]
    },
    {
        name: "grooveshark",
        js: "grooveshark.js",
        wildcard: ["*://grooveshark.com/*"]
    }
];

//var siteStatus = {};

// set true for all status
for(var i = 0; i<sites.length; i++){
    (function(key){
        console.log("baba: " + sites[i].name + " - adamın dibi:" +  localStorage[sites[i].name]);    
    })(i);
    //localStorage[sites[i].name] = true;
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSites"){
        sendResponse({sites:sites});
    } 
    else if(request.method == "setSite"){
        var name = request.site;
        var status = request.active;

        localStorage[name] = status;
        console.log("name: " + name);
        console.log("status: " + status);
        console.log("localStorage: " + localStorage[name]);
    }
    return true;
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
            //console.log("name: " + name + " - locals:" + localStorage[name]);
            
//            var dff = $.Deferred();
   //         dff.resolve(localStorage[name]);
 //           var stat = (function(){ return localStorage[name]; })();

            if(localStorage[name] && getPattern(wildcard).test(url)){
                //site.js is not the js file name. it is site object's "js" property; site['js']
                chrome.tabs.executeScript(tabId, {file: site.js ,runAt:'document_end'});
                break;
            }
        }

    }
});