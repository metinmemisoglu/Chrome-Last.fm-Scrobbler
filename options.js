
// options ---------------------------------------------------------------------
$(function(){

   // use immediate-change checkboxes

   $('#use-notifications').click(function(){
      localStorage['useNotifications'] = this.checked ? 1 : 0;
      updateDisabled();
   });
   
   $('#use-notifications-nowplaying').click(function(){
      localStorage['useNotificationsNowPlaying'] = this.checked ? 1 : 0;
   });

   $('#use-notifications-scrobbled').click(function(){
      localStorage['useNotificationsScrobbled'] = this.checked ? 1 : 0;
   });

   $('#use-autocorrect').click(function(){
      localStorage['useAutocorrect'] = this.checked ? 1 : 0;
   });

   $('#use-youtube-inpage').click(function(){
      localStorage['useYTInpage'] = this.checked ? 1 : 0;
   });

   // preload options
   $('#use-notifications').attr('checked', (localStorage['useNotifications'] == 1));
   $('#use-notifications-nowplaying').attr('checked', (localStorage['useNotificationsNowPlaying'] == 1));
   $('#use-notifications-scrobbled').attr('checked', (localStorage['useNotificationsScrobbled'] == 1));
   $('#use-autocorrect').attr('checked', (localStorage['useAutocorrect'] == 1));
   $('#use-youtube-inpage').attr('checked', (localStorage['useYTInpage'] == 1));
   
   // disable subitems
   function updateDisabled() {
      $('#use-notifications-nowplaying').attr('disabled', (!$('#use-notifications').is(':checked')));
      $('#use-notifications-scrobbled').attr('disabled', (!$('#use-notifications').is(':checked')));
   }

	chrome.extension.sendMessage({method: "getSites"}, function(response) {
      //get all sites from background.js
		var newSites = response.sites;

      //create a checkbox for each site
      for(var i = 0; i<newSites.length;i++){
         var name = newSites[i].name;
         var scrobble = "scrobble-" + name;
         var label = newSites[i].label;

         if(!label){
            label = name;
         }

         console.log("creating checkbox for site: " + name + " - " + scrobble + " - " + label);

         $("<input/>", {
            type: "checkbox",
            id: scrobble,
            name: name,
            checked: "checked"
         }).appendTo("#sitesToScrobblePanel");

         $("<label>", {
            for: scrobble,
            title: "Scrobble " + label,
            html: label
         })
         .appendTo("#sitesToScrobblePanel");

         $("<br>")
         .appendTo("#sitesToScrobblePanel");

         //send message to background.js if site status changed
         $('#' + scrobble).change(function(){            
            var status = $(this).is(':checked');
            //console.log('#' + this.id + " : " + status);
            chrome.extension.sendMessage({method: "setSite", site: this.id.replace("scrobble-",""), active: status}, function(response) {
               console.log(response.data);
            });
         });
      }

   });


	/*
	for(var site in sites){
		var scrobble = "#scrobble-" + site;
		
		// preload scrobble all
		//$(scrobble).attr('checked', true); //(localStorage[scrobble] == 1)
		
		$(scrobble).click(function(){
			sites[site] = this.checked;
			chrome.extension.sendMessage({method: "setSite", site: site, status: this.checked}, function(response) {
				console.log(response.data);
			});
		});
	}*/
});
