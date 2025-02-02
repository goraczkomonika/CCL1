import { global } from "../modules/global.js"

// Klasa bazowa dla obiektów w grze
class BaseGameObject {
    // Domyślne właściwości obiektu
    active = true; // Czy obiekt jest aktywny
    name = ""; // Nazwa obiektu
    x = 100; // Pozycja na osi X
    y = 500; // Pozycja na osi Y
    previousX = 0; // Pozycja X w poprzedniej klatce
    previousY = 0; // Pozycja Y w poprzedniej klatce
    width = 50; // Szerokość obiektu
    height = 50; // Wysokość obiektu
    useGravityForces = false; // Czy obiekt podlega grawitacji
    blockGravityForces = false; // Czy obiekt blokuje działanie grawitacji (np. podłoże)
    prevFallingVelocity = 0; // Prędkość opadania z poprzedniej klatki
    index = -1; // Indeks obiektu w globalnej tablicy obiektów

    // Dane fizyczne obiektu
    physicsData = {
        "fallVelocity": 0, // Prędkość opadania
        "terminalVelocity": 53, // Prędkość graniczna
        "jumpForce": 0, // Siła skoku
        "prevFallingVelocity": 0, // Poprzednia prędkość opadania
        "jumpForceDecay": 2, // Tempo spadku siły skoku
        "isGrounded": false // Czy obiekt dotyka podłoża
    }

    // Dane animacyjne obiektu
    animationData = {
        "animationSprites": [], // Tablica ze sprite'ami animacji
        "timePerSprite": 0.08, // Czas trwania jednego sprite'a
        "currentSpriteElapsedTime": 0, // Czas od wyświetlenia obecnego sprite'a
        "firstSpriteIndex": 0, // Pierwszy sprite w animacji
        "lastSpriteIndex": 0, // Ostatni sprite w animacji
        "currentSpriteIndex": 0 // Aktualny sprite do wyświetlenia
    };

    // Zapisywanie pozycji z poprzedniej klatki
    storePositionOfPreviousFrame = function () {
        this.previousX = this.x;
        this.previousY = this.y;
    };

    // Pobranie granic (bounding box) obiektu
    getBoxBounds = function () {
        let bounds = {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        }
        return bounds;
    };

    // Metoda do aktualizacji logiki obiektu (do nadpisania w klasach potomnych)
    update = function () {

    };

    // Zastosowanie grawitacji na obiekt
    applyGravity = function () {
        if (!this.useGravityForces) // Jeśli obiekt nie podlega grawitacji, zakończ
            return;

        // Obliczanie prędkości opadania na podstawie siły grawitacji
        this.physicsData.fallVelocity += global.gravityForce * global.deltaTime * global.pixelToMeter;

        // Logika skoku
        if (this.physicsData.jumpForce > 0) {
            if (this.physicsData.isGrounded == true) {
                this.physicsData.fallVelocity = 0; // Reset prędkości opadania po skoku
            }
            this.physicsData.isGrounded = false;
            this.physicsData.fallVelocity -= (global.gravityForce * global.deltaTime * global.pixelToMeter) * 2;
            this.physicsData.jumpForce -= this.physicsData.jumpForceDecay * global.deltaTime;
            this.physicsData.jumpForce = Math.max(0, this.physicsData.jumpForce);
            if (this.physicsData.fallVelocity > 0 || this.physicsData.jumpForce == 0) {
                this.physicsData.jumpForce = 0;
            }
        }

        // Ograniczenie prędkości opadania do prędkości granicznej
        if (this.physicsData.fallVelocity > this.physicsData.terminalVelocity * global.pixelToMeter) {
            this.physicsData.fallVelocity = this.physicsData.terminalVelocity * global.pixelToMeter;
        }

        // Aktualizacja pozycji na podstawie prędkości opadania
        this.y += (this.physicsData.fallVelocity * global.deltaTime + this.physicsData.prevFallingVelocity) / 2;
        this.physicsData.prevFallingVelocity = this.physicsData.fallVelocity * global.deltaTime;

        // Wykrywanie kolizji z innymi obiektami
        for (let i = 0; i < global.allGameObjects.length; i++) {
            let otherObject = global.allGameObjects[i];
            if (otherObject.active == true && otherObject.blockGravityForces == true) {
                let collisionHappened = global.detectBoxCollision(this, otherObject);
                if (collisionHappened) {
                    if (this.physicsData.fallVelocity > 0) { // Kolizja z podłożem
                        this.physicsData.isGrounded = true;
                        this.y = otherObject.getBoxBounds().top - this.height - (this.getBoxBounds().bottom - (this.y + this.height)) - 0.1;
                    }
                    else if (this.physicsData.fallVelocity < 0) { // Kolizja od góry
                        this.y = otherObject.getBoxBounds().bottom + 0.1;
                    }
                    this.physicsData.jumpForce = 0;
                    this.physicsData.fallVelocity = 0;
                }
            }
        }
    };

