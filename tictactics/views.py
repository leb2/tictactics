from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from tictactics.models import *
import json
import uuid

def home(request):
    game_id = str(uuid.uuid4())[:5]

    game = Game(game_id=game_id.lower())
    game.save()
    request.session['game_id'] = 'X';

    return render(request, 'index.html', {'game_id': game_id, 'player_turn': request.session.get(game_id), 'show_menu': True})

def move(request, game_id):
    location = json.loads(request.GET.get('location'))
    game = Game.objects.get(game_id=game_id.lower())
    game_obj = game.decode_state()
    game_obj.move(int(location[0]), int(location[1]), int(location[2]), int(location[3]))
    game.save_state(game_obj)
    game.save()
    return HttpResponse(game.state)

def game(request, game_id):

    # Make sure the user isn't X and just refreshed the page
    if not 'turn' in request.session:
        request.session['game_id'] = 'O'

    game = Game.objects.get(game_id=game_id.lower())
    state = game.state
    last_move = game.last_move
    current_turn = game.turn
    return render(request, 'index.html', {
        'show_menu': False,
        'game_id': game_id,
        'state': state,
        'last_move': last_move,
        'current_turn': current_turn,
        'player_turn':  request.session.get(game_id),
    })

def game_info(request, game_id):
    game = Game.objects.get(game_id=game_id.lower())
    state = game.state
    last_move = game.last_move
    current_turn = game.turn
    data = {
        'state': state,
        'last_move': last_move,
        'current_turn': current_turn,
    }
    return HttpResponse(json.dumps(data), content_type='application/json')
