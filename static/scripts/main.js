(function($) {
    console.log("Testing");

    blueColor = 'hsl(206, 16%, 73%)';
    redColor = 'hsl(0, 16%, 73%)';

    function Board(x, y) {
        this.location = [x, y];
        this.rows = [];
        for (var i=0; i<3; i++) {
            row = [];
            this.rows.push(row);
            for (var j=0; j<3; j++) {
                row.push(' ');
            }
        }
        this.isFull = function() {

        }
    }

    function Game() {
        this.turn = 'X';
        this.lastMove;

        this.rows = [];
        for (var i=0; i<3; i++) {
            row = [];
            for (var j=0; j<3; j++) {
                row.push(new Board(i, j));
            }
            this.rows.push(row);
        }

        this.move = function(board, space) {
            var board = this.getBoard(board[0], board[1]);
            board.rows[space[0]][space[1]] = this.turn;
            this.lastMove = {
                rowBoard: board[0],
                colBoard: board[1],
                rowSpace: space[0],
                colSpace: space[1]
            }
            this.changeTurns();
        }

        this.getBoard = function(row, col) {
            console.log(this.rows);
            return this.rows[row][col];
        }

        this.allBoards = function() {
        }

        this.availableBoards = function() {
            var boards = []

            if (this.lastMove == undefined) {
                return this.allBoards();
            }

            // If not first move
            var location = [this.lastMove['rowSpace'], self.lastMove['colSpace']];
            var directedBoard = this.getBoard(location[0], location[1]);
            if (!directedBoard.is_full()) {
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
    matchWidth();


    $('.space-content').click(function(e) {
        if ($(this).parent().hasClass('filled')) {
            return;
        }
        boardPos = [
            $(this).closest('.board-row').attr('num'),
            $(this).closest('.board').attr('num'),
        ];
        spacePos = [
            $(this).closest('.space-row').attr('num'),
            $(this).closest('.space').attr('num'),
        ];

        var code, color;
        var prevTurn = game.turn;
        if (game.turn == 'X') {
            code = 'E5CD';
            color = redColor;
        } else if (game.turn == 'O') {
            code = 'E836';
            color = blueColor;
        }
        self = this;
        $(this).parent().removeClass('empty').addClass('filled');
        setTimeout(function() {
            $(self).html('<i class="material-icons ' + prevTurn + '">&#x' + code + ';</i>');
            var size = $(self).find('i').css('font-size');
            $(self).find('i').css('font-size', '12px').animate({'font-size': size}, 190);
        }, 170);
        game.move(boardPos, spacePos);

        // Ripple Effect
        var parent, ink, d, x, y;
        parent = $(this).parent();
        //create .ink element if it doesn't exist
        if(parent.find(".ink").length == 0)
        parent.prepend("<span class='ink'></span>");

        ink = parent.find(".ink");
        ink.css('background', color);
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
        setTimeout(function() {
            parent.css('background', ink.css('background'));
        }, 280);
    });



})(jQuery);
