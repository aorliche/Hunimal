
window.addEventListener('load', function() {
    // Pressing "Hide" anchor gets rid of navbar, and pressing "Show Menu" anchor makes it visible again
    
    let navbar = document.querySelector("#navbar");
    let showHideA = document.querySelector("#show-hide-a");
    let header = document.querySelector("body > h1");
    let body = document.querySelector("body");
	let main = document.querySelector("#main");
    
    let hideText = "Hide Menu";
    let showText = "Show Menu";

	// Show the hunimal logo on the header
	
	const hImg = document.createElement("img");
	hImg.src = "/image/H.png";
	hImg.style.height = "40px";
	hImg.style.paddingRight = "10px";
	header.insertBefore(hImg, header.childNodes[0]);

	// Bug with scroll bar appearing
	const headerHTML = header.innerHTML;

    function adjustHeaderWidth() {
        header.style.width = "0px";
		header.innerHTML = '';
        setTimeout(adjustHeaderWidth2, 0);
    }
    
    function adjustHeaderWidth2() {
		const style = window.getComputedStyle(main);
		const width = parseInt(style.getPropertyValue("width"));
		header.innerHTML = headerHTML;
		if (showHideA.innerText == showText) {
			header.style.width = width - 238 + "px";	
		} else {
			header.style.width = width + 42 + "px";
		}
    }
    
    adjustHeaderWidth();
    
    window.addEventListener("resize", function (e) {
        adjustHeaderWidth();
    }, false);
    
    showHideA.addEventListener("click", function (e) {
        if (showHideA.innerText == hideText) {
            navbar.style.display = "none";
            showHideA.innerText = showText;
            adjustHeaderWidth();
        } else {
            navbar.style.display = "block";
            showHideA.innerText = hideText;
            adjustHeaderWidth();
        }
    }, false);
    
    // Add new and under construction graphics to navbar links
	// Now on all
    
    let asNew = document.querySelectorAll("a[data-new]");
    for (let i=0; i<asNew.length; i++) {
        let im = document.createElement("img");
        im.src = "/image/new.png";
        asNew[i].appendChild(im);
    }
    
    let asConst = navbar.querySelectorAll("a[data-under-construction]");
    for (let i=0; i<asConst.length; i++) {
        let im = document.createElement("img");
        im.src = "/image/under_construction.png";
        asConst[i].appendChild(im);
    }

}, false);
