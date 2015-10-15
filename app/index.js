var app = angular.module('StarterApp', ['ngMaterial', 'ngMdIcons']);

app.config(function($mdThemingProvider, $mdIconProvider) {
    $mdIconProvider
        .defaultIconSet("./assets/svg/avatars.svg", 128)
    var customBlueMap = 		$mdThemingProvider.extendPalette('light-blue', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
        .primaryPalette('customBlue', {
            'default': '600',
            'hue-1': '50'
        })
        .accentPalette('pink');
    $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});
app.run(function($log){
    $log.debug("StartApp running !")
})

app.controller('AppCtrl', ['$scope', '$mdSidenav', '$mdSidenav', '$mdBottomSheet', '$log', '$q','$timeout', 'userService', function($scope, $mdSidenav, $mdSidenav, $mdBottomSheet, $log, $q, $timeout, userService){
    var self = this;
    self.users        = [ ];
    self.selectUser   = selectUser;
    self.toggleList   = toggleUsersList;
    self.showContactOptions  = showContactOptions;

    //slider bar
    // Load all registered users

    userService
        .loadAllUsers()
        .then( function( users ) {
            self.users    = [].concat(users);
            self.selected = users[0];
            console.log(self.selected)
        });

    function selectUser ( user ) {
        self.selected = angular.isNumber(user) ? $scope.users[user] : user;
        self.toggleList();
    }

    function toggleUsersList() {
        var pending = $mdBottomSheet.hide() || $q.when(true);

        pending.then(function(){
            $mdSidenav('left').toggle();
        });
    }
    /**
     * Show the bottom sheet
     */
    function showContactOptions($event) {
        var user = self.selected;

        return $mdBottomSheet.show({
            parent: angular.element(document.getElementById('content')),
            templateUrl: 'view/contactSheet.html',
            controller: ['$mdBottomSheet', ContactPanelController],
            controllerAs: "cp",
            bindToController: true,
            targetEvent: $event
        }).then(function (clickedItem) {
            clickedItem && $log.debug(clickedItem.name + ' clicked!');
        });
    }
        /**
         * Bottom Sheet controller for the Avatar Actions
         */
        function ContactPanelController( $mdBottomSheet ) {
            this.user = user;
            this.actions = [
                { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
                { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
                { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
                { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
            ];
            this.submitContact = function(action) {
                $mdBottomSheet.hide(action);
            };
        }
// main content
    self.toggleSidenav = function(menuId) {
        console.log("left")
        $mdSidenav(menuId).toggle();
    };
        self.simulateQuery = false;
        self.isDisabled    = false;
        // list of `state` value/display objects
        self.states        = loadAll();
        self.querySearch   = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange   = searchTextChange;
        self.newState = newState;
        function newState(state) {
            alert("Sorry! You'll need to create a Constituion for " + state + " first!");
        }
        // ******************************
        // Internal methods
        // ******************************
        /**
         * Search for states... use $timeout to simulate
         * remote dataservice call.
         */
        function querySearch (query) {
            var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
                deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }
        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }
        function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
        }
        /**
         * Build `states` list of key/value pairs
         */
        function loadAll() {
            var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';
            return allStates.split(/, +/g).map( function (state) {
                return {
                    value: state.toLowerCase(),
                    display: state
                };
            });
        }
        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }

}]);