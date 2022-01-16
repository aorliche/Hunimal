const color1 = "#6d9eeb";
const color2 = "#6aa84f";
const color3 = "#aaa";

let tmpl = document.createElement("template");

tmpl.innerHTML = `
<style>
.check-button {
    background-color: ${color2};
    color: #fff;
	border: 1px solid blue;
    padding: 10px 15px 10px 15px;
    display: inline-block;
}
.check-button:hover {
    background-color: ${color1};
    cursor: pointer;
}
.checked, .checked:hover  {
    background-color: ${color1};
}
.disabled, .disabled:hover {
    background-color: ${color3};
    cursor: auto;
}
</style>
<div class='check-button'>
    <slot></slot>
</div>
`;

class CheckButton extends HTMLElement {
    // is selected or on
    get checked() {
        return this.hasAttribute('checked');
    }
    
    set checked(val) {
        // disabled buttons cannot be checked
        if (this.disabled) {
            return;
        }
        if (val) {
            this.setAttribute('checked', '');
            // checking one button unchecks all other ones
            let buttons = document.querySelectorAll("check-button[name='" + this.name + "']");
            for (let i=0; i<buttons.length; i++) {
                if (buttons[i] !== this) {
                    buttons[i].checked = false;
                }
            }
        } else {
            this.removeAttribute('checked');
        }
    }
    
    // greyed out
    get disabled() {
        return this.hasAttribute('disabled');
    }
    
    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }
    
    // like a name in a radio button input: check box group
    get name() {
        return this.getAttribute('name');
    }
    
    set name(val) {
        this.setAttribute(name, val);
    }
    
    // constructor and methods
    constructor() {
        super();
        
        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        
        this.div = shadowRoot.querySelector('div');
        
        // select or deselect
        this.addEventListener("click", function(e) {
            // check if disabled
            if (this.disabled) {
                return;
            }
            // check if already selected
            // cannot deselect selected for now
            if (this.checked) {
                return;
            }
            // set this to checked (also unchecks any other buttons)
            this.checked = true;
            // fire change event
            this.dispatchEvent(new Event('change', {source: this}));
        }, false);
    }
    
    static get observedAttributes() {
        return ['checked', 'disabled'];
    }
    
    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'checked') {
            if (this.hasAttribute('checked')) {
                this.div.classList.add("checked");
            } else {
                this.div.classList.remove("checked");
            }
        } else if (name === 'disabled') {
            if (this.hasAttribute('disabled')) {
                this.div.classList.add("disabled");
            } else {
                this.div.classList.remove("disabled");
            }
        }
    }
}

window.customElements.define("check-button", CheckButton);
