'use strict';

(function($) {

    var passPlay = false;

    function Board(x, y) {
        this.location = [x, y];
        this.rows = [];
        this.solvedBy;
        for (var i=0; i<3; i++) {
            var row = [];
            this.rows.push(row);
            for (var j=0; j<3; j++) {
                row.push(' ');
            }
        }

        this.move = function(row, col, player) {
            this.rows[row][col] = player;
            if (this.solvedBy === undefined && this.isSolved(player)) {
                this.solvedBy = player;
            }
        }


        this.isSolved = function(player) {

            // Test horizontals
            for (var i=0; i<3; i++) {
                if (this.rows[i][0] == player &&
                    this.rows[i][1] == player &&
                    this.rows[i][2] == player) {
                    return true;
                }
                if (this.rows[0][i] == player &&
                    this.rows[1][i] == player &&
                    this.rows[2][i] == player) {

                    return true;
                }
            }

            // Test Diagonals
            if (this.rows[1][1] == player) {
                return (
                    (this.rows[0][0] == player && this.rows[2][2] == player) ||
                    (this.rows[0][2] == player && this.rows[2][0] == player)
                );
            }
        }

        this.pieceCount = function() {
            var count = 0
            for (var i=0; i<this.rows.length; i++) {
                for (var j=0; j<this.rows[i].length; j++) {
                    if (this.rows[i][j] != ' ') {
                        count++;
                    }
                }
            }
            return count
        }

        this.isFull = function() {
            return this.pieceCount() == 9;
        }
    }

    function Game() {
        this.turn = 'X';
        this.lastMove;
        this.solvedBy;

        this.rows = [];
        for (var i=0; i<3; i++) {
            var row = [];
            for (var j=0; j<3; j++) {
                row.push(new Board(i, j));
            }
            this.rows.push(row);
        }

        this.updateIsSolvedBy = function() {
            console.log(this.solvedBy);
            if (this.solvedBy === undefined) {
                if (this.isSolved('X')) {
                    this.solvedBy = 'X';
                } else if (this.isSolved('O')) {
                    this.solvedBy = 'O';
                }
            }
        }

        this.isSolved = function(player) {
            // Test horizontals
            for (var i=0; i<3; i++) {
                if (this.rows[i][0].solvedBy == player &&
                    this.rows[i][1].solvedBy == player &&
                    this.rows[i][2].solvedBy == player) {
                    return true;
                }
                if (this.rows[0][i].solvedBy == player &&
                    this.rows[1][i].solvedBy == player &&
                    this.rows[2][i].solvedBy == player) {

                    return true;
                }
            }

            // Test Diagonals
            if (this.rows[1][1] == player) {
                return (
                    (this.rows[0][0].solvedBy == player &&
                    this.rows[2][2].solvedBy == player) ||
                    (this.rows[0][2].solvedBy == player &&
                    this.rows[2][0].solvedBy == player)
                );
            }
        }

        this.move = function(board, space) {
            var board = this.getBoard(board[0], board[1]);
            board.move(space[0], space[1], this.turn);
            this.lastMove = {
                rowBoard: board[0],
                colBoard: board[1],
                rowSpace: space[0],
                colSpace: space[1]
            }
            if (this.isSolved(this.turn)) {
                this.solvedBy = this.turn;
            }
            this.changeTurns();
        }

        this.getBoard = function(row, col) {
            return this.rows[row][col];
        }

        this.allBoards = function() {
            var boards = [];
            for (var i=0; i<3; i++) {
                for (var j=0; j<3; j++) {
                    boards.push(this.getBoard(i, j));
                }
            }
            return boards;
        }

        this.availableBoards = function() {
            var boards = []

            if (this.lastMove == undefined) {
                return this.allBoards();
            }

            // If not first move
            var location = [this.lastMove.rowSpace, this.lastMove.colSpace];
            var directedBoard = this.getBoard(location[0], location[1]);
            if (!directedBoard.isFull()) {
                return [directedBoard]
            } else {
                return this.allBoards()
            }
        }

        this.changeTurns = function() {
            if (this.turn == 'O') {
                this.turn = 'X';
            } else {
                this.turn = 'O';
            }
        }
    }

    var game = new Game();

    // Set width
    function matchWidth() {
        var width = $('.board').width();
        $('.board').css({'height': width + 'px'});
    }
    //TODO: On window resize
    matchWidth();

    function getBoardElement(row, col) {
        return $('.board-row[num="' + row + '"]')
                .find('.board[num="' + col +  '"]');
    }

    function showAvailableMoves() {
        $('.board').removeClass('movable');
        if ($('.player-turn').text() == game.turn || passPlay) {
            var availableBoards = game.availableBoards();
            for (var i=0; i<availableBoards.length; i++) {
                var location = availableBoards[i].location;
                getBoardElement(location[0], location[1]).addClass('movable');
            }
        }
    }
    function showSolvedStates() {
        $('.board').removeClass('solved');
        var allBoards = game.allBoards();
        for (var i=0; i<allBoards.length; i++) {
            var board = allBoards[i];
            if (board.solvedBy !== undefined) {
                var loc = board.location;
                getBoardElement(loc[0], loc[1]).addClass('solved').addClass(board.solvedBy);
            }
        }
    }

    function iconCode(turn) {
        var code;
        if (turn == 'X') {
            code = 'E5CD';
        } else if (turn == 'O') {
            code = 'E836';
        }
        return '<i class="material-icons ' + turn + '">&#x' + code + ';</i>'
    }


    function updateBoard(state, turn, lastMove, initializeGame) {
        var index = 0;
        game.turn = turn;
        game.lastMove = lastMove;
        game.updateIsSolvedBy();

        // Populates the html board with values
        // if initializeGame is true, populates the game object with board objects
        $('.board-row').each(function() {
            var row = $(this).attr('num');
            $(this).children('.board').each(function() {
                var col = $(this).attr('num');
                var board = game.getBoard(row, col);

                $(this).children('.space-row').each(function() {
                    var spaceRow = $(this).attr('num');
                    $(this).children('.space').each(function() {
                        var spaceCol = $(this).attr('num');

                        if (state[index] == 'X' || state[index] == 'O') {
                            // Have to populate game's boards
                            if (initializeGame) {
                                board.rows[spaceRow][spaceCol] = state[index];
                            }
                            $(this).addClass(state[index]);
                            $(this).addClass('filled').removeClass('empty');
                            $(this).find('.space-content').html(iconCode(state[index]));
                        }
                        index += 1;
                    });
                });
            });
        });
        showAvailableMoves()
    }

    function lastMoveFromStr(lm) {
        return {
            rowBoard: lm[0],
            colBoard: lm[1],
            rowSpace: lm[2],
            colSpace: lm[3]
        };
    }

    function initializeBoard() {
        var lm = $('.last-move').text();
        updateBoard($('.state').text(), $('.current-turn').text(), lastMoveFromStr(lm), true);
    }
    function checkWins() {
        if (game.solvedBy) {
            $('.game-over').addClass('visible');
            var text;

            if (passPlay) {
                text = game.solvedBy + " wins";
            } else {
                if ($('.player-turn').text() == game.solvedBy) {
                    text = "Victory!";
                } else {
                    text = "Defeat.";
                }
            }
            $('.message').text(text);
        }
    }
    function pollMoves() {
        $.get('/game_info/' + $('.game-id').text(), {}, function(data) {
            var state = data.state;
            var lastMove = lastMoveFromStr(data.last_move);
            var turn = data.current_turn;
            updateBoard(state, turn, lastMove, false); // Should this be true?
            $('.turn-indicator').removeClass('X').removeClass('O');
            $('.turn-indicator').addClass(game.turn);
            checkWins();
        });
    }



    $('.space-content').click(function(e) {
        if ($(this).parent().hasClass('filled') ||
            !$(this).closest('.board').hasClass('movable')) {
            return;
        }

        var boardPos = [
            $(this).closest('.board-row').attr('num'),
            $(this).closest('.board').attr('num'),
        ];
        var spacePos = [
            $(this).closest('.space-row').attr('num'),
            $(this).closest('.space').attr('num'),
        ];

        var prevTurn = game.turn;
        self = this;
        $(this).parent().removeClass('empty').addClass('filled');
        setTimeout(function() {
            $(self).html(iconCode(prevTurn));
            // $(self).html('<i class="material-icons ' + prevTurn + '">&#x' + code + ';</i>');
            var size = $(self).find('i').css('font-size');
            $(self).find('i').css('font-size', '12px').animate({'font-size': size}, 190);
        }, 170);

        // Save move to server
        if (!passPlay) {
            var gameId = $('.game-id').text();
            $.get('/move/' + gameId, {location: JSON.stringify([boardPos[0], boardPos[1], spacePos[0], spacePos[1]])}, function(response) {});
        }

        game.move(boardPos, spacePos);
        $('.turn-indicator').removeClass('X').removeClass('O');
        $('.turn-indicator').addClass(game.turn);

        showAvailableMoves();
        showSolvedStates();

        checkWins();

        // ---- RIPPLE EFFECT --- //
        var parent, ink, d, x, y;
        parent = $(this).parent();
        //create .ink element if it doesn't exist
        if(parent.find(".ink").length == 0)
        parent.prepend("<span class='ink " + prevTurn + "'></span>");

        ink = parent.find(".ink");

        //incase of quick double clicks stop the previous animation
        ink.removeClass("animate");

        //set size of .ink
        if(!ink.height() && !ink.width())
        {
            //use parent's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
            d = Math.max(parent.outerWidth(), parent.outerHeight());
            ink.css({height: d, width: d});
        }
        //get click coordinates
        //logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
        x = e.pageX - parent.offset().left - ink.width()/2;
        y = e.pageY - parent.offset().top - ink.height()/2;

        //set the position and add class .animate
        ink.css({top: y+'px', left: x+'px'}).addClass("animate");
        // ---- END RIPPLE EFFECT -- //


        // Change the background to match ownership of tile
        setTimeout(function() {
            // Temporarily remove transition
            var originalTransition = parent.css('transition');
            parent.addClass(prevTurn)
            parent.css('transition', 'none');
            setTimeout(function() {
                parent.css('transition', originalTransition);
            }, 200);
        }, 270);
    });


    // Menu Stuff
    $('.share-url').click(function() {
        $('.first-button').animate({'opacity': '0', 'height': '0', 'padding-top': '0', 'padding-bottom': '0'}, 200, function() {
            setTimeout(function() {
                $('.url-info').show();
                $('.start-game').show();
            }, 200);
        });
    });

    // If loading saved game
    if ($('.state').text().length) {
        initializeBoard();
        setInterval(pollMoves, 1000);
    }
    // If starting new multi browser game
    $('.start-game').click(function() {
        $('.menu').fadeOut(400);
        setInterval(pollMoves, 1000);
    });
    // If starting new single browser game
    $('.pass-play').click(function() {
        $('.menu').fadeOut(400);
        passPlay = true;
    })


})(jQuery);
