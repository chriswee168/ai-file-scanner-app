import { Entry, List } from "./List.js";
import { FileList } from "./FileList.js";

/**
 * ModelList contains a series of ModelEntry classes, displaying
 * the list of AI models available for selection.
 */
export class ModelList extends List
{
    /**
     * Constructor.
     * 
     * @param {HTMLElement} modelListElement HTML element of model list.
     * @param {ScanButton} scanButtonObj Scan button object.
     * @param {FileList} fileListObj File list object.
     */
    constructor(modelListElement, scanButtonObj, fileListObj)
    {
        super(modelListElement);

        this.scanButtonObj = scanButtonObj;
        this.fileListObj = fileListObj;

        // Initialize the model entry objects.
        this.initModelEntries();
    }

    /**
     * Create model entry objects based on child.
     */
    initModelEntries()
    {
        // Create model entries objects for the child divs in model list
        // HTML element.
        for (let element of this.listElement.children)
        {
            this.entries.push(
                new ModelEntry(
                    this,
                    element,
                    {
                        "color": "white",
                        "backgroundColor": "rgb(89, 89, 89)",
                    },
                    {
                        "color": "black",
                        "backgroundColor": "rgb(206, 206, 206)"
                    },
                    this.fileListObj,
                    this.scanButtonObj
                )
            )
        }
    }
}

/**
 * Contains name of a selectable AI model and relevant references to other
 * objects for manipulating HTML page behaviour.
 */
class ModelEntry extends Entry
{
    /**
     * Constructor.
     * 
     * @param {ModelList} modelList Reference to the parent model list object. 
     * @param {HTMLElement} element Div element of model entry.
     * @param {Object<string, string>} selectedStyle CSS styles if model entry is selected by user.
     * @param {Object<string, string>} unselectedStyle CSS styles if not selected by user.
     * @param {ScanButton} scanButtonObj Scan button object.
     * @param {FileList} fileListObj File list object.
     */
    constructor(modelList, element, selectedStyle, unselectedStyle, fileListObj, scanButtonObj)
    {
        super(modelList, element, selectedStyle, unselectedStyle);

        this.fileListObj = fileListObj;
        this.scanButtonObj = scanButtonObj;

        this.element.addEventListener("click", () => this.setScanButtonStatus());
    }

    /**
     * Set scan button availability when clicked.
     */
    setScanButtonStatus()
    {
        // If user has selected a file.
        if (this.fileListObj.selectedEntry != null)
        {
            // Obtain the size of the file in bytes.
            let fileSizeBytes = this.fileListObj.selectedEntry.metadata.size;
            
            // Get context length of entry's model.
            let contextLen = parseInt(this.element.innerText.split("_").at(-1));
            
            // Scanning is only allowed if number of bytes in the file
            // is at least the context length of the model selected.
            if (fileSizeBytes >= contextLen)
            {
                this.scanButtonObj.setAvailability(true);
            }
            else
            {
                this.scanButtonObj.setAvailability(false);
            }
        }
        else // If user hasn't selected a file yet.
        {
            // pass.
        }
    }
}