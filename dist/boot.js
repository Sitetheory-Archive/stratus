// Environment
// -----------

/* global cacheTime, config */

(function (root) {
  // To be or not to be...
  const hamlet = root.hamlet = {}
  root.hamlet.isCookie = function (key) {
    return typeof document.cookie === 'string' && document.cookie.indexOf(key + '=') !== -1
  }
  hamlet.isUndefined = function (key) {
    return undefined === this[key]
  }.bind(root)

  // Contextual Boot
  if (hamlet.isUndefined('boot')) {
    root.boot = {}
  }

  // Localize
  const boot = root.boot

  // Backward Compatibility
  if (!hamlet.isUndefined('cacheTime')) {
    boot.cacheTime = cacheTime
  }

  // Environment
  boot.dev = hamlet.isCookie('env')
  boot.local = hamlet.isCookie('local')
  boot.cacheTime = boot.cacheTime || '2'

  // Locations
  boot.host = boot.host || ''
  boot.cdn = boot.cdn || '/'
  boot.relative = boot.relative || ''
  boot.bundle = boot.bundle || ''

  // Require.js
  boot.configuration = boot.configuration || {}

  // Min Settings
  boot.suffix = (boot.dev) ? '' : '.min'
  boot.dashSuffix = (boot.dev) ? '' : '-min'
  boot.directory = (boot.dev) ? '' : 'min/'

  // Merge Tool
  boot.merge = function (destination, source) {
    if (destination === null || source === null) {
      return destination
    }
    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        destination[key] = (typeof destination[key] === 'object') ? boot.merge(
          destination[key], source[key]) : source[key]
      }
    }
    return destination
  }

  // Config Tool
  boot.config = function (configuration, options) {
    if (typeof configuration !== 'object') {
      return false
    }
    /* *
    if (typeof options !== 'object') options = {}
    let args = [
      boot.configuration,
      !configuration.paths ? { paths: configuration } : configuration
    ]
    if (typeof boot.merge === 'function') {
      boot.merge.apply(this, options.inverse ? args.reverse() : args)
    }
    return requirejs.config ? requirejs.config(boot.configuration) : boot.configuration
    /* */
    return boot.merge(boot.configuration, !configuration.paths ? { paths: configuration } : configuration)
  }

  // Initialization
  if (!hamlet.isUndefined('config')) {
    let localConfig = typeof config === 'function' ? config(boot) : config
    if (typeof localConfig === 'object' && localConfig) {
      boot.config(localConfig)
    }
  }
})(this)

// Configuration
// -------------

/* global boot */

