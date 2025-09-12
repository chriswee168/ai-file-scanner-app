import {ActionButton} from "./ActionButton.js";
import { FileList } from "./FileList.js";

/**
 * Class to define behaviour for refresh button responsible for
 * updating the list of files available for user selection.
 */
export class RefreshButton extends ActionButton
{
    /**
     * Constructor.
     * 
     * @param {HTMLElement} htmlElement HTML element of refresh button.
     * @param {FileList} fileList FileList object.
     * @param {HTMLElement} pathElement HTML element of directory path.
     * @param {Object<string, string>} availableStyle Styles to apply to button when available.
     * @param {Object<string, string>} unavailableStyle Styles to apply to button when unavailable.
     * @param {Object<string, string>} buttonTexts Button text to use when refresh button is pressed 
     * and original text message.
     */
    constructor(
        htmlElement, fileList, pathElement, availableStyle, unavailableStyle, buttonTexts 
    )
    {
        super(htmlElement, availableStyle, unavailableStyle, buttonTexts);

        // Refresh button is enabled by default.
        this.setAvailability(true);

        // File list element to send filepaths to.
        this.fileList = fileList;

        // Directory to path.
        this.pathElement = pathElement;

        // Add event listener for mouse click.
        this.htmlElement.addEventListener("click", () => this.actionOnClick());
    }

    /**
     * Method to execute when refresh button is clicked by the user.
     */
    async actionOnClick()
    {
        if (this.available)
        {
            // Disable refresh button.
            this.setAvailability(false);

            // Get CSRF token.
            let csrftoken = document.cookie.split("=")[1];

            console.log(document.cookie);

            // Pass directory path to server.
            let dir_path = this.pathElement.innerText;
            let response = await fetch(
                "/main/file-list/",
                {
                    body: JSON.stringify({"dir_path": dir_path}),
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'X-CSRFToken': csrftoken
                    }
                }
            );

            if (!response.ok)
            {
                console.log(response.statusText, response.status);
            }

            // Send filepaths to file list.
            let data = await response.json();
            let filepaths = data.filepaths;
            let metadatas = data.metadatas;
            this.fileList.refreshFileEntries(filepaths, metadatas);

            // Reset availability to true.
            this.setAvailability(true);
        }
        else
        {
            // pass.
        }
    }
}