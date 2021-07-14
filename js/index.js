//indexjs

var $noteTitle = $(".note-title");

var $noteText = $(".note-textarea");

var $saveNoteBtn = $(".save-note");

var $newNoteBtn = $(".new-note");

var $noteList = $(".list-container .list-group");

// the variable "activeNote" is used to track the note 
var activeNote = {};

// get all of the note records from the database
var getNotes = function() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};


// saves notes to the database
var saveNote = function(note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};


// used to expunge notes from database (not required but bonus)
var deleteNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};


// render empty notes if activeNote doesn't exist
var renderActiveNote = function() {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
    
  } else {
    
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};


// capture data inputs to the note, record them in the corresponding fields in the db, refresh view
var handleNoteSave = function() {
  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val()
  };

  saveNote(newNote).then(function(data) {
    getAndRenderNotes();
    renderActiveNote();
  });
};


// delete the selected note, but stop propogation to keep listener from acting on click
var handleNoteDelete = function(event) {
  event.stopPropagation();

  
  var note = $(this)
    .parent(".list-group-item")
    .data();

  
  if (activeNote.id === note.id) {
    activeNote = {};
  }

  
  deleteNote(note.id).then(function() {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// enables user to enter a new note
var handleNewNoteView = function() {
  activeNote = {};
  renderActiveNote();
};

// selects and displays the activenote
var handleNoteView = function() {
  activeNote = $(this).data();
  renderActiveNote();
};



// hides save button/function if fields are empty, if they do contain content, however, display the save button/enable save functionality
var handleRenderSaveBtn = function() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};


// displays the list of notes by their titles 
var renderNoteList = function(notes) {
  $noteList.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};


var getAndRenderNotes = function() {
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);

$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);


getAndRenderNotes();
