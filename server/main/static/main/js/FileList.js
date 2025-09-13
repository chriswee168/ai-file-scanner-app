import { Entry, List } from "./List.js";
import { ModelList } from "./ModelList.js";
import { ScanButton } from "./ScanButton.js";

/**
 * FileList contains a series of FileEntry classes, displaying
 * the list of all files available for selection, given local directory
 * path.
 */
export class FileList extends List
{
    /**
     * Constructor.
     * 
     * @param {HTMLElement} listElement HTML element of file list.
     * @param {HTMLElement} metadataTextElement HTML element of metadata text box.
     * @param {Object<string, string>} entrySelectedStyle CSS styles if model entry is selected by user.
     * @param {Object<string, string>} entryUnselectedStyle CSS styles if not selected by user.
     * @param {Object<string, string>} entryMouseOverStyle CSS styles if mouse is moved over entry.
     */
    constructor(listElement, metadataTextElement, entrySelectedStyle, entryUnselectedStyle, entryMouseOverStyle)
    {
        super(listElement, entrySelectedStyle, entryUnselectedStyle, entryMouseOverStyle);

        this.metadataTextElement = metadataTextElement;
    }

    /**
     * Set scan button attribute.
     * 
     * @param {ScanButton} scanButtonObj Scan button object.
     */
    linkScanButton(scanButtonObj)
    {
        this.scanButtonObj = scanButtonObj;
    }

    /**
     * Set model list attribute.
     * 
     * @param {ModelList} modelListObj Model list object.
     */
    linkModelList(modelListObj)
    {
        this.modelListObj = modelListObj;
    }

    /**
     * Create file entry objects when refresh button is clicked.
     * @param {Array<string>} path_list 
     * @param {Array<Object<string, any>>} metadata_list
     */
    refreshFileEntries(path_list, metadata_list)
    {
        console.log(path_list);
        console.log(metadata_list);
        // Remove entries if they exist.
        this.entries.forEach(entry => entry.element.remove());
        this.entries.length = 0;

        // Create file entries objects for the child divs in file list
        // HTML element.
        for (let i = 0; i < path_list.length; i++)
        {
            // Create new div element for filepath.
            let element = document.createElement("div");
            element.innerHTML = path_list[i];

            // Disable highlighting for file entries.
            element.style.userSelect = "none";

            // Add file element to file list element.
            this.listElement.appendChild(element);

            // Set colour to use when entry is selected based on type.
            let colour;
            if (metadata_list[i].type == "folder")
            {
                colour = "rgb(255, 255, 255)";
            }
            else if (metadata_list[i].type == "file")
            {
                colour = "rgb(115, 255, 21)";
            }
            
            // Add entry to file list.
            this.entries.push(
                new FileEntry(
                    this,
                    element,
                    metadata_list[i],
                    this.metadataTextElement,
                    this.entrySelectedStyle,
                    this.entryUnselectedStyle,
                    this.entryMouseOverStyle,
                    this.scanButtonObj,
                    this.modelListObj
                )
            )
        }
    }
}

/**
 * Contains name of a selectable file and relevant references to other
 * objects for manipulating HTML page behaviour.
 */
class FileEntry extends Entry
{
    /**
     * Constructor.
     * 
     * @param {FileList} list Reference to the parent file list object. 
     * @param {HTMLElement} element Div element of file entry.
     * @param {Object<string, any>} metadata Metadata of the file at filepath.
     * @param {HTMLElement} metadataTextElement HTML element to metadata textbox.
     * @param {Object<string, string>} selectedStyle CSS styles if file entry is selected by user.
     * @param {Object<string, string>} unselectedStyle CSS styles if not selected by user.
     * @param {Object<string, string>} mouseOverStyle CSS styles if mouse is moved over entry.
     * @param {ScanButton} scanButtonObj Scan button object.
     * @param {ModelList} modelListObj Model list object.
     */
    constructor(
        list, element, metadata, metadataTextElement, selectedStyle, unselectedStyle,
        mouseOverStyle, scanButtonObj, modelListObj
    )
    {
        super(list, element, selectedStyle, unselectedStyle, mouseOverStyle);
        this.metadata = metadata;
        this.metadataTextElement = metadataTextElement;
        this.scanButtonObj = scanButtonObj;
        this.modelListObj = modelListObj;

        this.element.addEventListener("click", () => this.setMetadata());
        this.element.addEventListener("click", () => this.setScanButtonStatus());
    }

    /**
     * Called if file entry detects mouse click event from user.
     */
    setMetadata()
    {
        // Display metadata of file selected.
        this.metadataTextElement.innerText = `
            Name: ${this.metadata.name}
            Type: ${this.metadata.type}
            Absolute path: ${this.metadata.absolute_path}
            Size (bytes): ${this.metadata.size}
            Last created: ${this.metadata.last_created}
            Last accessed: ${this.metadata.last_accessed}
            Last modified: ${this.metadata.last_modified}`
    }

    /**
     * Set scan button availability when clicked.
     */
    setScanButtonStatus()
    {
        // If user has selected an AI model.
        if (this.modelListObj.selectedEntry != null)
        {
            // Obtain the context length of the model (last string separated by underscore).
            let modelName = this.modelListObj.selectedEntry.element.innerText;
            let contextLen = parseInt(modelName.split("_").at(-1));
            
            // Scanning is only allowed if number of bytes in the file
            // is at least the context length of the model selected.
            if (this.metadata.size >= contextLen)
            {
                this.scanButtonObj.setAvailability(true);
            }
            else
            {
                this.scanButtonObj.setAvailability(false);
            }
        }
        else // If no AI model selected yet.
        {
            // pass.
        }
    }
}