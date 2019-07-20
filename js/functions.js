// Cria um novo Elemento
function newElement( tagName, className ) {
    const element = document.createElement( tagName );
    element.className = className;
    return element;
}

// Cria um cano como parametro se ele esta embaixo ou nao
function Pipe( isBottom = false ) {
    // Cria a div que vai conter os elementos do cano
    this.element       = newElement( 'div', 'pipe' );

    // Cria as partes do cano
    const pipeBorder   = newElement( 'div', 'border' );
    const pipeBody     = newElement( 'div', 'body' );

    // Adiciona a div "pipe" as partes do cano baseado na posicao Vertical do cano
    this.element.appendChild( isBottom ? pipeBody : pipeBorder );
    this.element.appendChild( isBottom ? pipeBorder : pipeBody );

    this.setPipeHeight = height => pipeBody.style.height = `${height}px`
}

// Cria a div e os canos que são contidas nela
// PipesArea( int <altura da div>, int <espaco vertical entre os canos>, int <posicao horizontal> );
function PipesArea( height, spaceBetween, Xposition ) {
    this.element     = newElement( 'div', 'pipes-area' );

    this.topPipe     = new Pipe( true );
    this.bottomPipe  = new Pipe( false );

    this.element.appendChild( this.topPipe.element )
    this.element.appendChild( this.bottomPipe.element )

    // "Randomiza" a altura dos canos
    this.randomSpaceBetween = () => {
        const topHight     = Math.random() * ( height - spaceBetween );
        const bottomHight  = height - spaceBetween - topHight;

        this.topPipe.setPipeHeight( topHight );
        this.bottomPipe.setPipeHeight( bottomHight );
    }

    // GETs
    this.getX = () => parseInt( this.element.style.left.split( 'px' )[0] );
    this.getWidth = () => this.element.clientWidth;
    
    // SETs
    this.setX = Xposition => this.element.style.left = `${Xposition}px`;
    
    // Configuracao inicial
    this.randomSpaceBetween();
    this.setX(Xposition);
}

// Classe que crias os canos
function PipeControler( height, Xposition, spaceBetween, pipesAreaDistance, triggerPoint ) {
    this.array = [
        new PipesArea( height, spaceBetween, Xposition ),
        new PipesArea( height, spaceBetween, Xposition + pipesAreaDistance ),
        new PipesArea( height, spaceBetween, Xposition + pipesAreaDistance * 2 ),
        new PipesArea( height, spaceBetween, Xposition + pipesAreaDistance * 3 )
    ]

    const step = 3;
    
    // Atualiza a posicao dos canos
    this.update = () => {
        this.array.forEach( pipeElement => {
            pipeElement.setX( pipeElement.getX() - step );

            if( pipeElement.getX() < -pipeElement.getWidth() ) {
                pipeElement.setX( pipeElement.getX() + pipesAreaDistance * this.array.length );
                pipeElement.randomSpaceBetween();
            }

            const center = Xposition/2;
            const centerCrossed = pipeElement.getX() + step >= center && pipeElement.getX() < center;

            centerCrossed && triggerPoint();
        })
    }
}

// Classe do passaro
function Bird( gameHeight ) {
    let flying = false;

    this.element = newElement( 'img', 'bird' );
    this.element.src = 'img/bird.png';

    this.getY = () => parseInt( this.element.style.bottom.split( 'px' )[0] );
    this.setY = y => this.element.style.bottom = `${y}px`;

    window.onkeydown = e => flying = true;
    window.onkeyup = e => flying = false;

    this.update = () => {
        const newPositionY = this.getY() + (flying ? 8 : -5);
        const maxHeight = gameHeight - this.element.clientHeight - 10;
    
        if( newPositionY >= maxHeight ) {
            this.setY(maxHeight);
        } else
            if( newPositionY <= 0 ) {
                this.setY( 0 );
        } else {
            this.setY( newPositionY );
        }
    }

    this.setY( gameHeight/2 );
}

// Classe da pontuação
function Scores() {
    this.element = newElement( 'span', 'score' );
    this.update = score => {
        this.element.innerHTML = score;
    }
    this.update(0);
}

// Funcação que checa se um objeto esta dentro do outro
function checkCollision( element1, element2 ) {
    const a = element1.getBoundingClientRect();
    const b = element2.getBoundingClientRect();

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left;
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top;

    return horizontal && vertical;
}


// Funcacao que efetiva a colisao
function collision( bird, pipes ) {
    let collision = false;
    pipes.array.forEach( pipeElement => {
        if ( !collision ) {
            const topPipe = pipeElement.topPipe.element;
            const bottomPipe = pipeElement.bottomPipe.element;
            collision = checkCollision( bird.element, topPipe )
                || checkCollision( bird.element, bottomPipe );
        }
    });
    
    return collision;
}