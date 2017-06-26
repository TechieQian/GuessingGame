function generateWinningNumber() {
    return Math.floor(Math.random()*100) + 1
}

function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function Game() {
  this.playersGuess = null
  this.pastGuesses = []
  this.winningNumber = generateWinningNumber()
}

Game.prototype.difference = function() {
  return Math.abs(this.winningNumber - this.playersGuess)
}

Game.prototype.isLower = function () {
  return this.playersGuess < this.winningNumber ? true : false
}

Game.prototype.playersGuessSubmission  = function(n) {

  this.playersGuess = n

  if (typeof n != "number" || n < 1 || n > 100) {
    throw "That is an invalid guess."
  }
  else {
    return this.checkGuess()
  }
}

Game.prototype.checkGuess = function() {
  if (this.difference() == 0) {
    toggleBtnState()
    return "You Win!"
  }
  else {
    if ( this.pastGuesses.indexOf(this.playersGuess) > -1) {
      return "You have already guessed that number."
    }
    else {
      this.pastGuesses.push(this.playersGuess)
      var ele = $(".guess").first()
      while(ele.text() != "-" && ele.next()) {
        console.log("executing ")
        ele = ele.next()
      }
      if (ele) {
        if ( this.playersGuess > 9) {
          ele.toggleClass("pastdbl")
        }
        else {
          console.log(typeof this.playerGuess)
          ele.toggleClass("pastsingle")
        }
        ele.text(this.playersGuess)
      }
      if ( this.pastGuesses.length >= 5) {
        toggleBtnState()
        $("#players-input").attr("maxlength",'0')
        return 'You Lose.'
      }
      if (this.difference() < 10) {
        return 'You\'re burning up!'
      }
      else if (this.difference() < 25 ) {
        return 'You\'re lukewarm.'
      }
      else if (this.difference() < 50) {
        return 'You\'re a bit chilly.'
      }
      else if (this.difference() < 100) {
        return 'You\'re ice cold!'
      }
    }
  }
}

Game.prototype.provideHint = function() {
  var limit = 3
  var self = this
  return function () {
    if ( limit > 0 ) {
      limit --
      return shuffle([self.winningNumber, generateWinningNumber(), generateWinningNumber()] + " Hints left: " + limit)
    }
    else {
      return "You can't use hints that many times son."
    }
  }
}

function toggleBtnState() {
  console.log("toggling state")
  $("#go-btn").toggleClass("btn-warning")
  $("#go-btn").toggleClass("btn-primary")
  if ($("#go-btn").text() == "Go!") {
    $("#go-btn").text("Reset")
  }
  else {
    $("#go-btn").text("Go!")
  }
}

function newGame() {
  $("#players-input").attr("maxlength",'3')
  $(".guess").text("-")
  $("li").removeClass("pastdbl")
  $("li").removeClass("pastsingle")
  $("h2").text("Uh, Guess a number")
  $("#go-btn").prop("disabled", true)
  var game = new Game()
  game.hinter = game.provideHint()
  return game
}

$(document).ready(function() {

  var game = newGame()

  $("#players-input").keyup(function() {
    if (+$(this).val() <= 100 && +$(this).val() > 0) {
      $("#go-btn").prop("disabled", false)
    }
    else {
      if ( $(this).val() != '') {
        $("h2").text("Invalid input dude. Between 1-100.")
        $(this).val('')
      }
      if ($("#go-btn").text() == "Go!") {
        $("#go-btn").prop("disabled", true)
      }
    }
  })

  var submit = function() {
    if ($("#go-btn").text() == "Go!") {
      var input = parseInt($('#players-input').val(),10)
      $('#players-input').val('')
      $("h2").text(game.playersGuessSubmission(input))
      console.log(game.winningNumber)
    }
    else {
      game = newGame()
      toggleBtnState()
    }
  }

  $('#go-btn').click( function (e) {
    submit()
  });

  $('#players-input').keypress(function(e) {
    if (e.which == 13 && !$("#go-btn").is(":disabled")) {
      submit()
    }
  });

  $('#reset-btn').click( function() {
    if ($("#go-btn").text() == "Reset") {
      toggleBtnState()
    }
    game = newGame()
  })

  $('#hint-btn').click(function() {
    var hinter = game.provideHint()
    $("h2").text(game.hinter())
  })

});
