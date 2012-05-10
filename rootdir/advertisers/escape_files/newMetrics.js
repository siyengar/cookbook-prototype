// temp
function getPackageForName(packageName) {
	var arr = packageName.split('.');
	var obj = window;
	for(var i=0; i<arr.length; i++) {
		if (typeof obj[arr[i]] == 'undefined') {
			obj[arr[i]] = {};
		}
		obj = obj[arr[i]];
	}
	return obj;
}

//used to fire metrics when someone clicks on 
//fullscreen for nameplate video SWFs
function videoPlayerFullScreen(state){
	var namePlate = oMetricsTracker.nameplate();
	s["prop5"] = "video: full";
	s.pev2 = "fv: home: video: full: "+namePlate;
	void(s.t());
}
getPackageForName("com.forddirect.brandsites.metrics").NewMetricsTracker = function(){

	var storedPageName;
	var storedNameplate = "";
	var storedModelCategory = "";
	var storedModelYear = "";
	
	this.commonsVariableSet = function(){
	//Variables for - Omniture
	
	s.eVar12= this.modelYear();
	s.prop12= this.modelYear();
	
	s.hier1= this.siteLevel();
	
	s.eVar15= this.site();
	s.prop15= this.site();
	
	s.eVar4= this.userLanguage();
	s.prop4= this.userLanguage();
	
	s.eVar9=s.prop9='';
	s.eVar14= this.client();
	s.prop14= this.client();
	
	s.channel= this.siteSection();
	
	s.eVar16= this.nameplate();
	s.prop16= this.nameplate();
	
	};
	this.trimName = function(){
				var trimName = "";
				var key = "trim";
				var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
				var qs = regex.exec(window.location.href);
				if(qs!=null){
				trimName = qs[1];
				}
				return trimName;
	}
	this.gnavclick = function(loc, urlextension){
	  document.location = loc + urlextension;
	}
	 this.storeMacroData = function(pageName){
		storedPageName = pageName;
	};
	
	this.fireMacroData =function(){
		this.trackMacroData(storedPageName);
	};

	this.modelYear = function(){ 
		return __params.year;
	};

	this.modelCategory = function(){ 
		var segment = __params.segment ? __params.segment.toLowerCase() : '';
		if(segment == "trucks" || segment == "suvs" || segment == "cars" || segment == "crossovers"){
			segment = segment.substring(0,segment.length-1);
		}
		return segment; 
	};
	
	this.modelName = function(){
		return __params.modelName;	
	};

	this.userLanguage = function(){
		var userLanguage = ""; 
	if (_widgets.context) {
			userLanguage =  _widgets.context.UserContext.get("userLanguage");
		}
		return userLanguage;
	};

	this.searchCurrentPageNumber = function(){ 
		return _widgets.context.SearchContext.get('page') + 1;
	};
	
	this.featureCategory = function(){
		return this.featureCategoryName();

//		var feature = _widgets.context.SelectedContext.get("feature");
//                if(feature.category === "") {
//                     return feature.category;
//                } else{
//                    var featureCategory = feature.category;
//                    return _widgets.context.AvailableContext.get("featuresCategoryTitles")[featureCategory].toLowerCase().replace(/ /,'');
//                }
	};

	this.featureCategoryName = function(){
		var feature = _widgets.context.SelectedContext.get("feature");
		if(feature.category === "") {
			return feature.category;
		} else{
			var featureCategory = feature.category;
			return _widgets.context.AvailableContext.get("featuresCategoryTitles")[featureCategory].toLowerCase().replace(/ /,'');
		}
	};

	this.featureName = function(){ 
		var feature = _widgets.context.SelectedContext.get("feature");
		
		if(feature.id === "") {
			return feature.id;
		} else{
			var featureId = feature.id;
			return _widgets.context.AvailableContext.get("featuresCategoryTitles")[featureId].toLowerCase();
		}
	};

	this.nameplate = function(){ 
		var returnValue = "";
		if(_widgets.context){
			var vehicleNameplate = _widgets.context.SelectedContext.get("nameplate");
			var metricsName = _widgets.context.SelectedContext.get("MetricsName");
			
			var make = this.getMake();
			switch(make){
				case "Ford":
					if(metricsName){
						// vehicle nameplate is not undefined
						returnValue = make.toLowerCase() + " " + metricsName.toLowerCase();
						returnValue = returnValue.replace("the new ","");
					}
					break;
				case "Lincoln":
					if(metricsName){
						// vehicle nameplate is not undefined
						returnValue = make.toLowerCase() + " " + metricsName.toLowerCase();
					}
					break;
				default:
					returnValue = make + " " + vehicleNameplate.toLowerCase();
				}
		}		
		return returnValue;
	};
	this.storeNameplateInfo = function(nameplate, modelCategory, modelYear){
		storedNameplate = nameplate;
		storedModelCategory = modelCategory;
		storedModelYear = modelYear;
	};	
	
	this.storeNameplateInfo = function(nameplate, modelCategory, modelYear){
		storedNameplate = nameplate;
		storedModelCategory = modelCategory;
		storedModelYear = modelYear;
	};
	
	this.commTruckBrochure = function() {
		var select = document.getElementById('brochureCode5');
		if (select) {
			return select.value;
		}
	};
	
	this.brochuresNameplate = function(){ 
		
		var brochuresNameplate = "";
		
		if(storedNameplate === ""){
			brochuresNameplate = this.nameplate()||'';
		} else {
			brochuresNameplate = storedNameplate; 
		}
		//data model inconsistency
		if(storedNameplate=="ford superduty"){
			brochuresNameplate="ford super duty";
		}
		return brochuresNameplate;
	};
	
	this.brochuresModelCategory = function(){ 
		
		var brochuresModelCategory = "";
		
		if(storedModelCategory === ""){
			brochuresModelCategory = this.modelCategory();
		} else {
			brochuresModelCategory = storedModelCategory;
		}
		 
		return brochuresModelCategory;
	};
	
	this.brochuresModelYear = function(){ 
		
		var brochuresModelYear = "";
		
		if(storedModelYear === ""){
			brochuresModelYear = this.modelYear();
		} else {
			brochuresModelYear = storedModelYear; 
		}
		
		return brochuresModelYear;
	};	
	
	this.brochureDetails = function(sMetricsParam){
		var sReturn = "";

		if (this.nameplate()==""){
			switch(sMetricsParam){
				case "hier1":
					sReturn = "shopping tools:brochures";
					break;
				case "channel":
					sReturn = "brochures";
					break;
				case "pageName":
					sReturn = this.brandVar() + ":brochures";
					break;
				case "eVar11":
					sReturn = this.brandVar()  + ":brochures";
					break;
				case "prop11":
					sReturn = this.brandVar()  + ":brochures";
					break;				
				default:
					sReturn = "Implement Me this.brochureDetails";
				}

		} else{

			switch(sMetricsParam){
				case "hier1":
					sReturn = "shopping tools:brochures:" + this.modelYear() + ":" + this.modelCategory() + ":" + this.nameplate();
					break;
				case "channel":
					sReturn = "brochures";
					break;
				case "pageName":
					sReturn = this.brandVar() + ":vehicle:brochures:" + this.nameplate();
					break;
				case "eVar11":
					sReturn = this.brandVar()  + ":vehicle:brochures";
					break;
				case "prop11":
					sReturn = this.brandVar()  + ":vehicle:brochures";
					break;				
				default:
					sReturn = "Implement Me this.brochureDetails";
				}

		}
		return sReturn;
	};

	this.getCodeForModel = function(){
		return '';
	};

	this.siteLevel = function(){
		// hierarchy
		var siteLevel ="";
		if (_widgets.context) {
			var currentView = _widgets.context.SelectedContext.get("currentView");
			switch (currentView) {
				case "brand-home":
				case "welcome-back":
					siteLevel = "home";
					break;
				case "nameplate-overview":
					siteLevel = "vehicle:" + this.modelYear() + ":" + this.modelCategory() + ":" + this.nameplate();
					break;
				case "gallery":
				case "gallery_videos":
				case "photos":
				case "photos-interior":
				case "photos-exterior":
				case "photos-accessories":
				case "photopopup":
				case "videos":
				case "html360":
				case "downloads":
				case "home360popup":
					siteLevel = "vehicle:gallery:" + this.modelYear() + ":" + this.modelCategory() + ":" + this.nameplate();
					break;
				case "payment-estimator":
				case "pricing-and-payments-nameplate":
					siteLevel = "vehicle:pricing:" + this.modelYear() + ":" + this.modelCategory() + ":" + this.nameplate();
					break;
				case "pricing-how-to":
					siteLevel = "vehicle:pricing:" + this.modelYear() + ":" + this.modelCategory() + ":" + this.nameplate() + ":howto";
					break;
				case "features":
					siteLevel = "vehicle:features:" + this.modelYear() + ":" + this.modelCategory() + ":" + this.nameplate() + ":" + this.featureCategoryName();
					break;
				case "warranty":
					siteLevel = "vehicle:features:" + this.modelYear() + ":" + this.modelCategory() + ":" + this.nameplate() + ":warranty";
					break;
				case "model-and-options-trim-selection":
				case "models-and-options-trim-details":
					siteLevel = "vehicle:models:" + this.modelYear() + ":" + this.modelCategory() + ":" + this.nameplate();
					break;
				case "model-and-options-detailed-compare":
					siteLevel = "vehicle:models:" + this.modelYear() + ":" + this.modelCategory() + ":" + this.nameplate() + ":" + this.compareTabName();
					break;
				case "search-results":
					siteLevel = "search";
					break;
				case "fordcreditservices":
					siteLevel = "fordcreditservices";
					break;
				case "owners":
					siteLevel = "owners";
					break;
				case "contact-us":
					siteLevel = "help:contact";
					break;
				case "windowsticker":
					siteLevel = 'lp:window sticker';
					break;
				case "glossary":
					siteLevel = 'help:glossary';
					break;
				case "privacy":
					siteLevel = 'help:privacy';
					break;
				case "california-privacy":
					siteLevel = 'caprivacy';
					break;
				case "competitivecompare":
				case "comparesummary":
				case "compareadvantage":
				case "comparephoto":
				case "compareequipped":
				case "comparechoose":
				case "comparechooseford":
					siteLevel = 'shopping tools:competitive compare:' + this.modelYear() + ':' + this.modelCategory() + ':' + this.nameplate();
					break;
				case "innovation-sync-overview":
				case "innovation-sync-about":
				case "innovation-sync-features":
				case "innovation-sync-availability":
				case "innovation-sync-owner":
					siteLevel = 'awareness:features:sync';
					break;
				case "locateadealer":
					siteLevel = 'shopping tools:locate dealer';
					break;
				case "seo":
					siteLevel = 'lp:truck:truck type';
					break;
				case "seohybrid":
					siteLevel = 'lp:green:high mpg';
					break;
				case "seotechnology":
					siteLevel = 'lp:green:technology';
					break;
				case "brochures":
					siteLevel = 'shopping tools:brochures';
					break;	
				case "interstitial":
					siteLevel = 'fv: vehicle: interstitial';
					break;
				case "incentives":
					siteLevel = 'shopping tools:incentives';
					break;
				case "innovation-null-overview":
					siteLevel = 'awareness'
					break;
				case "allvehicles":
					siteLevel = 'showroom'
				break;
				case "ratings-reviews":
				case "stories":
				case "submit-story":
					siteLevel = "reveal:2011:car:ford fusion";
				break;
			case "certifiedpreowned":
				siteLevel = 'shopping tools:cpo:tier1:ford';
				break;
				default:
					siteLevel = "defaultsiteLevel";
			}
		}
		return siteLevel;
	};
	
	
	this.pageDetect = function(){
		var pageUrl = window.location.href;
		var pageNameDetected = "";
		if( pageUrl.indexOf("cap") > -1){
			pageNameDetected = "privacy:california";
		}
		else{
			pageNameDetected = "privacy";	
		}
		return pageNameDetected;
	};
	

	this.siteSection = function(){ 
		var siteSection = "";
		if (_widgets.context) {
			var currentView = _widgets.context.SelectedContext.get("currentView");
			
			switch (currentView) {
				case "brand-home":
				case "commtrucks-home":
					siteSection = "vehicle: all: commercial: truck";
					break;
				case "welcome-back":
					siteSection = "home";
					break;
				case "nameplate-overview":
				case "pricing-and-payments-nameplate":
				case "features":
				case "model-and-options-trim-selection":
				case "models-and-options-trim-details":
				case "payment-estimator":
				case "model-and-options-detailed-compare":
				case "gallery":
				case "gallery_videos":
				case "photos":
				case "photos-interior":
				case "photos-exterior":
				case "photos-accessories":
				case "photopopup":
				case "videos":
				case "html360":
				case "downloads":
				case "home360popup":
					siteSection = 'vehicle';
					break;
				case "warranty":
					siteSection = 'warranty';
					break;
				case "search-results":
					siteSection = 'search';
					break;
				case "fordcreditservices":
					siteSection = 'fordcreditservices';
					break;
				case "owners":
					siteSection = 'owners';
					break;
				case "contact-us":
					siteSection = 'contact';
					break;
				case "glossary":
					siteSection = 'glossary';
					break;
				case "windowsticker":
					siteSection = 'window sticker';
					break;
				case "privacy":
					siteSection = 'privacy';
					break;
				case "california-privacy":
					siteSection = 'caprivacy';
					break;
				case "competitivecompare":
				case "comparesummary":
				case "compareadvantage":
				case "comparephoto":
				case "compareequipped":
				case "comparechoose":
				case "comparechooseford":
					siteSection = 'competitive';
					break;
				case "innovation-sync-overview":
				case "innovation-sync-about":
				case "innovation-sync-features":
				case "innovation-sync-availability":
				case "innovation-sync-owner":
					siteSection = 'awareness';
					break;
				case "locateadealer":
					siteSection = 'dealerships';
					break;
				case "seo":
				case "seohybrid":
				case "seotechnology":
				case "ownerslanding":
					siteSection = 'lp';
					break;	
				case "brochures":
					siteSection = 'brochures';
					break;
				case "interstitial":
					siteSection = 'vehicle';
					break;
				case "incentives":
					siteSection = 'incentives';
					break;
				case "innovation-null-overview":
					siteSection = "awareness"
				break;
				case "ratings-reviews":
				case "stories":
				case "submit-story":
					siteSection = "reveal";
					break;
				case "allvehicles":
					siteSection = "showroom"
				case "certifiedpreowned":
				siteSection = 'cpo';
				break;
				default:
					siteSection = 'defaultsiteSection';
			}
		}
		
		return siteSection;
	};
	
	this.site = function() {
		var make = this.getMake();
	    var site;
	    switch(make){
	        case "Ford": 
	        	site = "ford.com";
	        	break;
	        case "Lincoln": 
	        	site = "lincoln.com";
	        	break;
	        default: 
	        	site = "ford.com";
	    }
	    return site;
	};
	
	this.client = function() {		
		var make = this.getMake();
        var client;
        switch(make){
            case "Ford": 
            	client = 'ford';
            	break;
            case "Lincoln": 
            	client = 'lincoln';
            	break;
            case "Mercury":
            	client = 'mercury';
            	break;
            default: 
            	client = 'ford';
        }
        return client;
	};

	this.brandVar = function(){
		var make = this.getMake();
		var brandVar;
		switch(make){
			case "Ford": 
				brandVar = "fv";
				break;
			case "Lincoln": 
				brandVar = "ln";
				break;
			case "Mercury": 
				brandVar = "mercury";
				break;
			default: 
				brandVar = "fv";
		}
		
		return brandVar;
	};
	
	this.advertiseID = function(){
		var make = this.getMake();
		var advertiseID;
		switch(make){
			case "Ford": 
				advertiseID = "fvflup";
				break;
			case "Lincoln": 
				advertiseID = "lngen2";
				break;			
			default: 
				advertiseID = "fvflup";
		}
		
		return advertiseID;
	};


	this.getBrandType = function(){
		var currentView = _widgets.context.SelectedContext.get("currentView");
		var brandType;
		switch(currentView){
			case "innovation-sync-overview":
			case "innovation-sync-about":
			case "innovation-sync-features":
			case "innovation-sync-availability":
			case "innovation-sync-owner": 
				brandType = 'thsync';
				break;
			default:
				brandType = 'fvflup';
		}
		return brandType;
	};
	
	this.compareTabName = function(){ 

                if(!this.compareCategoryTabName){
                    this.compareCategoryTabName = "packages";
                }
                var categoryName = this.compareCategoryTabName.toLowerCase().replace(/_/g,' ');
                if(categoryName.indexOf('category')!=-1){
                    return categoryName.substring('category'.length);
                }else{
                    return categoryName;
                }
            
};
	
	// do not remove this function 
	this.compareOrDetails = function(sMetricsParam){
		var sReturn = "";

		if (this.nameplate()==""){
			switch(sMetricsParam){
				case "hier1":
					sReturn = 'shopping tools: competitive compare';
					break;
				case "pageName":
					sReturn = this.brandVar()  + ": vehicle: compare ";
					break;
				case "eVar11":
				case "prop11":
					sReturn = this.brandVar()  + ": vehicle: compare ";
					break;
				case "events":
					break;
				default:
					sReturn = "Implement Me this.compareOrDetails";
				}

		} else{

			switch(sMetricsParam){
				case "hier1":
					sReturn = this.siteLevel();
					break;
				case "pageName":
					sReturn = this.brandVar()  + ": vehicle: compare: details: " + this.nameplate();
					break;
				case "eVar11":
				case "prop11":
					sReturn = this.brandVar()  + ": vehicle : compare: details";
					break;
				case "events":
					sReturn= "event12";
					break;
				default:
					sReturn = "Implement Me this.compareOrDetails";
				}

		}
		return sReturn;
	};
	
	this.getSpecSection = function(){
		 var sVal = "";
		 elem = document.getElementById("urlLabel");
	    switch (elem.value)
	    {
	    
	      case "specifications" : 
		    return "specifications";
		    break;
	      case "specifications/exterior/" : 
		    return "exterior";
		    break;
	      case "specifications/interior/" : 
		    return "interior";
		    break;
	      case "specifications/capacities/" : 
		    return "capacities";
		    break;
	      case "specifications/engine/" : 
		    return "engine";
		    break;
	      case "specifications/chassis/" : 
		    return "chassis";
		    break;
		  case "specifications/towing/" : 
		    return "towing";
		    break;
		  case "specifications/payload/" : 
		    return "payload";
		    break;
		  case "specifications/view-all/" : 
		     return "view all";
		    break;
	      default : 
		   return "exterior";
		    break;        
           }

	 
	}
	this.compareDart = function(){
		if (this.nameplate()!=""){
			dartTracker.trackEvent('cc', this.nameplate(), 1, this.getBrandType(), "");
			// added for efficient frontier test
			dartTracker.trackEventsEfficient('cc');
		}
	};
	
	
	this.revealNameplate = function(){
		var revealNameplate = "";
		if (_widgets.context) {
			var lifeCycleStage = _widgets.context.SelectedContext.get("nameplate.lifeCycleStage");
			if (typeof(lifeCycleStage) === 'string' && lifeCycleStage.toLowerCase() === "reveal") {
				var nameplate = __params.modelName;
				revealNameplate = nameplate + " Reveal";
			}
		}
		return revealNameplate;
	};

	this.fullVideoType = function(){ 
		var onClickValue = "" ;	
		if (_widgets.context) {
			var currentView = _widgets.context.SelectedContext.get("currentView");
			
			switch (currentView) {
				case "innovation-sync-overview":
				case "innovation-sync-about":
				case "innovation-sync-features":
				case "innovation-sync-availability":
				case "innovation-sync-owner":
					onClickValue = "fv: tech: sync: video: full";
					break;
				default:
					onClickValue = "fv: home: video: full: " + this.nameplate();
			}
		}
		return onClickValue;
	};
	
	this.locateDealerEvent = function(){
		var ary = location.search.toLowerCase().split("?");
		var queryStr = ary.toString();
		var zipKey = "zip";
		var pageKey = "page";
		var postalKey = "postalcode";
		var zipFlag = queryStr.search(zipKey); 
		var postalFlag = queryStr.search(postalKey);
		var pageFlag = queryStr.search(pageKey);
		if(zipFlag>0||(postalFlag>0&&pageFlag<0)  ){
			return "event1";
		}
		else{
			return "";
		}
	};
	

	this.compareText = function(){
		var make = this.getMake();
		var compareText = "lincolnadvantages";
		switch(make){
		case "Lincoln":
			var compareText = "lincolnadvantages";
			break;
		case "Ford":
			compareText = "fordadvantages";
			break;
		default:
			compareText = "lincolnadvantages";
			break;
		}
		return compareText;
	};
	
	/*getter-setters NG News and Events pages*/
	this.setNewsDetailEvent = function(newsDetailTitle){
		this.newsTitle =  newsDetailTitle;
	};
	
	this.getNewsDetailEvent = function(){
		return this.newsTitle; 
	};
	
	this.setEventsDetailEvent = function(eventsDetailTitle){
		this.eventsTitle =  eventsDetailTitle;
	};
	
	this.getEventsDetailEvent = function(){
		return this.eventsTitle; 
	};
	
	this.getSearchCurrentResultNumber = function(){ 
		return this.searchCurrentResultNumber || 0;
	};

	this.searchTotalResults = function(){ 
	var totalRecords = "";
	if (_widgets.context) {
		totalRecords = _widgets.context.SearchContext.get('totalRecords');
	}
	return totalRecords;
	};
	
	this.bestBetsResults = function(){ 
	var bestBetsRecords = "";
	if(_widgets.context) {
		bestBetsRecords = _widgets.context.SearchContext.get('bestBetsRecords');
	}
	return bestBetsRecords;
	};
	
	this.itemDetailName = function(){
		return this.itemName.toLowerCase() ;
	};
	
	this.getSEO_Segment = function(){
		return this.SEO_Segment;
	};
	
	this.getSEO_SubSegment = function(){
		return this.SEO_SubSegment;
	};
	
	this.getSEO_Category = function(){
		return this.SEO_Category;
	};
	
	this.getSEO_Link = function(){
		return this.SEO_Link;
	};
	
	this.getSEO_LinkType = function(){
		return this.SEO_LinkType;
	};
	
	this.getSEO_Campaign = function(){
		return this.SEO_Campaign;
	};
	
	this.getSEO_ClickType = function(){
		return this.SEO_ClickType;
	};
	
	this.clearVars = function(){
		//Clearing Omniture Variables
		s.hier1='';
		s.eVar12='';
		s.prop12='';
		s.eVar22='';
		s.prop22='';
		s.prop34='';
		s.eVar9='';
		s.prop9='';
		s.eVar14='';
		s.prop14='';
		s.channel='';
		s.eVar35='';
		s.prop21='';
		s.eVar6='';
		s.prop6='';
		s.eVar15='';
		s.prop15='';
		s.eVar4='';
		s.prop4='';
		s.prop5='';
		s.eVar11='';
		s.prop35='';
		s.eVar16='';
		s.prop16='';		
		s.linkTrackVars='';
		s.events='';
		s.linkTrackEvents='';
		s.pageName='';
	};

	this.getMake = function() {
		var make = __params.make;
		var baseUrl = __params.baseURL;
		if(typeof(make) == "undefined"){
			if(baseUrl.indexOf("lincoln") >= 0){
				make = "Lincoln";
			}else{
				make = "Ford";
			}
		}
		return make;
		
	};

	this.inish = function(oSelf){
		this.self = oSelf;
	};

	this.trackMicroData = function(onClickName){
		//eval('this.self.' + onClickName +'()');
		if (!this[onClickName]){
			alert('Check your metrics!  trackMicroData called with onClickName of "'+onClickName+'", but a matching function does not exist.');
		}else{
			this[onClickName]();
		}
	};
	this.trackMacroData = function(pageName){
		switch(pageName){	
			//YOU ONLY NEED A CASE HERE IF pageName does not match the name of the function inside THIS
			case 'nameplateOverviewVideo':
				this.nameplateOverviewVideo();
			break;
			case 'nameplateOverviewImage':
				this.nameplateOverviewImage();	
			break;
			case 'featureCategoryViewed':
				this.featureCategoryViewed();
			break;
			case 'featureSubCategoryViewed':
				this.featureSubCategoryViewed();
			break;
			case 'incentivesresult':
				this.incentivesresult();
			break;
			case 'incentiveserror':
				this.incentiveserror();
			break;
			
			case 'lincoln-mkx-readmore':
				this.lincoln_mkx_readmore();
			break;
			case 'lincoln-mkx-explore':
				this.lincoln_mkx_explore();
			break;
	
			case 'lincoln-mkz-readmore':
				this.lincoln_mkz_readmore();
			break;
			case 'lincoln-mkz-explore':
				this.lincoln_mkz_explore();
			break;
			case '169-point-inspection':
				this.ford_cpo('fv: cpo: benefits: 169 inspection: ');
			break;
			case 'warranty':
				this.ford_cpo('fv: cpo: benefits: warranty: ');
			break;
			case '24-hour-roadside-assistance':		
				this.ford_cpo('fv: cpo: benefits: 24 hour road');
			break;
			case 'vehicle-history-report':
				this.ford_cpo('fv: cpo: benefits: vehicle history');
			break;
			case 'cost-of-ownership':
				this.ford_cpo('fv: cpo: benefits: cost of ownership');
			break;
			case 'benefits':
				this.ford_cpo('fv: cpo: benefits');
			break;
			case 'cpoIncentives':
				if(typeof incentiveName != 'undefined'){
					this.ford_cpo('fv: cpo: offers: '+incentiveName);
				}else{
					this.ford_cpo('fv: cpo: offers');
				}
			break;
			case 'cpoSearch':
				this.ford_cpo('fv: cpo: si');
			break;
			case 'cpoBeforeYouBuy':
				this.ford_cpo('fv: cpo: si: tips');
			break;
			case 'cpoBenefitsvehiclehistoryreport':
				this.cpoBenefitsvehiclehistoryreport();
			break;	
			case 'models':
				if(segmentName !=""){
					if(cpoModel !=""){
						this.ford_cpo_models_details('fv: cpo: showroom: ', segmentName, cpoModel);
					}else{
						this.ford_cpo('fv: cpo: showroom: '+segmentName);
					}
				}else{
					this.ford_cpo('fv: cpo: showroom');
				}
			break;
			default:
				if (!this[pageName]){
					alert('Check your metrics!  trackMacroData called with pageName of "'+pageName+'", but a matching function does not exist.');
				}else{
					this[pageName]();
				}
		}//End switch
	};
	this.partDetailsPage = function(){
	    this.commonsVariableSet();
		var h1 = s.hier1;
		
		s.pageName = this.getCodeForModel() + this.brandVar() + ': vehicle: models: '+this.modelsPage()+': ' + this.compareTabName() + ': ' + this.nameplate();
		s.eVar11=s.prop11= this.brandVar() + ': vehicle: models: '+this.modelsPage()+': ' + this.compareTabName();
		s.hier1 = "vehicle:models:"+this.modelYear()+":"+this.modelCategory()+":"+this.nameplate()+":"+this.compareTabName();
		
		void(s.t());
		
		
	};
	this.modelsPage = function(){
		var modelsPageName = 'detail';
		if(_widgets.context){
			var currentView = _widgets.context.SelectedContext.get("site.currentView");
			if (currentView == 'model-and-options-detailed-compare'){
				modelsPageName = 'compare';
			}else{
				modelsPageName = 'detail';
			}
		}
		return modelsPageName;
	};
	
	this.getGalleryData = function(dataName){
		sval = (galleryMetrics && galleryMetrics[dataName])?galleryMetrics[dataName]:'';
		if(sval=="videos-and-demos"){ 
			sval="videos";
			return(sval);
		};
		return sval;
	};
	this.getGalleryDataRoot = function(dataName){
		sval = (galleryMetrics && galleryMetrics[dataName])?galleryMetrics[dataName]:'';		
		if(sval=="all"){ 
			sval="";
			return(sval);
		};
		return ": " + sval;
	};

	this.mustangBoss = function(oParams){
		this.commonsVariableSet();
		for(var e in oParams) s[e] = oParams[e]
		void(s.t());
	};
	
	this.f150experience = function(oParams){
		this.commonsVariableSet();
		for(var e in oParams) s[e] = oParams[e]
		void(s.t());		
	};
	
	this.nameplateOverviewVideo = function(){
		this.clearVars();		
		s.pageName = this.getCodeForModel() + this.brandVar()+ ': vehicle: home: video: '+this.nameplate();
		//Variables for - Omniture

		s.eVar11=s.prop11= this.brandVar() + ': vehicle: home: video';

		void(s.t());
	};
	
	this.nameplateOverviewImage = function(){
		this.clearVars();		
		s.pageName = this.getCodeForModel() + this.brandVar() + ': vehicle: home: photo: '+this.nameplate();
		//Variables for - Omniture
		
		s.eVar11=s.prop11= this.brandVar() + ': vehicle: home: photo';
		
		void(s.t());
	};
	
	this.featureCategoryViewed = function(){
		this.clearVars();		
		s.pageName = this.brandVar() + ': vehicle: feature: ' +this.featureCategoryName() + ': ' + this.nameplate();
		//Variables for - Omniture
		
		s.eVar11=s.prop11= this.brandVar() + ': vehicle: feature';
		
		void(s.t());
	};
	
	this.vehicleHomepageTag = function(){ 
                var homepageTag = "vhp";
				if (_widgets.context) {
					var lifeCycleStage = _widgets.context.SelectedContext.get("nameplate.lifeCycleStage");
					if (typeof(lifeCycleStage) === 'string' && lifeCycleStage.toLowerCase() === "reveal") {
						homepageTag = "rhp";
					}
				}
                return homepageTag;            
        };
	
	
	this.featureSubCategoryViewed = function(){
		this.clearVars();		
		s.pageName = this.brandVar() + ': vehicle: feature: ' +this.featureCategoryName() + ': ' + this.featureName() + ': ' + this.nameplate();
		//Variables for - Omniture
		
		s.eVar11=s.prop11= this.brandVar() + ': vehicle: feature';
		
		void(s.t());
	};
	this.incentivesresult = function(){
		this.clearVars();
		this.commonsVariableSet();		
		s.pageName = this.brandVar() + ':vehicle:incentives:results:' + this.nameplate();
		//Variables for - Omniture
		s.hier1 = 'shopping tools:incentives:' + this.modelYear() + ':' + this.modelCategory() +':' + this.nameplate();
		s.eVar11=s.prop11= this.brandVar() + ':vehicle:incentives:results';
		s.events='event9';
		dartTracker.trackEvent('ir', this.nameplate(), 1, 'fvflup', '');
		void(s.t());
	};
	this.incentiveserror = function(){
		this.clearVars();	
		this.commonsVariableSet();
		s.pageName = this.brandVar() + ':incentives:error';
		//Variables for - Omniture
		
		s.eVar11=s.prop11= this.brandVar() + ':incentives:error';		
		void(s.t());
	};
	this.getQueryValue = function(key){
		hu = window.location.search.substring(1);
		gy = hu.split("&");
		for (i=0;i<gy.length;i++) {
			ft = gy[i].split("=");
			if (ft[0] == key) {
				return ft[1];
			}
		}
		return "";
	}
	this.hybridDart = function(){
		//only fire dart tag for two specific trims
		if(this.nameplate() == "ford fusion" || this.nameplate() == "ford escape"){
			var trim = this.getQueryValue("trim");		
			if(trim=="hybrid"){
				s.eVar18 = "hybrid";
				dartTracker.trackEvent('vhp', this.nameplate().replace(" ","") + 'hybrid', 0, 'fvflup', '','hybrid');
			} 
		}
	}

	this.ford_cpo = function(pageName) {
		this.clearVars();
		this.commonsVariableSet();

		if (pageName.indexOf('169 inspection') > -1 || pageName.indexOf('warranty') > -1 ) {
			s.eVar11 = s.prop11 = s.pageName = pageName + storedPageName;
		}
		else {
			s.eVar11 = s.prop11 = s.pageName = pageName;
		}
		
		
		if(
			pageName.indexOf('169 inspection') > -1 || 
			pageName.indexOf('24 hour road') > -1 || 
			pageName.indexOf('vehicle history') > -1 || 
			pageName.indexOf('cost of ownership') > -1 || 
			pageName.indexOf('warranty')
		){
			dartTracker.trackEvent('cpoben', this.nameplate(), 1, 'cpo');
		}
		
		
		void(s.t());
	}
	
	this.ford_cpo_models_details = function(prefix,cpoSegmentName,cpoModelName) {
		this.clearVars();
		this.commonsVariableSet();
		s.eVar16 = "ford "+cpoModelName;
		s.prop16 = "ford "+cpoModelName;
		s.eVar11 = s.prop11 = prefix+cpoSegmentName;
		s.pageName = prefix+cpoSegmentName+': '+cpoModelName;
		
		void(s.t());
	}
	this.siPrintClick = function() {
		s.linkTrackVars='channel,hier1,eVar12,prop12,eVar15,prop15,eVar4,prop4,eVar9,prop9,eVar14,prop14,eVar16,prop16,prop11';
		s.tl(this, 'd', "fv: cpo: si: tips: print");
	}
	
	this.cpoBenefits169Download = function() {
		s.prop5 = "cpo: benefits: download: 169-Point-Inspection";
		s.linkTrackVars='channel,hier1,eVar12,prop12,eVar15,prop15,eVar4,prop4,eVar9,prop9,eVar14,prop14,eVar16,prop16,prop11,prop5';
		s.tl(this, 'd', "fv: cpo: benefits: download");
	}	
	this.cpoBenefitsvehiclehistoryreport = function() {
		s.prop5 = "cpo: benefits: download: Vehicle History Report";
		s.linkTrackVars='channel,hier1,eVar12,prop12,eVar15,prop15,eVar4,prop4,eVar9,prop9,eVar14,prop14,eVar16,prop16,prop11,prop5';
		s.tl(this, 'd', "fv: cpo: benefits: download");
	}		

	this.cpoBenefitsWarrantyDownload = function() {
		s.prop5 = "cpo: benefits: download: Warranty";
		s.linkTrackVars='channel,hier1,eVar12,prop12,eVar15,prop15,eVar4,prop4,eVar9,prop9,eVar14,prop14,eVar16,prop16,prop11,prop5';
		s.tl(this, 'd', "fv: cpo: benefits: download");
	} 

	this.cpoShowroomBrochureDownload = function() {
		s.prop5 = "";
		//Following two variables are set in the model-detail.ftl file, one on the onclick and one before the onclick
		s.eVar16 = "ford "+cpoModel;
		s.prop16 = "ford "+cpoModel;
		s.eVar12 = cpoModelYear;
		s.prop12 = cpoModelYear;
		s.linkTrackVars='channel,hier1,eVar12,prop12,eVar15,prop15,eVar4,prop4,eVar9,prop9,eVar14,prop14,eVar16,prop16,prop11';
		s.tl(this, 'd', "cpo: showroom: brochure download");
	}
	
	this.cpoSearchInventoryCTA = function() {
		s.prop5 = "";
		//Following two variables are set in the model-detail.ftl file, one on the onclick and one before the onclick
		s.eVar16 = cpoModel;
		s.prop16 = cpoModel;
		s.eVar12 = "";
		s.prop12 = "";
		s.linkTrackVars='channel,hier1,eVar15,prop15,eVar4,prop4,eVar9,prop9,eVar14,prop14,eVar16,prop16,prop11';
		s.tl(this, 'o', "cpo: showroom: search inventory");
	}	
	
	this.cpoBenefitsHistoryDownload = function() {
		s.prop5 = "cpo: benefits: download: Vehicle History";
		s.linkTrackVars='channel,hier1,eVar12,prop12,eVar15,prop15,eVar4,prop4,eVar9,prop9,eVar14,prop14,eVar16,prop16,prop11,prop5';
		s.tl(this, 'd', "fv: cpo: benefits: download");
	}
			
	this.lincoln_mkx_readmore = function() {
		this.clearVars();
		
		s.prop5 = "ln:home:billboard:learn more";
		s.pageName = s.prop5 + ":mkx" ;
		void(s.t());
	}
	
	this.lincoln_mkx_explore = function() {
		this.clearVars();

		s.prop5 = "ln:home:billboard:go to vhp";
		s.pageName = s.prop5 + ":mkx" ;
		void(s.t());
	}
	
	this.lincoln_mkz_readmore = function() {
		this.clearVars();

		s.prop5 = "ln:home:billboard:learn more";
		s.pageName = s.prop5 + ":mkz" ;
		void(s.t());
	}
	
	this.lincoln_mkz_explore = function() {
		this.clearVars();

		s.prop5 = "ln:home:billboard:go to vhp";
		s.pageName = s.prop5 + ":mkz" ;
		void(s.t());
	}
	
	this.point_inspection = function() {
		this.clearVars();

		s.prop5 = "ln:cpo:benefits:169 point inspection";
		s.pageName =  "ln:cpo:benefits:169 point inspection";
		void(s.t());
	}
	
	this.warranty = function() {
		this.clearVars();

		s.prop5 = "ln:cpo:benefits:comprehensive warranty";
		s.pageName =  "ln:cpo:benefits:comprehensive waranty";
		void(s.t());
	}
	
	this.hour_roadside_assistance = function() {
		this.clearVars();

		s.prop5 = "ln:cpo:benefits:24 roadside";
		s.pageName =  "ln:cpo:benefits:24 roadside";
		void(s.t());
	}
	
	this.vehicle_history_report = function() {
		this.clearVars();

		s.prop5 = "ln:cpo:benefits:vehicle history";
		s.pageName =  "ln:cpo:benefits:vehicle history";
		void(s.t());
	}
	
	this.benefits = function() {
		this.clearVars();

		s.prop5 = "ln:cpo:benefits:all cpo benefits";
		s.pageName =  "ln:cpo:benefits:all cpo benefits";
		void(s.t());
	}
	
	this.offers1= function()  {
		this.clearVars();

		s.prop5 = "ln:cpo:incentives:offers1";
		s.pageName =  "ln:cpo:incentives:offers1";
		void(s.t());
	}
	
	this.offers2 = function() {
		this.clearVars();

		s.prop5 = "ln:cpo:incentives:offers2";
		s.pageName =  "ln:cpo:incentives:offers2";
		void(s.t());
	}
	
	this.offers3 = function() {
		this.clearVars();

		s.prop5 = "ln:cpo:incentives:offers3";
		s.pageName =  "ln:cpo:incentives:offers3";
		void(s.t());
	}
	
	this.allVehiclesClick = function (nameplate, year, segment, click) {
		this.clearVars();
		
		var h1year = year.length>0? ':'+year: '',
			h1segment = segment.length>0? ':'+segment: '',
			h1nameplate = nameplate.length>0? ':'+nameplate: '',
			trim=trim||'';
		
		// TODO: make less ugly
		if (nameplate.indexOf('electric') !== -1) {
			trim = 'electric';
		} else if (nameplate.indexOf('hybrid') !== -1) {
			trim = 'hybrid';
		} else if (nameplate.indexOf('ev') !== -1) {
			trim = 'ev';
		} else if (nameplate.indexOf('energi') !== -1) {
			trim = 'energi';
		}
		nameplate=nameplate.replace(" electric",'');
		nameplate=nameplate.replace(" hybrid",'');
		nameplate=nameplate.replace(" ev",'');
		nameplate=nameplate.replace(" energi",'');
		nameplate=nameplate.replace(" the new",'');
		nameplate=nameplate.replace(" thenew",'');	
				
		s.hier1 = 'showroom' + h1year + h1segment + h1nameplate;
		
		s.channel = 'showroom';
		
		s.prop5 = this.brandVar() + ': showroom: ' + click;
		s.eVar12 = s.prop12 = year;
		s.eVar16 = s.prop16 = nameplate;
		s.eVar18 = trim;

		s.eVar11 = '';
		s.prop11 = '';

		s.tl(this, 'o', s.prop5);
	};
	
	this.getSyncCmdCategory = function() {
		switch(this.syncCategoryIndex) {
			case 1:
				return 'peace of mind';
			case 2:
				return 'staying in touch';
			case 3:
				return 'drivers assistance';
			case 4:
				return 'entertainment';
			case 0:
			default:
				return 'favorites';
		}
	};
		
	this.getSyncCmdSubcategory = function() {
		// see showvoice.js -> metricsClick object
		return this.syncSubcategory;
		
	};
	
	this.trackMicroDataAndSEOContext = function(onClickName, sSEO_Segment, sSEO_SubSegment, sSEO_Category, sSEO_Link, sSEO_LinkType, sSEO_CampainID, sSEO_ClickType){
		
		this.SEO_Segment = sSEO_Segment;
		this.SEO_SubSegment = sSEO_SubSegment;
		this.SEO_Category = sSEO_Category;
		this.SEO_Link = sSEO_Link;		
		this.SEO_LinkType = sSEO_LinkType;
		this.SEO_Campaign = sSEO_CampainID;
		this.SEO_ClickType = sSEO_ClickType;
		
		eval('this.self.' + onClickName +'()');
	};	
	
	this.syncConfigPageName = function(e) {
		e = e || false;
		var vehicle = this.syncConfigGetVehicle();
		
		if (vehicle) {
			if (e) {
				return "vehicles";
			} else {
				return "vehicles: " + vehicle;
			}
		} else {
			return "packages";
		}
	};
	
	this.syncConfigGetVehicle = function() {
		var nameplate = document.getElementById("nameplate");
		var vehicle = false;
		if (nameplate) {
			vehicle = nameplate.getAttribute("metrics-nameplate");
		}
		return vehicle;
	};
	
	this.syncConfigPageNameNoVehicle;
	
	this.syncConfigModelYear = function() {
		var nameplate = document.getElementById("nameplate");
		var year = false;
		if (nameplate) {
			year = nameplate.getAttribute("metrics-year");
		}
		return year;
	};
	
	this.syncSubFeature = function() {
		var url = window.location.pathname;
		var feature = '';
		if(url.indexOf('/technology/sync/features/') != -1 && url.replace('/technology/sync/features/', '').length > 1){
			feature = ':' + url.replace('/technology/sync/features/', '');
			feature = feature.replace('/', '');
			feature = feature.replace(/\-/g, ' ');
		}
		if(feature[0] == ':'){
			feature = feature.substring(1);
		}
		return feature;
	};
};

var oMetricsTracker = new com.forddirect.brandsites.metrics.NewMetricsTracker();
oMetricsTracker.inish(oMetricsTracker);

