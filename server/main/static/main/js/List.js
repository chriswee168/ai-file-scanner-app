/**
 * Parent class for List objects
 */
export class List
{
    /**
     * Constructor.
     * 
     * @param {HTMLElement} listElement HTML element of div.
     * @param {Object<string, string>} entrySelectedStyle CSS styles if model entry is selected by user.
     * @param {Object<string, string>} entryUnselectedStyle CSS styles if not selected by user.
     * @param {Object<string, string>} entryMouseOverStyle CSS styles if mouse is moved over entry.
     */
    constructor(listElement, entrySelectedStyle, entryUnselectedStyle, entryMouseOverStyle)
    {
        this.listElement = listElement;
        this.entries = []; // Contains the list of Entry objects.

        // Reference to the entry object selected by the user.
        this.selectedEntry = null;

        // Styles of list entries.
        this.entrySelectedStyle = entrySelectedStyle;
        this.entryUnselectedStyle = entryUnselectedStyle;
        this.entryMouseOverStyle = entryMouseOverStyle;
    }
}

/**
 * Parent class for Entry objects to be contained by List object.
 */
export class Entry
{
    /**
     * Constructor.
     * 
     * @param {List} list Reference to the parent list object. 
     * @param {HTMLElement} element Div element of entry.
     * @param {Record<string, string>} selectedStyle CSS styles if entry is selected by user.
     * @param {Record<string, string>} unselectedStyle CSS styles if not selected by user.
     * @param {Record<string, string>} mouseOverStyle CSS styles if mouse is moved over entry.
     */
    constructor(list, element, selectedStyle, unselectedStyle, mouseOverStyle)
    {
        this.list = list;
        this.element = element;
        this.selected = false;
        this.selectedStyle = selectedStyle;
        this.unselectedStyle = unselectedStyle;
        this.mouseOverStyle = mouseOverStyle;

        // File entry is not selected by default.
        this.element.style.color = this.unselectedStyle["color"];
        this.element.style.backgroundColor = this.unselectedStyle["backgroundColor"];

        // Add event listener for mouse click.
        this.element.addEventListener("click", () => this.onMouseClick());

        // Change entry style on mouseover/mouseleave.
        this.element.addEventListener("mouseover", () => this.onMouseOver());
        this.element.addEventListener("mouseleave", () => this.onMouseLeave());
    }

    /**
     * Called if entry detects mouse click event from user.
     */
    onMouseClick()
    {
        // Change entry div style based on selected state.
        if (!this.selected)
        {
            this.element.style.color = this.selectedStyle["color"];
            this.element.style.backgroundColor = this.selectedStyle["backgroundColor"];
            
            if (this.list.selectedEntry != null)
            {
                // Set the previous selected entry to unavailable style.
                this.list.selectedEntry.element.style.color = 
                    this.unselectedStyle["color"];
                this.list.selectedEntry.element.style.backgroundColor = 
                    this.unselectedStyle["backgroundColor"];
                
                // Set previous selected entry selected attribute to false.
                this.list.selectedEntry.selected = false;
            }

            // Assign this entry's reference to the selected entry attribute in file list.
            this.list.selectedEntry = this;

            // Set current entry as true.
            this.selected = true;
        }
        else
        {
            // Pass.
        }
    }

    /**
     * Change entry style if user moves cursor over entry.
     */
    onMouseOver()
    {
        // Only apply if not selected.
        if (!this.selected)
        {
            this.element.style.color = this.mouseOverStyle.color;
            this.element.style.backgroundColor = this.mouseOverStyle.backgroundColor;
        }
    }

    /**
     * Reset entry style if user moves cursor away from entry.
     */
    onMouseLeave()
    {
        // Only apply if not selected.
        if (!this.selected)
        {
            this.element.style.color = this.unselectedStyle.color;
            this.element.style.backgroundColor = this.unselectedStyle.backgroundColor;
        }
    }
}