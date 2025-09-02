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

        this.availableStyle = ["rgb(8, 98, 0)", "rgb(255, 255, 255)"];
        this.unavailableStyle = ["rgb(98, 0, 0)", "rgb(255, 255, 255)"];
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
}