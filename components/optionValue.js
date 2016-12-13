//     Stratus.Components.OptionValue.js 1.0

//     Copyright (c) 2016 by Sitetheory, All Rights Reserved
//
//     All information contained herein is, and remains the
//     property of Sitetheory and its suppliers, if any.
//     The intellectual and technical concepts contained herein
//     are proprietary to Sitetheory and its suppliers and may be
//     covered by U.S. and Foreign Patents, patents in process,
//     and are protected by trade secret or copyright law.
//     Dissemination of this information or reproduction of this
//     material is strictly forbidden unless prior written
//     permission is obtained from Sitetheory.
//
//     For full details and documentation:
//     http://docs.sitetheory.io

// Stratus OptionValue Component
// -----------------------

// Define AMD, Require.js, or Contextual Scope
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['stratus', 'moment', 'angular'], factory);
    } else {
        factory(root.Stratus, root.moment);
    }
}(this, function (Stratus, moment) {
    // This component intends to handle binding of an
    // item array into a particular attribute.
    Stratus.Components.OptionValue = {
        bindings: {
            ngModel: '=',
            custom: '@',
            multiple: '@',
            options: '=',
            type: '@'
        },
        controller: function ($scope, $element, $parse, attributes, ngModel) {
            $scope.model = $parse(attributes.ngModel);
            $scope.items = ngModel;
            var normalize = function () {
                if (!angular.isArray($scope.items)) $scope.items = [];
                if (!$scope.items.length) $scope.items.push({});
            };
            normalize();
            $scope.$watch('items', function (items) {
                $scope.model.assign($scope.$parent, items);
            }, true);
            $scope.$parent.$watch(attributes.ngModel, function (items) {
                $scope.items = items;
                normalize();
            }, true);
        },
        template: '<div ng-if="items.length" ng-repeat="item in items" layout="row">\
            <md-select ng-model="item.type" flex="10" aria-label="{{ type }}">\
                <md-option ng-repeat="option in options" ng-value="option" ng-selected="item.name == option">\
                    {{ option }}\
                </md-option>\
            </md-select>\
            <md-input-container flex>\
                <label>{{ type }}</label>\
                <input type="text" ng-model="item.value">\
            </md-input-container>\
            <md-button ng-if="$last" ng-click="items.push({})">add {{ type }}</md-button>\
        </div>'
    };
}));