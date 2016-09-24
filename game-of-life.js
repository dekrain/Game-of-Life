var nsp;
if (typeof window !== 'undefined') nsp = window.game = {};
else nsp = module.exports.game = {};

nsp.Game = function Game(canvas) {
  var o = { // A Game object
  	board: [],
    update: [],
  	width: 0,
  	height: 0,
  	logic: {
  		neighbors_for: function(x, y) {
  			var repl = [], g = safe.get;

  			repl.push(g(x-1,y-1));
  			repl.push(g(x,y-1));
  			repl.push(g(x+1,y-1));

  			repl.push(g(x-1,y));
  			//repl.push(g(x,y)); Don't include myself E:
  			repl.push(g(x+1,y));

  			repl.push(g(x-1,y+1));
  			repl.push(g(x,y+1));
  			repl.push(g(x+1,y+1));

  			return repl;
  		},
  		num_of__in: function(array, thing) {
  			var num = 0;
  			array.forEach(function(item){
  				num += (item === thing);
  			});
  			return num;
  		},
  		active_neighbors_num: function(x, y) {
  			return this.num_of__in( this.neighbors_for(x, y), true );
  		}
  	},
  	gfx: {
  		glow: 'rgb(0,255,0)',
  		unglow: 'rgb(255,0,0)',
      changed: function(x, y, w, h) {
        if (w === 0 || h === 0) return; // Nothing to refresh
        if (w < 0) { x -= w; w *= -1; }
        if (h < 0) { y -= h; h *= -1; }
        for (var i = 0; i < w; i++) {
          for (var j = 0; j < h; j++) {
            o.update.push(`${x + i} ${y + j}`);
          }
        }
      }
  	}
  };

  var safe = { // Safe Access
  	init: function(w, h) {
  	  if (!w) w = 500;
  	  if (!h) h = 250;
  	  o.width = Math.floor(w);
  	  o.height = Math.floor(h);
  	  o.board = new Array(o.height);
  	  for (var i = 0; i < h; i++) {
  	  	o.board[i] = new Array(o.width);
  	  	for (var j = 0; j < w; j++) {
  	  	  o.board[i][j] = false;
  	  	}
  	  };
      safe.draw(true);
  	},
  	glow: function(x, y, g) {
  		if ( (x > o.width-1 || x < 0) || (y > o.height-1 || y < 0) ) return;
  		o.board[y][x] = typeof g === 'undefined' ? true : Boolean(g);
      o.gfx.changed(x, y, 1, 1);
  	},
  	get: function(x, y) {
  		if ( (x > o.width-1 || x < 0) || (y > o.height-1 || y < 0) ) return false;
  		return o.board[y][x];
  	},
  	logic: function() { // A Game logic
  		var w = o.width, h = o.height;
  		var cpy = o.board.slice();
  		for (var c = 0; c < h; c++) {
	  	  	cpy[c] = cpy[c].slice();
	  	}

  		for (var y = 0; y < h; y++) {
	  	  	for (var x = 0; x < w; x++) {
	  	  	 	if (this.get(x, y)) { // Alive
		  	  	  	switch (o.logic.active_neighbors_num(x, y)) {
		  	  	  		case 0:
		  	  	  		case 1:
		  	  	  			cpy[y][x] = false; o.update.push(`${x} ${y}`);
			  	  	  		break;
			  	  	  	case 2:
			  	  	  	case 3:
			  	  	  		break; // Still alive
			  	  	  	default:
			  	  	  		cpy[y][x] = false; o.update.push(`${x} ${y}`);
			  	  	}
			  	} else { // Dead
			  		if (o.logic.active_neighbors_num(x, y) === 3) { // Born me!
			  			cpy[y][x] = true; o.update.push(`${x} ${y}`);
			  		}
			  	}
	  	  	}
  	  	}

  	  	o.board = cpy;
  	},
  	draw: function(silently) {
  		/*function random_color() {
  			return {
  				x: Math.floor(Math.random() * 1000 % 255),
  				y: Math.floor(Math.random() * 1000 % 255),
  				z: Math.floor(Math.random() * 1000 % 255),
  				str: function() { return `rgb(${this.x},${this.y},${this.z})` }
  			}.str();
  		}

  		var ctx = canvas.getContext('2d');
  		ctx.fillStyle = random_color();
  		ctx.fillRect(0,0,25,25);
  		// @TODO: Draw */
  		var ctx = cnv.getContext('2d'), w = o.width, h = o.height;
  		if (silently) {
        for (var y = 0; y < h; y++) {
  	  	  	for (var x = 0; x < w; x++) {
  	  	  	 	ctx.fillStyle = this.get(x, y) ? o.gfx.glow : o.gfx.unglow;
  	  	  	 	ctx.fillRect(x*10, y*10, 10, 10);
  	  	  	}
    	  }
      } else {
        o.update.forEach(function(pair) {
          pair = pair.split(' ');
          var x = parseFloat(pair[0]),
              y = parseFloat(pair[1]);
          ctx.fillStyle = this.get(x, y) ? o.gfx.glow : o.gfx.unglow;
          ctx.fillRect(x*10, y*10, 10, 10);
        }, this);
        o.update = [];
      }
  	},
  	step: function() {
  		this.logic();
  		this.draw();
  	},
    resize: function(w, h) {
      o.width = Math.floor(w);
      o.height = Math.floor(h);
    },
    getsize: function() {
      return [o.width, o.height];
    },
    runDemo: function(demo) {
      nsp.Game.demos[demo](this);
    }
  };
  return safe;
};

nsp.Game.demos = {
  'blinker+glider': function(game) {
    game.glow(5,4);
    game.glow(5,5);
    game.glow(5,6);

    game.glow(10,10);
    game.glow(11,10);
    game.glow(12,10);
    game.glow(10,11);
    game.glow(11,12);
  }
};

nsp.Game.runDemo = function(game, demo) {
  this.demos[demo](game);
};