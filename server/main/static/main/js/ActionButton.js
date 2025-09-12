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
     */
    constructor(htmlElement)
    {
        this.available = false;
        this.htmlElement = htmlElement;

        // [backgroundColor, textColor, mouseOverBackgroundColor].
        this.availableStyle = [
            "rgb(8, 98, 0)", "rgb(255, 255, 255)", "rgb(5, 60, 0)"
        ];
        this.unavailableStyle = [
            "rgb(98, 0, 0)", "rgb(255, 255, 255)", "rgb(63, 0, 0)"
        ];

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
            this.htmlElement.style.backgroundColor = this.availableStyle[0];
            this.htmlElement.style.color = this.availableStyle[1];
        }
        else
        {
            this.htmlElement.style.backgroundColor = this.unavailableStyle[0];
            this.htmlElement.style.color = this.unavailableStyle[1];
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
            this.htmlElement.style.backgroundColor = this.availableStyle[2];
        }
        else
        {
            this.htmlElement.style.backgroundColor = this.unavailableStyle[2];
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
            this.htmlElement.style.backgroundColor = this.availableStyle[0];
        }
        else
        {
            this.htmlElement.style.backgroundColor = this.unavailableStyle[0];
        }
    }
}