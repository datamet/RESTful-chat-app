const botnames = ["Olav", "Iselin", "Magnus", "Mari", "Oliver", "Tobias"];
const password = ["Olav1234", "Iselin1234", "Magnus1234", "Mari1234", "Oliver1234", "Tobias1234"];

export const randomebot = () => {
    const i = Math.floor(Math.random() * botnames.length)
    return {
        username: botnames[i],
        password: password[i]
    };
}