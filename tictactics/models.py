from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
import textwrap


class Game(models.Model):
    game_id = models.CharField(max_length=5)
    state = models.CharField(max_length=91, default=(' '*81))
    last_move = models.CharField(max_length=4, default='0000')
    turn = models.CharField(max_length=1, default='X')

    def save_state(self, game):
        encoded_state = ""
        for row in game.rows:
            for board in row:
                for board_row in board.rows:
                    for value in board_row:
                        encoded_state += value

        self.last_move = str(game.last_move['row_mega']) + str(game.last_move['column_mega']) + str(game.last_move['row']) + str(game.last_move['column'])
        self.turn = game.turn
        self.state = encoded_state

    def decode_state(self):
        decoded = []
        state = self.state
        # rows = textwrap.wrap(self.state, 27, drop_whitespace=False)
        rows = list(map(''.join, zip(*[iter(self.state)]*27)))
        for row in rows:
            decoded_row = []
            decoded.append(decoded_row)
            # boards = textwrap.wrap(row, 9, drop_whitespace=False)
            boards = list(map(''.join, zip(*[iter(row)]*9)))
            for board in boards:
                decoded_board = Board()
                decoded_row.append(decoded_board)
                # board_rows = textwrap.wrap(board, 3, drop_whitespace=False)
                board_rows = list(map(''.join, zip(*[iter(board)]*3)))
                for i in range(3):
                    board_row = board_rows[i]
                    for j in range(3):
                        value = board_row[j]
                        decoded_board.rows[i][j] = value
        game = MegaBoard()
        game.rows = decoded
        game.last_move = {
            'row_mega': str(self.last_move[0]),
            'column_mega': str(self.last_move[1]),
            'row': str(self.last_move[2]),
            'column': str(self.last_move[3]),
        }
        game.turn = self.turn
        return game


class MegaBoard():
    def __init__(self):
        self.rows = []
        for i in range(3):
            row = []
            self.rows.append(row)
            for j in range(3):
                row.append(Board(location=(i, j)))
        self.last_move = None
        self.turn = 'X'

    def move(self, row_mega, column_mega, row, column):
        board = self.rows[int(row_mega)][int(column_mega)]
        board.move(int(row), int(column), self.turn)
        self.last_move = {
            'row_mega': row_mega,
            'column_mega': column_mega,
            'row': row,
            'column': column,
        }
        if self.turn == 'X':
            self.turn = 'O'
        else:
            self.turn = 'X'

class Board():
    def __init__(self, location=(0, 0)):
        self.rows = []
        self.location = location
        self.solved_by = None
        for i in range(3):
            row = []
            self.rows.append(row)
            for j in range(3):
                row.append(' ')

    def is_solved(self, player):
        for i in range(3):
            # Test horizontals
            if (self.rows[i] == [player] * 3 or
                # Test verticals
                (self.rows[0][i] == player and
                self.rows[1][i] == player and
                self.rows[2][i] == player)):
                return True

        # Test Diagonals
        if self.rows[1][1] == player:
            return (self.rows[0][0] == self.rows[2][2] == player or
                self.rows[0][2] == self.rows[2][0] == player)

    def move(self, row, column, piece):
        self.rows[row][column] = piece
        if self.solved_by == None:
            if self.is_solved(piece):
                self.solved_by = piece

    def is_full(self):
        return self.piece_count() == 9

    def piece_count(self):
        count = 0
        for row in self.rows:
            for val in row:
                if val != ' ':
                    count += 1
        return count

    def available_moves(self, last_move):
        moves = []
        for row in range(len(self.rows)):
            for column in range(len(self.rows)):
                if (self.rows[row][column] == ' ' and
                    (last_move == None or
                    self.piece_count() == 8 or # If only choice, always available

                    # Prevent going back to previous
                    row != last_move['row_mega'] or
                    column != last_move['column_mega'])):
                    moves.append((row, column))
        return moves
