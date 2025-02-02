// Importowanie klasy bazowej i modułów globalnych
import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";

// Definicja klasy Character, która rozszerza BaseGameObject
class Character extends BaseGameObject {
    // Nazwa obiektu
    name = "Character";

    // Prędkości ruchu obiektu w kierunku osi X i Y
    xVelocity = 0;
    yVelocity = 0;

    // Zmienna kontrolująca czy obiekt powinien podlegać grawitacji
    useGravityForces = true;

    // Funkcja obliczająca granice (bounding box) obiektu
    getBoxBounds = function () {
        // Zwraca obiekt z granicami: lewą, prawą, górną i dolną
        let bounds = {
            left: this.x + 18,             // Lewa granica (przesunięcie w prawo)
            right: this.x + this.width - 22, // Prawa granica (przesunięcie w lewo)
            top: this.y + 14,              // Górna granica (przesunięcie w dół)
            bottom: this.y + this.height - 3 // Dolna granica (przesunięcie w górę)
        }
        return bounds;
    }

    // Funkcja aktualizująca stan obiektu (np. pozycję) na każdej klatce gry
    update = function () {
        // Aktualizowanie pozycji w osi X i Y na podstawie prędkości i czasu
        this.x += this.xVelocity * global.deltaTime;
        this.y += this.yVelocity * global.deltaTime;

        // Jeśli prędkość w osi X wynosi 0, zmienia animację na statyczną
        if (this.xVelocity == 0) {
            global.playerObject.switchCurrentSprites(this.animationData.firstSpriteIndex, this.animationData.firstSpriteIndex);
        }
        this.screenWrap();
    }

    screenWrap = function () {
        const canvasBounds = global.getCanvasBounds();
        const bounds = this.getBoxBounds();

        if (bounds.left >= canvasBounds.right) {
            this.x = canvasBounds.left;
        } else if (bounds.right <= canvasBounds.left) {
            this.x = canvasBounds.right - this.width;
        } else if (bounds.bottom <= canvasBounds.top) {
            this.y = canvasBounds.bottom;
        } else if (bounds.top >= canvasBounds.bottom) {
            this.y = canvasBounds.top - this.height;
        }
    }
    // Konstruktor, który ustawia pozycję i rozmiar obiektu oraz ładuje odpowiednie obrazy
    constructor(x, y, width, height) {
        // Wywołanie konstruktora klasy bazowej
        super(x, y, width, height);

        // Ładowanie obrazków z arkusza sprite'ów (sprite sheet)
        this.loadImagesFromSpritesheet("../images/sprite2.webp", 4, 2);
    }
}

// Eksportowanie klasy Character, aby była dostępna w innych częściach aplikacji
export { Character };
