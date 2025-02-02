// Importujemy klasę bazową BaseGameObject i obiekt global zawierający dane gry
import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";

// Klasa Flag dziedziczy po BaseGameObject
class Flag extends BaseGameObject {
    // Flaga określająca, że obiekt blokuje siły grawitacji
    blockGravityForces = true;

     // Metoda reagująca na kolizję z innymi obiektami
     reactToCollision = function (collidingObject) {
        // Jeśli kolidujący obiekt ma nazwę "Character"
        if (collidingObject.name == "Character") {
            // Zakończ grę po kolizji
            this.endGame();
        }
    }

    // Konstruktor klasy BlockObject
    constructor(x, y, width, height) {
        // Wywołujemy konstruktor klasy bazowej BaseGameObject, przekazując pozycję i wymiary
        super(x, y, width, height);

        // Ładujemy obraz dla tego obiektu (np. teksturę ściany)
        this.loadImages(["./images/flag.png"]);
    }
    endGame = function () {
        // Przekierowanie do strony zakończenia gry
        window.location.href = 'finishPage.html'; // Zmieniamy na stronę końcową
    }    
}


// Eksportujemy klasę BlockObject, aby można było jej używać w innych modułach
export { Flag };