class Titlescreen {
    constructor({progress}) {
        this.progress = progress
    }

    getOptions(resolve) {
        const saveFile = this.progress.getSaveFile();
        return [
            saveFile ? {
                label: "Charger la partie",
                description: "Continue ton aventure",
                handler: () => {
                    this.close();
                    resolve(saveFile);
                }
            } : null,
            {
                label: "Nouvelle partie",
                description: "Commence une nouvelle aventure!",
                handler: () => {
                    this.close();
                    resolve();
                }
            },
            //maybe continue option here
        ].filter(v=>v); //if null, returns only array of 1
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("TitleScreen");
        this.element.innerHTML = (`<img class="TitleScreen_logo" src="img/victini.png">`)
    }

    close() {
        this.keyboardMenu.end();
        this.element.remove();
    }

    init(container) {
        return new Promise(resolve=> {
            this.createElement();
            container.appendChild(this.element);
            this.keyboardMenu = new KeyboardMenu();
            this.keyboardMenu.init(this.element);
            this.keyboardMenu.setOptions(this.getOptions(resolve))
        })
    }
}