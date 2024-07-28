document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('start-game-btn');
    const appContainer = document.getElementById('app');
    const gameContainer = document.getElementById('game');
    let completedTasksCount = 0;

    document.getElementById('add-task-btn').addEventListener('click', addTask);
    document.getElementById('show-completed').addEventListener('change', toggleCompletedTasks);

    function addTask() {
        const taskInput = document.getElementById('new-task');
        const taskText = taskInput.value.trim();
        
        if (taskText !== '') {
            const taskList = document.getElementById('task-list');
            
            const li = document.createElement('li');
            li.className = 'task';
            
            const span = document.createElement('span');
            span.textContent = taskText;
            span.addEventListener('click', () => {
                li.classList.toggle('completed');
                if (li.classList.contains('completed')) {
                    completedTasksCount++;
                    showCongratsMessage();
                    checkCompletedTasks();
                } else {
                    completedTasksCount--;
                }
                filterTasks();
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '削除';
            deleteBtn.addEventListener('click', () => {
                if (li.classList.contains('completed')) {
                    completedTasksCount--;
                }
                taskList.removeChild(li);
                checkCompletedTasks();
            });
            
            li.appendChild(span);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
            
            taskInput.value = '';
        }
    }

    function toggleCompletedTasks() {
        filterTasks();
    }

    function filterTasks() {
        const showCompleted = document.getElementById('show-completed').checked;
        const tasks = document.querySelectorAll('.task');
        
        tasks.forEach(task => {
            if (task.classList.contains('completed')) {
                task.style.display = showCompleted ? 'flex' : 'none';
            }
        });
    }

    function showCongratsMessage() {
        const messages = ["おめでとう!", "よくやった!", "素晴らしい!", "やったね!"];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const congratsMessageElement = document.getElementById('congrats-message');
        
        congratsMessageElement.textContent = randomMessage;
        congratsMessageElement.classList.remove('hidden');
        
        setTimeout(() => {
            congratsMessageElement.classList.add('hidden');
        }, 3000); // 3秒後にメッセージを非表示にする
    }

    function checkCompletedTasks() {
        if (completedTasksCount >= 5) {
            startGameButton.classList.remove('hidden');
        } else {
            startGameButton.classList.add('hidden');
        }
    }

    startGameButton.addEventListener('click', () => {
        appContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        startGame();
    });

    function startGame() {
        phina.globalize();

        var SCREEN_WIDTH    = 640;
        var SCREEN_HEIGHT   = 960;
        var MAX_PER_LINE    = 8;
        var BLOCK_NUM       = MAX_PER_LINE * 5;
        var BLOCK_SIZE      = 64;
        var BOARD_PADDING   = 50;
        var PADDLE_WIDTH    = 150;
        var PADDLE_HEIGHT   = 32;
        var BALL_RADIUS     = 16;
        var BALL_SPEED      = 16;

        var BOARD_SIZE      = SCREEN_WIDTH - BOARD_PADDING * 2;
        var BOARD_OFFSET_X  = BOARD_PADDING + BLOCK_SIZE / 2;
        var BOARD_OFFSET_Y  = 150;

        phina.define("MainScene", {
          superClass: 'DisplayScene',

          init: function(options) {
            this.superInit(options);

            this.scoreLabel = Label('0').addChildTo(this);
            this.scoreLabel.x = this.gridX.center();
            this.scoreLabel.y = this.gridY.span(1);
            this.scoreLabel.fill = 'white';

            this.group = DisplayElement().addChildTo(this);

            var gridX = Grid(BOARD_SIZE, MAX_PER_LINE);
            var gridY = Grid(BOARD_SIZE, MAX_PER_LINE);

            var self = this;

            (BLOCK_NUM).times(function(i) {
              var xIndex = i % MAX_PER_LINE;
              var yIndex = Math.floor(i / MAX_PER_LINE);
              var angle = (360) / BLOCK_NUM * i;
              var block = Block(angle).addChildTo(this.group).setPosition(100, 100);

              block.x = gridX.span(xIndex) + BOARD_OFFSET_X;
              block.y = gridY.span(yIndex) + BOARD_OFFSET_Y;
            }, this);

            this.ball = Ball().addChildTo(this);

            this.paddle = Paddle().addChildTo(this);
            this.paddle.setPosition(this.gridX.center(), this.gridY.span(15));
            this.paddle.hold(this.ball);

            this.ballSpeed = 0;
            this.one('pointend', function() {
              this.paddle.release();
              this.ballSpeed = BALL_SPEED;
            });

            this.score = 0;
            this.time = 0;
            this.combo = 0;
          },

          update: function(app) {
            this.time += app.deltaTime;

            this.paddle.x = app.pointer.x;
            if (this.paddle.left < 0) {
              this.paddle.left = 0;
            }
            if (this.paddle.right > this.gridX.width) {
              this.paddle.right = this.gridX.width;
            }

            (this.ballSpeed).times(function() {
              this.ball.move();
              this.checkHit();
            }, this);

            if (this.group.children.length <= 0) {
              this.gameclear();
            }
          },

          checkHit: function() {
            var ball = this.ball;

            if (ball.left < 0) {
              ball.left = 0;
              ball.reflectX();
            }
            if (ball.right > this.gridX.width) {
              ball.right = this.gridX.width;
              ball.reflectX();
            }
            if (ball.top < 0) {
              ball.top = 0;
              ball.reflectY();
            }
            if (ball.bottom > this.gridY.width) {
              ball.bottom = this.gridY.width;
              ball.reflectY();
              this.gameover();
            }

            if (ball.hitTestElement(this.paddle)) {
              ball.bottom = this.paddle.top;

              var dx = ball.x - this.paddle.x;
              ball.direction.x = dx;
              ball.direction.y = -80;
              ball.direction.normalize();

              this.ballSpeed += 1;

              this.combo = 0;
            }

            this.group.children.some(function(block) {
              if (ball.hitTestElement(block)) {
                var dq = Vector2.sub(ball, block);

                if (Math.abs(dq.x) < Math.abs(dq.y)) {
                  ball.reflectY();
                  if (dq.y >= 0) {
                    ball.top = block.bottom;
                  } else {
                    ball.bottom = block.top;
                  }
                } else {
                  ball.reflectX();
                  if (dq.x >= 0) {
                    ball.left = block.right;
                  } else {
                    ball.right = block.left;
                  }
                }

                block.remove();

                this.combo += 1;
                this.score += this.combo * 100;

                var c = ComboLabel(this.combo).addChildTo(this);
                c.x = this.gridX.span(12) + Math.randint(-50, 50);
                c.y = this.gridY.span(12) + Math.randint(-50, 50);

                return true;
              }
            }, this);
          },

          gameclear: function() {
            var bonus = 2000;
            this.score += bonus;

            var seconds = (this.time / 1000).floor();
            var bonusTime = Math.max(60 * 10 - seconds, 0);
            this.score += bonusTime * 10;

            this.gameover();
          },

          gameover: function() {
            this.exit({
              score: this.score,
            });
          },

          _accessor: {
            score: {
              get: function() {
                return this._score;
              },
              set: function(v) {
                this._score = v;
                this.scoreLabel.text = v;
              },
            },
          },
        });

        phina.define('Block', {
          superClass: 'RectangleShape',

          init: function(angle) {
            this.superInit({
              width: BLOCK_SIZE,
              height: BLOCK_SIZE,
              fill: 'hsl({0}, 80%, 60%)'.format(angle || 0),
              stroke: null,
              cornerRadius: 8,
            });
          },
        });

        phina.define('Ball', {
          superClass: 'CircleShape',

          init: function() {
            this.superInit({
              radius: BALL_RADIUS,
              fill: '#eee',
              stroke: null,
              cornerRadius: 8,
            });

            this.speed = 0;
            this.direction = Vector2(1, -1).normalize();
          },

          move: function() {
            this.x += this.direction.x;
            this.y += this.direction.y;
          },

          reflectX: function() {
            this.direction.x *= -1;
          },
          reflectX: function() {
            this.direction.x *= -1;
          },
          reflectY: function() {
            this.direction.y *= -1;
          },
        });
        
        /*
         * パドル
         */
        phina.define('Paddle', {
          superClass: 'RectangleShape',
          init: function() {
            this.superInit({
              width: PADDLE_WIDTH,
              height: PADDLE_HEIGHT,
              fill: '#eee',
              stroke: null,
              cornerRadius: 8,
            });
          },
        
          hold: function(ball) {
            this.ball = ball;
          },
        
          release: function() {
            this.ball = null;
          },
        
          update: function() {
            if (this.ball) {
              this.ball.x = this.x;
              this.ball.y = this.top-this.ball.radius;
            }
          }
        });
        
        /*
         * コンボラベル
         */
        phina.define('ComboLabel', {
          superClass: 'Label',
          init: function(num) {
            this.superInit(num + ' combo!');
        
            this.stroke = 'white';
            this.strokeWidth = 8;
        
            if (num < 5) {
              this.fill = 'hsl(40, 60%, 60%)';
              this.fontSize = 16;
            }
            else if (num < 10) {
              this.fill = 'hsl(120, 60%, 60%)';
              this.fontSize = 32;
            }
            else {
              this.fill = 'hsl(220, 60%, 60%)';
              this.fontSize = 48;
            }
        
            this.tweener
              .by({
                alpha: -1,
                y: -50,
              })
              .call(function() {
                this.remove();
              }, this);
          },
        });
        
        phina.main(function() {
          var app = GameApp({
            title: 'Breakout',
            startLabel: location.search.substr(1).toObject().scene || 'title',
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            backgroundColor: '#444',
            autoPause: true,
            append: document.getElementById('phina-game-container'),
            debug: false,
          });
        
          app.enableStats();
        
          app.run();
        });
            
    }
});