    // Ustawienie siły skoku
    setJumpForce = function (jumpForce) {
        if (this.physicsData.isGrounded == true) {
            this.physicsData.jumpForce = jumpForce;
        }
    };

    // Rysowanie obiektu
    draw = function () {
        let sprite = this.getNextSprite();
        global.ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
    };

    // Pobranie kolejnego sprite'a animacji
    getNextSprite = function () {
        this.animationData.currentSpriteElapsedTime += global.deltaTime;

        if (this.animationData.currentSpriteElapsedTime >= this.animationData.timePerSprite) {
            this.animationData.currentSpriteIndex++;
            this.animationData.currentSpriteElapsedTime = 0;
            if (this.animationData.currentSpriteIndex > this.animationData.lastSpriteIndex) {
                this.animationData.currentSpriteIndex = this.animationData.firstSpriteIndex
            }
        }
        return this.animationData.animationSprites[this.animationData.currentSpriteIndex];
    };

    // Ładowanie obrazów do animacji
    loadImages = function (imageSources) {
        for (let i = 0; i < imageSources.length; i++) {
            let image = new Image();
            image.src = imageSources[i];
            this.animationData.animationSprites.push(image);
        }
    };

    // Ładowanie obrazów ze sprite sheet
    loadImagesFromSpritesheet(spritesheetPath, cols, rows) {
        // Obliczanie ilości wierszy i kolumn
        const totalSprites = cols * rows;

        // Przygotowanie tablicy na sprite'y
        this.animationData.animationSprites = Array.from({ length: totalSprites }, () => new Image());

        const spritesheet = new Image();
        spritesheet.src = spritesheetPath;

        spritesheet.addEventListener("load", () => {
            const spritesheetWidth = spritesheet.width;
            const spritesheetHeight = spritesheet.height;
            const singleSpriteWidth = Math.floor(spritesheetWidth / cols);
            const singleSpriteHeight = Math.floor(spritesheetHeight / rows);

            // Wycinek sprite'ów z wykorzystaniem tymczasowego canvasu
            const tempSpritesheetCanvas = document.createElement("canvas");
            const tempSpritesheetCtx = tempSpritesheetCanvas.getContext("2d");
            tempSpritesheetCanvas.width = singleSpriteWidth;
            tempSpritesheetCanvas.height = singleSpriteHeight;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    tempSpritesheetCtx.clearRect(0, 0, singleSpriteWidth, singleSpriteHeight);
                    tempSpritesheetCtx.drawImage(
                        spritesheet,
                        col * singleSpriteWidth,
                        row * singleSpriteHeight,
                        singleSpriteWidth,
                        singleSpriteHeight,
                        0,
                        0,
                        singleSpriteWidth,
                        singleSpriteHeight
                    );

                    const index = row * cols + col;
                    this.animationData.animationSprites[index].src = tempSpritesheetCanvas.toDataURL();
                }
            }
        });
    }

    // Zmiana zakresu aktualnej animacji
    switchCurrentSprites = function (firstSpriteIndex, lastSpriteIndex) {
        this.animationData.currentSpriteIndex = firstSpriteIndex;
        this.animationData.firstSpriteIndex = firstSpriteIndex;
        this.animationData.lastSpriteIndex = lastSpriteIndex;
    }

    // Reakcja na kolizję (do nadpisania)
    reactToCollision = function (collidingObject) {

    }

    // Konstruktor obiektu
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.previousX = x;
        this.previousY = y;
        global.allGameObjects.push(this); // Dodanie obiektu do globalnej tablicy
        this.index = global.allGameObjects.length - 1; // Ustawienie indeksu
    }

}

export { BaseGameObject }
