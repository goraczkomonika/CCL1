const global = {}; // Tworzenie obiektu globalnego, który będzie przechowywał dane gry i funkcje.

global.canvas = document.querySelector("#canvas"); // Pobranie elementu <canvas> z DOM i przypisanie go do global.canvas.
global.ctx = canvas.getContext("2d"); // Uzyskanie kontekstu 2D do rysowania na canvas.
global.prevTotalRunningTime = 0; // Przechowuje całkowity czas działania gry od momentu uruchomienia.
global.deltaTime = 0; // Przechowuje czas, jaki upłynął między klatkami (delta czasu).
global.allGameObjects = []; // Tablica przechowująca wszystkie obiekty gry.
global.playerObject = {}; // Obiekt reprezentujący gracza.
global.backgroundShift = 0; // Przesunięcie tła w osi X.
global.backgroundMaxShift = -600; // Maksymalne przesunięcie tła (np. w celu ograniczenia przesuwania).
global.gravityForce = 9.8; // Stała siła grawitacji, używana do obliczeń ruchu.
global.pixelToMeter = 100; // Współczynnik konwersji pikseli na metry w grze.
global.leftMoveTrigger; // Flaga lub zmienna przechowująca stan ruchu w lewo.
global.rightMoveTrigger; // Flaga lub zmienna przechowująca stan ruchu w prawo.

global.getCanvasBounds = function () {
    // Funkcja zwracająca granice canvas jako obiekt z właściwościami: left, right, top, bottom.
    let bounds = {
        "left": 0,
        "right": this.canvas.width, // Szerokość canvas (prawa granica).
        "top": 0,
        "bottom": this.canvas.height // Wysokość canvas (dolna granica).
    }

    return bounds; // Zwracanie obiektu z granicami canvas.
}

global.checkCollisionWithAnyOther = function (givenObject) {
    // Funkcja sprawdzająca kolizję danego obiektu z innymi obiektami.
    for (let i = givenObject.index; i < global.allGameObjects.length; i++) {
        let otherObject = global.allGameObjects[i]; // Pobranie innego obiektu z tablicy.
        if (otherObject.active == true) { // Sprawdzenie, czy obiekt jest aktywny (np. widoczny, istnieje).
            let collisionHappened = this.detectBoxCollision(givenObject, otherObject); // Sprawdzenie kolizji.
            if (collisionHappened) {
                givenObject.reactToCollision(otherObject); // Reakcja danego obiektu na kolizję.
                otherObject.reactToCollision(givenObject); // Reakcja drugiego obiektu na kolizję.
            }
        }
    }
}

global.detectBoxCollision = function (gameObject1, gameObject2) {
    // Funkcja sprawdzająca kolizję pomiędzy dwoma obiektami przy użyciu ich granic.
    let box1 = gameObject1.getBoxBounds(); // Pobranie granic pierwszego obiektu.
    let box2 = gameObject2.getBoxBounds(); // Pobranie granic drugiego obiektu.
    if (gameObject1 != gameObject2) { // Unikanie sprawdzania kolizji tego samego obiektu ze sobą.
        if (box1.top <= box2.bottom &&  // Warunek kolizji: góra pierwszego obiektu poniżej dołu drugiego.
            box1.left <= box2.right && // Lewa krawędź pierwszego obiektu przed prawą krawędzią drugiego.
            box1.bottom >= box2.top && // Dół pierwszego obiektu powyżej góry drugiego.
            box1.right >= box2.left)  // Prawa krawędź pierwszego obiektu za lewą krawędzią drugiego.
        {
            return true; // Kolizja wystąpiła.
        }
    }
    return false; // Brak kolizji.
}

export { global }; // Eksportowanie obiektu global, aby można go było używać w innych modułach.