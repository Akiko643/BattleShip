export const mapValidation = (map) => {
    if (map.length !== 10 || map[0].length !== 10) return "board not correct";

    let head = 0,
        expectedHead = 3;
    let piece = 0,
        expectedPiece = 27;
    const HEAD = 2,
        PIECE = 1;

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (map[i][j] === HEAD) head++;
            if (map[i][j] === PIECE) piece++;
        }
    }

    if (head !== expectedHead || piece !== expectedPiece)
        return "Battleships wrong!";
};

export const codeValidation = (code) => {};
