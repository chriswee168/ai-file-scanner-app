import { Entry, List } from "./List.js";

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
     */
    constructor(modelListElement)
    {
        super(modelListElement);

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
                        "backgroundColor": "rgb(89, 89, 89)"
                    },
                    {
                        "backgroundColor": "rgb(34, 34, 34)"
                    }

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
     * @param {Record<string, string>} selectedStyle CSS styles if model entry is selected by user.
     * @param {Record<string, string>} unselectedStyle CSS styles if not selected by user.
     */
    constructor(modelList, element, selectedStyle, unselectedStyle)
    {
        super(modelList, element, selectedStyle, unselectedStyle);
    }
}