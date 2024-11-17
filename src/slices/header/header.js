let menu_icon_box = document.querySelector(".menu_icon_box");
        let box = document.querySelector(".box");

        menu_icon_box.onclick = function () {
            menu_icon_box.classList.toggle("active");
            box.classList.toggle("active");
        }

        document.body.onclick = e => {
            if (!menu_icon_box.contains(e.target) && !box.contains(e.target)) {
                menu_icon_box.classList.remove("active");
                box.classList.remove("active");
            }
        }