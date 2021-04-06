const botnames = ["Olav", "Iselin", "Magnus", "Mari", "Oliver", "Tobias"]

export const randomebot = () => {
    return botnames[Math.floor(Math.random() * botnames.length)];
}