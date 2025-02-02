// Importujemy klasę bazową `BaseGameObject` z pliku "baseGameObject.js"
import { BaseGameObject } from "./baseGameObject.js";

// Importujemy obiekt globalny `global` z modułu "global.js"
import { global } from "../modules/global.js";

// Definiujemy klasę `Floor`, która dziedziczy po `BaseGameObject`
class Floor extends BaseGameObject {
    // Nazwa obiektu, nadpisanie właściwości z klasy bazowej
    name = "Floor";

    // Flaga, która wskazuje, że siły grawitacyjne nie powinny działać na ten obiekt
    blockGravityForces = true;

    // Metoda odpowiedzialna za rysowanie obiektu (obecnie pusta)
    draw = function () {
        // W tym miejscu można zaimplementować rysowanie obiektu na ekranie
    }

    // Konstruktor klasy `Floor`, który przyjmuje współrzędne x, y oraz szerokość i wysokość
    constructor(x, y, width, height) {
        // Wywołujemy konstruktor klasy bazowej `BaseGameObject`, przekazując odpowiednie parametry
        super(x, y, width, height);
    }
}

// Eksportujemy klasę `Floor`, aby mogła być używana w innych plikach
export { Floor };
