
		class Pantofla
		{
			constructor()
			{
				this.x;
				this.y;
				this.pantoflaSpeed;

				this.exploded = false;
				
				this.minSpeed = 8;
				this.maxSpeed = 12;
				
				this.image = pantoflaImage;
				this.explosionImage = loadImage("game-assets/explosion-2.png");
				this.load();
			}
			
			load()
			{
				/* Re-used when falls off the screen (see if in display()) load() is called */
				
				this.x = Math.floor(Math.random() * 1200); // random X position
				this.pantoflaSpeed = Math.floor(Math.random() * (this.maxSpeed - this.minSpeed + 1) + this.minSpeed); // random speed between min and max speed
				this.y = 0;
				
				this.image = pantoflaImage;
				this.exploded = false;
			}
			
			display() 
			{
				image(this.image, this.x, this.y+= this.pantoflaSpeed);
				if (this.y > 640)
				{
					this.load();
					return true;
				}
			}
			
			explode()
			{
				if (!this.exploded)
				{
					this.exploded = true;
					this.image = this.explosionImage;
					this.explosionSoundPD();
					
					return true; // if explode returns true player loses a life
				}
			}
			
			explosionSoundPD()
			{
				Pd.send('collision', []);
			}
		}
		
		class Newspaper
		{
			constructor()
			{
				this.x;
				this.y;
				this.newspaperSpeed;

				this.exploded = false;
				
				this.minSpeed = 6;
				this.maxSpeed = 10;
				
				this.image = newspaperImage;
				this.explosionImage = loadImage("game-assets/explosion-2.png");
				this.load();
			}
			
			load()
			{
				/* Re-used when falls off the screen (see if in display()) load() is called */
				
				this.x = Math.floor(Math.random() * 1220); // random X position
				this.newspaperSpeed = Math.floor(Math.random() * (this.maxSpeed - this.minSpeed + 1) + this.minSpeed); // random speed between min and max speed
				this.y = 0;
				
				this.image = newspaperImage;
				this.exploded = false;
			}
			
			display() 
			{
				image(this.image, this.x, this.y+= this.newspaperSpeed);
				if (this.y > 640)
				{
					this.load();
					return true;
				}
			}
			
			explode()
			{
				if (!this.exploded)
				{
					this.exploded = true;
					this.image = this.explosionImage;
					this.explosionSoundPD();
					
					return true; // if explode returns true player loses a life
				}
			}
			
			explosionSoundPD()
			{
				Pd.send('collision', []);
			}
		}
		
		class CookieDrop
		{
			constructor()
			{
				this.x = 0;
				this.y = 0;
				this.image = loadImage(cookieType[cookieTypeCount]);
			}
			
			newCookieDrop(score)
			{
				if (score > 0 && this.y == 0) // y == 0 means no other cookie on the screen
				{
					let xR = Math.floor(Math.random() * 100);
					if ( xR == 1 )
					{
						console.log('Create a cookie');
						this.x = Math.floor(Math.random() * 1210); // random X position
						this.y = 0;
						this.image=loadImage(cookieType[Math.floor(Math.random() * cookieType.length)]);
						image(this.image, this.x, this.y++);
					}
				}
			}
			
			display()
			{
				if (this.y > 0) // if a cookieDrop exists it will be displayed
				{
					image(this.image, this.x, this.y+= 5);
					if (this.y > 640) // cookie is lost
					{
						this.y = 0;
					}
				}
			}
			
			checkForCollection(tereza) // if a cookie collides with tereza it is collected
			{
				//collision range:  -(cookie img width)+offset to +(tereza img width)-offset, offset=40
				if (Math.abs(this.x - tereza.x) < 90 && Math.abs(this.x - tereza.x) > -30 && this.y >= 400 && this.y <= 570)
				{
					this.y = 0; // cookie is taken - new cookie may be created
					//console.log('Cookie is collected!');
					Pd.send('collect', []);
					terezaLives.addLife();
				}	
			}
		}
		
		class PantoflaSwarm
		{
			constructor()
			{
				this.increaseDifficulty = 0; // as difficulty is increased more pantoflas will be coming
				this.pantoflas = []; // keeps the Pantofla instances
				this.pantoflasPassed = 0; // it is also used for score
			}
			
			reset()
			{
				this.pantoflas.length = 0;
				this.pantoflasPassed = 0;
				this.increaseDifficulty = 0;
			}
			
			addNewPantoflas(howMany)
			{
				for (let i = 0; i < howMany; i++)
				{
					let pantofla = new Pantofla();
					this.pantoflas.push(pantofla);
				}
			}
			
			handlePantoflas()
			{
				for (let i = 0; i < this.pantoflas.length; i++)
				{
					if (this.pantoflas[i].display()) // display() returns true if an pantofla falls of the canvas
					{
						this.pantoflasPassed++; // and the pantofla's passage is completed
					}
				}
				this.handleDifficulty();
				if (this.pantoflasPassed > 15)
				{
					level = 1;
				}
			}
			
			handleDifficulty()
			{
				// add pantoflas as difficulty increases
				if (this.pantoflas.length < (this.pantoflasPassed/30))
					this.addNewPantoflas(1);
			}
			
			checkForCollision(tereza)
			{
				for (let i = 0; i < this.pantoflas.length; i++)
				{
					//collision range:  -(pantofla img width)+offset to +(tereza img width)-offset, offset=22
					if (Math.abs(this.pantoflas[i].x - tereza.x) < 108 && Math.abs(this.pantoflas[i].x - tereza.x) > -158 && this.pantoflas[i].y >= 340 && this.pantoflas[i].y <= 620)
					{
						return this.pantoflas[i].explode();
					}
				}
			}
		}
		
		class NewspaperSwarm
		{
			constructor()
			{
				this.newspapers = [];
				this.newspapersPassed = 0;
				this.increaseDifficulty = -1;
			}
			
			reset()
			{
				this.newspapers.length = 0;
				this.newspapersPassed = 0;
				this.increaseDifficulty = -1;
			}
			
			addNewNewspapers(howMany)
			{
				for (let i = 0; i < howMany; i++)
				{
					let newspaper = new Newspaper();
					this.newspapers.push(newspaper);
				}
			}
			
			handleNewspapers()
			{
				for (let i = 0; i < this.newspapers.length; i++)
				{
					if (this.newspapers[i].display()) // display() returns true if a newspaper falls of the canvas
					{
						this.newspapersPassed++; // and the newspaper's passage is completed
					}
				}
				this.handleDifficulty();
			}
			
			handleDifficulty()
			{
				if ( level != 0 && this.newspapers.length < 1)
				{
					this.addNewNewspapers(1);
				} 
				else if ((this.newspapers.length+1) < (this.newspapersPassed/20))
				{
					this.addNewNewspapers(1);
				}
			}
			
			checkForCollision(tereza)
			{
				for (let i = 0; i < this.newspapers.length; i++)
				{
					//collision range:  -(newspaper img width)+offset to +(tereza img width)-offset, offset=10
					if (Math.abs(this.newspapers[i].x - tereza.x) < 120 && Math.abs(this.newspapers[i].x - tereza.x) > -140 && this.newspapers[i].y >= 420 && this.newspapers[i].y <= 620)
					{
						return this.newspapers[i].explode();
					}
				}
			}

		}
		
		class Tereza
		{
			x = 565; // X position
			y = 450; // Y position
			
			cookies = 0;
		
			constructor()
			{
				this.image = loadImage(terezaFrames[frameCount]);
			}
			
			display()
			{
				image(this.image, this.x, this.y);
			}
			
			move(move)
			{
				if (this.x > 0 && move < 0) // check that will not get out of the left barrier
				{
					this.x += (move*10);
				}

				if (this.x < 1170 && move > 0) // check that will not get out of the right barrier
				{
					this.x += (move*10);
				}
				
			}
			
			animate()
			{
				frameCount+=(1/3);
				
				if (frameCount >= terezaFrames.length)
				{
					frameCount = 0;
				}	
				this.image = loadImage(terezaFrames[Math.floor(frameCount)]);
			}

		}
		
		class TerezaLives
		{	
			constructor()
			{
				this.lives = [];
				this.livesLeft = 25; // initial number of lives
				
				for (let i = 0; i < this.livesLeft; i++)
				{
					let live = loadImage("game-assets/tereza.png");
					this.lives[i] = live;
				}
			}
			
			display()
			{
				this.showLives(this.livesLeft);
			}
			
			showLives(livesLeft)
			{
				for (let i = 0; i < livesLeft; i++)
				{
					image(this.lives[i], (i*50+12), 10); // defining the position of displayed objects
				}
			}
			
			loseLife()
			{
				this.livesLeft--;
			}
			
			addLife()
			{
				this.livesLeft++;
			}
			
			reset()
			{
				this.livesLeft = 3;
			}
		}
		
		/* Global variables */
		
		let terezaLives; // object of class TerezaLives
		let background; // background-image
		let tereza; // object of class Tereza
		let pantoflaImage; // load the image once
		let pantoflaSwarm; // object of class PantoflaSwarm
		let newspaperSwarm; // object of class PantoflaSwarm
		let newspaperImage; // load the image once
		let startGame = false;
		let startOnce = true;
		let gameOver = false;
		let paused = false;
		let level = 0;
		
