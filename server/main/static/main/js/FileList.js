/**
 * FileList contains a series of FileEntry classes, displaying
 * the list of all files available for selection, given local directory
 * path.
 */
export class FileList
{
    /**
     * Constructor.
     * 
     * @param {HTMLElement} fileListElement HTML element of file list.
     */
    constructor(fileListElement)
    {
        this.fileListElement = fileListElement;
        this.fileEntries = []; // Contains the list of FileEntry objects.

        // Reference to the entry object selected by the user.
        this.selectedEntry = null;
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
        this.fileEntries.forEach(entry => entry.element.remove());
        this.fileEntries.length = 0;

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
            this.fileListElement.appendChild(element);
            
            // Add entry to file list.
            this.fileEntries.push(
                new FileEntry(
                    this,
                    element,
                    metadata_list[i],
                    {
                        "color": "rgba(115, 255, 21, 1)"
                    },
                    {
                        "color": "rgba(255, 255, 255, 1)"
                    }

                )
            )
        }
    }
}

/**
 * Contains name of a selectable file and relevant references to other
 * objects for manipulating HTML page behaviour.
 */
class FileEntry
{
    /**
     * Constructor.
     * 
     * @param {FileList} fileList Reference to the parent file list object. 
     * @param {HTMLElement} element Div element of file entry.
     * @param {Object<string, any>} metadata Metadata of the file at filepath.
     * @param {Record<string, string>} selectedStyle CSS styles if file entry is selected by user.
     * @param {Record<string, string>} unselectedStyle CSS styles if not selected by user.
     */
    constructor(fileList, element, metadata, selectedStyle, unselectedStyle)
    {
        this.fileList = fileList;
        this.element = element;
        this.metadata = metadata;
        this.selected = false;
        this.selectedStyle = selectedStyle;
        this.unselectedStyle = unselectedStyle;

        // File entry is not selected by default.
        this.element.style.color = this.unselectedStyle["color"];

        // Add event listener for mouse click.
        this.element.addEventListener("click", () => this.onMouseClick());
    }

    /**
     * Called if file entry detects mouse click event from user.
     */
    onMouseClick()
    {
        // Change entry div style based on selected state.
        if (!this.selected)
        {
            this.element.style.color = this.selectedStyle["color"];
            if (this.fileList.selectedEntry != null)
            {
                // Set the previous selected entry to unavailable style.
                this.fileList.selectedEntry.element.style.color = 
                    this.unselectedStyle["color"];
                
                // Set previous selected entry selected attribute to false.
                this.fileList.selectedEntry.selected = false;
            }

            // Assign this entry's reference to the selected entry attribute in file list.
            this.fileList.selectedEntry = this;

            // Set current entry as true.
            this.selected = true;
        }
        else
        {
            // Pass.
        }
    }
}