boot.config({

  // Connection Settings
  waitSeconds: 30,

  // Cache Busting
  urlArgs: 'v=' + boot.cacheTime,

  // Version Location (Disabled During Beta Testing)
  baseUrl: ((boot.dev || boot.local) ? boot.host + '/' : boot.cdn) + boot.relative,
  bundlePath: (boot.bundle || '') + 'stratus/',

  // Dependencies
  shim: {
    /* Angular */
    angular: {
      exports: 'angular'
    },
    'angular-aria': {
      deps: ['angular']
    },
    'angular-animate': {
      deps: ['angular']
    },
    'angular-messages': {
      deps: ['angular']
    },
    'angular-material': {
      deps: [
        'angular-aria',
        'angular-animate',
        'angular-messages'
      ]
    },
    'angular-resource': {
      deps: ['angular']
    },
    'angular-sanitize': {
      deps: ['angular']
    },

    /* Angular Modules */
    'angular-file-upload': {
      deps: ['angular']
    },
    'angular-icons': {
      deps: ['angular']
    },
    'angular-scrollSpy': {
      deps: ['angular']
    },
    'angular-ui-tree': {
      deps: ['angular']
    },

    // Charts
    'chart.js': {
      deps: ['angular', 'chart']
    },

    /* Backbone */
    'backbone.relational': {
      deps: ['backbone']
    },

    /* Froala */
    'froala-align': {
      deps: ['froala']
    },
    'froala-char-counter': {
      deps: ['froala']
    },
    'froala-code-beautifier': {
      deps: ['froala']
    },
    'froala-code-view': {
      deps: ['froala']
    },
    'froala-colors': {
      deps: ['froala']
    },
    'froala-draggable': {
      deps: ['froala']
    },
    'froala-emoticons': {
      deps: ['froala']
    },
    'froala-entities': {
      deps: ['froala']
    },
    'froala-file': {
      deps: ['froala']
    },
    'froala-font-family': {
      deps: ['froala']
    },
    'froala-font-size': {
      deps: ['froala']
    },
    'froala-forms': {
      deps: ['froala']
    },
    'froala-fullscreen': {
      deps: ['froala']
    },
    'froala-help': {
      deps: ['froala']
    },
    'froala-image': {
      deps: ['froala']
    },
    'froala-image-manager': {
      deps: ['froala', 'froala-image']
    },
    'froala-inline-style': {
      deps: ['froala']
    },
    'froala-line-breaker': {
      deps: ['froala']
    },
    'froala-link': {
      deps: ['froala']
    },
    'froala-lists': {
      deps: ['froala']
    },
    'froala-paragraph-format': {
      deps: ['froala']
    },
    'froala-paragraph-style': {
      deps: ['froala']
    },
    'froala-quick-insert': {
      deps: ['froala']
    },
    'froala-quote': {
      deps: ['froala']
    },
    'froala-save': {
      deps: ['froala']
    },
    'froala-special-characters': {
      deps: ['froala']
    },
    'froala-table': {
      deps: ['froala']
    },
    'froala-url': {
      deps: ['froala']
    },
    'froala-video': {
      deps: ['froala']
    },
    'froala-word-paste': {
      deps: ['froala']
    },
    'angular-froala': {
      deps: ['angular', 'froala']
    },
    'angular-drag-and-drop-lists': {
      deps: ['angular']
    },

    /* Calendar */
    fullcalendar: {
      deps: [
        'jquery',
        'moment'
      ]
    }
  },

  // Package Directories
  packages: [
    /**
     {
         name: 'stratus',
         location: boot.bundle + 'stratus',
         main: 'stratus'
     },
     /**/
    {
      name: 'codemirror',
      location: boot.bundle + 'stratus/bower_components/codemirror',
      main: 'lib/codemirror'
    }
  ],

  // Relative Paths
  paths: {
    /* Require.js Plugins */
    text: boot.bundle + 'stratus/bower_components/text/text',

    /* Stratus Core Library */
    stratus: boot.bundle + 'stratus/dist/stratus' + boot.suffix,

    /* Stratus Core Collections */
    'stratus.collections.generic': boot.bundle + 'stratus/legacy/collections/generic' + boot.suffix,

    /* Stratus Core Models */
    'stratus.models.generic': boot.bundle + 'stratus/legacy/models/generic' + boot.suffix,

    /* Stratus Core Routers */
    'stratus.routers.generic': boot.bundle + 'stratus/routers/generic' + boot.suffix,
    'stratus.routers.version': boot.bundle + 'stratus/routers/version' + boot.suffix,

    /* Stratus Controllers */
    'stratus.controllers.dialogue': boot.bundle + 'stratus/controllers/dialogue' + boot.suffix,
    'stratus.controllers.generic': boot.bundle + 'stratus/controllers/generic' + boot.suffix,
    'stratus.controllers.panel': boot.bundle + 'stratus/controllers/panel' + boot.suffix,
    'stratus.controllers.filterContentType': boot.bundle + 'stratus/controllers/filterContentType' + boot.suffix,
    'stratus.controllers.createNewSite': boot.bundle + 'stratus/controllers/createNewSite' + boot.suffix,
    'stratus.controllers.selectMainRoute': boot.bundle + 'stratus/controllers/selectMainRoute' + boot.suffix,
    'stratus.controllers.addRoutingAlias': boot.bundle + 'stratus/controllers/addRoutingAlias' + boot.suffix,
    'stratus.controllers.productFilter': boot.bundle + 'stratus/controllers/productFilter' + boot.suffix,
    'stratus.controllers.invoiceProductFilter': boot.bundle + 'stratus/controllers/invoiceProductFilter' + boot.suffix,
    'stratus.controllers.userFilter': boot.bundle + 'stratus/controllers/userFilter' + boot.suffix,
    'stratus.controllers.filterStreamsByTag': boot.bundle + 'stratus/controllers/filterStreamsByTag' + boot.suffix,
    'stratus.controllers.selectedLayout': boot.bundle + 'stratus/controllers/selectedLayout' + boot.suffix,

    /* Stratus Core Components */
    'stratus.components.address': boot.bundle + 'stratus/components/address' + boot.suffix,
    'stratus.components.base': boot.bundle + 'stratus/components/base' + boot.suffix,
    'stratus.components.carousel': boot.bundle + 'stratus/components/carousel' + boot.suffix,
    'stratus.components.dateTime': boot.bundle + 'stratus/components/dateTime' + boot.suffix,
    'stratus.components.delete': boot.bundle + 'stratus/components/delete' + boot.suffix,
    'stratus.components.editLegacy': boot.bundle + 'stratus/components/editLegacy' + boot.suffix,
    'stratus.components.errorMessage': boot.bundle + 'stratus/components/errorMessage' + boot.suffix,
    'stratus.components.facebook': boot.bundle + 'stratus/components/facebook' + boot.suffix,
    'stratus.components.filter': boot.bundle + 'stratus/components/filter' + boot.suffix,
    'stratus.components.help': boot.bundle + 'stratus/components/help' + boot.suffix,
    'stratus.components.mediaSelector': boot.bundle + 'stratus/components/mediaSelector' + boot.suffix,
    'stratus.components.mediaLibrary': boot.bundle + 'stratus/components/mediaLibrary' + boot.suffix,
    'stratus.components.optionValue': boot.bundle + 'stratus/components/optionValue' + boot.suffix,
    'stratus.components.pagination': boot.bundle + 'stratus/components/pagination' + boot.suffix,
    'stratus.components.search': boot.bundle + 'stratus/components/search' + boot.suffix,
    'stratus.components.selector': boot.bundle + 'stratus/components/selector' + boot.suffix,
    'stratus.components.sort': boot.bundle + 'stratus/components/sort' + boot.suffix,
    'stratus.components.tweet': boot.bundle + 'stratus/components/tweet' + boot.suffix,
    'stratus.components.upload': boot.bundle + 'stratus/components/upload' + boot.suffix,
    // 'stratus.components.visualSelector': boot.bundle + 'stratus/components/visualSelector' + boot.suffix,
    'stratus.components.socialMedia': boot.bundle + 'stratus/components/socialMedia' + boot.suffix,
    'stratus.components.stream': boot.bundle + 'stratus/components/stream' + boot.suffix,
    'stratus.components.streamExcerpt': boot.bundle + 'stratus/components/streamExcerpt' + boot.suffix,
    'stratus.components.mediaDragDrop': boot.bundle + 'stratus/components/mediaDragDrop' + boot.suffix,
    'stratus.components.mediaDetails': boot.bundle + 'stratus/components/mediaDetails' + boot.suffix,
    'stratus.components.mediaShortDetails': boot.bundle + 'stratus/components/mediaShortDetails' + boot.suffix,
    'stratus.components.mediaUploader': boot.bundle + 'stratus/components/mediaUploader' + boot.suffix,
    'stratus.components.tag': boot.bundle + 'stratus/components/tag' + boot.suffix,

    /* Sitetheory Stream Components */
    'stratus.components.calendar': boot.bundle + 'stratus/components/calendar' + boot.suffix,
    'stratus.components.calendar.timezones': boot.bundle + 'stratus/components/calendar.timezones' + boot.suffix,
    'stratus.components.map': boot.bundle + 'stratus/components/map' + boot.suffix,

    /* Sitetheory Menu Components */
    'stratus.components.menuLink': boot.bundle + 'stratus/components/menuLink' + boot.suffix,

    // TODO: Move these to Sitetheory since they are specific to Sitetheory
    'stratus.components.permission': boot.bundle + 'stratus/components/permission' + boot.suffix,
    'stratus.components.permissions': boot.bundle + 'stratus/components/permissions' + boot.suffix,
    'stratus.components.publish': boot.bundle + 'stratus/components/publish' + boot.suffix,
    // 'stratus.components.themeSelector': boot.bundle + 'stratus/components/themeSelector' + boot.suffix,

    /* Stratus Core Directives */
    'stratus.directives.base': boot.bundle + 'stratus/directives/base' + boot.suffix,
    'stratus.directives.edit': boot.bundle + 'stratus/directives/edit' + boot.suffix,
    'stratus.directives.editInline': boot.bundle + 'stratus/directives/editInline' + boot.suffix,
    'stratus.directives.drag': boot.bundle + 'stratus/directives/drag' + boot.suffix,
    'stratus.directives.drop': boot.bundle + 'stratus/directives/drop' + boot.suffix,
    'stratus.directives.href': boot.bundle + 'stratus/directives/href' + boot.suffix,
    'stratus.directives.singleClick': boot.bundle + 'stratus/directives/singleClick' + boot.suffix,
    'stratus.directives.onScreen': boot.bundle + 'stratus/directives/onScreen' + boot.suffix,
    'stratus.directives.src': boot.bundle + 'stratus/directives/src' + boot.suffix,
    'stratus.directives.trigger': boot.bundle + 'stratus/directives/trigger' + boot.suffix,
    'stratus.directives.validate': boot.bundle + 'stratus/directives/validate' + boot.suffix,
    'stratus.directives.passwordCheck': boot.bundle + 'stratus/directives/passwordCheck' + boot.suffix,
    'stratus.directives.validateUrl': boot.bundle + 'stratus/directives/validateUrl' + boot.suffix,
    'stratus.directives.compileTemplate': boot.bundle + 'stratus/directives/compileTemplate' + boot.suffix,
    'stratus.directives.stringToNumber': boot.bundle + 'stratus/directives/stringToNumber' + boot.suffix,
    'stratus.directives.timestampToDate': boot.bundle + 'stratus/directives/timestampToDate' + boot.suffix,

    // TODO: Move these to Sitetheory since they are specific to Sitetheory
    'stratus.directives.froala': boot.bundle + 'stratus/directives/froala' + boot.suffix,
    'stratus.directives.redactor': boot.bundle + 'stratus/directives/redactor' + boot.suffix,

    /* Stratus Core Filters */
    'stratus.filters.age': boot.bundle + 'stratus/filters/age' + boot.suffix,
    'stratus.filters.gravatar': boot.bundle + 'stratus/filters/gravatar' + boot.suffix,
    'stratus.filters.map': boot.bundle + 'stratus/filters/map' + boot.suffix,
    'stratus.filters.moment': boot.bundle + 'stratus/filters/moment' + boot.suffix,
    'stratus.filters.reduce': boot.bundle + 'stratus/filters/reduce' + boot.suffix,
    'stratus.filters.truncate': boot.bundle + 'stratus/filters/truncate' + boot.suffix,

    /* Stratus Core Services */
    'stratus.services.model': boot.bundle + 'stratus/services/model' + boot.suffix,
    'stratus.services.collection': boot.bundle + 'stratus/services/collection' + boot.suffix,
    'stratus.services.registry': boot.bundle + 'stratus/services/registry' + boot.suffix,
    'stratus.services.details': boot.bundle + 'stratus/services/details' + boot.suffix,
    'stratus.services.createNewSite': boot.bundle + 'stratus/services/createNewSite' + boot.suffix,
    'stratus.services.utility': boot.bundle + 'stratus/services/utility' + boot.suffix,
    'stratus.services.media': boot.bundle + 'stratus/services/media' + boot.suffix,
    'stratus.services.iCal': boot.bundle + 'stratus/services/iCal' + boot.suffix,

    /* Stratus Core Views */
    'stratus.views.base': boot.bundle + 'stratus/legacy/views/base' + boot.suffix,

    /* Stratus Core Underscore Templates */
    /* TODO: remove these, they aren't even used anymore. Convert to components and remove. */
    'templates-base': boot.bundle + 'stratus/legacy/views/widgets/base.html',
    'templates-filter-search': boot.bundle + 'stratus/legacy/views/widgets/filter.search.html',
    'templates-filter-sort': boot.bundle + 'stratus/legacy/views/widgets/filter.sort.html',
    'templates-filter-type': boot.bundle + 'stratus/legacy/views/widgets/filter.type.html',
    'templates-pagination': boot.bundle + 'stratus/legacy/views/widgets/pagination.html',
    'templates-toggle': boot.bundle + 'stratus/legacy/views/widgets/toggle.html',
    'templates-widgets-select': boot.bundle + 'stratus/legacy/views/widgets/select.html',
    'templates-widgets-select-options': boot.bundle + 'stratus/legacy/views/widgets/select.options.html',
    'templates-widgets-selected-options': boot.bundle + 'stratus/legacy/views/widgets/selected.options.html',
    'templates-upload': boot.bundle + 'stratus/legacy/views/widgets/upload.html',

    /* Froala Libraries */
    // TODO: Move these to Sitetheory since they are specific to Sitetheory
    froala: boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/froala_editor.min',
    'froala-align': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/align.min',
    'froala-char-counter': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/char_counter.min',
    'froala-code-beautifier': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/code_beautifier.min',
    'froala-code-view': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/code_view.min',
    'froala-colors': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/colors.min',
    'froala-draggable': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/draggable.min',
    'froala-emoticons': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/emoticons.min',
    'froala-entities': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/entities.min',
    'froala-file': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/file.min',
    'froala-font-family': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/font_family.min',
    'froala-font-size': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/font_size.min',
    'froala-forms': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/forms.min',
    'froala-fullscreen': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/fullscreen.min',
    'froala-help': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/help.min',
    'froala-image': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/image.min',
    'froala-image-manager': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/image_manager.min',
    'froala-inline-style': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/inline_style.min',
    'froala-line-breaker': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/line_breaker.min',
    'froala-link': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/link.min',
    'froala-lists': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/lists.min',
    'froala-paragraph-format': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/paragraph_format.min',
    'froala-paragraph-style': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/paragraph_style.min',
    'froala-quick-insert': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/quick_insert.min',
    'froala-quote': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/quote.min',
    'froala-save': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/save.min',
    'froala-special-characters': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/special_characters.min',
    'froala-table': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/table.min',
    'froala-url': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/url.min',
    'froala-video': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/video.min',
    'froala-word-paste': boot.bundle + 'stratus/bower_components/froala-wysiwyg-editor/js/plugins/word_paste.min',
    'angular-froala': boot.bundle + 'stratus/bower_components/angular-froala/src/angular-froala',

    /* Common Libraries */
    bowser: boot.bundle + 'stratus/bower_components/bowser/src/bowser',
    chart: boot.bundle + 'stratus/bower_components/chart.js/dist/Chart',
    dropzone: boot.bundle + 'stratus/bower_components/dropzone/dist/' + boot.directory + 'dropzone-amd-module' + boot.suffix,
    fullcalendar: boot.bundle + 'stratus/bower_components/fullcalendar/dist/fullcalendar' + boot.suffix,
    ical: boot.bundle + 'stratus/bower_components/ical.js/build/ical' + boot.suffix,
    md5: boot.bundle + 'stratus/bower_components/js-md5/build/md5.min',
    masonry: boot.bundle + 'stratus/bower_components/masonry-layout/dist/masonry.pkgd' + boot.suffix,
    moment: boot.bundle + 'stratus/bower_components/moment/' + boot.directory + 'moment' + boot.suffix,
    'moment-timezone': boot.bundle + 'stratus/bower_components/moment-timezone/builds/moment-timezone-with-data' + boot.suffix,
    'moment-range': boot.bundle + 'stratus/bower_components/moment-range/dist/moment-range' + boot.suffix,
    promise: boot.bundle + 'stratus/bower_components/promise-polyfill/promise' + boot.suffix,
    swiper: boot.bundle + 'stratus/bower_components/swiper/dist/js/swiper' + boot.suffix,

    /* Interpreters */
    coffee: boot.bundle + 'stratus/bower_components/coffeescript/docs/v2/browser-compiler/coffeescript',
    less: boot.bundle + 'stratus/bower_components/less/dist/less' + boot.suffix,

    /* Angular */
    angular: boot.bundle + 'stratus/bower_components/angular/angular' + boot.suffix,
    'angular-animate': boot.bundle + 'stratus/bower_components/angular-animate/angular-animate' + boot.suffix,
    'angular-aria': boot.bundle + 'stratus/bower_components/angular-aria/angular-aria' + boot.suffix,
    'angular-material': boot.bundle + 'stratus/bower_components/angular-material/angular-material' + boot.suffix,
    'angular-messages': boot.bundle + 'stratus/bower_components/angular-messages/angular-messages' + boot.suffix,
    'angular-resource': boot.bundle + 'stratus/bower_components/angular-resource/angular-resource' + boot.suffix,
    'angular-sanitize': boot.bundle + 'stratus/bower_components/angular-sanitize/angular-sanitize' + boot.suffix,

    /* Angular Modules */
    'angular-chart': boot.bundle + 'stratus/bower_components/angular-chart.js/dist/angular-chart' + boot.suffix,
    'angular-drag-and-drop-lists': boot.bundle + 'stratus/bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists' + boot.suffix,
    'angular-icons': boot.bundle + 'stratus/bower_components/angular-material-icons/angular-material-icons' + boot.suffix,
    'angular-file-upload': boot.bundle + 'stratus/bower_components/ng-file-upload/ng-file-upload' + boot.suffix,
    'angular-paging': boot.bundle + 'stratus/bower_components/angular-paging/dist/paging' + boot.suffix,
    'angular-sortable': boot.bundle + 'stratus/bower_components/ng-sortable/angular-legacy-sortable' + boot.suffix,
    'angular-scrollSpy': boot.bundle + 'stratus/bower_components/angular-scroll-spy/angular-scroll-spy',
    'angular-ui-tree': boot.bundle + 'stratus/bower_components/angular-ui-tree/dist/angular-ui-tree' + boot.suffix,

    /* Backbone */
    underscore: boot.bundle + 'stratus/bower_components/underscore/underscore' + boot.dashSuffix,
    backbone: boot.bundle + 'stratus/legacy/external/backbone' + boot.suffix,
    'backbone.relational': boot.bundle + 'stratus/legacy/normalizers/backbone.relational.injector',
    'backbone.relational.core': boot.bundle + 'stratus/bower_components/backbone-relational/backbone-relational',

    /* jQuery */
    'jquery-sandbox': boot.bundle + 'stratus/normalizers/jquery.sandbox' + boot.suffix,
    jquery: boot.bundle + 'stratus/bower_components/jquery/dist/jquery' + boot.suffix
  }
})

// Initializer
// -----------

/* global boot, requirejs, require */

// TODO: We need to clone the boot configuration because Require.js will change
// the reference directly

// Configure Require.js
requirejs.config(boot.configuration)

// Begin Warm-Up
require(['stratus'])
