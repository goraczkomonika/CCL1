import { global } from "./global.js"; // Importowanie modułu global.js, który przechowuje globalne zmienne i funkcje.

function move(event) { // Funkcja odpowiadająca za poruszanie się gracza na podstawie naciśniętego klawisza.

    switch (event.key) { // Sprawdzenie, który klawisz został naciśnięty.
        case "d": // Jeśli klawisz "d" (ruch w prawo).
            if (global.playerObject.xVelocity == 0) // Jeśli gracz obecnie się nie porusza w osi X.
                global.playerObject.switchCurrentSprites(4, 7); // Zmiana animacji postaci na ruch w prawo.
            global.playerObject.xVelocity = 200; // Ustawienie prędkości gracza w osi X na 200 (ruch w prawo).
            global.playerObject.yVelocity = 0; // Ustawienie prędkości w osi Y na 0 (brak ruchu w pionie).
            console.log("velocity set"); // Wypisanie informacji w konsoli (opcjonalne).
            break;

        case "a": // Jeśli klawisz "a" (ruch w lewo).
            if (global.playerObject.xVelocity == 0) // Jeśli gracz obecnie się nie porusza w osi X.
                global.playerObject.switchCurrentSprites(0, 3); // Zmiana animacji postaci na ruch w lewo.
            global.playerObject.xVelocity = -200; // Ustawienie prędkości gracza w osi X na -200 (ruch w lewo).
            global.playerObject.yVelocity = 0; // Ustawienie prędkości w osi Y na 0 (brak ruchu w pionie).
            break;

        case "w": // Jeśli klawisz "w" (skok).
            global.playerObject.setJumpForce(0.95); // Ustawienie siły skoku gracza na 0.8 (skok w górę).
            break;
    }
}

function stop(event) { // Funkcja zatrzymująca ruch gracza po puszczeniu klawisza.
    switch (event.key) {
        case "d": // Jeśli puszczono klawisz "d" (ruch w prawo).
            global.playerObject.xVelocity = 0; // Zatrzymanie ruchu w osi X.
            break;

        case "a": // Jeśli puszczono klawisz "a" (ruch w lewo).
            global.playerObject.xVelocity = 0; // Zatrzymanie ruchu w osi X.
            break;
    }
}

// Dodanie nasłuchiwania naciśnięcia klawisza (keypress) i przypisanie funkcji `move`.
document.addEventListener("keypress", move);

// Dodanie nasłuchiwania puszczenia klawisza (keyup) i przypisanie funkcji `stop`.
document.addEventListener("keyup", stop);