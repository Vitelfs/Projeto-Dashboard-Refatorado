function mobileMenuShow(menu){
    menu.classList.toggle('open');
    if (sidebar.style.width == "330px")
    {
        sidebar.style.width = "10px";
        menu.classList.remove('open');
    }

    else
    {
        sidebar.style.width = "330px";
    }

    window.addEventListener('click', function(e){
        if (!sidebar.contains(e.target) && (!document.getElementById('logo').contains(e.target))){
        sidebar.style.width = "10px";
        menu.classList.remove('open');
      } 
    })
}