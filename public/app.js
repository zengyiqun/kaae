import _ from 'lodash';
import moment from 'moment';
import chrome from 'ui/chrome';
import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';
import $ from 'jquery';

/* Timepicker */
import 'ui/timepicker';
import 'ui/filter_bar';

import TableVisTypeProvider from 'ui/template_vis_type/TemplateVisType';
// import VisSchemasProvider from 'ui/vis/schemas';
// import tableVisTemplate from 'plugins/table_vis/table_vis.html';

import AggResponseTabifyTabifyProvider from 'ui/agg_response/tabify/tabify';
// import tableSpyModeTemplate from 'plugins/spy_modes/table_spy_mode.html';

require('ui/registry/vis_types').register(TableVisTypeProvider);

// import Notifier from 'ui/notify/notifier';
// import 'ui/autoload/styles';

/* Custom Template + CSS */
import './less/main.less';
import template from './templates/index.html';

var impactLogo = require('plugins/kaae/kaae.svg');

console.log('DEBUG APP START');

chrome
  .setBrand({
    'logo': 'url(' + impactLogo + ') left no-repeat',
    'smallLogo': 'url(' + impactLogo + ') left no-repeat',
    'title': 'Kaae'
  })
  .setNavBackground('#222222')
  .setTabs([]);

uiRoutes.enable();
uiRoutes
.when('/', {
  template,
  resolve: {
    currentTime($http) {
      return $http.get('../api/kaae/example').then(function (resp) {
        return resp.data.time;
      });
    },
    currentWatchers($http) {
      return $http.get('../api/kaae/status').then(function (resp) {
	console.log('DEBUG RESPONSE:',resp);
        return resp;
      });
    }
  }
})

uiModules
.get('api/kaae', [])
.controller('kaaeHelloWorld', function ($scope, $route, $interval, timefilter, Private) {
  $scope.title = 'Kaae';
  $scope.description = 'Kibana Alert App for Elasticsearch';
  $scope.store = window.sessionStorage;
  timefilter.enabled = true;

  const tabifyAggResponse = Private(AggResponseTabifyTabifyProvider);
  if ($route.current.locals.currentWatchers.data.hits.hits) {
	   $scope.watchers = $route.current.locals.currentWatchers.data.hits.hits;

	/*
	   $scope.spy.params.spyPerPage = 10;
	   $scope.table = tabifyAggResponse($scope.vis, $route.current.locals.currentWatchers.data.hits.hits, {
             canSplit: false,
             asAggConfigResults: true,
             partialRows: true
           });
	*/

  } else { $scope.watchers = []; }

  $scope.items = {};

  var currentTime = moment($route.current.locals.currentTime);
  $scope.currentTime = currentTime.format('HH:mm:ss');
  var unsubscribe = $interval(function () {
    $scope.currentTime = currentTime.add(1, 'second').format('HH:mm:ss');
  }, 1000);
  $scope.$watch('$destroy', unsubscribe);

  $scope.items = [];
  $scope.iackd = [];

});
