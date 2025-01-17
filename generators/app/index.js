'use strict';
let generator = require('yeoman-generator');
let utils = require('../../utils/all');
let prompts = require('./prompts');
let path = require('path');
let fs = require('fs');

// Set the base root directory for our files
let baseRootPath = path.dirname(require.resolve('react-webpack-template'));

module.exports = generator.Base.extend({

  constructor: function() {
    generator.Base.apply(this, arguments);

    // Make options available
    this.option('skip-welcome-message', {
      desc: 'Skip the welcome message',
      type: Boolean,
      defaults: false
    });
    this.option('skip-install');

    // Use our plain template as source
    this.sourceRoot(baseRootPath);

    this.config.save();
  },

  initializing: function() {
    if(!this.options['skip-welcome-message']) {
      this.log(require('yeoman-welcome'));
      this.log('Out of the box I include Webpack and some default React components.\n');
    }
  },

  prompting: function() {
    let done = this.async();
    this.prompt(prompts, function(props) {

      // Make sure to get the correct app name if it is not the default
      if(props.appName !== utils.yeoman.getAppName()) {
        props.appName = utils.yeoman.getAppName(props.appName);
      }

      // Set needed global vars for yo
      this.appName = props.appName;
      this.style = props.style;

      // Set needed keys into config
      this.config.set('appName', this.appName);
      this.config.set('appPath', this.appPath);
      this.config.set('style', this.style);

      done();
    }.bind(this));
  },

  configuring: function() {

    // Generate our package.json. Make sure to also include the required dependencies for styles
    let defaultSettings = this.fs.readJSON(path.join(baseRootPath, 'package.json'));
    let packageSettings = {
      name: this.appName,
      private: true,
      version: '0.0.1',
      description: 'YOUR DESCRIPTION - Generated by generator-react-webpack',
      main: '',
      scripts: defaultSettings.scripts,
      repository: '',
      keywords: [],
      author: 'Your name here',
      devDependencies: defaultSettings.devDependencies,
      dependencies: defaultSettings.dependencies
    };

    // Add needed loaders if we have special styles
    let styleConfig = utils.config.getChoiceByKey('style', this.style);
    if(styleConfig && styleConfig.packages) {

      for(let dependency of styleConfig.packages) {
        packageSettings.dependencies[dependency.name] = dependency.version;
      }
    }

    this.fs.writeJSON(this.destinationPath('package.json'), packageSettings);
  },

  writing: function() {

    let excludeList = [
      'LICENCE',
      'README.md',
      'node_modules',
      'package.json'
    ];

    // Get all files in our repo and copy the ones we should
    fs.readdir(this.sourceRoot(), (err, items) => {

      for(let item of items) {

        // Skip the item if it is in our exclude list
        if(excludeList.indexOf(item) !== -1) {
          continue;
        }

        // Copy all items to our root
        let fullPath = path.join(baseRootPath, item);
        if(fs.lstatSync(fullPath).isDirectory()) {
          this.bulkDirectory(item, item);
        } else {
          this.copy(item, item);
        }
      }
    });
  },

  install: function() {
    if(!this.options['skip-install']) {
      this.installDependencies({ bower: false });
    }
  }
});
