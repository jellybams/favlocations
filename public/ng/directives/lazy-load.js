(function (ng) {
  'use strict';

  var app = ng.module('flInlineScript', []);

  app.directive('script', function() {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, elem, attr) {
        if (attr.type === 'text/javascript-lazy') {
          var code = elem.text();
          var f = new Function(code);
          f();
        }
      }
    };
  });

}(angular));


favlocations.module.directive('flLoadScript', [function() {
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {
            //console.log(angular.element('<script src="'+toLoad+'"></script>'));
            var toLoad = attrs.flLoadScript;
            //element.replaceWith(angular.element('<script src="'+toLoad+'"></script>'));

            var script = document.createElement('script');
            script.src = toLoad;
            element.append(script);
        }
    };
}]);