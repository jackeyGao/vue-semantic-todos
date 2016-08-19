// File Name: static/app.js
// Author: JackeyGao
// mail: gaojunqi@outlook.com
// Created Time: 五  8/19 22:59:57 2016


var STORAGE_KEY = 'tasks';
 
todoStorage = {
  fetch: function () {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },
  save: function (tasks) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
};

var filters = {
      all: function (tasks) {
          return tasks;
      },
      active: function (tasks) {
          return tasks.filter(function (task) {
              return !task.completed;
          });
      },
      completed: function (tasks) {
          return tasks.filter(function (task) {
              return task.completed;
          });
      }
  };

var vm = new Vue({
  el: "#todos",
  data: {
      newTitle: "",
      tasks: todoStorage.fetch(),
      editedTask: null,
      visibility: 'all'
  },
  watch: {
      tasks: {
          handler: function(tasks) {
              todoStorage.save(tasks);
          },
          deep: true
      }
  },
  computed: {
      filterTasks: function() {
          return filters[this.visibility](this.tasks);
      },
      remaining: function () {
          return filters.active(this.tasks).length;
      },

  },
  methods: {
      removeTask: function(task) {
          this.tasks.$remove(task);
      },
      addTask: function() {
          var value = this.newTitle && this.newTitle.trim();

          if (!value) {
              return;
          }
          this.tasks.push({ completed: false, title: value});
          this.newTitle = "";
      },
      editTask: function(task) {
          this.beforeEditCache = task.title;
          this.editedTask = task;
      },
      saveEdit: function(task) {
          if (!this.editedTask) {
              return;
          }
          this.editedTask = null;
          task.title = task.title.trim();
          if (!task.title) {
              this.removeTask(task);
          }
      },
      cancelEdit: function(task) {
          this.editedTask = null;
          task.title = this.beforeEditCache;
      },
      filterTask: function(visibility) {
          this.visibility = visibility;
      },
      removeCompleted: function(event) {
          this.tasks = filters.active(this.tasks);
          event.preventDefault()
      }
  },
  directives: {
      'task-focus': function (value) {
          if (!value) {
              return;
          }
          var el = this.el;
          Vue.nextTick(function () {
              el.focus();
          });
      }
  }
})
