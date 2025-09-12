/**
 * Parent class for action buttons, define default functions for
 * setting availability status.
 */
export class ActionButton
{
    /**
     * Constructor.
     * 
     * @param {HTMLElement} htmlElement HTML div element representing button.
     * @param {Object<string, string>} availableStyle Styles to apply to button when available.
     * @param {Object<string, string>} unavailableStyle Styles to apply to button when unavailable.
     */
    constructor(htmlElement, availableStyle, unavailableStyle)
    {
        this.available = false;
        this.htmlElement = htmlElement;

        this.availableStyle = availableStyle;
        this.unavailableStyle = unavailableStyle;

        // Listen for mouser over and leave events.
        this.htmlElement.addEventListener("mouseover", () => this.onMouseOver());
        this.htmlElement.addEventListener("mouseleave", () => this.onMouseLeave());
    }

    /**
     * Get status of action button availability.
     * 
     * @returns Boolean for whether action button is usable.
     */
    getAvailability()
    {
        return this.available;
    }

    /**
     * Manually set the availability status of action button.
     * 
     * @param {boolean} available Set availability of button.
     */
    setAvailability(available)
    {
        if (available)
        {
            this.htmlElement.style.backgroundColor = this.availableStyle.backgroundColor;
            this.htmlElement.style.color = this.availableStyle.color;
        }
        else
        {
            this.htmlElement.style.backgroundColor = this.unavailableStyle.backgroundColor;
            this.htmlElement.style.color = this.unavailableStyle.color;
        }
        this.available = available;
    }

    /**
     * Change background colour on mouse over event. Use colour depending
     * on availability state.
     */
    onMouseOver()
    {
        if (this.available)
        {
            this.htmlElement.style.backgroundColor = this.availableStyle.mouseOverBackgroundColor;
        }
        else
        {
            this.htmlElement.style.backgroundColor = this.unavailableStyle.mouseOverBackgroundColor;
        }
    }

    /**
     * Reset the background colour on mouse leave event. Use colour depending
     * on availability state.
     */
    onMouseLeave()
    {
        if (this.available)
        {
            this.htmlElement.style.backgroundColor = this.availableStyle.backgroundColor;
        }
        else
        {
            this.htmlElement.style.backgroundColor = this.unavailableStyle.backgroundColor;
        }
    }
}