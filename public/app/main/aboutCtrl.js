/* global angular moment */
(function() {
  'use strict';

  angular.module('app').controller('aboutCtrl', AboutCtrl);

  function AboutCtrl() {
    this.versions = [{
      id: "Pre_0_8",
      name: "Pre-Release 0.8",
      releaseDate:moment("2014/12/31", "YYYY/MM/DD"),
      description: "General polish release: roles, colors, drag-n-drop, bug fixes",
      features: [
        "Added drag-n-drop and resizing support to calendar events",
        "Added color coding to the users",
        "Added color coding to events"
      ],
      bugFixes: [
        "Disabled editing of other user's events (UI, backend never allowed it)",
        "Removed FullCalendar injected fields from events (they are not needed by this appplication)",
        "Removed hashed password and salt from identity information"
      ]
    }, {
      id: "Pre_0_7_5",
      name: "Pre-Release 0.7.5",
      releaseDate: moment("2014/12/20", "YYYY/MM/DD"),
      description: "This version added nothing. Everything is under the hood clean-up",
      features: [
        "Cleaned up the grunt tasks",
        "Cleaned up the code",
        "Can now develop from Cloud 9"
      ]
    }, {
      id: "Pre_0_7",
      name: "Pre-Release 0.7",
      releaseDate: moment("2014/11/22", "YYYY/MM/DD"),
      description: "This version added configurability to what is displayed in the calendar and involves a lot of under the hood changes.",
      features: [
        "Configure which items are displayed on the calendar (configuration not saved at this time)",
        "Allow removal of events",
        "Validate the data when entering an event",
        "Switched the library used for most UI widgets to AngularStrap"
      ]
    }, {
      id: "Pre_0_6",
      name: "Pre-Release 0.6",
      releaseDate: moment("2014/08/31", "YYYY/MM/DD"),
      description: "This version adds the calendar and improves general interaction and editing.",
      features: [
        "Editor Coding Improvements",
        "Calendar of Events"
      ],
      bugFixes: [
        "No longer displaying stale changes in master data when editing is cancelled",
        "Allow entry of initial password when creation new users"
      ]
    }, {
      id: "Pre_0_5",
      name: "Pre-Release 0.5",
      releaseDate: moment("2014/06/14", "YYYY/MM/DD"),
      description: "This is the first version to include any type of meaningful user interaction.  " +
        "This version also includes the start of some styling.",
      features: [
        "Styling",
        "Default admin user",
        "User creation",
        "My Profile",
        "This About page"
      ]
    }];

    this.currentVersion = this.versions[0].name;
  }
}());