/**
 * ProgressBar manages behaviour of all progress bar elements
 * and their labels.
 */
export class ProgressBar
{
    /**
     * Constructor
     * 
     * @param {HTMLElement} labelElement HTML element for progress bar label.
     * @param {HTMLElement} barElement HTML element for progress bar itself.
     * @param {string} labelMsg The message to display for labelElement.
     */
    constructor(labelElement, barElement, labelMsg)
    {
        this.labelElement = labelElement;
        this.barElement = barElement;
        this.labelMsg = labelMsg;
    }

    /**
     * Setter method for current and max value of progress bar.
     * 
     * @param {number} value Value to set the progress bar at.
     * @param {number} maxValue Maximum possible value the progress bar can be set at.
     */
    setValue(value, maxValue)
    {
        // Update the progress bar's current and max values.
        this.barElement.value = value;
        this.barElement.max = maxValue;
        
        // Calculate percentage of bar.
        let percent = Math.round((value / maxValue) * 100);

        // Convert percentage to string and pad to three digits.
        let percentStr = percent.toString().padStart(3, "0");

        // Update the progress bar label.
        this.labelElement.innerText = this.labelMsg + `: ${percentStr}% `
    }
}