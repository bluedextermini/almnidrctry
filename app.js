(function() {
  'use strict';

  angular.module('NarrowItDownApp',[])
  .service('MenuSearchService', MenuSearchService)
  .controller('NarrowItDownController',  NarrowItDownController)
  .controller('AlumniSearchController',  AlumniSearchController)
  .directive('foundItems',FoundItemsDirective)
  .directive('foundAlumni',FoundAlumniDirective)
  .service('AlumniSearchService', AlumniSearchService)
  .controller('FoundItemsDirectiveController', FoundItemsDirectiveController);

  function FoundItemsDirective(){
    var ddo={
       templateUrl:'foundItemDirective.html',
       restrict:'AE',
       scope:{
             found:'=',
             remove:'&'
       },
      controller :FoundItemsDirectiveController,
      controllerAs : 'fid',
      bindToController : true
    };
    return ddo;
  }
  
  
  function FoundAlumniDirective(){
    var ddo={
       templateUrl:'foundAlumniDirective.html',
       restrict:'AE',
       scope:{
             found:'=',
             remove:'&'
       },
      controller :FoundAlumniDirectiveController,
      controllerAs : 'fad',
      bindToController : true
    };
    return ddo;
  }

  function FoundItemsDirectiveController(){
    var directiveCtrl=this;
    console.log('directive ::fid.found',directiveCtrl.found);

  }
  
   
  function FoundAlumniDirectiveController(){
    var alumniDirectiveCtrl=this;
    console.log('alumni directive found ::fad.found',alumniDirectiveCtrl.found);
  }

  
  NarrowItDownController.$inject=['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
    var search=this;
    search.searchTerm="";
	
    search.narrowItDown=function(){
      console.log("search.searchTerm::",search.searchTerm);
      MenuSearchService.getMatchedMenuItems(search.searchTerm).then(function(result){
        search.found=result;
        console.log("controller found Items Length::",search.found.length);
        console.log("controller found Items",search.found);
      });
    }

    search.dontWantThisOne=function(index){
      search.found.splice(index,1);
    }
    return search;
  }
  
  
  AlumniSearchController.$inject=['AlumniSearchService'];
  function AlumniSearchController(AlumniSearchService){
    var search=this;
    search.searchTerm="";
	//search.found=null;
    search.narrowItDown=function(){
      console.log("alumni search.searchTerm::",search.searchTerm);
	  //search.found=null;
  
	  /*var promise=AlumniSearchService.getMatchedAlumni(search.searchTerm);
	   
	   promise.then(
		   function(result){
			   console.log("successfull call to service");
			   search.found=result;
			   console.log("alumni:::controller found Items Length::",search.found.length);
		   }, 
		   function(error){
			   
			   console.log(error);
		   }
	   ); */
	   
   
		  AlumniSearchService.getMatchedAlumni(search.searchTerm).then(function(result){
			search.found=result;
			//search.isButtonClicked=true;
		  })
		  .catch(function(error){
			//search.isButtonClicked=true;
			console.log("some error occured while fetching matched alumnis");
		  });
    }
	   
        //console.log("controller found Items",search.found);
     
    search.dontWantThisOne=function(index){
      search.found.splice(index,1);
    }
    return search;
  }
  


  MenuSearchService.$inject=['$http','$q'];
  function MenuSearchService($http, $q){
      var deferred = $q.defer();
      var service=this;
      service.founditems=undefined;
      service.getMatchedMenuItems=function(searchTerm){
        service.searchTerm=searchTerm;
        $http({
         url : "https://davids-restaurant.herokuapp.com/menu_items.json",
         method: 'GET'
       }).then(function (result) {
              var menuItems= result.data.menu_items;
              var foundItems;
             console.log('menuItems.length',menuItems.length);
             console.log('Menu items',menuItems);

             foundItems=menuItems.filter(isMatchFound);
             deferred.resolve(foundItems);
             //console.log('foundItems',foundItems);
             // return processed items
             return foundItems;
       })
       .catch(function(error){
         deferred.reject("Some Error occurred");
       });
       return deferred.promise;
      }
      var isMatchFound=function(value){
        var match= (value.description.toLowerCase().indexOf(service.searchTerm))>-1? true: false;
        //console.log(value.description, match);
        return match;
      }


  }
  
  
  AlumniSearchService.$inject=['$http','$q'];
  function AlumniSearchService($http, $q){
      var deferred = $q.defer();
      var service=this;
      //service.founditems=undefined;
      service.getMatchedAlumni=function(searchTerm){
		var deferred = $q.defer();
        service.searchTerm=searchTerm;
        $http({
         url : "https://spreadsheets.google.com/feeds/list/1YdGsWLuPy2XkVUpe3Tw3Hbs7mTDflq6Bv9JsXjc9nyY/1/public/values?alt=json"+"&random=" + Math.random(),
         method: 'GET'
       }).then(function (result) {
			 //debugger;
              var alumniList= result.data.feed.entry;
              var foundAlumni;
             console.log('alumniList.length',alumniList.length);
             //console.log('Menu items',alumniList);

             foundAlumni=alumniList.filter(isMatchFound);
			 
			 console.log("filtered alumni list @controller", foundAlumni);
             deferred.resolve(foundAlumni);
             //console.log('foundItems',foundItems);
             // return processed items
             //return foundAlumni;
       })
       .catch(function(error){
         deferred.reject("Some Error occurred");
       });
       return deferred.promise;
      }
      var isMatchFound=function(value){
		//console.log("alumni value", value);
        var match= (value.gsx$name.$t.toLowerCase().indexOf(service.searchTerm))>-1? true: false;
        console.log(value.gsx$name.$t, match);
        return match;
      }


  }

}());
