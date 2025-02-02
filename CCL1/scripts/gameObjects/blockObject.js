// Importujemy klasę bazową BaseGameObject i obiekt global zawierający dane gry
import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";

// Klasa BlockObject dziedziczy po BaseGameObject
class BlockObject extends BaseGameObject {
    // Flaga określająca, że obiekt blokuje siły grawitacji
    blockGravityForces = true;

    // Metoda reagująca na kolizję z innymi obiektami
    reactToCollision = function (collidingObject) {
        // Jeśli kolidujący obiekt ma nazwę "Character"
        if (collidingObject.name == "Character") {
            // Cofnij kolidujący obiekt do jego poprzedniej pozycji
            collidingObject.x = collidingObject.previousX;
            collidingObject.y = collidingObject.previousY;
        }
    }

    // Konstruktor klasy BlockObject
    constructor(x, y, width, height) {
        // Wywołujemy konstruktor klasy bazowej BaseGameObject, przekazując pozycję i wymiary
        super(x, y, width, height);

        // Ładujemy obraz dla tego obiektu (np. teksturę ściany)
        this.loadImages(["./images/wall.png"]);
    }
}

// Eksportujemy klasę BlockObject, aby można było jej używać w innych modułach
export { BlockObject };
