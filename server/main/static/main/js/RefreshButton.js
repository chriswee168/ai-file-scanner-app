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
     */
    constructor(htmlElement, fileList, pathElement)
    {
        super(htmlElement);

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
        // Get CSRF token.
        let csrftoken = document.cookie.split("=")[1];

        console.log(document.cookie);

        // Indicate refreshing in progress.
        this.htmlElement.innerText = "REFRESHING...";

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

        // Restore original message.
        this.htmlElement.innerText = "REFRESH";

    }
}