/* 		let cookieImage; */
		let cookies = [];
		let cookieDrop;
		
		const terezaFrames = 
		[
			"game-assets/tereza_0.png",
			"game-assets/tereza_1.png",
		];
		
		const cookieType = 
		[
			"game-assets/cookie_1.png",
			"game-assets/cookie_2.png",
			"game-assets/cookie_3.png",
			"game-assets/cookie_4.png",
		];
		
		let frameCount = 0;
		let cookieTypeCount = 0;
		
		let gameSounds; // will load the pure data patch
		
		/*
			P5 functions preload(), setup(), draw() and keyPressed() are used
		*/
		function preload() 
		{
			background = loadImage("game-assets/bg-tiles.jpg");		// load the background-image
			pantoflaImage = loadImage("game-assets/pantofla.png"); // load once and the pass to Pantofla so that will not load each time an Pantofla is created
			newspaperImage = loadImage("game-assets/newspaper.png");
			tereza = new Tereza();
			
	/* 		cookieImage = loadImage("game-assets/cookie-2.png"); */
			cookieDrop = new CookieDrop();
			
			gameSounds 
			$.get('game-assets/pure-data-patches/game-patch.pd', function(patchStr) {
				gameSounds = Pd.loadPatch(patchStr);
			})
			
		}
		
		function setup() 
		{
			terezaLives = new TerezaLives();
			createCanvas(1280, 640);
			pantoflaSwarm = new PantoflaSwarm();
			newspaperSwarm = new NewspaperSwarm();	
			setupTouchScreenControls();		
		}
		
		function draw() 
		{
			/*
				Checking game state, drawing our game's frames, getting input
			*/
			image(background, 0, 0);
			tereza.display();
			terezaLives.display();
						
			showMessages(); // displays messages (if needed) depending on the game state
			
			drawTouchScreenControls();
			
			if (startGame && !gameOver && startOnce) // begin a new game
			{
				Pd.start();
				pantoflaSwarm.reset();
				pantoflaSwarm.addNewPantoflas(1);
				newspaperSwarm.reset();
				newspaperSwarm.addNewNewspapers(0);
//				Pd.send('blip',[]);
				terezaLives.reset();
				startOnce = false;
			}
			
			if (gameOver) // game over
			{
//				Pd.send('blip',[]);
//				Pd.stop(); // put in comments if you enable audio with confirm on page load
				tereza.cookies = 0;
				Pd.send('voc',[]);
			}
			
			
			if (!gameOver && startGame && !paused) // while the game is played
			{
				pantoflaSwarm.handlePantoflas(); // handle the pantoflas
				newspaperSwarm.handleNewspapers(); // handle the pantoflas
				
				if (pantoflaSwarm.checkForCollision(tereza)) // check for collisions - if any then loseLife
				{	
					terezaLives.loseLife();
				}
				
				if (newspaperSwarm.checkForCollision(tereza)) // check for collisions - if any then loseLife
				{	
					terezaLives.loseLife();
				} 
				
				if (terezaLives.livesLeft == 0) // defines the player loses 
					gameOver = true;
				
				if (keyIsDown(37)) // left arrow is pressed
				{
					tereza.move(-1);
					tereza.animate();
				}
				
				if (keyIsDown(39)) // right arrow is pressed
				{
					tereza.move(1);
					tereza.animate();
				}
				
				
				tereza.move(getTouchDirectionControl()); // get the touch controls - if any
				
				if (getTouchDirectionControl()==1 || getTouchDirectionControl()==-1) 
				{
					tereza.animate();
				}

				cookieDrop.newCookieDrop(pantoflaSwarm.pantoflasPassed);
				cookieDrop.display();
				cookieDrop.checkForCollection(tereza);
				
				for (let i = 0; i < cookies.length; i++)
				{
					if(!cookies[i].display())
					{
						cookies.splice(i,1);
						i--;
					}
				}
			}
		}
				
		function keyPressed()
		{		
			if (keyCode == 78) // n is pressed - New game
			{
				startGame = true;
				startOnce = true;
				gameOver = false;
				Pd.send('inst',[]);
			}
			
			if (keyCode == 80) // p for pause is pressed
			{
				if (startGame && !gameOver && !paused)
					paused = true;
				else if (startGame && !gameOver && paused)
					paused = false;			
			}
		}

		function showMessages()
		{
			textSize(30);
			text("Score: " + (pantoflaSwarm.pantoflasPassed+newspaperSwarm.newspapersPassed), 1100, 55); // Score is shown
		
			if (!startGame)
				rect(0, 100, 1280, 350); // rectangle (window) to show the message to start game
				
			if (gameOver)
				rect(0, 100, 1280, 350); // rectangle (window) to show the message game over and start game
			    
		
			textSize(50);
			if (!startGame || gameOver) // provide instructions
			{
				text('Press N to start new game.', 300, 200, 800, 200);
				textSize(25);
				text('Use the left and right arrows to avoid the obstacles.', 340, 290, 800, 200);
				text('Collect cookies to gain extra lives.', 340, 330, 800, 200);
			}
			
			if (gameOver)
			{
				textSize(50);
				text('Game over!', 500, 180);
			}
			
			if (paused)
			{
				textSize(50);
				text('Game paused!', 500, 280);
			}
		}
	
