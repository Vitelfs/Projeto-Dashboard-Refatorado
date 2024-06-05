import Firebase from "./firebase.js";

Firebase.getInstance().getAuth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "../../index.html";
    }
});
document.getElementById("btnLogout").addEventListener("click", (event) => {
    event.preventDefault();
    if (confirm("Tem certeza que deseja sair?")) {
        Firebase.getInstance().getAuth().signOut();
        window.location.href = "../../index.html";
    }
})