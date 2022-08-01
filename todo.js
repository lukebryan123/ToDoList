(function todo_global() {

  /**
   * A blank task which can be cloned to create new tasks.
   * @type {HTMLElement}
   */
  var task_template = document.querySelector('.task').cloneNode(true);

  /**
   * Finds the nearest element in the document whose subtree represents a task
   * and that encloses a given HTML element.  When called on an element
   * representing subtask, finds the task that it's an immediate subtask of.
   * @param {HTMLElement} element - The element whose corresponding task is
   *   sought.
   * @returns {?HTMLElement} The element whose subtree represents the enclosing
   *   task, or null if the given element is not part of a task subtree.
   */
  var enclosing_task = function enclosing_task(element) {
    for (var enclosing = element.parentNode; enclosing !== document;
      enclosing = enclosing.parentNode) {
        if (enclosing.classList.contains('task')) {
          return enclosing;
        }
      }
    return null;
  };

  /**
   * Finds the first element in the document with a given class that's included
   * in the subtree that represents a given task.  The returned element must
   * correspond directly to that task and not to a subtask.
   * @param {HTMLElement} task - The task element to search within.
   * @param {string} class_name - The class that the sought element must have.
   * @returns {?HTMLElement} The first element with the given class enclosed by
   *   the given task (but not a subtask), or null if there is no such element.
   */
  var enclosed_by_class = function enclosed_by_class(task, class_name) {
    var elements_with_class = task.querySelectorAll('.' + class_name);
    for (var i = 0; i < elements_with_class.length; i++) {
      var element = elements_with_class[i];
      if (enclosing_task(element) === task) {
        return element;
      }
    }
    return null;
  };

  /**
   * Unchecks the boxes for all of this task's direct ancestors.
   * @param {HTMLElement} task - The task whose ancestors are to be unchecked.
   */
  var uncheck_enclosing_tasks = function uncheck_enclosing_tasks(task) {
    for (var enclosing = enclosing_task(task); enclosing !== null;
      enclosing = enclosing_task(enclosing)) {
        enclosed_by_class(enclosing, 'task-done').checked = false;
      }
  };

  // Handle the top-level add button, which creates a new task.
  document.getElementById('add-toplevel-task').addEventListener('click',
    function add_toplevel_task() {
      document.getElementById('toplevel-tasks').
        appendChild(task_template.cloneNode(true));
    });

  // Handle non-top-level add and delete buttons.
  document.addEventListener('click', function click_handler(event) {
    var target = event.target;
    if (target.classList.contains('add-subtask')) {
      // A non-top-level add button creates a new task and append it to the
      // subtasks list of the task that encloses it.  Since the new task will
      // initially be unchecked, the enclosing task and all its ancestors will
      // have to be unchecked too.
      var parent_task = enclosing_task(target);
      var subtask = task_template.cloneNode(true);
      enclosed_by_class(parent_task, 'subtasks').appendChild(subtask);
      uncheck_enclosing_tasks(subtask);
    } else if (target.classList.contains('delete-task')) {
      // A delete button deletes the task that encloses it.
      var task_to_remove = enclosing_task(target);
      task_to_remove.parentElement.removeChild(task_to_remove);
    }
  });

  // Handle checking and unchecking of tasks.
  document.addEventListener('change', function change_handler(event) {
    var target = event.target;
    if (target.classList.contains('task-done')) {
      var task = enclosing_task(target);
      if (target.checked) {
        // When a task is checked, all its descendants must be checked.
        var checkboxes = task.querySelectorAll('.task-done');
        for (var i = 0; i < checkboxes.length; i++) {
          checkboxes[i].checked = true;
        }
      } else {
        // When a task is unchecked, all its ancestors must be unchecked.
        uncheck_enclosing_tasks(task);
      }
    }
  });

  // Assigning Green Background to Completed Tasks
  document.addEventListener('change', function make_green(event){
    var target = event.target;    
    // if a box is checked/completed
    if (target.checked){
      // // Make sure there is text and
      // if (target.nextElementSibling.value.length===0){
      //   alert("Please list your task before checking it off.")
      // } else {
        // The LI and all child LI will turn green.
        target.parentElement.style.backgroundColor = "#05ae5f"
        var nodes = target.parentElement.getElementsByTagName('li');
        for(var i=0; i<nodes.length; i++) {
          nodes[i].style.background = "#05ae5f";
        // }
      }
      
    } else { 
      // If a box is unchecked, the color for the LI and all parent LI returns to grey 
      target.parentElement.style.backgroundColor = "#C1CAD6";
      var a = event.target;
      var parents = [];
      while (a) {
          parents.unshift(a);
          a = a.parentNode;
      }
      for (var parental of parents){
        if (parental.tagName==="LI"){
          parental.style.backgroundColor = "#C1CAD6";
        }
      }

    }
  });

})();
