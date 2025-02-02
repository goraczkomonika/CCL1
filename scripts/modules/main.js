// Importowanie modułów zawierających globalne zmienne, klasy i funkcjonalności obiektów gry.
import { global } from "./global.js"; // Globalne zmienne i funkcje pomocnicze
import { Character } from "../gameObjects/character.js"; // Klasa gracza (lub postaci w grze)
import { MoveTrigger } from "../gameObjects/moveTrigger.js"; // Klasa odpowiedzialna za wyzwalacze ruchu
import { BlockObject } from "../gameObjects/blockObject.js"; // Klasa obiektu blokującego (np. przeszkoda)
import { Floor } from "../gameObjects/floor.js"; // Klasa podłogi (platformy)
import {Flag} from "../gameObjects/flag.js"


// Funkcja głównej pętli gry, która działa w nieskończoność dzięki requestAnimationFrame
function gameLoop(totalRunningTime) {
    // Obliczanie "deltaTime", czyli czasu (w sekundach) pomiędzy klatkami gry
    global.deltaTime = totalRunningTime - global.prevTotalRunningTime; // Czas w milisekundach od poprzedniej klatki
    global.deltaTime /= 1000; // Konwersja milisekund na sekundy
    global.prevTotalRunningTime = totalRunningTime; // Zapis aktualnego czasu na potrzeby kolejnej klatki

    // Czyszczenie obszaru rysowania (canvas) w celu przygotowania go do nowej klatki
    global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height);

    // Iteracja po wszystkich obiektach gry w tablicy global.allGameObjects
    for (var i = 0; i < global.allGameObjects.length; i++) {
        // Sprawdzenie, czy dany obiekt jest aktywny (jeśli nie, pomijamy go)
        if (global.allGameObjects[i].active == true) {
            // Zapisywanie pozycji obiektu z poprzedniej klatki (na potrzeby detekcji kolizji)
            global.allGameObjects[i].storePositionOfPreviousFrame();
            // Aktualizacja logiki obiektu (np. ruch, interakcje)
            global.allGameObjects[i].update();
            // Sprawdzanie kolizji tego obiektu z innymi
            global.checkCollisionWithAnyOther(global.allGameObjects[i]);
            // Zastosowanie grawitacji (jeśli dotyczy obiektu)
            global.allGameObjects[i].applyGravity();
            // Rysowanie obiektu na canvasie
            global.allGameObjects[i].draw();
        }
    }

    // Wywołanie pętli gry na kolejną klatkę
    requestAnimationFrame(gameLoop);
}

// Funkcja odpowiedzialna za inicjalizację gry (tworzenie obiektów gry i ich rozmieszczenie)
function setupGame() {
    // Tworzenie gracza (postać na pozycji x=300, y=0, o wymiarach 64x64)
    global.playerObject = new Character(150, 0, 53, 64);
    // Tworzenie wyzwalacza ruchu po lewej stronie (x=100, y=100, szerokość=20, wysokość=900, prędkość=100)
    // global.leftMoveTrigger = new MoveTrigger(100, 100, 20, 900, 100);
    // // Tworzenie wyzwalacza ruchu po prawej stronie (x=800, y=100, szerokość=20, wysokość=900, prędkość=-100)
    // global.rightMoveTrigger = new MoveTrigger(800, 100, 20, 900, -100);
    // Tworzenie podłogi (platformy) na pozycji x=0, y=400, o szerokości 9000 i wysokości 40
    //new Floor(0, 600, 9000, 40);
    // Tworzenie obiektu blokującego (przeszkody) na pozycji x=200, y=280, o wymiarach 50x50
    new BlockObject(100, 600, 200, 60);
    new BlockObject(100, 400, 200, 60);
    new BlockObject(300, 200, 200, 60);
    new BlockObject(450, 400, 200, 60);
    new BlockObject(600, 600, 200, 60);
    new BlockObject(700, 200, 200, 60);
    new BlockObject(900, 500, 200, 60);
    new BlockObject(1200, 400, 200, 60);
    new BlockObject(1300, 250, 200, 60);
    new Flag (1390, 165, 60, 90)

    // Przykładowe inne obiekty (zakomentowane)
    // new BlockObject(300, 400, 50, 50);

    // W tym miejscu można dodać inne obiekty gry, np.:
    /*
        global.playerObject = new PacMan(200, 300, 60, 60); // Gracz typu PacMan
        new Wall(0, 0, 100, 100); // Ściana
        new Candy(100, 100, 100, 100); // Obiekt "cukierka"
    */
}

// Wywołanie funkcji inicjalizującej grę (ustawienia początkowe)
setupGame();
// Uruchomienie pętli gry
requestAnimationFrame(gameLoop);