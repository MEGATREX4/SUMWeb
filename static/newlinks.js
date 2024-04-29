document.addEventListener("DOMContentLoaded", function() {
    const linkInputs = document.querySelectorAll("#link-section input[type='text']");
    const editLinkInputs = document.querySelectorAll("#editLinkSection input[type='text']");
    const maxLinks = 4;

    // Function to show additional link inputs
    function showNextLinkInput() {
        for (let i = 0; i < linkInputs.length - 1; i++) {
            if (linkInputs[i].value.trim() !== "") {
                if (linkInputs[i + 1].style.display === "none") {
                    linkInputs[i + 1].style.display = "block";
                    break;
                }
            }
        }
    }

    // Event listener for input events in link inputs
    linkInputs.forEach(function(input) {
        input.addEventListener("input", function() {
            showNextLinkInput();
        });
    });

    // Function to show additional edit link inputs 
    function showNextEditLinkInput() {
        for (let i = 0; i < editLinkInputs.length - 1; i++) {
            if (editLinkInputs[i].value.trim() !== "") {
                if (editLinkInputs[i + 1].style.display === "none") {
                    editLinkInputs[i + 1].style.display = "block";
                    break;
                }
            }
        }
    }

    // Function to show additional edit link inputs when editing
    function showEditLinkInputs() {
        editLinkInputs.forEach(function(input) {
            if (input.style.display === "none") {
                input.style.display = "block";
            }
        });
    }

    // Event listener for input events in edit link inputs
    editLinkInputs.forEach(function(input) {
        input.addEventListener("input", function() {
            showNextEditLinkInput();
        });
    });

    // Show additional edit link inputs after fetching elements
    showEditLinkInputs();
});
