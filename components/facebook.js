// Facebook Component
// ------------------

/* global define, FB */

// Define AMD, Require.js, or Contextual Scope
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['stratus', 'underscore', 'angular', 'angular-material'], factory)
  } else {
    factory(root.Stratus, root._, root.angular)
  }
}(this, function (Stratus, _, angular) {
  // This component intends to handle binding and
  // full pagination for the scope's collection.
  Stratus.Components.Facebook = {
    bindings: {
      pageId: '@',
      appId: '@',
      token: '@'
    },
    controller: function ($scope, $http) {
      Stratus.Instances[_.uniqueId('facebook_')] = $scope

      // Custom Variables
      let facebookPageName = 'Brand New Congress'
      let facebookPageId = 'brandnewcongress'
      let containerId = 'facebookPageContainer'
      let relatedContainerId = 'currentMediaContainer'
      let relatedContainerOffset = -150

      // Setup
      let container = document.getElementById(containerId)
      let relatedContainer = document.getElementById(
        (relatedContainerId || containerId))
      let loadJob

      // Functions
      function resizePlugin () {
        // Manually resize Facebook Plugin's span and iframe to be 100%
        let plugin = document.querySelector('.fb-page')
        let containerSpan = plugin.querySelector('span')
        containerSpan.style.width = '100%'
        let iframe = plugin.querySelector('iframe')
        iframe.width = '100%'
        iframe.style.width = '100%'

        // FB has max 500px, scale if it's bigger so it fits in space at least
        let maxWidth = 500
        let width = container.offsetWidth
        if (width > maxWidth) {
          let scale = width / maxWidth
          iframe.style.transform = 'scale(' + scale + ')'
          iframe.style['transform-origin'] = '0 0'
        }
      }

      function loadPlugin () {
        // Get height of the related Container (e.g. in another column)
        let height = relatedContainer.offsetHeight
        height = height > 0 ? (height + relatedContainerOffset) : height
        let width = container.offsetWidth
        let minHeight = 500
        let minWidth = 500
        height = height < minHeight ? minHeight : height
        width = width < minWidth ? minWidth : width

        // Facebook Page Plugin Code
        let content = '<div class="fb-page" data-href="https://www.facebook.com/' +
          facebookPageId + '" data-tabs="timeline" data-width="' + width +
          '" data-height="' + height +
          '" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true"></div><blockquote cite="https://www.facebook.com/' +
          facebookPageId +
          '" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/' +
          facebookPageId + '">' + facebookPageName + '</a></blockquote>'

        // Empty Container
        while (container.firstChild) {
          container.removeChild(container.firstChild)
        }

        // Add Plugin
        container.innerHTML = content

        // Parse Plugin
        FB.XFBML.parse()
      }

      // Register Resize after Plugin is Rendered
      FB.Event.subscribe('xfbml.render', function () {
        resizePlugin()
      })

      // (HACK): LoadPlugin does not resize height correctly on Load because it
      // does not know the correct height so we delay it until the height is
      // set
      loadJob = Stratus.Chronos.add(0.2, function () {
        // hard code a bit less than related contaier
        if (relatedContainer.offsetHeight > 0) {
          Stratus.Chronos.disable(loadJob)
          loadPlugin()
        }
      }, this)
      Stratus.Chronos.enable(loadJob)

      // Reload on Resize
      window.onresize = function () {
        loadPlugin()
      }

      /**
       $scope.fetch = function () {
                if ($scope.bindings.appId) {
                    $http({
                        method: 'POST',
                        url: 'https://graph.facebook.com/' + $scope.bindings.pageId + '/feed?app_id=' + $scope.bindings.appId + ($scope.bindings.token ? '&access_token=' + $scope.bindings.token : ''),
                        data: {
                            message: 'message',
                            name: 'name',
                            caption: 'caption',
                            description: 'desc'
                        }
                    }).then(function (response) {
                        console.log('success:', response);
                    }, function (error) {
                        console.error('error:', error);
                    });
                }
            };
       /**/
      $scope.$watch('bindings', function () {
        // $scope.fetch();
      })
    },
    template: ''
  }
}))
