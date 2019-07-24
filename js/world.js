function GameWorld() {
    let scores = 0;

    const gameArea = document.querySelector( '[game-area]' );
    const height = gameArea.clientHeight;
    const width = gameArea.clientWidth;

    const score = new Scores();
    const bird = new Bird( height );
    const pipes = new PipeControler( height, width, 230, 500,
        () => score.update( ++scores ));
    
    gameArea.appendChild( score.element );
    gameArea.appendChild( bird.element );
    pipes.array.forEach( pipeElement => gameArea.appendChild( pipeElement.element ));

    this.start = () => {
        const timer = setInterval( () => {
            pipes.update();
            bird.update();

            if( collision( bird, pipes ) ) {
                clearInterval( timer );
            }
        }, 1000/30 )
    }
}

new GameWorld().start();