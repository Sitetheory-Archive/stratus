// Registry Service
// ----------------

/* global define */

// Define AMD, Require.js, or Contextual Scope
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([
      'stratus',
      'underscore',
      'angular',
      'stratus.services.collection',
      'stratus.services.model'
    ], factory)
  } else {
    factory(root.Stratus, root._, root.angular)
  }
}(this, function (Stratus, _, angular) {
  // This Registry Service handles data binding for an element
  Stratus.Services.Registry = [
    '$provide',
    function ($provide) {
      $provide.factory('Registry', [
        'Collection',
        'Model',
        '$interpolate',
        function (Collection, Model, $interpolate) {
          Stratus.Prototypes.AngularRegistry = Stratus.Prototypes.AngularRegistry || class AngularRegistry {
            constructor () {
              // Scope Binding
              this.fetch = this.fetch.bind(this)
            }

            // TODO: Handle Version Routing through Angular
            // Maintain all models in Namespace
            // Inverse the parent and child objects the same way Doctrine does
            /**
             * @param $element
             * @param $scope
             * @returns Promise
             */
            fetch ($element, $scope) {
              return new Promise(function (resolve, reject) {
                if (typeof $element === 'string') {
                  $element = {
                    target: $element
                  }
                }
                const options = {
                  target: $element.attr
                    ? $element.attr('data-target')
                    : $element.target,
                  targetSuffix: $element.attr
                    ? $element.attr('data-target-suffix')
                    : $element.targetSuffix,
                  id: $element.attr ? $element.attr('data-id') : $element.id,
                  manifest: $element.attr
                    ? $element.attr('data-manifest')
                    : $element.manifest,
                  decouple: $element.attr
                    ? $element.attr('data-decouple')
                    : $element.decouple,
                  direct: $element.attr
                    ? $element.attr('data-direct')
                    : $element.direct,
                  api: $element.attr ? $element.attr('data-api') : $element.api,
                  urlRoot: $element.attr ? $element.attr('data-url-root') : $element.urlRoot
                }
                /* TODO: handle these sorts of shortcuts to the API that components are providing *
                $scope.api = _.isJSON($attrs.api) ? JSON.parse($attrs.api) : false
                const request = {
                  api: {
                    options: this.options ? this.options : {},
                    limit: _.isJSON($attrs.limit) ? JSON.parse($attrs.limit) : 40
                  }
                }
                if ($scope.api && _.isObject($scope.api)) {
                  request.api = _.extendDeep(request.api, $scope.api)
                }
                /* */
                let completed = 0
                let verify = function () {
                  if (!_.isNumber(completed) || completed !== _.size(options)) {
                    return
                  }
                  resolve(AngularRegistry.build(options, $scope))
                }
                _.each(options, function (element, key) {
                  if (!element || typeof element !== 'string') {
                    completed++
                    verify()
                    return
                  }
                  const interpreter = $interpolate(element, false, null, true)
                  const initial = interpreter($scope.$parent)
                  if (typeof initial !== 'undefined') {
                    options[key] = initial
                    completed++
                    verify()
                    return
                  }
                  if (!Stratus.Environment.get('production')) {
                    console.log('poll attribute:', key)
                  }
                  _.poll(function () {
                    return interpreter($scope.$parent)
                  }, 7500, 250)
                    .then(function (value) {
                      if (!Stratus.Environment.get('production')) {
                        console.log('interpreted:', value)
                      }
                      if (typeof value === 'undefined') {
                        return
                      }
                      options[key] = value
                      completed++
                      verify()
                    })
                    .catch(function (message) {
                      console.error(message)
                    })
                })
              })
            }

            /**
             * @returns {collection|model|*}
             */
            static build (options, $scope) {
              let data
              if (options.target) {
                options.target = _.ucfirst(options.target)

                // Find or Create Reference
                if (options.manifest || options.id) {
                  if (!Stratus.Catalog[options.target]) {
                    Stratus.Catalog[options.target] = {}
                  }
                  const id = options.id || 'manifest'
                  if (options.decouple || !Stratus.Catalog[options.target][id]) {
                    const modelOptions = {
                      target: options.target,
                      manifest: options.manifest,
                      stagger: true
                    }
                    if (options.urlRoot) {
                      modelOptions.urlRoot = options.urlRoot
                    }
                    if (options.targetSuffix) {
                      modelOptions.targetSuffix = options.targetSuffix
                    }
                    data = new Model(modelOptions, {
                      id: options.id
                    })
                    if (!options.decouple) {
                      Stratus.Catalog[options.target][id] = data
                    }
                  } else if (Stratus.Catalog[options.target][id]) {
                    data = Stratus.Catalog[options.target][id]
                  }
                } else {
                  const registry = !options.direct ? 'Catalog' : 'Compendium'
                  if (!Stratus[registry][options.target]) {
                    Stratus[registry][options.target] = {}
                  }
                  if (options.decouple ||
                    !Stratus[registry][options.target].collection) {
                    const collectionOptions = {
                      target: options.target,
                      direct: !!options.direct
                    }
                    if (options.urlRoot) {
                      collectionOptions.urlRoot = options.urlRoot
                    }
                    if (options.targetSuffix) {
                      collectionOptions.targetSuffix = options.targetSuffix
                    }
                    data = new Collection(collectionOptions)
                    if (!options.decouple) {
                      Stratus[registry][options.target].collection = data
                    }
                  } else if (Stratus[registry][options.target].collection) {
                    data = Stratus[registry][options.target].collection
                  }
                }

                // Filter if Necessary
                if (options.api) {
                  data.meta.set('api', _.isJSON(options.api)
                    ? JSON.parse(options.api)
                    : options.api)
                }

                // Handle Staggered
                if (data.stagger && typeof data.initialize === 'function') {
                  data.initialize()
                }
              }

              // Evaluate
              if (typeof data === 'object' && data !== null) {
                if (typeof $scope !== 'undefined') {
                  $scope.data = data
                  if (data instanceof Model) {
                    $scope.model = data
                  } else if (data instanceof Collection) {
                    $scope.collection = data
                  }
                }
                if (!data.pending && !data.completed) {
                  data.fetch()
                }
              }
              return data
            }
          }
          return new Stratus.Prototypes.AngularRegistry()
        }
      ])
    }
  ]
}))
