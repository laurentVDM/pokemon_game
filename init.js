(async function() {
    setTimeout(function(){
        const overworld = new Overworld( {
            element: document.querySelector(".game-container")
        });
        overworld.init();
    },3)
})
();