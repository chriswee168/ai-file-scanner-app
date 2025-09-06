/**
 * ResultReceiver is responsible for receiving the byte chunk predictions made
 * by the AI model on server.
 */
export class ResultReceiver
{
    /**
     * Constructor.
     * 
     * @param {HTMLELement} chunkProgBarElement HTML progress bar that indicates how many
     *  byte chunks have been scanned by AI model on server.
     * @param {NodeListOf<Element>} classProgBarElements Collection of HTML progress bars
     * to indicate the number of byte chunks belonging to each class.
     * [cleanBar, warningBar, maliciousBar]
     */
    constructor(chunkProgBarElement, classProgBarElements)
    {
        this.chunkProgBarElement = chunkProgBarElement;
        this.classProgBarElements = classProgBarElements;
    }

    /**
     * Method to start server side event to receive continuous predictions
     * of byte chunks from the AI model on server.
     * 
     * @param {Object<string, string>} data Contains the filepath of selected file
     * and the name of the AI model.
     */
    async startStream(data)
    {
         // Get CSRF token.
        let csrftoken = document.cookie.split("=")[1];

        let response = await fetch(
            "/main/prediction-conf/",
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "ContentType": "application/json",
                    "X-CSRFToken": csrftoken
                }

            }
        )
    }
}